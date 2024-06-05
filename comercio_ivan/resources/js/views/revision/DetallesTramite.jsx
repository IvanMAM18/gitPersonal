import React, { useEffect, useState } from "react";
import {
    Divider,
    Button,
    Input,
    Row,
    Col,
    Modal,
    Tag,
    message,
} from "antd";

import InformacionPersona from "./componentes/InformacionPersona";
import RequisitoTextoListItem from "./componentes/RequisitoTextoListItem";
import RequisitosObservacionesTabs from "./componentes/RequisitosObservacionesTabs";
import DocumentosCondicionantesTabs from "./componentes/DocumentosCondicionantesTabs";
import status from "../../utils/statuses";
import TramitePersonaPagos from "../pagos/TramitePersonaPagos";

const { TextArea } = Input;

import MapaUbicacion from "../components/MapaUbicacion";


function DetallesTramite()
{
    const [permisos, setPermisos] = useState({
        aprobarRevision: false,
        rechazarRevision: false,
        solicitarPago: true,
        generarResolutivo: true,
        asignarCondicionantes: true,
    });
    const [tramitePadreId, setTramitePadreId] = useState(0);
    const [tramitePadre, setTramitePadre] = useState(null);
    const [documentos, setDocumentos] = useState([]);
    const [condicionantes, setCondicionantes] = useState([]);
    const [mostrarObservaciones, setMostrarObservaciones] = useState(false);
    const [observaciones, setObservaciones] = useState("");
    const [modalObservacionesVisible, setModalObservacionesVisible] = useState(false);
    const [disableMainButtons, setDisableMainButtons] = useState(false);

    const [modalAprobarRevisionVisible, setModalAprobarRevisionVisible] = useState(false);
    const [modalRechazarRevisionVisible, setModalRechazarRevisionVisible] = useState(false);
    const [requisitosRechazados, setRequisitosRechazados] = useState([]);
    const [requisitosSolicitados, setRequisitosSolicitados] = useState([]);

    const [messageApi, contextHolder] = message.useMessage()

    useEffect(() => {
        if(!location.pathname.includes('/app/tramites/')) {
            console.error('Ruta cambiada, tramite id no disponible');
            return;
        }
        const _tramitePadreId = location.pathname.split('/')[3];
        setTramitePadreId(_tramitePadreId);
    }, []);

    useEffect(() => {
        if(tramitePadreId == 0)
            return;

        loadTramite();
        loadDocumentos();
    }, [tramitePadreId]);

    useEffect(() => {
        if(tramitePadre == null)
            return;

        establecerPermisos();
    }, [tramitePadre])

    useEffect(() => {
        if(!tramitePadre || !documentos.length)
            return;

        filtrarDocumentos();
    }, [tramitePadre, documentos]);

    const loadTramite = () => {
        axios
            .get(`/entidad-revision/tramites/${tramitePadreId}/detalles`)
            .then((response) => {
                setTramitePadre(response.data);
            })
            .catch(error => console.error(error));
    };

    const loadDocumentos = () => {
        axios
            .get("/entidad-revision/requisitos")
            .then((response) => {
                setDocumentos(
                    response.data.map(documento => ({
                        ...documento,
                        key: documento.id,
                        status: -1,
                        disabled: false,
                    }))
                );
            })
            .catch(error => console.error(error));
    };

    const loadCondicionantes = () => {

    };

    const filtrarDocumentos = () => {
        const requisitos = tramitePadre.tramite_entidad_revision.ultima_revision.estados_revision.flatMap(
            (estadoRevision) => {
                return estadoRevision.requisitos;
            }
        );
        const _documentos = documentos.map(documento => {
            const disabled = requisitos.findIndex(
                    requisito => requisito.requisito.id == documento.id
                ) >= 0;
            return {
                ...documento,
                status: disabled ? 1 : -1,
                disabled
            };
        });

        setDocumentos(_documentos);
    };

    const establecerPermisos = () => {
        const entidadRevisionId = tramitePadre.tramite_entidad_revision.
            ultima_revision.entidad_revision_id;
        let puedeSolicitarPago, puedeGenerarResolutivo, puedeAsignarCondicionantes;
        puedeSolicitarPago = puedeGenerarResolutivo = puedeAsignarCondicionantes =
            [1,2,3,4,5,6];

        let puedeAprobar = [1,2,3,4,5,6];
        let puedeRechazar = [1,2,3,4,5,6];

        const tramitePagado = tramitePadre?.tramite_entidad_revision?.aviso_entero?.estado == 'PAGADO';

        setPermisos({
            ...permisos,
            aprobarRevision: puedeAprobar.includes(entidadRevisionId) || tramitePagado,
            rechazarRevision: puedeRechazar.includes(entidadRevisionId) || tramitePagado,
            solicitarPago: puedeSolicitarPago.includes(entidadRevisionId),
            generarResolutivo: puedeGenerarResolutivo.includes(entidadRevisionId),
            asignarCondicionantes: puedeAsignarCondicionantes.includes(entidadRevisionId),
        })
    };

    const onChangeObservaciones = (e) => {
        setObservaciones(e.target.value);
    };

    const enviarObservaciones = () => {
        axios
            .post(`/entidad-revision/tramites/${tramitePadreId}/revision`, {
                observaciones,
                requisitos_rechazados: requisitosRechazados,
                requisitos_solicitados: requisitosSolicitados,
            })
            .then(response => {
                messageApi.open({
                    type: 'success',
                    content: 'Revisión enviada exitosamente.',
                });
                loadTramite();
                loadDocumentos();
                setModalObservacionesVisible(false);
            })
            .catch(error => {
                const message = error.response?.data?.message;

                messageApi.open({
                    type: 'error',
                    content: `Error al enviar revisión.${message ? ' ' + message : ''}`,
                });
                console.log(error);
            });
    };

    const aprobarRevision = () => {
        axios
            .get(`/entidad-revision/tramites/${tramitePadreId}/aprobar`)
            .then(response => {
                messageApi.open({
                    type: 'success',
                    content: 'Tramite aprobado exitosamente.',
                });
                loadTramite();
                loadDocumentos();
                setModalAprobarRevisionVisible(false);
            })
            .catch(error => {
                const message = error.response?.data?.message;

                messageApi.open({
                    type: 'error',
                    content: `Error al aprobar el tramite.${message ? ' ' + message : ''}`,
                });
                console.log(error);
            });
    };

    const rechazarRevision = () => {
        axios
            .get(`/entidad-revision/tramites/${tramitePadreId}/rechazar`)
            .then(response => {
                messageApi.open({
                    type: 'success',
                    content: 'Tramite rechazado exitosamente.',
                });
                loadTramite();
                loadDocumentos();
                setModalRechazarRevisionVisible(false);
            })
            .catch(error => {
                const message = error.response?.data?.message;

                messageApi.open({
                    type: 'error',
                    content: `Error al rechazar el tramite.${message ? ' ' + message : ''}`,
                });
                console.log(error);
            });
    };

    const actualizarRequisitosRechazados = (requisito) => {
        let _requisitosRechazados = [...requisitosRechazados];
        if(!requisito.rechazado) {
            const requisitoIndex = _requisitosRechazados.findIndex(r => r.id == requisito.id);
            requisitoIndex >= 0 && _requisitosRechazados.splice(requisitoIndex, 1);
        } else {
            _requisitosRechazados = [..._requisitosRechazados, {id: requisito.id}];
        }

        setRequisitosRechazados(_requisitosRechazados);
    };

    let persona, nombre, tipoPersona, nombreTramite, requisitos,
        requisitosTexto, requisitosArchivo, requisitosPersona, estadosRevision, revisionAprobadoRechazado;
    nombre = tipoPersona = nombreTramite = '';
    requisitos = requisitosTexto = requisitosArchivo = requisitosPersona = estadosRevision = [];

    if(!!tramitePadre) {
        persona = tramitePadre.tramitable;
        const esPersonaMoral = !!persona.persona_id;
        nombre = esPersonaMoral ?
            persona.razon_social :
            `${persona.apellido_pat} ${persona.apellido_mot}, ${persona.nombre}`;
        tipoPersona = esPersonaMoral ? 'Persona Moral' : 'Persona Fisica';
        nombreTramite = tramitePadre.catalogo_tramite.nombre;

        estadosRevision = tramitePadre.tramite_entidad_revision.ultima_revision.estados_revision;

        requisitos = tramitePadre.tramite_entidad_revision.ultima_revision.estados_revision.flatMap((estadoRevision) => {
            return estadoRevision.requisitos;
        });

        requisitosTexto = requisitos.filter((requisito) => requisito.requisito.tipo == "TEXTO");
        requisitosArchivo = requisitos.filter((requisito) => requisito.requisito.tipo == "ARCHIVO");
        requisitosPersona = esPersonaMoral ? persona.persona.requisitos : persona.requisitos;

        const aprobadoRechazadoStatuses = [status.APROBADO, status.VISOR, status.RECHAZADO, status.VISTO_BUENO];
        revisionAprobadoRechazado = aprobadoRechazadoStatuses.includes(
            tramitePadre.tramite_entidad_revision.ultima_revision.status
        );
    }

    const observacionesRequeridas = requisitosRechazados.length > 0 || requisitosSolicitados.length > 0 || mostrarObservaciones;

    const columnProps1 = {
        className: "gutter-row",
        xs: 24,
        sm: 24,
        lg: 12,
        span: 12,
    };

    return (
        <div className="sare--container" >
            {contextHolder}
            <h1>Información del solicitante - {nombre}</h1>
            <p>Trámite: {nombreTramite}</p>
            <p>Tipo solicitante: <Tag color="gray">{tipoPersona}</Tag></p>
            <Divider></Divider>

            <Row
                gutter={[24, { xs: 8, sm: 8, md: 24, lg: 32 }]}
                className="negocio-info-row"
            >
                <Col {...columnProps1}>
                    <InformacionPersona persona={persona}/>
                </Col>
                <Col {...columnProps1}>
                    { persona &&
                        <MapaUbicacion position={
                            {
                                lat: +persona.direccion_notificacion.latitud,
                                lng: +persona.direccion_notificacion.longitude
                            }
                        }/>
                    }
                </Col>
            </Row>

            <Row>
                <Col className="first-container">
                    <h1>Requisitos</h1>
                    <div>
                        <div className="sare--list-item">
                            <small style={{ color: "gray" }}>Valor</small>
                            <small style={{ color: "gray" }}>Estado</small>
                            <small style={{ color: "gray" }}>Requisito</small>
                            <small style={{ color: "gray" }}>Acciones</small>
                        </div>
                        {
                            requisitosTexto.map(
                                requisito => (
                                    <RequisitoTextoListItem
                                        requisito={requisito}
                                        onRequisitoRechazado={actualizarRequisitosRechazados}
                                    />
                                )
                            )
                        }
                    </div>

                    <Divider/>

                    <h1>Documentación</h1>
                    <RequisitosObservacionesTabs
                        estadosRevision={estadosRevision}
                        requisitos={requisitosArchivo}
                        requisitosPersona={requisitosPersona}
                        onRequisitoRechazado={actualizarRequisitosRechazados}
                    />
                </Col>

                <Col className="second-container">
                    {(permisos.aprobarRevision == true ||
                        permisos.asignarCondicionantes == true) &&
                        !revisionAprobadoRechazado && (
                        <div className="">
                            <h1>Seleccionar Documentos</h1>
                            <Divider></Divider>
                            <div className="detalles-negocios-documents-list">
                                <DocumentosCondicionantesTabs
                                    documentos={documentos}
                                    condicionantes={condicionantes}
                                    mostrarDocumentos={permisos.aprobarRevision}
                                    mostrarCondicionantes={permisos.asignarCondicionantes}
                                    onDocumentoSeleccionado={console.log}
                                    />
                            </div>
                        </div>
                    )}
                </Col>
            </Row>

            <Divider></Divider>

            <div className="observaciones-containerr">
                {
                    observacionesRequeridas && (
                        <div
                            className="site-card-border-less-wrapper"
                            style={{ padding: 30 }}
                        >
                            <div
                                style={{
                                    width: "80%",
                                    margin: "0 auto",
                                    padding: 30,
                                }}
                            >
                                <TextArea
                                    rows={10}
                                    showCount
                                    maxLength={100000}
                                    onChange={onChangeObservaciones}
                                    style={{ marginBottom: 30 }}
                                />
                                <Button
                                    type="primary"
                                    onClick={() =>
                                        setModalObservacionesVisible(true)
                                    }
                                >
                                    Enviar observaciones
                                </Button>
                            </div>
                        </div>
                    )
                }
                {
                    !observacionesRequeridas && (
                        <div className="buttons-container">
                            {permisos.rechazarRevision &&
                                !revisionAprobadoRechazado && (
                                    <>
                                        <Button
                                            disabled={disableMainButtons}
                                            type="danger"
                                            className="ant-btn-primary button-primary aprobar-button"
                                            onClick={() => {
                                                setDisableMainButtons(true);
                                                setModalRechazarRevisionVisible(
                                                    true
                                                );
                                            }}
                                        >
                                            Rechazar revisión
                                        </Button>
                                    </>
                                )}

                            {permisos.aprobarRevision &&
                                !revisionAprobadoRechazado && (
                                    <>
                                        <Button
                                            disabled={disableMainButtons}
                                            type="primary"
                                            className="ant-btn-primary button-primary aprobar-button"
                                            onClick={() => {
                                                setDisableMainButtons(true);
                                                setModalAprobarRevisionVisible(
                                                    true
                                                );
                                            }}
                                        >
                                            Visto bueno
                                        </Button>
                                    </>
                                )}
                           {
                                !revisionAprobadoRechazado &&
                                <Button
                                    disabled={disableMainButtons}
                                    type="primary"
                                    className="ant-btn-primary button-primary aprobar-button"
                                    onClick={() => setMostrarObservaciones(true)}
                                >
                                    <span>Observaciones</span>
                                </Button>
                            }
                            {tramitePadre ? (
                                <TramitePersonaPagos tramitePadreId={tramitePadreId} />
                            ) : null}
                        </div>
                    )
                }
            </div>

            <Modal
                title="Visto Bueno"
                centered
                visible={modalAprobarRevisionVisible}
                onOk={() => aprobarRevision()}
                onCancel={() => {
                    setDisableMainButtons(false);
                    setModalAprobarRevisionVisible(false);
                }}
            >
                <p>
                    ¿Está seguro que desea dar el visto bueno a la
                    revisión?
                </p>
            </Modal>

            <Modal
                title="Rechazar Revisión"
                centered
                visible={modalRechazarRevisionVisible}
                onOk={() => rechazarRevision()}
                onCancel={() => {
                    setDisableMainButtons(false);
                    setModalRechazarRevisionVisible(false);
                }}
            >
                <p>¿Está seguro que desea rechazar la revisón?</p>
            </Modal>

            <Modal
                title="Enviar Observaciones"
                centered
                visible={modalObservacionesVisible}
                onOk={() => enviarObservaciones()}
                onCancel={() => setModalObservacionesVisible(false)}
            >
                <p>
                    ¿Está seguro que desea enviar estas observaciones?
                </p>
            </Modal>
        </div>
    );
}

export default DetallesTramite;
