"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, ArrowRight, ShieldCheck, HelpCircle, User, Building } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Login States
  const [email, setEmail] = useState("admin@acme-permits.com");
  const [password, setPassword] = useState("supersecretpassword123");

  // Signup States
  const [tenantName, setTenantName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [plan, setPlan] = useState("professional");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8081/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al iniciar sesión.");
      }

      // Save credentials in LocalStorage
      localStorage.setItem("jwt_token", data.token);
      localStorage.setItem("user_id", data.user.id);
      localStorage.setItem("user_name", data.user.name);
      localStorage.setItem("user_email", data.user.email);
      localStorage.setItem("tenant_id", data.user.tenant_id);
      localStorage.setItem("user_role", data.user.role);

      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:8081/api/v1/tenants/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_name: tenantName,
          plan: plan,
          admin_email: adminEmail,
          admin_name: adminName,
          admin_password: adminPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al registrar la empresa.");
      }

      setSuccess("¡Empresa registrada con éxito! Ya puedes iniciar sesión.");
      setIsSignUp(false);
      // Prepopulate login email
      setEmail(adminEmail);
      setPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-[#07090e]">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-600/10 border border-blue-500/20 mb-4"
          >
            <ShieldCheck className="w-8 h-8 text-blue-500" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            SaaS Permitting
          </h1>
          <p className="text-gray-400 text-sm">
            {isSignUp ? "Crea una cuenta para tu constructora o gestora" : "Ingresa a tu portal de administración de permisos"}
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-panel p-8 shadow-2xl relative overflow-hidden">
          {/* Error Message */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg text-center mb-6"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Message */}
          <AnimatePresence mode="wait">
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-3 rounded-lg text-center mb-6"
              >
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sign Up Form */}
          {isSignUp ? (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-blue-500" />
                  Nombre de la Empresa / Tenant
                </label>
                <input
                  type="text"
                  required
                  className="glass-input text-xs"
                  placeholder="Constructora ACME S.A."
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-300 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-blue-500" />
                    Nombre del Admin
                  </label>
                  <input
                    type="text"
                    required
                    className="glass-input text-xs"
                    placeholder="John Doe"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-300">Plan</label>
                  <select
                    className="glass-input text-xs bg-[#0c0f16]"
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                  >
                    <option value="starter">Starter</option>
                    <option value="professional">Professional</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                  Correo del Administrador
                </label>
                <input
                  type="email"
                  required
                  className="glass-input text-xs"
                  placeholder="admin@empresa.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-blue-500" />
                  Contraseña (min. 8 caracteres)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  className="glass-input text-xs"
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-glow w-full flex items-center justify-center gap-2 text-xs h-10 mt-6"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Registrar e Iniciar
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  className="glass-input text-xs"
                  placeholder="admin@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-gray-300 flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-blue-500" />
                    Contraseña
                  </label>
                </div>
                <input
                  type="password"
                  required
                  className="glass-input text-xs"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-glow w-full flex items-center justify-center gap-2 text-xs h-11 mt-6"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Iniciar Sesión
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Credentials Help */}
          {!isSignUp && (
            <div className="mt-5 pt-5 border-t border-white/5 flex items-start gap-2 text-[10px] text-gray-400">
              <HelpCircle className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-300">Entorno de Pruebas:</span> Si ya tienes un administrador registrado en tu base de datos local, ingresa sus datos para conectarte en tiempo real.
              </div>
            </div>
          )}
        </div>

        {/* Footer Toggle */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            {isSignUp ? (
              <>
                ¿Ya tienes una cuenta registrada?{" "}
                <button
                  onClick={() => setIsSignUp(false)}
                  className="text-blue-400 hover:underline font-semibold bg-transparent border-none cursor-pointer"
                >
                  Inicia sesión aquí
                </button>
              </>
            ) : (
              <>
                ¿Tu constructora no tiene cuenta?{" "}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-blue-400 hover:underline font-semibold bg-transparent border-none cursor-pointer"
                >
                  Regístrate aquí
                </button>
              </>
            )}
          </p>
        </div>
      </motion.div>
    </main>
  );
}
