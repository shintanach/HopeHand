import { createBrowserRouter } from "react-router";
import SplashScreen from "./screens/SplashScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterRelawanScreen from "./screens/RegisterRelawanScreen";
import RegisterPantiScreen from "./screens/RegisterPantiScreen";
import EmailVerificationScreen from "./screens/EmailVerificationScreen";
import PendingVerificationScreen from "./screens/PendingVerificationScreen";

// Relawan/Donatur Screens
import HomeRelawanScreen from "./screens/relawan/HomeRelawanScreen";
import ExploreScreen from "./screens/relawan/ExploreScreen";
import RiwayatScreen from "./screens/relawan/RiwayatScreen";
import ProfilScreen from "./screens/relawan/ProfilScreen";
import NotifikasiScreen from "./screens/relawan/NotifikasiScreen";

// Pengelola Panti Screens
import HomePantiScreen from "./screens/panti/HomePantiScreen";
import JadwalKegiatanPantiScreen from "./screens/panti/JadwalKegiatanPantiScreen";
import TambahKegiatanScreen from "./screens/panti/TambahKegiatanScreen";
import ActivityManagementDetailScreen from "./screens/panti/ActivityManagementDetailScreen";
import ManajemenDonasiBarangScreen from "./screens/panti/ManajemenDonasiBarangScreen";
import TambahKebutuhanBarangScreen from "./screens/panti/TambahKebutuhanBarangScreen";
import KonfirmasiPenerimaanBarangScreen from "./screens/panti/KonfirmasiPenerimaanBarangScreen";
import ManajemenKampanyeScreen from "./screens/panti/ManajemenKampanyeScreen";
import BuatKampanyeScreen from "./screens/panti/BuatKampanyeScreen";
import LaporanPantiScreen from "./screens/panti/LaporanPantiScreen";
import ProfilPantiScreen from "./screens/panti/ProfilPantiScreen";
import EditProfilPantiScreen from "./screens/panti/EditProfilPantiScreen";

// Admin Screens
import HomeAdminScreen from "./screens/admin/HomeAdminScreen";
import VerifikasiScreen from "./screens/admin/VerifikasiScreen";
import VerifikasiPantiDetailScreen from "./screens/admin/VerifikasiPantiDetailScreen";
import VerifikasiKampanyeDetailScreen from "./screens/admin/VerifikasiKampanyeDetailScreen";
import ManajemenPenggunaScreen from "./screens/admin/ManajemenPenggunaScreen";
import UserDetailScreen from "./screens/admin/UserDetailScreen";
import LaporanAdminScreen from "./screens/admin/LaporanAdminScreen";
import PengaturanPlatformScreen from "./screens/admin/PengaturanPlatformScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashScreen />,
  },
  {
    path: "/onboarding",
    element: <OnboardingScreen />,
  },
  {
    path: "/login",
    element: <LoginScreen />,
  },
  {
    path: "/register/relawan",
    element: <RegisterRelawanScreen />,
  },
  {
    path: "/register/panti",
    element: <RegisterPantiScreen />,
  },
  {
    path: "/email-verification",
    element: <EmailVerificationScreen />,
  },
  {
    path: "/pending-verification",
    element: <PendingVerificationScreen />,
  },
  // Relawan/Donatur Routes
  {
    path: "/relawan/home",
    element: <HomeRelawanScreen />,
  },
  {
    path: "/relawan/explore",
    element: <ExploreScreen />,
  },
  {
    path: "/relawan/riwayat",
    element: <RiwayatScreen />,
  },
  {
    path: "/relawan/profil",
    element: <ProfilScreen />,
  },
  {
    path: "/relawan/notifikasi",
    element: <NotifikasiScreen />,
  },
  // Pengelola Panti Routes
  {
    path: "/panti/home",
    element: <HomePantiScreen />,
  },
  {
    path: "/panti/kegiatan",
    element: <JadwalKegiatanPantiScreen />,
  },
  {
    path: "/panti/kegiatan/:id",
    element: <ActivityManagementDetailScreen />,
  },
  {
    path: "/panti/tambah-kegiatan",
    element: <TambahKegiatanScreen />,
  },
  {
    path: "/panti/donasi",
    element: <ManajemenDonasiBarangScreen />,
  },
  {
    path: "/panti/tambah-kebutuhan",
    element: <TambahKebutuhanBarangScreen />,
  },
  {
    path: "/panti/donasi/konfirmasi",
    element: <KonfirmasiPenerimaanBarangScreen />,
  },
  {
    path: "/panti/kampanye",
    element: <ManajemenKampanyeScreen />,
  },
  {
    path: "/panti/buat-kampanye",
    element: <BuatKampanyeScreen />,
  },
  {
    path: "/panti/laporan",
    element: <LaporanPantiScreen />,
  },
  {
    path: "/panti/profil",
    element: <ProfilPantiScreen />,
  },
  {
    path: "/panti/edit-profil",
    element: <EditProfilPantiScreen />,
  },
  // Admin Routes
  {
    path: "/admin/home",
    element: <HomeAdminScreen />,
  },
  {
    path: "/admin/verifikasi",
    element: <VerifikasiScreen />,
  },
  {
    path: "/admin/verifikasi/panti/:id",
    element: <VerifikasiPantiDetailScreen />,
  },
  {
    path: "/admin/verifikasi/kampanye/:id",
    element: <VerifikasiKampanyeDetailScreen />,
  },
  {
    path: "/admin/pengguna",
    element: <ManajemenPenggunaScreen />,
  },
  {
    path: "/admin/pengguna/:id",
    element: <UserDetailScreen />,
  },
  {
    path: "/admin/laporan",
    element: <LaporanAdminScreen />,
  },
  {
    path: "/admin/pengaturan",
    element: <PengaturanPlatformScreen />,
  },
]);
