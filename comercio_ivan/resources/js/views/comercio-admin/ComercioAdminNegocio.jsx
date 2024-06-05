import React, { useEffect, useState } from "react";
import impactos from "../../utils/impactoGiroComercial";
import status from "../../utils/statuses";
import {
    Row,
    Col,
    Divider,
    Button,
    Input,
    Tag,
    Card,
    message,
    Tabs
} from "antd";
import axios from "axios";
import GoogleMapReact from "google-map-react";
import { PushpinOutlined } from "@ant-design/icons";
import NegocioDetallesModal from "../components/NegocioDetallesModal";
import DocumentosUsuariosGrid from "../revision/componentes/documentosUsuarios";
import ObservacionesTimeline from "../revision/componentes/observacionesTimeline";
import { isArray } from "lodash";

import GeneralHeader from "../revision/detalles-components/GeneralHeader";
import PropietarioInfo from "../revision/detalles-components/PropietarioInfo";
import PersonaMoralInfo from "../revision/detalles-components/PersonaMoralInfo";
import DireccionInfo from "../revision/detalles-components/DireccionInfo";
import MasDetallesInfo from "../revision/detalles-components/MasDetallesInfo";

const Marker = () => (
    <PushpinOutlined
        style={{
            transform: "translate(-7%, -100%)",
            fontSize: 30,
            color: "red",
        }}
    />
);

function ComercioAdminNegocio(props) {
    const [pos, setPos] = useState(null);
    const [negocio, setNegocio] = useState(null);
    const [hasRevision, setHasRevision] = useState(false);
    const [textoRevision, setTextoRevision] = useState("");
    const [modalNegocioDetallesAbierto, setModalNegocioDetallesAbierto] =
        useState(false);
    const [negocioValidado, setNegocioValidado] = useState(false);
    const [documentosFromUsers, setDocumentosFromUsers] = useState([]);

    const negocioId = location.pathname.split("/")[4];
    const selectedYear = location.pathname.split("/")[5]
    if (!negocioId) {
        return;
    }

    // alert('')

    const crearRevisionSiNoExiste = () => {
        axios
            .get(`/app/crear-revision-para-entidad-revisora/${negocioId}`)
            .then((response) => {
                if (response.data.revision_creada) {
                    location.reload();
                }
            });
    };

    const fetchNegocio = async () => {
        axios.get(`/app/negocio-entidad-revisora/${negocioId}/${5}/${selectedYear}`)
            .then((result) => {
                let data = result.data;
                setNegocio(data);
                // debugger
                setPos({
                    lat: +data.direccion.latitud,
                    lng: +data.direccion.longitude,
                });
            });
    };

    const enviarRevision = () => {
        const revision = negocio.revisiones.find(
            (r) => r.entidad_revision_id === 5
        );
        let nuevaRevision = {
            user_id: window.user.id,
            _token: document.head.querySelector('meta[name="csrf-token"]').content ?? window.csrf,
            observacion: textoRevision,
            negocio_id: negocio.id,
            entidad_id: 5,
            status: status.EN_REVISION,
            revision_id: revision.id,
        };
        axios
            .post("/app/observaciones-comercio-admin", nuevaRevision)
            .then(() => {
                message.success("Observación realizada");
                setTextoRevision("");
            })
            .catch(() => message.error("Error al crear observación"));
    };

    const darVistoBueno = () => {
        const revision = negocio.revisiones.find(
            (r) => r.entidad_revision_id === 5
        );
        let nuevaRevision = {
            status: status.VISTO_BUENO,
            user_id: window.user.id,
            revision_id: revision.id,
        };
        axios
            .post("/app/observaciones-comercio-admin", nuevaRevision)
            .then(() => {
                message.success("Observación realizada");
                setNegocioValidado(true);
            })
            .catch(() => message.error("Error al dar visto bueno"));
    };

    const documentosFromUserRequisitos = () => {
        if (!negocio) {
            return;
        }

        var requisitosArray = [];

        if (
            negocio.persona_moral != null &&
            negocio.persona_moral != undefined
        ) {
            let requisito_json = {
                id: negocio?.persona_moral?.persona_id,
                nombre: "Acta Constitutiva",
                // 'archivo_path': negocio?.persona_moral?.acta_constitutiva_path,
                descripcion: "Acta Constitutiva",
                archivo_path: negocio?.persona_moral?.acta_constitutiva_path,
            };
            requisitosArray.push(requisito_json);
        }

        negocio.usuario_requisitos?.map((usuario_requisitos) => {
            let requisito_json = {
                id: usuario_requisitos?.id,
                nombre: usuario_requisitos?.requisito?.nombre,
                archivo_path: usuario_requisitos?.archivo_path,
                requisito_id: usuario_requisitos?.requisito_id,
                descripcion: usuario_requisitos?.requisito?.descripcion,
            };
            requisitosArray.push(requisito_json);
        });

        return requisitosArray;
    };

    // const revisionesSorted = negocio?.revisiones?.sort(function (a, b) {
    //     return b.id - a.id;
    // })

    let entidadRevisionIdDeseada;

    if (window.user.entidad_revision == 5) {
        // Si la entidad_revision del usuario es 5, entonces entidadRevisionIdDeseada puede ser 5 o 6
        //entidadRevisionIdDeseada = [5, 6];
        entidadRevisionIdDeseada = [5];
    } else {
        // En otros casos, entidadRevisionIdDeseada es igual a la entidad_revision del usuario
        entidadRevisionIdDeseada = window.user.entidad_revision;
    }

    const revisionesSorted = negocio?.revisiones
    ?.filter(revision => entidadRevisionIdDeseada.includes(revision.entidad_revision_id))
    ?.sort((a, b) => a.id - b.id);

    const observacionesFormateadas = revisionesSorted?.flatMap((revision) => {
        return revision?.estados_revision?.map((estadoRevision) => {
            console.log("revisionesSorted", revisionesSorted);
            console.log("Estado revision: ", estadoRevision)
            const requisitos = estadoRevision?.requisitos?.map((requisito) => {
                return {
                    id_requisito: requisito.id,
                    nombre_requisito: requisito.requisito.nombre,
                    descripcion: requisito.requisito.descripcion,
                    status_requisito: requisito.status,
                };
            });
            const revisor = estadoRevision?.revisor;
            const revisorName = `${revisor?.nombre} ${revisor?.apellido_pat} ${revisor?.apellido_mot}`
            return {
                id: estadoRevision.id,
                status: estadoRevision.status,
                observacion: estadoRevision.observaciones,
                created_at: estadoRevision.created_at,
                nombre_revisor: revisorName,
                negociosRequisitosArray: requisitos,
            };
        });
    });

    useEffect(() => {
        setDocumentosFromUsers(documentosFromUserRequisitos());

        const revision = negocio?.revisiones?.find(
            (r) => r.entidad_revision_id === 5
        );
        if(revision != null && revision != undefined) {
            setHasRevision(true)
        }
    }, [negocio]);

    useEffect(() => {
        crearRevisionSiNoExiste();
        fetchNegocio();
    }, []);

    return (
        !!negocio && (
            <div className="sare--container" style={{ backgroundColor: '#E0E0E0' }}>
                <GeneralHeader negocio={negocio} />
                <PropietarioInfo negocio={negocio} />
                <PersonaMoralInfo negocio={negocio} />
                <DireccionInfo negocio={negocio} pos={pos} />
                <MasDetallesInfo negocio={negocio} />

                <Card className="detalles-entidad-card-container">
                    <Tabs defaultActiveKey="1">
                        <Tabs.TabPane
                            tab="Documentos"
                            key="1"
                            forceRender={true}
                        >
                            <Row
                                gutter={[24, { xs: 8, sm: 8, md: 24, lg: 32 }]}
                                className="negocio-info-row"
                            >
                                <Col className="gutter-row" xs={24} sm={24} lg={12} xl={12}>
                                    <DocumentosUsuariosGrid
                                        documentosUsuariosRequisitos={documentosFromUsers}
                                    />
                                </Col>
                            </Row>
                            </Tabs.TabPane>
                        <Tabs.TabPane
                            tab="Observaciones"
                            key="3"
                            forceRender={true}>
                            <ObservacionesTimeline observacionesHistorial={observacionesFormateadas}/>
                        </Tabs.TabPane>
                    </Tabs>
                </Card>
                <NegocioDetallesModal
                    visible={modalNegocioDetallesAbierto}
                    onOk={() => setModalNegocioDetallesAbierto(false)}
                    onCancel={() => setModalNegocioDetallesAbierto(false)}
                    negocio={negocio}
                />

                {
                    window.user.role != "ComercioAdminVisor" ? (
                        <>
                        <Card className="detalles-entidad-card-container">
                            <h4>Documentos del usuario</h4>
                            {!hasRevision ? (
                                <p>No hay revisiones para este negocio</p>
                            ) : negocio.validado_por || negocioValidado ? (
                                <Tag color="green">
                                    <span style={{ fontWeight: "bold", fontSize: 16 }}>
                                        Este negocio se encuentra validado
                                    </span>
                                </Tag>

                            ) : (

                                <>
                                    <Input.TextArea
                                        value={textoRevision}
                                        onInput={(e) => setTextoRevision(e.target.value)}
                                        placeholder="Mensaje revisión"
                                    />
                                    <p>&nbsp;</p>
                                    <Button
                                        disabled={!textoRevision}
                                        onClick={enviarRevision}
                                        type="primary"
                                    >
                                        Enviar revisión
                                    </Button>

                                    <Button onClick={darVistoBueno} type="success">
                                        Visto bueno
                                    </Button>

                                </>
                            )}
                            </Card>
                        </>
                    ) : null
                }

            </div>
        )
    );
}

export default ComercioAdminNegocio;
