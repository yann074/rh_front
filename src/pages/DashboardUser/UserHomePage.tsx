import Logo from '@/assets/logocs.svg'
import './UserHomePage.css'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
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
                        <BreadcrumbLink href=""><Link to="/">Perfil Pessoal</Link></BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink href=""><Link to="experience">Suas experiências</Link></BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink href=''><Link to="classification">Classificações</Link></BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink href=""><Link to="finaldetails">Detalhes Finais</Link></BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Outlet/>
        </section>
    );
}

export default UserInformation
