import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import SideMenuAdmin from "./SideMenuAdmin";
import useWindowWidth from "../utils/hooks/useWindowWith";
import Cruds from "./Cruds";
import CrudView from "./Cruds/CrudView";
import { girosFormFields } from "./Cruds/formFieldsArrays";
import { girosColumns } from "./Cruds/columnsArrays";
import Subtramite from "./Cruds/Subtramite";
import Condicionantes from "./Cruds/Condicionantes";
import Requisito from "./Cruds/Requisito";
import Trabajadores from "./Cruds/Trabajadores";
import CatalogoTramites from "./Cruds/CatalogoTramites";
import Usuario from "./Cruds/Usuario";
import Conceptos from "./Cruds/Conceptos";
import GirosCrud from "./Cruds/GirosCrud";
import UMAS from "../views/UMAS";

export default function AdminLayout() {
    const windowWidth = useWindowWidth();
    return (
        <Router basename="/app/admin-cruds">
            <Layout>
                <Layout.Sider collapsed={windowWidth < 750} theme="light">
                    <SideMenuAdmin />
                </Layout.Sider>
                <Layout>
                    <Layout.Content>
                        <div>
                            <nav className="navbar navbar-expand-md navbar-light bg-white py-4">
                                <div
                                    className="collapse navbar-collapse"
                                    id="navbarSupportedContent"
                                >
                                    <ul className="navbar-nav ml-auto">
                                        <li className="nav-item">
                                            Administración
                                        </li>
                                    </ul>
                                </div>
                            </nav>
                        </div>
                        <main className="cruds_main">
                            <Routes>
                                <Route path={"/"} exact element={<Cruds />} />
                                <Route
                                    path={"/catalogo-tramites"}
                                    element={
                                        // <CrudView
                                        //     pageTitle="Catálogo de Trámites"
                                        //     modelo="tramites"
                                        //     columns={tramitesColumns}
                                        //     formFields={tramitesFormFields}
                                        //     key="tramite"
                                        // />
                                        <CatalogoTramites />
                                    }
                                />
                                <Route
                                    path={"/catalogo-giros-comerciales"}
                                    element={<GirosCrud />}
                                />
                                <Route
                                    path={"/subtramites"}
                                    element={<Subtramite />}
                                />
                                <Route
                                    path={"/requisitos"}
                                    element={<Requisito />}
                                />
                                <Route
                                    path={"/condicionantes"}
                                    element={<Condicionantes />}
                                />
                                <Route
                                    path={"/trabajadores"}
                                    element={<Trabajadores />}
                                />
                                <Route
                                    path={"/usuarios"}
                                    element={<Usuario />}
                                />
                                <Route
                                    path={"/conceptos"}
                                    element={<Conceptos />}
                                />
                                <Route
                                    path={"/umas"}
                                    element={<UMAS />}
                                />
                            </Routes>
                        </main>
                    </Layout.Content>
                </Layout>
            </Layout>
        </Router>
    );
}
