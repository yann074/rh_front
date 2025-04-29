import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Calendar, Loader2, Search, RefreshCw, Award, User, School } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { Link } from 'react-router-dom';
import BackgroundImage from '@/assets/fundo.jpg';

interface Training {
  id: number;
  name: string;
  type: string;
  workload_hours?: number;
  institution?: string;
  start_date?: string;
  end_date?: string;
  requires_certificate: boolean;
}

const InitialTrainings: React.FC = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [filteredTrainings, setFilteredTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    fetchTrainings();
  }, []);

  useEffect(() => {
    if (trainings.length > 0) {
      filterTrainings(activeFilter, searchTerm);
    }
  }, [trainings, activeFilter, searchTerm]);

  const fetchTrainings = async () => {
    setIsLoading(true);
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/trainings");
      
      if (response.status !== 200) {
        throw new Error('Falha ao buscar treinamentos');
      }

      const trainingsData = response.data.data || [];
      setTrainings(trainingsData);
      setFilteredTrainings(trainingsData);
    } catch (err) {
      console.error('Error fetching trainings:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const filterTrainings = (filter: string, term: string = searchTerm) => {
    let result = [...trainings];

    // Apply text search if provided
    if (term.trim()) {
      result = result.filter(training =>
        training.name.toLowerCase().includes(term.toLowerCase()) ||
        (training.type && training.type.toLowerCase().includes(term.toLowerCase())) ||
        (training.institution && training.institution.toLowerCase().includes(term.toLowerCase()))
      );
    }

    // Apply type filter
    if (filter !== 'all') {
      result = result.filter(training => training.type?.toLowerCase() === filter.toLowerCase());
    }

    setFilteredTrainings(result);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  const getTrainingTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'técnico':
        return 'bg-blue-100 text-blue-800';
      case 'comportamental':
        return 'bg-green-100 text-green-800';
      case 'gerencial':
        return 'bg-purple-100 text-purple-800';
      case 'líderança':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data não informada';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
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
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Encontre Treinamentos para Desenvolver Suas Habilidades</h1>
            <p className="text-xl mb-8">Amplie seu conhecimento com os melhores treinamentos do mercado</p>

            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Busque por nome, tipo ou instituição..."
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
              <h2 className="text-2xl font-bold">Treinamentos Disponíveis</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => fetchTrainings()}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                  Atualizar
                </Button>
              </div>
            </div>

            <div className="bg-white p-2 rounded-lg shadow-sm mb-6">
              <TabsList className="w-full grid grid-cols-5">
                <TabsTrigger value="all" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">
                  Todos
                </TabsTrigger>
                <TabsTrigger value="técnico" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">
                  Técnico
                </TabsTrigger>
                <TabsTrigger value="comportamental" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
                  Comportamental
                </TabsTrigger>
                <TabsTrigger value="gerencial" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">
                  Gerencial
                </TabsTrigger>
                <TabsTrigger value="líderança" className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-800">
                  Liderança
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
              onClick={fetchTrainings}
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
        ) : filteredTrainings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="max-w-md mx-auto">
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum treinamento encontrado</h3>
              <p className="mt-2 text-gray-500">Não encontramos treinamentos com os filtros selecionados.</p>
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
              <p className="text-gray-600">{filteredTrainings.length} treinamentos encontrados</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrainings.map((training) => (
                <Card key={training.id} className="overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-xl bg-white hover:translate-y-[-5px]">
                  <CardHeader className="pb-4 border-b">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl font-bold">{training.name}</CardTitle>
                      <Badge className={training.requires_certificate ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {training.requires_certificate ? 'Com certificado' : 'Sem certificado'}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <School size={14} />
                      <span>{training.institution || 'Instituição não informada'}</span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className={`flex items-center gap-1 ${getTrainingTypeColor(training.type)}`}>
                        <Award size={14} />
                        {training.type || 'Tipo não informado'}
                      </Badge>

                      {training.workload_hours && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock size={14} />
                          {training.workload_hours}h
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>Início: {formatDate(training.start_date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>Término: {formatDate(training.end_date)}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-4 border-t">
                    <Button
                      className="w-full bg-purple-700 hover:bg-purple-800 text-white transition-all duration-300 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Link to={`/trainings/${training.id}`} className="w-full h-full flex items-center justify-center">
                        Ver Detalhes e Inscrever-se
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Newsletter Section */}
      <section className="bg-indigo-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Receba Novos Treinamentos</h2>
            <p className="text-gray-600 mb-6">Cadastre-se para receber informações sobre novos treinamentos.</p>

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

export default InitialTrainings;