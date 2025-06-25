import React, { useState, useEffect, useMemo, useRef } from "react" 
import api from "@/service/Api"
import jsPDF from "jspdf" 
import html2canvas from "html2canvas" 

import {
  Award, User, Search, Filter, CheckCircle, Clock, XCircle, Mail,
  Download, Camera, Phone, Calendar, MapPin, Loader2, ThumbsUp, ThumbsDown,
  BarChart4, BrainCircuit, Briefcase, Flag, Lightbulb, Puzzle, Scale, ShieldCheck, Target, TrendingUp, Users, Activity, Info,
  UserCheck
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogClose,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Bar, BarChart, CartesianGrid, PolarGrid, RadialBar, RadialBarChart, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart"

// 1. TIPOS E INTERFACES (INCLUINDO AS DO PERFIL COMPORTAMENTAL)

interface Application {
  id: number;
  name: string;
  email: string;
  vacancy: string;
  applicationDate: string;
  status: string;
  userId: number;
}

interface CandidateProfile {
  name: string;
  email: string;
  photo_url?: string;
  resume_url?: string;
  phone?: string;
  birth_date?: string;
  linkedin?: string;
  sex?: string;
  race?: string;
  location?: string;
}

// Interfaces da Análise de Perfil (trazidas do ResultProfile)
interface ProfileClassification {
  type: 'Dominante' | 'Híbrido' | 'Equilibrado' | 'Indefinido';
  primary: string;
  secondary?: string;
  tertiary?: string;
}

interface RankingItem {
  profile: string;
  percentage: number;
  count: number;
}

interface DetailedAnalysis {
  percentages: { [key: string]: number };
  ranking: RankingItem[];
  profile_classification: ProfileClassification;
  profile_description: string;
  balance_score: number;
}

interface Recommendations {
  strengths: string[];
  development_areas: string[];
  career_suggestions: string[];
  improvement_tips: string[];
}

interface ComparisonItem {
  user_percentage: number;
  general_average: number;
}

interface FullProfileData {
  analysis: DetailedAnalysis;
  recommendations: Recommendations;
  comparison: { [key:string]: ComparisonItem };
}

// 2. CONFIGURAÇÕES DE GRÁFICOS E ÍCONES (Trazidos do ResultProfile)

const balanceChartConfig = {
  score: { label: "Score" },
  value: { label: "Equilíbrio", color: "hsl(262 83% 58%)" }
} satisfies ChartConfig

const profileColors: { [key: string]: string } = {
  Executor: "hsl(0 84% 60%)",
  Planejador: "hsl(217 91% 60%)",
  Analista: "hsl(142 76% 36%)",
  Comunicador: "hsl(48 96% 53%)"
}

const profileIcons: { [key: string]: React.FC<any> } = {
  Executor: Target,
  Planejador: Puzzle,
  Analista: BrainCircuit,
  Comunicador: Users
};

const recommendationIcons: { [key: string]: React.FC<any> } = {
  strengths: ShieldCheck,
  development_areas: TrendingUp,
  career_suggestions: Briefcase,
  improvement_tips: Lightbulb
};

const recommendationLabels: { [key: string]: string } = {
  strengths: "Pontos Fortes",
  development_areas: "Áreas de Desenvolvimento",
  career_suggestions: "Sugestões de Carreira",
  improvement_tips: "Dicas de Melhoria"
};


export default function Applications() {
  // --- Estados do Componente ---
  const [applications, setApplications] = useState<Application[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<Application | null>(null)
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null)
  const [behavioralProfile, setBehavioralProfile] = useState<FullProfileData | null>(null)
  
  const [loading, setLoading] = useState(true)
  const [modalLoading, setModalLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPosition, setFilterPosition] = useState<string>("all")

  // NOVO: Estado para controlar o carregamento da exportação do PDF
  const [isExporting, setIsExporting] = useState(false);
  
  // NOVO: Ref para o container do perfil que será exportado
  const behavioralProfileRef = useRef<HTMLDivElement>(null);

  // --- Busca de Dados ---
  useEffect(() => {
    fetchApplications();
  }, [])

  const fetchApplications = () => {
    setLoading(true)
    api.get('/apply_opportunities')
      .then((response) => {
        const transformedData = response.data.data.map((app: any) => ({
          id: app.id, name: app.candidato, email: app.email, vacancy: app.vaga,
          applicationDate: app.data_aplicacao, status: app.status, userId: app.user_id,
        }))
        setApplications(transformedData)
      })
      .catch((error) => console.error("Erro ao buscar candidaturas:", error))
      .finally(() => setLoading(false))
  }

  const handleViewProfile = (candidate: Application) => {
    setSelectedCandidate(candidate);
    setModalLoading(true);
    setCandidateProfile(null);
    setBehavioralProfile(null);

    Promise.allSettled([
      api.get(`/candidate-profile/${candidate.userId}`),
      api.get(`/profiles/${candidate.userId}`)
    ])
    .then(([profileResult, behavioralResult]) => {
      if (profileResult.status === 'fulfilled') {
        setCandidateProfile(profileResult.value.data.data);
      } else {
        console.error("Erro ao buscar o perfil do candidato:", profileResult.reason);
      }

      if (behavioralResult.status === 'fulfilled') {
        setBehavioralProfile(behavioralResult.value.data);
      } else {
        console.error("Erro ao buscar o perfil comportamental (pode ser normal, ex: não preenchido):", behavioralResult.reason);
      }
    })
    .catch(error => {
      console.error("Erro inesperado ao processar os perfis:", error);
    })
    .finally(() => {
      setModalLoading(false);
    });
  };
  

  // NOVO: Função para exportar o perfil comportamental para PDF
  const handleExportPDF = async () => {
    if (!behavioralProfileRef.current || !selectedCandidate) return;

    setIsExporting(true);

    try {
        const canvas = await html2canvas(behavioralProfileRef.current, {
            scale: 2, // Aumenta a resolução para melhor qualidade
            useCORS: true, // Permite carregar imagens de outras origens
            logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;

        // Calcula a largura e altura da imagem no PDF para manter a proporção
        const imgWidth = pdfWidth - 20; // com margem de 10mm de cada lado
        const imgHeight = imgWidth / ratio;

        // Adiciona um título ao PDF
        pdf.setFontSize(16);
        pdf.text(`Perfil Comportamental - ${selectedCandidate.name}`, 10, 15);

        // Adiciona a imagem do componente
        pdf.addImage(imgData, 'PNG', 10, 25, imgWidth, imgHeight);

        pdf.save(`perfil-comportamental-${selectedCandidate.name.replace(/ /g, '_')}.pdf`);

    } catch (error) {
        console.error("Erro ao gerar o PDF:", error);
        // Opcional: Adicionar um alerta para o usuário
        alert("Ocorreu um erro ao gerar o PDF. Tente novamente.");
    } finally {
        setIsExporting(false);
    }
  };


  const handleApplicationAction = (applicationId: number, action: 'approve' | 'reject') => {
    setActionLoading(true);
    const newStatus = action === 'approve' ? 'Aprovado' : 'Rejeitado';

    api.post(`/applications/${applicationId}/${action}`)
      .then(() => {
        setApplications(currentApplications =>
          currentApplications.map(app =>
            app.id === applicationId ? { ...app, status: newStatus } : app
          )
        );

        if (selectedCandidate && selectedCandidate.id === applicationId) {
          setSelectedCandidate(prev => prev ? { ...prev, status: newStatus } : null);
        }
      })
      .catch(error => console.error(`Erro ao ${action} a candidatura:`, error))
      .finally(() => setActionLoading(false));
  };
  
  const handleCloseModal = () => {
    setSelectedCandidate(null)
    setCandidateProfile(null)
    setBehavioralProfile(null)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Não informado"
    const date = new Date(dateString)
    date.setDate(date.getDate() + 1)
    return date.toLocaleDateString("pt-BR")
  }
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "aprovado": return "bg-green-100 text-green-800"
      case "em análise": return "bg-blue-100 text-blue-800"
      case "rejeitado": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "aprovado": return <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
      case "em análise": return <Clock className="h-4 w-4 text-blue-600 mr-1" />
      case "rejeitado": return <XCircle className="h-4 w-4 text-red-600 mr-1" />
      default: return null
    }
  }
  
  const getInitials = (name: string) => name ? name.split(" ").map((part) => part[0]).join("").toUpperCase().substring(0, 2) : ""

  const filteredApplications = applications.filter(app => 
    (app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     app.vacancy.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterPosition === "all" || app.vacancy === filterPosition)
  );
  
  // --- Hooks de Otimização para os Gráficos ---
  const profilePercentages = useMemo(() => {
    if (!behavioralProfile?.analysis?.percentages) return []
    return Object.entries(behavioralProfile.analysis.percentages)
      .map(([name, percentage]) => ({
        name,
        value: Math.round(percentage),
        color: profileColors[name as keyof typeof profileColors] || "hsl(220 13% 69%)"
      }))
      .sort((a, b) => b.value - a.value)
  }, [behavioralProfile])


  // --- Renderização do Componente ---
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Candidaturas Recebidas</CardTitle>
          <CardDescription>Gerencie todas as candidaturas às vagas disponíveis.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou vaga..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterPosition} onValueChange={setFilterPosition}>
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="Filtrar por vaga" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as vagas</SelectItem>
                {Array.from(new Set(applications.map((app) => app.vacancy))).map((vacancy) => (
                  <SelectItem key={vacancy} value={vacancy}>
                    {vacancy}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Candidato</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Vaga</TableHead>
                  <TableHead>Data de Aplicação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-10">Carregando candidaturas...</TableCell></TableRow>
                ) : filteredApplications.length > 0 ? (
                  filteredApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-purple-100 text-purple-800">{getInitials(app.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{app.name}</p>
                            <p className="text-xs text-muted-foreground">{app.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                       <Badge variant="outline" className={getStatusColor(app.status)}>
                         <div className="flex items-center">{getStatusIcon(app.status)}{app.status}</div>
                       </Badge>
                      </TableCell>
                      <TableCell>{app.vacancy}</TableCell>
                      <TableCell>{formatDate(app.applicationDate)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleViewProfile(app)}>
                          Ver Perfil
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={5} className="text-center py-10">Nenhuma candidatura encontrada.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 4. DIALOG  COM ABAS PARA OS DOIS TIPOS DE PERFIL */}
      <Dialog open={!!selectedCandidate} onOpenChange={(isOpen) => !isOpen && handleCloseModal()}>
        <DialogContent className="sm:max-w-4xl bg-white max-h-[90vh] flex flex-col">
          {selectedCandidate && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedCandidate.name}</DialogTitle>
                <DialogDescription>
                  Perfil do candidato para a vaga de <span className="font-semibold text-purple-700">{selectedCandidate.vacancy}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto pr-2">
                {modalLoading ? (
                  <div className="flex items-center justify-center h-96">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                    <p className="ml-4">Carregando perfil completo...</p>
                  </div>
                ) : (
                  <Tabs defaultValue="behavioral">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="behavioral"><BrainCircuit className="w-4 h-4 mr-2"/>Análise Comportamental</TabsTrigger>
                        <TabsTrigger value="contact"><Info className="w-4 h-4 mr-2"/>Informações Gerais</TabsTrigger>
                    </TabsList>
                    
                    {/* ABA DA ANÁLISE COMPORTAMENTAL */}
                    <TabsContent value="behavioral" className="mt-4">
                      {behavioralProfile ? (
                        // ALTERADO: Adicionado ref ao container principal e botão de download
                        <div ref={behavioralProfileRef} className="space-y-6 bg-white p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Relatório Comportamental</h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleExportPDF}
                                    disabled={isExporting}
                                >
                                    {isExporting ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Download className="mr-2 h-4 w-4" />
                                    )}
                                    Exportar PDF
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <ProfileSummaryCard analysis={behavioralProfile.analysis} />
                                <BalanceScoreCard analysis={behavioralProfile.analysis} />
                            </div>
                            <ProfileDistributionCard data={profilePercentages} />
                            <RecommendationsCard recommendations={behavioralProfile.recommendations} />
                        </div>
                      ) : (
                        <div className="text-center h-60 flex items-center justify-center text-muted-foreground">
                            <p>Análise comportamental indisponível para este candidato.</p>
                        </div>
                      )}
                    </TabsContent>

                    {/* ABA DE INFORMAÇÕES GERAIS */}
                      <TabsContent value="contact" className="mt-4">
                       {candidateProfile ? (
                         <div className="grid gap-4 py-4">
                           <div className="flex items-center gap-4">
                             <Avatar className="h-20 w-20">
                               <AvatarImage src={candidateProfile.photo_url} />
                               <AvatarFallback className="bg-purple-100 text-purple-800 text-3xl">{getInitials(candidateProfile.name)}</AvatarFallback>
                             </Avatar>
                             <div className="space-x-2">
                               {candidateProfile.resume_url && <a href={candidateProfile.resume_url} download target="_blank" rel="noreferrer"><Button variant="outline"><Download className="mr-2 h-4 w-4"/> Currículo</Button></a>}
                               {candidateProfile.photo_url && <a href={candidateProfile.photo_url} target="_blank" rel="noreferrer"><Button variant="outline"><Camera className="mr-2 h-4 w-4"/> Foto</Button></a>}
                             </div>
                           </div>
                           <Card>
                             <CardContent className="pt-6 text-sm">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <p className="flex items-center"><Mail className="w-4 h-4 mr-2 text-muted-foreground" /> {candidateProfile.email}</p>
                                 <p className="flex items-center"><Phone className="w-4 h-4 mr-2 text-muted-foreground" /> {candidateProfile.phone || "Não informado"}</p>
                                 <p className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-muted-foreground" /> {formatDate(candidateProfile.birth_date)}</p>
                                 <p className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-muted-foreground" /> {candidateProfile.location || "Não informado"}</p>
                                 <p className="flex items-center"><User className="w-4 h-4 mr-2 text-muted-foreground" /> {candidateProfile.sex || "Não informado"}</p>
                                 {candidateProfile.linkedin && <a href={candidateProfile.linkedin} target="_blank" rel="noreferrer" className="flex items-center text-blue-600 hover:underline col-span-full"><Award className="w-4 h-4 mr-2 text-muted-foreground" /> {candidateProfile.linkedin}</a>}
                               </div>
                             </CardContent>
                           </Card>
                         </div>
                       ) : (
                         <div className="text-center h-60 flex items-center justify-center text-muted-foreground">
                           <p>Não foi possível carregar os detalhes de contato do perfil.</p>
                         </div>
                       )}
                      </TabsContent>
                  </Tabs>
                )}
              </div>
              
              <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between sm:items-center pt-4 border-t">
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">Status:</span>
                  <Badge variant="outline" className={getStatusColor(selectedCandidate.status)}>
                    <div className="flex items-center">
                        {getStatusIcon(selectedCandidate.status)}
                        {selectedCandidate.status}
                    </div>
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => handleApplicationAction(selectedCandidate.id, 'reject')}
                      disabled={actionLoading || modalLoading}
                    >
                      {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ThumbsDown className="mr-2 h-4 w-4" />}
                      Rejeitar
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApplicationAction(selectedCandidate.id, 'approve')}
                      disabled={actionLoading || modalLoading}
                    >
                        {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ThumbsUp className="mr-2 h-4 w-4" />}
                      Aprovar
                    </Button>
                    <DialogClose asChild>
                      <Button variant="outline" onClick={handleCloseModal}>Fechar</Button>
                    </DialogClose>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// 5. SUBCOMPONENTES DE VISUALIZAÇÃO

const ProfileSummaryCard: React.FC<{ analysis: DetailedAnalysis }> = ({ analysis }) => {
  const classification = analysis?.profile_classification
  const profile_description = analysis?.profile_description
  if (!classification) return null;

  const PrimaryIcon = profileIcons[classification.primary] || UserCheck;
  const primaryColor = profileColors[classification.primary as keyof typeof profileColors] || "hsl(262 83% 58%)";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${primaryColor}20` }}>
            <Flag className="h-6 w-6" style={{ color: primaryColor }} />
          </div>
          <div>
            <div className="text-md font-semibold text-muted-foreground">Perfil Classificado</div>
            <div className="text-xl font-bold" style={{ color: primaryColor }}>{classification.type}</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{profile_description}</p>
        <div className="flex items-center gap-4 p-3 rounded-xl border-2 border-dashed" 
             style={{ borderColor: `${primaryColor}40`, backgroundColor: `${primaryColor}08` }}>
          <PrimaryIcon className="h-7 w-7" style={{ color: primaryColor }} />
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground">Principal</p>
            <p className="text-lg font-bold">{classification.primary}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProfileDistributionCard: React.FC<{ data: any[] }> = ({ data }) => {
    if (!data.length) return null;
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl"><Activity className="h-5 w-5" /> Distribuição dos Perfis</CardTitle>
          <CardDescription>Distribuição percentual dos perfis identificados.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.map(item => (
            <div key={item.name} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">{item.name}</span>
                <span className="text-sm font-bold">{item.value}%</span>
              </div>
              <div 
                className="h-3 w-full overflow-hidden rounded-full bg-slate-200" 
                style={{ backgroundColor: `${item.color}20` }}
              >
                <div 
                  className="h-full rounded-full transition-all duration-300"
                  style={{ 
                    width: `${item.value}%`, 
                    backgroundColor: item.color 
                  }} 
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
};

const BalanceScoreCard: React.FC<{ analysis: DetailedAnalysis }> = ({ analysis }) => {
  const balance_score = analysis?.balance_score ?? 0;
  const scoreColor = balance_score > 75 ? "hsl(142 76% 36%)" : balance_score > 50 ? "hsl(48 96% 53%)" : "hsl(0 84% 60%)";

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="text-center pb-2">
        <CardTitle className="flex items-center justify-center gap-2 text-xl"><Scale className="h-5 w-5" /> Índice de Equilíbrio</CardTitle>
        <CardDescription>Mede a versatilidade entre os perfis.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center justify-center">
        <div className="relative h-40 w-40">
          <ChartContainer config={balanceChartConfig} className="h-full w-full">
            <RadialBarChart 
              data={[{ name: "balance", value: balance_score, fill: scoreColor }]} 
              startAngle={-90} 
              endAngle={270} 
              innerRadius="70%" 
              outerRadius="90%">
              <PolarGrid gridType="circle" radialLines={false} stroke="none" />
              <RadialBar dataKey="value" background={{ fill: "hsl(220 13% 91%)" }} cornerRadius={8} />
            </RadialBarChart>
          </ChartContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold" style={{ color: scoreColor }}>{balance_score.toFixed(0)}</span>
            <span className="text-xs text-muted-foreground font-medium">de 100</span>
          </div>
        </div>
        <div className="mt-2 text-center">
            <p className="font-semibold text-sm" style={{ color: scoreColor }}>
                {balance_score > 75 ? "Altamente Equilibrado" : balance_score > 50 ? "Moderado" : "Especializado"}
            </p>
        </div>
      </CardContent>
    </Card>
  );
};

const RecommendationsCard: React.FC<{ recommendations: Recommendations }> = ({ recommendations }) => {
    const recommendationEntries = recommendations ? Object.entries(recommendations) as [keyof Recommendations, string[]][] : [];
    if (recommendationEntries.length === 0) return null;
  
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl"><ThumbsUp className="h-5 w-5" /> Recomendações</CardTitle>
          <CardDescription>Insights para desenvolvimento baseados no perfil do candidato.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="strengths" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
              {recommendationEntries.map(([key]) => (
                <TabsTrigger key={key} value={key} className="flex flex-col sm:flex-row items-center gap-2 py-2 text-xs sm:text-sm">
                   {React.createElement(recommendationIcons[key], { className: "h-4 w-4" })}
                   <span>{recommendationLabels[key]}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            {recommendationEntries.map(([key, items]) => (
              <TabsContent key={key} value={key} className="mt-4">
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <Badge key={index} variant="secondary" className="p-2 text-sm font-normal whitespace-normal mr-2 mb-2 bg-slate-100 text-slate-800">
                      {item}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    );
};