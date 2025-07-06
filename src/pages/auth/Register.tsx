import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Lock, User, UserCheck } from 'lucide-react';
import logocs from "@/assets/logocs.svg";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setForm(prev => ({
      ...prev,
      acceptTerms: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    if (form.password !== form.confirmPassword) {
      Swal.fire('Erro!', 'As senhas não conferem. Tente novamente.', 'error');
      return;
    }

    if (!form.acceptTerms) {
      Swal.fire('Erro!', 'Você precisa aceitar os termos e condições para prosseguir.', 'warning');
      return;
    }

    setLoading(true);

    axios
      .post("https://rhback-production.up.railway.app/api/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);

        Swal.fire({
          icon: 'success',
          title: 'Cadastro realizado com sucesso!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          }
        });


        sessionStorage.setItem("token", response.data.token);
        navigate("/login");
      })
      .catch((error) => {
        console.error("Erro de cadastro:", error);

        if (error.response && error.response.data && error.response.data.message) {
          Swal.fire('Erro!', error.response.data.message, 'error');
        } else {
          Swal.fire('Erro!', 'Não foi possível realizar o cadastro. Tente novamente.', 'error');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGoogleSignup = () => {

    console.log('Cadastro com Google iniciado');

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-purple-700 flex items-center justify-center rounded-xl shadow-lg">
            <img src={logocs} alt="" />
          </div>
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Crie sua conta</CardTitle>
            <CardDescription>
              Preencha seus dados para se cadastrar no sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Signup Button */}
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 py-5"
              onClick={handleGoogleSignup}
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Continuar com Google
            </Button>

            <div className="flex items-center space-x-2">
              <Separator className="flex-grow" />
              <span className="text-xs text-gray-500">OU</span>
              <Separator className="flex-grow" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <User size={16} />
                  </div>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={form.name}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <Mail size={16} />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={form.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <Lock size={16} />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="pl-10"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  A senha deve ter no mínimo 8 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <UserCheck size={16} />
                  </div>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptTerms"
                  checked={form.acceptTerms}
                  onCheckedChange={handleCheckboxChange}
                  required
                />
                <Label htmlFor="acceptTerms" className="text-sm cursor-pointer">
                  Eu aceito os{' '}
                  <a
                    href="#"
                    className="text-purple-700 hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      // Exibir termos e condições em um modal
                      Swal.fire({
                        title: 'Termos e Condições',
                        text: 'Termos detalhados do serviço iriam aparecer aqui.',
                        confirmButtonText: 'Entendi',
                        confirmButtonColor: '#7e22ce'
                      });
                    }}
                  >
                    termos e condições
                  </a>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-700 hover:bg-purple-800 text-white"
                disabled={loading}
              >
                {loading ? 'Processando...' : 'Criar conta'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <div className="text-sm text-center">
              Já tem uma conta?{' '}
              <a
                href="#"
                className="text-purple-700 hover:underline font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
              >
                Faça login
              </a>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-4 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} CS Instituto. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;