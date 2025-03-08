import React from "react";
import logocs from "@/assets/logocs.svg";

export default function Header() {
    return (
        <header className="flex justify-between items-center px-8 py-4 bg-gray-100 shadow-md">
            <div className="img_header">
                <a href="/"><img  src={logocs} alt="Logo" className="h-12" /> </a>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex gap-4">
                    <a href="#" className="text-gray-700 font-semibold hover:text-purple-600 transition">
                        A empresa
                    </a>
                    <a href="#" className="text-gray-700 font-semibold hover:text-purple-600 transition">
                        Banco de Talentos
                    </a>
                </div>
                <a href="/login" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
                    Entrar
                </a>
            </div>
        </header>
    );
}
