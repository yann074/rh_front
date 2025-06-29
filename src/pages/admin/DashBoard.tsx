import type React from "react"
import { useState, useEffect } from "react"
import api from "@/service/Api"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Briefcase, Users, UserCircle, Menu, X, LogOut, LayoutDashboard, TrendingUp, Building2, BookOpen, ExternalLink } from "lucide-react"
import { Link, Outlet } from "react-router-dom"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const AdminDashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [currentView, setCurrentView] = useState("dashboard")
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [jobOpportunities, setJobOpportunities] = useState<any[]>([])

  // ==================== HOOK useEffect ====================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null) // Reseta o estado de erro a cada nova busca

        // 1. Usa Promise.all para buscar os dados de usuários e vagas em paralelo.
        //    Isso é mais rápido do que fazer uma requisição após a outra.
        const [usersResponse, jobsResponse] = await Promise.all([
          api.get("/users"),       // Usa a instância 'api' para a rota de usuários
          api.get("/opportunities") // Usa a instância 'api' para a rota de vagas
        ]);

        // 2. O Axios já retorna os dados em formato JSON no `response.data`.
        //    O interceptor da sua 'api' já incluiu o token de autenticação no cabeçalho.
        if (usersResponse.data.data) {
          setUserData(usersResponse.data.data)
        } else {
          setError("Falha ao carregar dados dos usuários.")
        }

        if (jobsResponse.data.data) {
          setJobOpportunities(jobsResponse.data.data)
        } else {
          console.error("Falha ao carregar as vagas.")
        }

      } catch (err: any) {
        // 3. O Axios trata erros de rede e status (4xx, 5xx) automaticamente no 'catch'.
        const errorMessage = err.response?.data?.message || err.message || "Erro de conexão com o servidor."
        setError(errorMessage)
        console.error("Erro ao buscar dados do dashboard:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])
  // =================================================================

  const dadosPorArea = [
    { area: "Desenvolvimento Web", inscritos: 250 },
    { area: "Data Science", inscritos: 180 },
    { area: "Mobile", inscritos: 120 },
    { area: "DevOps", inscritos: 90 },
    { area: "UX/UI", inscritos: 150 },
  ]

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 flex flex-col w-64 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
          {
            "-translate-x-full lg:translate-x-0 lg:w-20": collapsed,
            "translate-x-0": mobileOpen,
            "-translate-x-full lg:translate-x-0": !mobileOpen,
          },
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 flex-shrink-0">
          <div
            className={cn("flex items-center", {
              "justify-center w-full": collapsed,
            })}
          >
            <Briefcase className="h-6 w-6 text-purple-700 flex-shrink-0" />
            {!collapsed && <span className="ml-2 text-lg font-semibold text-purple-700">CS Instituto</span>}
          </div>
          <Button variant="ghost" size="icon" className="lg:flex hidden" onClick={() => setCollapsed(!collapsed)}>
            <Menu className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="lg:hidden flex" onClick={() => setMobileOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 py-4 px-2 flex flex-col space-y-2 overflow-y-auto">
          <SidebarItem
            icon={<LayoutDashboard />}
            title="Dashboard"
            active={currentView === "dashboard"}
            collapsed={collapsed}
            to="/dashboard"
            onClick={() => setCurrentView("dashboard")}
          />
          <SidebarItem
            icon={<Users />}
            title="Banco de Talentos"
            active={currentView === "bancodetalentos"}
            collapsed={collapsed}
            to="bancodetalentos"
            onClick={() => setCurrentView("bancodetalentos")}
          />
          <SidebarItem
            icon={<Briefcase />}
            title="Vagas"
            active={currentView === "vagas"}
            collapsed={collapsed}
            to="adminjobs"
            onClick={() => setCurrentView("vagas")}
          />
          <SidebarItem
            icon={<UserCircle />}
            title="Usuários"
            active={currentView === "usuarios"}
            collapsed={collapsed}
            to="candidates"
            onClick={() => setCurrentView("usuarios")}
          />
          <SidebarItem
            icon={<Building2 />}
            title="Empresas"
            active={currentView === "empresas"}
            collapsed={collapsed}
            to="empresas"
            onClick={() => setCurrentView("empresas")}
          />
            <SidebarItem
              icon={<BookOpen  />}
              title="Capacitações"
              active={currentView === "trainings"}
              collapsed={collapsed}
              to="capacitacoes" 
              onClick={() => setCurrentView("trainings")}
            />
        </nav>

        {/* Sidebar Footer */}
        <div className="mt-auto border-t border-gray-200 flex-shrink-0">
          <SidebarItem
            icon={<LogOut />}
            title="Sair"
            collapsed={collapsed}
            to="/login"
            className="text-red-500 hover:text-red-600 hover:bg-red-50 p-4 rounded-none"
          />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-5">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="lg:hidden mr-2" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">
              {currentView === "dashboard" && "Painel Administrativo"}
              {currentView === "bancodetalentos" && "Banco de Talentos"}
              {currentView === "vagas" && "Gestão de Vagas"}
              {currentView === "usuarios" && "Gerenciamento de Usuários"}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-white">A</div>
            <span className="text-sm font-medium">Admin</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {currentView === "dashboard" ? (
            <div className="max-w-7xl mx-auto">
              {/* TÍTULO E BOTÃO */}
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold">Dashboard</h2>
                 <Button asChild className="bg-white hover:bg-gray-50">
                   <Link to="/">
                     <ExternalLink className="mr-2 h-4 w-4" />
                     Ver Página de Vagas
                   </Link>
                 </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total de Inscritos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userData ? userData["Count IDs"] : "-"}</div>
                    <p className="text-xs text-muted-foreground">candidatos no banco de talentos</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Crescimento Mensal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {userData && userData["Usuarios por data"].length > 0
                        ? `${userData["Usuarios por data"].reduce((sum: number, item: any) => sum + item.inscritos, 0)}%`
                        : "-"}
                    </div>
                    <p className="text-xs text-muted-foreground">em relação ao mês anterior</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Conversão</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {userData
                        ? `${Math.round((userData["Usuarios"].filter((user: any) => user.active).length / userData["Count IDs"]) * 100)}%`
                        : "-"}
                    </div>
                    <p className="text-xs text-muted-foreground">candidatos ativos</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Usuários Administradores
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {userData ? userData["Usuarios"].filter((user: any) => user.permission === "admin").length : "-"}
                    </div>
                    <p className="text-xs text-muted-foreground">com permissões especiais</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <Tabs defaultValue="diario" className="mb-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-purple-700" />
                    Inscrições de Usuários
                  </h3>
                  <TabsList>
                    <TabsTrigger value="diario">Diário</TabsTrigger>
                    <TabsTrigger value="areas">Por Área</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="diario">
                  <Card>
                    <CardHeader>
                      <CardTitle>Inscrições Diárias</CardTitle>
                      <CardDescription>Total de novos candidatos registrados por dia</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="h-80 flex items-center justify-center">Carregando dados...</div>
                      ) : error ? (
                        <div className="h-80 flex items-center justify-center text-red-500">{error}</div>
                      ) : (
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={userData["Usuarios por data"]}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="dia" />
                              <YAxis />
                              <Tooltip />
                              <Line
                                type="monotone"
                                dataKey="inscritos"
                                stroke="#8884d8"
                                activeDot={{ r: 8 }}
                                strokeWidth={2}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="areas">
                  <Card>
                    <CardHeader>
                      <CardTitle>Inscrições por Área de Interesse</CardTitle>
                      <CardDescription>Distribuição dos candidatos por especialidade</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={dadosPorArea} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="area" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="inscritos" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Placeholder Content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Últimas Inscrições</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-4">Carregando dados...</div>
                    ) : error ? (
                      <div className="flex items-center justify-center py-4 text-red-500">{error}</div>
                    ) : (
                      <div className="space-y-4">
                        {userData &&
                          userData["Usuarios"].slice(0, 3).map((user: any) => (
                            <div key={user.id} className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Atividades Recentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { acao: "Nova vaga publicada", tempo: "10 min atrás" },
                        { acao: "Candidato contratado", tempo: "2 horas atrás" },
                        { acao: "Perfil atualizado", tempo: "5 horas atrás" },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0"
                        >
                          <p className="text-sm">{item.acao}</p>
                          <p className="text-xs text-gray-500">{item.tempo}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Últimas Vagas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-4">Carregando vagas...</div>
                    ) : (
                      <div className="space-y-4">
                        {jobOpportunities.length > 0 ? (
                          [...jobOpportunities]
                            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                            .slice(0, 3)
                            .map((job) => (
                              <div key={job.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium">{job.title}</p>
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      job.status === "aberto" || job.status === "ativo"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {job.status}
                                  </span>
                                </div>
                                <div className="flex justify-between mt-1">
                                  <p className="text-xs text-gray-500">{job.job_type}</p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(job.created_at).toLocaleDateString("pt-BR")}
                                  </p>
                                </div>
                              </div>
                            ))
                        ) : (
                          <p className="text-sm text-gray-500 text-center">Nenhuma vaga disponível</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            // Outlet para renderizar componentes aninhados (Banco de Talentos, Vagas, Usuários)
            <Outlet />
          )}
        </main>
      </div>
    </div>
  )
}

interface SidebarItemProps {
  icon: React.ReactNode
  title: string
  active?: boolean
  collapsed?: boolean
  to?: string
  className?: string
  onClick?: () => void
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  title,
  active = false,
  collapsed = false,
  to,
  className = "",
  onClick,
}) => {
  const baseClasses = cn(
    "w-full p-2 rounded-md transition-colors flex", 
    collapsed ? "justify-center" : "items-center",
    active ? "bg-purple-50 text-purple-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    className, 
  )

  const content = (
    <>
      <span className="flex-shrink-0">{icon}</span>
      {!collapsed && <span className="ml-3">{title}</span>}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={baseClasses} onClick={onClick}>
        {content}
      </Link>
    )
  }

  return (
    <button className={baseClasses} onClick={onClick}>
      {content}
    </button>
  )
}

export default AdminDashboard