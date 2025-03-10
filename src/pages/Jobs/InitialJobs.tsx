// InitialJobs.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, DollarSign, GraduationCap, Package } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import logocs from '@/assets/logocs.svg'
import Header from '@/components/layouts/Header'
import Footer from '@/components/layouts/Footer'

// TypeScript interface based on your PHP model
interface Vaga {
  id: number;
  titulo: string;
  descricao: string;
  salario: string;
  requisitos: string;
  localizacao: string;
  benificios: string;
  status: string;
  tipo_trabalho: string;
  formacao: string;
  created_at?: string;
  updated_at?: string;
}

// Interface for the possible API response structures
interface ApiResponse {
  data?: Vaga[];
  vagas?: Vaga[];
  [key: string]: any; // For any other potential properties
}

const InitialJobs: React.FC = () => {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVagas = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/all_job');
        if (!response.ok) {
          throw new Error('Falha ao buscar vagas');
        }
        
        const responseData: ApiResponse = await response.json();
        
        
        let vagasData: Vaga[] = [];
        
        if (Array.isArray(responseData)) {      
          vagasData = responseData;
        } else if (responseData.data && Array.isArray(responseData.data)) {
          vagasData = responseData.data;
        } else if (responseData.vagas && Array.isArray(responseData.vagas)) {
          vagasData = responseData.vagas;
        } else {
          console.error('Unexpected API response structure:', responseData);
          throw new Error('Formato de resposta da API inesperado');
        }
        
        setVagas(vagasData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        setLoading(false);
      }
    };

    fetchVagas();
  }, []);

  console.log('Current vagas state:', vagas);
  console.log('Is vagas an array?', Array.isArray(vagas));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Div Main */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Nossas Vagas Disponíveis</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Junte-se à nossa equipe e trabalhe com tecnologias de ponta em um ambiente dinâmico.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-2/3" />
                  <div className="flex gap-2 mt-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full rounded" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">Erro: {error}</div>
            <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
          </div>
        ) : vagas.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Nenhuma vaga disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(vagas) && vagas.map((vaga) => (
              <Card key={vaga.id} className="overflow-hidden transition hover:shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{vaga.titulo}</CardTitle>
                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">{vaga.status}</Badge>
                  </div>
                  <CardDescription>Extrema.ts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-3">{vaga.descricao}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1" />
                      <span>{vaga.localizacao || 'Remoto'}</span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase size={14} className="mr-1" />
                      <span>{vaga.tipo_trabalho || 'Integral'}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign size={14} className="mr-1" />
                      <span>{vaga.salario || 'A combinar'}</span>
                    </div>
                    <div className="flex items-center">
                      <GraduationCap size={14} className="mr-1" />
                      <span>{vaga.formacao || 'Não especificado'}</span>
                    </div>
                  </div>
                  {vaga.requisitos && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Requisitos:</h4>
                      <div className="flex flex-wrap gap-2">
                        {vaga.requisitos.split(',').map((requisito, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-100">{requisito.trim()}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {vaga.benificios && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <Package size={14} className="mr-1" />
                        Benefícios:
                      </h4>
                      <p className="text-sm text-gray-600">{vaga.benificios}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-purple-700 hover:bg-purple-800">
                    Ver Detalhes e Candidatar-se
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default InitialJobs;