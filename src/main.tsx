import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import UserHomePage from "@/pages/DashboardUser/CandidateInformation.js"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Register from "@/pages/auth/Register.js"
import Login from "./pages/auth/Login"
import "@/index.css"
import InitialJobs from "./pages/Jobs/InitialJobs"
import JobsSpecific from "./pages/Jobs/JobsSpecific"
import Apply from "./components/UserSection/Apply"
import DashBoard from "@/pages/admin/DashBoard"
import Users from "@/components/AdminComp/Users"
import ErrorPage from "@/ErrorPage/ErrorPage"
import Candidates from "@/components/AdminComp/Candidates"
import Jobs from "@/components/AdminComp/Jobs"
import CreateJobs from "@/components/AdminComp/CreateJobs"
import Applications from "@/components/AdminComp/Applications"
import AdminRoute from "@/components/ProtectedRoutes/AdminRoute"
import UserRoute from "@/components/ProtectedRoutes/UserRoute"

const CLIENT_ID = "239792615305-dh5fndio5bf43rhha3kji5qe3jpuj7uq.apps.googleusercontent.com"

// Configurando as rotas
const rotas = createBrowserRouter([
  {
    path: "dashboard",
    element: (
      <AdminRoute>
        <DashBoard />
      </AdminRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "candidates",
        element: <Users />,
      },
      {
        path: "bancodetalentos",
        element: <Candidates />,
      },
      {
        path: "adminjobs",
        element: <Jobs />,
      },
      {
        path: "createjobs",
        element: <CreateJobs />,
      },
      {
        path: "app",
        element: <Applications />,
      },
    ],
  },
  {
    path: "register",
    element: <Register />,
    errorElement: <ErrorPage />,
  },
  {
    path: "login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <InitialJobs />,
    errorElement: <ErrorPage />,
  },
  {
    path: "apply/:id",
    element: (
      <UserRoute>
        <Apply />
      </UserRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "opportunities/:id",
    element: (
      <UserRoute>
        <JobsSpecific />
      </UserRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "userhomepage",
    element: (
      <UserRoute>
        <UserHomePage />
      </UserRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <RouterProvider router={rotas} />
    </GoogleOAuthProvider>
  </StrictMode>,
)
