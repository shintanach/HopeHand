=====================================================
ACTOR 2: PENGELOLA PANTI
=====================================================

30. Home Screen — Pengelola Panti
    - Header: panti logo left + panti name center + 
      bell icon right (tap → Notifikasi Screen)
    - Status bar: "Terverifikasi ✓" teal badge
    - Stats row (3 cards):
        🙋 Relawan Bulan Ini
        📦 Donasi Barang Masuk
        💰 Dana Terkumpul
    - Alert card (if urgent needs unfulfilled):
        Red/orange accent left border
        "⚡ Ada kebutuhan mendesak belum terpenuhi"
        "Lihat Sekarang" link
    - Recent activity feed:
        Feed items: avatar + 
        "[Nama] mendaftar kegiatan [X]"
        "[Nama] mengirim donasi [barang]"
        "[Nama] berdonasi Rp X"
        Each with timestamp
    - Bottom navigation:
        🏠 Beranda · 📅 Kegiatan · 
        📦 Donasi · 📊 Laporan · 🏠 Profil Panti

31. Manajemen Jadwal Kegiatan Screen
    - "Jadwal Kegiatan" heading
    - View toggle top right: 📅 Calendar / ☰ List
    - [Calendar view]: monthly calendar,
      dates with activities show coral dot,
      tap date → shows activity list below calendar
    - [List view]: activity cards vertical:
        Category chip, activity title bold,
        Date · Time · Location
        Volunteer count badge: "X/Y relawan"
        Status pill: 
          "Aktif" green · "Penuh" yellow · 
          "Selesai" grey · "Dibatalkan" red
        Tap card → Activity Management Detail Screen
    - Floating "+" coral button bottom right
      → tap: Tambah Kegiatan Screen

32. Tambah Kegiatan Screen
    - Back arrow + "Buat Kegiatan Baru" heading
    - "Publikasikan" text button top right
    - Form fields:
        Nama Kegiatan field
        Deskripsi (multiline textarea)
        Kategori dropdown: 
          Mengajar · Bermain · Keterampilan · 
          Olahraga · Lainnya
        Tanggal (date picker → calendar modal)
        Waktu Mulai (time picker)
        Waktu Selesai (time picker)
        Kuota Relawan (number stepper +/-)
        Lokasi/Alamat field
        Banner/Foto Kegiatan:
          Dashed upload box
          tap → camera/gallery picker
          after upload: image preview + ✕ remove
        Persyaratan Khusus toggle (OFF by default)
          if ON: text area appears for requirements
    - "Publikasikan" tap flow:
        → Validate all required fields
        → Empty required field: 
          red border + "Wajib diisi" below
        → Valid: loading spinner
        → Success: navigate back to 
          Jadwal Kegiatan Screen,
          new activity card appears at top,
          toast "Kegiatan berhasil dipublikasikan"

33. Activity Management Detail Screen
    - Back arrow + activity title heading
    - Edit button (pencil icon) top right
      → opens Tambah Kegiatan Screen 
        pre-filled with existing data
    - Activity info: date, time, location, 
      category, description
    - Volunteer quota progress bar: X/Y
    - Tabs: Terdaftar · Hadir · Tidak Hadir
    - [Terdaftar tab]:
        List of registered volunteers:
          Avatar + name + phone number
          "Hubungi" icon (opens phone dialer)
          Swipe left → action buttons:
            "✓ Hadir" green · "✗ Tidak Hadir" red · 
            "Tolak" grey
    - Bulk action bar bottom:
        "Tandai Semua Hadir" button
    - [Hadir tab]: 
        Same list, showing confirmed attendees
        Download attendance list button
    - [Tidak Hadir tab]: 
        List of absent/rejected volunteers
    - Activity status actions:
        If Aktif: "Batalkan Kegiatan" red text button
          → confirmation dialog:
            "Yakin batalkan kegiatan ini?"
            "Ya, Batalkan" · "Tidak"
            if confirmed: status → Dibatalkan,
            auto-notify all registered volunteers

34. Manajemen Donasi Barang Screen
    - "Donasi Barang" heading
    - Tabs: Kebutuhan · Donasi Masuk
    - [Kebutuhan tab]:
        Filter chips: Semua · Tersedia · 
          Diproses · Terpenuhi
        Item need cards (grid 2 col):
          Item photo, name, quantity,
          status badge, urgency badge if Mendesak
          tap card → Item Need Detail Screen
        Floating "+" button → Tambah Kebutuhan Screen
    - [Donasi Masuk tab]:
        Incoming donation list:
          Donor name/Anonim + item + 
          kurir + resi + date + status
          Status: "Dalam Pengiriman" · 
            "Perlu Konfirmasi" · "Diterima"
          "Konfirmasi Terima" button 
          if status = Perlu Konfirmasi

35. Tambah Kebutuhan Barang Screen
    - Back arrow + "Tambah Kebutuhan" heading
    - "Publikasikan" text button top right
    - Form fields:
        Upload foto barang: dashed box
          tap → picker, after: image preview
        Nama Barang field
        Kategori dropdown
        Jumlah Dibutuhkan (number stepper +/-)
        Satuan dropdown: pcs · lusin · set · kg · liter
        Deskripsi kondisi (multiline)
        Tingkat Urgensi radio buttons:
          ⚪ Normal  🔴 Mendesak
    - "Publikasikan" tap flow:
        → Validate fields + photo
        → Success: back to Donasi Barang Screen,
          new item appears in Kebutuhan tab,
          toast "Kebutuhan berhasil dipublikasikan"

36. Konfirmasi Penerimaan Barang Screen
    - Back arrow + "Konfirmasi Penerimaan" heading
    - Donation summary card:
        Item name + quantity
        Donor name (or Anonim)
        Kurir + No. Resi
        Estimated arrival date
    - "Upload Bukti Penerimaan" section:
        Dashed photo upload box
        tap → camera preferred (for live photo)
        after upload: full-width photo preview
        ✕ to retake
    - Condition note field (optional):
        "Catatan kondisi barang (opsional)"
    - "Konfirmasi Diterima" teal pill button
    - Button tap flow:
        → Photo required: 
          if not uploaded: shake box + 
          "Foto bukti wajib diunggah"
        → Valid: loading spinner
        → Success: navigate back to Donasi Masuk tab,
          item status updates to "Diterima" ✓,
          donor receives push notification:
          "Barang kamu telah diterima oleh [panti]!"
          toast "Penerimaan berhasil dikonfirmasi"

37. Manajemen Kampanye Donasi Uang Screen
    - "Donasi Uang" heading
    - Tabs: Kampanye · Riwayat Dana
    - [Kampanye tab]:
        Campaign cards:
          Photo, title, progress bar,
          Terkumpul / Target amounts,
          Days remaining badge,
          Status: "Aktif" · "Menunggu Persetujuan" 
            · "Ditolak" · "Selesai"
          Tap card → Campaign Detail (panti view)
        Floating "+" → Buat Kampanye Screen
    - [Riwayat Dana tab]:
        Total dana summary card at top (teal bg)
        Transaction list:
          Donor name/Anonim, nominal bold,
          metode, tanggal, status badge
        Filter by campaign dropdown
        "Export PDF" button top right
          → loading → download confirmation toast

38. Buat Kampanye Donasi Uang Screen
    - Back arrow + "Buat Kampanye" heading
    - "Ajukan" text button top right
    - Form fields:
        Upload foto kampanye (dashed box, required)
        Judul Kampanye field
        Deskripsi Kebutuhan (multiline)
        Target Dana: "Rp ___" number input
        Tenggat Waktu (date picker → calendar modal)
        Rekening penerima: 
          shows verified bank account info
          if no account: 
            warning "Tambahkan rekening dulu"
            link to Profil Panti → Rekening section
    - "Ajukan" tap flow:
        → Validate all fields
        → Valid: loading spinner
        → Success: navigate back to Kampanye tab,
          new campaign shows 
          "Menunggu Persetujuan" badge,
          toast "Kampanye diajukan, 
          menunggu persetujuan admin"
        → Failed: inline errors

39. Laporan Transparansi Screen
    - "Laporan" heading
    - Period filter: dropdown (Bulan ini · 
      3 Bulan · 6 Bulan · Custom range)
    - Summary cards row:
        Total Kegiatan · Total Relawan · 
        Total Donasi Barang · Total Dana
    - Tabs: Kegiatan · Donasi Barang · Donasi Uang
    - Each tab shows monthly breakdown cards
    - "Buat Laporan Otomatis" teal pill button:
        → Loading: "Menyiapkan laporan..."
        → Opens Report Preview Screen:
            Auto-generated report with logo,
            period, all stats, charts
            "Publikasikan ke Publik" toggle
            "Download PDF" button
            "Bagikan" button
    - "Upload Dokumentasi" button:
        → Opens photo picker (multi-select)
        → After upload: photo grid appears
          with ✕ per photo

40. Profil Panti Screen
    - Cover photo full-width (tap → change picker)
    - Camera icon overlay on cover photo
    - Panti logo circle (tap → change logo picker)
    - Panti name bold, city, verified badge ✓
    - Edit button top right → Edit Profil Panti Screen
    - Description paragraph
    - Photo gallery grid: "Dokumentasi Kegiatan"
      tap photo → fullscreen viewer
      "Tambah Foto" + card in gallery
    - Rekening Terverifikasi section:
        Bank card: bank name, account number masked,
        "Terverifikasi ✓" teal badge
        "Tambah Rekening" outlined button
          → bottom sheet:
            Bank name dropdown
            Account number field
            Account owner name field
            Upload buku tabungan/foto rekening
            "Simpan & Ajukan Verifikasi" button
            → pending admin verification
    - Menu:
        🔔 Pengaturan Notifikasi
        ❓ Bantuan
        🚪 Logout → confirmation dialog

41. Edit Profil Panti Screen
    - Back arrow + "Edit Profil Panti" heading
    - "Simpan" text button top right
    - Fields:
        Nama Panti
        Alamat (multiline)
        Kota dropdown
        Deskripsi (multiline)
        No. HP Panti
        Email Panti
    - "Simpan" tap flow:
        → Validate
        → Success: back to Profil Panti,
          toast "Profil panti berhasil diperbarui"