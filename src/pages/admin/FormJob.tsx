import { useState } from "react"
import axios from "axios";

export default function FomrJob(){

    const [form, setForm] = useState({
        titulo: "",
        descricao: "",
        salario: "",
        requisitos: "",
        localizacao: "",
        beneficios: "",
        status: "",
        tipo_trabalho: "",
        formacao: ""
});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios
        .post("https://rhback-production.up.railway.app/api/new_job", form, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.error(error.response?.data);
        });
};


    return(
        <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center text-purple-600 mb-6">Cadastro de Vaga</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium">Título</label>
                    <input
                        type="text"
                        name="titulo"
                        value={form.titulo}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded-lg"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Descrição</label>
                    <input
                        type="text"
                        name="descricao"
                        value={form.descricao}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded-lg h-28"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Salário</label>
                    <input
                        type="string"
                        name="salario"
                        value={form.salario}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded-lg"
                        placeholder="Opcional"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Requisitos</label>
                    <input
                        type="text"
                        name="requisitos"
                        value={form.requisitos}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded-lg"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Localização</label>
                    <input
                        type="text"
                        name="localizacao"
                        value={form.localizacao}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded-lg"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Benefícios</label>
                    <input
                        type="text"
                        name="beneficios"
                        value={form.beneficios}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded-lg"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Status</label>
                    <input
                        type="text"
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded-lg"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Tipo de Trabalho</label>
                    <input
                        type="text"
                        name="tipo_trabalho"
                        value={form.tipo_trabalho}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded-lg"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Formação</label>
                    <input
                        type="text"
                        name="formacao"
                        value={form.formacao}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 border rounded-lg"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition"
                >
                    Cadastrar Vaga
                </button>
            </form>
        </div>
    );
}