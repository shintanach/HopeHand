=====================================================
ACTOR 3: ADMIN
=====================================================

42. Login Screen — Admin
    (Admin reaches login by selecting Admin card 
    on unified Login Screen — see screen 3)
    - Same unified Login Screen as other actors
    - Admin card selected state shows lavender accent
    - No Google SSO, no register link
    - Login button lavender (#B4A7E7)
    - On successful login → Admin Dashboard Screen

43. Dashboard Screen — Admin
    - Header: Hope Hand logo + "Admin Panel" label + 
      bell icon (tap → Notifikasi Screen)
    - "Selamat datang, [Admin Name]" greeting
    - Alert banner (if any pending actions):
        "⚠️ X panti menunggu verifikasi"
        "⚠️ X kampanye menunggu persetujuan"
        Each row tappable → goes to Verifikasi Screen
    - Stats overview (2x2 grid of cards):
        🏠 Total Panti Terverifikasi
        🙋 Total Relawan Aktif
        💰 Total Donasi Uang (Rp)
        📦 Total Donasi Barang
    - Bar chart: "Donasi Uang per Bulan" 
      (last 6 months, coral bars)
    - Recent activity feed:
        Each item: icon + description + timestamp
        "Panti [X] mendaftar dan menunggu verifikasi"
        "[Nama] membuat kampanye [Y]"
        "[Nama] berdonasi Rp X ke [panti]"
    - Bottom navigation:
        📊 Dashboard · ✅ Verifikasi · 
        👥 Pengguna · 📋 Laporan · ⚙️ Pengaturan

44. Verifikasi Screen
    - "Verifikasi" heading
    - Tabs: Panti (X pending) · Kampanye (X pending)
    - [Panti tab]:
        Pending panti cards:
          Panti name bold, pengelola name,
          submission date, city
          "Lihat Detail" lavender button
          → Verifikasi Panti Detail Screen
        Tabs within: 
          Menunggu · Disetujui · Ditolak
    - [Kampanye tab]:
        Pending campaign cards:
          Campaign title, panti name, 
          target dana, submission date
          "Lihat Detail" lavender button
          → Verifikasi Kampanye Detail Screen
        Tabs within:
          Menunggu · Disetujui · Ditolak

45. Verifikasi Panti Detail Screen
    - Back arrow + "Verifikasi Panti" heading
    - Panti info preview:
        Logo + name + pengelola name + city
        Address, description, phone, email
    - Document section:
        "Foto KTP Pengelola": 
          image viewer (pinch to zoom)
        "Surat Izin Panti": 
          image viewer (pinch to zoom)
    - Rekening bank info:
        Bank name, account number, account name
    - Catatan/Notes field (for admin):
        "Tambahkan catatan (opsional)"
        placeholder: "Alasan penolakan, 
        permintaan dokumen tambahan, dll."
    - Action buttons (sticky bottom):
        "✓ Setujui" green pill button
        "✗ Tolak" red outlined button
    - "Setujui" tap flow:
        → Confirmation dialog:
          "Setujui pendaftaran [nama panti]?"
          "Ya, Setujui" · "Batal"
          → Loading spinner
          → Success: back to Verifikasi Screen,
            panti moved to Disetujui tab,
            pengelola receives push notification + 
            email: "Akun panti kamu telah disetujui!"
            toast "Panti berhasil diverifikasi"
    - "Tolak" tap flow:
        → Notes field becomes required (red border)
        → Confirmation dialog:
          "Tolak pendaftaran [nama panti]?"
          shows notes preview
          "Ya, Tolak" red · "Batal"
          → Loading spinner
          → Success: back to Verifikasi Screen,
            panti moved to Ditolak tab,
            pengelola receives notification + email 
            with rejection reason
            toast "Pendaftaran ditolak"

46. Verifikasi Kampanye Detail Screen
    - Back arrow + "Verifikasi Kampanye" heading
    - Campaign photo full-width
    - Campaign title, panti name + verified badge
    - Target dana bold, tenggat waktu
    - Rekening panti verified info
    - Description full
    - Catatan notes field (same as panti verification)
    - Action buttons sticky bottom:
        "✓ Setujui Kampanye" green pill
        "✗ Tolak" red outlined
    - Same tap flows as panti verification:
        Approve → pengelola notified, 
        campaign goes live on app
        Reject → pengelola notified with reason

47. Manajemen Pengguna Screen
    - "Pengguna" heading + search icon
    - Search bar (tap to activate)
    - Filter chips: Semua · Relawan/Donatur · 
      Pengelola Panti · Suspend
    - User list cards:
        Avatar + name + role badge + 
        join date + status badge:
          "Aktif" green · "Suspend" orange · 
          "Banned" red
        Tap card → User Detail Screen
        Swipe left on card → action buttons:
          "Detail" · "Suspend" · "Ban"

48. User Detail Screen — Admin
    - Back arrow + "Detail Pengguna" heading
    - Profile card:
        Avatar large, name, role badge, 
        join date, status
    - Info rows:
        📧 Email
        📱 No. HP
        📍 Kota
    - Activity summary (for Relawan/Donatur):
        Total kegiatan · Total donasi barang · 
        Total donasi uang
    - Activity summary (for Pengelola Panti):
        Total kegiatan dibuat · Total kampanye · 
        Total donasi diterima
    - Action buttons:
        "Kirim Pesan" outlined button
          → bottom sheet: compose message field + 
            "Kirim" button (in-app notification)
        "Suspend Akun" orange button
          → confirmation: "Suspend akun [nama]?"
            Duration selector: 
            7 hari · 30 hari · Permanen
            Notes field (reason)
            "Ya, Suspend" · "Batal"
            → Success: status updates to Suspend,
              user cannot login until period ends,
              toast "Akun berhasil di-suspend"
        "Ban Akun" red outlined button
          → confirmation: "Ban permanen akun [nama]?"
            Notes field (reason, required)
            "Ya, Ban" · "Batal"
            → Success: account permanently blocked,
              toast "Akun berhasil di-ban"

49. Laporan & Statistik Screen — Admin
    - "Laporan" heading
    - Date range filter row:
        Quick select: Bulan Ini · 3 Bulan · 
        6 Bulan · Tahun Ini
        Custom range: date picker pair
    - Metrics cards (2x2):
        Total Donasi Uang (Rp) · Total Transaksi
        Total Donasi Barang · Total Jam Volunteer
    - "Panti Paling Aktif" section:
        Top 3 panti cards with rank badge
    - Bar chart: donasi uang per bulan
    - Pie chart: kategori donasi barang 
      (with legend: Pakaian · Alat Tulis · 
       Sembako · Furnitur · Lainnya)
    - "Export Data" button top right:
        Bottom sheet: 
          "Export sebagai" 
          [📄 PDF] [📊 CSV]
          Date range confirmation
          "Export" button
          → Loading → 
            file download starts,
            toast "File berhasil diunduh"

50. Pengaturan Platform Screen — Admin
    - "Pengaturan" heading
    - Section "Metode Pembayaran":
        Toggle rows:
          QRIS [toggle]
          GoPay [toggle]
          OVO [toggle]
          Transfer Bank [toggle]
        Each toggle tap → 
          confirmation dialog before disabling:
          "Nonaktifkan [metode]?"
    - Section "Biaya Admin":
        "Persentase biaya per transaksi"
        Current value: X% (editable field)
        "Simpan" button → confirmation dialog
    - Section "Kategori Donasi Barang":
        List of categories with edit ✏️ and 
        delete 🗑️ icons per item
        "Tambah Kategori +" button
          → input modal: category name field + 
            "Tambah" button
    - Section "Kirim Pengumuman":
        "Kepada" multi-select:
          ☐ Semua Pengguna
          ☐ Relawan/Donatur
          ☐ Pengelola Panti
        "Judul Pengumuman" field
        "Isi Pesan" textarea
        "Kirim Sekarang" lavender pill button
          → confirmation: "Kirim pengumuman 
            ke X pengguna?"
            "Ya, Kirim" · "Batal"
            → loading → 
              toast "Pengumuman berhasil dikirim"
    - Section "Notifikasi Global":
        Toggle: "Notifikasi kegiatan baru" [toggle]
        Toggle: "Notifikasi kampanye baru" [toggle]
        Toggle: "Notifikasi donasi masuk" [toggle]
