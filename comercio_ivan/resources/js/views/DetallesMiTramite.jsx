import React, { useState, useEffect } from "react";
import { Spin, Table, Space, Tabs, Tag, Button, Divider, Modal, Timeline, Upload } from "antd";
import { CloudDownloadOutlined, UploadOutlined } from "@ant-design/icons";

import TablaDeRevisiones from "../components/TablaDeRevisiones/TablaDeRevisiones";
import moment from "moment";
import status from "../utils/statuses";
import RolesRouter from "./RolesRouter";
import RequisitoListItem from "../components/RequisitoListItem";

const formatDate = (date) => moment(date).format("DD/MM/YYYY HH a");

function DetallesMiTramite() {
    const [tramitePadre, setTramitePadre] = useState(null);
    const [tramitePadreId, setTramitePadreId] = useState(0);
    const [tramiteId, setTramiteId] = useState(null)

    useEffect(() => {
        if(!location.pathname.includes('/app/mis-tramites/')) {
            console.error('Ruta cambiada, tramite id no disponible');
            return;
        }

        const _tramitePadreId = location.pathname.split('/')[3];
        setTramitePadreId(_tramitePadreId);
    }, []);

    useEffect(() => {
        if(!tramitePadreId || tramitePadreId == 0)
            return;
        loadTramitePadre();
    }, [tramitePadreId]);

    const loadTramitePadre = () => {
        axios.get('/app/tramites/' + tramitePadreId)
            .then(response => {
                setTramitePadre(response.data);
            })
            .catch(error => console.error(error));
    };

    let nombrePersona, nombreTramite, revisionTramite, revisiones;

    if(tramitePadre) {
        const persona = tramitePadre.tramitable;
        const isPersonaMoral = persona.persona_id != null;

        nombrePersona = isPersonaMoral
            ? persona.razon_social
            : `${persona.apellido_pat} ${persona.apellido_mot}, ${persona.nombre}`;

        nombreTramite = tramitePadre.catalogo_tramites?.[0]?.nombre;

        revisiones = tramitePadre.tramites.flatMap((tramite) => {
            return tramite.ultima_revision;
        })
    }

    if(tramiteId !== null) {
        revisionTramite = tramitePadre?.tramites?.find(t => t.id === tramiteId)?.ultima_revision;
    }

    return (
        <div className="sare--container">
            <div>
                <p>
                    <b>Trámite:</b> {nombreTramite}
                </p>
                <p>
                    <b>Nombre:</b> {nombrePersona}
                </p>
            </div>

            <TablaDeRevisiones
                onTramiteIdSelected={setTramiteId}
                data={tramitePadre?.tramites ?? []}
            />

            <Modal
                destroyOnClose
                open={tramiteId !== null}
                onCancel={() => {
                    setTramiteId(null);
                }}
                onOk={() => {
                    setTramiteId(null);
                }}
                footer={[
                    <Button onClick={() => setTramiteId(null)}>Ok</Button>,
                ]}
            >
                <h5>Requisitos</h5>
                <br />
                <Timeline>
                    {
                        !!revisionTramite && revisionTramite.estados_revision.map(
                            (estado_revision) => {
                                return (
                                    <Timeline.Item
                                        key={estado_revision.id}
                                        dot={status.iconoConColor(
                                            estado_revision.status
                                        )}
                                    >
                                        {!!estado_revision.observaciones ? (
                                            <p>
                                                {estado_revision.observaciones}
                                            </p>
                                        ) : (
                                            <p style={{ color: "gray" }}>
                                                Revisión sin observaciones
                                            </p>
                                        )}
                                        {!!estado_revision.requisitos
                                            .length ? (
                                            <small>
                                                {formatDate(estado_revision.created_at)}·
                                                Requisitos solicitados
                                            </small>
                                        ) : (
                                            <small style={{ color: "gray" }}>
                                                {formatDate(estado_revision.created_at)}·
                                                No se solicitaron requisitos
                                            </small>
                                        )}
                                        {!!estado_revision.requisitos
                                            .length && (
                                            <ul>
                                                {estado_revision.requisitos.map(
                                                    (requisito, index) => {
                                                        return (
                                                            <li
                                                                key={
                                                                    "nr" + index
                                                                }
                                                            >
                                                                <Tag
                                                                    color={status.color(
                                                                        requisito.status
                                                                    )}
                                                                >
                                                                    {status.icono(
                                                                        requisito.status
                                                                    )}{" "}
                                                                    ·{" "}
                                                                    {
                                                                        requisito.status
                                                                    }{" "}
                                                                    --{" "}
                                                                    {
                                                                        requisito
                                                                            .requisito
                                                                            .descripcion
                                                                    }
                                                                </Tag>
                                                            </li>
                                                        );
                                                    }
                                                )}
                                            </ul>
                                        )}
                                    </Timeline.Item>
                                );
                            }
                        )}
                </Timeline>
            </Modal>

            <Tabs>
                <Tabs.TabPane tab="Requisitos" key="item-1">
                    <h6>Documentacion requerida</h6>

                    <div>
                        <div className="sare--list-item">
                            <small style={{ color: "gray" }}>
                                vista previa
                            </small>
                            <small style={{ color: "gray" }}>estatus</small>
                            <small style={{ color: "gray" }}>requisito</small>
                            <small style={{ color: "gray" }}>acciones</small>
                        </div>
                        {!!revisiones &&
                            revisiones.map((revision) => {
                                return revision.estados_revision.map(
                                    (estado_revision) => {
                                        return estado_revision.requisitos.map(
                                            (requisito) =>
                                                <RequisitoListItem
                                                    requisito={requisito}
                                                    revisionStatus={revision.status}
                                                    estadoRevisionId={estado_revision.id}
                                                    reload={() => loadTramitePadre()}
                                                />
                                        );
                                    }
                                );
                            })}
                    </div>
                </Tabs.TabPane>
                {/* <Tabs.TabPane tab="Condicionantes" key="item-2">
                    <Timeline>
                        {!!negocio.revisiones &&
                            negocio.revisiones.map((revision) => {
                                console.log("CONDICIONANTE REVISION: ", revision)
                                return (
                                    <div>
                                        <h4>{revision?.entidad?.nombre}</h4>
                                        {
                                            !!revision.condicionantes_revision && revision.condicionantes_revision.map(
                                                (condicionante_revision) => {
                                                    return (

                                                        <Timeline.Item
                                                            key={
                                                                "condicionante_revision" +
                                                                condicionante_revision.id
                                                            }>
                                                            {
                                                                condicionante_revision
                                                                    .condicionante
                                                                    .descripcion
                                                            }
                                                        </Timeline.Item>

                                                    );
                                                }
                                            )
                                        }

                                    </div>
                                );
                            })}
                    </Timeline>
                </Tabs.TabPane> */}
            </Tabs>
        </div>
    );
}

export default DetallesMiTramite;
