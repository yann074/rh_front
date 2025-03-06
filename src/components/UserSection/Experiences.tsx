import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
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
                                <PlusCircle className="w-4 h-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white">
                            <DialogHeader>
                                <DialogTitle>
                                    Adicionar experiência profissional
                                </DialogTitle>
                            </DialogHeader>
                            <form className="space-y-6">
                                <div className="flex flex-col gap-6">
                                    <input type="text" className="w-50 p-3" placeholder="Cargo" />
                                    <input type="text" className="w-50 p-3" placeholder="Empresa" />
                                </div>
                                <DialogFooter>
                                    <Button type="button">Cancelar</Button>
                                    <Button type="submit" className="bg-[#723E98] hover:bg-[#723E98] text-white">Salvar</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="input-label">
                    <input type="checkbox" /><label>Não possuo experiência</label>
                </div>
            </div>
            <div className="conteiner-experiences">
                <h1>Minhas certificações</h1>
                <div className="input-container">
                    <input type="text" name="experiencia" />
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="w-4 h-4 " />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white">
                            <DialogHeader>
                                <DialogTitle>
                                    Adicionar certificações
                                </DialogTitle>
                            </DialogHeader>
                            <form className="space-y-6">
                                <div className="flex flex-col gap-6">
                                    <input type="file" className="" />
                                </div>
                                <DialogFooter>
                                    <Button type="button">Cancelar</Button>
                                    <Button type="submit" className="bg-[#723E98] hover:bg-[#723E98] text-white">Salvar</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className="conteiner-experiences">
                <h1>Minhas licenças</h1>
                <div className="input-container">
                    <input type="text" name="experiencia" />
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="w-4 h-4 " />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white">
                            <DialogHeader>
                                <DialogTitle>
                                    Adicionar licenças
                                </DialogTitle>
                            </DialogHeader>
                            <form className="space-y-6">
                                <div className="flex flex-col gap-6">
                                    <input type="text" className="w-50 p-3" placeholder="Licenças" />
                                </div>
                                <DialogFooter>
                                    <Button type="button">Cancelar</Button>
                                    <Button type="submit" className="bg-[#723E98] hover:bg-[#723E98] text-white">Salvar</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </section>
    );
};

export default Experiences;
