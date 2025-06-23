import React, { useState, useEffect, useMemo } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

// --- ATUALIZAÇÃO DE IMPORTS ---
// Componentes do shadcn/ui e ícones
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowLeft, ArrowRight, Loader2, Send, Terminal, CheckCircle2 } from "lucide-react"

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

  // --- NOVOS ESTADOS PARA O DIALOG ---
  const [showRedirectDialog, setShowRedirectDialog] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const checkStatusAndFetchQuestions = async () => {
     
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem("token") || sessionStorage.getItem("token")
      if (!token) {
        setError("Sessão inválida. Por favor, faça login novamente.")
        setLoading(false)
        navigate("/login")
        return
      }

      try {
        const statusResponse = await axios.get("http://127.0.0.1:8000/api/check-analysis", {
          headers: { Authorization: `Bearer ${token}` },
        })

        // --- LÓGICA MODIFICADA PARA USAR O DIALOG ---
        // 2. Se já respondeu, ativa o estado para mostrar o Dialog
        if (statusResponse.data.hasCompleted) {
          setShowRedirectDialog(true)
          setLoading(false) // Para o loading para não ficar um esqueleto atrás do dialog
          return; // Interrompe a execução para não buscar as perguntas
        }

        // 3. Se não, busca as perguntas do questionário
        const questionsResponse = await axios.get("http://127.0.0.1:8000/api/questions")
        const questionsArray = questionsResponse.data.data
        if (!questionsArray || !Array.isArray(questionsArray)) {
          throw new Error("Formato de dados inesperado do servidor.")
        }
        setQuestions(questionsArray)

      } catch (err: any) {
        console.error("Erro ao verificar status ou buscar perguntas:", err)
        setError(err.response?.data?.message || err.message || "Não foi possível carregar o questionário.")
      } finally {
        setLoading(false)
      }
    }

    checkStatusAndFetchQuestions()
  }, [navigate])

  
  useEffect(() => {
    // Só executa se o dialog estiver visível
    if (showRedirectDialog) {
      // Timer para redirecionar após 5 segundos
      const redirectTimer = setTimeout(() => {
        navigate("/userhomepage");
      }, 5000);

      // Intervalo para atualizar a contagem a cada segundo
      const countdownInterval = setInterval(() => {
        setCountdown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      // Função de limpeza para evitar memory leaks
      return () => {
        clearTimeout(redirectTimer);
        clearInterval(countdownInterval);
      };
    }
  }, [showRedirectDialog, navigate]);
  
 
  const { currentQuestion, progress } = useMemo(() => {
    const question = questions[currentQuestionIndex]
    const progressValue = questions.length > 0 ? ((Object.keys(answers).length) / questions.length) * 100 : 0
    return { currentQuestion: question, progress: progressValue }
  }, [currentQuestionIndex, questions, answers])

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
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
    // Se o dialog estiver ativo, não mostramos o skeleton, mostramos uma página "vazia"
    if (loading || showRedirectDialog) {
      return (
        <div className="p-6 space-y-6 h-96"> {/* Altura fixa para evitar pulos na UI */}
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="space-y-3 pt-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="p-6">
            <Alert variant="destructive"><Terminal className="h-4 w-4" /><AlertTitle>Ocorreu um Erro</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
        </div>
      )
    }
    
    if (!currentQuestion) {
        return <p className="p-6">Questionário indisponível no momento.</p>
    }

    const options = getOptionsForQuestion(currentQuestion.id)

    return (
      <AnimatePresence mode="wait">
        <motion.div key={currentQuestion.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
          <CardHeader><CardTitle className="text-2xl font-semibold tracking-tight">{currentQuestion.text_questions}</CardTitle><CardDescription>Pergunta {currentQuestionIndex + 1} de {questions.length}. Escolha a opção que melhor descreve você.</CardDescription></CardHeader>
          <CardContent>
            <RadioGroup value={answers[currentQuestion.id] || ""} onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)} className="space-y-3">
              {options.map((option) => {
                const isSelected = answers[currentQuestion.id] === option.value
                return (
                  <Label key={option.value} htmlFor={option.value} className="block">
                    <Card className={`cursor-pointer transition-all duration-200 ${isSelected ? "border-primary ring-2 ring-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                      <CardContent className="p-4 flex items-center justify-between"><span className="font-medium">{option.label}</span><RadioGroupItem value={option.value} id={option.value} className="sr-only" /></CardContent>
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

  const allQuestionsAnswered = questions.length > 0 && Object.keys(answers).length === questions.length

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-4">
          <Card className="overflow-hidden">
            {/* A barra de progresso só aparece se o questionário for de fato exibido */}
            {!loading && !error && !showRedirectDialog && questions.length > 0 && (
                <div className="p-2 border-b">
                    <Progress value={progress} className="h-2"/>
                </div>
            )}
            {renderContent()}
          </Card>
          
          {/* Os botões só aparecem se o questionário estiver ativo */}
          {!loading && !error && !showRedirectDialog && questions.length > 0 && (
             <div className="flex justify-between items-center">
                <Button variant="outline" onClick={handlePrev} disabled={currentQuestionIndex === 0 || submitting}><ArrowLeft className="h-4 w-4 mr-2" />Anterior</Button>
                {currentQuestionIndex < questions.length - 1 ? (
                  <Button onClick={handleNext} disabled={!answers[currentQuestion?.id] || submitting}>Próximo<ArrowRight className="h-4 w-4 ml-2" /></Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={!allQuestionsAnswered || submitting}>
                    {submitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enviando...</>) : (<><Send className="mr-2 h-4 w-4" />Finalizar e Ver Análise</>)}
                  </Button>
                )}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* --- JSX DO DIALOG DE REDIRECIONAMENTO --- */}
      <Dialog open={showRedirectDialog}>
        <DialogContent className="sm:max-w-md text-center p-8 bg-white" onInteractOutside={(e) => e.preventDefault()}>
            <DialogHeader className="items-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
                    <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                </motion.div>
                <DialogTitle className="text-2xl">Análise Já Realizada!</DialogTitle>
                <DialogDescription className="pt-2">
                    Nossos registros indicam que você já respondeu a este questionário.
                    Você será redirecionado para seu perfil em <strong>{countdown}</strong> segundos.
                </DialogDescription>
            </DialogHeader>
            <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => navigate('/userhomepage')}
            >
                Ir para o Perfil Agora
            </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BehaviorProfile