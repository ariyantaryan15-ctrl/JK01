/* BluMeal server — tanpa dependensi (hanya modul bawaan Node.js >= 18)
   - Menyajikan file statis (index.html, style.css, script.js, images/)
   - Akun email + kata sandi (scrypt), sesi via cookie HttpOnly
   - Data profil & catatan makan disimpan per akun di data/db.json
   Jalankan:  node server.js   (lalu buka http://localhost:3000)            */
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const SESSION_DAYS = 30;
const MAX_BODY = 1024 * 1024; // 1 MB
const COOKIE = "blumeal_sid";

// ---------------------------------------------------------------- DB (file JSON, tulis atomik)
fs.mkdirSync(DATA_DIR, { recursive: true });
let db = { users: {}, sessions: {} };
try { db = { ...db, ...JSON.parse(fs.readFileSync(DB_FILE, "utf8")) }; } catch { /* db baru */ }

// Akun demo: demo@blumeal.id / demo1234. Dibuat otomatis dan DIRESET setiap kali login,
// jadi selalu mulai dari profil kosong (state null) dan data tidak bocor antar pengunjung.
const DEMO = "demo@blumeal.id";
if (!db.users[DEMO]) {
  const salt = crypto.randomBytes(16).toString("hex");
  db.users[DEMO] = { salt, hash: crypto.scryptSync("demo1234", salt, 64).toString("hex"), created: new Date().toISOString(), state: null };
  fs.writeFileSync(DB_FILE, JSON.stringify(db), { mode: 0o600 });
}

let writing = Promise.resolve();
function persist() {
  writing = writing.then(async () => {
    const tmp = DB_FILE + ".tmp";
    await fs.promises.writeFile(tmp, JSON.stringify(db), { mode: 0o600 });
    await fs.promises.rename(tmp, DB_FILE);
  }).catch((e) => console.error("Gagal menyimpan db:", e));
  return writing;
}

// ---------------------------------------------------------------- Util
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");
const hashPw = (pw, salt) => crypto.scryptSync(pw, salt, 64).toString("hex");
const emailOk = (e) => typeof e === "string" && e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

function send(res, code, obj, headers = {}) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > MAX_BODY) { reject(Object.assign(new Error("too large"), { code: 413 })); req.destroy(); return; }
      chunks.push(c);
    });
    req.on("end", () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}")); }
      catch { reject(Object.assign(new Error("bad json"), { code: 400 })); }
    });
    req.on("error", reject);
  });
}

function cookieOf(req, name) {
  const m = (req.headers.cookie || "").split(";").map((s) => s.trim()).find((s) => s.startsWith(name + "="));
  return m ? decodeURIComponent(m.slice(name.length + 1)) : null;
}

function sessionCookie(req, token, maxAge) {
  const secure = req.headers["x-forwarded-proto"] === "https" || req.socket.encrypted ? "; Secure" : "";
  return `${COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secure}`;
}

function currentUser(req) {
  const token = cookieOf(req, COOKIE);
  if (!token) return null;
  const s = db.sessions[sha(token)];
  if (!s) return null;
  if (s.exp < Date.now()) { delete db.sessions[sha(token)]; persist(); return null; }
  return db.users[s.email] ? { email: s.email, user: db.users[s.email] } : null;
}

function startSession(req, email) {
  const token = crypto.randomBytes(32).toString("hex");
  const now = Date.now();
  for (const [k, s] of Object.entries(db.sessions)) if (s.exp < now) delete db.sessions[k]; // bersihkan sesi kedaluwarsa
  db.sessions[sha(token)] = { email, exp: now + SESSION_DAYS * 864e5 };
  return sessionCookie(req, token, SESSION_DAYS * 86400);
}

// Pembatasan percobaan login/daftar per IP (10 kali / 10 menit)
const attempts = new Map();
function tooMany(ip) {
  const now = Date.now();
  const a = (attempts.get(ip) || []).filter((t) => now - t < 600000);
  a.push(now); attempts.set(ip, a);
  return a.length > 10;
}

function validState(s) {
  return s && typeof s === "object" && !Array.isArray(s) &&
    s.profil && typeof s.profil === "object" && Array.isArray(s.logs) && Array.isArray(s.bahan) &&
    s.weights && typeof s.weights === "object";
}

// ---------------------------------------------------------------- API
async function api(req, res, url) {
  const ip = req.socket.remoteAddress || "?";
  try {
    if (req.method === "GET" && url === "/api/me") {
      const u = currentUser(req);
      return send(res, 200, u ? { email: u.email, state: u.user.state } : { email: null });
    }

    // Origin check sederhana untuk request yang mengubah data
    if (req.method !== "GET") {
      const origin = req.headers.origin;
      if (origin && new URL(origin).host !== req.headers.host) return send(res, 403, { error: "Origin tidak diizinkan." });
    }

    if (req.method === "POST" && (url === "/api/register" || url === "/api/login")) {
      if (tooMany(ip)) return send(res, 429, { error: "Terlalu banyak percobaan. Coba lagi beberapa menit lagi." });
      const { email: rawEmail, password } = await readBody(req);
      const email = String(rawEmail || "").trim().toLowerCase();
      if (!emailOk(email)) return send(res, 400, { error: "Format email tidak valid." });
      if (typeof password !== "string" || password.length < 6 || password.length > 200)
        return send(res, 400, { error: "Kata sandi minimal 6 karakter." });

      if (url === "/api/register") {
        if (db.users[email]) return send(res, 409, { error: "Email sudah terdaftar. Silakan masuk." });
        const salt = crypto.randomBytes(16).toString("hex");
        db.users[email] = { salt, hash: hashPw(password, salt), created: new Date().toISOString(), state: null };
        const cookie = startSession(req, email);
        await persist();
        return send(res, 201, { email, state: null }, { "Set-Cookie": cookie });
      }

      const u = db.users[email];
      // hash tetap dihitung agar waktu respons tidak membocorkan keberadaan email
      const salt = u ? u.salt : "0".repeat(32);
      const h = Buffer.from(hashPw(password, salt), "hex");
      const ok = u && crypto.timingSafeEqual(h, Buffer.from(u.hash, "hex"));
      if (!ok) return send(res, 401, { error: "Email atau kata sandi salah." });
      if (email === DEMO) u.state = null; // demo selalu mulai dari form profil kosong
      const cookie = startSession(req, email);
      await persist();
      return send(res, 200, { email, state: u.state }, { "Set-Cookie": cookie });
    }

    if (req.method === "POST" && url === "/api/logout") {
      const token = cookieOf(req, COOKIE);
      if (token && db.sessions[sha(token)]) { delete db.sessions[sha(token)]; await persist(); }
      return send(res, 200, { ok: true }, { "Set-Cookie": sessionCookie(req, "", 0) });
    }

    if (req.method === "PUT" && url === "/api/state") {
      const u = currentUser(req);
      if (!u) return send(res, 401, { error: "Belum masuk." });
      const { state } = await readBody(req);
      if (!validState(state)) return send(res, 400, { error: "Data tidak valid." });
      u.user.state = state;
      await persist();
      return send(res, 200, { ok: true });
    }

    return send(res, 404, { error: "Tidak ditemukan." });
  } catch (e) {
    if (e.code === 413 || e.code === 400) return send(res, e.code, { error: e.code === 413 ? "Data terlalu besar." : "Permintaan tidak valid." });
    console.error(e);
    return send(res, 500, { error: "Terjadi kesalahan server." });
  }
}

// ---------------------------------------------------------------- Statis (hanya whitelist)
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon" };
const PUBLIC_FILES = new Set(["index.html", "style.css", "script.js"]);

function serveStatic(req, res, url) {
  let rel = decodeURIComponent(url.split("?")[0]);
  if (rel === "/") rel = "/index.html";
  rel = path.normalize(rel).replace(/^[/\\]+/, "");
  const allowed = PUBLIC_FILES.has(rel) || /^images[/\\][\w.-]+\.(jpg|png|svg)$/.test(rel);
  const file = path.join(ROOT, rel);
  if (!allowed || !file.startsWith(ROOT + path.sep)) { res.writeHead(404); return res.end("Not found"); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream", "Cache-Control": rel.startsWith("images") ? "public, max-age=86400" : "no-cache" });
    res.end(buf);
  });
}

http.createServer((req, res) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  const url = req.url || "/";
  if (url.startsWith("/api/")) return api(req, res, url.split("?")[0]);
  if (req.method !== "GET" && req.method !== "HEAD") { res.writeHead(405); return res.end(); }
  serveStatic(req, res, url);
}).listen(PORT, () => console.log(`BluMeal berjalan di http://localhost:${PORT}`));
