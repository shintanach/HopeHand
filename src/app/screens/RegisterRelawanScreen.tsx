import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Camera, Eye, EyeOff, AlertCircle, X } from "lucide-react";
import { registerRelawan, getAuthErrorMessage } from "@/imports/appwrite/auth";
import { uploadFotoProfil } from "@/imports/appwrite/storage";

export default function RegisterRelawanScreen() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    password: "",
    confirmPassword: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFotoFile(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveFoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFotoFile(null);
    setFotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      let uploadedFileId = undefined;
      if (fotoFile) {
        const uploadRes = await uploadFotoProfil(fotoFile);
        uploadedFileId = uploadRes.$id;
      }

      await registerRelawan({
        nama: formData.fullName,
        email: formData.email,
        password: formData.password,
        telepon: `+62${formData.phone}`,
        alamat: formData.city,
        fotoProfil: uploadedFileId,
      });
      navigate("/email-verification");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl">Buat Akun</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo Upload */}
          <div className="flex justify-center">
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative w-32 h-32 rounded-full bg-coral/10 border-2 border-dashed border-coral flex items-center justify-center hover:bg-coral/20 transition-colors overflow-hidden group"
            >
              {fotoPreview ? (
                <>
                  <img src={fotoPreview} alt="Preview Foto" className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={handleRemoveFoto}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </>
              ) : (
                <>
                  <Camera className="w-8 h-8 text-coral animate-pulse" />
                  <div className="absolute bottom-2 bg-white/80 px-2 py-0.5 rounded-full text-[10px] text-foreground/60">
                    Tambah Foto
                  </div>
                </>
              )}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2 text-foreground/70">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-foreground/70">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-foreground/70">
                Nomor HP
              </label>
              <div className="flex gap-2">
                <div className="px-4 py-3 bg-muted border border-border rounded-xl text-foreground/60">
                  +62
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="flex-1 px-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-foreground/70">
                Kota/Domisili
              </label>
              <select
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/50"
                required
              >
                <option value="">Pilih Kota/Kabupaten</option>
                {/* Aceh */}
                <optgroup label="Aceh">
                  <option value="Banda Aceh">Banda Aceh</option>
                  <option value="Sabang">Sabang</option>
                  <option value="Langsa">Langsa</option>
                  <option value="Lhokseumawe">Lhokseumawe</option>
                  <option value="Subulussalam">Subulussalam</option>
                  <option value="Aceh Besar">Aceh Besar</option>
                  <option value="Aceh Utara">Aceh Utara</option>
                  <option value="Aceh Timur">Aceh Timur</option>
                  <option value="Aceh Selatan">Aceh Selatan</option>
                  <option value="Aceh Barat">Aceh Barat</option>
                </optgroup>
                {/* Sumatera Utara */}
                <optgroup label="Sumatera Utara">
                  <option value="Medan">Medan</option>
                  <option value="Binjai">Binjai</option>
                  <option value="Pematangsiantar">Pematangsiantar</option>
                  <option value="Tebing Tinggi">Tebing Tinggi</option>
                  <option value="Tanjungbalai">Tanjungbalai</option>
                  <option value="Sibolga">Sibolga</option>
                  <option value="Padangsidimpuan">Padangsidimpuan</option>
                  <option value="Gunungsitoli">Gunungsitoli</option>
                  <option value="Deli Serdang">Deli Serdang</option>
                  <option value="Langkat">Langkat</option>
                  <option value="Simalungun">Simalungun</option>
                  <option value="Asahan">Asahan</option>
                  <option value="Labuhanbatu">Labuhanbatu</option>
                  <option value="Tapanuli Utara">Tapanuli Utara</option>
                  <option value="Tapanuli Selatan">Tapanuli Selatan</option>
                  <option value="Nias">Nias</option>
                </optgroup>
                {/* Sumatera Barat */}
                <optgroup label="Sumatera Barat">
                  <option value="Padang">Padang</option>
                  <option value="Bukittinggi">Bukittinggi</option>
                  <option value="Padangpanjang">Padangpanjang</option>
                  <option value="Payakumbuh">Payakumbuh</option>
                  <option value="Sawahlunto">Sawahlunto</option>
                  <option value="Solok">Solok</option>
                  <option value="Pariaman">Pariaman</option>
                  <option value="Agam">Agam</option>
                  <option value="Tanah Datar">Tanah Datar</option>
                  <option value="Pesisir Selatan">Pesisir Selatan</option>
                </optgroup>
                {/* Riau */}
                <optgroup label="Riau">
                  <option value="Pekanbaru">Pekanbaru</option>
                  <option value="Dumai">Dumai</option>
                  <option value="Kampar">Kampar</option>
                  <option value="Bengkalis">Bengkalis</option>
                  <option value="Rokan Hulu">Rokan Hulu</option>
                  <option value="Rokan Hilir">Rokan Hilir</option>
                  <option value="Indragiri Hulu">Indragiri Hulu</option>
                  <option value="Indragiri Hilir">Indragiri Hilir</option>
                </optgroup>
                {/* Kepulauan Riau */}
                <optgroup label="Kepulauan Riau">
                  <option value="Tanjungpinang">Tanjungpinang</option>
                  <option value="Batam">Batam</option>
                  <option value="Bintan">Bintan</option>
                  <option value="Karimun">Karimun</option>
                  <option value="Natuna">Natuna</option>
                </optgroup>
                {/* Jambi */}
                <optgroup label="Jambi">
                  <option value="Jambi">Jambi</option>
                  <option value="Sungai Penuh">Sungai Penuh</option>
                  <option value="Batanghari">Batanghari</option>
                  <option value="Muaro Jambi">Muaro Jambi</option>
                  <option value="Tebo">Tebo</option>
                  <option value="Bungo">Bungo</option>
                </optgroup>
                {/* Sumatera Selatan */}
                <optgroup label="Sumatera Selatan">
                  <option value="Palembang">Palembang</option>
                  <option value="Prabumulih">Prabumulih</option>
                  <option value="Pagaralam">Pagaralam</option>
                  <option value="Lubuklinggau">Lubuklinggau</option>
                  <option value="Banyuasin">Banyuasin</option>
                  <option value="Musi Banyuasin">Musi Banyuasin</option>
                  <option value="Ogan Ilir">Ogan Ilir</option>
                  <option value="Muara Enim">Muara Enim</option>
                </optgroup>
                {/* Bangka Belitung */}
                <optgroup label="Bangka Belitung">
                  <option value="Pangkalpinang">Pangkalpinang</option>
                  <option value="Bangka">Bangka</option>
                  <option value="Belitung">Belitung</option>
                  <option value="Bangka Barat">Bangka Barat</option>
                  <option value="Bangka Tengah">Bangka Tengah</option>
                  <option value="Bangka Selatan">Bangka Selatan</option>
                </optgroup>
                {/* Bengkulu */}
                <optgroup label="Bengkulu">
                  <option value="Bengkulu">Bengkulu</option>
                  <option value="Rejang Lebong">Rejang Lebong</option>
                  <option value="Bengkulu Selatan">Bengkulu Selatan</option>
                  <option value="Bengkulu Utara">Bengkulu Utara</option>
                </optgroup>
                {/* Lampung */}
                <optgroup label="Lampung">
                  <option value="Bandar Lampung">Bandar Lampung</option>
                  <option value="Metro">Metro</option>
                  <option value="Lampung Selatan">Lampung Selatan</option>
                  <option value="Lampung Tengah">Lampung Tengah</option>
                  <option value="Lampung Utara">Lampung Utara</option>
                  <option value="Lampung Barat">Lampung Barat</option>
                  <option value="Pringsewu">Pringsewu</option>
                  <option value="Pesawaran">Pesawaran</option>
                </optgroup>
                {/* DKI Jakarta */}
                <optgroup label="DKI Jakarta">
                  <option value="Jakarta Pusat">Jakarta Pusat</option>
                  <option value="Jakarta Utara">Jakarta Utara</option>
                  <option value="Jakarta Barat">Jakarta Barat</option>
                  <option value="Jakarta Selatan">Jakarta Selatan</option>
                  <option value="Jakarta Timur">Jakarta Timur</option>
                  <option value="Kepulauan Seribu">Kepulauan Seribu</option>
                </optgroup>
                {/* Banten */}
                <optgroup label="Banten">
                  <option value="Tangerang">Tangerang</option>
                  <option value="Tangerang Selatan">Tangerang Selatan</option>
                  <option value="Serang">Serang</option>
                  <option value="Cilegon">Cilegon</option>
                  <option value="Lebak">Lebak</option>
                  <option value="Pandeglang">Pandeglang</option>
                </optgroup>
                {/* Jawa Barat */}
                <optgroup label="Jawa Barat">
                  <option value="Bandung">Bandung</option>
                  <option value="Bandung Barat">Bandung Barat</option>
                  <option value="Bogor">Bogor</option>
                  <option value="Bekasi">Bekasi</option>
                  <option value="Depok">Depok</option>
                  <option value="Cimahi">Cimahi</option>
                  <option value="Sukabumi">Sukabumi</option>
                  <option value="Tasikmalaya">Tasikmalaya</option>
                  <option value="Cirebon">Cirebon</option>
                  <option value="Garut">Garut</option>
                  <option value="Ciamis">Ciamis</option>
                  <option value="Kuningan">Kuningan</option>
                  <option value="Majalengka">Majalengka</option>
                  <option value="Subang">Subang</option>
                  <option value="Purwakarta">Purwakarta</option>
                  <option value="Karawang">Karawang</option>
                  <option value="Indramayu">Indramayu</option>
                  <option value="Sumedang">Sumedang</option>
                  <option value="Pangandaran">Pangandaran</option>
                </optgroup>
                {/* Jawa Tengah */}
                <optgroup label="Jawa Tengah">
                  <option value="Semarang">Semarang</option>
                  <option value="Solo">Solo</option>
                  <option value="Magelang">Magelang</option>
                  <option value="Salatiga">Salatiga</option>
                  <option value="Pekalongan">Pekalongan</option>
                  <option value="Tegal">Tegal</option>
                  <option value="Kudus">Kudus</option>
                  <option value="Jepara">Jepara</option>
                  <option value="Demak">Demak</option>
                  <option value="Grobogan">Grobogan</option>
                  <option value="Blora">Blora</option>
                  <option value="Rembang">Rembang</option>
                  <option value="Pati">Pati</option>
                  <option value="Kendal">Kendal</option>
                  <option value="Batang">Batang</option>
                  <option value="Pemalang">Pemalang</option>
                  <option value="Brebes">Brebes</option>
                  <option value="Purbalingga">Purbalingga</option>
                  <option value="Banjarnegara">Banjarnegara</option>
                  <option value="Wonosobo">Wonosobo</option>
                  <option value="Temanggung">Temanggung</option>
                  <option value="Klaten">Klaten</option>
                  <option value="Boyolali">Boyolali</option>
                  <option value="Sragen">Sragen</option>
                  <option value="Karanganyar">Karanganyar</option>
                  <option value="Wonogiri">Wonogiri</option>
                  <option value="Sukoharjo">Sukoharjo</option>
                  <option value="Purworejo">Purworejo</option>
                  <option value="Kebumen">Kebumen</option>
                  <option value="Cilacap">Cilacap</option>
                  <option value="Banyumas">Banyumas</option>
                </optgroup>
                {/* DI Yogyakarta */}
                <optgroup label="DI Yogyakarta">
                  <option value="Yogyakarta">Yogyakarta</option>
                  <option value="Sleman">Sleman</option>
                  <option value="Bantul">Bantul</option>
                  <option value="Gunung Kidul">Gunung Kidul</option>
                  <option value="Kulon Progo">Kulon Progo</option>
                </optgroup>
                {/* Jawa Timur */}
                <optgroup label="Jawa Timur">
                  <option value="Surabaya">Surabaya</option>
                  <option value="Malang">Malang</option>
                  <option value="Kediri">Kediri</option>
                  <option value="Blitar">Blitar</option>
                  <option value="Madiun">Madiun</option>
                  <option value="Mojokerto">Mojokerto</option>
                  <option value="Probolinggo">Probolinggo</option>
                  <option value="Pasuruan">Pasuruan</option>
                  <option value="Batu">Batu</option>
                  <option value="Sidoarjo">Sidoarjo</option>
                  <option value="Gresik">Gresik</option>
                  <option value="Lamongan">Lamongan</option>
                  <option value="Tuban">Tuban</option>
                  <option value="Bojonegoro">Bojonegoro</option>
                  <option value="Ngawi">Ngawi</option>
                  <option value="Magetan">Magetan</option>
                  <option value="Ponorogo">Ponorogo</option>
                  <option value="Pacitan">Pacitan</option>
                  <option value="Trenggalek">Trenggalek</option>
                  <option value="Tulungagung">Tulungagung</option>
                  <option value="Lumajang">Lumajang</option>
                  <option value="Jember">Jember</option>
                  <option value="Banyuwangi">Banyuwangi</option>
                  <option value="Situbondo">Situbondo</option>
                  <option value="Bondowoso">Bondowoso</option>
                  <option value="Jombang">Jombang</option>
                  <option value="Nganjuk">Nganjuk</option>
                  <option value="Sampang">Sampang</option>
                  <option value="Pamekasan">Pamekasan</option>
                  <option value="Sumenep">Sumenep</option>
                  <option value="Bangkalan">Bangkalan</option>
                </optgroup>
                {/* Bali */}
                <optgroup label="Bali">
                  <option value="Denpasar">Denpasar</option>
                  <option value="Badung">Badung</option>
                  <option value="Gianyar">Gianyar</option>
                  <option value="Tabanan">Tabanan</option>
                  <option value="Klungkung">Klungkung</option>
                  <option value="Bangli">Bangli</option>
                  <option value="Karangasem">Karangasem</option>
                  <option value="Buleleng">Buleleng</option>
                  <option value="Jembrana">Jembrana</option>
                </optgroup>
                {/* NTB */}
                <optgroup label="Nusa Tenggara Barat">
                  <option value="Mataram">Mataram</option>
                  <option value="Bima">Bima</option>
                  <option value="Lombok Barat">Lombok Barat</option>
                  <option value="Lombok Tengah">Lombok Tengah</option>
                  <option value="Lombok Timur">Lombok Timur</option>
                  <option value="Lombok Utara">Lombok Utara</option>
                  <option value="Sumbawa">Sumbawa</option>
                  <option value="Dompu">Dompu</option>
                </optgroup>
                {/* NTT */}
                <optgroup label="Nusa Tenggara Timur">
                  <option value="Kupang">Kupang</option>
                  <option value="Ende">Ende</option>
                  <option value="Flores">Flores</option>
                  <option value="Manggarai">Manggarai</option>
                  <option value="Sikka">Sikka</option>
                  <option value="Timor Tengah Selatan">Timor Tengah Selatan</option>
                  <option value="Timor Tengah Utara">Timor Tengah Utara</option>
                  <option value="Sumba Barat">Sumba Barat</option>
                  <option value="Sumba Timur">Sumba Timur</option>
                  <option value="Alor">Alor</option>
                </optgroup>
                {/* Kalimantan Barat */}
                <optgroup label="Kalimantan Barat">
                  <option value="Pontianak">Pontianak</option>
                  <option value="Singkawang">Singkawang</option>
                  <option value="Sambas">Sambas</option>
                  <option value="Ketapang">Ketapang</option>
                  <option value="Sanggau">Sanggau</option>
                  <option value="Sintang">Sintang</option>
                  <option value="Kapuas Hulu">Kapuas Hulu</option>
                </optgroup>
                {/* Kalimantan Tengah */}
                <optgroup label="Kalimantan Tengah">
                  <option value="Palangka Raya">Palangka Raya</option>
                  <option value="Kotawaringin Barat">Kotawaringin Barat</option>
                  <option value="Kotawaringin Timur">Kotawaringin Timur</option>
                  <option value="Kapuas">Kapuas</option>
                  <option value="Barito Selatan">Barito Selatan</option>
                  <option value="Barito Utara">Barito Utara</option>
                </optgroup>
                {/* Kalimantan Selatan */}
                <optgroup label="Kalimantan Selatan">
                  <option value="Banjarmasin">Banjarmasin</option>
                  <option value="Banjarbaru">Banjarbaru</option>
                  <option value="Tanah Laut">Tanah Laut</option>
                  <option value="Banjar">Banjar</option>
                  <option value="Tapin">Tapin</option>
                  <option value="Hulu Sungai Selatan">Hulu Sungai Selatan</option>
                  <option value="Hulu Sungai Utara">Hulu Sungai Utara</option>
                  <option value="Tabalong">Tabalong</option>
                </optgroup>
                {/* Kalimantan Timur */}
                <optgroup label="Kalimantan Timur">
                  <option value="Samarinda">Samarinda</option>
                  <option value="Balikpapan">Balikpapan</option>
                  <option value="Bontang">Bontang</option>
                  <option value="Kutai Kartanegara">Kutai Kartanegara</option>
                  <option value="Berau">Berau</option>
                  <option value="Paser">Paser</option>
                  <option value="Penajam Paser Utara">Penajam Paser Utara</option>
                </optgroup>
                {/* Kalimantan Utara */}
                <optgroup label="Kalimantan Utara">
                  <option value="Tarakan">Tarakan</option>
                  <option value="Nunukan">Nunukan</option>
                  <option value="Malinau">Malinau</option>
                  <option value="Bulungan">Bulungan</option>
                </optgroup>
                {/* Sulawesi Utara */}
                <optgroup label="Sulawesi Utara">
                  <option value="Manado">Manado</option>
                  <option value="Tomohon">Tomohon</option>
                  <option value="Bitung">Bitung</option>
                  <option value="Kotamobagu">Kotamobagu</option>
                  <option value="Minahasa">Minahasa</option>
                  <option value="Bolaang Mongondow">Bolaang Mongondow</option>
                </optgroup>
                {/* Gorontalo */}
                <optgroup label="Gorontalo">
                  <option value="Gorontalo">Gorontalo</option>
                  <option value="Bone Bolango">Bone Bolango</option>
                  <option value="Pohuwato">Pohuwato</option>
                </optgroup>
                {/* Sulawesi Tengah */}
                <optgroup label="Sulawesi Tengah">
                  <option value="Palu">Palu</option>
                  <option value="Donggala">Donggala</option>
                  <option value="Poso">Poso</option>
                  <option value="Tolitoli">Tolitoli</option>
                  <option value="Banggai">Banggai</option>
                  <option value="Morowali">Morowali</option>
                </optgroup>
                {/* Sulawesi Barat */}
                <optgroup label="Sulawesi Barat">
                  <option value="Mamuju">Mamuju</option>
                  <option value="Majene">Majene</option>
                  <option value="Polewali Mandar">Polewali Mandar</option>
                  <option value="Mamasa">Mamasa</option>
                </optgroup>
                {/* Sulawesi Selatan */}
                <optgroup label="Sulawesi Selatan">
                  <option value="Makassar">Makassar</option>
                  <option value="Parepare">Parepare</option>
                  <option value="Palopo">Palopo</option>
                  <option value="Gowa">Gowa</option>
                  <option value="Maros">Maros</option>
                  <option value="Pangkajene">Pangkajene</option>
                  <option value="Barru">Barru</option>
                  <option value="Bone">Bone</option>
                  <option value="Soppeng">Soppeng</option>
                  <option value="Wajo">Wajo</option>
                  <option value="Sidenreng Rappang">Sidenreng Rappang</option>
                  <option value="Pinrang">Pinrang</option>
                  <option value="Enrekang">Enrekang</option>
                  <option value="Luwu">Luwu</option>
                  <option value="Tana Toraja">Tana Toraja</option>
                  <option value="Bantaeng">Bantaeng</option>
                  <option value="Jeneponto">Jeneponto</option>
                  <option value="Takalar">Takalar</option>
                  <option value="Selayar">Selayar</option>
                </optgroup>
                {/* Sulawesi Tenggara */}
                <optgroup label="Sulawesi Tenggara">
                  <option value="Kendari">Kendari</option>
                  <option value="Baubau">Baubau</option>
                  <option value="Konawe">Konawe</option>
                  <option value="Kolaka">Kolaka</option>
                  <option value="Muna">Muna</option>
                  <option value="Buton">Buton</option>
                  <option value="Wakatobi">Wakatobi</option>
                </optgroup>
                {/* Maluku */}
                <optgroup label="Maluku">
                  <option value="Ambon">Ambon</option>
                  <option value="Tual">Tual</option>
                  <option value="Maluku Tengah">Maluku Tengah</option>
                  <option value="Maluku Tenggara">Maluku Tenggara</option>
                  <option value="Seram Bagian Barat">Seram Bagian Barat</option>
                  <option value="Seram Bagian Timur">Seram Bagian Timur</option>
                  <option value="Buru">Buru</option>
                </optgroup>
                {/* Maluku Utara */}
                <optgroup label="Maluku Utara">
                  <option value="Ternate">Ternate</option>
                  <option value="Tidore Kepulauan">Tidore Kepulauan</option>
                  <option value="Halmahera Barat">Halmahera Barat</option>
                  <option value="Halmahera Utara">Halmahera Utara</option>
                  <option value="Halmahera Selatan">Halmahera Selatan</option>
                  <option value="Halmahera Timur">Halmahera Timur</option>
                </optgroup>
                {/* Papua Barat */}
                <optgroup label="Papua Barat">
                  <option value="Manokwari">Manokwari</option>
                  <option value="Sorong">Sorong</option>
                  <option value="Raja Ampat">Raja Ampat</option>
                  <option value="Teluk Bintuni">Teluk Bintuni</option>
                  <option value="Teluk Wondama">Teluk Wondama</option>
                </optgroup>
                {/* Papua */}
                <optgroup label="Papua">
                  <option value="Jayapura">Jayapura</option>
                  <option value="Merauke">Merauke</option>
                  <option value="Biak">Biak</option>
                  <option value="Mimika">Mimika</option>
                  <option value="Nabire">Nabire</option>
                  <option value="Yahukimo">Yahukimo</option>
                  <option value="Pegunungan Bintang">Pegunungan Bintang</option>
                  <option value="Asmat">Asmat</option>
                  <option value="Puncak Jaya">Puncak Jaya</option>
                  <option value="Waropen">Waropen</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2 text-foreground/70">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 pr-12 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-foreground/70">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className="w-full px-4 py-3 pr-12 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-5 h-5 accent-coral"
              required
            />
            <label htmlFor="terms" className="text-sm text-foreground/70">
              Saya menyetujui{" "}
              <button type="button" className="text-coral hover:underline">
                Syarat & Ketentuan
              </button>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!agreedToTerms || isLoading}
            className="w-full py-3 bg-coral text-white rounded-full hover:bg-coral/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Mendaftarkan..." : "Daftar Sekarang"}
          </button>
        </form>
      </div>
    </div>
  );
}
