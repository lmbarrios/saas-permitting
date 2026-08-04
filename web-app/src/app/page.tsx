"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  User,
  X,
  MapPin,
  Mail,
  Phone,
  Bookmark
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("projects"); // projects, clients, permits

  // User States
  const [userName, setUserName] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [token, setToken] = useState("");

  // Data Lists
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [permits, setPermits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal open states
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isPermitModalOpen, setIsPermitModalOpen] = useState(false);

  // Modal form states
  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "", address: "" });
  const [newProject, setNewProject] = useState({ clientId: "", name: "", address: "", scope: "" });
  const [newPermit, setNewPermit] = useState({ projectId: "", jurisdictionId: "330e8400-e29b-41d4-a716-446655440010", type: "edificación_obra_nueva" });
  
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  // Validate Authentication & Fetch initial data
  useEffect(() => {
    const savedToken = localStorage.getItem("jwt_token");
    if (!savedToken) {
      router.push("/login");
      return;
    }

    setToken(savedToken);
    setUserName(localStorage.getItem("user_name") || "John Doe");
    setTenantName(localStorage.getItem("tenant_name") || "ACME Permitting Services");

    fetchData(savedToken);
  }, [router]);

  const fetchData = async (jwtToken: string) => {
    setIsLoading(true);
    try {
      const headers = { "Authorization": `Bearer ${jwtToken}` };

      // Fetch Clients
      const clientsRes = await fetch("http://localhost:8082/api/v1/clients", { headers });
      const clientsData = await clientsRes.json();
      const loadedClients = Array.isArray(clientsData) ? clientsData : [];
      setClients(loadedClients);

      // Fetch Projects
      const projectsRes = await fetch("http://localhost:8082/api/v1/projects", { headers });
      const projectsData = await projectsRes.json();
      const loadedProjects = Array.isArray(projectsData) ? projectsData : [];
      setProjects(loadedProjects);

      // Fetch Permits
      const permitsRes = await fetch("http://localhost:8082/api/v1/permits", { headers });
      const permitsData = await permitsRes.json();
      const loadedPermits = Array.isArray(permitsData) ? permitsData : [];
      setPermits(loadedPermits);

    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    router.push("/login");
  };

  // Creation Actions
  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError("");

    try {
      const res = await fetch("http://localhost:8082/api/v1/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newClient.name,
          contact_email: newClient.email,
          contact_phone: newClient.phone,
          billing_address: newClient.address
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al registrar cliente");

      setIsClientModalOpen(false);
      setNewClient({ name: "", email: "", phone: "", address: "" });
      fetchData(token);
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError("");

    try {
      const res = await fetch("http://localhost:8082/api/v1/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          client_id: newProject.clientId,
          name: newProject.name,
          address: newProject.address,
          scope: newProject.scope
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al registrar proyecto");

      setIsProjectModalOpen(false);
      setNewProject({ clientId: "", name: "", address: "", scope: "" });
      fetchData(token);
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCreatePermit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError("");

    try {
      const res = await fetch("http://localhost:8082/api/v1/permits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          project_id: newPermit.projectId,
          jurisdiction_id: newPermit.jurisdictionId,
          type: newPermit.type
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear expediente de permiso");

      setIsPermitModalOpen(false);
      setNewPermit({ projectId: "", jurisdictionId: "330e8400-e29b-41d4-a716-446655440010", type: "edificación_obra_nueva" });
      fetchData(token);
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  // Stats computation
  const stats = [
    { label: "Proyectos Registrados", value: projects.length.toString(), icon: FolderKanban, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Clientes CRM", value: clients.length.toString(), icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Expedientes de Permiso", value: permits.length.toString(), icon: FileText, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Alertas Activas", value: "0", icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  return (
    <div className="flex min-h-screen bg-[#07090e] overflow-hidden">
      {/* Decorative Blur Blob */}
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
              onClick={() => setActiveTab("projects")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "projects"
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
              Expedientes
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
              {activeTab === "projects" && "Gestión de Proyectos"}
              {activeTab === "clients" && "Clientes (CRM)"}
              {activeTab === "permits" && "Bandeja de Permisos"}
            </h1>
            <p className="text-gray-400 text-xs font-medium">
              Inquilino Activo: <span className="text-blue-400 font-semibold">{tenantName}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full" />
            </button>

            {activeTab === "clients" && (
              <button onClick={() => setIsClientModalOpen(true)} className="btn-glow flex items-center gap-2 text-sm h-11 px-5">
                <Plus className="w-4 h-4" />
                Nuevo Cliente
              </button>
            )}

            {activeTab === "projects" && (
              <button 
                onClick={() => {
                  if (clients.length === 0) {
                    alert("Por favor registra al menos un cliente antes de crear un proyecto.");
                  } else {
                    setNewProject({ ...newProject, clientId: clients[0].id });
                    setIsProjectModalOpen(true);
                  }
                }}
                className="btn-glow flex items-center gap-2 text-sm h-11 px-5"
              >
                <Plus className="w-4 h-4" />
                Nuevo Proyecto
              </button>
            )}

            {activeTab === "permits" && (
              <button 
                onClick={() => {
                  if (projects.length === 0) {
                    alert("Por favor registra al menos un proyecto antes de iniciar un trámite de permiso.");
                  } else {
                    setNewPermit({ ...newPermit, projectId: projects[0].id });
                    setIsPermitModalOpen(true);
                  }
                }}
                className="btn-glow flex items-center gap-2 text-sm h-11 px-5"
              >
                <Plus className="w-4 h-4" />
                Iniciar Trámite
              </button>
            )}
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

        {/* List Content */}
        {isLoading ? (
          <div className="flex-1 glass-panel flex items-center justify-center min-h-[300px]">
            <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 flex-1 flex flex-col"
          >
            {/* PROJECTS TAB */}
            {activeTab === "projects" && (
              <>
                <h3 className="text-lg font-bold text-white mb-6">Lista de Proyectos</h3>
                {projects.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-gray-400">
                    <FolderKanban className="w-12 h-12 text-gray-600 mb-4" />
                    <p className="text-sm font-semibold">No hay proyectos registrados en este Tenant.</p>
                    <p className="text-xs text-gray-500 mt-1">Registra un cliente e inicia tu primer proyecto de edificación.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-xs text-gray-500 font-bold uppercase pb-4">
                          <th className="pb-4">Nombre Proyecto</th>
                          <th className="pb-4">Dirección</th>
                          <th className="pb-4">Detalle / Alcance</th>
                          <th className="pb-4">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                        {projects.map((pr, idx) => (
                          <tr key={idx} className="hover:bg-white/[0.01] transition-all">
                            <td className="py-4 font-bold text-white flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                              {pr.name}
                            </td>
                            <td className="py-4 text-gray-400 text-xs">{pr.address}</td>
                            <td className="py-4 text-xs text-gray-400">{pr.scope || "Sin alcance definido"}</td>
                            <td className="py-4">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                                {pr.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {/* CLIENTS TAB */}
            {activeTab === "clients" && (
              <>
                <h3 className="text-lg font-bold text-white mb-6">Cartera de Clientes</h3>
                {clients.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-gray-400">
                    <Users className="w-12 h-12 text-gray-600 mb-4" />
                    <p className="text-sm font-semibold">No tienes clientes registrados todavía.</p>
                    <p className="text-xs text-gray-500 mt-1">Crea tus clientes comerciales para asociarles sus respectivos proyectos de construcción.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {clients.map((cl, idx) => (
                      <div key={idx} className="border border-white/5 bg-[#0f131e]/40 p-5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-all">
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                              <Users className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h4 className="font-bold text-white text-base leading-tight">{cl.name}</h4>
                          </div>
                          <div className="space-y-2 text-xs text-gray-400">
                            <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-emerald-500" /> {cl.contact_email}</p>
                            <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-emerald-500" /> {cl.contact_phone || "No registrado"}</p>
                            <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-emerald-500" /> {cl.billing_address || "Sin dirección comercial"}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* PERMITS TAB */}
            {activeTab === "permits" && (
              <>
                <h3 className="text-lg font-bold text-white mb-6">Expedientes de Construcción</h3>
                {permits.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-gray-400">
                    <FileText className="w-12 h-12 text-gray-600 mb-4" />
                    <p className="text-sm font-semibold">No hay expedientes de permisos iniciados.</p>
                    <p className="text-xs text-gray-500 mt-1">Selecciona un proyecto e inicia su trámite municipal ante la dirección de obras correspondientes.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-xs text-gray-500 font-bold uppercase pb-4">
                          <th className="pb-4">Caso ID</th>
                          <th className="pb-4">Tipo Permiso</th>
                          <th className="pb-4">Estado Interno</th>
                          <th className="pb-4">Estado Municipal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                        {permits.map((pe, idx) => (
                          <tr key={idx} className="hover:bg-white/[0.01] transition-all">
                            <td className="py-4 font-mono text-xs text-blue-400 font-bold">{pe.id.substring(0, 8)}...</td>
                            <td className="py-4 text-xs font-semibold text-white uppercase">{pe.type.replace(/_/g, " ")}</td>
                            <td className="py-4">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                                {pe.internal_status}
                              </span>
                            </td>
                            <td className="py-4 text-xs text-gray-400">{pe.external_status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </main>

      {/* MODALS SECTION */}
      <AnimatePresence>
        {/* NEW CLIENT MODAL */}
        {isClientModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="glass-panel p-6 w-full max-w-md relative bg-[#0c0f16]">
              <button onClick={() => setIsClientModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Users className="w-5 h-5 text-blue-500" /> Registrar Cliente</h3>
              <form onSubmit={handleCreateClient} className="space-y-4">
                {modalError && <div className="text-red-400 text-xs bg-red-500/15 border border-red-500/20 p-2.5 rounded-lg text-center">{modalError}</div>}
                
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-300 font-semibold">Razón Social / Nombre</label>
                  <input type="text" required className="glass-input text-xs" placeholder="Inmobiliaria ACME Ltda" value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-300 font-semibold">Correo de Contacto</label>
                  <input type="email" required className="glass-input text-xs" placeholder="contacto@acme.com" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-300 font-semibold">Teléfono</label>
                    <input type="text" className="glass-input text-xs" placeholder="+5691234..." value={newClient.phone} onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-300 font-semibold">Dirección Comercial</label>
                    <input type="text" className="glass-input text-xs" placeholder="Av. Kennedy 1234" value={newClient.address} onChange={(e) => setNewClient({ ...newClient, address: e.target.value })} />
                  </div>
                </div>
                <button type="submit" disabled={modalLoading} className="btn-glow w-full text-xs h-10 mt-6">
                  {modalLoading ? "Registrando..." : "Crear Cliente"}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* NEW PROJECT MODAL */}
        {isProjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="glass-panel p-6 w-full max-w-md relative bg-[#0c0f16]">
              <button onClick={() => setIsProjectModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><FolderKanban className="w-5 h-5 text-blue-500" /> Crear Proyecto</h3>
              <form onSubmit={handleCreateProject} className="space-y-4">
                {modalError && <div className="text-red-400 text-xs bg-red-500/15 border border-red-500/20 p-2.5 rounded-lg text-center">{modalError}</div>}
                
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-300 font-semibold">Cliente Propietario</label>
                  <select className="glass-input text-xs bg-[#0c0f16]" value={newProject.clientId} onChange={(e) => setNewProject({ ...newProject, clientId: e.target.value })}>
                    {clients.map((cl, idx) => (
                      <option key={idx} value={cl.id}>{cl.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-300 font-semibold">Nombre del Proyecto</label>
                  <input type="text" required className="glass-input text-xs" placeholder="Edificio Centenario" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-300 font-semibold">Dirección del Proyecto</label>
                  <input type="text" required className="glass-input text-xs" placeholder="Av. Providencia 4560, Providencia" value={newProject.address} onChange={(e) => setNewProject({ ...newProject, address: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-300 font-semibold">Alcance del Proyecto</label>
                  <input type="text" className="glass-input text-xs" placeholder="Ej. Remodelación oficina o edificación de 10 pisos" value={newProject.scope} onChange={(e) => setNewProject({ ...newProject, scope: e.target.value })} />
                </div>
                <button type="submit" disabled={modalLoading} className="btn-glow w-full text-xs h-10 mt-6">
                  {modalLoading ? "Registrando..." : "Crear Proyecto"}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* NEW PERMIT MODAL */}
        {isPermitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="glass-panel p-6 w-full max-w-md relative bg-[#0c0f16]">
              <button onClick={() => setIsPermitModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-500" /> Iniciar Expediente de Permiso</h3>
              <form onSubmit={handleCreatePermit} className="space-y-4">
                {modalError && <div className="text-red-400 text-xs bg-red-500/15 border border-red-500/20 p-2.5 rounded-lg text-center">{modalError}</div>}
                
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-300 font-semibold">Asociar a Proyecto</label>
                  <select className="glass-input text-xs bg-[#0c0f16]" value={newPermit.projectId} onChange={(e) => setNewPermit({ ...newPermit, projectId: e.target.value })}>
                    {projects.map((pr, idx) => (
                      <option key={idx} value={pr.id}>{pr.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-300 font-semibold">Municipio / Jurisdicción</label>
                  <select className="glass-input text-xs bg-[#0c0f16]" value={newPermit.jurisdictionId} onChange={(e) => setNewPermit({ ...newPermit, jurisdictionId: e.target.value })}>
                    <option value="330e8400-e29b-41d4-a716-446655440010">Municipalidad de Santiago (Demo)</option>
                    <option value="440e8400-e29b-41d4-a716-446655440020">Municipalidad de Providencia (Demo)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-300 font-semibold">Tipo de Permiso</label>
                  <select className="glass-input text-xs bg-[#0c0f16]" value={newPermit.type} onChange={(e) => setNewPermit({ ...newPermit, type: e.target.value })}>
                    <option value="edificación_obra_nueva">Edificación de Obra Nueva</option>
                    <option value="alteración_y_reconstrucción">Alteración y Reconstrucción</option>
                    <option value="obra_menor_ampliación">Obra Menor o Ampliación</option>
                    <option value="demolición_total">Demolición Total</option>
                  </select>
                </div>
                <button type="submit" disabled={modalLoading} className="btn-glow w-full text-xs h-10 mt-6">
                  {modalLoading ? "Iniciando..." : "Iniciar Trámite"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
