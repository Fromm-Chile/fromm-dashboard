import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Cotizaciones } from "./pages/Cotizaciones";
import { Contactos } from "./pages/Contactos";
import { Clientes } from "./pages/Clientes";
import { ServicioTecnico } from "./pages/ServicioTecnico";
import { DetalleCotizacion } from "./pages/DetalleCotizacion";
import { DetalleContacto } from "./pages/DetalleContacto";
import { LogIn } from "./pages/LogIn";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DetalleServicio } from "./pages/DetalleServicio";
import { NuevaCotizacion } from "./pages/NuevaCotizacion";
import { HistorialCliente } from "./pages/HistorialCliente";
// import ScrollToTop from "./components/ScrollToTop";
import { Inicio } from "./pages/Inicio";
import { Home } from "./pages/Home";
import { AdminUsers } from "./pages/AdminUsers";
import { DetalleAdminUser } from "./pages/DetalleAdminUser";
import { NuevoUsuario } from "./pages/NuevoUsuario";
import { BannersFromm } from "./pages/BannersFromm";
import { DetalleBannersFromm } from "./pages/DetalleBannersFromm";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        {/* <ScrollToTop /> */}
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      </>
    ),
    children: [
      { path: "/inicio", element: <Home /> },
      { path: "/usuarios", element: <AdminUsers /> },
      { path: "/usuarios/:id", element: <DetalleAdminUser /> },
      { path: "/resultados", element: <Inicio /> },
      { path: "/cotizaciones", element: <Cotizaciones /> },
      { path: "/cotizaciones/:id", element: <DetalleCotizacion /> },
      { path: "/contactos", element: <Contactos /> },
      { path: "/contactos/:id", element: <DetalleContacto /> },
      { path: "/clientes", element: <Clientes /> },
      { path: "/clientes/:id", element: <HistorialCliente /> },
      { path: "/servicios", element: <ServicioTecnico /> },
      { path: "/servicios/:id", element: <DetalleServicio /> },
      { path: "/banners", element: <BannersFromm /> },
      { path: "/banners/:id", element: <DetalleBannersFromm /> },
      { path: "*", element: <Navigate to="/" /> },
    ],
  },
  { path: "/login", element: <LogIn /> },
  { path: "/nueva-cotizacion", element: <NuevaCotizacion /> },
  { path: "/nuevo-usuario", element: <NuevoUsuario /> },
]);
