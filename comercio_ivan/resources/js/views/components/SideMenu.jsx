import React, { useEffect, useState } from "react";
import { Button, Menu, Divider, Row, Col } from "antd";
import { FileSearchOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import {
    AppstoreAddOutlined,
    AppstoreOutlined,
    ExportOutlined,
    DesktopOutlined,
    InfoCircleOutlined,
    FileProtectOutlined,
    BarChartOutlined,
} from "@ant-design/icons";
import { PadronIcon, MapSearchIcon } from "../../components/customIcons";
import routes from "../../utils/react-routes";
import axios from "axios";

function getOpenedMenuOption() {
    const routeName = location.pathname.split("/")[2];

    if (!routeName) {
        return ["1"];
    }

    return {
        // revisiones
        "revision-negocios": ["1"],

        // usuario
        "mis-tramites": ["1"],
        "mis-negocios": ["2"],
        // "registrar-negocio": ["3"],
        expediente: ["4"],
    }[routeName];
}

const userMenuItems = [
    [
        <AppstoreOutlined />,
        <span>Trámites</span>,
        <Link to={routes.misTramites} />,
    ],
    [
        <AppstoreOutlined />,
        <span>Mis Negocios</span>,
        <Link to={routes.misNegocios} />,
    ],
    // [
    //     <DesktopOutlined />,
    //     <span>Registrar negocio</span>,
    //     <Link to={routes.registrarNegocio} />,
    // ],
    [
        <InfoCircleOutlined />,
        <span>Expediente digital</span>,
        <Link to={routes.completaTuPerfil} />,
    ],
    [
        <InfoCircleOutlined />,
        <span>Personas Morales</span>,
        <Link to={routes.actualizaPersonaMoral} />,
    ],
    [
        <InfoCircleOutlined />,
        <span>Actualizar Datos</span>,
        <Link to={routes.actualizaPerfil} />,
    ],
    [
        <FileProtectOutlined />,
        <span>Ayuda</span>,
        <Link to={routes.ayuda} />,
    ],
];

const adminMenuItems = [
    [
        <AppstoreOutlined />,
        <span>Trámites</span>,
        <Link to={routes.misTramites} />,
    ],
    [
        <AppstoreOutlined />,
        <span>Mis Negocios</span>,
        <Link to={routes.misNegocios} />,
    ],
    [
        <DesktopOutlined />,
        <span>Registrar negocio</span>,
        <Link to={routes.registrarNegocio} />,
    ],
    //rutas entidad revisión
    [
        <AppstoreOutlined />,
        <span>Revisión Negocios</span>,
        <Link to={routes.revisionNegocios} />,
    ],
    // aquí terminan las rutas
    [
        <InfoCircleOutlined style={{ color: "coral" }} />,
        <span>Expediente digital</span>,
        <Link to={routes.completaTuPerfil} />,
    ],
];

const entidadMenuItems = [
    //rutas entidad revisión


    [
        <AppstoreOutlined />,
        <span>Revisión Negocios</span>,
        <Link to={routes.revisionNegocios} />,
    ],
    [
        <AppstoreOutlined />,
        <span>PRO SARE</span>,
        <Link to={routes.revisionNegociosProSare} />,
    ],
    [
        <BarChartOutlined />,
        <span>Estadísticas</span>,
        <Link to={routes.homeNegocios} />,
    ],
    // [
    //     <PadronIcon />,
    //     <span>Padron de Negocios</span>,
    //     <Link to={routes.negociosPadron} />,
    // ],
    // [
    //     <MapSearchIcon />,
    //     <span>Mapa de Negocios</span>,
    //     <Link to={routes.negociosMapa} />,
    // ],
    [
        <MapSearchIcon />,
        <span>Mapa de Negocios</span>,
        <Link to={routes.negociosMapaFilters} />,
    ],
    [
        <FileProtectOutlined />,
        <span>Resolutivos</span>,
        <Link to={routes.resolutivos} />,
    ],
];

const localMenuItems = [
    [<AppstoreOutlined />, <span>Inicio</span>, <Link to={routes.local} />],
    [<AppstoreOutlined />, <span>Alta</span>, <Link to={routes.localAlta} />],
];

const comercioAdminMenuItems = [
    [
        <AppstoreOutlined />,
        <span>Negocios</span>,
        <Link to={routes.comercioAdmin} />,
    ],
    [
        <AppstoreOutlined />,
        <span>PRO SARE</span>,
        <Link to={routes.comercioSarePro} />,
    ],
    [
        <MapSearchIcon />,
        <span>Mapa de Negocios</span>,
        <Link to={routes.negociosMapaFilters} />,
    ],
    [
        <FileSearchOutlined />,
        <span>Búsqueda Negocio</span>,
        <Link to={routes.comercioAdminBusquedaNegocio} />,
    ],
    [
        <BarChartOutlined />,
        <span>Estadísticas</span>,
        <Link to={routes.comercionAdminHomeNegocios} />,
    ],
    [
        <FileProtectOutlined />,
        <span>Resolutivos</span>,
        <Link to={routes.resolutivos} />,
    ],
];
const comercioAdminDirectorMenuItems = [
    [
        <AppstoreOutlined />,
        <span>Negocios</span>,
        <Link to={routes.comercioAdmin} />,
    ],
    [
        <AppstoreOutlined />,
        <span> PRO SARE</span>,
        <Link to={routes.comercioSarePro} />,
    ],
    [
        <MapSearchIcon />,
        <span>Mapa de Negocios</span>,
        <Link to={routes.negociosMapaFilters} />,
    ],
    [
        <BarChartOutlined />,
        <span>Estadisticas</span>,
        <Link to={routes.comercionAdminHomeNegocios} />,
    ],
    [
        <FileProtectOutlined />,
        <span>Resolutivos</span>,
        <Link to={routes.resolutivos} />,
    ],
    [
        <FileSearchOutlined />,
        <span>Búsqueda Negocio</span>,
        <Link to={routes.comercioAdminBusquedaNegocio} />,
    ],
    [
        <AppstoreAddOutlined />,
        <span>Alcohol - Tramites</span>,
        <Link to={routes.revisionTramites} />,
    ],
    [
        <FileProtectOutlined />,
        <span>Alcohol - Relacionar Licencia </span>,
        <Link to={routes.alcoholesCrud} />,
    ],
    [
        <AppstoreOutlined />,
        <span>Alcohol -  Negocios</span>,
        <Link to={routes.revisionNegocios} />,
    ],
];
const comercioAdminVisorMenuItems = [
    [
        <AppstoreOutlined />,
        <span>Negocios</span>,
        <Link to={routes.comercioAdmin} />,
    ],
    [
        <AppstoreOutlined />,
        <span> PRO SARE</span>,
        <Link to={routes.comercioSarePro} />,
    ],
    [
        <MapSearchIcon />,
        <span>Mapa de Negocios</span>,
        <Link to={routes.negociosMapaFilters} />,
    ],
    [
        <BarChartOutlined />,
        <span>EstadÍsticas</span>,
        <Link to={routes.comercionAdminHomeNegocios} />,
    ],
];
const entidadAlcoholesMenuItems = [
    //rutas entidad revisión
    [
        <AppstoreAddOutlined />,
        <span>Revisión Tramites</span>,
        <Link to={routes.revisionTramites} />,
    ],
    [
        <AppstoreOutlined />,
        <span>Revisión Negocios</span>,
        <Link to={routes.revisionNegocios} />,
    ],
    [
        <BarChartOutlined />,
        <span>Estadísticas</span>,
        <Link to={routes.homeNegocios} />,
    ],
    // [
    //     <PadronIcon />,
    //     <span>Padron de Negocios</span>,
    //     <Link to={routes.negociosPadron} />,
    // ],
    [
        <MapSearchIcon />,
        <span>Mapa de Negocios</span>,
        <Link to={routes.negociosMapaFilters} />,
    ],
    [
        <FileProtectOutlined />,
        <span>Resolutivos</span>,
        <Link to={routes.resolutivos} />,
    ],
    /*
    [
        <FileProtectOutlined />,
        <span>Resumen de Licencias</span>,
        <Link to={routes.alcoholesVerLicencias} />,
    ],
    [
        <FileProtectOutlined />,
        <span>Cargar Licencias Alcohol</span>,
        <Link to={routes.alcoholesCargaLicencias} />,
    ],*/
];

const entidadAlcoholesAdminMenuItems = [
    //rutas entidad revisión
    [
        <AppstoreAddOutlined />,
        <span>Revisión Tramites</span>,
        <Link to={routes.revisionTramites} />,
    ],
    [
        <AppstoreOutlined />,
        <span>Revisión Negocios</span>,
        <Link to={routes.revisionNegocios} />,
    ],
    [
        <BarChartOutlined />,
        <span>Estadísticas</span>,
        <Link to={routes.homeNegocios} />,
    ],
    // [
    //     <PadronIcon />,
    //     <span>Padron de Negocios</span>,
    //     <Link to={routes.negociosPadron} />,
    // ],
    [
        <MapSearchIcon />,
        <span>Mapa de Negocios</span>,
        <Link to={routes.negociosMapaFilters} />,
    ],
    [
        <FileProtectOutlined />,
        <span>Resolutivos</span>,
        <Link to={routes.resolutivos} />,
    ],
    [
        <FileProtectOutlined />,
        <span>Relacionar Licencia de Alcohol</span>,
        <Link to={routes.alcoholesCrud} />,
    ],
    /*
    [
        <FileProtectOutlined />,
        <span>Resumen de Licencias</span>,
        <Link to={routes.alcoholesVerLicencias} />,
    ],
    [
        <FileProtectOutlined />,
        <span>Cargar Licencias Alcohol</span>,
        <Link to={routes.alcoholesCargaLicencias} />,
    ],*/
];


const entidadContraloriaMenuItems = [
    //rutas entidad revisión
    [
        <AppstoreAddOutlined />,
        <span>Revisión Tramites</span>,
        <Link to={routes.revisionTramites} />,
    ],
    [
        <BarChartOutlined />,
        <span>Estadísticas</span>,
        <Link to={routes.homeNegocios} />,
    ],
    [
        <FileProtectOutlined />,
        <span>Resolutivos</span>,
        <Link to={routes.resolutivos} />,
    ],
];

let menuItems = null;
let url = "";

if (window.user !== undefined) {
    switch (window?.user?.role) {
        case "EntidadRevisora":
        case "EntidadRevisoraDirector":
            if (window?.user?.entidad_revision == 6) {
                if (window?.user?.role_id == 5) {
                    menuItems = entidadAlcoholesAdminMenuItems;
                    break;
                } else {
                    menuItems = entidadAlcoholesMenuItems;
                    break;
                }
            }
            if (window?.user?.entidad_revision == 7) {
                menuItems = entidadContraloriaMenuItems;
                break;
            }
            menuItems = entidadMenuItems;
            url = "/app/entidad-home";
            break;
        case "Superadmin":
            menuItems = adminMenuItems;
            break;
        case "Admin Local":
            menuItems = localMenuItems;
            break;
        case "comercio_admin":
            menuItems = comercioAdminMenuItems;
            break;
        case "EntidadRevisoraDirector":
            menuItems = EntidadRevisoraDirectorMenuItems;
            break;
        case "ComercioDirector":
            menuItems = comercioAdminDirectorMenuItems;
            break;
        case "ComercioAdminVisor":
            menuItems = comercioAdminVisorMenuItems
            break;
        default:
            menuItems = userMenuItems;
            url = "/app/mis-tramites";
            break;
    }
}

export default function SideMenu() {
    return (
        <>
            <Row className="logo-ayuntamiento py-3 px-3">
                <Col className="gutter-row" xs={24}>
                    <a className="navbar-brand" href={url}>
                        <img
                            className="image-escudo"
                            src="/imagenes/ESCUDO_color.png"
                            alt="Ayuntamiento"
                        />
                    </a>
                </Col>
                <Col className="gutter-row text-logo-ayuntamiento" xs={24}>
                    <span>H.XVII Ayuntamiento de La Paz</span>
                </Col>
            </Row>
            <Menu
                defaultSelectedKeys={getOpenedMenuOption()}
                mode="inline"
                theme="light"
            >
                {menuItems?.map((item, index) => {
                    return (
                        <Menu.Item
                            eventkey={(index + 1).toString()}
                            warnkey={(index + 1).toString()}
                            key={(index + 1).toString()}
                        >
                            {item[0]}
                            {item[1]}
                            {item[2]}
                        </Menu.Item>
                    );
                })}
                <Menu.Item eventkey="99" warnkey="99" key="99">
                    <ExportOutlined />
                    <span>Cerrar sesión</span>
                    <Link
                        to="#"
                        onClick={() => {
                            axios.post("/logout")
                                .then((response) => {
                                    window.user = {};
                                    window.csrf = '';
                                    if (response.status === 200) {
                                        window.location.href = "/login";
                                    }
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        }}
                    />
                </Menu.Item>
            </Menu>
        </>
    );
}
