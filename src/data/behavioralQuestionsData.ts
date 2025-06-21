export type ProfileType = "executor" | "planejador" | "analista" | "comunicador";

export interface Option {
  value: ProfileType;
  label: string;
}

export interface QuestionAnswers {
  [questionId: number]: {
    options: Option[];
  };
}

export const questionAnswers: QuestionAnswers = {
  1: {
    options: [
      { value: "executor", label: "Tomo decisões rápidas e parto para a ação." },
      { value: "planejador", label: "Crio um plano detalhado antes de começar." },
      { value: "analista", label: "Analiso todas as variáveis e possíveis consequências." },
      { value: "comunicador", label: "Discuto com outras pessoas para encontrar diferentes perspectivas." },
    ],
  },
  2: {
    options: [
      { value: "executor", label: "Foco em resultados e próximos passos concretos." },
      { value: "planejador", label: "Levo uma agenda organizada e cronometro o tempo." },
      { value: "analista", label: "Faço perguntas detalhadas e avalio criticamente as propostas." },
      { value: "comunicador", label: "Facilito a discussão e estimulo a participação de todos." },
    ],
  },
  3: {
    options: [
        { value: "executor", label: "Como posso começar e concluir isso rapidamente." },
        { value: "planejador", label: "Como organizar as etapas e criar um cronograma." },
        { value: "analista", label: "Entender profundamente todos os aspectos e possíveis obstáculos." },
        { value: "comunicador", label: "Como envolver as pessoas certas e criar engajamento." },
    ],
  },
  4: {
    options: [
      { value: "executor", label: "Confio na minha experiência e decido rapidamente." },
      { value: "planejador", label: "Considero os prós e contras de forma sistemática." },
      { value: "analista", label: "Pesquiso extensivamente todas as opções disponíveis." },
      { value: "comunicador", label: "Consulto outras pessoas para obter diferentes pontos de vista." },
    ],
  },
  5: {
    options: [
      { value: "executor", label: "Imediatamente busco soluções práticas para o problema." },
      { value: "planejador", label: "Reviso o plano para identificar onde ocorreu a falha." },
      { value: "analista", label: "Investigo profundamente as causas raiz do problema." },
      { value: "comunicador", label: "Reúno a equipe para discutir soluções colaborativas." },
    ],
  },
  6: {
    options: [
      { value: "executor", label: "Enfrento o problema diretamente e sem rodeios." },
      { value: "planejador", label: "Crio um processo estruturado para resolver a situação." },
      { value: "analista", label: "Avalio imparcialmente todos os lados da questão." },
      { value: "comunicador", label: "Busco entender as emoções envolvidas e mediar o diálogo." },
    ],
  },
  7: {
    options: [
      { value: "executor", label: "Ir direto ao ponto e focar nos resultados práticos." },
      { value: "planejador", label: "Apresentar as etapas de forma organizada e sequencial." },
      { value: "analista", label: "Detalhar todos os aspectos, incluindo possíveis exceções." },
      { value: "comunicador", label: "Usar histórias e exemplos que conectem emocionalmente." },
    ],
  },
  8: {
    options: [
      { value: "executor", label: "Focar na ação imediata para resolver a situação." },
      { value: "planejador", label: "Manter a calma e seguir um processo sistemático." },
      { value: "analista", label: "Analisar cuidadosamente para evitar erros sob pressão." },
      { value: "comunicador", label: "Buscar apoio e trabalhar colaborativamente." },
    ],
  },
  9: {
    options: [
      { value: "executor", label: "Alcançar resultados e superar desafios concretos." },
      { value: "planejador", label: "Criar sistemas eficientes e processos otimizados." },
      { value: "analista", label: "Solucionar problemas complexos que exijam análise profunda." },
      { value: "comunicador", label: "Construir relacionamentos e trabalhar em equipe." },
    ],
  },
  10: {
    options: [
      { value: "executor", label: "Trabalho intensamente para concluir o mais rápido possível." },
      { value: "planejador", label: "Crio cronogramas detalhados com marcos intermediários." },
      { value: "analista", label: "Avalio cuidadosamente quanto tempo cada tarefa realmente necessita." },
      { value: "comunicador", label: "Coordeno com a equipe para garantir que todos cumpram sua parte." },
    ],
  },
  11: {
    options: [
      { value: "executor", label: "Comentários diretos e orientados para resultados." },
      { value: "planejador", label: "Avaliações estruturadas com pontos específicos para melhoria." },
      { value: "analista", label: "Análises detalhadas com evidências e justificativas." },
      { value: "comunicador", label: "Conversas abertas onde posso expressar meus sentimentos." },
    ],
  },
  12: {
    options: [
      { value: "executor", label: "Eficiência, praticidade e resultados rápidos." },
      { value: "planejador", label: "Organização, previsibilidade e processos claros." },
      { value: "analista", label: "Precisão, conhecimento técnico e profundidade." },
      { value: "comunicador", label: "Colaboração, ambiente positivo e boa comunicação." },
    ],
  },
  13: {
    options: [
      { value: "executor", label: "Aprender fazendo, com experiências práticas." },
      { value: "planejador", label: "Seguir um tutorial passo a passo de forma organizada." },
      { value: "analista", label: "Entender os conceitos fundamentais e a teoria por trás." },
      { value: "comunicador", label: "Discutir e trocar ideias em grupo." },
    ],
  },
  14: {
    options: [
      { value: "executor", label: "Ofereço soluções rápidas e práticas." },
      { value: "planejador", label: "Ajudo a organizar o problema em etapas gerenciáveis." },
      { value: "analista", label: "Faço perguntas para entender profundamente a situação." },
      { value: "comunicador", label: "Escuto ativamente e ofereço apoio emocional." },
    ],
  },
  15: {
    options: [
      { value: "executor", label: "Funcional e prático, focado na eficiência." },
      { value: "planejador", label: "Organizado e estruturado, com tudo em seu lugar." },
      { value: "analista", label: "Repleto de informações, livros e recursos de pesquisa." },
      { value: "comunicador", label: "Acolhedor e personalizado, com fotos e lembranças." },
    ],
  },
  16: {
    options: [
      { value: "executor", label: "Impulsionador que mantém o ritmo e cobra resultados." },
      { value: "planejador", label: "Organizador que estrutura o trabalho e acompanha o progresso." },
      { value: "analista", label: "Especialista que fornece análises aprofundadas e soluções técnicas." },
      { value: "comunicador", label: "Facilitador que promove a colaboração e mantém o grupo unido." },
    ],
  },
  17: {
    options: [
      { value: "executor", label: "Encontrar rapidamente uma solução alternativa." },
      { value: "planejador", label: "Revisar o plano e ajustar conforme necessário." },
      { value: "analista", label: "Investigar a fundo para entender exatamente o que aconteceu." },
      { value: "comunicador", label: "Discutir o problema com outras pessoas para obter insights." },
    ],
  },
  18: {
    options: [
      { value: "executor", label: "Confio no meu instinto e experiência prévia." },
      { value: "planejador", label: "Sigo um processo estruturado de tomada de decisão." },
      { value: "analista", label: "Pesquiso extensivamente todas as opções possíveis." },
      { value: "comunicador", label: "Considero como a decisão afetará as pessoas envolvidas." },
    ],
  },
  19: {
    options: [
      { value: "executor", label: "Direto, conciso e focado no essencial." },
      { value: "planejador", label: "Claro, estruturado e metódico." },
      { value: "analista", label: "Preciso, detalhado e cuidadoso com as palavras." },
      { value: "comunicador", label: "Expressivo, envolvente e atento às reações." },
    ],
  },
  20: {
    options: [
      { value: "executor", label: "Discussões longas sem decisões concretas." },
      { value: "planejador", label: "Falta de organização e acompanhamento." },
      { value: "analista", label: "Análises superficiais e conclusões precipitadas." },
      { value: "comunicador", label: "Ambiente tenso e falta de harmonia entre a equipe." },
    ],
  },
};

// Função helper para obter as opções de uma pergunta
export const getOptionsForQuestion = (questionId: number) => {
  if (questionAnswers[questionId]) {
    return questionAnswers[questionId].options;
  }
  // Fallback, caso uma pergunta não tenha opções definidas
  return [];
};