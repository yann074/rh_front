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
                console.log(users)
                setUsers(response.data.data);
            })
            .catch((error) => console.error("Erro ao buscar usuários:", error))
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold text-center text-white bg-purple-600 p-4 rounded-lg">
                Lista de Usuários
            </h1>

            
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="border border-gray-200 rounded-lg shadow-md p-6 bg-white hover:shadow-lg transition"
                        >
                            <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
                            <p className="text-gray-600"><strong>Email:</strong> {user.email}</p>
                            <p className="text-gray-600"><strong>Permissão:</strong> {user.permission}</p>
                            <Trash size={24} className="text-red-500 cursor-pointer" />
                            <Paintbrush size={24} className="text-blue-500 cursor-pointer" />
                        </div>
                    ))}
                </div>
            
        </div>
    );
}
