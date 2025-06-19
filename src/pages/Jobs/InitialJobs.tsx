import React, { useState, useEffect } from 'react';
import axios, {AxiosError} from 'axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, Loader2, Search, RefreshCw, Clock, Calendar, Building } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { Link } from 'react-router-dom';
import BackgroundImage from '@/assets/fundo.jpg';

interface Vaga {
  id: number;
  title: string;
  description: string;
  salary: string;
  requirements: string;
  location: string;
  benefits: string;
  status: string;
  job_type: string;
  education: string;
  companies_id?: string; // Adicionando campo para companies_id empresas
  created_at?: string;
  updated_at?: string;
}

interface Company {
  id: number;
  name: string;
}

interface ApiResponse {
  data?: Vaga[];
  vagas?: Vaga[];
  [key: string]: any;
}

const InitialJobs: React.FC = () => {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [filteredVagas, setFilteredVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    fetchVagas();
  }, []);

  useEffect(() => {
    if (vagas.length > 0) {
      filterJobs(activeFilter, searchTerm);
    }
  }, [vagas, activeFilter, searchTerm]);

const fetchVagas = async () => {
    // 1. Simplifica para um único estado de loading e limpa erros anteriores
    setLoading(true); 
    setError(null);

    try {
        // 2. Executa as chamadas de API em paralelo para mais performance
        const [vagasRes, companiesRes] = await Promise.all([
            axios.get('http://127.0.0.1:8000/api/opportunities'),
            axios.get('http://127.0.0.1:8000/api/companies'),
        ]);

        // 3. Extrai os dados de forma consistente (assumindo axios)
        const companiesData = companiesRes.data?.data || [];
        setCompanies(companiesData);

        // 4. Trata as diferentes estruturas de resposta da API de vagas de forma concisa
        let vagasData: Vaga[] = [];
        const responseData = vagasRes.data;
        
        if (Array.isArray(responseData)) {
            vagasData = responseData;
        } else if (Array.isArray(responseData?.data)) {
            vagasData = responseData.data;
        } else if (Array.isArray(responseData?.vagas)) {
            vagasData = responseData.vagas;
        } else {
            // Se a estrutura for inesperada, lança um erro para o bloco catch
            console.error('Estrutura de resposta da API de vagas inesperada:', responseData);
            throw new Error('Não foi possível processar os dados recebidos.');
        }
        
        // A lógica de fallback
        const vagasComIdTratado = vagasData.map(vaga => ({
            ...vaga,
            companies_id: vaga.companies_id || "Mersan",
        }));

        setVagas(vagasComIdTratado);
        // A atualização de `filteredVagas` deve ocorrer em um `useEffect` que observa a mudança em `vagas`

    } catch (err) {
        console.error('Falha ao buscar dados:', err);

        // 5. Define uma mensagem de erro amigável e útil para o usuário
        if (err instanceof AxiosError && !err.response) {
            // Erro de rede (servidor offline, CORS, sem conexão)
            setError('Oops! Parece que estamos com dificuldades para nos conectar ao servidor. Por favor, verifique sua conexão com a internet e tente novamente.');
        } else {
            // Outros erros (ex: erro de servidor 500, vaga não encontrada 404)
            setError('Houve um imprevisto ao carregar as vagas. Nossa equipe já foi notificada. Por favor, tente novamente mais tarde.');
        }
    } finally {
        // 6. Garante que o loading seja desativado, independentemente de sucesso ou falha
        setLoading(false);
        // Removido setIsLoading(false) para usar um único estado de loading
    }
};

  const filterJobs = (filter: string, term: string = searchTerm) => {
    let result = [...vagas];

    // Apply text search if provided
    if (term.trim()) {
      result = result.filter(vaga =>
        vaga.title.toLowerCase().includes(term.toLowerCase()) ||
        vaga.description.toLowerCase().includes(term.toLowerCase()) ||
        vaga.location.toLowerCase().includes(term.toLowerCase()) ||
        (vaga.companies_id && vaga.companies_id.toLowerCase().includes(term.toLowerCase()))
      );
    }

    // Apply category filter
    if (filter !== 'all') {
      result = result.filter(vaga => vaga.job_type.toLowerCase() === filter.toLowerCase());
    }

    setFilteredVagas(result);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  const getWorkTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'remoto':
        return 'bg-emerald-100 text-emerald-800';
      case 'presencial':
        return 'bg-blue-100 text-blue-800';
      case 'híbrido':
      case 'hibrido':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getJobStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'urgente':
        return 'bg-red-100 text-red-800';
      case 'novo':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Hero Section with Background Image */}
      <div
        className="text-white py-16 relative"
        style={{
          backgroundImage: `url(${BackgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Encontre a Carreira Ideal para Você</h1>
            <p className="text-xl mb-8">Conectando profissionais talentosos com as melhores oportunidades do mercado</p>

            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Busque por cargo, companies_id ou localização..."
                className="pl-10 pr-4 py-6 rounded-full bg-white text-gray-800 w-full focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12">
        {/* Filters and Tabs */}
        <div className="mb-8">
          <Tabs defaultValue="all" onValueChange={setActiveFilter}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Oportunidades Disponíveis</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => fetchVagas()}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                  Atualizar
                </Button>
              </div>
            </div>

            <div className="bg-white p-2 rounded-lg shadow-sm mb-6">
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="all" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">
                  Todas
                </TabsTrigger>
                <TabsTrigger value="remoto" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800">
                  Remoto
                </TabsTrigger>
                <TabsTrigger value="presencial" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">
                  Presencial
                </TabsTrigger>
                <TabsTrigger value="hibrido" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-800">
                  Híbrido
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </div>

        {/* Loading State */}
        {loading && !isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden border-0 shadow-md bg-white">
                <CardHeader className="pb-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <div className="flex gap-2 mt-4">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full rounded-lg" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="text-red-500 mb-4 text-lg">Erro: {error}</div>
            <Button
              onClick={fetchVagas}
              disabled={isLoading}
              className="bg-purple-700 hover:bg-purple-800 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Carregando...
                </>
              ) : (
                'Tentar Novamente'
              )}
            </Button>
          </div>
        ) : filteredVagas.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="max-w-md mx-auto">
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhuma vaga encontrada</h3>
              <p className="mt-2 text-gray-500">Não encontramos vagas com os filtros selecionados.</p>
              <div className="mt-6">
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveFilter('all');
                  }}
                  className="bg-purple-700 hover:bg-purple-800 text-white"
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">{filteredVagas.length} vagas encontradas</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVagas.map((vaga) => {
                const company = companies.find((c) => c.id === Number(vaga.companies_id));

                return (
                  <Card key={vaga.id} className="overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-xl bg-white hover:translate-y-[-5px]">
                    <CardHeader className="pb-4 border-b">
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-xl font-bold">{vaga.title}</CardTitle>
                        <Badge className={getJobStatusColor(vaga.status)}>
                          {vaga.status}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        <Building size={14} />
                        <span>{company ? company.name : "Empresa não informada"}</span>
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-4">
                      <p className="text-gray-600 mb-4 line-clamp-3 h-[4.5rem]">{vaga.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <MapPin size={14} />
                          {vaga.location || 'Remoto'}
                        </Badge>

                        <Badge variant="outline" className={`flex items-center gap-1 ${getWorkTypeColor(vaga.job_type)}`}>
                          <Briefcase size={14} />
                          {vaga.job_type || 'Integral'}
                        </Badge>

                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock size={14} />
                          Integral
                        </Badge>
                      </div>

                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Calendar size={14} className="mr-1" />
                        <span>Publicada há 2 dias</span>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-4 border-t">
                      <Button
                        className="w-full bg-purple-700 hover:bg-purple-800 text-white transition-all duration-300 rounded-lg flex items-center justify-center gap-2"
                      >
                        <Link to={`/opportunities/${vaga.id}`} className="w-full h-full flex items-center justify-center">
                          Ver Detalhes e Candidatar-se
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}

            </div>
          </>
        )}
      </main>

      {/* Newsletter Section */}
      <section className="bg-indigo-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Receba Novas Oportunidades</h2>
            <p className="text-gray-600 mb-6">Cadastre-se para receber as melhores vagas da sua área diretamente no seu email.</p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Seu melhor email"
                className="flex-grow py-6 rounded-lg"
              />
              <Button className="bg-purple-700 hover:bg-purple-800 text-white py-6 rounded-lg">
                Inscrever-se
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default InitialJobs;