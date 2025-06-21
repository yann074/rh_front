import React, { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { Bar, BarChart, CartesianGrid, PolarGrid, RadialBar, RadialBarChart, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Award, BarChart4, BrainCircuit, Briefcase, Flag, Lightbulb, Puzzle, Scale, ShieldCheck, Target, Terminal, ThumbsUp, TrendingUp, UserCheck, Users, Activity } from "lucide-react"
import Header from "@/components/layouts/Header"
import Footer from "@/components/layouts/Footer"


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
  comparison: { [key: string]: ComparisonItem };
}

// --- Chart Configurations ---
const mainChartConfig = {
  user: { label: "Sua Pontuação", color: "hsl(262 83% 58%)" },
  average: { label: "Média Geral", color: "hsl(220 13% 69%)" },
} satisfies ChartConfig

const balanceChartConfig = {
  score: { label: "Score" },
  value: { label: "Equilíbrio", color: "hsl(262 83% 58%)" }
} satisfies ChartConfig

// Cores personalizadas para diferentes perfis
const profileColors = {
  Executor: "hsl(0 84% 60%)",
  Planejador: "hsl(217 91% 60%)",
  Analista: "hsl(142 76% 36%)",
  Comunicador: "hsl(48 96% 53%)"
}

// --- Helper Components & Data ---
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

const ResultBehaviorProfile = () => {
  const [profileData, setProfileData] = useState<FullProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfileResult = async () => {
      setLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("Usuário não autenticado.")

        const response = await axios.get<FullProfileData>(
          "http://127.0.0.1:8000/api/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        )
        
        if (!response.data || !response.data.analysis) {
          throw new Error("A resposta da API está incompleta ou em formato inválido.");
        }
        setProfileData(response.data)
      } catch (err: any) {
        console.error("Erro ao buscar resultados do perfil:", err)
        setError(err.response?.data?.message || err.message || "Ocorreu um erro ao buscar sua análise.")
      } finally {
        setLoading(false)
      }
    }
    fetchProfileResult()
  }, [])
  
  // Dados transformados para os gráficos
  const comparisonChartData = useMemo(() => {
    if (!profileData?.comparison) return []
    
    return Object.entries(profileData.comparison).map(([name, values]) => ({
      name,
      user: Math.round(values.user_percentage),
      average: Math.round(values.general_average),
      difference: Math.round(values.user_percentage - values.general_average),
    }))
  }, [profileData])

  const profilePercentages = useMemo(() => {
    if (!profileData?.analysis?.percentages) return []
    
    return Object.entries(profileData.analysis.percentages)
      .map(([name, percentage]) => ({
        name,
        value: Math.round(percentage),
        color: profileColors[name as keyof typeof profileColors] || "hsl(220 13% 69%)"
      }))
      .sort((a, b) => b.value - a.value)
  }, [profileData])

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error || !profileData) {
    return <ErrorState error={error || "Não foi possível carregar os dados do perfil."} />
  }
  
  const { analysis, recommendations } = profileData

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50/30">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="text-center space-y-4 py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white mb-4">
              <Award className="h-10 w-10" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Sua Análise de Perfil
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubra seus pontos fortes, características únicas e oportunidades de crescimento
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* Left Column - Profile Summary */}
            <div className="xl:col-span-4 space-y-6">
              <ProfileSummaryCard analysis={analysis} />
              <ProfileDistributionCard data={profilePercentages} />
            </div>

            {/* Center Column - Balance Score */}
            <div className="xl:col-span-4 space-y-6">
              <BalanceScoreCard analysis={analysis} />
              <ProfileStatsCard data={profilePercentages} />
            </div>

            {/* Right Column - Comparison Chart */}
            <div className="xl:col-span-4">
              <ComparisonChartCard data={comparisonChartData} />
            </div>
          </div>
          
          {/* Recommendations Section */}
          <RecommendationsCard recommendations={recommendations} />

        </div>
      </main>
      <Footer />
    </div>
  )
}

const ProfileSummaryCard: React.FC<{ analysis: DetailedAnalysis }> = ({ analysis }) => {
  const classification = analysis?.profile_classification
  const profile_description = analysis?.profile_description

  if (!classification) return null;

  const PrimaryIcon = profileIcons[classification.primary] || UserCheck;
  const SecondaryIcon = classification.secondary ? profileIcons[classification.secondary] : null;
  const primaryColor = profileColors[classification.primary as keyof typeof profileColors] || "hsl(262 83% 58%)";

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${primaryColor}20` }}>
            <Flag className="h-6 w-6" style={{ color: primaryColor }} />
          </div>
          <div>
            <div className="text-lg font-semibold text-muted-foreground">Seu Perfil</div>
            <div className="text-2xl font-bold" style={{ color: primaryColor }}>
              {classification.type}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">{profile_description}</p>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed" 
               style={{ borderColor: `${primaryColor}40`, backgroundColor: `${primaryColor}08` }}>
            <div className="p-3 rounded-full" style={{ backgroundColor: `${primaryColor}20` }}>
              <PrimaryIcon className="h-8 w-8" style={{ color: primaryColor }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Perfil Principal</p>
              <p className="text-xl font-bold">{classification.primary}</p>
            </div>
          </div>
          
          {classification.secondary && SecondaryIcon && (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
              <div className="p-2 rounded-full bg-muted">
                <SecondaryIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Perfil Secundário</p>
                <p className="text-lg font-semibold">{classification.secondary}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ProfileDistributionCard: React.FC<{ data: any[] }> = ({ data }) => {
  if (!data.length) return null;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Distribuição dos Perfis
        </CardTitle>
        <CardDescription>
          Como seus perfis se distribuem percentualmente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item, index) => (
          <div key={item.name} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{item.name}</span>
              <span className="text-sm font-bold">{item.value}%</span>
            </div>
            <Progress 
              value={item.value} 
              className="h-3"
              style={{ 
                background: `${item.color}20`,
              }}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const ProfileStatsCard: React.FC<{ data: any[] }> = ({ data }) => {
  if (!data.length) return null;

  const topProfile = data[0];
  const totalProfiles = data.length;
  const averageScore = Math.round(data.reduce((sum, item) => sum + item.value, 0) / totalProfiles);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart4 className="h-5 w-5" />
          Estatísticas Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50">
            <div className="text-2xl font-bold text-purple-600">{topProfile.value}%</div>
            <div className="text-sm text-muted-foreground">Perfil Dominante</div>
            <div className="text-xs font-medium">{topProfile.name}</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50">
            <div className="text-2xl font-bold text-emerald-600">{averageScore}%</div>
            <div className="text-sm text-muted-foreground">Média Geral</div>
            <div className="text-xs font-medium">Seus Perfis</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const BalanceScoreCard: React.FC<{ analysis: DetailedAnalysis }> = ({ analysis }) => {
  const balance_score = analysis?.balance_score ?? 0;
  const scoreColor = balance_score > 75 ? "hsl(142 76% 36%)" : 
                    balance_score > 50 ? "hsl(48 96% 53%)" : 
                    "hsl(0 84% 60%)";

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl">
          <Scale className="h-6 w-6" />
          Índice de Equilíbrio
        </CardTitle>
        <CardDescription>
          Mede a versatilidade e distribuição equilibrada entre seus perfis
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <div className="relative">
          <ChartContainer config={balanceChartConfig} className="h-48 w-48">
            <RadialBarChart
              data={[{ 
                name: "balance", 
                value: balance_score, 
                fill: scoreColor 
              }]}
              startAngle={-90}
              endAngle={270}
              innerRadius="60%"
              outerRadius="90%"
            >
              <PolarGrid gridType="circle" radialLines={false} stroke="none" />
              <RadialBar 
                dataKey="value" 
                background={{ fill: "hsl(220 13% 91%)" }}
                cornerRadius={8}
                fill={scoreColor}
              />
            </RadialBarChart>
          </ChartContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold" style={{ color: scoreColor }}>
              {balance_score.toFixed(0)}
            </span>
            <span className="text-sm text-muted-foreground font-medium">de 100</span>
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: scoreColor }}></div>
            <span className="text-sm font-medium">
              {balance_score > 75 ? "Altamente Equilibrado" : 
               balance_score > 50 ? "Moderadamente Equilibrado" : 
               "Perfil Especializado"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground max-w-xs">
            {balance_score > 75 ? "Você demonstra grande versatilidade entre os perfis" : 
             balance_score > 50 ? "Você tem características equilibradas com algumas especializações" : 
             "Você tem um perfil bem definido e especializado"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const ComparisonChartCard: React.FC<{ data: any[] }> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="h-full flex items-center justify-center border-0 shadow-lg">
        <CardContent className="text-center">
          <div className="p-8 rounded-full bg-muted/20 w-fit mx-auto mb-4">
            <BarChart4 className="h-12 w-12 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Dados de comparação indisponíveis.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart4 className="h-6 w-6" />
          Análise Comparativa
        </CardTitle>
        <CardDescription>
          Como você se compara com outros usuários
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ChartContainer config={mainChartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: "hsl(220 9% 46%)" }}
                tickLine={false} 
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 12, fill: "hsl(220 9% 46%)" }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-4 rounded-lg shadow-lg border">
                        <p className="font-semibold mb-2">{label}</p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-purple-500"></div>
                            <span className="text-sm">Você: {data.user}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-gray-400"></div>
                            <span className="text-sm">Média: {data.average}%</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            Diferença: {data.difference > 0 ? '+' : ''}{data.difference}%
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="user" 
                fill="hsl(262 83% 58%)" 
                radius={[4, 4, 0, 0]}
                name="Sua Pontuação"
              />
              <Bar 
                dataKey="average" 
                fill="hsl(220 13% 69%)" 
                radius={[4, 4, 0, 0]}
                name="Média Geral"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const RecommendationsCard: React.FC<{ recommendations: Recommendations }> = ({ recommendations }) => {
  const recommendationEntries = recommendations ? Object.entries(recommendations) as [keyof Recommendations, string[]][] : [];

  if (recommendationEntries.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <ThumbsUp className="h-7 w-7" />
          Recomendações Personalizadas
        </CardTitle>
        <CardDescription className="text-base">
          Insights específicos para potencializar seu desenvolvimento pessoal e profissional
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="strengths" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1">
            {recommendationEntries.map(([key, _]) => {
              const Icon = recommendationIcons[key];
              const label = recommendationLabels[key];
              return (
                <TabsTrigger 
                  key={key} 
                  value={key} 
                  className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  {Icon && <Icon className="h-5 w-5" />}
                  <span className="text-xs font-medium text-center leading-tight">{label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
          
          {recommendationEntries.map(([key, items]) => (
            <TabsContent key={key} value={key} className="mt-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  {recommendationIcons[key] && (
                    <div className="p-3 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100">
                      {React.createElement(recommendationIcons[key], { 
                        className: "h-6 w-6 text-purple-600" 
                      })}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold">{recommendationLabels[key]}</h3>
                    <p className="text-sm text-muted-foreground">
                      {items.length} {items.length === 1 ? 'recomendação' : 'recomendações'} para você
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map((item, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="p-4 text-sm font-medium bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 border-slate-200 text-slate-700 justify-start h-auto whitespace-normal transition-all duration-200"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
};

const LoadingSkeleton = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50/30">
    <Header />
    <main className="flex-1 container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4 py-8">
          <Skeleton className="h-20 w-20 mx-auto rounded-full" />
          <Skeleton className="h-12 w-96 mx-auto" />
          <Skeleton className="h-6 w-64 mx-auto" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-4 space-y-6">
            <Skeleton className="h-80 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
          <div className="xl:col-span-4 space-y-6">
            <Skeleton className="h-80 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
          <div className="xl:col-span-4">
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        </div>
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    </main>
    <Footer />
  </div>
);

const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50/30">
    <Header />
    <main className="flex-1 container mx-auto flex items-center justify-center p-4">
      <Alert variant="destructive" className="max-w-lg shadow-lg">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Erro ao Carregar Análise</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    </main>
    <Footer />
  </div>
);

export default ResultBehaviorProfile;