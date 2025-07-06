import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { 
    ArrowLeft, 
    Calendar, 
    Clock,
    Award,
    BookOpen,
    UserCheck,
    CheckCircle,
    AlertCircle,
    Loader2
} from "lucide-react";

// Interface atualizada SEM o campo description
interface Training {
    id: number;
    name: string;
    type: string;
    workload_hours?: number;
    institution?: string;
    start_date?: string;
    end_date?: string;
    requires_certificate: boolean;
    created_at?: string;
    updated_at?: string;
    is_subscribed_by_user?: boolean;
}

export default function TrainingsSpecific() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Estados do componente
    const [data, setData] = useState<Training | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Estados para controlar a lógica de inscrição
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isSubscribing, setIsSubscribing] = useState(false);

    // Configuração personalizada do SweetAlert2
    const showSuccessAlert = (title: string, text: string) => {
        return Swal.fire({
            icon: 'success',
            title: title,
            text: text,
            confirmButtonText: 'Ótimo!',
            confirmButtonColor: '#7c3aed',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });
    };

    const showErrorAlert = (title: string, text: string) => {
        return Swal.fire({
            icon: 'error',
            title: title,
            text: text,
            confirmButtonText: 'Entendi',
            confirmButtonColor: '#ef4444',
            showClass: {
                popup: 'animate__animated animate__shakeX'
            }
        });
    };

    const showWarningAlert = (title: string, text: string) => {
        return Swal.fire({
            icon: 'warning',
            title: title,
            text: text,
            confirmButtonText: 'Ok',
            confirmButtonColor: '#f59e0b'
        });
    };

    const showInfoAlert = (title: string, text: string) => {
        return Swal.fire({
            icon: 'info',
            title: title,
            text: text,
            confirmButtonText: 'Entendi',
            confirmButtonColor: '#3b82f6'
        });
    };

    // Efeito para buscar os dados do treinamento na API
    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            setError(null);
            
            try {
                const token = localStorage.getItem("token") || sessionStorage.getItem("token");
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                const endpoint = `https://rhback-production.up.railway.app/api/trainings/${id}`;
                
                const response = await axios.get(endpoint, { headers });
                
                if (response.data && response.data.data) {
                    const trainingData: Training = response.data.data;
                    setData(trainingData);
                    setIsSubscribed(trainingData.is_subscribed_by_user || false);
                } else {
                    const errorMsg = "Os dados do treinamento não puderam ser carregados. Tente novamente.";
                    setError(errorMsg);
                }
            } catch (err: any) {
                console.error("Erro ao buscar dados do treinamento:", err);
                let errorMessage = "Ops! Algo deu errado ao carregar o treinamento.";
                
                if (err.response) {
                    switch (err.response.status) {
                        case 404:
                            errorMessage = `Treinamento não encontrado. Verifique se o link está correto.`;
                            break;
                        case 401:
                            errorMessage = "Você precisa estar logado para visualizar este treinamento.";
                            break;
                        case 403:
                            errorMessage = "Você não tem permissão para visualizar este treinamento.";
                            break;
                        case 500:
                            errorMessage = "Erro interno do servidor. Tente novamente em alguns minutos.";
                            break;
                        default:
                            errorMessage = `Erro do servidor (${err.response.status}). Tente novamente.`;
                    }
                } else if (err.request) {
                    errorMessage = "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.";
                } else {
                    errorMessage = "Erro inesperado. Tente recarregar a página.";
                }
                
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Função para lidar com o clique no botão de inscrição
    const handleSubscribe = async () => {
        if (!id || isSubscribing) return;

        // Verificar se o usuário já está inscrito
        if (isSubscribed) {
            showInfoAlert(
                'Você já está inscrito!',
                'Sua inscrição neste treinamento já foi confirmada. Fique atento às datas de início!'
            );
            return;
        }

        setIsSubscribing(true);
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");

        if (!token) {
            showWarningAlert(
                'Login necessário',
                'Você precisa estar logado para se inscrever em um treinamento. Por favor, faça login e tente novamente.'
            );
            setIsSubscribing(false);
            return;
        }

        try {
            const endpoint = `https://rhback-production.up.railway.app/api/trainings/${id}/subscribe`;
            const response = await axios.post(
                endpoint, 
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setIsSubscribed(true);
                showSuccessAlert(
                    'Inscrição realizada com sucesso! 🎉',
                    response.data.message || 'Sua vaga foi garantida! Fique atento aos próximos passos e datas importantes.'
                );
            } else {
                throw new Error(response.data.message || "Não foi possível confirmar a inscrição.");
            }

        } catch (err: any) {
            console.error("Erro ao se inscrever no treinamento:", err);
            
            let errorTitle = "Erro na inscrição";
            let errorMessage = "Não foi possível completar sua inscrição. Tente novamente.";
            
            if (err.response) {
                switch (err.response.status) {
                    case 400:
                        errorTitle = "Dados inválidos";
                        errorMessage = err.response.data?.message || "Verifique os dados e tente novamente.";
                        break;
                    case 401:
                        errorTitle = "Sessão expirada";
                        errorMessage = "Sua sessão expirou. Faça login novamente e tente se inscrever.";
                        break;
                    case 403:
                        errorTitle = "Acesso negado";
                        errorMessage = "Você não tem permissão para se inscrever neste treinamento.";
                        break;
                    case 409:
                        errorTitle = "Você já está inscrito";
                        errorMessage = "Sua inscrição já foi realizada anteriormente.";
                        setIsSubscribed(true);
                        break;
                    case 422:
                        errorTitle = "Vagas esgotadas";
                        errorMessage = err.response.data?.message || "Infelizmente não há mais vagas disponíveis para este treinamento.";
                        break;
                    case 500:
                        errorTitle = "Erro do servidor";
                        errorMessage = "Erro interno do servidor. Tente novamente em alguns minutos.";
                        break;
                    default:
                        errorMessage = err.response.data?.message || errorMessage;
                }
            } else if (err.request) {
                errorTitle = "Erro de conexão";
                errorMessage = "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.";
            }
            
            showErrorAlert(errorTitle, errorMessage);
        } finally {
            setIsSubscribing(false);
        }
    };
    
    // Funções utilitárias
    const handleGoBack = () => navigate(-1);
    
    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        try {
            const date = new Date(`${dateString}T00:00:00`);
            return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        } catch (e) {
            return String(dateString);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow">
                {loading ? (
                    <div className="max-w-6xl mx-auto px-4 py-16">
                        <div className="flex flex-col space-y-6 animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-48"></div>
                            <div className="h-14 bg-gray-200 rounded-lg w-3/4"></div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="h-48 bg-gray-200 rounded-lg lg:col-span-2"></div>
                                <div className="h-48 bg-gray-200 rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                ) : error ? (
                    <div className="max-w-2xl mx-auto px-4 py-16">
                        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 text-center">
                            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-medium text-gray-900 mb-2">Ops! Algo deu errado</h2>
                            <p className="text-gray-600 my-4">{error}</p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button 
                                    onClick={() => window.location.reload()}
                                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition shadow-sm"
                                >
                                    Tentar novamente
                                </button>
                                <button 
                                    onClick={handleGoBack}
                                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Voltar
                                </button>
                            </div>
                        </div>
                    </div>
                ) : data ? (
                    <div className="max-w-6xl mx-auto px-4 py-8">
                        <button 
                            onClick={handleGoBack}
                            className="flex items-center text-purple-700 hover:text-purple-900 mb-8 group transition-all"
                        >
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-50 mr-2 group-hover:bg-purple-100 transition-all">
                                <ArrowLeft className="h-4 w-4" />
                            </div>
                            <span>Voltar para treinamentos</span>
                        </button>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Coluna da Esquerda: Detalhes do Treinamento */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-8 py-8 text-white">
                                        <h1 className="text-3xl font-bold mb-4">{data.name}</h1>
                                        <div className="flex flex-wrap gap-x-6 gap-y-3 text-white/90">
                                            <div className="flex items-center"><BookOpen className="h-4 w-4 mr-1.5 opacity-70" /> {data.institution}</div>
                                            <div className="flex items-center"><Award className="h-4 w-4 mr-1.5 opacity-70" /> {data.type}</div>
                                            <div className="flex items-center"><Clock className="h-4 w-4 mr-1.5 opacity-70" /> {data.workload_hours} horas</div>
                                        </div>
                                    </div>
                                    {/* A SEÇÃO DE DESCRIÇÃO FOI REMOVIDA DAQUI */}
                                </div>
                            </div>

                            {/* Coluna da Direita: Card de Inscrição */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
                                    <div className="text-center mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {isSubscribed ? "Você está inscrito! 🎉" : "Pronto para começar?"}
                                        </h3>
                                        <p className="text-gray-500 text-sm">
                                            {isSubscribed 
                                                ? "Sua vaga está garantida neste treinamento." 
                                                : "Garanta sua vaga neste treinamento."
                                            }
                                        </p>
                                    </div>
                                    
                                    <button
                                        onClick={handleSubscribe}
                                        disabled={isSubscribing}
                                        className={`w-full text-center py-4 px-6 rounded-xl transition font-medium shadow-sm flex items-center justify-center disabled:cursor-not-allowed ${
                                            isSubscribed 
                                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                                : 'bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-400'
                                        }`}
                                    >
                                        {isSubscribing && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
                                        {isSubscribed ? (
                                            <>
                                                <CheckCircle className="h-5 w-5 mr-2" />
                                                Inscrito com sucesso
                                            </>
                                        ) : (
                                            "Inscrever-se agora"
                                        )}
                                    </button>
                                    
                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <h4 className="font-medium text-gray-900 mb-4">Resumo do Treinamento</h4>
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex items-start">
                                                <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-600">Instituição: <span className="font-medium text-gray-900">{data.institution}</span></span>
                                            </li>
                                            <li className="flex items-start">
                                                <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-600">Início: <span className="font-medium text-gray-900">{formatDate(data.start_date)}</span></span>
                                            </li>
                                            <li className="flex items-start">
                                                <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-600">Término: <span className="font-medium text-gray-900">{formatDate(data.end_date)}</span></span>
                                            </li>
                                            <li className="flex items-start">
                                                <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-600">Certificado: <span className="font-medium text-gray-900">{data.requires_certificate ? 'Sim' : 'Não'}</span></span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </main>
            <Footer />
        </div>
    );
}