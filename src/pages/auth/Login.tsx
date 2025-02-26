import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { postData } from '../../service/Api'
import logocs from "../../assets/logocs.svg"

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
    return (
    
            <section className='d-flex justify-content-center align-items-center '>
                <div className="col-md-7 d-flex justify-content-center align-items-center">
                    <div className="p-5 w-75 border rounded shadow bg-white">
                        <form onSubmit={handleSubmit} className="row g-3">
                            <h1 className="text-center mb-4">Acessar</h1>

                            <div className="mb-3">
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Digite seu email"
                                    onChange={handleChange}
                                    className="form-control p-3 rounded-pill"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Digite sua senha"
                                    onChange={handleChange}
                                    className="form-control p-3 rounded-pill "
                                    required
                                />
                            </div>

                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <input type="checkbox" id="lembrar" className="me-2" />
                                    <label htmlFor="lembrar">Lembrar de mim</label>
                                </div>
                                <h6 className="text-primary">Esqueceu a senha?</h6>
                            </div>

                            <button className="btn btn-primary w-100 p-2">Acessar</button>
                        </form>

                        <h6 className="text-center mt-3">
                            Não tem uma conta?{" "}
                            <a href="#" className="text-primary fw-bold">
                                Registre-se
                            </a>
                        </h6>
                    </div>
                </div>


                <div className="col-md-4 border-1 d-flex justify-content-center align-items-center ">
                    <div className="p-4 text-center">
                        <img src={logocs} alt="Logo" className="img-fluid" />
                    </div>
                </div>
        </section>

    )
}