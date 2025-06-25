import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "@/components/layouts/Header";
import { BookOpen, Building2, CalendarDays, ChevronRight, AlertCircle, Inbox } from "lucide-react";

// 1. Interface adaptada para os dados do treinamento
type SubscribedTraining = {
    id: number;
    name: string;
    institution: string;
    date_subscribed: string;
    status: 'Próximo' | 'Em andamento' | 'Concluído';
};

// 2. Componente de Status Badge adaptado
const StatusBadge = ({ status }: { status: SubscribedTraining['status'] }) => {
    const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
    const statusStyles = {
        'Próximo': "bg-blue-100 text-blue-800",
        'Em andamento': "bg-green-100 text-green-800",
        'Concluído': "bg-purple-100 text-purple-800",
    };

    return (
        <span className={`${baseClasses} ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};

// 3. Componente de Skeleton adaptado
const TrainingSkeleton = () => (
    <div className="block bg-white p-5 rounded-lg shadow-sm border border-gray-200 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 mb-4 sm:mb-0">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="flex items-center justify-between sm:justify-end sm:gap-6">
                <div className="h-5 bg-gray-200 rounded w-28"></div>
                <div className="h-7 bg-gray-300 rounded-full w-32"></div>
            </div>
        </div>
    </div>
);

export default function MyTrainingsPage() {
    const [trainings, setTrainings] = useState<SubscribedTraining[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMyTrainings = async () => {
            setIsLoading(true);
            setError(null);
            
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");

            if (!token) {
                setError("Você precisa estar autenticado para ver seus treinamentos.");
                setIsLoading(false);
                return;
            }

            try {
                // 4. Endpoint alterado para o de treinamentos
                const response = await axios.get("http://127.0.0.1:8000/api/my-trainings", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTrainings(response.data.data);
            } catch (apiError) {
                console.error("Erro ao buscar treinamentos:", apiError);
                setError("Não foi possível carregar seus treinamentos. Tente novamente mais tarde.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyTrainings();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="space-y-4">
                    <TrainingSkeleton />
                    <TrainingSkeleton />
                    <TrainingSkeleton />
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center text-center bg-red-50 border border-red-200 p-8 rounded-lg">
                    <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                    <h3 className="text-lg font-semibold text-red-800">Ocorreu um Erro</h3>
                    <p className="text-red-700 mt-1">{error}</p>
                </div>
            );
        }

        if (trainings.length === 0) {
            // 5. Mensagem de "lista vazia" adaptada
            return (
                <div className="flex flex-col items-center justify-center text-center bg-gray-50 border border-gray-200 p-10 rounded-lg">
                    <Inbox className="h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800">Nenhum treinamento encontrado</h3>
                    <p className="text-gray-600 mt-2">Você ainda não se inscreveu em nenhum treinamento.</p>
                    <Link to="/trainings" className="mt-6 px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors">
                        Ver Treinamentos Disponíveis
                    </Link>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {/* 6. Mapeamento e exibição dos dados de treinamento */}
                {trainings.map((train) => (
                    <Link
                        to={`/trainings/${train.id}`} // Link para a página de detalhes do treinamento
                        key={train.id}
                        className="block bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg hover:border-purple-500 transition-all duration-300 group"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex-1 mb-4 sm:mb-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <BookOpen className="h-5 w-5 text-purple-600" />
                                    <h3 className="text-xl font-bold text-gray-800">{train.name}</h3>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Building2 className="h-4 w-4" />
                                    <span>{train.institution}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between sm:justify-end sm:gap-6">
                               <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <CalendarDays className="h-4 w-4" />
                                    <span>{`Inscrito em: ${train.date_subscribed}`}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <StatusBadge status={train.status} />
                                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-1 container mx-auto py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* 7. Títulos e textos adaptados */}
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Meus Treinamentos</h1>
                    <p className="text-md text-gray-600 mb-8">
                        Acompanhe o status de todos os treinamentos nos quais você está inscrito.
                    </p>
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}