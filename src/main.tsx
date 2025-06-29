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
import AdminRoute from "@/components/ProtectedRoutes/AdminRoute"
import UserRoute from "@/components/ProtectedRoutes/UserRoute"
import Company from "@/components/AdminComp/Company"
import Trainings from "@/components/AdminComp/Trainings"
import InitialTrainings from "./pages/Trainings/InitialTrainings"
import TrainingsSpecific from "./pages/Trainings/TtrainingsSpecific"
import StatusResponse from "./pages/ResponseApply/StatusResponse"
import BehaviorProfile from "./pages/personality/behaviorProfile"
import ResultBehaviorProfile from "./pages/personality/ResultBehaviorProfile"
import ViewApplies from "@/components/UserSection/ViewApplies"
import MyTrainingsPage from "@/components/UserSection/MyTrainingsPage"
import QuemSomos from "./pages/WhoWeAre/QuemSomos"
import NossaEquipe from "./pages/OurTeam/NossaEquipe"

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
        path: "empresas",
        element: <Company />,
      },
      {
        path: "capacitacoes", 
        element: <Trainings />,
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
    path: "/quemsomos",
    element: <QuemSomos />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/nossaequipe",
    element: <NossaEquipe />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/treinamentos",
    element: <InitialTrainings />,
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
    path: "treinamentoss/:id",
    element: (
      <UserRoute>
        <TrainingsSpecific />
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
    path: "statusresponse/:id",
    element: (
      <UserRoute>
        <StatusResponse />
      </UserRoute>
    ),
    errorElement: <ErrorPage />,
  },
  { 
        path: "my-applications",
        element: (
          <UserRoute>
            <ViewApplies />
          </UserRoute>
        ),
    },
  { 
        path: "my-subscriptions",
        element: (
          <UserRoute>
            <MyTrainingsPage />
          </UserRoute>
        ),
    },
  {
    path: "behaviorProfile",
    element: (
        <BehaviorProfile />
    ),
  },
  {
    path: "resultbehaviorProfile",
    element: (
        <ResultBehaviorProfile />
    ),
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
