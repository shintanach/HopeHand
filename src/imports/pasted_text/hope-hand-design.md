Design a mobile app called "Hope Hand" — a volunteer and donation 
platform connecting orphanages with the community in Indonesia.
Design all screens for 3 actor roles: Admin, Pengelola Panti, 
and Relawan/Donatur. Every action, button tap, and flow must be 
fully designed end-to-end.

=====================================================
SHARED SCREENS (ALL ACTORS)
=====================================================

1. Splash Screen
   - Hope Hand logo centered on #FFF8F4 background
   - Tagline: "Satu Langkah, Seribu Harapan" below logo
   - Soft circular progress indicator at bottom
   - After 2 seconds: auto-navigate to Onboarding 
     (first time) or Login Screen (returning user)

2. Onboarding Screen (3 slides)
   - Slide 1: 
       Illustration: volunteer kneeling with children
       Heading: "Jadilah Relawan yang Berarti"
       Sub: "Temukan jadwal kegiatan panti 
             sesuai waktumu"
   - Slide 2:
       Illustration: hands holding donation box
       Heading: "Donasikan Barang yang Dibutuhkan"
       Sub: "Pilih langsung barang yang 
             paling dibutuhkan panti"
   - Slide 3:
       Illustration: heart with coin/money
       Heading: "Bantu Lewat Donasi Dana"
       Sub: "Donasi uang secara aman dan transparan"
   - Navigation: dot indicator center bottom,
     "Lewati" text button top right (goes to Login),
     "Selanjutnya" pill button bottom right,
     last slide button changes to "Mulai Sekarang"
     → taps go to Login Screen

3. Login Screen (Unified — All Roles)
   - Hope Hand logo small + "Selamat Datang" heading
   - Subtext: "Pilih peranmu untuk masuk"
   - Role selector: 3 cards horizontally
       Card 1: 🙋 icon, "Relawan / Donatur", 
               accent #FF7F7F
       Card 2: 🏠 icon, "Pengelola Panti", 
               accent #6ECDB1
       Card 3: ⚙️ icon, "Admin", 
               accent #B4A7E7
     - Default state: all cards outlined, unselected
     - Selected state: filled accent background,
       white icon & text, checkmark top-right corner,
       card slightly scaled up with shadow
     - Tap any card: that card becomes selected,
       others become muted/outlined
   - After role selected, form slides in below:
       [Relawan/Donatur & Pengelola Panti]
         Email field with envelope icon
         Password field with lock icon + show/hide toggle
         "Lupa Password?" link aligned right
         Login button (pill, color = selected role accent)
         Divider "atau"
         Google SSO button (white card, Google icon)
         "Belum punya akun? Daftar" link at bottom
       [Admin]
         Email field with envelope icon
         Password field with lock icon + show/hide toggle
         "Lupa Password?" link aligned right
         Login button (pill, #B4A7E7 lavender)
         NO Google SSO button
         NO register link
         Small info text: "Akun Admin disiapkan 
         oleh tim pengembang"
   - Login button tap flow:
       → Show loading spinner on button
       → Success: navigate to respective Home Screen
       → Failed: show inline error below password field
         "Email atau password salah. Coba lagi."
   - "Lupa Password?" tap:
       → Bottom sheet slides up:
         Heading "Reset Password"
         Email input field
         "Kirim Link Reset" button
         → Success: bottom sheet shows checkmark +
           "Link reset telah dikirim ke email kamu"
           "Tutup" button dismisses sheet

4. Register Screen (Relawan/Donatur)
   - Reached from "Belum punya akun? Daftar" on Login
     when Relawan/Donatur or Pengelola Panti card selected
   - Top: back arrow + "Buat Akun" heading
   - Role selector cards same as Login 
     (pre-selected based on card chosen at login)
   - [When Relawan/Donatur selected]:
       Profile photo upload circle (tap to open 
       camera/gallery picker) — optional, shows 
       default avatar if skipped
       Full name field
       Email field
       Phone number field (with +62 prefix)
       City/Domisili dropdown
       Password field + show/hide toggle
       Confirm password field + show/hide toggle
       Terms & conditions checkbox: 
       "Saya menyetujui Syarat & Ketentuan"
       "Daftar Sekarang" pill button (#FF7F7F coral)
   - Button tap flow:
       → Validate all fields inline
         (red underline + error text per empty field)
       → If valid: show loading spinner
       → Success: navigate to 
         Email Verification Pending Screen
       → Failed (email already used): inline error
         "Email sudah terdaftar. Coba login."

5. Register Screen (Pengelola Panti)
   - Same layout as Register Relawan/Donatur
   - [When Pengelola Panti selected]:
       Panti logo upload circle (tap to open picker)
       Nama Pengelola field
       Nama Panti field
       Email field
       Phone number field (+62 prefix)
       Alamat Panti field (multiline)
       Password field + show/hide toggle
       Confirm password field + show/hide toggle
       Upload Section "Dokumen Legalitas":
         Box 1: "Upload Foto KTP Pengelola"
                tap → open file/camera picker
                after upload: show thumbnail + 
                filename + ✓ badge
         Box 2: "Upload Surat Izin Panti"
                same interaction
       Terms & conditions checkbox
       "Ajukan Pendaftaran" pill button (#6ECDB1 teal)
   - Button tap flow:
       → Validate all fields + document uploads
       → If any document missing: 
         highlight upload box in red +
         "Dokumen wajib diunggah"
       → If valid: show loading spinner
       → Success: navigate to 
         Pending Verification Screen

6. Email Verification Pending Screen
   (Relawan/Donatur only, after register)
   - Illustration: envelope with sparkles
   - Heading: "Cek Email Kamu!"
   - Body: "Kami telah mengirim link verifikasi ke
     [email]. Klik link tersebut untuk 
     mengaktifkan akunmu."
   - "Buka Aplikasi Email" button (opens email app)
   - "Kirim Ulang Email" text link below
     → tap: shows toast "Email terkirim ulang"
   - "Sudah verifikasi? Masuk" link
     → tap: goes back to Login Screen

7. Pending Verification Screen
   (Pengelola Panti only, after register)
   - Illustration: document with clock/hourglass
   - Heading: "Pendaftaran Sedang Diverifikasi"
   - Body: "Tim kami akan memverifikasi dokumen 
     pantumu dalam 1-3 hari kerja. Kamu akan 
     mendapat notifikasi email setelah disetujui."
   - Status stepper:
       ① Dokumen Dikirim ✓ (completed)
       ② Sedang Diverifikasi ⏳ (active/pulsing)
       ③ Akun Aktif (pending)
   - "Hubungi Admin" button → opens email composer
   - "Kembali ke Login" text link

=====================================================
ACTOR 1: RELAWAN / DONATUR
=====================================================

8. Home Screen — Relawan/Donatur
   - Status bar area: #FFF8F4 background
   - Header row:
       Left: avatar thumbnail (tap → Profil Screen)
       Center: Hope Hand logo small
       Right: bell icon (tap → Notifikasi Screen)
         with red dot badge if unread
   - Greeting card: "Halo, [Nama] 👋"
     subtext: "Mau berbuat baik hari ini?"
     background: coral gradient #FF7F7F → #FFB6C1
   - Quick action row (3 icon buttons in cards):
       🙋 Volunteer → Jadwal Kegiatan Screen
       📦 Donasi Barang → Katalog Barang Screen
       💰 Donasi Uang → Kampanye Donasi Screen
   - Section "Kebutuhan Mendesak":
       Section header + "Lihat Semua" link
       Horizontal scroll cards:
         Panti photo (top), panti name, 
         item/campaign name, progress bar 
         (coral fill), "X% terpenuhi" label,
         "Bantu Sekarang" small button
       Tap card → Orphanage Detail Screen 
       (Donasi tab active)
   - Section "Jadwal Kegiatan Terdekat":
       Section header + "Lihat Semua" link
       Vertical activity cards:
         Category chip (Mengajar/Bermain/Keterampilan),
         Activity title bold, panti name,
         📅 date · 🕐 time · 📍 location,
         Kuota badge: "3 slot tersisa" (yellow)
         or "Penuh" (grey)
         "Daftar" button (coral pill, disabled if penuh)
       Tap card → Activity Detail Screen
   - Section "Panti yang Kamu Ikuti":
       Horizontal avatar + name scroll
       Tap → Orphanage Detail Screen
   - If no followed panti: show empty state
     "Belum mengikuti panti. Explore sekarang →"
   - Bottom navigation bar:
       🏠 Beranda (active) · 🔍 Explore · 
       📋 Riwayat · 👤 Profil

9. Notifikasi Screen
   - Back arrow + "Notifikasi" heading
   - "Tandai semua dibaca" text link top right
   - Notification list items:
       Unread: white card with left coral border
       Read: #FFF8F4 card
       Each item: icon (🙋/📦/💰), title bold,
       body text, timestamp relative 
       ("2 jam lalu", "Kemarin")
   - Tap notification → navigate to relevant screen
   - Empty state: illustration + "Belum ada notifikasi"

10. Explore Screen
    - Search bar (tap → search mode, keyboard opens)
    - Filter chips horizontal scroll:
      Semua · Kegiatan · Donasi Barang · 
      Donasi Uang · Kota
    - Active filter chip: filled coral, white text
    - Orphanage cards (vertical list):
        Cover photo, verified badge overlay,
        Panti name bold, city with 📍 icon,
        Short description 2 lines,
        Stats row: X Relawan · X Donasi
    - Tap card → Orphanage Detail Screen
    - Toggle top right: list icon / grid icon
    - Empty search state: 
      "Panti tidak ditemukan. Coba kata kunci lain."

11. Orphanage Detail Screen
    - Full-width cover photo (top)
    - Back arrow button (top left, white circle)
    - Bookmark/follow icon (top right, white circle)
      → tap: toggles follow state 
        (filled bookmark = following)
        toast: "Kamu mengikuti [nama panti]"
    - Panti logo circle overlapping cover photo bottom
    - Panti name bold large, city, verified badge ✓
    - Stats row: X Relawan · X Donatur · X Kegiatan
    - Tab bar: Tentang · Jadwal · Donasi Barang · 
      Donasi Uang
    - [Tentang tab]:
        Description paragraph
        Address with 📍 icon
        Embedded map pin (static map image)
        Photo gallery horizontal scroll
    - [Jadwal tab]:
        Activity cards same as Home Screen
        Tap "Daftar" → Konfirmasi Daftar Modal
    - [Donasi Barang tab]:
        Item catalog grid same as Katalog Screen
    - [Donasi Uang tab]:
        Campaign cards same as Kampanye Screen

12. Activity Detail Screen
    - Back arrow + activity title heading
    - Cover/banner image
    - Category chip + panti name
    - Description paragraph
    - Info rows:
        📅 Tanggal: [date]
        🕐 Waktu: [start] - [end]
        📍 Lokasi: [address]
        👥 Kuota: X/Y slot terisi
    - Persyaratan section (if any):
        Bullet list of requirements
    - Sticky bottom bar: 
        "Daftar Sekarang" coral pill button
        (changes to "Penuh — Tidak Tersedia" 
        if quota full, greyed out)
    - Button tap → Konfirmasi Daftar Modal

13. Konfirmasi Daftar Modal (bottom sheet)
    - Drag handle at top
    - Heading "Konfirmasi Pendaftaran"
    - Activity summary card:
        Activity name, panti, date, time, location
    - Reminder toggle row:
        "Ingatkan saya H-1 sebelum kegiatan" 
        + toggle switch (default ON)
    - "Konfirmasi Daftar" coral pill button
    - "Batal" text link below
    - Button tap flow:
        → Loading spinner
        → Success: modal closes, 
          show success toast at top:
          "✓ Berhasil terdaftar! Sampai jumpa [date]"
          Activity card on Home/Jadwal 
          shows "Terdaftar" green badge
        → Failed: toast error 
          "Gagal mendaftar. Coba lagi."

14. Volunteer — Jadwal Kegiatan Screen
    - "Jadwal Kegiatan" heading + filter icon
    - Filter row: Semua · Terdekat · Minggu Ini · 
      Bulan Ini (horizontal chips)
    - Activity cards (vertical list):
        Same design as Home Screen activity cards
        "Daftar" button per card
        → tap: Activity Detail Screen
    - Empty state: "Belum ada jadwal kegiatan 
      tersedia saat ini"

15. Donasi Barang — Katalog Screen
    - "Donasi Barang" heading + search icon + filter icon
    - Filter chips: Semua · Pakaian · Alat Tulis · 
      Sembako · Furnitur · Lainnya
    - Item cards (2-column grid):
        Item photo square,
        Item name bold,
        Panti name small + city,
        Quantity needed: "Dibutuhkan: X pcs",
        Status badge pill:
          "Tersedia" green · "Diproses" yellow · 
          "Terpenuhi" grey
        "Klaim & Kirim" coral button 
        (hidden/greyed if Terpenuhi)
    - Tap card → Item Detail Screen
    - Tap "Klaim & Kirim" → Item Detail Screen 
      directly to form

16. Item Detail Screen
    - Back arrow + "Detail Kebutuhan" heading
    - Item photo full-width
    - Item name bold large
    - Panti name + city + verified badge
    - Description of condition/requirement
    - Info rows:
        📦 Jumlah Dibutuhkan: X pcs
        🏷️ Kategori: [category]
        ⚡ Urgensi: Normal / Mendesak 
           (Mendesak shows red badge)
    - Status bar: progress of how many claimed
    - "Klaim & Kirim Barang Ini" coral pill button
    - Button tap → Form Pengiriman Screen

17. Donasi Barang — Form Pengiriman Screen
    - Back arrow + "Informasi Pengiriman" heading
    - Item summary card at top (photo + name + panti)
    - Form fields:
        Nama Pengirim (pre-filled from profile)
        No. HP (pre-filled from profile)
        Pilih Kurir dropdown: 
          JNE · J&T · SiCepat · Anteraja · Lainnya
        No. Resi field (input tracking number)
        Upload Foto Paket:
          Dashed box with camera icon
          "Tap untuk upload foto paket"
          After upload: shows photo thumbnail
          with ✕ to remove
    - "Konfirmasi Pengiriman" coral pill button
    - Button tap flow:
        → Validate: resi field not empty + 
          photo uploaded
        → Loading spinner
        → Success: navigate to 
          Pengiriman Berhasil Screen
        → Failed: inline field error

18. Pengiriman Berhasil Screen
    - Success illustration (box with heart + sparkles)
    - "Pengiriman Terkonfirmasi!" heading (#6D5A4F)
    - Body: "Terima kasih! Barang kamu sedang 
      dalam perjalanan ke [nama panti]."
    - Summary card: item name, kurir, no. resi
    - "Lacak Pengiriman" outlined button
      → opens tracking status screen
    - "Kembali ke Beranda" coral pill button

19. Donasi Uang — Kampanye Screen
    - "Donasi Uang" heading + search icon
    - Filter chips: Semua · Aktif · Segera Berakhir · 
      Tercapai
    - Campaign cards (vertical list):
        Panti cover photo,
        Campaign title bold,
        Panti name + verified badge,
        Progress bar (coral fill),
        "Terkumpul Rp X dari Rp Y" text,
        "X hari lagi" remaining badge (red if ≤3 days),
        "Donasi Sekarang" coral pill button
    - Tap card → Campaign Detail Screen
    - Tap button → Campaign Detail Screen 
      (scroll to form)

20. Campaign Detail Screen
    - Back arrow + "Detail Kampanye" heading
    - Campaign photo full-width
    - Campaign title bold large
    - Panti name + city + verified badge
    - Progress bar large + percentage label
    - Stats row: 
        💰 Terkumpul: Rp X · 🎯 Target: Rp Y · 
        👥 X Donatur · 📅 X hari lagi
    - Description paragraph
    - Recent donors list (3 items preview):
        Avatar (or 👤 if anonim), 
        name (or "Anonim"), 
        amount, time ago
    - "Lihat Semua Donatur" text link
    - Sticky bottom: "Donasi Sekarang" coral button
    - Button tap → Form Donasi Screen

21. Donasi Uang — Form Donasi Screen
    - Back arrow + "Pilih Nominal Donasi" heading
    - Campaign summary card at top:
        Campaign title + panti name + progress bar
    - Nominal preset buttons (2x2 grid):
        [Rp 10.000] [Rp 25.000]
        [Rp 50.000] [Rp 100.000]
        Selected preset: filled coral, white text
        Unselected: outlined coral border
    - "Atau masukkan nominal lain" label
      Custom input field: "Rp ___" 
      (typing clears preset selection)
      Min. Rp 5.000 note below field
    - Anonymous toggle row:
        "Donasi sebagai anonim" + toggle
        (default OFF)
    - "Pilih Metode Pembayaran" section below
    - Method options (radio card style):
        [QRIS logo] QRIS
        [GoPay logo] GoPay
        [OVO logo] OVO
        [Bank icon] Transfer Bank
        Selected: left coral border + filled radio
    - "Lanjut ke Pembayaran" coral pill button
      (disabled until nominal + method selected)
    - Button tap → Konfirmasi Pembayaran Screen

22. Donasi Uang — Konfirmasi Pembayaran Screen
    - Back arrow + "Konfirmasi Donasi" heading
    - Summary card:
        Campaign name
        Panti name
        Donasi atas nama: [Nama] / Anonim
        Nominal: Rp X (bold large)
        Metode: [selected method]
        Biaya admin: Rp 0 / Rp X
        Divider line
        Total: Rp X (bold coral large)
    - Info note: "Dana 100% disalurkan ke panti"
      with 🔒 icon
    - "Bayar Sekarang" coral pill button
    - "Ubah Detail" outlined button
      → goes back to Form Donasi Screen
    - Button tap flow:
        → [If QRIS]: navigate to QRIS Screen
        → [If GoPay/OVO]: deep-link to 
          respective app or show redirect screen
        → [If Transfer Bank]: 
          navigate to Transfer Detail Screen

23. QRIS Payment Screen
    - Back arrow + "Scan QRIS" heading
    - Countdown timer: "Bayar dalam 15:00"
      (red when ≤ 5 minutes)
    - QRIS code square image centered
    - "Simpan QR" button (download to gallery)
    - Amount: Rp X bold below QR
    - Steps instruction:
        1. Buka aplikasi e-wallet atau m-banking
        2. Pilih fitur Scan QR
        3. Scan kode di atas
        4. Konfirmasi pembayaran
    - "Sudah Bayar" outlined button
      → polling check → 
        if confirmed: navigate to Sukses Screen
        if not confirmed: show "Pembayaran belum 
        terdeteksi. Tunggu beberapa saat." toast

24. Transfer Bank Screen
    - Back arrow + "Transfer Bank" heading
    - Countdown timer: "Selesaikan dalam 23:59:00"
    - Bank info card:
        Bank name + logo
        "Nomor Rekening" label
        Account number large bold + copy icon
        (tap copy icon: toast "Nomor disalin")
        "Atas Nama: Hope Hand Foundation"
    - Amount card:
        "Jumlah Transfer" label
        Rp X bold large coral + copy icon
        "Transfer tepat sesuai nominal" note
    - Steps instruction:
        1. Buka m-banking atau ATM
        2. Transfer ke rekening di atas
        3. Masukkan nominal tepat
        4. Simpan bukti transfer
    - "Upload Bukti Transfer" dashed box button
      → tap: open file/camera picker
      → after upload: show thumbnail preview
    - "Konfirmasi Pembayaran" coral pill button
      → Loading spinner
      → navigate to Sukses Screen (pending review)

25. Donasi Uang — Sukses Screen
    - Full screen: #FFF8F4 background
    - Animated checkmark circle (coral) at top
    - "Terima kasih, [Nama]! 🎉" heading
    - Body: "Donasimu sebesar Rp X telah diterima 
      dan akan segera disalurkan ke [panti]."
    - Receipt card:
        Campaign name
        Panti name
        Nominal
        Metode pembayaran
        Tanggal & waktu
        ID Transaksi (small text)
    - "Bagikan Kebaikanmu" section:
        Row of share buttons: 
        WhatsApp · Instagram · Twitter · Copy Link
    - "Lihat Kampanye Lain" outlined button
    - "Kembali ke Beranda" coral pill button

26. Riwayat Screen
    - "Riwayat" heading
    - Tabs: Kegiatan · Donasi Barang · Donasi Uang
    - [Kegiatan tab]:
        Activity cards vertical list:
          Activity name, panti, date
          Status badge: 
            "Terdaftar" blue · "Selesai" green · 
            "Dibatalkan" red · "Tidak Hadir" grey
          "Beri Ulasan" button if Selesai
          → tap: Rating Modal
    - [Donasi Barang tab]:
        Item cards:
          Item photo, item name, panti name,
          Kurir + No. Resi
          Status badge:
            "Dikirim" blue · "Diterima Panti" green · 
            "Dikonfirmasi" teal
          "Lacak Pengiriman" link if Dikirim
    - [Donasi Uang tab]:
        Transaction cards:
          Campaign name, panti name, nominal bold,
          Metode pembayaran, tanggal
          Status badge:
            "Berhasil" green · "Pending" yellow · 
            "Gagal" red
          "Unduh Bukti" link if Berhasil
    - Empty state per tab:
        Illustration + "Belum ada riwayat [tab name]"
        + "Mulai Sekarang" button

27. Rating & Ulasan Modal (bottom sheet)
    - Drag handle
    - Heading "Bagaimana Pengalamanmu?"
    - Activity name + panti name summary
    - 5-star rating selector
      (tap star to select, filled coral = selected)
    - Text area: "Ceritakan pengalamanmu... (opsional)"
    - "Kirim Ulasan" coral pill button
    - "Lewati" text link
    - Button tap flow:
        → if no star selected: 
          shake animation + "Pilih bintang dulu"
        → Success: modal closes, 
          toast "Ulasan berhasil dikirim. Terima kasih!"
          Riwayat card shows star rating

28. Profil Screen — Relawan/Donatur
    - Profile header card (coral gradient background):
        Avatar large center (tap → change photo picker)
        Name bold, kota with 📍
        Edit profil icon button (top right)
    - Stats row (3 cards):
        ⏱️ Total Jam Relawan
        📦 Total Donasi Barang
        💰 Total Donasi Uang
    - Badge section "Pencapaianmu":
        Horizontal scroll of badge cards:
          Badge icon + label 
          (e.g. "Relawan Pemula" 🌱, 
           "Donatur Setia" ⭐, "Pahlawan Panti" 🏆)
          Locked badges shown greyed with 🔒
    - Menu list:
        🏠 Panti Favoritku → list of followed panti
        🔔 Pengaturan Notifikasi → toggle screen
        ❓ Bantuan & FAQ → web view
        📄 Syarat & Ketentuan → web view
        🚪 Logout → confirmation dialog
    - Logout tap:
        Dialog: "Yakin ingin keluar?"
        "Ya, Keluar" red button · "Batal" link
        Confirm → navigate to Login Screen

29. Edit Profil Screen — Relawan/Donatur
    - Back arrow + "Edit Profil" heading
    - "Simpan" text button top right
    - Avatar with camera overlay icon (tap → picker)
    - Editable fields:
        Nama Lengkap
        Email (with "Ubah Email" note — 
        requires re-verification)
        No. HP
        Kota/Domisili dropdown
        Password section: 
        "Ubah Password" button → bottom sheet
          (Current password, New password, 
           Confirm new password, Simpan button)
    - "Simpan" tap flow:
        → Validate fields
        → Loading spinner
        → Success: go back to Profil, 
          toast "Profil berhasil diperbarui"
        → Failed: inline field errors

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

=====================================================
DESIGN SYSTEM
=====================================================

Color Palette (from Hope Hand brand identity):
- Coral / Primary CTA:    #FF7F7F
- Sunshine Yellow:        #FFD166
- Mint Teal:              #6ECDB1
- Soft Lavender:          #B4A7E7
- Blush Pink:             #FFB6C1
- Cream:                  #FFE7B8
- Dark Brown (text):      #6D5A4F
- Background:             #FFF8F4
- Card background:        #FFFFFF
- Success green:          #4CAF50
- Error red:              #E53935
- Warning orange:         #FB8C00

Role accent colors:
- Relawan/Donatur:  #FF7F7F (coral)
- Pengelola Panti:  #6ECDB1 (mint teal)
- Admin:            #B4A7E7 (lavender)

Typography:
- Font: Nunito or Poppins
- Heading: Bold 700-800
- Body: Regular 400, SemiBold 600
- All text color: #6D5A4F

Shapes & Spacing:
- Card border radius: 20px
- Button border radius: 50px (pill shape)
- Chips/tags border radius: 50px
- Bottom sheet border radius top: 24px
- Base spacing grid: 16px
- Card shadow: 0px 2px 12px rgba(109,90,79,0.08)

Component states:
- Button loading: spinner replaces label
- Button disabled: 40% opacity
- Input error: red border + error text below
- Input success: teal border + ✓ icon right
- Toast: bottom of screen, rounded pill,
  auto-dismiss after 3 seconds

Icons: Soft filled, colorful, friendly
Illustrations: Warm-toned, soft gradient style
matching Hope Hand logo art direction
Imagery: Bright, candid, warm color graded photos
Platform: Android & iOS mobile (375px base width)
Overall tone: Warm · Playful · Trustworthy · Hopeful