import {Button, Divider, Tag} from "antd";
import status from "../utils/statuses";
import React, {useEffect, useState} from "react";


function TramiteProgreso({tramite, openModal, abrirAvisoEntero}) {

    return (
        <>
            {/*Revision de Comercio Visor*/}
            {tramite.revisiones[0] &&
                <span key={`comercio-visor-${tramite.revisiones[0].id}`}>
                    <span className="comercio-admin-progreso-row">

                        <a onClick={() => openModal(tramite.revisiones[0])}>
                            {tramite.revisiones[0].entidad.nombre}
                        </a>

                        <Tag color={status.color(tramite.revisiones[0].status)}>
                            {tramite.revisiones[0].status}
                        </Tag>

                    </span>
                    <Divider type="vertical"/>
                </span>
            }

            {/*Revisiones de los Tramites Hijis / Entidades Revisoras*/}
            {tramite.tramites_hijos.map(tramiteHijo =>
                <div key={tramiteHijo.id} className="inline">
                    {tramiteHijo.revisiones.map(revision =>
                        <span key={`entidad-revisora-${revision.id}`}>
                            <span className="comercio-admin-progreso-row">

                                <a onClick={() => openModal(revision)}>
                                    {revision.entidad.nombre}
                                </a>

                                <Tag color={status.color(revision.status)}>
                                    {revision.status}
                                </Tag>

                                {tramiteHijo.catalogo.pago ? (
                                    <Tag color="gold">
                                        Requiere Pago
                                    </Tag>
                                ) : (
                                    <Tag>No Requiere Pago</Tag>
                                )}

                                {tramiteHijo.catalogo.pago ? (
                                    <Tag>
                                        AVISO {tramiteHijo.aviso_entero?.estado ?? 'PENDIENTE'}
                                    </Tag>
                                ) : null }

                                {["VIGENTE", "PAGADO"].includes(tramiteHijo.aviso_entero?.estado) ? (
                                    <Button onClick={() => abrirAvisoEntero(tramiteHijo.aviso_entero)} size={"small"} type="primary">
                                        Ver Aviso
                                    </Button>
                                ) : null }

                            </span>
                            <Divider type="vertical"/>
                        </span>
                    )}
                </div>
            )}
        </>
    );
}

export default TramiteProgreso;
