import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import UserHomePage from '@/pages/DashboardUser/UserHomePage.js'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Register from '@/pages/auth/Register.js'
import PersonalInformation from './components/UserSection/PersonalInformation';
import FinalDetails from './components/UserSection/FinalDetails';
import Experiences from './components/UserSection/Experiences';
import Classification from './components/UserSection/Classification';
import Login from './pages/auth/Login'
import '@/index.css'
import InitialJobs from './pages/Jobs/InitialJobs';
import JobsSpecific from './pages/Jobs/JobsSpecific';
import PageAdmin from './pages/admin/PageAdmin';
import Apply from './components/UserSection/Apply';


const CLIENT_ID = '239792615305-dh5fndio5bf43rhha3kji5qe3jpuj7uq.apps.googleusercontent.com'

//Configurando as rotas

const rotas = createBrowserRouter([
  {
    path: "register",
    element: <Register />
  },
  {
    path: "login",
    element: <Login />
  },
  {
    path: "home",
    element: <InitialJobs />
  },
  {
    path:`aplly/:id`,
    element: <Apply />
  },
  {
    path:"admin",
    element: <PageAdmin />
  },
  {
    path: `/jobs/:id`,
    element: <JobsSpecific />
  },
  {
    path: "/",
    element: <UserHomePage />,
    children: [
      {
        path: "/",
        element: <PersonalInformation />,
      },
      {
        path: "experience",
        element: <Experiences />
      },
      {
        path: "classification",
        element: <Classification />
      },
      {
        path: "finaldetails",
        element: <FinalDetails />,
      },
    ]
  },
])


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <RouterProvider router={rotas} />
    </GoogleOAuthProvider>
  </StrictMode>,
)