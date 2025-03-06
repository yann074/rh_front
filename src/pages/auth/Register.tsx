import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logocs from "@/assets/logocs.svg";
import "./Register.css";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { toast } from "sonner";
import Swal from 'sweetalert2';


const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    confirmarEmail: "",
    password: "",
    confirmarSenha: "",
  });

  const Navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.email !== form.confirmarEmail) {
      toast.error("Os emails não coincidem!");
      return;
    }

    if (form.password !== form.confirmarSenha) {
      toast.error("As senhas não coincidem!");
      return;
    }

    axios
      .post("http://127.0.0.1:8000/api/register", {
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
          title: 'Registro feito com sucesso',
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
      })
      .catch((error) => {
        console.error("Houve um erro!", error);
        Swal.fire('Erro!', 'Login falhou. Verifique suas credenciais.', 'error');
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
        <img src={logocs} alt="Logo" />
      </div>
      <div className="register-container">
        <div className="title">
          <h1>Crie sua Conta</h1>
        </div>
        <div className="google-button">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error("Erro no login com Google")} />
        </div>

        <form onSubmit={handleSubmit}>
          <input placeholder="Nome" type="text" name="name" value={form.name} onChange={handleChange} />
          <input placeholder="Email" type="text" name="email" value={form.email} onChange={handleChange} />
          <input placeholder="Confirmar email" type="text" name="confirmarEmail" value={form.confirmarEmail} onChange={handleChange} />
          <input placeholder="Senha" type="password" name="password" value={form.password} onChange={handleChange} />
          <input placeholder="Confirmar senha" type="password" name="confirmarSenha" value={form.confirmarSenha} onChange={handleChange} />
          <button type="submit">Criar Conta</button>
        </form>

        <div className="terms">
          <input type="checkbox" id="terms" />
          <label htmlFor="terms">Li e estou ciente com os novos termos de uso e Política de Privacidade</label>
        </div>

        <div className="return-login">
          <p>Já tem uma conta? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </section>
  );
};

export default Register;
