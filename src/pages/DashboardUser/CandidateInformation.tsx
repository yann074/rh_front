import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  Loader2,
  User,
  Save,
  CheckCircle,
  Briefcase,
  Camera,
  Phone,
  Mail,
  Calendar,
  Linkedin,
  Award,
  Heart,
  Home,
  FileText,
  MapPin,
  DollarSign,
  Car,
  Instagram,
  Facebook,
} from "lucide-react"

// Definition of types
interface UserData {
  id?: number
  email: string
  name: string
  role?: string
  created_at?: string
}

interface CandidatoData {
  user_id?: number
  secondary_email: string
  cpf: string
  phone: string
  birth_date: string
  linkedin: string
  pcd: boolean
  photo: File | null
  photoPreview: string
  resume?: File | null
  resumeName?: string
  sex: string
  sexual_orientation: string
  race: string
  gender: string
  expected_salary?: string
  has_driver_license?: boolean
  driver_license_category?: string
  instagram_link?: string
  facebook_link?: string
  zip_code?: string
  state?: string
  city?: string
  neighborhood?: string
  street?: string
  number?: string
  complement?: string
}

// Add this function before the CandidateInformation component
const formatSocialMediaUrl = (url: string | undefined, domain: string): string | null => {
  if (!url || url.trim() === "") return null

  // If it already has http:// or https://, return as is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }

  // If it has www. but no protocol, add https://
  if (url.startsWith("www.")) {
    return `https://${url}`
  }

  // If it starts with the domain name, add https://
  if (url.includes(domain)) {
    return `https://${url}`
  }

  // Otherwise, assume it's a username or path and construct the full URL
  return `https://www.${domain}/${url.replace(/^\/+/, "")}`
}

const CandidateInformation: React.FC = () => {
  
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("pessoal")

  const [sexUser, setSexUser] = useState<string[]>([])
  const [gender, setGender] = useState<string[]>([])
  const [orientation, setOrientation] = useState<string[]>([])
  const [color, setColor] = useState<string[]>([])

  const [userData, setUserData] = useState<UserData>({
    email: "",
    name: "",
  })
  const [candidatoData, setCandidatoData] = useState<CandidatoData>({
    secondary_email: "",
    cpf: "",
    phone: "",
    birth_date: "",
    linkedin: "",
    pcd: false,
    photo: null,
    photoPreview: "",
    resume: null,
    resumeName: "",
    sex: "",
    sexual_orientation: "",
    race: "",
    gender: "",
    expected_salary: "",
    has_driver_license: false,
    driver_license_category: "",
    instagram_link: "",
    facebook_link: "",
    zip_code: "",
    state: "",
    city: "",
    neighborhood: "",
    street: "",
    number: "",
    complement: "",
  })

  // Add validation helpers and state for form errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const errors: Record<string, string> = {}

    // Validate social media URLs
    if (
      candidatoData.instagram_link &&
      !isValidUrl(formatSocialMediaUrl(candidatoData.instagram_link, "instagram.com"))
    ) {
      errors.instagram_link = "Por favor, insira um link válido do Instagram"
    }

    if (candidatoData.facebook_link && !isValidUrl(formatSocialMediaUrl(candidatoData.facebook_link, "facebook.com"))) {
      errors.facebook_link = "Por favor, insira um link válido do Facebook"
    }

    // Validate expected salary is a number
    if (candidatoData.expected_salary && !/^R?\$?\s*\d+(?:[.,]\d{1,2})?$/.test(candidatoData.expected_salary)) {
      errors.expected_salary = "Por favor, insira um valor numérico válido"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const isValidUrl = (url: string | null): boolean => {
    if (!url) return true // Empty URLs are considered valid (they're optional)
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

  // Calcular o progresso do perfil
  const calculateProfileProgress = () => {
    let personalProgress = 0
    let diversityProgress = 0
    let locationProgress = 0

    // Verificar campos pessoais
    const personalFields = ["secondary_email", "cpf", "phone", "birth_date", "linkedin", "photoPreview"]
    personalFields.forEach((field) => {
      if (candidatoData[field as keyof CandidatoData]) personalProgress++
    })
    personalProgress = Math.round((personalProgress / personalFields.length) * 100)

    // Verificar campos de diversidade
    const diversityFields = ["sex", "sexual_orientation", "race", "gender"]
    diversityFields.forEach((field) => {
      if (candidatoData[field as keyof CandidatoData]) diversityProgress++
    })
    diversityProgress = Math.round((diversityProgress / diversityFields.length) * 100)

    // Verificar campos de localização
    const locationFields = ["zip_code", "state", "city", "neighborhood", "street", "number"]
    locationFields.forEach((field) => {
      if (candidatoData[field as keyof CandidatoData]) locationProgress++
    })
    locationProgress = Math.round((locationProgress / locationFields.length) * 100)

    return { personalProgress, diversityProgress, locationProgress }
  }

  const { personalProgress, diversityProgress, locationProgress } = calculateProfileProgress()
  const totalProgress = Math.round((personalProgress + diversityProgress + locationProgress) / 3)

  // token from storage
  const token = localStorage.getItem("token") || sessionStorage.getItem("token")

  useEffect(() => {
    // User autenticado
    if (!token) {
      Swal.fire({
        title: "Erro!",
        text: "Você precisa estar logado para acessar esta página.",
        icon: "error",
        confirmButtonText: "OK",
        background: "#ffffff",
        confirmButtonColor: "#6d28d9",
      }).then(() => {
        // Redirect to login page
        window.location.href = "/login"
      })
      return
    }

    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const userProfileResponse = await axios.get("http://127.0.0.1:8000/api/user-data", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      //SEMPRE GUARDAR NO LOCALSTORAGE, NAO APAGA ESSE COMENTARIO
      //CONSEGUI PORRA

      console.log("Usuário autenticado:", userProfileResponse.data.user)
      console.log("Token usado:", localStorage.getItem("token"))

      const user = userProfileResponse.data.data.user
      const candidate = userProfileResponse.data.data.candidate
      const address = userProfileResponse.data.data.address

      setUserData({
        name: user.name,
        email: user.email,
      })

      

      setCandidatoData({
        secondary_email: candidate?.secondary_email || "",
        cpf: candidate?.cpf || "",
        phone: candidate?.phone || "",
        birth_date: candidate?.birth_date?.split("T")[0] || "",
        linkedin: candidate?.linkedin || "",
        pcd: candidate?.pcd || false,
        photo: null,
        photoPreview: candidate?.photo || "",
        resume: null,
        resumeName: candidate?.resume?.split("/").pop() || "",
        sex: candidate?.sex || "",
        sexual_orientation: candidate?.sexual_orientation || "",
        race: candidate?.race || "",
        gender: candidate?.gender || "",
        expected_salary: address?.expected_salary || "",
        has_driver_license: Boolean(address?.has_driver_license),
        driver_license_category: address?.driver_license_category || "",
        instagram_link: address?.instagram_link || "",
        facebook_link: address?.facebook_link || "",
        zip_code: address?.zip_code || "",
        state: address?.state || "",
        city: address?.city || "",
        neighborhood: address?.neighborhood || "",
        street: address?.street || "",
        number: address?.number || "",
        complement: address?.complement || "",
      })

      // Passo 3: Buscar enums
      const sexUserResponse = await axios.get("http://127.0.0.1:8000/api/enums/sex-user")

      const sexUserData = sexUserResponse.data.data
      setSexUser(sexUserData.sexo)
      setGender(sexUserData.gender)
      setOrientation(sexUserData.orient)
      setColor(sexUserData.color)

      setLoading(false)
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error)
      Swal.fire({
        title: "Aviso",
        text: "Não foi possível obter suas informações. Por favor, tente novamente mais tarde.",
        icon: "warning",
        confirmButtonText: "OK",
        background: "#ffffff",
        confirmButtonColor: "#6d28d9",
      })
      setLoading(false)
    }
  }

  // Removed checkExistingCandidatoData function entirely

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target
    setCandidatoData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean, field: keyof CandidatoData): void => {
    setCandidatoData((prev) => ({ ...prev, [field]: checked }))
  }

  const handleSelectChange = (value: string, field: keyof CandidatoData): void => {
    setCandidatoData((prev) => ({ ...prev, [field]: value }))
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL for display
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const result = reader.result as string;
        // Update state with both photo and photoPreview in one go
        setCandidatoData((prev) => ({
          ...prev,
          photo: file, // Store the file object for form submission
          photoPreview: result, // Store the preview URL for display
        }));
      };
      
      reader.readAsDataURL(file);
    }
  };
  

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setCandidatoData((prev) => ({
        ...prev,
        resume: file,
        resumeName: file.name,
      }))
    } else if (file) {
      Swal.fire({
        title: "Formato inválido",
        text: "Por favor, selecione apenas arquivos PDF.",
        icon: "error",
        confirmButtonText: "OK",
        background: "#ffffff",
        confirmButtonColor: "#6d28d9",
      })
    }
  }

  const fetchAddressByCep = async (cep: string): Promise<void> => {
    if (!cep || cep.length !== 9) return

    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep.replace("-", "")}/json/`)
      if (!response.data.erro) {
        setCandidatoData((prev) => ({
          ...prev,
          street: response.data.logradouro,
          neighborhood: response.data.bairro,
          city: response.data.localidade,
          state: response.data.uf,
        }))
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error)
      Swal.fire({
        title: "Erro!",
        text: "Não foi possível encontrar o endereço para o CEP informado.",
        icon: "error",
        confirmButtonText: "OK",
        background: "#ffffff",
        confirmButtonColor: "#6d28d9",
      })
    }
  }

  // Helper function to format social media URLs

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    // Validate form before submission
    if (!validateForm()) {
      Swal.fire({
        title: "Erro de validação",
        text: "Por favor, corrija os erros no formulário antes de enviar.",
        icon: "error",
        confirmButtonText: "OK",
        background: "#ffffff",
        confirmButtonColor: "#6d28d9",
      })
      return
    }

    try {
      setSaving(true)
      console.log("Iniciando envio de dados...")

      // Step 1: Send candidate data with files to /user-data endpoint
      const candidateFormData = new FormData()

      // Add candidate personal info
      candidateFormData.append("secondary_email", candidatoData.secondary_email)
      candidateFormData.append("cpf", candidatoData.cpf)
      candidateFormData.append("phone", candidatoData.phone)
      candidateFormData.append("birth_date", candidatoData.birth_date)
      candidateFormData.append("linkedin", candidatoData.linkedin)
      candidateFormData.append("pcd", candidatoData.pcd ? "1" : "0")
      candidateFormData.append("sex", candidatoData.sex)
      candidateFormData.append("sexual_orientation", candidatoData.sexual_orientation)
      candidateFormData.append("race", candidatoData.race)
      candidateFormData.append("gender", candidatoData.gender)

      // Add files
      if (candidatoData.photo) {
        candidateFormData.append("photo", candidatoData.photo)
      }

      if (candidatoData.resume) {
        candidateFormData.append("resume", candidatoData.resume)
      }

      console.log("Enviando dados do candidato para a API...")
      const candidateResponse = await axios({
        method: "post",
        url: "http://127.0.0.1:8000/api/user-data", // Correct endpoint with hyphen
        data: candidateFormData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Resposta da API (dados do candidato):", candidateResponse.data)

      // Step 2: Send additional personal data to /personal-data endpoint
      const personalData = {
        // Address info
        zip_code: candidatoData.zip_code,
        state: candidatoData.state,
        city: candidatoData.city,
        neighborhood: candidatoData.neighborhood,
        street: candidatoData.street,
        number: candidatoData.number,
        complement: candidatoData.complement,

        // Professional info
        expected_salary: candidatoData.expected_salary
          ? Number.parseFloat(candidatoData.expected_salary.replace(/[^\d,]/g, "").replace(",", "."))
          : null,
        has_driver_license: candidatoData.has_driver_license ? 1 : 0,
        driver_license_category: candidatoData.driver_license_category || "",

        // Social media - ensure they are valid URLs
        instagram_link: formatSocialMediaUrl(candidatoData.instagram_link, "instagram.com"),
        facebook_link: formatSocialMediaUrl(candidatoData.facebook_link, "facebook.com"),
      }

      console.log("Enviando dados pessoais para a API...")
      const personalDataResponse = await axios.post("http://127.0.0.1:8000/api/personal-data", personalData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("Resposta da API (dados pessoais):", personalDataResponse.data)

      Swal.fire({
        title: "Sucesso!",
        text: "Seus dados foram salvos com sucesso.",
        icon: "success",
        confirmButtonText: "OK",
        background: "#ffffff",
        confirmButtonColor: "#6d28d9",
      })
    } catch (error: any) {
      console.error("Erro ao salvar dados:", error)

      let errorMessage = "Não foi possível salvar seus dados. Por favor, tente novamente."

      if (error.response) {
        console.error("Resposta de erro:", error.response.data)
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message
        }
      }

      Swal.fire({
        title: "Erro!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
        background: "#ffffff",
        confirmButtonColor: "#6d28d9",
      })
    } finally {
      setSaving(false)
    }
  }

  // Define license categories and states
  const licenseCategories = ["A", "B", "C", "D", "E", "AB", "AC", "AD", "AE"]
  const states = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ]

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="p-8 rounded-xl shadow-lg bg-white border-l-4 border-indigo-600 w-full max-w-md">
          <Loader2 className="h-16 w-16 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-6 text-xl text-center text-slate-700 font-medium">Carregando seu perfil...</p>
          <p className="mt-2 text-sm text-center text-slate-500">Estamos preparando tudo para você</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-600 text-white p-2 rounded-lg">
                <Briefcase className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-slate-800">Candidato Talento</span>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50">
                <Home className="h-5 w-5 mr-2" />
                Dashboard
              </Button>

              <div className="flex items-center space-x-3">
                <span className="text-sm text-slate-600 hidden md:inline-block">Olá, {userData.name || "Usuário"}</span>
                <Avatar className="h-9 w-9 border border-slate-200">
                  {candidatoData.photoPreview ? (
                    <AvatarImage src={candidatoData.photoPreview || "/placeholder.svg"} alt="photo de perfil" />
                  ) : (
                    <AvatarFallback className="bg-indigo-100 text-indigo-600">
                      {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-indigo-700 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Meu Perfil</h1>
              <p className="mt-2 text-indigo-200 max-w-xl">
                Complete suas informações para aumentar suas chances nas oportunidades de emprego e se destacar para os
                recrutadores.
              </p>
            </div>

            <div className="mt-6 md:mt-0">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="relative h-16 w-16">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(#4f46e5 ${totalProgress}%, transparent ${totalProgress}%)`,
                      }}
                    ></div>
                    <div className="absolute inset-1 bg-indigo-700 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{totalProgress}%</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-white">Completando seu perfil</h3>
                    <p className="text-indigo-200 text-sm">Perfis completos recebem 3x mais oportunidades</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Profile Card */}
            <Card className="overflow-hidden border-none shadow-md rounded-xl">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32 relative">
                {candidatoData.pcd && (
                  <Badge className="absolute top-4 right-4 bg-white text-indigo-700 hover:bg-indigo-50">
                    <Award className="h-3 w-3 mr-1" />
                    PCD
                  </Badge>
                )}
              </div>

              <div className="px-6 pt-0 pb-6">
                <div className="relative -mt-16 mb-4 flex justify-center">
                  <div className="relative">
                    <Avatar className="h-32 w-32 ring-4 ring-white shadow-md">
                      {candidatoData.photoPreview ? (
                        <AvatarImage src={candidatoData.photoPreview || "/placeholder.svg"} alt="photo de perfil" />
                      ) : (
                        <AvatarFallback className="bg-indigo-100 text-indigo-800">
                          <User className="h-12 w-12" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full bg-indigo-600 hover:bg-indigo-700 h-10 w-10 p-0 shadow-md"
                      onClick={() => document.getElementById("photo-upload")?.click()}
                    >
                      <Camera className="h-5 w-5" />
                      <input
                        id="photo-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">{userData.name || "Usuário"}</h2>
                  <p className="text-slate-500 flex items-center justify-center mt-1">
                    <Mail className="h-4 w-4 mr-2" />
                    {userData.email}
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="text-slate-600 flex items-center text-sm">
                      <Linkedin className="h-4 w-4 mr-2 text-indigo-500" />
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      name="linkedin"
                      placeholder="www.linkedin.com/in/seuperfil"
                      value={candidatoData.linkedin}
                      onChange={handleInputChange}
                      className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resume" className="text-slate-600 flex items-center text-sm">
                      <FileText className="h-4 w-4 mr-2 text-indigo-500" />
                      Currículo (PDF)
                    </Label>
                    <div className="mt-1">
                      <Input
                        id="resume"
                        type="file"
                        accept="application/pdf"
                        onChange={handleResumeChange}
                        className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      {candidatoData.resumeName && (
                        <div className="mt-2 flex items-center text-sm text-slate-600">
                          <FileText className="h-4 w-4 mr-2 text-indigo-500" />
                          {candidatoData.resumeName}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-indigo-50 p-4 rounded-lg">
                    <Label htmlFor="pcd" className="flex items-center text-slate-700 font-medium">
                      <Award className="h-5 w-5 mr-2 text-indigo-600" />
                      Pessoa com deficiência
                    </Label>
                    <Switch
                      id="pcd"
                      checked={candidatoData.pcd}
                      onCheckedChange={(checked) => handleSwitchChange(checked, "pcd")}
                      className="data-[state=checked]:bg-indigo-600"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Profile Progress */}
            <Card className="border-none shadow-md rounded-xl">
              <CardHeader className="pb-2 border-b border-slate-100">
                <CardTitle className="text-lg text-slate-800">Progresso do Perfil</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-600 font-medium">Dados Pessoais</span>
                      <span className="text-sm text-indigo-600 font-medium">{personalProgress}%</span>
                    </div>
                  </div>
                  <Progress value={personalProgress} className="h-2 bg-slate-100" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-600 font-medium">Diversidade</span>
                    <span className="text-sm text-indigo-600 font-medium">{diversityProgress}%</span>
                  </div>
                  <Progress value={diversityProgress} className="h-2 bg-slate-100" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-600 font-medium">Localização</span>
                    <span className="text-sm text-indigo-600 font-medium">{locationProgress}%</span>
                  </div>
                  <Progress value={locationProgress} className="h-2 bg-slate-100" />
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-amber-800">
                        Perfis completos têm 3x mais chances de serem descobertos por recrutadores.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            <Card className="border-none shadow-md rounded-xl">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <CardHeader className="border-b border-slate-100 bg-white rounded-t-xl">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <CardTitle className="text-xl text-slate-800">Editar Informações</CardTitle>

                    <div className="mt-4 md:mt-0">
                      <TabsList className="grid grid-cols-3 bg-slate-100 p-1">
                        <TabsTrigger
                          value="pessoal"
                          className="font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
                        >
                          Dados Pessoais
                        </TabsTrigger>
                        <TabsTrigger
                          value="diversidade"
                          className="font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
                        >
                          Diversidade
                        </TabsTrigger>
                        <TabsTrigger
                          value="localizacao"
                          className="font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
                        >
                          Localização
                        </TabsTrigger>
                      </TabsList>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit}>
                    <TabsContent value="pessoal" className="mt-0 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="secondary_email" className="flex items-center text-slate-700">
                            <Mail className="h-4 w-4 mr-2 text-indigo-500" />
                            Email Secundário
                          </Label>
                          <Input
                            id="secondary_email"
                            name="secondary_email"
                            type="email"
                            placeholder="email@exemplo.com"
                            value={candidatoData.secondary_email}
                            onChange={handleInputChange}
                            className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cpf" className="flex items-center text-slate-700">
                            <CheckCircle className="h-4 w-4 mr-2 text-indigo-500" />
                            CPF
                          </Label>
                          <Input
                            id="cpf"
                            name="cpf"
                            placeholder="000.000.000-00"
                            value={candidatoData.cpf}
                            onChange={handleInputChange}
                            className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="flex items-center text-slate-700">
                            <Phone className="h-4 w-4 mr-2 text-indigo-500" />
                            Telefone
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="(00) 00000-0000"
                            value={candidatoData.phone}
                            onChange={handleInputChange}
                            className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="birth_date" className="flex items-center text-slate-700">
                            <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                            Data de Nascimento
                          </Label>
                          <Input
                            id="birth_date"
                            name="birth_date"
                            type="date"
                            value={candidatoData.birth_date}
                            onChange={handleInputChange}
                            className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="expected_salary" className="flex items-center text-slate-700">
                            <DollarSign className="h-4 w-4 mr-2 text-indigo-500" />
                            Pretensão Salarial
                          </Label>
                          <Input
                            id="expected_salary"
                            name="expected_salary"
                            placeholder="R$ 0.000,00"
                            value={candidatoData.expected_salary}
                            onChange={handleInputChange}
                            className={`border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 ${
                              formErrors.expected_salary ? "border-red-500" : ""
                            }`}
                          />
                          {formErrors.expected_salary && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.expected_salary}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="has_driver_license" className="flex items-center text-slate-700">
                              <Car className="h-4 w-4 mr-2 text-indigo-500" />
                              Possui CNH
                            </Label>
                            <Switch
                              id="has_driver_license"
                              checked={candidatoData.has_driver_license}
                              onCheckedChange={(checked) => handleSwitchChange(checked, "has_driver_license")}
                              className="data-[state=checked]:bg-indigo-600"
                            />
                          </div>

                          {candidatoData.has_driver_license && (
                            <div className="mt-3">
                              <Label htmlFor="driver_license_category" className="text-sm text-slate-700">
                                Categoria da CNH
                              </Label>
                              <Select
                                value={candidatoData.driver_license_category}
                                onValueChange={(value) => handleSelectChange(value, "driver_license_category")}
                              >
                                <SelectTrigger
                                  id="driver_license_category"
                                  className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                  <SelectValue placeholder="Selecione uma categoria" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-slate-200">
                                  {licenseCategories.map((category, index) => (
                                    <SelectItem key={index} value={category}>
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="instagram_link" className="flex items-center text-slate-700">
                            <Instagram className="h-4 w-4 mr-2 text-indigo-500" />
                            Instagram
                          </Label>
                          <Input
                            id="instagram_link"
                            name="instagram_link"
                            placeholder="www.instagram.com/seuperfil"
                            value={candidatoData.instagram_link}
                            onChange={handleInputChange}
                            className={`border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 ${
                              formErrors.instagram_link ? "border-red-500" : ""
                            }`}
                          />
                          {formErrors.instagram_link && (
                            <p className="text-sm text-red-500 mt-1">{formErrors.instagram_link}</p>
                          )}
                          <p className="text-xs text-slate-500 mt-1">
                            Ex: https://www.instagram.com/seuperfil ou apenas seuperfil
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="facebook_link" className="flex items-center text-slate-700">
                            <Facebook className="h-4 w-4 mr-2 text-indigo-500" />
                            Facebook
                          </Label>
                          <Input
                            id="facebook_link"
                            name="facebook_link"
                            placeholder="www.facebook.com/seuperfil"
                            value={candidatoData.facebook_link}
                            onChange={handleInputChange}
                            className={`border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 ${
                              formErrors.facebook_link ? "border-red-500" : ""
                            }`}
                          />
                          {formErrors.facebook_link && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.facebook_link}</p>
                          )}
                          <p className="text-xs text-slate-500 mt-1">
                            Ex: https://www.facebook.com/seuperfil ou apenas seuperfil
                          </p>
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <Mail className="h-5 w-5 text-blue-500" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-blue-700">
                              Seu e-mail principal é <strong>{userData.email}</strong>. O e-mail secundário é opcional e
                              pode ser usado como contato alternativo.
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="diversidade" className="mt-0 space-y-6">
                      <div className="bg-indigo-50 p-5 rounded-lg mb-6 border border-indigo-100">
                        <div className="flex items-start">
                          <Heart className="h-5 w-5 mr-3 text-indigo-600 mt-0.5" />
                          <div>
                            <h3 className="font-medium text-indigo-800 mb-1">Informações de Diversidade</h3>
                            <p className="text-sm text-indigo-700">
                              Estas informações são opcionais e confidenciais, utilizadas apenas para promover a
                              diversidade e inclusão em nossos processos seletivos. Não impactam negativamente suas
                              candidaturas.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="sex" className="text-slate-700 font-medium">
                            Sexo Biológico
                          </Label>
                          <Select value={candidatoData.sex} onValueChange={(value) => handleSelectChange(value, "sex")}>
                            <SelectTrigger
                              id="sex"
                              className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                            >
                              <SelectValue placeholder="Selecione uma opção" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-slate-200">
                              {sexUser.map((sex, index) => (
                                <SelectItem key={index} value={sex.toLowerCase().replace(/\s+/g, "_")}>
                                  {sex}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="gender" className="text-slate-700 font-medium">
                            Identidade de Gênero
                          </Label>
                          <Select
                            value={candidatoData.gender}
                            onValueChange={(value) => handleSelectChange(value, "gender")}
                          >
                            <SelectTrigger
                              id="gender"
                              className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                            >
                              <SelectValue placeholder="Selecione uma opção" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-slate-200">
                              {gender.map((gen, index) => (
                                <SelectItem key={index} value={gen}>
                                  {gen}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="sexual_orientation" className="text-slate-700 font-medium">
                            Orientação Sexual
                          </Label>
                          <Select
                            value={candidatoData.sexual_orientation}
                            onValueChange={(value) => handleSelectChange(value, "sexual_orientation")}
                          >
                            <SelectTrigger
                              id="sexual_orientation"
                              className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                            >
                              <SelectValue placeholder="Selecione uma opção" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200">
                              {orientation.map((orient, index) => (
                                <SelectItem key={index} value={orient}>
                                  {orient}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="race" className="text-gray-700">
                            Raça/Cor/Etnia
                          </Label>
                          <Select
                            value={candidatoData.race}
                            onValueChange={(value) => handleSelectChange(value, "race")}
                          >
                            <SelectTrigger
                              id="race"
                              className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                            >
                              <SelectValue placeholder="Selecione uma opção" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200">
                              {color.map((cor, index) => (
                                <SelectItem key={index} value={cor}>
                                  {cor}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="localizacao" className="mt-0 space-y-6">
                      <div className="bg-indigo-50 p-5 rounded-lg mb-6 border border-indigo-100">
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 mr-3 text-indigo-600 mt-0.5" />
                          <div>
                            <h3 className="font-medium text-indigo-800 mb-1">Informações de Localização</h3>
                            <p className="text-sm text-indigo-700">
                              Preencha seu endereço completo para que possamos encontrar oportunidades próximas a você e
                              facilitar o processo de contratação.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="zip_code" className="flex items-center text-slate-700">
                            <MapPin className="h-4 w-4 mr-2 text-indigo-500" />
                            CEP
                          </Label>
                          <Input
                            id="zip_code"
                            name="zip_code"
                            placeholder="00000-000"
                            value={candidatoData.zip_code}
                            onChange={handleInputChange}
                            onBlur={(e) => fetchAddressByCep(e.target.value)}
                            className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="state" className="text-slate-700 font-medium">
                            Estado
                          </Label>
                          <Select
                            value={candidatoData.state}
                            onValueChange={(value) => handleSelectChange(value, "state")}
                          >
                            <SelectTrigger
                              id="state"
                              className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                            >
                              <SelectValue placeholder="Selecione um estado" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-slate-200">
                              {states.map((state, index) => (
                                <SelectItem key={index} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-slate-700">
                            Cidade
                          </Label>
                          <Input
                            id="city"
                            name="city"
                            placeholder="Sua cidade"
                            value={candidatoData.city}
                            onChange={handleInputChange}
                            className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="neighborhood" className="text-slate-700">
                            Bairro
                          </Label>
                          <Input
                            id="neighborhood"
                            name="neighborhood"
                            placeholder="Seu bairro"
                            value={candidatoData.neighborhood}
                            onChange={handleInputChange}
                            className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="street" className="text-slate-700">
                            Rua
                          </Label>
                          <Input
                            id="street"
                            name="street"
                            placeholder="Nome da rua"
                            value={candidatoData.street}
                            onChange={handleInputChange}
                            className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="number" className="text-slate-700">
                            Número
                          </Label>
                          <Input
                            id="number"
                            name="number"
                            placeholder="Número"
                            value={candidatoData.number}
                            onChange={handleInputChange}
                            className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="complement" className="text-slate-700">
                            Complemento
                          </Label>
                          <Textarea
                            id="complement"
                            name="complement"
                            placeholder="Apartamento, bloco, referência, etc."
                            value={candidatoData.complement}
                            onChange={handleInputChange}
                            className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <Button
                        type="submit"
                        className="w-full md:w-auto bg-purple-700 hover:bg-purple-800"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar Alterações
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CandidateInformation
