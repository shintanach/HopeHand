import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, MapPin, Users, Heart, ArrowLeft, CheckCircle } from "lucide-react";

const filters = ["Semua", "Kegiatan", "Donasi Barang", "Donasi Uang", "Kota"];

const orphanages = [
  {
    id: 1,
    name: "Panti Asuhan Harapan Bangsa",
    city: "Jakarta Selatan",
    description:
      "Panti asuhan yang berfokus pada pendidikan dan pengembangan karakter anak yatim piatu",
    verified: true,
    volunteers: 45,
    donations: 120,
    image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400",
  },
  {
    id: 2,
    name: "Panti Sosial Kasih Sayang",
    city: "Bandung",
    description:
      "Memberikan tempat tinggal dan kasih sayang untuk anak-anak kurang mampu sejak 1995",
    verified: true,
    volunteers: 32,
    donations: 89,
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400",
  },
  {
    id: 3,
    name: "Panti Asuhan Bina Sejahtera",
    city: "Jakarta Timur",
    description:
      "Membina dan mendidik anak dengan program keterampilan dan kemandirian",
    verified: true,
    volunteers: 28,
    donations: 65,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400",
  },
];

export default function ExploreScreen() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-cream pb-20">
      {/* Header */}
      <div className="bg-cream sticky top-0 z-10 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl">Explore</h1>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari panti atau kegiatan..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/50"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedFilter === filter
                  ? "bg-coral text-white"
                  : "bg-white text-foreground hover:bg-coral/10"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Orphanage Cards */}
        <div className="space-y-4">
          {orphanages.map((orphanage) => (
            <div
              key={orphanage.id}
              className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              {/* Cover Photo */}
              <div className="relative">
                <img
                  src={orphanage.image}
                  alt={orphanage.name}
                  className="w-full h-48 object-cover"
                />
                {orphanage.verified && (
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-teal" />
                    <span className="text-xs text-foreground">Terverifikasi</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-lg mb-1">{orphanage.name}</h3>
                  <p className="text-sm text-foreground/60 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {orphanage.city}
                  </p>
                </div>

                <p className="text-sm text-foreground/70 line-clamp-2">
                  {orphanage.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-foreground/60">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {orphanage.volunteers} Relawan
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {orphanage.donations} Donasi
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if no results) */}
        {searchQuery && orphanages.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto text-foreground/20 mb-4" />
            <p className="text-foreground/60">
              Panti tidak ditemukan. Coba kata kunci lain.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
