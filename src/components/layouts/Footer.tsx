import logocs from "@/assets/logocs.svg";

export default function Footer() {
    return (
        <footer className="bg-gray-100 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-700 flex items-center justify-center rounded-md mr-2">
                  <img src={logocs} alt="" />
                </div>
                <h3 className="text-lg font-bold">CS Instituto</h3>
              </div>
              <p className="text-gray-600 text-sm">Construindo o futuro através da tecnologia e inovação.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-purple-700 text-sm">Sobre Nós</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-700 text-sm">Carreiras</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-700 text-sm">Nossa Equipe</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-700 text-sm">Notícias</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-purple-700 text-sm">Redes Sociais</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-700 text-sm">Documentação</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-700 text-sm">Centro de Ajuda</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <ul className="space-y-2">
                <li className="text-gray-600 text-sm">csinstituto@gmail.com</li>
                <li className="text-gray-600 text-sm">(75) 3225-5678</li>
                <li className="text-gray-600 text-sm">Rua Boticário Moncorvo, 530</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} CS Instituto. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    );
}
