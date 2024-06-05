import React, { useState, useEffect } from "react";
import { Routes, Route, resolvePath } from "react-router-dom";
import { Layout } from "antd";

import IniciarTramite from "./tramites/IniciarTramite.jsx";
import Tramites from "./Tramites.jsx";
import DetallesMiTramite from "./DetallesMiTramite.jsx";
import DetallesMiTramiteNegocio from "./DetallesMiTramiteNegocio.jsx";
import MisNegocios from "./MisNegocios.jsx";
import MiNegocioDetalles from "./MiNegocioDetalles.jsx";
import CompletaTuPerfil from "./CompletaTuPerfil.jsx";
import RegistrarNegocio from "./RegistrarNegocio.jsx";
import LicenciaAlcoholes from "./alcoholes/LicenciaAlcoholes.jsx";
import CrudPersonaFisica from "./components/CrudPersonaFisica.jsx";
import Lista from "../components/ListaNueva.jsx";
import Graba from "../components/GrabaSolicitud.jsx";
import Edit from "../components/Edicion.jsx";
import IniciarRefrendoLicenciaAlcohol from "./tramites/IniciarRefrendoLicenciaAlcohol.jsx";
import RevisionTramites from "./revision/RevisionTramites.jsx";
import DetallesTramite from "./revision/DetallesTramite.jsx";
import CambioTipoRecoleccion from "./revision/servicios-publicos/CambioTipoRecoleccion.jsx";
import Padron from "./Padron.jsx";
import MapaNegocios from "./MapaNegocios.jsx";
import HomeNegocio from "./revision/homeNegocios.jsx";
import SideMenu from "./components/SideMenu.jsx";
import Negocios from "./revision/negocios.jsx";
import DetallesNegociosEntidad from "./revision/detallesNegociosEntidad.jsx";
import UMAS from "./UMAS";
import ComercioAdmin from "./comercio-admin/ComercioAdmin.jsx";
import ComercioAdminHomeNegocio from "./comercio-admin/ComercioAdminHome.jsx";
import ComercioAdminBusquedaNegocio from "./comercio-admin/ComercioAdminBusquedaNegocio.jsx";
import EditarNegocioComercioAdmin from "./comercio-admin/EditarNegocioComercioAdmin.jsx";

import routes from "../utils/react-routes.jsx";
import useWindowWidth from "../utils/hooks/useWindowWith.jsx";
// comercio-admin

import Resolutivos from "./resolutivos/Resolutivos.jsx";
import NegociosResolutivos from "./resolutivos/NegociosResolutivos.jsx";
import EntidadHeader from "../components/EntidadHeader.jsx";
import ComercioAdminNegocio from "./comercio-admin/ComercioAdminNegocio.jsx";
import CrudPersonaMoralContainer from "../Administrador/CrudsNegocio/CrudPersonaMoralContainer.jsx";
import MapaEntidadRevisora from "./revision/MapaEntidadRevisora.jsx";
import ComercioSarePro from "./ComercioSarePro/ComercioSarePro.jsx";
import Ayuda from  "./Ayuda.jsx";

function App() {

    const [user, setUser] = useState({});
    const [URL, setURL] = useState({});
    const windowWidth = useWindowWidth();

    useEffect(() => {
        setUser(window.user);
    }, []);

    return (
        <Layout>
            <Layout.Sider collapsed={windowWidth < 880} theme="light" className="border-r border-tray-100 shadow-xl">
                <span className="dash-toggler">
                    <span className="icon">
                        <i className="fas fa-angle-right"></i>
                    </span>
                </span>
                <SideMenu />
            </Layout.Sider>
            <Layout>
                <Layout.Content>
                    <EntidadHeader />
                    <Routes>
                        <Route
                            path={routes.misTramites}
                            element={<Tramites />}
                        />
                        <Route
                            path={routes.misTramitesDetalles}
                            element={<DetallesMiTramite />}
                        />
                        <Route
                            path={routes.misTramitesNegocioDetalles}
                            element={<DetallesMiTramiteNegocio />}
                        />
                        <Route
                            path={routes.misNegocios}
                            element={<MisNegocios />}
                        />
                        <Route
                            path={routes.iniciarTramite}
                            element={<IniciarTramite />}
                        />
                        <Route
                            path={routes.iniciarRefrendoLicenciaAlcohol}
                            element={<IniciarRefrendoLicenciaAlcohol />}
                        />
                        <Route
                            path={routes.completaTuPerfil}
                            element={<CompletaTuPerfil />}
                        />
                        <Route
                            path={routes.actualizaPerfil}
                            element={<CrudPersonaFisica />}
                        />
                        <Route
                            path={routes.actualizaPersonaMoral}
                            element={<CrudPersonaMoralContainer />}
                        />
                        <Route
                            path={routes.registrarNegocio}
                            element={<RegistrarNegocio />}
                        />
                        <Route
                            path={routes.detallesNegocio}
                            element={<MiNegocioDetalles />}
                        />
                        <Route
                            path={routes.homeNegocios}
                            element={<HomeNegocio />}
                        />
                        <Route
                            path={routes.revisionTramites}
                            element={<RevisionTramites />}
                        />
                        <Route
                            path={routes.detallesTramite}
                            element={<DetallesTramite />}
                        />
                        <Route
                            path={routes.revisionNegocios}
                            element={<Negocios key="revision-de-negocios" />}
                        />
                        <Route
                            path={routes.detallesNegocioEntidad}
                            element={<DetallesNegociosEntidad />}
                        />
                        {/* Negocios */}
                        <Route
                            path={routes.negociosPadron}
                            element={<Padron />}
                        />
                        <Route
                            path={routes.negociosMapa}
                            element={<MapaNegocios />}
                        />
                        <Route
                            path={routes.negociosMapaFilters}
                            element={<MapaEntidadRevisora />}
                        />
                        <Route
                            path={routes.resolutivos}
                            element={<NegociosResolutivos />}
                        />
                        <Route
                            path={routes.resolutivosNegocio}
                            element={<Resolutivos />}
                        />
                        <Route path={routes.UMAS} element={<UMAS />} />
                        {/* Local */}
                        <Route path={routes.local} element={<Lista />} />
                        <Route path={routes.localAlta} element={<Graba />} />
                        <Route path={routes.localEdit} element={<Edit />} />
                        {/* Local */}
                        <Route
                            path={routes.comercioAdmin}
                            element={<ComercioAdmin />}
                        />
                        <Route
                            path={routes.comercioAdminNegocio}
                            element={<ComercioAdminNegocio />}
                        />
                        <Route
                            path={routes.comercionAdminHomeNegocios}
                            element={<ComercioAdminHomeNegocio />}
                        />
                        <Route
                            path={routes.editarNegocioComercioAdmin}
                            element={<EditarNegocioComercioAdmin />}
                        />
                         <Route
                            path={routes.alcoholesCrud}
                            element={<LicenciaAlcoholes />}
                        />
                        <Route
                            path={routes.alcoholesCargaLicencias}
                            element={<LicenciaAlcoholes />}
                        />
                        <Route
                            path={routes.alcoholesVerLicencias}
                            element={<LicenciaAlcoholes />}
                        />
                        <Route
                            path={routes.comercioAdminBusquedaNegocio}
                            element={<ComercioAdminBusquedaNegocio />}
                        />
                        <Route
                            path={routes.cambioTipoRecoleccion}
                            element={<CambioTipoRecoleccion />}
                        />
                        <Route path={routes.comercioSarePro}
                            element={<ComercioSarePro />}
                        />
                        <Route
                            path={routes.revisionNegociosProSare}
                            element={<Negocios key="revision-de-negocios-pro-sare" esProSare={true} />}
                        />
                           <Route
                            path={routes.ayuda}
                            element={<Ayuda />}
                        />
                    </Routes>
                </Layout.Content>
            </Layout>
        </Layout>
    );
}

export default App;
