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
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import logocs from "@/assets/logocs.svg";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      rememberMe: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post("http://127.0.0.1:8000/api/login", {
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
          title: 'Login realizado com sucesso!',
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

        // Armazena o token e redireciona
        if (response.data.message === "User is admin") {
          localStorage.setItem("token", response.data.token);
        } else {
          sessionStorage.setItem("token", response.data.token);
        }

        navigate("/jobs");
      })
      .catch((error) => {
        console.error("Erro de login:", error);
        Swal.fire('Erro!', 'Credenciais inválidas. Tente novamente.', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGoogleLogin = () => {

    console.log('Login com Google iniciado');

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
            <CardTitle className="text-2xl font-bold">Bem-vindo de volta</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Login Button */}
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 py-5"
              onClick={handleGoogleLogin}
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
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Senha</Label>
                  <a
                    href="#"
                    className="text-xs text-purple-700 hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/recuperar-senha");
                    }}
                  >
                    Esqueceu a senha?
                  </a>
                </div>
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
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={form.rememberMe}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="rememberMe" className="text-sm cursor-pointer">Lembrar de mim</Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-700 hover:bg-purple-800 text-white"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <div className="text-sm text-center">
              Ainda não tem conta?{' '}
              <a
                href="#"
                className="text-purple-700 hover:underline font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/register");
                }}
              >
                Cadastre-se
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

export default LoginPage;