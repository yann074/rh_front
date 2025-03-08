import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import axios from "axios";
import { useEffect, useState } from "react";

interface Job {
    id: number;
    titulo: string;
    salario: string;
    localizacao: string;
}

export default function InitialJobs() {
    const [data, setData] = useState<Job[]>([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/all_job")
            .then((response) => {
                console.log(response.data.data);
                setData(response.data.data);
            })
            .catch(console.error);
    }, []);

    return (
        <>
            <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex-grow container mx-auto px-4 py-12">
                    <div className="container mx-auto px-4 py-12 flex flex-col align-middle">
                        <div className="w-full flex align-middle justify-center">
                            <h1 className="text-3xl font-semibold text-center mb-12 bg-[#723E98] text-white p-5 rounded-3xl">VAGAS DE EMPREGO</h1>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            {data.map((job) => (
                                <div
                                    key={job.id}
                                    className="border border-gray-200 rounded-3xl shadow-md p-8 bg-white hover:shadow-lg transition"
                                >
                                    <h2 className="text-xl font-semibold text-black">{job.titulo}</h2>
                                    <p className="text-gray-600 mb-2"><strong>Salário:</strong> R${job.salario}</p>
                                    <p className="text-gray-600 mb-4"><strong>Localização:</strong> {job.localizacao}</p>

                                    <button className="mt-4 w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition">
                                        Ver vaga
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}
