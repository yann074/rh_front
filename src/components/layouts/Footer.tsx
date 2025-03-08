import React from "react";
import logocs from "@/assets/logocs.svg";

export default function Footer() {
    return (
        <footer className="bg-white-900 text-white p-6 flex justify-between items-center flex-wrap">
            <div>
                <div className="img_header">
                    <img src={logocs} alt="Logo" className="h-12" />
                </div>
                <h4 className="text-gray-600 mt-2">A empresa perfeita para achar seu emprego</h4>
            </div>

            <div className="flex flex-col items-end">
                <div className="social-icons flex gap-4 mb-2">
                    <a href="#" className="text-gray-600 text-2xl hover:text-purple-400 transition">
                        <p>LINKEDIN</p>
                    </a>
                    <a href="#" className="text-gray-600 text-2xl hover:text-purple-400 transition">
                        <p>FACEBOOK</p>
                    </a>
                    <a href="#" className="text-gray-600 text-2xl hover:text-purple-400 transition">
                        <p>INSTA</p>
                    </a>
                    <a href="#" className="text-gray-600 text-2xl hover:text-purple-400 transition">
                        <p>YT</p>
                    </a>
                    <a href="#" className="text-gray-600 text-2xl hover:text-purple-400 transition">
                        <p>TTK</p>
                    </a>
                </div>

                <div className="flex gap-4">
                    <a href="#" className="text-gray-400 hover:text-purple-400 transition">Central de ajuda</a>
                    <a href="#" className="text-gray-400 hover:text-purple-400 transition">Suporte ao candidato</a>
                </div>
            </div>
        </footer>
    );
}
