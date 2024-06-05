import React, { useCallback, useEffect, useState } from "react";
import {
    Divider,
    Button,
    Card,
    List,
    Checkbox,
    Input,
    Row,
    Col,
    notification,
    Modal,
    Tabs,
    Space,
    Tag,
} from "antd";

import DocumentosGrid from "./documentosGrid";
import DocumentosUsuariosGrid from "./documentosUsuarios";
import ObservacionesTimeline from "./observacionesTimeline";

function RequisitosObservacionesTabs({ persona, requisitos, requisitosPersona, estadosRevision, onRequisitoRechazado }) {

    if (!requisitos) {
        return (<></>);
    }

    const requisitosFormateados = requisitos.map((requisito) => {
        return {
            id: requisito.id,
            negocio_requisito_id: requisito.id,
            status: requisito.status,
            archivo_path: requisito.requisito?.persona_requisito?.valor,
            descripcion: requisito.requisito?.descripcion,
            accepted: false,
            rechazado: false,
        };
    });

    const requisitosPersonaFormateados = requisitosPersona.map((requisito) => {
        return {
            id: requisito.id,
            negocio_requisito_id: requisito.id,
            status: requisito.status,
            archivo_path: requisito.archivo_path,
            nombre: requisito.requisito.nombre,
            descripcion: requisito.requisito?.descripcion,
            accepted: false,
            rechazado: false,
        };
    });

    const observacionesFormateadas = estadosRevision.map((estadoRevision) => {
        const requisitos = estadoRevision.requisitos.map((requisito) => {
            return {
                id_requisito: requisito.id,
                nombre_requisito: requisito.requisito.nombre,
                descripcion: requisito.requisito.descripcion,
                status_requisito: requisito.status,
            };
        });
        const revisor = estadoRevision?.revisor;
        const revisorName = `${revisor?.nombre ?? ""} ${revisor?.apellido_pat ?? ""} ${revisor?.apellido_mot ?? ""}`
        return {
            id: estadoRevision.id,
            status: estadoRevision.status,
            observacion: estadoRevision.observaciones,
            created_at: estadoRevision.created_at,
            nombre_revisor: revisorName,
            negociosRequisitosArray: requisitos,
        };
    });

    const onDocumentoRechazadoHandler = (e) => {
        e.target.value.accepted = e.target.checked;
        e.target.value.rechazado = e.target.checked;

        if (typeof onRequisitoRechazado === 'function') {
            onRequisitoRechazado({ id: e.target.value.id, rechazado: e.target.checked });
        }
    };

    useEffect(() => {
    }, []);

    return (
        <Tabs defaultActiveKey="1">
            <Tabs.TabPane
                tab="Documentos del tramite"
                key="1"
                forceRender={true}
            >
                <DocumentosGrid
                    negocio={{ revisiones: [] }}
                    documentosAprobados={requisitosFormateados}
                    onChangeAcceptedOrReject={onDocumentoRechazadoHandler}
                />
            </Tabs.TabPane>
            <Tabs.TabPane
                tab="Documentos del usuario"
                key="2"
                forceRender={true}
            >
                <DocumentosUsuariosGrid
                    documentosUsuariosRequisitos={requisitosPersonaFormateados}
                ></DocumentosUsuariosGrid>
            </Tabs.TabPane>
            <Tabs.TabPane
                tab="Observaciones"
                key="3"
                forceRender={true}
            >
                <div className="">
                    <ObservacionesTimeline
                        observacionesHistorial={observacionesFormateadas}
                    ></ObservacionesTimeline>
                </div>
            </Tabs.TabPane>
        </Tabs>
    );
}

export default RequisitosObservacionesTabs;