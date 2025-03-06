import { useState } from 'react'
import { postData } from '@/service/Api'
import logocs from "@/assets/logocs.svg"
import { Link } from "react-router-dom"
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import axios from 'axios'

export default function Login() {
    const [form, setForm] = useState({
        email: "",
        password: ''
    })

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        postData("/login", form)
            .then((response: { data: { message: string; token: string; }; }) => {
                console.log(response.data);
                if (response.data.message === "User is admin") {
                    window.alert("Usuário autenticado");
                    localStorage.setItem('token', response.data.token);
                } else {
                    window.alert("Usuário autenticado, mas não admin");
                    sessionStorage.setItem('token', response.data.token);
                }
            })
            .catch((error: any) => {
                console.error("Erro de login:", error);
                window.alert("Erro ao tentar fazer login.");
            });
    }
    function handleGoogleSuccess(_credentialResponse: CredentialResponse): void {
        throw new Error('Function not implemented.')
    }

    return (
        <section className="register">

            <div className="register-container">
                <div className="title">
                    <h1>Crie sua Conta</h1>
                </div>
                <div className="google-button">
                    <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.log("Erro no login com Google")} />
                </div>
                <form onSubmit={handleSubmit}>
                    <input placeholder="Email" type="text" name="email" onChange={handleChange} />
                    <input placeholder="Senha" type="password" name="senha" onChange={handleChange} />
                </form>

                <button type="submit">Fazer Login</button>

                <div className="return-login">
                    <p>Não tem uma conta? <a href=""><Link to="/register">Registre-se</Link></a></p>
                </div>
            </div>
            <div className="logo">
                <img src={logocs} />
            </div>
        </section>
    )
}