import { useState, useEffect } from "react";
import logocs from "@/assets/logocs.svg";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar se existe token no localStorage
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        // Remover token
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/login");
    };

    // Função para navegar para a página de edição de perfil
    const handleEditProfile = () => {
        navigate("/userhomepage");
    };

    return (
        <header className="bg-white border-b sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-700 flex items-center justify-center rounded-md mr-3">
                        <img src={logocs} alt="Logo CS" />
                    </div>
                    <h1 className="text-xl font-bold">CSRH Instituto</h1>
                </div>
                
                {isLoggedIn ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="rounded-full w-10 h-10 p-0">
                                <UserCircle className="h-7 w-7 text-purple-700" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="bg-white">
                            {/* Item adicionado para editar o perfil */}
                            <DropdownMenuItem onSelect={handleEditProfile} className="cursor-pointer">
                                Editar Perfil
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer">
                                Sair
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button className="bg-purple-700 hover:bg-purple-800 text-white">
                        <Link to="/login">Entrar</Link>
                    </Button>
                )}
            </div>
        </header>
    );
}