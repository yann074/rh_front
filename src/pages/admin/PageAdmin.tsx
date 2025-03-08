import Users from "./Users"
import Footer from "@/components/layouts/Footer"
import Header from "@/components/layouts/Header"
export default function PageAdmin(){
    return(
        <>
        <main>
            <Header />
            <Users />
            <Footer />
        </main>
        </>
    )
}