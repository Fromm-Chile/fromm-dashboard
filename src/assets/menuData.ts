import {
  Home,
  FileText,
  MessageSquare,
  Wrench,
  Users,
  BarChart3,
  UserCog,
  Image,
  type LucideIcon,
} from "lucide-react";

type NavMenu = {
  id: number;
  name: string;
  icon: LucideIcon;
  link: string;
};

export const superAdminMenu: NavMenu[] = [
  {
    id: 1,
    name: "Home",
    icon: Home,
    link: "/inicio",
  },
  {
    id: 2,
    name: "Invoices",
    icon: FileText,
    link: "/cotizaciones",
  },
  {
    id: 3,
    name: "Contacts",
    icon: MessageSquare,
    link: "/contactos",
  },
  {
    id: 4,
    name: "Technical Service",
    icon: Wrench,
    link: "/servicios",
  },
  {
    id: 5,
    name: "Clients",
    icon: Users,
    link: "/clientes",
  },
  {
    id: 6,
    name: "Results",
    icon: BarChart3,
    link: "/resultados",
  },
  {
    id: 7,
    name: "Usuarios Panel",
    icon: UserCog,
    link: "/usuarios",
  },
  // {
  //   id: 8,
  //   name: "Banners Fromm",
  //   icon: Image,
  //   link: "/banners",
  // },
];

export const navMenuAdminChile: NavMenu[] = [
  {
    id: 1,
    name: "Home",
    icon: Home,
    link: "/inicio",
  },
  {
    id: 2,
    name: "Invoices",
    icon: FileText,
    link: "/cotizaciones",
  },
  {
    id: 3,
    name: "Contacts",
    icon: MessageSquare,
    link: "/contactos",
  },
  {
    id: 4,
    name: "Technical Service",
    icon: Wrench,
    link: "/servicios",
  },
  {
    id: 5,
    name: "Clients",
    icon: Users,
    link: "/clientes",
  },
  {
    id: 6,
    name: "Results",
    icon: BarChart3,
    link: "/resultados",
  },
  // {
  //   id: 7,
  //   name: "Banners Fromm",
  //   icon: Image,
  //   link: "/banners",
  // },
];

export const navMenu: NavMenu[] = [
  {
    id: 1,
    name: "Inicio",
    icon: Home,
    link: "/inicio",
  },
  {
    id: 2,
    name: "Cotizaciones",
    icon: FileText,
    link: "/cotizaciones",
  },
  {
    id: 3,
    name: "Contactos",
    icon: MessageSquare,
    link: "/contactos",
  },
  {
    id: 4,
    name: "Servicio Técnico",
    icon: Wrench,
    link: "/servicios",
  },
  {
    id: 5,
    name: "Clientes",
    icon: Users,
    link: "/clientes",
  },
  {
    id: 6,
    name: "Resultados",
    icon: BarChart3,
    link: "/resultados",
  },
];

export const navMenuServicioTecnico: NavMenu[] = [
  {
    id: 1,
    name: "Inicio",
    icon: Home,
    link: "/inicio",
  },
  {
    id: 4,
    name: "Servicio Técnico",
    icon: Wrench,
    link: "/servicios",
  },
];
