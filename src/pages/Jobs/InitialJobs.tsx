import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import axios from "axios"
import { useEffect, useState } from "react"

export default function InitialJobs() {

    const [data, setData] = useState([]);

    useEffect(() => {
         axios.get("http://127.0.0.1:8000/api/all_job")
        .then((response) =>{
            console.log(response.data.data);
            setData(response.data.data)
        })
        .catch(console.error)
    }, []);
    

    return (
        <>
            <Header />

            

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-semibold text-center mb-6">VAGAS</h1>

                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {data.map(date => (
                        <li key={date.id} className="border p-6 rounded-lg shadow-md hover:shadow-lg transition">
                            <p className="text-xl font-semibold">{date.titulo}</p>
                            <p className="text-gray-600">{date.localizacao}</p>
                            <p className="text-gray-400 text-sm">{date.created_at}</p>
                            <button className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition rounded-md">
                                Ver vaga
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <Footer />
        </>
    );
}