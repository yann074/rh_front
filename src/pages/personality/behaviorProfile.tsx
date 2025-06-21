import React, { useState, useEffect, useMemo } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

// Componentes do shadcn/ui e ícones
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, ArrowRight, Loader2, Send, Terminal } from "lucide-react"

// Layouts e dados
import Header from "@/components/layouts/Header"
import Footer from "@/components/layouts/Footer"
import { getOptionsForQuestion } from "@/data/behavioralQuestionsData"

// Tipos
interface QuestionsProps {
  id: number
  text_questions: string
}

interface AnswersProps {
  [questionId: number]: string
}

interface BackendAnswerFormat {
  id_question: number
  answer_option: string
}

const BehaviorProfile = () => {
  const [questions, setQuestions] = useState<QuestionsProps[]>([])
  const [answers, setAnswers] = useState<AnswersProps>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/questions")
        const questionsArray = response.data.data
        if (!questionsArray || !Array.isArray(questionsArray)) {
          throw new Error("Formato de dados inesperado do servidor.")
        }
        setQuestions(questionsArray)
      } catch (err: any) {
        console.error("Erro ao buscar perguntas:", err)
        setError(err.response?.data?.message || err.message || "Não foi possível carregar o questionário.")
      } finally {
        setLoading(false)
      }
    }
    fetchQuestions()
  }, [])
  
  // Memoiza a pergunta atual e o progresso para evitar recálculos desnecessários
  const { currentQuestion, progress } = useMemo(() => {
    const question = questions[currentQuestionIndex]
    const progressValue = questions.length > 0 ? ((Object.keys(answers).length) / questions.length) * 100 : 0
    return { currentQuestion: question, progress: progressValue }
  }, [currentQuestionIndex, questions, answers])

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
    // Avança automaticamente para a próxima pergunta após 300ms
    setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    }, 300)
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Sessão inválida. Por favor, faça login novamente.")
      }

      const formattedAnswers: BackendAnswerFormat[] = Object.entries(answers).map(
        ([questionId, value]) => ({
          id_question: Number.parseInt(questionId),
          answer_option: value,
        })
      )

      await axios.post(
        "http://127.0.0.1:8000/api/responsequestions",
        { answers: formattedAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      navigate("/resultbehaviorprofile")

    } catch (err: any) {
      console.error("Erro ao enviar respostas:", err)
      setError(err.response?.data?.message || err.message || "Ocorreu um erro ao enviar suas respostas.")
    } finally {
      setSubmitting(false)
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="space-y-3 pt-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Ocorreu um Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )
    }
    
    if (!currentQuestion) {
        return <p>Questionário concluído ou indisponível.</p>
    }

    const options = getOptionsForQuestion(currentQuestion.id)

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              {currentQuestion.text_questions}
            </CardTitle>
            <CardDescription>
              Pergunta {currentQuestionIndex + 1} de {questions.length}. Escolha a opção que melhor descreve você.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[currentQuestion.id] || ""}
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
              className="space-y-3"
            >
              {options.map((option) => {
                const isSelected = answers[currentQuestion.id] === option.value
                return (
                  <Label key={option.value} htmlFor={option.value} className="block">
                    <Card
                      className={`cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-primary ring-2 ring-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <span className="font-medium">{option.label}</span>
                        <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                      </CardContent>
                    </Card>
                  </Label>
                )
              })}
            </RadioGroup>
          </CardContent>
        </motion.div>
      </AnimatePresence>
    )
  }

  const allQuestionsAnswered = Object.keys(answers).length === questions.length

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-4">
          <Card className="overflow-hidden">
            <div className="p-2 border-b">
                <Progress value={progress} className="h-2"/>
            </div>
            {renderContent()}
          </Card>
          
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={handlePrev} disabled={currentQuestionIndex === 0 || submitting}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
            
            {currentQuestionIndex < questions.length - 1 ? (
              <Button onClick={handleNext} disabled={!answers[currentQuestion.id] || submitting}>
                Próximo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!allQuestionsAnswered || submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Finalizar e Ver Análise
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default BehaviorProfile