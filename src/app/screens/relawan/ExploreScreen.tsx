import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, MapPin, Users, Home, ArrowLeft, CheckCircle } from "lucide-react";
import { pantiDB } from "@/imports/appwrite/database";
import { getPreviewUrl } from "@/imports/appwrite/storage";
import { INDONESIAN_REGIONS } from "@/imports/regions";
import type { PantiDocument } from "@/imports/appwrite/types";

export default function ExploreScreen() {
  const navigate = useNavigate();
  const [pantiList, setPantiList] = useState<PantiDocument[]>([]);
  const [loading, setLoading] = useState(true);

  // States untuk filter bertingkat
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("Semua");
  const [selectedCity, setSelectedCity] = useState("Semua");

  useEffect(() => {
    pantiDB.listVerified()
      .then((res) => setPantiList(res.documents))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Handler ketika ganti Provinsi
  const handleProvinceChange = (prov: string) => {
    setSelectedProvince(prov);
    setSelectedCity("Semua"); // reset pilihan kota/kabupaten
  };

  // Dapatkan daftar kota berdasarkan provinsi yang sedang dipilih
  const availableCities = selectedProvince === "Semua" 
    ? [] 
    : INDONESIAN_REGIONS.find(r => r.name === selectedProvince)?.cities || [];

  // Filter logika
  const filtered = pantiList.filter((p) => {
    // 1. Search Query (nama panti, kota, atau provinsi)
    const matchSearch = !searchQuery || 
      p.namaPanti.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.kota.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.provinsi.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Filter Provinsi
    const matchProvince = selectedProvince === "Semua" || 
      p.provinsi.toLowerCase() === selectedProvince.toLowerCase();

    // 3. Filter Kota
    const matchCity = selectedCity === "Semua" || 
      p.kota.toLowerCase() === selectedCity.toLowerCase();

    return matchSearch && matchProvince && matchCity;
  });

  return (
    <div className="min-h-screen bg-cream pb-20">
      {/* Header */}
      <div className="bg-cream sticky top-0 z-10 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-foreground">Explore Panti</h1>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Cari nama panti, kota, atau provinsi..." 
              className="w-full pl-11 pr-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/50" 
            />
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        
        {/* Filter Section */}
        <div className="bg-white p-4 rounded-2xl border border-border/40 space-y-3">
          {/* Dropdown Provinsi */}
          <div>
            <label className="block text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-1.5">Provinsi</label>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button 
                onClick={() => handleProvinceChange("Semua")} 
                className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${selectedProvince === "Semua" ? "bg-coral text-white" : "bg-cream text-foreground hover:bg-coral/10"}`}
              >
                Semua Provinsi
              </button>
              {INDONESIAN_REGIONS.map((region) => (
                <button 
                  key={region.name} 
                  onClick={() => handleProvinceChange(region.name)} 
                  className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${selectedProvince === region.name ? "bg-coral text-white" : "bg-cream text-foreground hover:bg-coral/10"}`}
                >
                  {region.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dropdown Kabupaten/Kota (Hanya tampil jika ada provinsi yang dipilih selain 'Semua') */}
          {selectedProvince !== "Semua" && availableCities.length > 0 && (
            <div className="pt-2 border-t border-dashed border-border/50 animate-fadeIn">
              <label className="block text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-1.5">Kabupaten / Kota</label>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <button 
                  onClick={() => setSelectedCity("Semua")} 
                  className={`px-4 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${selectedCity === "Semua" ? "bg-teal text-white" : "bg-cream text-foreground hover:bg-teal/10"}`}
                >
                  Semua Kota/Kab
                </button>
                {availableCities.map((city) => (
                  <button 
                    key={city} 
                    onClick={() => setSelectedCity(city)} 
                    className={`px-4 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${selectedCity === city ? "bg-teal text-white" : "bg-cream text-foreground hover:bg-teal/10"}`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* List Panti */}
        {loading ? (
          <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl p-8 border border-border/40">
            <Home className="w-16 h-16 mx-auto text-foreground/20 mb-4" />
            <p className="text-foreground/60">Panti tidak ditemukan. Coba filter atau kata kunci lain.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((panti) => (
              <div key={panti.$id} className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow border border-border/40">
                {panti.fotoPanti ? (
                  <img src={getPreviewUrl(panti.fotoPanti, 800).toString()} alt={panti.namaPanti} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-teal/20 to-coral/10 flex items-center justify-center">
                    <Home className="w-16 h-16 text-teal/30" />
                  </div>
                )}
                <div className="p-4 space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold text-foreground">{pantiDocName(panti.namaPanti)}</h3>
                      <div className="shrink-0 bg-white border border-teal/30 rounded-full px-3 py-1 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-teal" />
                        <span className="text-xs text-teal">Terverifikasi</span>
                      </div>
                    </div>
                    <p className="text-sm text-foreground/60 flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4 text-coral" />{panti.kota}, {panti.provinsi}
                    </p>
                  </div>
                  <p className="text-sm text-foreground/75 leading-relaxed line-clamp-2">{panti.deskripsi}</p>
                  <div className="flex items-center gap-4 text-sm text-foreground/60 border-t border-border/40 pt-3">
                    <span className="flex items-center gap-1"><Users className="w-4 h-4 text-teal" />{panti.jumlahAnak} anak asuh</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper untuk membersihkan kata Panti Asuhan berulang
function pantiDocName(name: string) {
  return name.replace(/^(Panti Asuhan|Panti)\s+/i, "Panti Asuhan ");
}
