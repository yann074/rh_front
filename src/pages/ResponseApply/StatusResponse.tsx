import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Check, X, CalendarCheck, Loader2 } from 'lucide-react';
import Header from '@/components/layouts/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Status = 'Aprovado' | 'Reprovado' | 'Pendente' | 'Erro';

const STEPS = [
  { 
    name: 'Inscrito',
    icon: <Check className="h-4 w-4" />,
    color: 'bg-green-500'
  },
  { 
    name: 'Em análise',
    icon: <Loader2 className="h-4 w-4 animate-spin" />,
    color: 'bg-yellow-500'
  },
  { 
    name: 'Marcou entrevista',
    icon: <CalendarCheck className="h-4 w-4" />,
    color: 'bg-blue-500'
  },
  { 
    name: 'Aprovado',
    icon: <Check className="h-4 w-4" />,
    color: 'bg-purple-500'
  },
  { 
    name: 'Reprovado',
    icon: <X className="h-4 w-4" />,
    color: 'bg-red-500'
  }
] as const;

const StatusResponse: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<Status | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !id) {
          setStatus('Erro');
          return;
        }

        const response = await axios.get(
          `http://127.0.0.1:8000/api/checkresult/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setStatus(response.data.status);
      } catch (error) {
        setStatus('Erro');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, [id]);

  const currentStepIndex = (() => {
    if (status === 'Pendente') return 1;
    if (status === 'Aprovado') return 3;
    if (status === 'Reprovado') return 4;
    return 0; // Inscrito
  })();

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (status === 'Erro') {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-600">Erro ao buscar status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 mb-4">
                Ocorreu um erro ao carregar seu status. Por favor, verifique seu token ou tente novamente mais tarde.
              </p>
              <a 
                href="/" 
                className="inline-block px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Voltar ao início
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-8">
        <Card className="max-w-2xl mx-auto border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Status da sua candidatura
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline connector */}
              <div className="absolute left-[18px] top-0 h-full w-0.5 bg-gray-200 -z-10" />

              <div className="space-y-8">
                {STEPS.map((step, index) => {
                  const isCurrent = index === currentStepIndex;
                  const isCompleted = index < currentStepIndex;
                  const isFuture = index > currentStepIndex;

                  return (
                    <div 
                      key={index}
                      className="flex items-start gap-4 relative"
                    >
                      {/* Step indicator */}
                      <div className={`flex-shrink-0 flex items-center justify-center rounded-full h-9 w-9 ${step.color} text-white`}>
                        {step.icon}
                      </div>

                      {/* Step content */}
                      <div className="flex-1 pt-1">
                        <h3 className={`text-lg font-medium ${
                          isCurrent ? 'text-primary' : 
                          isCompleted ? 'text-green-600' : 
                          'text-gray-500'
                        }`}>
                          {step.name}
                        </h3>
                        {isCurrent && (
                          <p className="text-sm text-gray-500 mt-1">
                            {status === 'Pendente' && 'Seu processo está em análise'}
                            {status === 'Aprovado' && 'Parabéns! Você foi aprovado!'}
                            {status === 'Reprovado' && 'Infelizmente você não foi selecionado'}
                          </p>
                        )}
                      </div>

                      {/* Status badge for current step */}
                      {isCurrent && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          status === 'Aprovado' ? 'bg-green-100 text-green-800' :
                          status === 'Reprovado' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {status === 'Pendente' ? 'Em andamento' : status}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Additional information */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-2">O que fazer agora?</h4>
              <p className="text-sm text-gray-600">
                {status === 'Aprovado' && 'Entre em contato com nosso RH para os próximos passos.'}
                {status === 'Reprovado' && 'Fique atento às nossas próximas oportunidades.'}
                {status === 'Pendente' && 'Aguarde o contato de nosso recrutador.'}
                {!status && 'Seu processo ainda está na fase inicial.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StatusResponse;