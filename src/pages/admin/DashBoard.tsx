import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Briefcase,
  Users,
  UserCircle,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  TrendingUp
} from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
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
  Legend
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Dados simulados de inscrições de usuários no último mês
const dadosUltimoMes = [
  { dia: '01/03', inscritos: 12 },
  { dia: '02/03', inscritos: 15 },
  { dia: '03/03', inscritos: 10 },
  { dia: '04/03', inscritos: 20 },
  { dia: '05/03', inscritos: 18 },
  { dia: '06/03', inscritos: 25 },
  { dia: '07/03', inscritos: 22 },
  { dia: '08/03', inscritos: 30 },
  { dia: '09/03', inscritos: 28 },
  { dia: '10/03', inscritos: 32 },
  { dia: '11/03', inscritos: 35 },
  { dia: '12/03', inscritos: 30 },
  { dia: '13/03', inscritos: 28 },
  { dia: '14/03', inscritos: 32 },
  { dia: '15/03', inscritos: 35 },
  { dia: '16/03', inscritos: 42 },
  { dia: '17/03', inscritos: 38 },
  { dia: '18/03', inscritos: 40 },
  { dia: '19/03', inscritos: 45 },
  { dia: '20/03', inscritos: 50 },
  { dia: '21/03', inscritos: 48 },
  { dia: '22/03', inscritos: 52 },
  { dia: '23/03', inscritos: 55 },
  { dia: '24/03', inscritos: 58 },
  { dia: '25/03', inscritos: 60 },
  { dia: '26/03', inscritos: 62 },
  { dia: '27/03', inscritos: 65 },
  { dia: '28/03', inscritos: 68 },
  { dia: '29/03', inscritos: 70 },
  { dia: '30/03', inscritos: 75 },
];

// Dados de inscrições por área de interesse
const dadosPorArea = [
  { area: 'Desenvolvimento Web', inscritos: 250 },
  { area: 'Data Science', inscritos: 180 },
  { area: 'Mobile', inscritos: 120 },
  { area: 'DevOps', inscritos: 90 },
  { area: 'UX/UI', inscritos: 150 },
];

const resumoDados = {
  totalInscritos: 890,
  crescimentoMensal: '23%',
  conversaoEmpregos: '45%',
  vagasAtivas: 37
};

const AdminDashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 flex flex-col w-64 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
        {
          "-translate-x-full lg:translate-x-0 lg:w-20": collapsed,
          "translate-x-0": mobileOpen,
          "-translate-x-full lg:translate-x-0": !mobileOpen
        }
      )}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <div className={cn("flex items-center", {
            "justify-center w-full": collapsed
          })}>
            <Briefcase className="h-6 w-6 text-purple-700 flex-shrink-0" />
            {!collapsed && <span className="ml-2 text-lg font-semibold text-purple-700">CS Instituto</span>}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:flex hidden"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden flex"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Sidebar Navigation */}
        <nav className="h-60 py-4 px-2 flex flex-col space-y-2 overflow-y-auto">
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
            to="vagas" 
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
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <SidebarItem 
            icon={<LogOut />} 
            title="Sair" 
            collapsed={collapsed} 
            to="/login"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          />
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-5">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden mr-2"
              onClick={() => setMobileOpen(true)}
            >
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
            <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-white">
              A
            </div>
            <span className="text-sm font-medium">Admin</span>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {currentView === "dashboard" ? (
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total de Inscritos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{resumoDados.totalInscritos}</div>
                    <p className="text-xs text-muted-foreground">candidatos no banco de talentos</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Crescimento Mensal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{resumoDados.crescimentoMensal}</div>
                    <p className="text-xs text-muted-foreground">em relação ao mês anterior</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Conversão</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{resumoDados.conversaoEmpregos}</div>
                    <p className="text-xs text-muted-foreground">candidatos empregados</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Vagas Ativas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{resumoDados.vagasAtivas}</div>
                    <p className="text-xs text-muted-foreground">oportunidades disponíveis</p>
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
                      <CardTitle>Inscrições Diárias (Último Mês)</CardTitle>
                      <CardDescription>
                        Total de novos candidatos registrados por dia no último mês
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={dadosUltimoMes} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="areas">
                  <Card>
                    <CardHeader>
                      <CardTitle>Inscrições por Área de Interesse</CardTitle>
                      <CardDescription>
                        Distribuição dos candidatos por especialidade
                      </CardDescription>
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
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                            {String.fromCharCode(64 + i)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">Candidato {i}</p>
                            <p className="text-xs text-gray-500">Desenvolvedor Full Stack</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Vagas Populares</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="border-b pb-3 last:border-b-0 last:pb-0">
                          <p className="text-sm font-medium">Desenvolvedor {i}</p>
                          <div className="flex justify-between mt-1">
                            <p className="text-xs text-gray-500">30 candidatos</p>
                            <p className="text-xs text-purple-700">Empresa {i}</p>
                          </div>
                        </div>
                      ))}
                    </div>
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
                        { acao: "Perfil atualizado", tempo: "5 horas atrás" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
                          <p className="text-sm">{item.acao}</p>
                          <p className="text-xs text-gray-500">{item.tempo}</p>
                        </div>
                      ))}
                    </div>
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
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  active?: boolean;
  collapsed?: boolean;
  to?: string;
  className?: string;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, 
  title, 
  active = false,
  collapsed = false,
  to,
  className = "",
  onClick
}) => {
  const baseClasses = cn(
    "w-full p-2 rounded-md transition-colors flex",
    collapsed ? "justify-center" : "items-center",
    active ? "bg-purple-50 text-purple-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    className
  );

  const content = (
    <>
      <span className="flex-shrink-0">{icon}</span>
      {!collapsed && <span className="ml-3">{title}</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={baseClasses} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button className={baseClasses} onClick={onClick}>
      {content}
    </button>
  );
};

export default AdminDashboard;