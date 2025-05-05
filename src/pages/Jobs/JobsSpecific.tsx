import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Briefcase, 
  GraduationCap, 
  DollarSign,
  CheckCircle,
  Share2,
  Bookmark,
  AlertCircle
} from "lucide-react";

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
    companies_id?: string;
    created_at?: string;
    updated_at?: string;
}

export default function JobsSpecific() {
    const { id } = useParams();
    const [data, setData] = useState<Vaga | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>("description");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const endpoint = `http://127.0.0.1:8000/api/opportunities/${id}`;
                console.log(`Buscando vaga: ${endpoint}`);
                
                const response = await axios.get(endpoint);
                
                if (response.data && response.data.data) {
                    setData(response.data.data);
                } else {
                    setError("A resposta da API não contém os dados esperados.");
                    console.error("Resposta inesperada:", response.data);
                }
            } catch (error: any) {
                console.error("Erro ao buscar dados da vaga:", error);
                
                if (error.response) {
                    if (error.response.status === 404) {
                        setError(`Vaga não encontrada. O ID ${id} pode não existir no banco de dados.`);
                    } else {
                        setError(`Erro do servidor: ${error.response.status} - ${error.response.statusText}`);
                    }
                } else if (error.request) {
                    setError("Não foi possível conectar ao servidor. Verifique se o backend está em execução.");
                } else {
                    setError(`Erro ao configurar a requisição: ${error.message}`);
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const handleGoBack = () => {
        navigate(-1); 
    };
    
    const formatDate = (dateString: string | number | Date) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (e) {
            return String(dateString);
        }
    };

    const getStatusColor = (status: string) => {
        switch(status.toLowerCase()) {
            case 'aberta':
            case 'disponível':
                return 'bg-green-100 text-green-800';
            case 'urgente':
                return 'bg-red-100 text-red-800';
            case 'fechada':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-purple-100 text-purple-800';
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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="h-24 bg-gray-200 rounded-lg"></div>
                                <div className="h-24 bg-gray-200 rounded-lg md:col-span-2"></div>
                            </div>
                            <div className="h-64 bg-gray-200 rounded-lg"></div>
                        </div>
                    </div>
                ) : error ? (
                    <div className="max-w-2xl mx-auto px-4 py-16">
                        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8">
                            <div className="flex items-center mb-6">
                                <AlertCircle className="w-10 h-10 text-red-500 mr-4" />
                                <h2 className="text-2xl font-medium text-gray-900">Erro ao carregar vaga</h2>
                            </div>
                            
                            <p className="text-gray-600 mb-8">{error}</p>
                            
                            <div className="bg-gray-50 border border-gray-100 rounded-lg p-6 mb-8">
                                <h3 className="font-medium text-gray-800 mb-3">Possíveis soluções:</h3>
                                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                                    <li>Verifique se o ID da vaga existe no banco de dados</li>
                                    <li>Confirme se o modelo Vaga está retornando resultados corretamente</li>
                                    <li>Verifique os logs do servidor para identificar erros específicos</li>
                                </ul>
                            </div>
                            
                            <div className="flex gap-4">
                                <button 
                                    onClick={handleGoBack}
                                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition shadow-sm"
                                >
                                    Voltar
                                </button>
                                <Link 
                                    to="/jobs" 
                                    className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Ver todas as vagas
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : data ? (
                    <div className="max-w-6xl mx-auto px-4 py-8">
                        {/* Back button */}
                        <button 
                            onClick={handleGoBack}
                            className="flex items-center text-purple-700 hover:text-purple-900 mb-8 group transition-all"
                        >
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-50 mr-2 group-hover:bg-purple-100 transition-all">
                                <ArrowLeft className="h-4 w-4" />
                            </div>
                            <span>Voltar para vagas</span>
                        </button>
                        
                        {/* Main content */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left column - Main job details */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    {/* Header with gradient */}
                                    <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-8 py-8 text-white">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm`}>
                                                {data.status}
                                            </span>
                                            <div className="flex space-x-2">
                                                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all">
                                                    <Share2 className="h-4 w-4" />
                                                </button>
                                                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all">
                                                    <Bookmark className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <h1 className="text-3xl font-bold mb-3">
                                            {data.title}
                                        </h1>
                                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-white/90 text-sm">
                                            <div className="flex items-center">
                                                <MapPin className="h-4 w-4 mr-1.5 text-white/70" />
                                                {data.location}
                                            </div>
                                            <div className="flex items-center">
                                                <DollarSign className="h-4 w-4 mr-1.5 text-white/70" />
                                                R$ {data.salary}
                                            </div>
                                            <div className="flex items-center">
                                                <Briefcase className="h-4 w-4 mr-1.5 text-white/70" />
                                                {data.job_type}
                                            </div>
                                            <div className="flex items-center">
                                                <GraduationCap className="h-4 w-4 mr-1.5 text-white/70" />
                                                {data.education}
                                            </div>
                                            {data.created_at && (
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-1.5 text-white/70" />
                                                    {formatDate(data.created_at)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Tabs */}
                                    <div className="border-b border-gray-100">
                                        <div className="flex">
                                            <button 
                                                onClick={() => setActiveTab("description")}
                                                className={`px-8 py-4 font-medium text-sm ${activeTab === "description" 
                                                    ? "text-purple-700 border-b-2 border-purple-700" 
                                                    : "text-gray-500 hover:text-gray-700"
                                                }`}
                                            >
                                                Descrição
                                            </button>
                                            <button 
                                                onClick={() => setActiveTab("requirements")}
                                                className={`px-8 py-4 font-medium text-sm ${activeTab === "requirements" 
                                                    ? "text-purple-700 border-b-2 border-purple-700" 
                                                    : "text-gray-500 hover:text-gray-700"
                                                }`}
                                            >
                                                Requisitos
                                            </button>
                                            <button 
                                                onClick={() => setActiveTab("benefits")}
                                                className={`px-8 py-4 font-medium text-sm ${activeTab === "benefits" 
                                                    ? "text-purple-700 border-b-2 border-purple-700" 
                                                    : "text-gray-500 hover:text-gray-700"
                                                }`}
                                            >
                                                Benefícios
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Tab content */}
                                    <div className="p-8">
                                        {activeTab === "description" && (
                                            <div className="text-gray-700 leading-relaxed">
                                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Sobre a vaga</h2>
                                                <div className="prose max-w-none">
                                                    {data.description}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {activeTab === "requirements" && (
                                            <div className="text-gray-700 leading-relaxed">
                                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Requisitos para se candidatar</h2>
                                                <div className="prose max-w-none">
                                                    {data.requirements}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {activeTab === "benefits" && (
                                            <div className="text-gray-700 leading-relaxed">
                                                <h2 className="text-xl font-semibold text-gray-900 mb-4">O que oferecemos</h2>
                                                <div className="prose max-w-none">
                                                    {data.benefits}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Right column - Apply section */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
                                    <div className="text-center mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Interessado na vaga?</h3>
                                        <p className="text-gray-500 text-sm">Candidate-se agora e receba uma resposta em até 7 dias</p>
                                    </div>
                                    
                                    <Link 
                                        to={`/apply/${data.id}`} 
                                        className="block w-full bg-purple-600 text-white text-center py-4 px-6 rounded-xl hover:bg-purple-700 transition font-medium shadow-sm"
                                    >
                                        Candidatar-se agora
                                    </Link>
                                    
                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <h4 className="font-medium text-gray-900 mb-3">Resumo da vaga</h4>
                                        <ul className="space-y-3">
                                            <li className="flex items-start">
                                                <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-600 text-sm">Tipo de trabalho: <span className="text-gray-900">{data.job_type}</span></span>
                                            </li>
                                            <li className="flex items-start">
                                                <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-600 text-sm">Salário: <span className="text-gray-900">R$ {data.salary}</span></span>
                                            </li>
                                            <li className="flex items-start">
                                                <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-600 text-sm">Formação: <span className="text-gray-900">{data.education}</span></span>
                                            </li>
                                            <li className="flex items-start">
                                                <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-600 text-sm">Localização: <span className="text-gray-900">{data.location}</span></span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-md mx-auto px-4 py-16 text-center">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h2 className="text-xl font-medium text-gray-900 mb-2">Vaga não encontrada</h2>
                            <p className="text-gray-600 mb-6">O conteúdo que você está procurando não está disponível.</p>
                            <Link 
                                to="/" 
                                className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Voltar para lista de vagas
                            </Link>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}