import { useEffect, useState } from "react";
import { Trash, Paintbrush } from "lucide-react";
import axios from "axios";

interface User {
    id: number;
    name: string;
    email: string;
    permission: string;
}

export default function UserList() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/all")
            .then((response) => {
                setUsers(response.data.data);
            })
            .catch((error) => console.error("Erro ao buscar usuários:", error))
    }, []);

    return (
        <div className="w-full min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-semibold text-center text-white bg-purple-600 p-4 rounded-lg mb-6">
                    Lista de Usuários
                </h1>

                {users.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className="border border-gray-200 rounded-lg shadow-md p-6 bg-white hover:shadow-lg transition"
                            >
                                <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
                                <p className="text-gray-600"><strong>Email:</strong> {user.email}</p>
                                <p className="text-gray-600"><strong>Permissão:</strong> {user.permission}</p>
                                <div className="flex mt-4 space-x-4">
                                    <Trash size={24} className="text-red-500 cursor-pointer hover:text-red-700" />
                                    <Paintbrush size={24} className="text-blue-500 cursor-pointer hover:text-blue-700" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500">Carregando usuários...</p>
                    </div>
                )}
            </div>
        </div>
    );
}