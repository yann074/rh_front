import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { HeartHandshake, BrainCircuit, ShieldCheck, Rocket, ChevronDown } from 'lucide-react';
import HeroBackground from '@/assets/QuemSomos.jpg'; 
import BackgroundImage from '@/assets/whisk.png'; 

// --- IMAGENS DO PASSO A PASSO ---
import VerticalStep1 from '@/assets/vertical1.jpg';
import VerticalStep2 from '@/assets/vertical2.jpg';
import VerticalStep3 from '@/assets/vertical3.jpg'; 


// --- Dados dos Valores da Empresa ---
const nossosValores = [
  {
    icon: <HeartHandshake className="h-10 w-10 text-purple-500" />,
    title: 'Conexões Humanizadas',
    description: 'Acreditamos que por trás de cada currículo existe uma história. Usamos a tecnologia para ampliar conexões, nunca para substituir o toque humano e a empatia que definem uma parceria de sucesso.',
  },
  {
    icon: <BrainCircuit className="h-10 w-10 text-purple-500" />,
    title: 'Inovação Estratégica',
    description: 'Estamos na vanguarda da tecnologia de RH, não por modismo, mas por propósito. Inovamos para simplificar processos, gerar insights valiosos e entregar resultados mais precisos e eficientes.',
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-purple-500" />,
    title: 'Transparência e Confiança',
    description: 'Construímos relações baseadas na clareza e honestidade. Candidatos e empresas confiam em nosso processo por ser transparente, ético e focado em criar o alinhamento perfeito.',
  },
  {
    icon: <Rocket className="h-10 w-10 text-purple-500" />,
    title: 'Crescimento Acelerado',
    description: 'Somos mais que uma ponte; somos um catalisador. Nosso objetivo é acelerar o crescimento tanto dos profissionais em suas carreiras quanto das empresas que buscam os melhores talentos.',
  },
];

// --- Dados do Passo a Passo do Candidato ---
const passosCandidato = [
    {
        number: '1',
        title: 'Crie sua conta',
        description: 'Dê o primeiro passo para sua próxima oportunidade. O cadastro é rápido, fácil e totalmente gratuito.',
        image: VerticalStep1,
        alt: 'Ilustração de uma pessoa criando uma conta em uma interface de login.'
    },
    {
        number: '2',
        title: 'Cadastre seu perfil',
        description: 'Construa um perfil de destaque. Adicione suas experiências, habilidades e currículo para que nosso sistema encontre as melhores vagas para você.',
        image: VerticalStep2,
        alt: 'Ilustração de uma pessoa preenchendo seu perfil profissional em uma página web.'
    },
    {
        number: '3',
        title: 'Responda ao perfil comportamental',
        description: 'Vá além do currículo. Nosso mapeamento comportamental nos ajuda a conectar você com empresas que compartilham seus valores e cultura.',
        image: VerticalStep3,
        alt: 'Ilustração de um foguete decolando de um laptop, simbolizando o início da jornada profissional.'
    }
];


// --- Componente da Página ---
const QuemSomos: React.FC = () => {
  // Objeto de animação para fade-in simples
  const fadeInAnimation = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: 'easeInOut' },
  } as const;

  // Animação para a seção de jornada (aparece e desaparece)
  const sectionScrollAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' }
    }
  } as const;

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-800">
      <Header />

      <main>
        {/* --- SEÇÃO HERO --- */}
        <section 
            className="relative w-full min-h-[90vh] flex items-center justify-center text-center bg-cover bg-center"
            style={{ backgroundImage: `url(${HeroBackground})` }}
        >
            {/* Overlay para melhorar a legibilidade do texto */}
            <div className="absolute inset-0 bg-purple-900/40 backdrop-blur-sm"></div>

            <motion.div
                className="relative z-10 container mx-auto px-6 flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl max-w-3xl text-shadow-md">
                    Estratégia, Talento e Tecnologia: A Combinação Perfeita
                </h1>
                <p className="mt-6 text-lg leading-8 text-purple-100 max-w-2xl text-shadow">
                    Conectamos talentos excepcionais a oportunidades inovadoras com precisão e estratégia, impulsionando o crescimento de empresas e carreiras.
                </p>
            </motion.div>
        </section>

        {/* --- SEÇÃO PASSO A PASSO PARA O CANDIDATO (COM ANIMAÇÃO) --- */}
        <motion.section 
            className="py-24 sm:py-32 bg-white"
            variants={sectionScrollAnimation}
            initial="hidden"
            whileInView="visible"
            onViewportLeave={() => "hidden"}
            viewport={{ once: false, amount: 0.2 }}
        >
            <div className="container mx-auto px-6">
                <motion.div className="mx-auto max-w-2xl text-center" {...fadeInAnimation}>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-purple-700">Sua Jornada Começa Agora</h2>
                    <p className="mt-4 text-lg text-gray-500">
                        Encontrar a vaga ideal nunca foi tão simples. Siga os passos abaixo e conecte-se com as melhores oportunidades.
                    </p>
                </motion.div>

                <div className="mt-16 sm:mt-24 space-y-12 lg:space-y-0">
                    {passosCandidato.map((passo, index) => (
                        <motion.div key={passo.number} {...fadeInAnimation}>
                        <div className="mx-auto max-w-5xl">
                              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-8">
                                  <div className={`flex justify-center ${index % 2 !== 0 ? 'lg:order-last' : ''}`}>
                                      <img 
                                          src={passo.image} 
                                          alt={passo.alt} 
                                          className="w-full max-w-sm rounded-lg"
                                      />
                                  </div>
                                  <div className="text-center lg:text-left">
                                      <div className="flex items-center justify-center lg:justify-start gap-4">
                                         <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white font-bold text-xl shadow-lg">
                                              {passo.number}
                                          </div>
                                          <h3 className="text-2xl font-bold text-purple-800">{passo.title}</h3>
                                      </div>
                                      <p className="mt-4 text-lg text-gray-600">
                                          {passo.description}
                                      </p>
                                  </div>
                              </div>
                        </div>
                            
                            {index < passosCandidato.length - 1 && (
                                <div className="my-12 flex justify-center">
                                    <ChevronDown className="h-10 w-10 text-purple-300 animate-bounce" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>

        {/* --- Seção de Valores --- */}
        <section className="py-24 sm:py-32 bg-white">
          <div className="container mx-auto px-6">
            <motion.div className="mx-auto max-w-2xl text-center" {...fadeInAnimation}>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-purple-700">Nossa Essência, Nossos Valores</h2>
              <p className="mt-4 text-lg text-gray-500">
                Estes são os pilares que guiam cada decisão, cada conexão e cada inovação que promovemos.
              </p>
            </motion.div>

            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4">
              {nossosValores.map((valor, index) => (
                <motion.div
                  key={valor.title}
                  className="flex flex-col p-8 rounded-2xl bg-white ring-1 ring-purple-200 shadow-md h-full"
                  {...fadeInAnimation}
                    transition={{delay: index * 0.1}}
                >
                  <div className="mb-4">{valor.icon}</div>
                  <h3 className="text-xl font-semibold text-purple-800">{valor.title}</h3>
                  <p className="mt-2 flex-grow text-base text-gray-600">{valor.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Seção Nossa Missão --- */}
        <section className="relative overflow-hidden py-24 sm:py-32 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 items-center gap-x-12 gap-y-16 lg:grid-cols-2">
              <motion.div {...fadeInAnimation}>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-purple-700">Nossa Missão é o Seu Sucesso</h2>
                <p className="mt-6 text-lg text-gray-600">
                  Vamos além do recrutamento. Nossa missão é construir ecossistemas de talentos onde empresas e profissionais não apenas se encontram, mas crescem juntos. Através de uma plataforma inteligente e um serviço consultivo, criamos parcerias duradouras que impulsionam a inovação e o sucesso mútuo.
                </p>
                <div className="mt-8 flex gap-4">
                  <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300">
                    <Link to="/contact">Fale com um Especialista</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-purple-500 text-purple-500 hover:bg-purple-500/10 hover:text-purple-600 transition-all duration-300">
                    <Link to="/">Ver Vagas</Link>
                  </Button>
                </div>
              </motion.div>

              <motion.div
                className="aspect-[4/3] w-full"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
              >
                <img
                  src={BackgroundImage}
                  alt="Equipe de RH colaborando"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default QuemSomos;