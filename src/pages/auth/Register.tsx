import { useState } from "react";
import { postData } from "@/service/Api"
import logocs from "@/assets/logocs.svg"
import "./Register.css";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";



const Register = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    postData("/register", form)
      .then((response: { data: { message: string; token: string } }) => {
        console.log(response.data);
        if (response.data.message === "User is admin") {
          window.alert("Usuário autenticado");
          localStorage.setItem("token", response.data.token);
        } else {
          window.alert("Usuário autenticado, mas não admin");
          sessionStorage.setItem("token", response.data.token);
        }
      })
      .catch((error: any) => {
        console.error("Erro de login:", error);
        window.alert("Erro ao tentar fazer login.");
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
          <input placeholder="Nome" type="text" name="nome" onChange={handleChange} />
          <input placeholder="Email" type="text" name="email" onChange={handleChange} />
          <input placeholder="Confirmar email" type="text" name="email" onChange={handleChange} />
          <input placeholder="Senha" type="password" name="senha" onChange={handleChange} />
          <input placeholder="Confirmar senha" type="password" name="senha" onChange={handleChange} />
        </form>

        <div className="terms">
          <input type="checkbox" id="terms" />
          <label htmlFor="terms">Li e estou ciente com os novos termos de uso e Política de Privacidade</label>
        </div>

        <button type="submit">Criar Conta</button>

        <div className="return-login">
          <p>Já tem um conta? <a href="#">Login</a></p>
        </div>
      </div>
    </section>
  );
};

export default Register;
