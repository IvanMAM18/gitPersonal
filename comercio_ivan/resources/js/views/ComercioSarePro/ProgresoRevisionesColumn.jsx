import React from 'react'
import {
    Button,
    Divider,
    Tag,
} from "antd";
import status from "../../utils/statuses";

export default function ProgresoRevisionesColumn({ revision, negocio, openModal, abrirAvisoEntero }) {
    const getProgresoRevisiones = (revision, negocio) => {
        const tramite = negocio?.tramites?.find(
            (_tramite) => {
                const entidadRevisoraId = _tramite.catalogo_tramite?.entidad_revisora_id || 0;
                return entidadRevisoraId === revision.entidad_revision_id;
            }
        );

        if (!tramite) {
            return (
                <span key={"erid" + revision.id}>
                    <span className="comercio-admin-progreso-row">
                        <a onClick={() => openModal(revision)} >
                            {revision.entidad.nombre}
                        </a>
                        <Tag
                            color={status.color(
                                revision.status
                            )}
                        >
                            {revision.status}
                        </Tag>
                    </span>
                    <Divider type="vertical" />
                </span>
            );
        }

        const catalogoTramite =
            tramite?.catalogo_tramite;

        const avisoEntero = tramite?.aviso_entero;

        const estadoAvisoEntero =
            avisoEntero?.estado ?? "PENDIENTE";

        const avisoVigentePagado = ["VIGENTE", "PAGADO"]?.includes(estadoAvisoEntero)

        return (
            <span key={"erid" + revision?.id}>
                <span className="comercio-admin-progreso-row">
                    <a onClick={() => openModal(revision)}>
                        {revision.entidad.nombre}
                    </a>
                    <Tag color={status.color(revision.status)} >
                        {revision.status}
                    </Tag>

                    {catalogoTramite?.pago ? (
                        <Tag color="gold">
                            Requiere pago
                        </Tag>
                    ) : (
                        <Tag>No requiere pago</Tag>
                    )}

                    {catalogoTramite?.pago ? (
                        <Tag>
                            AVISO {estadoAvisoEntero}
                        </Tag>
                    ) : null}

                    {avisoVigentePagado ?
                        <Button
                            onClick={() => abrirAvisoEntero(tramite?.aviso_entero)}
                            size={"small"}
                            type="primary"
                        >
                            VER AVISO
                        </Button> : null
                    }
                </span>
                <Divider type="vertical" />
            </span>
        );
    }
    return (
        <>{getProgresoRevisiones(revision, negocio)}</>
    )
}
