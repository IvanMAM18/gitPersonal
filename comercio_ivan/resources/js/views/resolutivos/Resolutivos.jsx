import { PageHeader, Collapse } from "antd";
import { useEffect, useState } from "react";
import CertificacionMedidasSeguridad from "./componentes/CertificacionMedidasSeguridad";
import DictamenTecnicoEcologia from "./componentes/DictamenTecnicoEcologia";
import LicenciaFuncionamiento from "./componentes/LicenciaFuncionamiento";
import { useParams } from "react-router-dom";
import useGetDetallesNegocioPorId from "../../utils/hooks/useGetDetallesNegocioPorId";
import TramiteUsoDeSuelo from "./componentes/TramiteUsoDeSuelo";
import RolesRouter from "../RolesRouter";
import useGetEntidadRevisoraComercioDirectorRolId from "../../utils/hooks/useGetEntidadRevisoraComercioDirectorRolId";
import LicenciaFuncionamientoAlcoholes from "./componentes/Forms/LicenciaFuncionamientoAlcoholes";

const { Panel } = Collapse;

export default function Resolutivos() {

    const { negocioId } = useParams();
    const [resolutivoTramiteId, setResolutivoTramiteId] = useState(null);
    const loggedUserRolId = parseInt(window?.user?.role_id ?? 0);
    const loggedERId = parseInt(window?.user?.entidad_revision ?? 0);
    const [entidadRevisoraComercioRolId, getEntidadRevisoraComercioRolId] = useGetEntidadRevisoraComercioDirectorRolId();
    const [entidadRevisora] = useState(loggedERId);
    const [negocio, getNegocio] = useGetDetallesNegocioPorId(negocioId, false, localStorage?.currentYearFilter ?? new Date().getFullYear());

    const onCollapseChange = (key) => {
        if (negocio === null) getNegocio(negocioId, entidadRevisora === 6, localStorage?.currentYearFilter ?? new Date().getFullYear());
    };

    useEffect(() => {
        getEntidadRevisoraComercioRolId();
        getNegocio(negocioId, entidadRevisora === 6, localStorage?.currentYearFilter ?? new Date().getFullYear());
    }, []);
    const getFechaCreacionTramite = () => {
        return negocio?.tramite_comercio_padre?.created_at;
    }

    useEffect(() => {
        if (!!negocio) {
            setResolutivoTramiteId(negocio?.tramite_comercio_padre?.id ?? null);
        }
    }, [negocio]);

    return (
        <div className="resolutivos p-4">
            <RolesRouter />
            <PageHeader className="site-page-header bg-white" title="Resolutivos" />

            {entidadRevisoraComercioRolId && resolutivoTramiteId && (
                <div className="mt-4 p-3 bg-white">
                    <Collapse onChange={onCollapseChange} accordion={true}>
                        {entidadRevisora === 1 && (
                            <Panel header="TRÁMITE DE USO DE SUELO" key="0">
                                <TramiteUsoDeSuelo
                                    negocio_data={{
                                        ...negocio,
                                        resolutivo_tramite_id: resolutivoTramiteId,
                                        fecha_creacion_tramite: getFechaCreacionTramite()
                                    }}
                                />
                            </Panel>
                        )}
                        {entidadRevisora === 2 && (
                            <Panel
                                header="CERTIFICACIÓN DE MEDIDAS DE SEGURIDAD - GIROS COMERCIALES"
                                key="1">
                                <CertificacionMedidasSeguridad
                                    negocio_data={{
                                        ...negocio,
                                        resolutivo_tramite_id: resolutivoTramiteId,
                                        fecha_creacion_tramite: getFechaCreacionTramite()
                                    }}
                                />
                            </Panel>
                        )}
                        {entidadRevisora === 3 && (
                            <Panel
                                header="DICTAMEN TÉCNICO DE ECOLOGÍA"
                                key="2"
                            >
                                <DictamenTecnicoEcologia
                                    negocio_data={{
                                        ...negocio,
                                        resolutivo_tramite_id: resolutivoTramiteId,
                                        fecha_creacion_tramite: getFechaCreacionTramite()
                                    }}
                                />
                            </Panel>
                        )}

                        {(entidadRevisora === 5 ||
                            loggedUserRolId ===
                            entidadRevisoraComercioRolId) && (
                                <Panel
                                    header="LICENCIA DE FUNCIONAMIENTO PARA GIROS ESTABLECIDOS COMERCIALES, INDUSTRIALES Y DE SERVICIOS"
                                    key="3"
                                >
                                    <LicenciaFuncionamiento
                                        negocio_data={{
                                            ...negocio,
                                            resolutivo_tramite_id: resolutivoTramiteId,
                                            fecha_creacion_tramite: getFechaCreacionTramite()
                                        }}
                                    />
                                </Panel>
                            )}
                        {entidadRevisora === 6 && (
                            <Panel
                                header="LICENCIA DE VENTA DE ALCOHOL PARA GIROS ESTABLECIDOS COMERCIALES, INDUSTRIALES Y DE SERVICIOS"
                                key="3"
                            >
                                <LicenciaFuncionamientoAlcoholes
                                    negocio_data={{
                                        ...negocio,
                                        resolutivo_tramite_id: resolutivoTramiteId,
                                        fecha_creacion_tramite: getFechaCreacionTramite()
                                    }}
                                />
                            </Panel>
                        )}
                    </Collapse>
                </div>
            )}
        </div>
    );
}
