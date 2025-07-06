import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "@/components/layouts/Header"; 
import { Briefcase, Building2, CalendarDays, ChevronRight, AlertCircle, Inbox } from "lucide-react";


type AppliedOpportunity = {
  id: number;
  opportunity_title: string;
  company_name: string;
  date_applied: string;
  status: 'Pendente' | 'Aprovado' | 'Reprovado'; 
};

// Um componente auxiliar para o "badge" de status, deixando o código principal mais limpo
const StatusBadge = ({ status }: { status: AppliedOpportunity['status'] }) => {
    const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
    const statusStyles = {
        Pendente: "bg-yellow-100 text-yellow-800",
        Aprovado: "bg-green-100 text-green-800",
        Reprovado: "bg-red-100 text-red-800",
    };

    return (
        <span className={`${baseClasses} ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};

const ApplicationSkeleton = () => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 animate-pulse">
        <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-300 rounded-full w-24"></div>
        </div>
    </div>
);


export default function ViewApplies() {
    const [applications, setApplications] = useState<AppliedOpportunity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMyApplications = async () => {
            setIsLoading(true);
            setError(null);
            
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");

            if (!token) {
                setError("Você precisa estar autenticado para ver suas candidaturas.");
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get("https://rhback-production.up.railway.app/api/my-applications", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setApplications(response.data.data);
            } catch (apiError) {
                console.error("Erro ao buscar candidaturas:", apiError);
                setError("Não foi possível carregar suas candidaturas. Tente novamente mais tarde.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyApplications();
    }, []);

    const renderContent = () => {
        if (isLoading) {           
            return (
                <div className="space-y-4">
                    <ApplicationSkeleton />
                    <ApplicationSkeleton />
                    <ApplicationSkeleton />
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

        if (applications.length === 0) {
            return (
                 <div className="flex flex-col items-center justify-center text-center bg-gray-50 border border-gray-200 p-10 rounded-lg">
                    <Inbox className="h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800">Nenhuma candidatura encontrada</h3>
                    <p className="text-gray-600 mt-2">Você ainda não se candidatou a nenhuma vaga. Que tal começar agora?</p>
                     <Link to="/" className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                        Ver Vagas
                    </Link>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {applications.map((app) => (
                    <Link
                        to={`/statusresponse/${app.id}`}
                        key={app.id}
                        className="block bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-500 transition-all duration-300 group"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex-1 mb-4 sm:mb-0">
                                <div className="flex items-center gap-3 mb-2">
                                     <Briefcase className="h-5 w-5 text-blue-600" />
                                    <h3 className="text-xl font-bold text-gray-800">{app.opportunity_title}</h3>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Building2 className="h-4 w-4" />
                                    <span>{app.company_name}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between sm:justify-end sm:gap-6">
                               <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <CalendarDays className="h-4 w-4" />
                                    <span>{`Aplicou em: ${app.date_applied}`}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <StatusBadge status={app.status} />
                                     <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
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
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Minhas Candidaturas</h1>
                    <p className="text-md text-gray-600 mb-8">
                        Acompanhe o status de todas as vagas para as quais você se candidatou.
                    </p>
                    {renderContent()}
                </div>
            </main>
            {/* <Footer /> depois decido se vou usar*/}
        </div>
    );
}