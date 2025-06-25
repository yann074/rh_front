import { useState, useEffect } from "react";
import logocs from "@/assets/logocs.svg";
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        setIsLoggedIn(!!token);

        if (token) {
            const userDataString = localStorage.getItem("user") || sessionStorage.getItem("user");
            if (userDataString) {
                try {
                    const userData = JSON.parse(userDataString);
                    if (userData && userData.permission === 'admin') {
                        setIsAdmin(true);
                    }
                } catch (error) {
                    console.error("Erro ao analisar dados do usuário:", error);
                    setIsAdmin(false);
                }
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        setIsLoggedIn(false);
        setIsAdmin(false);
        navigate("/login");
    };

    const handleEditProfile = () => {
        navigate("/userhomepage");
    };

    const handleSeeApplications = () => {
        navigate("/my-applications");
    };

    const handleSeeSubscriptions = () => {
        navigate("/my-subscriptions");
    };

    const handleHomePage = () => {
        navigate("/");
    };

    const handleGoToDashboard = () => {
        navigate("/dashboard");
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
                            {isAdmin && (
                                <DropdownMenuItem onSelect={handleGoToDashboard} className="cursor-pointer">
                                    Dashboard
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onSelect={handleHomePage} className="cursor-pointer">
                                Início
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={handleEditProfile} className="cursor-pointer">
                                Editar Perfil
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={handleSeeApplications} className="cursor-pointer">
                                Candidatura
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={handleSeeSubscriptions} className="cursor-pointer">
                                Inscrições
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer">
                                Sair
                            </DropdownMenuItem>                    
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button asChild className="bg-purple-700 hover:bg-purple-800 text-white">
                        <Link to="/login">Entrar</Link>
                    </Button>
                )}
            </div>
        </header>
    );
}