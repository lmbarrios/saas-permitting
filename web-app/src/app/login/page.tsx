"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@acme-permits.com");
  const [password, setPassword] = useState("supersecretpassword123");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate login for frontend demo (or connect to localhost:8081 in next step)
    setTimeout(() => {
      if (email === "admin@acme-permits.com" && password === "supersecretpassword123") {
        // Save dummy token
        localStorage.setItem("jwt_token", "dummy_token_value_xyz");
        localStorage.setItem("user_name", "John Doe");
        localStorage.setItem("user_email", email);
        localStorage.setItem("tenant_name", "ACME Permitting Services");
        
        router.push("/");
      } else {
        setError("Credenciales incorrectas o inquilino no activo.");
        setIsLoading(false);
      }
    }, 1500);
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
        className="w-full max-w-md"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-600/10 border border-blue-500/20 mb-4"
          >
            <ShieldCheck className="w-8 h-8 text-blue-500" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold tracking-tight text-white mb-2"
          >
            SaaS Permitting
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 text-sm"
          >
            Ingresa a tu portal de administración de permisos
          </motion.p>
        </div>

        {/* Login Card */}
        <div className="glass-panel p-8 shadow-2xl relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" />
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                className="glass-input text-sm"
                placeholder="ejemplo@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-500" />
                  Contraseña
                </label>
                <a href="#" className="text-xs text-blue-400 hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <input
                type="password"
                required
                className="glass-input text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-glow w-full flex items-center justify-center gap-2 text-sm h-12"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Help */}
          <div className="mt-6 pt-6 border-t border-white/5 flex items-start gap-2.5 text-xs text-gray-400">
            <HelpCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-gray-300">Modo Demo Activado:</span> Puedes usar el usuario por defecto ya ingresado para acceder directamente.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            ¿Tu constructora no tiene cuenta?{" "}
            <a href="#" className="text-blue-400 hover:underline font-semibold">
              Regístrate aquí
            </a>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
