import { useState} from "react";
import { Link } from 'react-router-dom'
import axios from 'axios'
import logocs from "@/assets/logocs.svg"
import "./Register.css";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import CheckServer from '@/service/CheckService'

const Register = () => {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    confirmarEmail: "",
    senha: "",
    confirmarSenha: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.email !== form.confirmarEmail) {
      alert("Os emails não coincidem!");
      return;
    }

    if (form.senha !== form.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    axios
      .post("http://127.0.0.1:8000/api/register", {
        name: form.nome,
        email: form.email,
        password: form.senha,
      })
      .then((response) => {
        console.log(response.data);
        alert("Usuário criado com sucesso! Faça o login.");
      })
      .catch((error) => {
        console.error("Houve um erro!", error);
        alert("Erro ao criar usuário. Tente novamente.");
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
    }
  };

  return (
    <section className="register">
      <div className="logo">
        <img src={logocs} />
      </div>
      <div className="register-container">
        <div className="title">
          <h1>Crie sua Conta</h1>
        </div>
        <div className="google-button">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.log("Erro no login com Google")} />
        </div>

        <form onSubmit={handleSubmit}>
          <input placeholder="Nome" 
          type="text" 
          name="nome"
          value={form.nome} 
          onChange={handleChange} 
          />
          <input placeholder="Email" 
          type="text" 
          name="email"
          value={form.email} 
          onChange={handleChange} 
          />
          <input placeholder="Confirmar email" 
          type="text" 
          name="email"
          value={form.confirmarEmail} 
          onChange={handleChange} 
          />
          <input placeholder="Senha" 
          type="password" 
          name="senha"
          value={form.senha} 
          onChange={handleChange} 
          />
          <input placeholder="Confirmar senha" 
          type="password" 
          name="senha"
          value={form.confirmarSenha} 
          onChange={handleChange} 
          />
        </form>

        <div className="terms">
          <input type="checkbox" id="terms" />
          <label htmlFor="terms">Li e estou ciente com os novos termos de uso e Política de Privacidade</label>
        </div>

        <button type="submit">Criar Conta</button>

        <div className="return-login">
          <p>Já tem um conta? <a href=""><Link to="/login">Login</Link></a></p>
        </div>
      </div>
      <CheckServer />
    </section>
  );
};

export default Register;
