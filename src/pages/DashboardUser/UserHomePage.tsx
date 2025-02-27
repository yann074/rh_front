import Logo from '@/assets/logocs.svg'
import './UserHomePage.css'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
    BreadcrumbEllipsis
} from "@/components/ui/breadcrumb"


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
                        <BreadcrumbLink href="/">Perfil Pessoal</BreadcrumbLink>
                    </BreadcrumbItem>
                    
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/components">Suas experiências</BreadcrumbLink>
                    </BreadcrumbItem>
                    
                    <BreadcrumbItem>
                        <BreadcrumbLink href='/Nada'>Classificações</BreadcrumbLink>
                    </BreadcrumbItem>
                    
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/components">Detalhes Finais</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            
        </section>
    );
}

export default UserInformation