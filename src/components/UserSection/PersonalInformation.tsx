import { useState } from "react";


const PersonalInformation = () => {

    const [image, setImage] = useState<string | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setImage(imageURL);
        }
    };

    return (
        <section className="formulario">
            <div className="form" id="form1">
                <h2>Informações Pessoais</h2>

                <input type="text" name="Nome" placeholder="Nome Completo (Nome Social)*" id="nome" required />

                <div className="input-group">
                    <input type="email" name="email" placeholder="Email*" required />
                    <input type="email" name="emailSecundario" placeholder="Email secundário (Opcional)" />
                </div>

                <div className="input-group">
                    <input type="number" name="cpf" placeholder="CPF*" required />
                    <input type="text" name="data-nascimento" placeholder="Data de Nascimento*" required />
                </div>

                <div className="input-group">
                    <input type="tel" name="telefone" placeholder="Telefone (com DDD)*" required />
                    <input type="url" name="linkedin" placeholder="Link do LinkedIn (Opcional)" />
                </div>

                <div className="radio-group">
                    <label>Você possui deficiência?</label>
                    <label><input type="radio" name="deficiencia" value="sim" /> Sim</label>
                    <label><input type="radio" name="deficiencia" value="nao" defaultChecked /> Não</label>
                </div>
            </div>
            <div className="form" id="form2">
                <h2>
                    Foto de perfil <span className="optional">Opcional</span>
                </h2>

                <label htmlFor="file-upload" className="upload-button">
                    <div className="upload-circle">
                        {image ? (
                            <img src={image} alt="Foto de perfil" className="profile-image" />
                        ) : (
                            <img src="/camera-icon.svg" className="camera-icon" />
                        )}
                    </div>
                </label>

                <p className="upload-text">Insira sua foto</p>

                <input
                    type="file"
                    id="file-upload"
                    name="Profile-Picture"
                    accept="image/*"
                    hidden
                    onChange={handleImageUpload}
                />

                <div className="info-box">
                    <p>• Foto do rosto com um fundo branco</p>
                </div>
            </div>
        </section>
    )
}

export default PersonalInformation