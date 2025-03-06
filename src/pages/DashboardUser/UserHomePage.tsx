import Logo from '@/assets/logocs.svg'
import './UserHomePage.css'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Outlet, Link } from 'react-router-dom'

const UserInformation = () => {
   
    return (
        <section className="Home">
            <header>
                <div className="logo-container">
                    <img src={Logo} />
                </div>
            </header>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <Link to="/">Perfil Pessoal</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <Link to="experience">Suas experiências</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <Link to="classification">Classificações</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <Link to="finaldetails">Detalhes Finais</Link>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Outlet/>
        </section>
    );
}

export default UserInformation
