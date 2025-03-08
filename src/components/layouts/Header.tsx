import logocs from "@/assets/logocs.svg";

export default function Header() {
    return (
        <header className="flex justify-between items-center px-8 py-4 bg-[#723E98] shadow-md">
            <div className="img_header">
                <a href="/"><img  src={logocs} alt="Logo" className="h-12" /> </a>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex gap-4">
                    <a href="#" className="text-white font-semibold hover:text-purple-300 transition">
                        A empresa
                    </a>
                    <a href="#" className="text-white font-semibold hover:text-purple-300 transition">
                        Banco de Talentos
                    </a>
                </div>
                <a href="/login" className=" text-white font-semibold px-4 py-2 rounded-3xl hover:bg-purple-700 transition">
                    Entrar
                </a>
            </div>
        </header>
    );
}
