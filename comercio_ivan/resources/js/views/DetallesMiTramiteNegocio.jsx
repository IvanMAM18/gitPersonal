import React, { useEffect, useState } from "react";
import TablaDeRevisiones from "../components/TablaDeRevisiones/TablaDeRevisiones";
import { Divider, Tabs } from "antd";
import { CloudDownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { Timeline, Upload, Button, Tag, Image, message, Modal } from "antd";
import { useNavigate } from "react-router";
import moment from "moment";

import status from "../utils/statuses";
import RolesRouter from "./RolesRouter";
import impactos from "../utils/impactoGiroComercial";

const d = (date) => moment(date).format("DD/MM/YYYY HH a");

function MiNegocioDetalles() {
    const [negocio, setNegocio] = useState({});
    const [tramiteId, setTramiteId] = useState(null);

    const navigate = useNavigate();

    const reload = () => {
        const routeArray = location.href.split("/");
        const tramiteId = routeArray[routeArray.length - 1];
        axios.get('/app/negocio/tramite/' + tramiteId)
            .then(result => {
                console.log("NEGOCIO DETALLES: ", result.data)
                setNegocio(result.data)
            })
    };

    useEffect(() => {
        reload();
    }, []);

    const revisionActual = negocio?.revisiones?.find((r) => r.tramite_id === tramiteId);

    return (
        <div className="sare--container">
            <RolesRouter />
            <div>
                <p>
                    <b>Trámite:</b>{" "}
                    {negocio.catalogo_tramite && negocio.catalogo_tramite.nombre}
                </p>
                <p>
                    <b>Nombre:</b> {negocio.nombre_del_negocio}
                </p>
                <p>
                    <b>Impacto:</b>{" "}
                    {impactos.tag(negocio.impacto_giro_comercial)}
                </p>
                {/* <p>
                    <b>Estado:</b> {status.tag[negocio.status]}
                </p> */}
            </div>

            <TablaDeRevisiones
                onTramiteIdSelected={setTramiteId}
                data={negocio?.tramites ?? []}
                resolutivos={negocio?.resolutivos}
                giro_comercial={negocio?.giro_comercial ?? []}
                num_empleados_h={negocio?.no_empleados_h ?? 0}
                num_empleados_m={negocio?.no_empleados_m ?? 0}
                superficie_mayor_250={negocio?.superficie_m2 ?? 0}
                tipo_predio_propiedad={negocio?.tipo_predio_propiedad ?? ""}
                nombre_tramite_comercio={
                    negocio?.tramites_comercio?.[0]?.tramites?.[0]
                        ?.catalogo_tramites?.[0]?.nombre
                }
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
                {!!revisionActual && revisionActual.length && <h5>Requisitos</h5>}
                <br />
                <Timeline>
                    {!!revisionActual && revisionActual.estados_revision.map(
                            (estado_revision) => {
                                return (
                                    <Timeline.Item
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
                                        {!!estado_revision.negocio_requisitos
                                            .length ? (
                                            <small>
                                                {d(estado_revision.created_at)}·
                                                Requisitos solicitados
                                            </small>
                                        ) : (
                                            <small style={{ color: "gray" }}>
                                                {d(estado_revision.created_at)}·
                                                No se solicitaron requisitos
                                            </small>
                                        )}
                                        {!!estado_revision.negocio_requisitos
                                            .length && (
                                            <ul>
                                                {estado_revision.negocio_requisitos.map(
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
                    <h6>Documentacion de negocio requeridos</h6>

                    <div>
                        <div className="sare--list-item">
                            <small style={{ color: "gray" }}>
                                vista previa
                            </small>
                            <small style={{ color: "gray" }}>estatus</small>
                            <small style={{ color: "gray" }}>requisito</small>
                            <small style={{ color: "gray" }}>acciones</small>
                        </div>
                        {!!negocio.revisiones &&
                            negocio.revisiones.map((revision) => {
                                return revision.estados_revision.map(
                                    (estado_revision) => {
                                        return estado_revision.negocio_requisitos.map(
                                            (requisito) => {
                                                const uploadProps = {
                                                    accept: "application/pdf,img/png,img/jpg,img/jpeg",
                                                    name: requisito.requisito
                                                        .codigo,
                                                    action:
                                                        "/app/file-negocio-profile-update/" +
                                                        requisito.requisito
                                                            .codigo,
                                                    data: {
                                                        _token: document.head.querySelector('meta[name="csrf-token"]').content  ?? window.csrf,
                                                        filename:
                                                            requisito.requisito
                                                                .codigo,
                                                        estado_revision_id:
                                                            estado_revision.id,
                                                        negocio_id: negocio.id,
                                                    },
                                                    onChange(info) {
                                                        if (
                                                            info.file.status !==
                                                            "uploading"
                                                        ) {
                                                        }
                                                        if (
                                                            info.file.status ===
                                                            "done"
                                                        ) {
                                                            reload();
                                                        } else if (
                                                            info.file.status ===
                                                            "error"
                                                        ) {
                                                            message.error(
                                                                `${info.file.name} file upload failed.`
                                                            );
                                                        }
                                                    },
                                                };

                                                return (
                                                    <div
                                                        className="sare--list-item"
                                                        key={
                                                            "requisito" +
                                                            requisito.id
                                                        }
                                                    >
                                                        {!!requisito.requisito
                                                            .negocio_archivo ? (
                                                            requisito.requisito.negocio_archivo.archivo_path.endsWith(
                                                                "jpg"
                                                            ) ||
                                                            requisito.requisito.negocio_archivo.archivo_path.endsWith(
                                                                "JPG"
                                                            ) ||
                                                            requisito.requisito.negocio_archivo.archivo_path.endsWith(
                                                                "PNG"
                                                            ) ||
                                                            requisito.requisito.negocio_archivo.archivo_path.endsWith(
                                                                "png"
                                                            ) ? (
                                                                <Image
                                                                    width={100}
                                                                    height={100}
                                                                    src={
                                                                        "/" +
                                                                        requisito
                                                                            .requisito
                                                                            .negocio_archivo
                                                                            .archivo_path
                                                                    }
                                                                />
                                                            ) : (
                                                                <a
                                                                    href={
                                                                        "/" +
                                                                        requisito
                                                                            .requisito
                                                                            .negocio_archivo
                                                                            .archivo_path
                                                                    }
                                                                    target="_blank"
                                                                >
                                                                    VER
                                                                    DOCUMENTO
                                                                </a>
                                                            )
                                                        ) : (
                                                            <Tag>N/D</Tag>
                                                        )}

                                                        <Tag
                                                            color={status.color(
                                                                requisito.status
                                                            )}
                                                        >
                                                            <span
                                                                style={{
                                                                    fontSize: 15,
                                                                }}
                                                            >
                                                                {status.icono(
                                                                    requisito.status
                                                                )}
                                                                &nbsp;
                                                                {
                                                                    requisito.status
                                                                }
                                                            </span>
                                                        </Tag>

                                                        <h6>
                                                            {
                                                                requisito
                                                                    .requisito
                                                                    .descripcion
                                                            }
                                                        </h6>

                                                        <Upload
                                                            {...uploadProps}
                                                        >
                                                            <Button>
                                                                <UploadOutlined />
                                                                {!!requisito
                                                                    .requisito
                                                                    .negocio_archivo
                                                                    ? "Resubir"
                                                                    : "Subir requisito"}
                                                            </Button>
                                                        </Upload>
                                                    </div>
                                                );
                                            }
                                        );
                                    }
                                );
                            })}
                    </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Condicionantes" key="item-2">
                    <Timeline>
                        {!!negocio.revisiones &&
                            negocio.revisiones.map((revision) => {
                                return (
                                    <div>
                                        <h4>{revision?.entidad?.nombre}</h4>
                                        {!!revision.condicionantes_revision &&
                                            revision.condicionantes_revision.map(
                                                (condicionante_revision) => {
                                                    return (
                                                        <Timeline.Item
                                                            key={
                                                                "condicionante_revision" +
                                                                condicionante_revision.id
                                                            }
                                                        >
                                                            {
                                                                condicionante_revision
                                                                    .condicionante
                                                                    .descripcion
                                                            }
                                                        </Timeline.Item>
                                                    );
                                                }
                                            )}
                                    </div>
                                );
                            })}
                    </Timeline>
                </Tabs.TabPane>
            </Tabs>
            {/*
                negocio?.nivel_recoleccion_basura === 'cuenta_propia' &&
                <>
                    <Divider orientation="left">FORMULARIO DE CONVENIO POR USO DEL RELLENO SANITARIO:</Divider>
                    <Button icon={<CloudDownloadOutlined />} type="primary" target="_blank" href="/CONVENIO_POR_USO_DEL_RELLENO_SANITARIO.pdf">Descargar PDF</Button>
                </>*/}

            {/* <Button onClick={abrirBorrarTramiteModal}>Borrar trámite</Button> */}
        </div>
    );
}

export default MiNegocioDetalles;
