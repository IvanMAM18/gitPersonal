import React, { useState, useEffect } from "react";
import { Routes, Route, resolvePath } from "react-router-dom";
import { Layout } from "antd";

import IniciarTramite from "@/views/tramites/IniciarTramite.jsx";
import Tramites from "@/views/Tramites.jsx";
import DetallesMiTramite from "@/views/DetallesMiTramite.jsx";
import DetallesMiTramiteNegocio from "@/views/DetallesMiTramiteNegocio.jsx";
import MisNegocios from "@/views/MisNegocios.jsx";
import MiNegocioDetalles from "@/views/MiNegocioDetalles.jsx";
import CompletaTuPerfil from "@/views/CompletaTuPerfil.jsx";
import RegistrarNegocio from "@/views/RegistrarNegocio.jsx";
import LicenciaAlcoholes from "@/views/alcoholes/LicenciaAlcoholes.jsx";
import CrudPersonaFisica from "@/views/components/CrudPersonaFisica.jsx";
import Lista from "@/components/ListaNueva.jsx";
import Graba from "@/components/GrabaSolicitud.jsx";
import Edit from "@/components/Edicion.jsx";
import IniciarRefrendoLicenciaAlcohol from "@/views/tramites/IniciarRefrendoLicenciaAlcohol.jsx";
import RevisionTramites from "@/views/revision/RevisionTramites.jsx";
import DetallesTramite from "@/views/revision/DetallesTramite.jsx";
import CambioTipoRecoleccion from "@/views/revision/servicios-publicos/CambioTipoRecoleccion.jsx";
import Padron from "@/views/Padron.jsx";
import MapaNegocios from "@/views/MapaNegocios.jsx";
import HomeNegocio from "@/views/revision/homeNegocios.jsx";
import SideMenu from "@/views/components/SideMenu.jsx";
import Negocios from "@/views/revision/negocios.jsx";
import DetallesNegociosEntidad from "@/views/revision/detallesNegociosEntidad.jsx";
import UMAS from "@/views/UMAS";
import ComercioAdmin from "@/views/comercio-admin/ComercioAdmin.jsx";
import ComercioAdminHomeNegocio from "@/views/comercio-admin/ComercioAdminHome.jsx";
import ComercioAdminBusquedaNegocio from "@/views/comercio-admin/ComercioAdminBusquedaNegocio.jsx";
import EditarNegocioComercioAdmin from "@/views/comercio-admin/EditarNegocioComercioAdmin.jsx";

import routes from "@/utils/react-routes.jsx";
import useWindowWidth from "@/utils/hooks/useWindowWith.jsx";
// comercio-admin

import Resolutivos from "@/views/resolutivos/Resolutivos.jsx";
import NegociosResolutivos from "@/views/resolutivos/NegociosResolutivos.jsx";
import EntidadHeader from "@/components/EntidadHeader.jsx";
import ComercioAdminNegocio from "@/views/comercio-admin/ComercioAdminNegocio.jsx";
import CrudPersonaMoralContainer from "@/Administrador/CrudsNegocio/CrudPersonaMoralContainer.jsx";
import MapaEntidadRevisora from "@/views/revision/MapaEntidadRevisora.jsx";
import Ayuda from  "@/views/Ayuda.jsx";

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
                        element={<ComercioAdmin key="revision-de-negocios" />}
                    />
                    <Route
                        path={routes.comercioAdminNegocio}
                        element={<ComercioAdminNegocio />}
                    />

                    <Route path={routes.comercioSarePro}
                           element={<ComercioAdmin key="revision-de-negocios-pro-sare"
                                                   esProSare={1}
                                                   pageTitle="Pro Sare - Negocios en Trámite" />}
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
    );
}

export default App;
