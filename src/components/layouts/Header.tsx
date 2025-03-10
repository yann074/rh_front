import logocs from "@/assets/logocs.svg";
import { Button } from '@/components/ui/button';

export default function Header() {
    return (
        <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-700 flex items-center justify-center rounded-md mr-3">
              <img src={logocs} />
            </div>
            <h1 className="text-xl font-bold">CSRH Instituto</h1>
          </div>
          <Button className="bg-purple-700 hover:bg-purple-800 text-white">Entrar</Button>
        </div>
      </header>
    );
}
