"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Building, 
  Users, 
  FileText, 
  Bell, 
  LogOut, 
  Plus, 
  FolderKanban, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  User
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("John Doe");
  const [tenantName, setTenantName] = useState("ACME Permitting Services");
  const [activeTab, setActiveTab] = useState("dashboard");

  // Validate authentication
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      router.push("/login");
    } else {
      setUserName(localStorage.getItem("user_name") || "John Doe");
      setTenantName(localStorage.getItem("tenant_name") || "ACME Permitting Services");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    router.push("/login");
  };

  // Mock Data
  const stats = [
    { label: "Proyectos Activos", value: "8", icon: FolderKanban, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Permisos Aprobados", value: "14", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "En Revisión Municipal", value: "5", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Acción Requerida", value: "2", icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
  ];

  const projects = [
    { id: "1", name: "Edificio Mirador Alameda", address: "Av. Libertador B. O'Higgins 456", client: "Inmobiliaria del Pacífico", status: "Revisión", progress: 65 },
    { id: "2", name: "Condominio Valle Grande", address: "Camino Melipilla Km 15", client: "Constructora Delta", status: "Aprobado", progress: 100 },
    { id: "3", name: "Parque Industrial Quilicura", address: "Av. Américo Vespucio 900", client: "Bodegas San Francisco", status: "Observado", progress: 40 },
    { id: "4", name: "Remodelación Local Comercial", address: "Mall Plaza Vespucio Local 102", client: "Retail S.A.", status: "Borrador", progress: 10 },
  ];

  return (
    <div className="flex min-h-screen bg-[#07090e] overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0c0f16]/60 backdrop-blur-md flex flex-col justify-between p-6 z-10">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/25">
              <Building className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="font-bold text-white tracking-tight leading-none text-base">SaaS Permits</h2>
              <span className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase">Plataforma Base</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "dashboard"
                  ? "bg-blue-600/15 border-l-2 border-blue-500 text-blue-400"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              Proyectos
            </button>
            <button
              onClick={() => setActiveTab("clients")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "clients"
                  ? "bg-blue-600/15 border-l-2 border-blue-500 text-blue-400"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              <Users className="w-4 h-4" />
              Clientes (CRM)
            </button>
            <button
              onClick={() => setActiveTab("permits")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "permits"
                  ? "bg-blue-600/15 border-l-2 border-blue-500 text-blue-400"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              <FileText className="w-4 h-4" />
              Permisos
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-4 pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <User className="w-4 h-4 text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate leading-tight">{userName}</p>
              <span className="text-[10px] text-gray-500 truncate block">{tenantName}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto p-8 z-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
              {activeTab === "dashboard" && "Gestión de Proyectos"}
              {activeTab === "clients" && "Clientes CRM"}
              {activeTab === "permits" && "Bandeja de Permisos"}
            </h1>
            <p className="text-gray-400 text-xs font-medium">
              Portal del Tenant: <span className="text-blue-400">{tenantName}</span>
            </p>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full" />
            </button>
            <button className="btn-glow flex items-center gap-2 text-sm h-11 px-5">
              <Plus className="w-4 h-4" />
              {activeTab === "dashboard" && "Nuevo Proyecto"}
              {activeTab === "clients" && "Nuevo Cliente"}
              {activeTab === "permits" && "Iniciar Permiso"}
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="glass-panel p-5 flex items-center gap-4"
            >
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 tracking-wide uppercase">{stat.label}</p>
                <h3 className="text-2xl font-bold text-white mt-1 leading-none">{stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Table & Details Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="glass-panel flex-1 p-6 overflow-hidden flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Casos Recientes</h3>
            <span className="text-xs text-blue-400 font-semibold cursor-pointer hover:underline">Ver Todos</span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/5 text-xs text-gray-500 font-bold uppercase tracking-wider">
                  <th className="pb-4 font-semibold">Proyecto</th>
                  <th className="pb-4 font-semibold">Dirección</th>
                  <th className="pb-4 font-semibold">Cliente</th>
                  <th className="pb-4 font-semibold">Estado</th>
                  <th className="pb-4 font-semibold text-right">Progreso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                {projects.map((project, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-all">
                    <td className="py-4 font-bold text-white flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      {project.name}
                    </td>
                    <td className="py-4 text-gray-400 text-xs font-medium">{project.address}</td>
                    <td className="py-4 font-semibold text-xs">{project.client}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                        project.status === "Aprobado" && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      } ${
                        project.status === "Revisión" && "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      } ${
                        project.status === "Observado" && "bg-red-500/10 text-red-400 border border-red-500/20"
                      } ${
                        project.status === "Borrador" && "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="py-4 text-right font-mono font-bold text-xs text-white">
                      <div className="flex items-center justify-end gap-2">
                        <span>{project.progress}%</span>
                        <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              project.progress === 100 ? "bg-emerald-500" : "bg-blue-500"
                            }`} 
                            style={{ width: `${project.progress}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
