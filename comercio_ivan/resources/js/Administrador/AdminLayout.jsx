import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "antd";

// Componentes de Vistas Princiaples
import DashboardIndex from "@/v2/views/Administrador/Dashboard";
import CatalogoTramites from "./Cruds/CatalogoTramites";
import GirosCrud from "./Cruds/GirosCrud";
import Condicionantes from "./Cruds/Condicionantes";
import Requisito from "./Cruds/Requisito";
import Subtramite from "./Cruds/Subtramite";
import Trabajadores from "./Cruds/Trabajadores";
import UsuariosIndex from "@/v2/views/Usuarios/Index";
import AutorizacionesIndex from '@/v2/views/Autorizaciones/Index'
import Conceptos from "./Cruds/Conceptos";
import UMAS from "../views/UMAS";
import Error404 from "@/v2/views/Errors/404";

// Componentes del Layout
import SideMenuAdmin from "./SideMenuAdmin";
import useWindowWidth from "../utils/hooks/useWindowWith";
import { authorize} from "@/v2/utils/App";

import EntidadHeader from "../components/EntidadHeader";

export default function AdminLayout() {

    const windowWidth = useWindowWidth();

    const routeComponents = [
        {
            authorized: true,
            path: '/',
            component: <DashboardIndex />
        },
        {
            authorized: authorize('index:catalogo-tramites'),
            path: '/catalogo-tramites',
            component: <CatalogoTramites />
        },
        {
            authorized: authorize('index:catalogo-giros-comerciales'),
            path: '/catalogo-giros-comerciales',
            component: <GirosCrud />
        },
        {
            authorized: authorize('index:condicionantes'),
            path: '/condicionantes',
            component: <Condicionantes />
        },
        {
            authorized: authorize('index:catalogo-requisitos'),
            path: '/requisitos',
            component: <Requisito />
        },
        {
            authorized: authorize('index:catalogo-subtramites'),
            path: '/subtramites',
            component: <Subtramite />
        },
        {
            authorized: authorize('index:trabajadores'),
            path: '/trabajadores',
            component: <Trabajadores />
        },
        {
            authorized: authorize('index:usuarios'),
            path: '/usuarios',
            component: <UsuariosIndex />
        },
        {
            authorized: authorize('index:roles'),
            path: '/autorizaciones',
            component: <AutorizacionesIndex />
        },
        {
            authorized: authorize('index:conceptos'),
            path: '/conceptos',
            component: <Conceptos />
        },
        {
            authorized: authorize('index:umas'),
            path: '/umas',
            component: <UMAS />
        },
        {
            authorized: true,
            path: '*',
            component: <Error404 />
        },
    ].filter(route => route.authorized)

    return (
        <Router basename="/app/admin-cruds">
            <Layout>
                <Layout.Sider width={260} collapsed={windowWidth < 880} theme="light" className="border-r border-tray-100 shadow-xl">
                    <SideMenuAdmin />
                </Layout.Sider>
                <Layout.Content>
                    <EntidadHeader />
                    <main className="p-3">
                        <Routes>
                            {routeComponents.map((route, index) =>
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={route.component}
                                />
                            )}
                        </Routes>
                    </main>
                </Layout.Content>
            </Layout>
        </Router>
    );
}
