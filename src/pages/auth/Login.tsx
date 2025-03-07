import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import logocs from "@/assets/logocs.svg";
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { toast } from "sonner";
import Swal from 'sweetalert2';

export default function Login() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

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

                navigate("/");
            })
            .catch((error) => {
                console.error("Erro de login:", error);
                Swal.fire('Erro!', 'Credenciais inválidas. Tente novamente.', 'error');
            });
    };

    const handleGoogleSuccess = (response: CredentialResponse) => {
        if (response.credential) {
            console.log("JWT Token recebido:", response.credential);
            localStorage.setItem("token", response.credential);

            const decodeJWT = (token: string) => {
                const base64Url = token.split(".")[1];
                const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                return JSON.parse(atob(base64));
            };

            const userData = decodeJWT(response.credential);
            console.log("Dados do usuário:", userData);

            Swal.fire({
                icon: 'success',
                title: 'Login com Google realizado!',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500
            });

            navigate("/");
        }
    };

    return (
        <section className="register">


            <div className="register-container">
                <div className="title">
                    <h1>Faça seu Login</h1>
                </div>

                <div className="google-button">
                    <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error("Erro no login com Google")} />
                </div>

                <form onSubmit={handleSubmit}>
                    <input placeholder="Email" type="text" name="email" value={form.email} onChange={handleChange} />
                    <input placeholder="Senha" type="password" name="password" value={form.password} onChange={handleChange} />
                    <button type="submit">Fazer Login</button>
                </form>

                <div className="return-login">
                    <p>Não tem uma conta? <Link to="/register">Registre-se</Link></p>
                </div>

            </div>
            <div className="logo">
                <img src={logocs} alt="Logo" />
            </div>
        </section>
    );
}
