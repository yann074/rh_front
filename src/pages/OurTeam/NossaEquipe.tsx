import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import { 
  Crown, 
  Users, 
  Star, 
  MessageCircle, 
  Award, 
  Target,
  BookOpen,
  TrendingUp,
  Heart,
  Briefcase,
  GraduationCap,
  Lightbulb
} from 'lucide-react';

// --- IMAGENS DA EQUIPE 
import CarlaPhoto from '@/assets/EquipePage/Carla.jpeg';
import JaquelinePhoto from '@/assets/EquipePage/Jaqueline.png';
// --- AINDA VOU DECIDIR SE VOU USAR ---
import HeroBackground from '@/assets/EquipePage/team-hero-bg.jpg';

// --- Dados da Equipe ---
const equipe = [
  {
    id: 1,
    nome: 'Carla Simone',
    cargo: 'Founder & CEO',
    foto: CarlaPhoto,
    bio: 'Apaixonada por inspirar e desenvolver pessoas. CEO do Instituto CS, Membro do Conselho Grupo São Roque.',
    especializacoes: [
      'Administradora',
      'Pós-graduação em Gestão de Pessoas',
      'Treinadora Comportamental e Experiencial Corporativa',
      'Training PNL Analista Comportamental',
      'Coach de Vida e Carreira',
      'Palestrante'
    ],
    cor: 'purple',
    icone: <Crown className="h-8 w-8" />,
    stats: [
      { label: 'Anos de Experiência', valor: '15+' },
      { label: 'Profissionais Desenvolvidos', valor: '2000+' },
      { label: 'Empresas Assessoradas', valor: '150+' }
    ]
  },
  {
    id: 2,
    nome: 'Jaqueline Machado',
    cargo: 'Gerente Administrativa',
    foto: JaquelinePhoto,
    bio: 'Administradora e Analista Comportamental, responsável pelo Sucesso do Cliente na CS Recursos Humanos.',
    especializacoes: [
      'Administradora',
      'Analista Comportamental',
      'Especialista em Sucesso do Cliente',
      'Gestão de Processos Administrativos',
      'Relacionamento Empresarial'
    ],
    cor: 'indigo',
    icone: <Users className="h-8 w-8" />,
    stats: [
      { label: 'Taxa de Satisfação', valor: '98%' },
      { label: 'Clientes Atendidos', valor: '500+' },
      { label: 'Processos Otimizados', valor: '300+' }
    ]
  }
];

// --- Valores da Liderança ---
const valoresLideranca = [
  {
    icone: <Heart className="h-8 w-8 text-purple-500" />,
    titulo: 'Empatia e Conexão',
    descricao: 'Acreditamos que liderança genuína nasce da capacidade de se conectar verdadeiramente com pessoas.'
  },
  {
    icone: <Lightbulb className="h-8 w-8 text-purple-500" />,
    titulo: 'Inovação Contínua',
    descricao: 'Estamos sempre buscando novas formas de revolucionar o mercado de recursos humanos.'
  },
  {
    icone: <Target className="h-8 w-8 text-purple-500" />,
    titulo: 'Resultados Excepcionais',
    descricao: 'Nossa dedicação está em entregar resultados que superem as expectativas de todos os envolvidos.'
  },
  {
    icone: <TrendingUp className="h-8 w-8 text-purple-500" />,
    titulo: 'Crescimento Mútuo',
    descricao: 'O sucesso da nossa equipe é medido pelo crescimento e sucesso de nossos clientes e parceiros.'
  }
];

// --- Componente Principal ---
const NossaEquipe: React.FC = () => {
  const fadeInAnimation = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: 'easeInOut' },
  } as const;

  const slideInLeft = {
    initial: { opacity: 0, x: -50 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, ease: 'easeOut' },
  } as const;

  const slideInRight = {
    initial: { opacity: 0, x: 50 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, ease: 'easeOut' },
  } as const;

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-800">
      <Header />

      <main>
        {/* --- SEÇÃO HERO --- */}
        <section 
          className="relative w-full min-h-[85vh] flex items-center justify-center text-center bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900"
        >
          <div className="absolute inset-0 bg-black/20"></div>
          
          <motion.div
            className="relative z-10 container mx-auto px-6 flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Nossa Equipe
              </h1>
            </div>
            <p className="mt-6 text-xl leading-8 text-purple-100 max-w-3xl">
              Conheça as mentes visionárias por trás da CS Recursos Humanos. 
              Duas profissionais excepcionais unidas pela paixão de conectar talentos e transformar carreiras.
            </p>
            
            <motion.div 
              className="mt-10 flex flex-wrap gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Award className="h-5 w-5 text-yellow-300" />
                <span className="text-white font-medium">Liderança Experiente</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Star className="h-5 w-5 text-yellow-300" />
                <span className="text-white font-medium">Excelência Comprovada</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <MessageCircle className="h-5 w-5 text-yellow-300" />
                <span className="text-white font-medium">Abordagem Humanizada</span>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* --- SEÇÃO PERFIS DA EQUIPE --- */}
        <section className="py-24 sm:py-32 bg-gray-50">
          <div className="container mx-auto px-6">
            <motion.div className="mx-auto max-w-2xl text-center mb-16" {...fadeInAnimation}>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-purple-700">
                As Arquitetas do Seu Sucesso
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Duas trajetórias únicas que convergem em uma missão comum: revolucionar o mundo dos recursos humanos.
              </p>
            </motion.div>

            <div className="space-y-24">
              {equipe.map((membro, index) => (
                <motion.div
                  key={membro.id}
                  className="mx-auto max-w-6xl"
                  {...(index % 2 === 0 ? slideInLeft : slideInRight)}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className={`grid grid-cols-1 items-center gap-12 lg:grid-cols-2 ${index % 2 !== 0 ? 'lg:grid-flow-col-dense' : ''}`}>
                    {/* Foto e Estatísticas */}
                    <div className={`${index % 2 !== 0 ? 'lg:col-start-2' : ''}`}>
                      <div className="relative">
                        <div className="aspect-[4/5] w-full max-w-md mx-auto overflow-hidden rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 p-2">
                          <img
                            src={membro.foto}
                            alt={`Foto de ${membro.nome}`}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        </div>
                        
                        {/* Badge de Cargo */}
                        <div className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                          {membro.icone}
                          <span className="font-semibold">{membro.cargo}</span>
                        </div>
                      </div>

                      {/* Estatísticas */}
                      <div className="mt-8 grid grid-cols-3 gap-4">
                        {membro.stats.map((stat, statIndex) => (
                          <motion.div
                            key={statIndex}
                            className="text-center p-4 bg-white rounded-lg shadow-sm border border-purple-100"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <div className="text-2xl font-bold text-purple-600">{stat.valor}</div>
                            <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Informações do Perfil */}
                    <div className={`${index % 2 !== 0 ? 'lg:col-start-1' : ''}`}>
                      <h3 className="text-3xl font-bold text-purple-800 mb-2">{membro.nome}</h3>
                      <p className="text-xl text-indigo-600 font-semibold mb-6">{membro.cargo}</p>
                      <p className="text-lg text-gray-700 leading-relaxed mb-8">{membro.bio}</p>

                      {/* Especializações */}
                      <div className="mb-8">
                        <h4 className="text-lg font-semibold text-purple-700 mb-4 flex items-center gap-2">
                          <GraduationCap className="h-5 w-5" />
                          Especializações & Formações
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {membro.especializacoes.map((spec, specIndex) => (
                            <motion.div
                              key={specIndex}
                              className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100"
                              whileHover={{ scale: 1.02 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <span className="text-sm font-medium text-gray-700">{spec}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Botão de Contato */}
                      <Button 
                        size="lg" 
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Conectar com {membro.nome.split(' ')[0]}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- SEÇÃO VALORES DA LIDERANÇA --- */}
        <section className="py-24 sm:py-32 bg-white">
          <div className="container mx-auto px-6">
            <motion.div className="mx-auto max-w-2xl text-center mb-16" {...fadeInAnimation}>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-purple-700">
                Os Pilares da Nossa Liderança
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Valores que orientam cada decisão e moldam a cultura da CS Recursos Humanos.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {valoresLideranca.map((valor, index) => (
                <motion.div
                  key={index}
                  className="text-center p-8 bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl border border-purple-100 hover:shadow-lg transition-all duration-300"
                  {...fadeInAnimation}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-6">
                    {valor.icone}
                  </div>
                  <h3 className="text-xl font-bold text-purple-800 mb-4">{valor.titulo}</h3>
                  <p className="text-gray-600 leading-relaxed">{valor.descricao}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- SEÇÃO CALL TO ACTION --- */}
        <section className="py-24 sm:py-32 bg-gradient-to-r from-purple-600 to-indigo-600">
          <div className="container mx-auto px-6 text-center">
            <motion.div {...fadeInAnimation}>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
                Pronto para Transformar Sua Carreira?
              </h2>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Nossa equipe está pronta para conectar você às melhores oportunidades do mercado. 
                Vamos conversar sobre seu futuro profissional?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-white text-purple-600 hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Link to="/contact">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Falar com Nossa Equipe
                  </Link>
                </Button>
                <Button 
                  asChild 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-purple-600 transition-all duration-300"
                >
                  <Link to="/">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Ver Oportunidades
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NossaEquipe;