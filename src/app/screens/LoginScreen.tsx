import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, Eye, EyeOff, User, Home, Settings, Check, AlertCircle } from "lucide-react";
import logoImg from "../../imports/Removal-3.png";
import { login, loginWithGoogle, getCurrentUser, sendPasswordReset, getAuthErrorMessage } from "../../imports/appwrite/auth";
import { setPendingRole, getPendingRole, clearPendingRole } from "../../imports/appwrite/roleStorage";

type UserRole = "relawan" | "panti" | "admin" | null;

const roleConfig = {
  relawan: {
    icon: User,
    label: "Relawan / Donatur",
    color: "coral",
    showGoogle: true,
    showRegister: true,
  },
  panti: {
    icon: Home,
    label: "Pengelola Panti",
    color: "teal",
    showGoogle: true,
    showRegister: true,
  },
  admin: {
    icon: Settings,
    label: "Admin",
    color: "lavender",
    showGoogle: false,
    showRegister: false,
  },
};

export default function LoginScreen() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(email, password);
      let user = await getCurrentUser();
      console.log("[LoginScreen Debug] User data:", user);
      
      // AUTO-CREATOR ADMIN: Jika user berhasil ter-auth tetapi userDoc kosong,
      // dan email yang digunakan adalah domain admin@hopehand.org, otomatis buatkan dokumennya di database.
      if (user?.authUser && !user.userDoc && email.endsWith("@hopehand.org")) {
        console.log("[LoginScreen Debug] Admin detected but missing DB document. Auto-creating document...");
        try {
          const { databases } = await import("@/imports/appwrite/client");
          const { DB_ID, COLLECTIONS } = await import("@/imports/appwrite/config");
          
          await databases.createDocument(
            DB_ID,
            COLLECTIONS.USERS,
            user.authUser.$id,
            {
              userId: user.authUser.$id,
              nama: user.authUser.name || "Admin HopeHand",
              email: user.authUser.email,
              role: "admin",
              createdAt: new Date().toISOString()
            }
          );
          console.log("[LoginScreen Debug] Admin DB document successfully created!");
          // Ambil ulang user data setelah dokumen dibuat
          user = await getCurrentUser();
        } catch (dbErr) {
          console.error("[LoginScreen Debug] Failed to auto-create admin doc:", dbErr);
        }
      }

      if (user?.userDoc) {
        if (user.userDoc.status === "suspend") {
          setError("Akun Anda ditangguhkan (suspend) sementara. Hubungi admin.");
          await logout();
          setIsLoading(false);
          return;
        } else if (user.userDoc.status === "banned") {
          setError("Akun Anda diblokir (banned) secara permanen.");
          await logout();
          setIsLoading(false);
          return;
        }
      }

      const role = user?.userDoc?.role;
      console.log("[LoginScreen Debug] Detected role:", role);
      if (role === "relawan") {
        navigate("/relawan/home", { replace: true });
      } else if (role === "panti") {
        const { pantiDB } = await import("@/imports/appwrite/database");
        const pantiRes = await pantiDB.getByUserId(user!.authUser.$id);
        const myPanti = pantiRes.documents[0];
        if (myPanti?.status === "terverifikasi") {
          navigate("/panti/home", { replace: true });
        } else if (myPanti?.status === "ditolak") {
          setError("Pendaftaran panti Anda ditolak oleh admin. Alasan: " + (myPanti.catatanAdmin || "-"));
          await logout();
        } else {
          navigate("/pending-verification", { replace: true });
        }
      } else if (role === "admin") {
        navigate("/admin/home", { replace: true });
      } else {
        console.log("[LoginScreen Debug] Role not matched, redirecting to fallback /relawan/home");
        navigate("/relawan/home", { replace: true }); // fallback
      }
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Save the selected role so we can redirect appropriately after OAuth
    if (selectedRole) {
      setPendingRole(selectedRole);
    }
    loginWithGoogle();
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) return;
    setIsLoading(true);
    try {
      await sendPasswordReset(resetEmail);
      setResetSent(true);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleRedirect = async () => {
      const user = await getCurrentUser();
      if (user?.userDoc) {
        if (user.userDoc.status === "suspend") {
          setError("Akun Anda ditangguhkan (suspend) sementara. Hubungi admin.");
          await logout();
          clearPendingRole();
          return;
        } else if (user.userDoc.status === "banned") {
          setError("Akun Anda diblokir (banned) secara permanen.");
          await logout();
          clearPendingRole();
          return;
        }

        const role = user.userDoc.role;
        if (role === "panti") {
          const { pantiDB } = await import("@/imports/appwrite/database");
          const pantiRes = await pantiDB.getByUserId(user.authUser.$id);
          const myPanti = pantiRes.documents[0];
          if (myPanti?.status === "terverifikasi") {
            navigate("/panti/home", { replace: true });
          } else if (myPanti?.status === "ditolak") {
            setError("Pendaftaran panti Anda ditolak oleh admin. Alasan: " + (myPanti.catatanAdmin || "-"));
            await logout();
          } else {
            navigate("/pending-verification", { replace: true });
          }
        } else if (role === "relawan") {
          navigate("/relawan/home", { replace: true });
        } else if (role === "admin") {
          navigate("/admin/home", { replace: true });
        } else {
          navigate("/relawan/home", { replace: true });
        }
        clearPendingRole();
        return;
      }

      if (user?.authUser) {
        const pending = getPendingRole();
        if (pending === "panti") {
          navigate("/register/panti");
          return;
        }
        if (pending === "relawan") {
          navigate("/register/relawan");
          return;
        }
      }

      const pending = getPendingRole();
      if (pending) {
        setSelectedRole(pending as UserRole);
      }
    };
    void handleRedirect();
  }, [navigate]);

  const handleRegister = () => {
    if (selectedRole === "relawan") {
      navigate("/register/relawan");
    } else if (selectedRole === "panti") {
      navigate("/register/panti");
    }
  };

  const getColorClasses = (role: UserRole) => {
    if (role === "relawan") return "bg-coral text-white";
    if (role === "panti") return "bg-teal text-white";
    if (role === "admin") return "bg-lavender text-white";
    return "";
  };

  const getBorderClasses = (role: UserRole) => {
    if (role === "relawan") return "border-coral";
    if (role === "panti") return "border-teal";
    if (role === "admin") return "border-lavender";
    return "";
  };

  return (
    <div className="min-h-screen bg-cream p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        {/* Logo & Heading */}
        <div className="text-center space-y-4">
          <img
            src={logoImg}
            alt="Hope Hand Logo"
            className="w-24 h-24 mx-auto object-contain"
          />
          <h1 className="text-3xl">Selamat Datang</h1>
          <p className="text-foreground/70">Pilih peranmu untuk masuk</p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(roleConfig).map(([role, config]) => {
            const isSelected = selectedRole === role;
            const Icon = config.icon;

            return (
              <motion.button
                key={role}
                onClick={() => setSelectedRole(role as UserRole)}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? `${getColorClasses(role as UserRole)} scale-105 shadow-lg`
                    : "bg-white border-border hover:border-coral/30"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-coral" />
                  </motion.div>
                )}
                <div className="flex flex-col items-center space-y-2">
                  <Icon
                    className={`w-8 h-8 ${
                      isSelected ? "text-white" : "text-foreground/60"
                    }`}
                  />
                  <span
                    className={`text-xs text-center ${
                      isSelected ? "text-white" : "text-foreground/60"
                    }`}
                  >
                    {config.label}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Login Form */}
        <AnimatePresence mode="wait">
          {selectedRole && (
            <motion.div
              key={selectedRole}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-4">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className="w-full pl-11 pr-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/50"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full pl-11 pr-12 py-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/50"
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

                {/* Forgot Password Link */}
                {selectedRole !== "admin" && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-coral hover:underline"
                    >
                      Lupa Password?
                    </button>
                  </div>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 rounded-full transition-all ${getColorClasses(
                    selectedRole
                  )} hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {isLoading ? "Memuat..." : "Masuk"}
                </button>

                {/* Google SSO */}
                {roleConfig[selectedRole].showGoogle && (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-cream text-foreground/60">
                          atau
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="w-full py-3 bg-white border border-border rounded-full hover:bg-muted transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span>Masuk dengan Google</span>
                    </button>
                  </>
                )}

                {/* Register Link */}
                {roleConfig[selectedRole].showRegister && (
                  <p className="text-center text-sm text-foreground/70">
                    Belum punya akun?{" "}
                    <button
                      type="button"
                      onClick={handleRegister}
                      className="text-coral hover:underline"
                    >
                      Daftar
                    </button>
                  </p>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-6 z-50">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-md"
          >
            <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-6" />
            <h3 className="text-xl mb-4">Reset Password</h3>
            {resetSent ? (
              <div className="text-center space-y-4">
                <p className="text-green-600 text-sm">Link reset password telah dikirim ke <strong>{resetEmail}</strong>. Cek email kamu!</p>
                <button
                  onClick={() => { setShowForgotPassword(false); setResetSent(false); }}
                  className="w-full py-3 bg-coral text-white rounded-full hover:bg-coral/90 transition-colors"
                >
                  Tutup
                </button>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Masukkan email"
                  className="w-full px-4 py-3 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/50 mb-4"
                />
                <button
                  onClick={handleForgotPassword}
                  disabled={isLoading || !resetEmail}
                  className="w-full py-3 bg-coral text-white rounded-full hover:bg-coral/90 transition-colors mb-2 disabled:opacity-60"
                >
                  {isLoading ? "Mengirim..." : "Kirim Link Reset"}
                </button>
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full py-3 text-foreground/70 hover:text-foreground transition-colors"
                >
                  Tutup
                </button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
