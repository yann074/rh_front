import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const Experiences = () => {
    return (
        <section className="experiencias">
            <div className="conteiner-experiences">
                <h1>Minhas experiências</h1>
                <div className="input-container">
                    <input type="text" name="experiencia" />
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle />
                            </Button>
                        </DialogTrigger>

                        <DialogContent>
                            <p>Hello World</p>
                        </DialogContent>
                    </Dialog>
                </div>
                <label><input type="checkbox" />Não possuo experiência</label>
            </div>
            <div className="conteiner-experiences">
                <h1>Minhas certificações</h1>
                <div className="input-container">
                    <input type="text" name="experiencia" />
                    <Button>
                        <PlusCircle />
                    </Button>
                </div>
            </div>
            <div className="conteiner-experiences">
                <h1>Minhas licenças</h1>
                <div className="input-container">
                    <input type="text" name="experiencia" />
                    <Button>
                        <PlusCircle />
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default Experiences;
