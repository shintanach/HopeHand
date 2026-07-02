export interface ProvinceRegion {
  name: string;
  cities: string[];
}

export const INDONESIAN_REGIONS: ProvinceRegion[] = [
  {
    name: "Aceh",
    cities: ["Banda Aceh", "Sabang", "Langsa", "Lhokseumawe", "Subulussalam", "Aceh Besar", "Aceh Utara", "Aceh Timur", "Aceh Selatan", "Aceh Barat"]
  },
  {
    name: "Sumatera Utara",
    cities: ["Medan", "Binjai", "Pematangsiantar", "Tebing Tinggi", "Tanjungbalai", "Sibolga", "Padangsidimpuan", "Gunungsitoli", "Deli Serdang", "Langkat", "Simalungun", "Asahan", "Labuhanbatu", "Tapanuli Utara", "Tapanuli Selatan", "Nias"]
  },
  {
    name: "Sumatera Barat",
    cities: ["Padang", "Bukittinggi", "Padangpanjang", "Payakumbuh", "Sawahlunto", "Solok", "Pariaman", "Agam", "Tanah Datar", "Pesisir Selatan"]
  },
  {
    name: "Riau",
    cities: ["Pekanbaru", "Dumai", "Kampar", "Bengkalis", "Rokan Hulu", "Rokan Hilir", "Indragiri Hulu", "Indragiri Hilir"]
  },
  {
    name: "Kepulauan Riau",
    cities: ["Tanjungpinang", "Batam", "Bintan", "Karimun", "Natuna"]
  },
  {
    name: "Jambi",
    cities: ["Jambi", "Sungai Penuh", "Batanghari", "Muaro Jambi", "Tebo", "Bungo"]
  },
  {
    name: "Sumatera Selatan",
    cities: ["Palembang", "Prabumulih", "Pagaralam", "Lubuklinggau", "Banyuasin", "Musi Banyuasin", "Ogan Ilir", "Muara Enim"]
  },
  {
    name: "Bangka Belitung",
    cities: ["Pangkalpinang", "Bangka", "Belitung", "Bangka Barat", "Bangka Tengah", "Bangka Selatan"]
  },
  {
    name: "Bengkulu",
    cities: ["Bengkulu", "Rejang Lebong", "Bengkulu Selatan", "Bengkulu Utara"]
  },
  {
    name: "Lampung",
    cities: ["Bandar Lampung", "Metro", "Lampung Selatan", "Lampung Tengah", "Lampung Utara", "Lampung Barat", "Pringsewu", "Pesawaran"]
  },
  {
    name: "DKI Jakarta",
    cities: ["Jakarta Pusat", "Jakarta Utara", "Jakarta Barat", "Jakarta Selatan", "Jakarta Timur", "Kepulauan Seribu"]
  },
  {
    name: "Banten",
    cities: ["Tangerang", "Tangerang Selatan", "Serang", "Cilegon", "Lebak", "Pandeglang"]
  },
  {
    name: "Jawa Barat",
    cities: ["Bandung", "Bandung Barat", "Bogor", "Bekasi", "Depok", "Cimahi", "Sukabumi", "Tasikmalaya", "Cirebon", "Garut", "Ciamis", "Kuningan", "Majalengka", "Subang", "Purwakarta", "Karawang", "Indramayu", "Sumedang", "Pangandaran"]
  },
  {
    name: "Jawa Tengah",
    cities: ["Semarang", "Solo", "Magelang", "Salatiga", "Pekalongan", "Tegal", "Kudus", "Jepara", "Demak", "Grobogan", "Blora", "Rembang", "Pati", "Kendal", "Batang", "Pemalang", "Brebes", "Purbalingga", "Banjarnegara", "Wonosobo", "Temanggung", "Klaten", "Boyolali", "Sragen", "Karanganyar", "Wonogiri", "Sukoharjo", "Purworejo", "Kebumen", "Cilacap", "Banyumas"]
  },
  {
    name: "DI Yogyakarta",
    cities: ["Yogyakarta", "Sleman", "Bantul", "Gunung Kidul", "Kulon Progo"]
  },
  {
    name: "Jawa Timur",
    cities: ["Surabaya", "Malang", "Kediri", "Blitar", "Madiun", "Mojokerto", "Probolinggo", "Pasuruan", "Batu", "Sidoarjo", "Gresik", "Lamongan", "Tuban", "Bojonegoro", "Ngawi", "Magetan", "Ponorogo", "Pacitan", "Trenggalek", "Tulungagung", "Lumajang", "Jember", "Banyuwangi", "Situbondo", "Bondowoso", "Jombang", "Nganjuk", "Sampang", "Pamekasan", "Sumenep", "Bangkalan"]
  },
  {
    name: "Bali",
    cities: ["Denpasar", "Badung", "Gianyar", "Tabanan", "Klungkung", "Bangli", "Karangasem", "Buleleng", "Jembrana"]
  },
  {
    name: "Nusa Tenggara Barat",
    cities: ["Mataram", "Bima", "Lombok Barat", "Lombok Tengah", "Lombok Timur", "Lombok Utara", "Sumbawa", "Dompu"]
  },
  {
    name: "Nusa Tenggara Timur",
    cities: ["Kupang", "Ende", "Flores", "Manggarai", "Sikka", "Timor Tengah Selatan", "Timor Tengah Utara", "Sumba Barat", "Sumba Timur", "Alor"]
  },
  {
    name: "Kalimantan Barat",
    cities: ["Pontianak", "Singkawang", "Sambas", "Ketapang", "Sanggau", "Sintang", "Kapuas Hulu"]
  },
  {
    name: "Kalimantan Tengah",
    cities: ["Palangka Raya", "Kotawaringin Barat", "Kotawaringin Timur", "Kapuas", "Barito Selatan", "Barito Utara"]
  },
  {
    name: "Kalimantan Selatan",
    cities: ["Banjarmasin", "Banjarbaru", "Tanah Laut", "Banjar", "Tapin", "Hulu Sungai Selatan", "Hulu Sungai Utara", "Tabalong"]
  },
  {
    name: "Kalimantan Timur",
    cities: ["Samarinda", "Balikpapan", "Bontang", "Kutai Kartanegara", "Berau", "Paser", "Penajam Paser Utara"]
  },
  {
    name: "Kalimantan Utara",
    cities: ["Tarakan", "Nunukan", "Malinau", "Bulungan"]
  },
  {
    name: "Sulawesi Utara",
    cities: ["Manado", "Tomohon", "Bitung", "Kotamobagu", "Minahasa", "Bolaang Mongondow"]
  },
  {
    name: "Gorontalo",
    cities: ["Gorontalo", "Bone Bolango", "Pohuwato"]
  },
  {
    name: "Sulawesi Tengah",
    cities: ["Palu", "Donggala", "Poso", "Tolitoli", "Banggai", "Morowali"]
  },
  {
    name: "Sulawesi Barat",
    cities: ["Mamuju", "Majene", "Polewali Mandar", "Mamasa"]
  },
  {
    name: "Sulawesi Selatan",
    cities: ["Makassar", "Parepare", "Palopo", "Gowa", "Maros", "Pangkajene", "Barru", "Bone", "Soppeng", "Wajo", "Sidenreng Rappang", "Pinrang", "Enrekang", "Luwu", "Tana Toraja", "Bantaeng", "Jeneponto", "Takalar", "Selayar"]
  },
  {
    name: "Sulawesi Tenggara",
    cities: ["Kendari", "Baubau", "Konawe", "Kolaka", "Muna", "Buton", "Wakatobi"]
  },
  {
    name: "Maluku",
    cities: ["Ambon", "Tual", "Maluku Tengah", "Maluku Tenggara", "Seram Bagian Barat", "Seram Bagian Timur", "Buru"]
  },
  {
    name: "Maluku Utara",
    cities: ["Ternate", "Tidore Kepulauan", "Halmahera Barat", "Halmahera Utara", "Halmahera Selatan", "Halmahera Timur"]
  },
  {
    name: "Papua Barat",
    cities: ["Manokwari", "Sorong", "Raja Ampat", "Teluk Bintuni", "Teluk Wondama"]
  },
  {
    name: "Papua",
    cities: ["Jayapura", "Merauke", "Biak", "Mimika", "Nabire", "Yahukimo", "Pegunungan Bintang", "Asmat", "Puncak Jaya", "Waropen"]
  }
];
