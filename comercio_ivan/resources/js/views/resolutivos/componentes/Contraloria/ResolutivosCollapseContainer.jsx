import React from "react";
import RolesRouter from "../../../RolesRouter";
import { Collapse, PageHeader } from "antd";
const { Panel } = Collapse;
const containerStyles = { padding: 15, backgroundColor: "#fff" };
import ConstanciaInhabilitacion from "./ConstanciaInhabilitacion";
import ConstanciaNoSujecion from "./ConstanciaNoSujecion";
import LicenciaFuncionamientoAlcoholes from "../../../resolutivos/componentes/Forms/LicenciaFuncionamientoAlcoholes";

export default function ResolutivosCollapseContainer({ tramite }) {
    return (
        <div className="resolutivos">
            <RolesRouter />
            <PageHeader
                className="site-page-header"
                title="Resolutivos"
                subTitle=""
                style={containerStyles}
            />
            <div style={containerStyles}>
                <Collapse onChange={(e) => console.log({ e })} accordion={true}>
                    {tramite?.catalogo_tramite_id === 18 && (
                        <Panel
                            header="CONSTANCIA DE NO INHABILITACIÓN PARA TRABAJAR EN LA ADMINISTRACIÓN PÚBLICA MUNICIPAL"
                            key="4"
                        >
                            <ConstanciaInhabilitacion
                                tramite={{
                                    ...tramite,
                                    resolutivo_tramite_id: tramite?.id,
                                }}
                            />
                        </Panel>
                    )}

                    {tramite?.catalogo_tramite_id === 20 && (
                        <Panel
                            header="CONSTANCIA DE NO SUJECIÓN A PROCEDIMIENTO ADMINISTRATIVO"
                            key="5"
                        >
                            <ConstanciaNoSujecion
                                tramite={{
                                    ...tramite,
                                    resolutivo_tramite_id: tramite?.id,
                                }}
                            />
                        </Panel>
                    )}
                    {tramite?.catalogo_tramite_id === 16 && (<Panel
                        header="LICENCIA ALCOHOLES"
                        key="5"
                    ><LicenciaFuncionamientoAlcoholes
                            tramite={{
                                ...tramite,
                                //licencia: null,
                                negocio_operador: tramite?.licencia?.negocio_operador,
                                resolutivo_tramite_id: tramite?.id,
                            }}
                        /></Panel>

                    )}
                </Collapse>
            </div>
        </div>
    );
}
