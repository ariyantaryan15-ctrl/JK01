/* =====================================================================
   BluMeal — versi HTML + CSS + JS (tanpa server)
   1. Rule-based  : BMI, BMR (Mifflin-St Jeor), TDEE, target kalori & makro
   2. Content-based filtering : skor = 40% kecocokan bahan + 30% kemiripan
      rasio makro + 10% kecocokan kalori + 20% tag tujuan
   3. Filter alergi, budget, waktu masak; porsi otomatis sesuai target
   Data pengguna disimpan di server per akun (login email + kata sandi, lihat server.js).
   ===================================================================== */

// ---------------------------------------------------------------- DATA
const INGREDIENTS = [
 {
  "id": "ayam",
  "nama": "Dada ayam",
  "emoji": "🍗",
  "kategori": "Protein",
  "kcal": 165,
  "protein": 31,
  "karbo": 0,
  "lemak": 3.6,
  "basic": false,
  "satuan": "potong kecil",
  "gram_satuan": 75,
  "harga_100g": 5000,
  "alergen": []
 },
 {
  "id": "sapi",
  "nama": "Daging sapi",
  "emoji": "🥩",
  "kategori": "Protein",
  "kcal": 187,
  "protein": 26,
  "karbo": 0,
  "lemak": 9,
  "basic": false,
  "satuan": "potong",
  "gram_satuan": 50,
  "harga_100g": 14000,
  "alergen": []
 },
 {
  "id": "telur",
  "nama": "Telur",
  "emoji": "🥚",
  "kategori": "Protein",
  "kcal": 143,
  "protein": 12.6,
  "karbo": 0.7,
  "lemak": 9.5,
  "basic": false,
  "satuan": "butir",
  "gram_satuan": 50,
  "harga_100g": 2800,
  "alergen": [
   "telur"
  ]
 },
 {
  "id": "tempe",
  "nama": "Tempe",
  "emoji": "🫘",
  "kategori": "Protein",
  "kcal": 192,
  "protein": 20.3,
  "karbo": 7.6,
  "lemak": 10.8,
  "basic": false,
  "satuan": "potong",
  "gram_satuan": 40,
  "harga_100g": 1500,
  "alergen": [
   "kedelai"
  ]
 },
 {
  "id": "tahu",
  "nama": "Tahu",
  "emoji": "🧈",
  "kategori": "Protein",
  "kcal": 76,
  "protein": 8,
  "karbo": 1.9,
  "lemak": 4.8,
  "basic": false,
  "satuan": "potong",
  "gram_satuan": 50,
  "harga_100g": 1200,
  "alergen": [
   "kedelai"
  ]
 },
 {
  "id": "kembung",
  "nama": "Ikan kembung",
  "emoji": "🐟",
  "kategori": "Protein",
  "kcal": 112,
  "protein": 21.3,
  "karbo": 0,
  "lemak": 3.4,
  "basic": false,
  "satuan": "ekor sedang",
  "gram_satuan": 100,
  "harga_100g": 4000,
  "alergen": [
   "ikan"
  ]
 },
 {
  "id": "udang",
  "nama": "Udang",
  "emoji": "🦐",
  "kategori": "Protein",
  "kcal": 99,
  "protein": 24,
  "karbo": 0.2,
  "lemak": 0.3,
  "basic": false,
  "satuan": "ekor sedang",
  "gram_satuan": 15,
  "harga_100g": 10000,
  "alergen": [
   "seafood"
  ]
 },
 {
  "id": "nasi",
  "nama": "Nasi putih",
  "emoji": "🍚",
  "kategori": "Karbohidrat",
  "kcal": 130,
  "protein": 2.7,
  "karbo": 28,
  "lemak": 0.3,
  "basic": false,
  "satuan": "centong",
  "gram_satuan": 100,
  "harga_100g": 1200,
  "alergen": []
 },
 {
  "id": "oatmeal",
  "nama": "Oatmeal",
  "emoji": "🥣",
  "kategori": "Karbohidrat",
  "kcal": 389,
  "protein": 16.9,
  "karbo": 66,
  "lemak": 6.9,
  "basic": false,
  "satuan": "sdm",
  "gram_satuan": 10,
  "harga_100g": 4000,
  "alergen": [
   "gluten"
  ]
 },
 {
  "id": "kentang",
  "nama": "Kentang",
  "emoji": "🥔",
  "kategori": "Karbohidrat",
  "kcal": 87,
  "protein": 1.9,
  "karbo": 20,
  "lemak": 0.1,
  "basic": false,
  "satuan": "buah sedang",
  "gram_satuan": 150,
  "harga_100g": 1800,
  "alergen": []
 },
 {
  "id": "roti",
  "nama": "Roti gandum",
  "emoji": "🍞",
  "kategori": "Karbohidrat",
  "kcal": 247,
  "protein": 13,
  "karbo": 41,
  "lemak": 3.4,
  "basic": false,
  "satuan": "lembar",
  "gram_satuan": 40,
  "harga_100g": 3500,
  "alergen": [
   "gluten"
  ]
 },
 {
  "id": "pisang",
  "nama": "Pisang",
  "emoji": "🍌",
  "kategori": "Buah",
  "kcal": 89,
  "protein": 1.1,
  "karbo": 23,
  "lemak": 0.3,
  "basic": false,
  "satuan": "buah",
  "gram_satuan": 100,
  "harga_100g": 2000,
  "alergen": []
 },
 {
  "id": "alpukat",
  "nama": "Alpukat",
  "emoji": "🥑",
  "kategori": "Buah",
  "kcal": 160,
  "protein": 2,
  "karbo": 8.5,
  "lemak": 14.7,
  "basic": false,
  "satuan": "buah sedang",
  "gram_satuan": 150,
  "harga_100g": 2500,
  "alergen": []
 },
 {
  "id": "brokoli",
  "nama": "Brokoli",
  "emoji": "🥦",
  "kategori": "Sayur",
  "kcal": 34,
  "protein": 2.8,
  "karbo": 6.6,
  "lemak": 0.4,
  "basic": false,
  "satuan": "genggam",
  "gram_satuan": 50,
  "harga_100g": 4000,
  "alergen": []
 },
 {
  "id": "bayam",
  "nama": "Bayam",
  "emoji": "🥬",
  "kategori": "Sayur",
  "kcal": 23,
  "protein": 2.9,
  "karbo": 3.6,
  "lemak": 0.4,
  "basic": false,
  "satuan": "ikat kecil",
  "gram_satuan": 50,
  "harga_100g": 2000,
  "alergen": []
 },
 {
  "id": "wortel",
  "nama": "Wortel",
  "emoji": "🥕",
  "kategori": "Sayur",
  "kcal": 41,
  "protein": 0.9,
  "karbo": 10,
  "lemak": 0.2,
  "basic": false,
  "satuan": "buah kecil",
  "gram_satuan": 50,
  "harga_100g": 1500,
  "alergen": []
 },
 {
  "id": "susu",
  "nama": "Susu cair",
  "emoji": "🥛",
  "kategori": "Lainnya",
  "kcal": 61,
  "protein": 3.2,
  "karbo": 4.8,
  "lemak": 3.3,
  "basic": false,
  "satuan": "gelas",
  "gram_satuan": 200,
  "harga_100g": 2000,
  "alergen": [
   "susu"
  ]
 },
 {
  "id": "yogurt",
  "nama": "Yogurt plain",
  "emoji": "🍶",
  "kategori": "Lainnya",
  "kcal": 61,
  "protein": 3.5,
  "karbo": 4.7,
  "lemak": 3.3,
  "basic": false,
  "satuan": "cup kecil",
  "gram_satuan": 100,
  "harga_100g": 4000,
  "alergen": [
   "susu"
  ]
 },
 {
  "id": "selai_kacang",
  "nama": "Selai kacang",
  "emoji": "🥜",
  "kategori": "Lainnya",
  "kcal": 588,
  "protein": 25,
  "karbo": 20,
  "lemak": 50,
  "basic": false,
  "satuan": "sdm",
  "gram_satuan": 15,
  "harga_100g": 8000,
  "alergen": [
   "kacang"
  ]
 },
 {
  "id": "minyak",
  "nama": "Minyak goreng",
  "emoji": "🫒",
  "kategori": "Bumbu dasar",
  "kcal": 884,
  "protein": 0,
  "karbo": 0,
  "lemak": 100,
  "basic": true,
  "satuan": "sdt",
  "gram_satuan": 5,
  "harga_100g": 2000,
  "alergen": []
 },
 {
  "id": "bawang",
  "nama": "Bawang putih/merah",
  "emoji": "🧄",
  "kategori": "Bumbu dasar",
  "kcal": 40,
  "protein": 1.1,
  "karbo": 9,
  "lemak": 0.1,
  "basic": true,
  "satuan": "siung",
  "gram_satuan": 5,
  "harga_100g": 4000,
  "alergen": []
 }
];
const RECIPES = [
 {
  "id": "nasi-ayam-panggang",
  "nama": "Nasi Ayam Panggang Sederhana",
  "waktu": "Makan siang",
  "menit": 25,
  "tags": [
   "bulking"
  ],
  "bahan": [
   {
    "id": "ayam",
    "gram": 150
   },
   {
    "id": "nasi",
    "gram": 250
   },
   {
    "id": "minyak",
    "gram": 5
   },
   {
    "id": "bawang",
    "gram": 10
   }
  ],
  "langkah": [
   "Lumuri dada ayam dengan bawang putih halus, garam, dan lada, diamkan 10 menit.",
   "Panggang atau tumis dengan 1 sdt minyak hingga matang dan kecokelatan.",
   "Sajikan dengan nasi putih hangat."
  ]
 },
 {
  "id": "ayam-tumis-brokoli",
  "nama": "Tumis Dada Ayam Brokoli",
  "waktu": "Makan malam",
  "menit": 20,
  "tags": [
   "cutting"
  ],
  "bahan": [
   {
    "id": "ayam",
    "gram": 150
   },
   {
    "id": "brokoli",
    "gram": 150
   },
   {
    "id": "nasi",
    "gram": 100
   },
   {
    "id": "minyak",
    "gram": 5
   },
   {
    "id": "bawang",
    "gram": 10
   }
  ],
  "langkah": [
   "Iris dada ayam tipis, bumbui garam dan lada.",
   "Tumis bawang dengan 1 sdt minyak, masukkan ayam hingga berubah warna.",
   "Tambahkan brokoli dan sedikit air, masak 3-4 menit agar tetap renyah.",
   "Sajikan dengan nasi satu centong."
  ]
 },
 {
  "id": "nasi-telur-tempe",
  "nama": "Nasi Telur Dadar & Tempe Goreng",
  "waktu": "Makan siang",
  "menit": 20,
  "tags": [
   "bulking"
  ],
  "bahan": [
   {
    "id": "telur",
    "gram": 100
   },
   {
    "id": "tempe",
    "gram": 80
   },
   {
    "id": "nasi",
    "gram": 250
   },
   {
    "id": "minyak",
    "gram": 10
   },
   {
    "id": "bawang",
    "gram": 10
   }
  ],
  "langkah": [
   "Kocok telur dengan bawang cincang dan garam, dadar dengan 1 sdt minyak.",
   "Iris tempe, goreng dengan 1 sdt minyak hingga kecokelatan.",
   "Sajikan bersama nasi hangat."
  ]
 },
 {
  "id": "telur-rebus-pisang",
  "nama": "Telur Rebus & Pisang",
  "waktu": "Camilan / sarapan cepat",
  "menit": 12,
  "tags": [
   "cutting",
   "bulking"
  ],
  "bahan": [
   {
    "id": "telur",
    "gram": 150
   },
   {
    "id": "pisang",
    "gram": 100
   }
  ],
  "langkah": [
   "Rebus telur 8-10 menit hingga matang, dinginkan dan kupas.",
   "Sajikan bersama pisang."
  ]
 },
 {
  "id": "oat-pisang-susu",
  "nama": "Oatmeal Pisang Susu",
  "waktu": "Sarapan",
  "menit": 8,
  "tags": [
   "bulking"
  ],
  "bahan": [
   {
    "id": "oatmeal",
    "gram": 60
   },
   {
    "id": "susu",
    "gram": 250
   },
   {
    "id": "pisang",
    "gram": 100
   }
  ],
  "langkah": [
   "Masak oatmeal dengan susu di api kecil 3-5 menit sambil diaduk.",
   "Iris pisang dan taruh di atasnya.",
   "Sajikan hangat."
  ]
 },
 {
  "id": "oat-pisang-telur",
  "nama": "Oatmeal Pisang + Telur Rebus",
  "waktu": "Sarapan",
  "menit": 12,
  "tags": [
   "cutting"
  ],
  "bahan": [
   {
    "id": "oatmeal",
    "gram": 40
   },
   {
    "id": "pisang",
    "gram": 60
   },
   {
    "id": "telur",
    "gram": 100
   }
  ],
  "langkah": [
   "Seduh atau masak oatmeal dengan air panas 3-5 menit.",
   "Rebus telur 8-10 menit, kupas.",
   "Tambahkan irisan pisang di atas oatmeal dan sajikan dengan telur."
  ]
 },
 {
  "id": "tumis-tahu-tempe-bayam",
  "nama": "Tumis Tahu Tempe Bayam",
  "waktu": "Makan malam",
  "menit": 20,
  "tags": [
   "cutting"
  ],
  "bahan": [
   {
    "id": "tahu",
    "gram": 150
   },
   {
    "id": "tempe",
    "gram": 80
   },
   {
    "id": "bayam",
    "gram": 100
   },
   {
    "id": "minyak",
    "gram": 5
   },
   {
    "id": "bawang",
    "gram": 10
   }
  ],
  "langkah": [
   "Potong dadu tahu dan tempe.",
   "Tumis bawang dengan 1 sdt minyak, masukkan tahu dan tempe hingga agak kecokelatan.",
   "Tambahkan bayam, garam, dan lada, aduk sebentar hingga layu."
  ]
 },
 {
  "id": "nasi-tahu-orak-arik",
  "nama": "Nasi Tahu Telur Orak-arik",
  "waktu": "Makan siang",
  "menit": 15,
  "tags": [
   "bulking"
  ],
  "bahan": [
   {
    "id": "tahu",
    "gram": 100
   },
   {
    "id": "telur",
    "gram": 100
   },
   {
    "id": "nasi",
    "gram": 200
   },
   {
    "id": "minyak",
    "gram": 10
   },
   {
    "id": "bawang",
    "gram": 10
   }
  ],
  "langkah": [
   "Hancurkan tahu kasar dengan garpu.",
   "Tumis bawang, masukkan tahu dan telur kocok, aduk hingga matang.",
   "Bumbui garam dan lada, sajikan dengan nasi."
  ]
 },
 {
  "id": "kembung-kentang-brokoli",
  "nama": "Kembung Bakar Kentang Brokoli",
  "waktu": "Makan siang",
  "menit": 30,
  "tags": [
   "cutting"
  ],
  "bahan": [
   {
    "id": "kembung",
    "gram": 120
   },
   {
    "id": "kentang",
    "gram": 200
   },
   {
    "id": "brokoli",
    "gram": 80
   }
  ],
  "langkah": [
   "Bersihkan ikan kembung, lumuri garam dan jeruk nipis.",
   "Kukus kentang 15-20 menit hingga empuk, potong dadu.",
   "Bakar ikan kembung di teflon tanpa minyak hingga matang.",
   "Rebus brokoli 2-3 menit, tata semua di piring."
  ]
 },
 {
  "id": "nasi-kembung-bayam",
  "nama": "Nasi Kembung Goreng & Tumis Bayam",
  "waktu": "Makan malam",
  "menit": 20,
  "tags": [
   "bulking"
  ],
  "bahan": [
   {
    "id": "kembung",
    "gram": 120
   },
   {
    "id": "nasi",
    "gram": 250
   },
   {
    "id": "bayam",
    "gram": 100
   },
   {
    "id": "minyak",
    "gram": 10
   },
   {
    "id": "bawang",
    "gram": 10
   }
  ],
  "langkah": [
   "Lumuri ikan kembung dengan bawang putih halus dan garam.",
   "Goreng dengan sedikit minyak hingga kecokelatan.",
   "Tumis bayam dengan bawang dan sisa minyak.",
   "Sajikan dengan nasi hangat."
  ]
 },
 {
  "id": "roti-selai-pisang",
  "nama": "Roti Selai Kacang Pisang + Susu",
  "waktu": "Sarapan / camilan",
  "menit": 5,
  "tags": [
   "bulking"
  ],
  "bahan": [
   {
    "id": "roti",
    "gram": 80
   },
   {
    "id": "selai_kacang",
    "gram": 30
   },
   {
    "id": "pisang",
    "gram": 100
   },
   {
    "id": "susu",
    "gram": 200
   }
  ],
  "langkah": [
   "Oles roti gandum dengan selai kacang.",
   "Tata irisan pisang di atasnya.",
   "Sajikan bersama segelas susu."
  ]
 },
 {
  "id": "orak-arik-bayam",
  "nama": "Telur Orak-arik Bayam",
  "waktu": "Sarapan",
  "menit": 10,
  "tags": [
   "cutting"
  ],
  "bahan": [
   {
    "id": "telur",
    "gram": 150
   },
   {
    "id": "bayam",
    "gram": 100
   },
   {
    "id": "minyak",
    "gram": 5
   },
   {
    "id": "bawang",
    "gram": 10
   }
  ],
  "langkah": [
   "Tumis bawang dengan 1 sdt minyak.",
   "Masukkan bayam hingga layu, lalu tuang telur kocok.",
   "Aduk hingga matang, bumbui garam dan lada."
  ]
 },
 {
  "id": "power-bowl-ayam-telur",
  "nama": "Power Bowl Ayam Telur",
  "waktu": "Makan siang",
  "menit": 30,
  "tags": [
   "bulking"
  ],
  "bahan": [
   {
    "id": "ayam",
    "gram": 150
   },
   {
    "id": "telur",
    "gram": 100
   },
   {
    "id": "nasi",
    "gram": 300
   },
   {
    "id": "brokoli",
    "gram": 80
   },
   {
    "id": "minyak",
    "gram": 10
   },
   {
    "id": "bawang",
    "gram": 10
   }
  ],
  "langkah": [
   "Panggang dada ayam berbumbu bawang, garam, dan lada lalu iris.",
   "Rebus telur 8 menit, belah dua.",
   "Rebus brokoli 2-3 menit.",
   "Tata nasi, ayam, telur, dan brokoli dalam mangkuk."
  ]
 },
 {
  "id": "tempe-bakar-kentang",
  "nama": "Tempe Bakar & Kentang Rebus",
  "waktu": "Makan malam",
  "menit": 35,
  "tags": [
   "cutting"
  ],
  "bahan": [
   {
    "id": "tempe",
    "gram": 120
   },
   {
    "id": "kentang",
    "gram": 200
   },
   {
    "id": "bayam",
    "gram": 80
   },
   {
    "id": "bawang",
    "gram": 5
   }
  ],
  "langkah": [
   "Rebus kentang 15-20 menit hingga empuk.",
   "Lumuri tempe dengan bawang halus dan garam, bakar di teflon hingga kecokelatan.",
   "Rebus bayam sebentar, sajikan bersama."
  ]
 },
 {
  "id": "pancake-oat-pisang",
  "nama": "Pancake Oat Pisang Telur",
  "waktu": "Sarapan",
  "menit": 20,
  "tags": [
   "bulking"
  ],
  "bahan": [
   {
    "id": "oatmeal",
    "gram": 60
   },
   {
    "id": "pisang",
    "gram": 100
   },
   {
    "id": "telur",
    "gram": 100
   },
   {
    "id": "minyak",
    "gram": 5
   }
  ],
  "langkah": [
   "Haluskan pisang, campur dengan telur dan oatmeal hingga rata.",
   "Panaskan teflon dengan sedikit minyak.",
   "Tuang adonan 2 sdm per pancake, masak 2 menit tiap sisi."
  ]
 },
 {
  "id": "sup-ayam-tahu-bayam",
  "nama": "Sup Ayam Tahu Bayam",
  "waktu": "Makan malam",
  "menit": 30,
  "tags": [
   "cutting"
  ],
  "bahan": [
   {
    "id": "ayam",
    "gram": 120
   },
   {
    "id": "tahu",
    "gram": 100
   },
   {
    "id": "bayam",
    "gram": 100
   },
   {
    "id": "bawang",
    "gram": 10
   }
  ],
  "langkah": [
   "Rebus air dengan bawang geprek, masukkan potongan ayam, masak 15 menit.",
   "Tambahkan tahu potong dadu, masak 5 menit.",
   "Masukkan bayam, bumbui garam dan lada, matikan api."
  ]
 },
 {
  "id": "sapi-lada-hitam",
  "nama": "Sapi Lada Hitam & Nasi",
  "waktu": "Makan siang",
  "menit": 25,
  "tags": [
   "bulking"
  ],
  "bahan": [
   {
    "id": "sapi",
    "gram": 120
   },
   {
    "id": "nasi",
    "gram": 200
   },
   {
    "id": "brokoli",
    "gram": 80
   },
   {
    "id": "minyak",
    "gram": 5
   },
   {
    "id": "bawang",
    "gram": 10
   }
  ],
  "langkah": [
   "Iris tipis daging sapi melawan serat, bumbui lada hitam dan garam.",
   "Tumis bawang dengan 1 sdt minyak, masukkan sapi, masak api besar 3-4 menit.",
   "Tambahkan brokoli dan sedikit air, masak 2 menit.",
   "Sajikan dengan nasi hangat."
  ]
 },
 {
  "id": "sup-sapi-kentang",
  "nama": "Sup Sapi Kentang Wortel",
  "waktu": "Makan malam",
  "menit": 45,
  "tags": [
   "cutting"
  ],
  "bahan": [
   {
    "id": "sapi",
    "gram": 100
   },
   {
    "id": "kentang",
    "gram": 150
   },
   {
    "id": "wortel",
    "gram": 80
   },
   {
    "id": "bawang",
    "gram": 10
   }
  ],
  "langkah": [
   "Rebus daging sapi potong dadu dengan bawang geprek 25 menit hingga empuk.",
   "Masukkan kentang dan wortel, masak 15 menit.",
   "Bumbui garam, lada, dan daun bawang secukupnya."
  ]
 },
 {
  "id": "udang-tumis-brokoli",
  "nama": "Udang Tumis Brokoli",
  "waktu": "Makan malam",
  "menit": 15,
  "tags": [
   "cutting"
  ],
  "bahan": [
   {
    "id": "udang",
    "gram": 150
   },
   {
    "id": "brokoli",
    "gram": 120
   },
   {
    "id": "nasi",
    "gram": 120
   },
   {
    "id": "minyak",
    "gram": 5
   },
   {
    "id": "bawang",
    "gram": 10
   }
  ],
  "langkah": [
   "Kupas udang, buang kotoran di punggungnya.",
   "Tumis bawang dengan 1 sdt minyak, masukkan udang hingga berubah warna.",
   "Tambahkan brokoli dan sedikit air, masak 3 menit.",
   "Sajikan dengan nasi."
  ]
 },
 {
  "id": "nasi-goreng-udang",
  "nama": "Nasi Goreng Udang Telur",
  "waktu": "Makan siang",
  "menit": 20,
  "tags": [
   "bulking"
  ],
  "bahan": [
   {
    "id": "udang",
    "gram": 100
   },
   {
    "id": "telur",
    "gram": 50
   },
   {
    "id": "nasi",
    "gram": 250
   },
   {
    "id": "wortel",
    "gram": 40
   },
   {
    "id": "minyak",
    "gram": 10
   },
   {
    "id": "bawang",
    "gram": 10
   }
  ],
  "langkah": [
   "Tumis bawang dengan minyak hingga harum.",
   "Masukkan udang dan wortel cincang, masak 2 menit.",
   "Sisihkan, orak-arik telur, lalu masukkan nasi.",
   "Aduk rata dengan garam dan kecap secukupnya."
  ]
 },
 {
  "id": "yogurt-oat-pisang",
  "nama": "Yogurt Oat Pisang Bowl",
  "waktu": "Sarapan",
  "menit": 5,
  "tags": [
   "cutting"
  ],
  "bahan": [
   {
    "id": "yogurt",
    "gram": 150
   },
   {
    "id": "oatmeal",
    "gram": 40
   },
   {
    "id": "pisang",
    "gram": 80
   }
  ],
  "langkah": [
   "Tuang yogurt ke mangkuk.",
   "Taburi oatmeal mentah atau panggang sebentar agar renyah.",
   "Tambahkan irisan pisang di atasnya."
  ]
 },
 {
  "id": "ayam-kentang-panggang",
  "nama": "Ayam Kentang Wortel Panggang",
  "waktu": "Makan siang",
  "menit": 35,
  "tags": [
   "bulking"
  ],
  "bahan": [
   {
    "id": "ayam",
    "gram": 150
   },
   {
    "id": "kentang",
    "gram": 200
   },
   {
    "id": "wortel",
    "gram": 80
   },
   {
    "id": "minyak",
    "gram": 5
   },
   {
    "id": "bawang",
    "gram": 5
   }
  ],
  "langkah": [
   "Potong kentang dan wortel, aduk dengan 1 sdt minyak, garam, dan bawang.",
   "Panggang di oven/teflon tertutup 20 menit.",
   "Panggang dada ayam berbumbu hingga matang, sajikan bersama."
  ]
 },
 {
  "id": "jus-alpukat-pisang",
  "nama": "Jus Alpukat Pisang Susu",
  "waktu": "Sarapan / camilan",
  "menit": 5,
  "tags": [
   "bulking"
  ],
  "bahan": [
   {
    "id": "alpukat",
    "gram": 150
   },
   {
    "id": "pisang",
    "gram": 100
   },
   {
    "id": "susu",
    "gram": 250
   }
  ],
  "langkah": [
   "Kerok daging alpukat, potong pisang.",
   "Blender alpukat, pisang, dan susu hingga halus.",
   "Sajikan dingin tanpa tambahan gula."
  ]
 },
 {
  "id": "salad-alpukat-telur",
  "nama": "Salad Alpukat Telur",
  "waktu": "Makan malam",
  "menit": 12,
  "tags": [
   "cutting"
  ],
  "bahan": [
   {
    "id": "alpukat",
    "gram": 70
   },
   {
    "id": "telur",
    "gram": 100
   },
   {
    "id": "bayam",
    "gram": 60
   },
   {
    "id": "wortel",
    "gram": 50
   }
  ],
  "langkah": [
   "Rebus telur 8-10 menit, kupas dan belah.",
   "Iris alpukat, serut wortel, dan siapkan bayam segar.",
   "Campur semua, beri sedikit garam, lada, dan perasan jeruk nipis."
  ]
 }
];

const ING = Object.fromEntries(INGREDIENTS.map((i) => [i.id, i]));
const SUBS = {
  ayam: ["kembung", "sapi", "tempe", "tahu", "telur", "udang"], sapi: ["ayam", "kembung", "tempe"],
  kembung: ["ayam", "udang", "tempe", "tahu", "telur"], udang: ["kembung", "ayam", "tahu"],
  tempe: ["tahu", "telur", "ayam"], tahu: ["tempe", "telur", "ayam"], telur: ["tahu", "tempe", "ayam"],
  nasi: ["kentang", "roti", "oatmeal"], kentang: ["nasi", "roti"], roti: ["nasi", "oatmeal", "kentang"],
  oatmeal: ["roti", "nasi"], pisang: ["alpukat"], alpukat: ["pisang"], brokoli: ["bayam", "wortel"],
  bayam: ["brokoli", "wortel"], wortel: ["brokoli", "bayam"], susu: ["yogurt"], yogurt: ["susu"],
};
const ACTIVITY = { sedentari: 1.2, ringan: 1.375, sedang: 1.55, berat: 1.725, sangat_berat: 1.9 };
const GOAL_RATIO = { bulking: [0.25, 0.55, 0.2], cutting: [0.4, 0.35, 0.25], maintenance: [0.3, 0.45, 0.25] };
const TUJUAN_LABEL = { bulking: "Bulking", cutting: "Cutting", maintenance: "Maintenance" };
const WAKTU_LABEL = { sarapan: "Sarapan", siang: "Makan siang", malam: "Makan malam", camilan: "Camilan" };
const ALERGEN_LABEL = { telur: "Telur", susu: "Susu", kacang: "Kacang", kedelai: "Kedelai", ikan: "Ikan", seafood: "Seafood", gluten: "Gluten" };
const BUDGETS = [[null, "Bebas"], [15000, "≤ 15rb"], [25000, "≤ 25rb"], [40000, "≤ 40rb"]];
const TIMES = [[null, "Bebas"], [10, "≤ 10 mnt"], [20, "≤ 20 mnt"], [30, "≤ 30 mnt"]];

// ---------------------------------------------------------------- STATE (disimpan di server per akun)
const DEFAULT_STATE = {
  nama: "",
  onboarded: false, // true setelah profil tubuh pertama kali disimpan
  profil: { tinggi: 172, berat: 68, usia: 22, gender: "pria", aktivitas: "sedang", tujuan: "bulking" },
  bahan: ["ayam", "nasi", "telur", "brokoli"],
  alergi: [], budget_max: null, menit_max: null, favorites: [],
  logs: [],      // {id, date, waktu, nama, kalori, protein, karbo, lemak, recipe_id}
  weights: {},   // {"YYYY-MM-DD": berat}
};
let state = structuredClone(DEFAULT_STATE);
let userEmail = null;
let onlyFav = false;
let current = null; // resep yang sedang dibuka

function adopt(saved) { state = { ...structuredClone(DEFAULT_STATE), ...(saved || {}) }; }

const NO_SERVER = "Tidak terhubung ke server BluMeal. Silakan coba lagi beberapa saat lagi.";
async function request(method, url, body) {
  let res;
  try {
    res = await fetch(url, {
      method, credentials: "same-origin", keepalive: method === "PUT",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch { throw Object.assign(new Error(NO_SERVER), { status: 0 }); }
  const data = await res.json().catch(() => null);
  if (!data) throw Object.assign(new Error(NO_SERVER), { status: res.status }); // bukan server BluMeal (mis. Live Server)
  if (!res.ok) throw Object.assign(new Error(data.error || "Terjadi kesalahan."), { status: res.status });
  return data;
}

// Simpan ke server (digabung: banyak perubahan beruntun = satu permintaan)
let saveTimer = null, saving = Promise.resolve();
function save() {
  if (!userEmail) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flushSave, 300);
}
function flushSave() {
  clearTimeout(saveTimer); saveTimer = null;
  if (!userEmail) return Promise.resolve();
  saving = saving.then(() => request("PUT", "/api/state", { state })).catch((e) => {
    if (e.status === 401) { userEmail = null; showAuth("Sesi berakhir, silakan masuk lagi."); }
    else toast("Gagal menyimpan ke server. Periksa koneksi.");
  });
  return saving;
}
window.addEventListener("pagehide", () => { if (saveTimer) flushSave(); });

// ---------------------------------------------------------------- HELPERS
const $ = (s) => document.querySelector(s);
const angka = (n) => Number(n).toLocaleString("id-ID");
const rupiah = (n) => "Rp " + angka(n);
const porsiTxt = (n) => String(n).replace(".", ",") + "×";
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const todayIso = () => iso(new Date());
const addDays = (s, n) => { const d = new Date(s + "T00:00:00"); d.setDate(d.getDate() + n); return iso(d); };
const round5 = (x) => Math.max(5, Math.round(x / 5) * 5);
const r1 = (x) => Math.round(x * 10) / 10;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const img = (id) => `images/${id}.jpg`;
const defaultWaktu = () => { const h = new Date().getHours(); return h < 10 ? "sarapan" : h < 15 ? "siang" : h < 21 ? "malam" : "camilan"; };

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.add("hidden"), 2600);
}

// ---------------------------------------------------------------- 1. RULE-BASED PROFIL
function nutrisi(bahan) {
  let k = 0, p = 0, c = 0, f = 0;
  bahan.forEach((b) => { const i = ING[b.id], g = b.gram / 100; k += i.kcal * g; p += i.protein * g; c += i.karbo * g; f += i.lemak * g; });
  return { kalori: Math.round(k), protein: r1(p), karbo: r1(c), lemak: r1(f) };
}
RECIPES.forEach((r) => {
  r.nutrisi = nutrisi(r.bahan);
  r.alergen = [...new Set(r.bahan.flatMap((b) => ING[b.id].alergen))];
});

function bmiCategory(b) {
  if (b < 17) return "Kurus (berat)";
  if (b < 18.5) return "Kurus (ringan)";
  if (b <= 25) return "Normal";
  if (b <= 27) return "Gemuk (ringan)";
  return "Gemuk (berat)";
}

function analyze(p) {
  const male = p.gender === "pria", goal = p.tujuan;
  const bmi = p.berat / (p.tinggi / 100) ** 2;
  const bmr = 10 * p.berat + 6.25 * p.tinggi - 5 * p.usia + (male ? 5 : -161);
  const tdee = bmr * ACTIVITY[p.aktivitas];
  let target = goal === "bulking" ? tdee + 400 : goal === "cutting" ? tdee - 500 : tdee;
  const floor = male ? 1500 : 1200, floorApplied = target < floor;
  target = Math.max(target, floor);
  const protein = p.berat * { bulking: 1.8, cutting: 2.0, maintenance: 1.6 }[goal];
  const lemak = (0.25 * target) / 9;
  const karbo = Math.max((target - protein * 4 - lemak * 9) / 4, 0);

  const saran = [];
  if (goal === "bulking" && bmi > 27) saran.push(["BMI kamu tergolong tinggi. Pertimbangkan cutting terlebih dahulu sebelum bulking.", true]);
  if (goal === "cutting" && bmi < 18.5) saran.push(["BMI kamu tergolong kurus. Cutting kurang disarankan; bulking atau maintenance lebih sesuai.", true]);
  if (goal === "bulking") { saran.push(["Bulking: surplus ±400 kkal/hari, naikkan berat 0,25-0,5 kg per minggu."]); saran.push(["Utamakan karbohidrat kompleks dan protein ±1,8 g per kg berat badan."]); }
  else if (goal === "cutting") { saran.push(["Cutting: defisit ±500 kkal/hari, turunkan berat 0,25-0,75 kg per minggu."]); saran.push(["Jaga protein tinggi (±2 g per kg berat badan) agar otot tetap terjaga."]); }
  else saran.push(["Maintenance: kalori setara kebutuhan harian untuk menjaga berat badan."]);
  if (p.aktivitas === "sedentari" && goal === "bulking") saran.push(["Aktivitas rendah: tanpa latihan beban, surplus kalori lebih banyak menjadi lemak.", true]);
  if (floorApplied) saran.push([`Target kalori dinaikkan ke batas aman minimum ${floor} kkal/hari.`, true]);
  saran.push(["Minum air putih minimal 2-3 liter per hari dan tidur 7-9 jam."]);

  return { bmi: r1(bmi), kategori: bmiCategory(bmi), bmr: Math.round(bmr), tdee: Math.round(tdee), target: Math.round(target),
    protein: Math.round(protein), karbo: Math.round(karbo), lemak: Math.round(lemak), perMakan: Math.round(target / 3), saran };
}

function weightAdvice(tinggi, berat, tujuan) {
  const h2 = (tinggi / 100) ** 2, lo = r1(18.5 * h2), hi = r1(25 * h2), f = (x) => angka(r1(x));
  if (berat < lo) return { status: "kurang", saran: "bulking", lo, hi, pesan: `Berat kamu kurang ±${f(lo - berat)} kg dari rentang ideal (${f(lo)}–${f(hi)} kg). Disarankan bulking: surplus ±400 kkal/hari dan latihan beban.` };
  if (berat > hi) return { status: "lebih", saran: "cutting", lo, hi, pesan: `Berat kamu lebih ±${f(berat - hi)} kg dari rentang ideal (${f(lo)}–${f(hi)} kg). Disarankan cutting: defisit ±500 kkal/hari dengan protein tinggi.` };
  return { status: "ideal", saran: tujuan, lo, hi, pesan: `Berat kamu sudah di rentang ideal (${f(lo)}–${f(hi)} kg). Lanjutkan tujuan ${tujuan} sesuai program latihanmu.` };
}

// ---------------------------------------------------------------- 2. CONTENT-BASED FILTERING
function scoreRecipe(r, have, goal, mealKcal) {
  const main = r.bahan.filter((b) => !ING[b.id].basic).map((b) => b.id);
  const matched = main.filter((i) => have.has(i)), missing = main.filter((i) => !have.has(i));
  const coverage = matched.length / main.length;
  const n = r.nutrisi, total = Math.max(n.kalori, 1);
  const ratio = [(n.protein * 4) / total, (n.karbo * 4) / total, (n.lemak * 9) / total];
  const macroSim = Math.max(0, 1 - ratio.reduce((s, x, i) => s + Math.abs(x - GOAL_RATIO[goal][i]), 0) / 2);
  const kcalFit = 1 - Math.min(1, Math.abs(n.kalori - mealKcal) / mealKcal);
  const tagFit = r.tags.includes(goal) || goal === "maintenance" ? 1 : 0;
  return { score: 0.4 * coverage + 0.3 * macroSim + 0.1 * kcalFit + 0.2 * tagFit, coverage, matched, missing, macroSim };
}

function portionFor(r, mealKcal) {
  const p = Math.round((mealKcal / Math.max(r.nutrisi.kalori, 1)) * 4) / 4;
  return Math.min(Math.max(p, 0.5), 2);
}

function buildItem(r, have, goal, mealKcal) {
  const s = scoreRecipe(r, have, goal, mealKcal);
  const porsi = portionFor(r, mealKcal);
  const bahan = r.bahan.map((b) => {
    const i = ING[b.id], gram = round5(b.gram * porsi);
    const n = Math.max(Math.round((gram / i.gram_satuan) * 2) / 2, 0.5);
    return { id: b.id, nama: i.nama, emoji: i.emoji, gram, basic: i.basic, dimiliki: i.basic || have.has(b.id),
      kalori: Math.round((i.kcal * gram) / 100), takaran: `${gram} g (± ${String(n).replace(".", ",")} ${i.satuan})` };
  });
  const np = nutrisi(bahan);
  np.kalori = bahan.reduce((a, b) => a + b.kalori, 0); // = Σ kkal per bahan (konsisten dengan tampilan)
  const budget = Math.ceil(bahan.reduce((a, b) => a + (ING[b.id].harga_100g * b.gram) / 100, 0) / 500) * 500;
  const ids = new Set(r.bahan.map((b) => b.id));
  return { ...r, skor: Math.round(s.score * 100), kecocokan: Math.round(s.coverage * 100), macroSim: s.macroSim, porsi, bahanPorsi: bahan, np, budget,
    cocokTujuan: r.tags.includes(goal) || goal === "maintenance", matched: s.matched, missing: s.missing,
    kurang: s.missing.map((m) => ({ nama: ING[m].nama, pengganti: (SUBS[m] || []).filter((x) => have.has(x) && !ids.has(x)).map((x) => ING[x].nama) })) };
}

function passFilters(item) {
  if (item.alergen.some((a) => state.alergi.includes(a))) return false;
  if (state.budget_max && item.budget > state.budget_max) return false;
  if (state.menit_max && item.menit > state.menit_max) return false;
  return true;
}

function recommend() {
  const prof = analyze(state.profil), have = new Set(state.bahan), goal = state.profil.tujuan;
  const ready = [], alt = []; let disaring = 0;
  if (!have.size) return { ready, alt, disaring };
  RECIPES.forEach((r) => {
    const it = buildItem(r, have, goal, prof.perMakan);
    if (!it.matched.length) return;
    if (!it.missing.length || (it.missing.length <= 2 && it.kecocokan >= 50)) {
      if (!passFilters(it)) { disaring++; return; }
      (it.missing.length ? alt : ready).push(it);
    }
  });
  ready.sort((a, b) => b.skor - a.skor); alt.sort((a, b) => b.skor - a.skor);
  return { ready: ready.slice(0, 8), alt: alt.slice(0, 6), disaring };
}

// ---------------------------------------------------------------- 3. ALASAN + VERIFIKASI KALORI
function verify(it, mealKcal) {
  const diff = Math.round(((it.np.kalori - mealKcal) / mealKcal) * 100);
  return { diff, status: Math.abs(diff) <= 15 ? "sesuai" : diff < 0 ? "di_bawah" : "di_atas",
    rincian: it.bahanPorsi.map((b) => `${b.nama} ${b.gram} g (${b.kalori} kkal)`).join(" + ") + ` = ${it.np.kalori} kkal` };
}

function reasons(it, prof) {
  const goal = state.profil.tujuan, n = it.np, out = [];
  out.push(it.missing.length ? `Kamu sudah punya ${it.kecocokan}% bahan utamanya; kurang ${it.kurang.map((k) => k.nama).join(", ")}.` : "Semua bahan utamanya sudah ada di dapurmu — bisa langsung dimasak.");
  out.push(`Satu sajian memberi ${angka(n.protein)} g protein (${Math.round((n.protein / prof.protein) * 100)}% target harian) untuk ${goal === "cutting" ? "menjaga massa otot saat defisit" : "mendukung pertumbuhan otot"}.`);
  out.push(`Komposisi makronya ${Math.round(it.macroSim * 100)}% mirip rasio ideal ${TUJUAN_LABEL[goal]}${it.cocokTujuan ? " dan menu ini memang ditandai untuk " + goal : ""}.`);
  if (state.budget_max || state.menit_max) out.push(`Sesuai filter kamu: ${rupiah(it.budget)} per sajian, ${it.menit} menit memasak.`);
  const v = verify(it, prof.perMakan);
  const tips = v.status === "sesuai"
    ? `Porsi ${porsiTxt(it.porsi)} resep ≈ ${angka(n.kalori)} kkal, pas dengan target per makan ${angka(prof.perMakan)} kkal (selisih ${v.diff}%).`
    : v.status === "di_bawah"
      ? `Porsi ini ${angka(n.kalori)} kkal, di bawah target ${angka(prof.perMakan)} kkal. Tambah nasi/kentang atau buah agar cukup.`
      : `Porsi ini ${angka(n.kalori)} kkal, di atas target ${angka(prof.perMakan)} kkal. Kurangi karbohidrat atau minyak sedikit.`;
  return { ringkasan: `${it.nama} cocok untuk target ${TUJUAN_LABEL[goal]} kamu dengan skor ${it.skor}/100.`, alasan: out, tips, v };
}

// ---------------------------------------------------------------- RENDER: HARI INI
function todayLogs() { return state.logs.filter((l) => l.date === todayIso()); }

function eatenToday() { return todayLogs().reduce((a, l) => a + l.kalori, 0); }
function targetReached() { return eatenToday() >= analyze(state.profil).target; }

// Kunci tombol pilih/catat makanan saat target kalori harian tercapai
function applyTargetLock() {
  const locked = targetReached();
  $("#target-banner").classList.toggle("hidden", !locked);
  document.querySelectorAll(".recipe-card").forEach((b) => { b.disabled = locked; b.classList.toggle("locked", locked); });
  const lg = document.querySelector("#sheet [data-log]");
  if (lg) {
    lg.disabled = locked;
    if (locked) lg.textContent = "🎯 Target sudah tercapai";
    else if (current) lg.textContent = `✅ Catat ke hari ini · ${angka(current.it.np.kalori)} kkal`;
  }
  const rb = $("#relog-btn");
  rb.disabled = locked;
  if (locked) rb.textContent = "🎯 Target sudah tercapai";
}

function renderToday() {
  const p = analyze(state.profil), logs = todayLogs();
  const tot = logs.reduce((a, l) => ({ kalori: a.kalori + l.kalori, protein: a.protein + l.protein, karbo: a.karbo + l.karbo, lemak: a.lemak + l.lemak }), { kalori: 0, protein: 0, karbo: 0, lemak: 0 });
  const sisa = p.target - tot.kalori, over = sisa < 0;
  $("#user-name").textContent = state.nama || "kamu";
  $("#remaining-label").textContent = over ? "KELEBIHAN" : "SISA KALORI";
  $("#remaining-kcal").textContent = angka(Math.abs(sisa));
  $("#remaining-kcal").classList.toggle("over", over);
  $("#target-label").textContent = `Target · ${TUJUAN_LABEL[state.profil.tujuan]}`;
  $("#target-kcal").textContent = angka(p.target);
  $("#eaten-kcal").textContent = angka(tot.kalori);
  const ring = $("#today-ring"), c = 2 * Math.PI * 76;
  ring.style.strokeDashoffset = c * (1 - Math.min(tot.kalori / p.target, 1));
  ring.style.stroke = over ? "#fb923c" : "#34d399";

  $("#macro-grid").innerHTML = [["protein", "Protein"], ["karbo", "Karbo"], ["lemak", "Lemak"]].map(([k, l]) => `
    <div class="macro ${k}"><p>${l}</p><strong>${Math.round(tot[k])}<small>/${p[k]}g</small></strong>
    <div class="bar"><i style="width:${Math.min((tot[k] / p[k]) * 100, 100)}%"></i></div></div>`).join("");
  $("#bmi-line").innerHTML = `BMI <b>${angka(p.bmi)}</b> (${p.kategori}) · TDEE ${angka(p.tdee)} kkal · ± ${angka(p.perMakan)} kkal per makan`;

  $("#log-list").innerHTML = logs.length ? logs.map((l) => `
    <li>
      ${l.recipe_id ? `<img class="log-img" src="${img(l.recipe_id)}" alt="">` : `<span class="log-img">🍽️</span>`}
      <div class="log-info"><b>${esc(l.nama)}</b><small>${WAKTU_LABEL[l.waktu]} · P ${angka(l.protein)} g</small></div>
      <span class="log-kcal">${angka(l.kalori)} <small>kkal</small></span>
      <button class="icon-btn" data-del="${l.id}" aria-label="Hapus">🗑️</button>
    </li>`).join("") : `<li class="empty">Belum ada yang dicatat. Pilih menu lalu tekan “Catat ke hari ini”, atau ulangi menu kemarin.</li>`;

  const pending = yesterdayPending();
  const rb = $("#relog-btn");
  rb.classList.toggle("hidden", !pending.length);
  rb.textContent = `🔁 Ulangi menu kemarin · ${pending.length} item (${angka(pending.reduce((a, l) => a + l.kalori, 0))} kkal)`;

  $("#advice-list").innerHTML = p.saran.map(([s, warn]) => `<li class="${warn ? "warn" : ""}">• ${s}</li>`).join("");
  applyTargetLock();
}

function yesterdayPending() {
  const y = addDays(todayIso(), -1), have = new Set(todayLogs().map((l) => l.nama + "|" + l.waktu));
  return state.logs.filter((l) => l.date === y && !have.has(l.nama + "|" + l.waktu));
}

function logRecipe(it, waktu) {
  state.logs.push({ id: crypto.randomUUID(), date: todayIso(), waktu, nama: it.nama, kalori: it.np.kalori,
    protein: it.np.protein, karbo: it.np.karbo, lemak: it.np.lemak, recipe_id: it.id });
  save(); renderToday(); renderProgress();
  toast(`${it.nama} dicatat · ${angka(it.np.kalori)} kkal`);
}

// ---------------------------------------------------------------- RENDER: MENU
function renderBahan() {
  const q = $("#bahan-search").value.toLowerCase();
  const groups = ["Protein", "Karbohidrat", "Sayur", "Buah", "Lainnya"];
  $("#bahan-groups").innerHTML = groups.map((g) => {
    const items = INGREDIENTS.filter((i) => !i.basic && i.kategori === g && i.nama.toLowerCase().includes(q));
    if (!items.length) return "";
    return `<p class="group-label">${g}</p><div class="chips">${items.map((i) =>
      `<button class="chip ${state.bahan.includes(i.id) ? "on" : ""}" data-bahan="${i.id}">${i.emoji} ${i.nama}${state.bahan.includes(i.id) ? " ✓" : ""}</button>`).join("")}</div>`;
  }).join("");
  $("#bahan-count").textContent = `${state.bahan.length} dipilih`;
}

function renderFilters() {
  $("#alergi-chips").innerHTML = Object.entries(ALERGEN_LABEL).map(([k, l]) =>
    `<button class="chip ${state.alergi.includes(k) ? "on-red" : ""}" data-alergi="${k}">${state.alergi.includes(k) ? "🚫 " : ""}${l}</button>`).join("");
  $("#budget-chips").innerHTML = BUDGETS.map(([v, l]) => `<button class="chip ${state.budget_max === v ? "on-orange" : ""}" data-budget="${v}">${l}</button>`).join("");
  $("#time-chips").innerHTML = TIMES.map(([v, l]) => `<button class="chip ${state.menit_max === v ? "on-orange" : ""}" data-time="${v}">${l}</button>`).join("");
  $("#filter-count").textContent = `${state.alergi.length + (state.budget_max ? 1 : 0) + (state.menit_max ? 1 : 0)} aktif`;
}

function recipeCard(it, i) {
  const main = it.bahanPorsi.filter((b) => !b.basic).map((b) => b.nama).join(", ");
  return `<button class="recipe-card" data-open="${it.id}" style="animation-delay:${Math.min(i * 40, 300)}ms">
    <div class="thumb"><img src="${img(it.id)}" alt="${esc(it.nama)}" loading="lazy"><span class="score">${it.skor}% cocok</span></div>
    <div class="rc-body">
      <p class="rc-time">${it.waktu}</p><h3>${it.nama}</h3><p class="rc-ing">${main}</p>
      <p class="rc-kcal">± ${angka(it.np.kalori)} kkal <small>· ${porsiTxt(it.porsi)} porsi</small></p>
      <div class="tags"><span class="tag">⏱️ ${it.menit} mnt</span><span class="tag">💰 ${rupiah(it.budget)}</span><span class="tag blue">💪 P ${angka(it.np.protein)} g</span></div>
      ${it.kurang.length ? `<p class="missing">Kurang: ${it.kurang.map((k) => k.nama + (k.pengganti.length ? ` → ganti ${k.pengganti[0]}` : "")).join("; ")}</p>` : ""}
    </div></button>`;
}

let lastRec = { ready: [], alt: [] };
function renderMenu() {
  renderBahan(); renderFilters();
  lastRec = recommend();
  const mq = $("#menu-search").value.trim().toLowerCase();
  const fav = (l) => {
    if (onlyFav) l = l.filter((x) => state.favorites.includes(x.id));
    if (mq) l = l.filter((x) => (x.nama + " " + x.bahanPorsi.map((b) => b.nama).join(" ")).toLowerCase().includes(mq));
    return l;
  };
  const ready = fav(lastRec.ready), alt = fav(lastRec.alt);
  $("#rec-summary").textContent = `${lastRec.ready.length} siap masak · ${lastRec.alt.length} alternatif${lastRec.disaring ? ` · ${lastRec.disaring} disaring filter` : ""}`;
  $("#fav-filter").textContent = `${onlyFav ? "❤️" : "🤍"} Favorit (${state.favorites.length})`;
  $("#fav-filter").classList.toggle("on", onlyFav);
  let html = "";
  if (!state.bahan.length) html = `<div class="empty">🧑‍🍳 Belum ada bahan dipilih. Pilih bahan di dapur, menu akan muncul otomatis.</div>`;
  else if (!ready.length && !alt.length && mq) html = `<div class="empty">🔍 Menu “${esc(mq)}” tidak ditemukan.</div>`;
  else if (!ready.length && !alt.length) html = `<div class="empty">🔍 Tidak ada menu yang cocok. Tambah bahan atau longgarkan filter.</div>`;
  if (ready.length) html += `<p class="section-label">Siap masak dengan bahanmu</p>` + ready.map(recipeCard).join("");
  if (alt.length) html += `<p class="section-label orange">Alternatif · kurang 1-2 bahan</p>` + alt.map(recipeCard).join("");
  $("#rec-list").innerHTML = html;
  applyTargetLock();
}

// ---------------------------------------------------------------- DETAIL RESEP (sheet)
function miniRing(label, value, target, unit, color) {
  const c = 2 * Math.PI * 26, pct = Math.min(value / Math.max(target, 1), 1);
  return `<div><p>${label}</p><div class="mini-ring"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" class="t"/>
    <circle cx="32" cy="32" r="26" class="v" stroke="${color}" stroke-dasharray="${c}" stroke-dashoffset="${c}" data-off="${c * (1 - pct)}"/></svg>
    <b>${Math.round(value)}</b></div><small>/${angka(target)}${unit}</small></div>`;
}

function openRecipe(id) {
  const prof = analyze(state.profil);
  const it = buildItem(RECIPES.find((r) => r.id === id), new Set(state.bahan), state.profil.tujuan, prof.perMakan);
  current = { it, waktu: defaultWaktu(), tab: "bahan" };
  const R = reasons(it, prof), fav = state.favorites.includes(it.id);
  $("#sheet").innerHTML = `
    <div class="sheet-hero"><img src="${img(it.id)}" alt="${esc(it.nama)}"><button class="back-btn" data-close>←</button></div>
    <div class="sheet-top">
      <div class="sheet-chips"><span>⏱️ ${it.menit} mnt</span><span>🔥 ${angka(it.np.kalori)} kkal</span><span>💰 ${rupiah(it.budget)}</span><span class="green">🍽️ ${porsiTxt(it.porsi)} porsi resep</span></div>
      <h2>${it.nama}</h2>
      <p class="muted">${it.waktu} · skor kecocokan ${it.skor}% · bahan cocok ${it.kecocokan}%</p>
      ${it.alergen.length ? `<p class="allergen">Mengandung: ${it.alergen.map((a) => ALERGEN_LABEL[a]).join(", ")}</p>` : ""}
      <div class="seg4" id="waktu-seg">${Object.keys(WAKTU_LABEL).map((w) => `<button data-waktu="${w}" class="${w === current.waktu ? "on" : ""}">${WAKTU_LABEL[w].replace("Makan ", "").replace(/^./, (c) => c.toUpperCase())}</button>`).join("")}</div>
      <div class="action-row">
        <button class="btn btn-primary" data-log>✅ Catat ke hari ini · ${angka(it.np.kalori)} kkal</button>
        <button class="heart-btn" data-fav aria-label="Favorit">${fav ? "❤️" : "🤍"}</button>
      </div>
    </div>
    <div class="sheet-body">
      <div class="nutri-card"><h3>Informasi nutrisi <small>per sajian</small></h3><div class="rings">
        ${miniRing("Kalori", it.np.kalori, prof.target, " kkal", "#10b981")}${miniRing("Protein", it.np.protein, prof.protein, "g", "#38bdf8")}
        ${miniRing("Lemak", it.np.lemak, prof.lemak, "g", "#f59e0b")}${miniRing("Karbohidrat", it.np.karbo, prof.karbo, "g", "#a855f7")}
      </div></div>
      <div class="reason"><h3>✨ Kenapa menu ini? <span>RULE-BASED AI</span></h3>
        <p>${R.ringkasan}</p><ul>${R.alasan.map((a) => `<li>${a}</li>`).join("")}</ul>
        <div class="verify"><span class="status ${R.v.status === "sesuai" ? "ok" : "warn"}">${R.v.status === "sesuai" ? "Kalori sesuai porsi" : R.v.status === "di_bawah" ? "Di bawah target per makan" : "Di atas target per makan"}</span>
          <b>${angka(it.np.kalori)} / ${angka(prof.perMakan)} kkal (${R.v.diff > 0 ? "+" : ""}${R.v.diff}%)</b><p style="margin-top:6px">${R.tips}</p></div>
      </div>
      <div class="tabs3" id="detail-tabs"><button data-dtab="bahan" class="on">Bahan</button><button data-dtab="instruksi">Instruksi</button><button data-dtab="gizi">Gizi</button></div>
      <div id="detail-content"></div>
    </div>`;
  renderDetailTab();
  applyTargetLock();
  $("#overlay").classList.remove("hidden");
  $("#sheet").classList.add("open");
  requestAnimationFrame(() => setTimeout(() => document.querySelectorAll(".mini-ring .v").forEach((c) => (c.style.strokeDashoffset = c.dataset.off)), 50));
}

function renderDetailTab() {
  const { it, tab } = current;
  document.querySelectorAll("#detail-tabs button").forEach((b) => b.classList.toggle("on", b.dataset.dtab === tab));
  let h = "";
  if (tab === "bahan") {
    h = `<ul class="ing-list">${it.bahanPorsi.map((b) => `<li><span class="ing-emoji">${b.emoji}</span><div style="flex:1"><b>${b.nama}</b>${b.dimiliki ? "" : '<span class="belum">BELUM ADA</span>'}<br><small class="muted">${b.takaran}</small></div><b>${b.kalori} kkal</b></li>`).join("")}
      <li class="total"><span>Total per sajian</span><span>${angka(it.np.kalori)} kkal</span></li></ul>
      ${it.kurang.length ? `<p class="missing">${it.kurang.map((k) => `Belum punya <b>${k.nama}</b>${k.pengganti.length ? " — bisa diganti " + k.pengganti.join(" / ") : ""}`).join("<br>")}</p>` : ""}`;
  } else if (tab === "instruksi") {
    h = `<ol class="steps">${it.langkah.map((s) => `<li>${s}</li>`).join("")}</ol>`;
  } else {
    const rows = [["Kalori", "kalori", " kkal"], ["Protein", "protein", " g"], ["Karbohidrat", "karbo", " g"], ["Lemak", "lemak", " g"]];
    h = `<table class="ntable"><tr><th>Zat gizi</th><th>1× resep</th><th>${porsiTxt(it.porsi)} (sajian)</th></tr>
      ${rows.map(([l, k, u]) => `<tr><td>${l}</td><td>${angka(it.nutrisi[k])}${u}</td><td><b>${angka(it.np[k])}${u}</b></td></tr>`).join("")}</table>
      <p class="muted" style="margin-top:8px;font-size:12px">Nilai gizi dihitung dari takaran bahan (per 100 g). Estimasi, bukan pengganti ahli gizi.</p>`;
  }
  $("#detail-content").innerHTML = h;
}

function closeSheet() {
  $("#sheet").classList.remove("open");
  $("#overlay").classList.add("hidden");
  current = null;
}

// ---------------------------------------------------------------- RENDER: PROGRES
function ensureWeight() {
  if (!Object.keys(state.weights).length) { state.weights[todayIso()] = state.profil.berat; save(); }
}

function weekly() {
  const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"], weeks = {};
  Object.keys(state.weights).sort().forEach((d) => {
    const dt = new Date(d + "T00:00:00"); dt.setDate(dt.getDate() - ((dt.getDay() + 6) % 7));
    weeks[iso(dt)] = state.weights[d];
  });
  return Object.entries(weeks).sort().slice(-12).map(([k, v]) => { const d = new Date(k + "T00:00:00"); return { label: `${d.getDate()} ${BULAN[d.getMonth()]}`, berat: v }; });
}

function drawChart(data) {
  const W = 520, H = 200, P = { l: 34, r: 10, t: 10, b: 24 };
  const vals = data.map((d) => d.berat), min = Math.min(...vals) - 1, max = Math.max(...vals) + 1;
  const x = (i) => P.l + (data.length === 1 ? (W - P.l - P.r) / 2 : (i * (W - P.l - P.r)) / (data.length - 1));
  const y = (v) => P.t + ((max - v) * (H - P.t - P.b)) / (max - min);
  const line = data.map((d, i) => `${x(i)},${y(d.berat)}`).join(" ");
  const area = `${x(0)},${H - P.b} ${line} ${x(data.length - 1)},${H - P.b}`;
  const grid = [0, 1, 2, 3].map((g) => { const v = min + ((max - min) * g) / 3; return `<line x1="${P.l}" x2="${W - P.r}" y1="${y(v)}" y2="${y(v)}" stroke="#e2e8f0" stroke-dasharray="3 3"/><text x="${P.l - 6}" y="${y(v) + 4}" font-size="11" fill="#64748b" text-anchor="end">${angka(r1(v))}</text>`; }).join("");
  $("#weight-chart").innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
    <defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#059669" stop-opacity=".35"/><stop offset="1" stop-color="#059669" stop-opacity="0"/></linearGradient></defs>
    ${grid}<polygon points="${area}" fill="url(#wg)"/><polyline points="${line}" fill="none" stroke="#059669" stroke-width="3" stroke-linejoin="round"/>
    ${data.map((d, i) => `<circle cx="${x(i)}" cy="${y(d.berat)}" r="4.5" fill="#059669"><title>${d.label}: ${angka(d.berat)} kg</title></circle><text x="${x(i)}" y="${H - 6}" font-size="11" fill="#64748b" text-anchor="middle">${d.label}</text>`).join("")}
  </svg>`;
}

function renderProgress() {
  ensureWeight();
  const dates = Object.keys(state.weights).sort(), first = state.weights[dates[0]], last = state.weights[dates.at(-1)];
  const ch = r1(last - first);
  $("#weight-current").textContent = angka(last);
  $("#weight-change").textContent = ch ? `${ch > 0 ? "+" : ""}${angka(ch)} kg` : "";
  $("#weight-change").className = "change " + (ch > 0 ? "up" : "down");
  drawChart(weekly());

  const a = weightAdvice(state.profil.tinggi, state.profil.berat, state.profil.tujuan);
  const bmi = r1(state.profil.berat / (state.profil.tinggi / 100) ** 2);
  const box = $("#weight-advice");
  box.className = "advice-box " + a.status;
  box.innerHTML = `<b>BMI ${angka(bmi)}</b> — ${a.pesan}${a.saran !== state.profil.tujuan ? `<br><button class="btn btn-primary" data-goal="${a.saran}">Ganti ke ${TUJUAN_LABEL[a.saran]}</button>` : ""}`;

  // riwayat 35 hari
  const target = analyze(state.profil).target, today = todayIso(), days = [];
  for (let i = 34; i >= 0; i--) {
    const d = addDays(today, -i), k = state.logs.filter((l) => l.date === d).reduce((s, l) => s + l.kalori, 0);
    const has = state.logs.some((l) => l.date === d), ratio = k / target;
    days.push({ d, k, status: !has ? "kosong" : ratio >= 0.9 && ratio <= 1.1 ? "tercapai" : ratio < 0.9 ? "kurang" : "lebih" });
  }
  let seq = [...days].reverse(), streak = 0;
  if (seq[0].status !== "tercapai") seq = seq.slice(1); // hari ini mungkin belum selesai
  for (const x of seq) { if (x.status !== "tercapai") break; streak++; }
  $("#streak").textContent = `🔥 ${streak} hari streak`;
  $("#hit-count").textContent = `${days.filter((x) => x.status === "tercapai").length}/${days.filter((x) => x.status !== "kosong").length} tercapai`;
  const offset = (new Date(days[0].d + "T00:00:00").getDay() + 6) % 7;
  $("#calendar").innerHTML = "<span></span>".repeat(offset) + days.map((x) =>
    `<div class="day ${x.status}" title="${x.d}${x.status !== "kosong" ? `: ${angka(x.k)} / ${angka(target)} kkal` : ""}">${Number(x.d.slice(8))}${x.status !== "kosong" ? `<small>${r1(x.k / 1000)}k</small>` : ""}</div>`).join("");
}

function hintHtml(berat, tinggi) {
  const a = weightAdvice(tinggi, berat, state.profil.tujuan), f = (x) => angka(r1(x));
  if (a.status === "kurang") return [a.status, `⬆️ Kurang ±${f(a.lo - berat)} kg dari ideal (${f(a.lo)}–${f(a.hi)} kg). Rekomendasi: <b>bulking</b>.`];
  if (a.status === "lebih") return [a.status, `⬇️ Lebih ±${f(berat - a.hi)} kg dari ideal (${f(a.lo)}–${f(a.hi)} kg). Rekomendasi: <b>cutting</b>.`];
  return [a.status, `✅ Berat ideal (${f(a.lo)}–${f(a.hi)} kg). Pertahankan!`];
}
function showHint(el, berat, tinggi) {
  if (!berat || berat < 30 || !tinggi || tinggi < 100) { el.classList.add("hidden"); return; }
  const [cls, html] = hintHtml(berat, tinggi);
  el.className = "hint " + cls; el.innerHTML = html;
}

function setWeight(berat) {
  state.weights[todayIso()] = r1(berat);
  state.profil.berat = r1(berat); // ikut memperbarui BMI & target kalori
  save(); renderAll();
}

// ---------------------------------------------------------------- RENDER: PROFIL
let formTujuan = state.profil.tujuan;
function setOnboarding(on) {
  document.body.classList.toggle("onboarding", on);
  $("#onboard-note").classList.toggle("hidden", !on);
  $("#reset-btn").classList.toggle("hidden", on);
  $("#profile-title").textContent = on ? "Lengkapi profil tubuhmu" : "Profil tubuh";
  $("#profile-submit").textContent = on ? "Simpan & mulai" : "Simpan & hitung ulang target";
}
function renderProfile() {
  const p = state.profil, blank = !state.onboarded; // akun baru: form kosong, wajib diisi
  $("#p-nama").value = blank ? "" : state.nama;
  $("#p-tinggi").value = blank ? "" : p.tinggi; $("#p-berat").value = blank ? "" : p.berat; $("#p-usia").value = blank ? "" : p.usia;
  $("#p-gender").value = p.gender; $("#p-aktivitas").value = p.aktivitas; formTujuan = p.tujuan;
  renderSeg(); updateBmiPreview();
}
function renderSeg() { document.querySelectorAll("#p-tujuan button").forEach((b) => b.classList.toggle("on", b.dataset.v === formTujuan)); }
function updateBmiPreview() {
  const t = Number($("#p-tinggi").value), b = Number($("#p-berat").value);
  $("#p-bmi").textContent = t > 0 && b > 0 ? angka(r1(b / (t / 100) ** 2)) : "—";
  showHint($("#profile-hint"), b, t);
}

function renderAll() { renderToday(); renderMenu(); renderProgress(); renderProfile(); }

// ---------------------------------------------------------------- EVENTS
function showTab(name) {
  if (!state.onboarded && name !== "profile") { toast("Lengkapi profil tubuhmu dulu ya"); name = "profile"; }
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.id === "tab-" + name));
  document.querySelectorAll("[data-tab]").forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---------------------------------------------------------------- MASUK / DAFTAR
let authMode = "login";
function setAuthMode(m) {
  authMode = m;
  const login = m === "login";
  document.querySelectorAll("#auth-mode button").forEach((b) => b.classList.toggle("on", b.dataset.auth === m));
  $("#auth-title").textContent = login ? "Selamat datang kembali 👋" : "Buat akun baru 🚀";
  $("#auth-sub").textContent = login ? "Masuk dengan email & kata sandi untuk melanjutkan." : "Daftar dengan email & kata sandi, lalu lengkapi profil tubuhmu.";
  $("#auth-submit").textContent = login ? "Masuk" : "Buat akun";
  $("#a-pass").autocomplete = login ? "current-password" : "new-password";
  $("#demo-btn").classList.toggle("hidden", !login);
  $("#auth-error").classList.add("hidden");
}
function showAuth(msg) {
  $("#auth").classList.remove("hidden");
  $("#a-pass").value = "";
  if (msg) { $("#auth-error").textContent = msg; $("#auth-error").classList.remove("hidden"); }
}
function enterApp(email, saved) {
  userEmail = email;
  adopt(saved);
  $("#auth").classList.add("hidden");
  $("#account-email").textContent = email;
  renderAll();
  setOnboarding(!state.onboarded);
  showTab(state.onboarded ? "today" : "profile");
}

document.querySelectorAll("#auth-mode button").forEach((b) => b.addEventListener("click", () => setAuthMode(b.dataset.auth)));
$("#auth-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = $("#a-email").value.trim(), password = $("#a-pass").value;
  const err = $("#auth-error"), btn = $("#auth-submit");
  err.classList.add("hidden");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = "Format email tidak valid."; err.classList.remove("hidden"); return; }
  if (password.length < 6) { err.textContent = "Kata sandi minimal 6 karakter."; err.classList.remove("hidden"); return; }
  btn.disabled = true;
  try {
    const d = await request("POST", authMode === "login" ? "/api/login" : "/api/register", { email, password });
    $("#a-pass").value = "";
    enterApp(d.email, d.state);
  } catch (ex) {
    err.textContent = ex.message; err.classList.remove("hidden");
  } finally { btn.disabled = false; }
});
$("#demo-btn").addEventListener("click", () => {
  $("#a-email").value = "demo@blumeal.id"; $("#a-pass").value = "demo1234";
  $("#auth-form").requestSubmit();
});
$("#logout-btn").addEventListener("click", async () => {
  await flushSave();
  try { await request("POST", "/api/logout"); } catch { /* tetap keluar di sisi klien */ }
  location.reload();
});

document.addEventListener("click", (e) => {
  const t = e.target.closest("button, a");
  if (!t) return;
  const d = t.dataset;
  if (d.tab) { e.preventDefault(); showTab(d.tab); return; }
  if (d.bahan) { state.bahan = state.bahan.includes(d.bahan) ? state.bahan.filter((x) => x !== d.bahan) : [...state.bahan, d.bahan]; save(); renderMenu(); return; }
  if (d.alergi) { state.alergi = state.alergi.includes(d.alergi) ? state.alergi.filter((x) => x !== d.alergi) : [...state.alergi, d.alergi]; save(); renderMenu(); return; }
  if (d.budget !== undefined) { state.budget_max = d.budget === "null" ? null : Number(d.budget); save(); renderMenu(); return; }
  if (d.time !== undefined) { state.menit_max = d.time === "null" ? null : Number(d.time); save(); renderMenu(); return; }
  if (d.open) { openRecipe(d.open); return; }
  if (d.close !== undefined) { closeSheet(); return; }
  if (d.waktu && current) { current.waktu = d.waktu; document.querySelectorAll("#waktu-seg button").forEach((b) => b.classList.toggle("on", b.dataset.waktu === d.waktu)); return; }
  if (d.log !== undefined && current) {
    if (targetReached()) { applyTargetLock(); return; }
    logRecipe(current.it, current.waktu); t.textContent = "✅ Tercatat — catat lagi"; applyTargetLock(); return;
  }
  if (d.fav !== undefined && current) {
    const id = current.it.id;
    state.favorites = state.favorites.includes(id) ? state.favorites.filter((x) => x !== id) : [...state.favorites, id];
    t.textContent = state.favorites.includes(id) ? "❤️" : "🤍"; save(); renderMenu(); return;
  }
  if (d.dtab && current) { current.tab = d.dtab; renderDetailTab(); return; }
  if (d.del) { state.logs = state.logs.filter((l) => l.id !== d.del); save(); renderToday(); renderProgress(); toast("Catatan dihapus"); return; }
  if (d.goal) { state.profil.tujuan = d.goal; save(); renderAll(); toast(`Tujuan diganti ke ${TUJUAN_LABEL[d.goal]}`); return; }
  if (d.v) { formTujuan = d.v; renderSeg(); }
});

$("#overlay").addEventListener("click", closeSheet);
document.addEventListener("keydown", (e) => e.key === "Escape" && closeSheet());
$("#bahan-search").addEventListener("input", renderBahan);
$("#menu-search").addEventListener("input", renderMenu);
$("#filter-toggle").addEventListener("click", () => $("#filter-panel").classList.toggle("hidden"));
$("#fav-filter").addEventListener("click", () => { onlyFav = !onlyFav; renderMenu(); });

$("#relog-btn").addEventListener("click", () => {
  if (targetReached()) { applyTargetLock(); return; }
  const pending = yesterdayPending();
  pending.forEach((l) => state.logs.push({ ...l, id: crypto.randomUUID(), date: todayIso() }));
  save(); renderToday(); renderProgress();
  toast(`${pending.length} makanan kemarin dicatat · ${angka(pending.reduce((a, l) => a + l.kalori, 0))} kkal`);
});

$("#weight-input").addEventListener("input", (e) => showHint($("#weight-hint"), Number(e.target.value.replace(",", ".")), state.profil.tinggi));
$("#weight-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const b = Number($("#weight-input").value.replace(",", "."));
  if (!(b >= 30 && b <= 250)) { toast("Berat harus antara 30-250 kg"); return; }
  setWeight(b);
  $("#weight-input").value = ""; $("#weight-hint").classList.add("hidden");
  toast("Berat dicatat, target kalori diperbarui");
});

["p-tinggi", "p-berat"].forEach((id) => $("#" + id).addEventListener("input", updateBmiPreview));
$("#profile-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const onboarding = !state.onboarded;
  const fail = (m) => { $("#profile-error").textContent = m; $("#profile-error").classList.remove("hidden"); };
  if (onboarding && !$("#p-nama").value.trim()) return fail("Nama panggilan wajib diisi.");
  for (const [id, l] of [["p-tinggi", "Tinggi"], ["p-berat", "Berat"], ["p-usia", "Usia"]]) if ($("#" + id).value.trim() === "") return fail(`${l} wajib diisi.`);
  const v = { tinggi: Number($("#p-tinggi").value), berat: Number($("#p-berat").value), usia: Math.round(Number($("#p-usia").value)) };
  const lim = { tinggi: [100, 250, "Tinggi"], berat: [30, 250, "Berat"], usia: [12, 80, "Usia"] };
  for (const [k, [mn, mx, l]] of Object.entries(lim)) {
    if (!(v[k] >= mn && v[k] <= mx)) { $("#profile-error").textContent = `${l} harus antara ${mn}-${mx}.`; $("#profile-error").classList.remove("hidden"); return; }
  }
  $("#profile-error").classList.add("hidden");
  if (v.berat !== state.profil.berat) state.weights[todayIso()] = r1(v.berat); // berat baru masuk grafik
  state.nama = $("#p-nama").value.trim();
  const wasOnboarded = state.onboarded;
  state.onboarded = true; setOnboarding(false);
  state.profil = { ...v, gender: $("#p-gender").value, aktivitas: $("#p-aktivitas").value, tujuan: formTujuan };
  save(); renderAll(); toast("Profil disimpan, target dihitung ulang");
  if (!wasOnboarded) showTab("today");
});

$("#reset-btn").addEventListener("click", () => {
  if (!confirm("Hapus semua data BluMeal di akun ini? Profil akan diatur ulang.")) return;
  state = structuredClone(DEFAULT_STATE); save(); renderAll();
  setOnboarding(true); showTab("profile"); toast("Data dihapus");
});

// ---------------------------------------------------------------- START
(async function boot() {
  setAuthMode("login");
  try {
    const d = await request("GET", "/api/me");
    if (d.email) enterApp(d.email, d.state); else showAuth();
  } catch { showAuth(NO_SERVER); }
})();
