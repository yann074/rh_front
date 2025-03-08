import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

interface Job {
    id: number;
    titulo: string;
    salario: string;
    requisitos: string;
    localizacao: string;
    beneficios: string;
    status: string;
    tipo_trabalho: string;
    formacao: string;
    created_at: string;
}

export default function JobsSpecific() {
    const { id } = useParams();
    const [data, setData] = useState<Job | null>(null);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/all_specific/${id}`)
        .then((response) => {
            console.log(response.data.data);
            setData(response.data.data);
        })
        .catch(console.error);
    }, [id]);

    return (
        <>
            <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex-grow container mx-auto px-4 py-12">
                    <div className="container mx-auto px-4 py-12 flex flex-col align-middle">
                        <div className="w-full flex align-middle justify-center">
                        </div>
                        <div className="grid">
                            {data && (
                                <div
                                    key={data.id}
                                    className="border border-gray-200 rounded-3xl shadow-md p-8 bg-white hover:shadow-lg transition"
                                >
                            <h1 className="text-3xl font-semibold text-center mb-12 bg-[#723E98] text-white p-5 rounded-3xl">
                                {data.titulo}
                            </h1>
                                    <p className="text-gray-600 mb-2"><strong>Salário:</strong> R${data.salario}</p>
                                    <p className="text-gray-600 mb-2"><strong>Requisitos:</strong> {data.requisitos}</p>
                                    <p className="text-gray-600 mb-2"><strong>Localização:</strong> {data.localizacao}</p>
                                    <p className="text-gray-600 mb-2"><strong>Benefícios:</strong> {data.beneficios}</p>
                                    <p className="text-gray-600 mb-2"><strong>Status:</strong> {data.status}</p>
                                    <p className="text-gray-600 mb-2"><strong>Tipo de Trabalho:</strong> {data.tipo_trabalho}</p>
                                    <p className="text-gray-600 mb-2"><strong>Formação Necessária:</strong> {data.formacao}</p>
                                    <p className="text-gray-600"><strong>Data de Criação:</strong> {new Date(data.created_at).toLocaleDateString()}</p>
                                </div>
                            ) }
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}
