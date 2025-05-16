import React, { useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Header from "@/components/layouts/Header"
import Footer from "@/components/layouts/Footer"
import { Link } from "react-router-dom"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"

interface QuestionsProps {
  id: number
  text_questions: string
}

type AnswersProps = {
  [questionId: number]: string
}

// Interface for the backend answer format
interface BackendAnswerFormat {
  id_question: number
  answer_option: string
}

// Define the profile types
type ProfileType = "executor" | "planejador" | "analista" | "comunicador"

// Define the question answers
interface QuestionAnswers {
  [questionId: number]: {
    options: {
      value: ProfileType
      label: string
    }[]
  }
}

const BehaviorProfile = () => {
  const [questions, setQuestions] = React.useState<QuestionsProps[]>([])
  const [answers, setAnswers] = React.useState<AnswersProps>({})
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [submitted, setSubmitted] = React.useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0)
  const [submitting, setSubmitting] = React.useState(false)



  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    setLoading(true)
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/questions")
      const questionsArray = response.data.data

      if (!questionsArray || !Array.isArray(questionsArray)) {
        throw new Error("Formato inesperado das perguntas")
      }

      setQuestions(questionsArray)
    } catch (error) {
      console.error("Error fetching questions:", error)
      setError(error instanceof Error ? error.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const formattedAnswers: BackendAnswerFormat[] = Object.entries(answers).map(([questionId, value]) => ({
        id_question: Number.parseInt(questionId),
        answer_option: value,
      }))

      console.log("Formatted answers for backend:", formattedAnswers)

      await axios.post("http://127.0.0.1:8000/api/responsequestions", {
        answers: formattedAnswers,
      }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })

      setSubmitted(true)
    } catch (error) {
      console.error("Error submitting answers:", error)
      setError(error instanceof Error ? error.message : "Erro ao enviar respostas")
    } finally {
      setSubmitting(false)
    }
  }

  // Define the question-specific answers
  const questionAnswers: QuestionAnswers = {
1: {
    options: [
      { value: "executor", label: "Tomo decisões rápidas e parto para a ação (Executor)" },
      { value: "planejador", label: "Crio um plano detalhado antes de começar (Planejador)" },
      { value: "analista", label: "Analiso todas as variáveis e possíveis consequências (Analista)" },
      { value: "comunicador", label: "Discuto com outras pessoas para encontrar diferentes perspectivas (Comunicador)" },
    ],
  },
  2: {
    options: [
      { value: "executor", label: "Foco em resultados e próximos passos concretos (Executor)" },
      { value: "planejador", label: "Levo uma agenda organizada e cronometro o tempo (Planejador)" },
      { value: "analista", label: "Faço perguntas detalhadas e avalio criticamente as propostas (Analista)" },
      { value: "comunicador", label: "Facilito a discussão e estimulo a participação de todos (Comunicador)" },
    ],
  },
  3: {
    options: [
      { value: "executor", label: "Como posso começar e concluir isso rapidamente (Executor)" },
      { value: "planejador", label: "Como organizar as etapas e criar um cronograma (Planejador)" },
      { value: "analista", label: "Entender profundamente todos os aspectos e possíveis obstáculos (Analista)" },
      { value: "comunicador", label: "Como envolver as pessoas certas e criar engajamento (Comunicador)" },
    ],
  },
  4: {
    options: [
      { value: "executor", label: "Confio na minha experiência e decido rapidamente (Executor)" },
      { value: "planejador", label: "Considero os prós e contras de forma sistemática (Planejador)" },
      { value: "analista", label: "Pesquiso extensivamente todas as opções disponíveis (Analista)" },
      { value: "comunicador", label: "Consulto outras pessoas para obter diferentes pontos de vista (Comunicador)" },
    ],
  },
  5: {
    options: [
      { value: "executor", label: "Imediatamente busco soluções práticas para o problema (Executor)" },
      { value: "planejador", label: "Reviso o plano para identificar onde ocorreu a falha (Planejador)" },
      { value: "analista", label: "Investigo profundamente as causas raiz do problema (Analista)" },
      { value: "comunicador", label: "Reúno a equipe para discutir soluções colaborativas (Comunicador)" },
    ],
  },
  6: {
    options: [
      { value: "executor", label: "Enfrento o problema diretamente e sem rodeios (Executor)" },
      { value: "planejador", label: "Crio um processo estruturado para resolver a situação (Planejador)" },
      { value: "analista", label: "Avalio imparcialmente todos os lados da questão (Analista)" },
      { value: "comunicador", label: "Busco entender as emoções envolvidas e mediar o diálogo (Comunicador)" },
    ],
  },
  7: {
    options: [
      { value: "executor", label: "Ir direto ao ponto e focar nos resultados práticos (Executor)" },
      { value: "planejador", label: "Apresentar as etapas de forma organizada e sequencial (Planejador)" },
      { value: "analista", label: "Detalhar todos os aspectos, incluindo possíveis exceções (Analista)" },
      { value: "comunicador", label: "Usar histórias e exemplos que conectem emocionalmente (Comunicador)" },
    ],
  },
  8: {
    options: [
      { value: "executor", label: "Focar na ação imediata para resolver a situação (Executor)" },
      { value: "planejador", label: "Manter a calma e seguir um processo sistemático (Planejador)" },
      { value: "analista", label: "Analisar cuidadosamente para evitar erros sob pressão (Analista)" },
      { value: "comunicador", label: "Buscar apoio e trabalhar colaborativamente (Comunicador)" },
    ],
  },
  9: {
    options: [
      { value: "executor", label: "Alcançar resultados e superar desafios concretos (Executor)" },
      { value: "planejador", label: "Criar sistemas eficientes e processos otimizados (Planejador)" },
      { value: "analista", label: "Solucionar problemas complexos que exijam análise profunda (Analista)" },
      { value: "comunicador", label: "Construir relacionamentos e trabalhar em equipe (Comunicador)" },
    ],
  },
  10: {
    options: [
      { value: "executor", label: "Trabalho intensamente para concluir o mais rápido possível (Executor)" },
      { value: "planejador", label: "Crio cronogramas detalhados com marcos intermediários (Planejador)" },
      { value: "analista", label: "Avalio cuidadosamente quanto tempo cada tarefa realmente necessita (Analista)" },
      { value: "comunicador", label: "Coordeno com a equipe para garantir que todos cumpram sua parte (Comunicador)" },
    ],
  },
  11: {
    options: [
      { value: "executor", label: "Comentários diretos e orientados para resultados (Executor)" },
      { value: "planejador", label: "Avaliações estruturadas com pontos específicos para melhoria (Planejador)" },
      { value: "analista", label: "Análises detalhadas com evidências e justificativas (Analista)" },
      { value: "comunicador", label: "Conversas abertas onde posso expressar meus sentimentos (Comunicador)" },
    ],
  },
  12: {
    options: [
      { value: "executor", label: "Eficiência, praticidade e resultados rápidos (Executor)" },
      { value: "planejador", label: "Organização, previsibilidade e processos claros (Planejador)" },
      { value: "analista", label: "Precisão, conhecimento técnico e profundidade (Analista)" },
      { value: "comunicador", label: "Colaboração, ambiente positivo e boa comunicação (Comunicador)" },
    ],
  },
  13: {
    options: [
      { value: "executor", label: "Aprender fazendo, com experiências práticas (Executor)" },
      { value: "planejador", label: "Seguir um tutorial passo a passo de forma organizada (Planejador)" },
      { value: "analista", label: "Entender os conceitos fundamentais e a teoria por trás (Analista)" },
      { value: "comunicador", label: "Discutir e trocar ideias em grupo (Comunicador)" },
    ],
  },
  14: {
    options: [
      { value: "executor", label: "Ofereço soluções rápidas e práticas (Executor)" },
      { value: "planejador", label: "Ajudo a organizar o problema em etapas gerenciáveis (Planejador)" },
      { value: "analista", label: "Faço perguntas para entender profundamente a situação (Analista)" },
      { value: "comunicador", label: "Escuto ativamente e ofereço apoio emocional (Comunicador)" },
    ],
  },
  15: {
    options: [
      { value: "executor", label: "Funcional e prático, focado na eficiência (Executor)" },
      { value: "planejador", label: "Organizado e estruturado, com tudo em seu lugar (Planejador)" },
      { value: "analista", label: "Repleto de informações, livros e recursos de pesquisa (Analista)" },
      { value: "comunicador", label: "Acolhedor e personalizado, com fotos e lembranças (Comunicador)" },
    ],
  },
  16: {
    options: [
      { value: "executor", label: "Impulsionador que mantém o ritmo e cobra resultados (Executor)" },
      { value: "planejador", label: "Organizador que estrutura o trabalho e acompanha o progresso (Planejador)" },
      { value: "analista", label: "Especialista que fornece análises aprofundadas e soluções técnicas (Analista)" },
      { value: "comunicador", label: "Facilitador que promove a colaboração e mantém o grupo unido (Comunicador)" },
    ],
  },
  17: {
    options: [
      { value: "executor", label: "Encontrar rapidamente uma solução alternativa (Executor)" },
      { value: "planejador", label: "Revisar o plano e ajustar conforme necessário (Planejador)" },
      { value: "analista", label: "Investigar a fundo para entender exatamente o que aconteceu (Analista)" },
      { value: "comunicador", label: "Discutir o problema com outras pessoas para obter insights (Comunicador)" },
    ],
  },
  18: {
    options: [
      { value: "executor", label: "Confio no meu instinto e experiência prévia (Executor)" },
      { value: "planejador", label: "Sigo um processo estruturado de tomada de decisão (Planejador)" },
      { value: "analista", label: "Pesquiso extensivamente todas as opções possíveis (Analista)" },
      { value: "comunicador", label: "Considero como a decisão afetará as pessoas envolvidas (Comunicador)" },
    ],
  },
  19: {
    options: [
      { value: "executor", label: "Direto, conciso e focado no essencial (Executor)" },
      { value: "planejador", label: "Claro, estruturado e metódico (Planejador)" },
      { value: "analista", label: "Preciso, detalhado e cuidadoso com as palavras (Analista)" },
      { value: "comunicador", label: "Expressivo, envolvente e atento às reações (Comunicador)" },
    ],
  },
  20: {
    options: [
      { value: "executor", label: "Discussões longas sem decisões concretas (Executor)" },
      { value: "planejador", label: "Falta de organização e acompanhamento (Planejador)" },
      { value: "analista", label: "Análises superficiais e conclusões precipitadas (Analista)" },
      { value: "comunicador", label: "Ambiente tenso e falta de harmonia entre a equipe (Comunicador)" },
    ],
  },
  }

  // Get options for the current question
  const getOptionsForQuestion = (questionId: number) => {
    // If we have specific options for this question, use them
    if (questionAnswers[questionId]) {
      return questionAnswers[questionId].options
    }

    // Default options if no specific options are defined
    return [
      { value: "executor", label: "Executor" },
      { value: "planejador", label: "Planejador" },
      { value: "analista", label: "Analista" },
      { value: "comunicador", label: "Comunicador" },
    ]
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Perfil Comportamental</h1>
            <p className="text-gray-600">
              Responda às perguntas abaixo para descobrir seu perfil comportamental. Suas respostas nos ajudarão a
              entender melhor suas características e preferências.
            </p>
          </div>

          {/* Progress indicator */}
          {!loading && !error && !submitted && questions.length > 0 && (
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="text-right text-sm text-gray-500 mt-1">
                Pergunta {currentQuestionIndex + 1} de {questions.length}
              </p>
            </div>
          )}

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="w-full">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((j) => (
                        <Skeleton key={j} className="h-10 w-full" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="w-full bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Erro ao carregar perguntas</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{error}</p>
                <Button variant="outline" className="mt-4" onClick={fetchQuestions}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Tentar novamente
                </Button>
              </CardContent>
            </Card>
          ) : submitted ? (
            <Card className="w-full bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-600 flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5" /> Perfil Enviado com Sucesso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Obrigado por completar o questionário de perfil comportamental. Suas respostas foram registradas.
                </p>

                <div className="space-y-4">
                  {questions.map((question) => {
                    const options = getOptionsForQuestion(question.id)
                    const selectedOption = options.find((opt) => opt.value === answers[question.id])

                    return (
                      <div key={question.id} className="border p-4 rounded bg-white">
                        <p className="font-semibold">{question.text_questions}</p>
                        <p className="text-gray-700">Resposta: {selectedOption?.label || "Não respondida"}</p>
                        <p className="text-sm text-gray-500">
                          Perfil:{" "}
                          {answers[question.id]
                            ? answers[question.id].charAt(0).toUpperCase() + answers[question.id].slice(1)
                            : ""}
                        </p>
                      </div>
                    )
                  })}
                </div>

                <Button asChild className="mt-6">
                  <Link to="/dashboard">Voltar ao Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {questions.length > 0 && currentQuestion && (
                <div className="space-y-6 mb-8">
                  <Card key={currentQuestion.id} className="w-full">
                    <CardHeader>
                      <CardTitle className="text-xl font-medium">
                        {currentQuestion.id}. {currentQuestion.text_questions}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup
                        value={answers[currentQuestion.id] || ""}
                        onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                        className="space-y-3"
                      >
                        {getOptionsForQuestion(currentQuestion.id).map((option) => {
                          const isSelected = answers[currentQuestion.id] === option.value
                          return (
                            <div
                              key={option.value}
                              className={`flex items-center justify-between space-x-2 rounded-md border p-3 hover:bg-gray-50 ${
                                isSelected ? "border-blue-500 bg-blue-50" : ""
                              }`}
                            >
                              <div className="flex items-center">
                                <RadioGroupItem value={option.value} id={`${currentQuestion.id}-${option.value}`} />
                                <Label
                                  htmlFor={`${currentQuestion.id}-${option.value}`}
                                  className="ml-2 flex-1 cursor-pointer"
                                >
                                  {option.label}
                                </Label>
                              </div>
                              {isSelected && <Check className="h-5 w-5 text-blue-600" />}
                            </div>
                          )
                        })}
                      </RadioGroup>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
                      disabled={currentQuestionIndex === 0}
                    >
                      Anterior
                    </Button>

                    {currentQuestionIndex < questions.length - 1 ? (
                      <Button
                        onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                        disabled={!answers[currentQuestion.id]}
                      >
                        Próximo
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        disabled={Object.keys(answers).length !== questions.length || submitting}
                      >
                        {submitting ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Enviando...
                          </>
                        ) : (
                          "Enviar Respostas"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default BehaviorProfile
