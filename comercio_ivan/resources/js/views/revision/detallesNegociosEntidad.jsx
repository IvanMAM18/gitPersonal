import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useNegocioDetallesEntidadRevisora from "../../utils/hooks/useNegocioDetallesEntidadRevisora";
import { PushpinOutlined, CloseOutlined } from "@ant-design/icons";
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
    Collapse,
    Select
} from "antd";

const { Panel } = Collapse;

import TramitePagos from "../pagos/TramitePagos";

import ReactDOM from "react-dom";
import DocumentosGrid from "./componentes/documentosGrid";
import DocumentosUsuariosGrid from "./componentes/documentosUsuarios";
import ObservacionesTimeline from "./componentes/observacionesTimeline";

const { TextArea } = Input;

import moment from "moment";
import status from "../../utils/statuses";
import RolesRouter from "../RolesRouter";
import NegocioDetallesModal from "../components/NegocioDetallesModal";
import impactos from "../../utils/impactoGiroComercial";
import MapaUbicacionNegocio from "../components/MapaUbicacionNegocio";

import GeneralHeader from "./detalles-components/GeneralHeader";
import PropietarioInfo from "./detalles-components/PropietarioInfo";
import PersonaMoralInfo from "./detalles-components/PersonaMoralInfo";
import DireccionInfo from "./detalles-components/DireccionInfo";
import MasDetallesInfo from "./detalles-components/MasDetallesInfo";
import CondicionantesRequisitosModal from "./detalles-components/CondicionantesRequisitosModal";
import InfoPredio from "./detalles-components/InfoPredio";
import CondicionantesGrid from "./componentes/CondicionantesGrid";

const d = (date) => moment(date).format("DD/MM/YYYY HH a");

function useForceUpdate() {
    const [value, setValue] = useState(0); // integer state
    return () => setValue((value) => value + 1); // update state to force render
}

const permissionsStates = {
    aprobarPermission: true,
    pagoPermission: false,
    resolutivoPermission: false,
    condicionantesPermission: false,
};

const permissionsStatesTrue = {
    aprobarPermission: true,
    pagoPermission: true,
    resolutivoPermission: true,
    condicionantesPermission: true,
};

export default function DetallesNegociosEntidad(props) {
    const [modalNegocioDetallesAbierto, setModalNegocioDetallesAbierto] = useState(false);
    const [modalAprobarRevision, setModalAprobarRevision] = useState(false);
    const [modalRechazarRevision, setModalRechazarRevision] = useState(false);
    const [modalEnviarObservaciones, setModalEnviarObservaciones] =
        useState(false);
    const [modalEnviarRequisitosYCondicionantes, setModalEnviarRequisitosYCondicionantes] = useState(false)
    const [modalMostrarDocumentosCondicionantes, setModalMostrarDocumentosCondicionantes] = useState(false);
    const [selectedYear, setSelectedYear] = useState("");
    const [negocio, updateNegocio] = useNegocioDetallesEntidadRevisora(
        window.user.entidad_revision, selectedYear
    );
    const [isLoading, setIsLoading] = useState(false);

    const [uploadedNegocio, setUploadedNegocio] = useState([])

    const [negocioDocumentosGrid, setNegociosDocumentosGrid] = useState([]); { }
    const [documentosPreprocesados, setDocumentosPreprocesados] = useState([]);
    const [condicionantesPreprocesadas, setCondicionantesPreprocesadas] =
        useState([]);

    const [documentos, setDocumentos] = useState([]);
    const [condicionantes, setCondicionantes] = useState([]);
    const [condicionantesRevision, setCondicionantesRevision] = useState([]);

    const [permissions, setPermissions] = useState(permissionsStates);

    const [disableMainButtons, setDisableMainButtons] = useState(false);
    const [revisionAprobadoRechazado, setRevisionAprobadoRechazado] =
        useState(false);

    const [revisionAprobado, setRevisionAprobado] = useState(false);
    const [observacionesHistorial, setObservacionesHistorial] = useState([]);

    const [condicionantesNegocios, setCondicionantesNegocios] = useState([]);
    const [showObservaciones, setShowObservaciones] = useState(false);
    const [documentosFaltantes, setDocumentosFaltantes] = useState([]);
    const [documentosFromUsers, setDocumentosFromUsers] = useState([]);
    const [documentosAprobados, setDocumentosAprobados] = useState([]);
    const [documentosRechazados, setDocumentosRechazados] = useState([]);
    const [condicionantesSeleccionadas, setCondicionantesSeleccionadas] =
        useState([]);
    const [observaciones, setObservaciones] = useState("");
    const [pos, setPos] = useState(undefined);
    const [entidadRevision, setEntidadRevision] = useState(0);

    const [showVistoBueno, setShowVistoBueno] = useState(true);

    const [iniciaAprobarRevision, setIniciaAprobarRevision] = useState(false);

    const navigate = useNavigate();
    const forceUpdate = useForceUpdate();

    useEffect(() => {
        if(!iniciaAprobarRevision)
            return;
        aprobarRevision();
    }, [iniciaAprobarRevision]);

    useEffect(() => {
        if (documentosFaltantes.length > 0 || documentosRechazados.length > 0) {
            mostrarObservaciones();
        } else {
            ocultarObservaciones();
        }
    }, [documentosFaltantes, documentosRechazados]);


    const updateNegocioState = () => {
        const routeArray = location.href.split("/");
        const negocioId = routeArray[routeArray.length - 2];
        const selectedYear = routeArray[routeArray.length - 1];

        // Validación para asegurarse de que negocioId y selectedYear contienen números
        const containsNumber = /\d/; // Expresión regular que busca cualquier dígito

        if (!containsNumber.test(negocioId) || !containsNumber.test(selectedYear)) {
            // console.error("negocioId o selectedYear no son válidos porque no contienen números.");
            return; // Termina la ejecución si no pasan la validación
        }
        setSelectedYear(selectedYear)
        handleYearChange(selectedYear)
        getDocumentos()
        updateNegocio(negocioId, window.user.entidad_revision, selectedYear);
        
    };

    useEffect(() => {
        const initialize = async () => {
            // Asegúrate de que cualquier dato necesario, como datos del usuario, esté cargado.
            if (!window.user || !window.user.entidad_revision) {
                console.error("Datos del usuario no disponibles");
                return;
            }

            // Luego continúa con la actualización del estado del negocio.
            updateNegocioState();
        };

        initialize();
    }, []); // El array vacío asegura que esto se ejecute solo una vez, al cargar el componente.


    useEffect(() => { }, [documentos]);

    useEffect(() => {
        const asd = documentosProcesados(
            documentosPreprocesados ?? [],
            documentosAprobados ?? []
        );
        setDocumentos(asd);
        forceUpdate();
    }, [documentosAprobados, documentosPreprocesados]);

    useEffect(() => {
        if (
            condicionantesPreprocesadas.length > 0 &&
            condicionantesNegocios.length > 0
        ) {
            const asd = condicionantesSeleccinadasFilter(
                condicionantesPreprocesadas,
                condicionantesNegocios
            );
            setCondicionantes(asd);
            forceUpdate();
        } else {
            setCondicionantes(condicionantesPreprocesadas);
        }
    }, [condicionantesNegocios, condicionantesPreprocesadas]);

    const getPermissionsFromEntity = () => {

        const _negocio = negocio;
        var alto_impacto = false;
        // _negocio.giro_comercial.map((giro_comercial) => {
        //     if (giro_comercial.tipo == "alto_impacto" || giro_comercial.tipo == "mediano_impacto") {
        //         alto_impacto = true;
        //     }
        // })
        if (_negocio.impacto_giro_comercial == "mediano_alto_impacto") {
            //setImpacto(true)
            setPermissionsConfig(
                window.user.entidad_revision,
                "mediano_alto_impacto"
            );
        } else {
            //setImpacto(false)
            setPermissionsConfig(window.user.entidad_revision, "bajo_impacto");
        }
    };

    const setPermissionsConfig = async (entidad_id, impacto) => {
        console.log("setPermissionsConfig", entidad_id, impacto)
        switch (impacto) {
            case "bajo_impacto":
                switch (entidad_id) {
                    case 1:
                        setPermissions({
                            ...permissionsStates,
                            aprobarPermission: true,
                            condicionantesPermission: true,
                        });
                        break;
                    case 2:
                        setPermissions({
                            ...permissionsStates,
                            pagoPermission: true,
                            condicionantesPermission: true,
                        });
                        break;
                    case 3:
                        setPermissions({
                            ...permissionsStates,
                            pagoPermission: true,
                        });
                        break;
                    case 4:
                        setPermissions({
                            ...permissionsStates,
                        });
                        break;
                    case 5, 6:
                        setPermissions({
                            ...permissionsStatesTrue
                        });
                        break;
                }
                break;
            case "mediano_alto_impacto":
                switch (entidad_id) {
                    case 1:
                        setPermissions({
                            ...permissionsStatesTrue,
                        });
                        break;
                    case 2:
                        setPermissions({
                            ...permissionsStatesTrue,
                        });
                        break;
                    case 3:
                        setPermissions({
                            ...permissionsStates,
                            pagoPermission: true,
                            condicionantesPermission: true,
                        });
                        break;
                    case 4:
                        setPermissions({
                            ...permissionsStatesTrue,
                        });
                        break;
                    case 5, 6:
                        setPermissions({
                            ...permissionsStatesTrue
                        });
                        break;
                }
                break;
        }
    };

    const condicionantesSeleccinadasFilter = (
        __condicionantes,
        __condicionantesNegocios
    ) => {
        let approvedCondicionantes = {};
        var _condicionantes = __condicionantes;
        __condicionantesNegocios.forEach(
            (condicionante) =>
            (approvedCondicionantes[condicionante.id] =
                condicionante.status)
        );
        let condicionantes = _condicionantes.map((condicionante) => ({
            ...condicionante,
            status:
                approvedCondicionantes[condicionante.id] !== undefined
                    ? approvedCondicionantes[condicionante.id]
                    : -1,
        }));
        return condicionantes;
    };

    const documentosProcesados = (__documentos, __documentosAprobados) => {
        let approvedDocs = {};
        var _documentos = __documentos;
        __documentosAprobados.forEach(
            (doc) => (approvedDocs[doc.id] = doc.status)
        );
        let documentos = _documentos.map((doc) => ({
            ...doc,
            status:
                approvedDocs[doc.id] !== undefined ? approvedDocs[doc.id] : -1,
        }));
        return documentos;
    };

    const documentosFromUserRequisitos = () => {
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

    const documentosFromRevisions = (negocio) => {
        var requisitosArray = [];
        console.log("documentosFromRevisions: ", negocio)
        negocio.revisiones?.map((revisiones) => {
            revisiones?.estados_revision?.map((negocio_requisito) => {
                negocio_requisito?.negocio_requisitos?.map((requisito) => {
                    let requisito_json = {
                        id: requisito?.requisito?.id,
                        nombre: requisito?.requisito?.nombre,
                        archivo_path:
                            requisito?.negocio_requisito_archivo?.archivo_path,
                        requisito_id:
                            requisito?.negocio_requisito_archivo?.requisito_id,
                        status: requisito?.status,
                        descripcion: requisito?.requisito?.descripcion,
                        accepted: false,
                        negocio_requisito_id: requisito.id,
                        revision_id: requisito.revision_id,
                        negocio_id: negocio.negocio_id,
                    };
                    requisitosArray.push(requisito_json);
                });
            });
        });
        return requisitosArray;
    };

    const observacionesFromNegocio = () => {
        var observacionesArray = [];
        var negociosRequisitosArray = [];
        var entidadRevisionUsuario = window.user.entidad_revision;

        if (window.user.entidad_revision == 5) {
            entidadRevisionUsuario = 6;
        }
        negocio.revisiones?.map((revisiones) => {
            if (revisiones.entidad_revision_id == entidadRevisionUsuario ||
                (window.user.entidad_revision == 5 && (revisiones.entidad_revision_id == 6))) {
                revisiones?.estados_revision?.map((estado_revision) => {
                    const revisor = estado_revision?.revisor;
                    const revisorName = `${revisor?.nombre == undefined ? 'NA' : revisor?.nombre} ${revisor?.nombre == undefined ? '' : revisor?.apellido_pat} ${revisor?.nombre == undefined ? '' : revisor?.apellido_mot}`
                    let timelineObservaciones = {
                        id: estado_revision.id,
                        status: estado_revision.status,
                        observacion: estado_revision.observaciones,
                        created_at: estado_revision.created_at,
                        nombre_revisor: revisorName,
                    };
                    estado_revision?.negocio_requisitos?.map(
                        (negocio_requisito) => {
                            negocio_requisito = {
                                id_requisito: negocio_requisito?.id,
                                nombre_requisito:
                                    negocio_requisito.requisito?.nombre,
                                descripcion_requisito:
                                    negocio_requisito.requisito?.descripcion,
                                status_requisito: negocio_requisito.status,
                            };
                            negociosRequisitosArray.push(negocio_requisito);
                        }
                    );
                    timelineObservaciones = {
                        ...timelineObservaciones,
                        negociosRequisitosArray,
                    };
                    observacionesArray.push(timelineObservaciones);
                    negociosRequisitosArray = [];
                });
            }
        });
        return observacionesArray;
    };

    //******************** Observaciones from negocio modularizado ********************/
    function getRevisorName(revisor) {
        if (!revisor || revisor.nombre === undefined) {
            return 'NA';
        }
        return `${revisor.nombre} ${revisor.apellido_pat} ${revisor.apellido_mot}`;
    }

    function processEstadoRevision(estado_revision, entidadRevisionUsuario) {
        const revisorName = getRevisorName(estado_revision?.revisor);
        let negociosRequisitosArray = processNegocioRequisitos(estado_revision?.negocio_requisitos);

        return {
            id: estado_revision.id,
            status: estado_revision.status,
            observacion: estado_revision.observaciones,
            created_at: estado_revision.created_at,
            nombre_revisor: revisorName,
            negociosRequisitosArray,
        };
    }

    function processNegocioRequisitos(negocio_requisitos) {
        return negocio_requisitos.map(negocio_requisito => ({
            id_requisito: negocio_requisito?.id,
            nombre_requisito: negocio_requisito.requisito?.nombre,
            descripcion_requisito: negocio_requisito.requisito?.descripcion,
            status_requisito: negocio_requisito.status,
        }));
    }

    function observacionesFromNegocioMod(negocio, user) {
        var observacionesArray = [];
        var entidadRevisionUsuario = user.entidad_revision === 5 ? 6 : user.entidad_revision;

        try {
            negocio?.[0].revisiones?.forEach(revision => {
                if (revision.entidad_revision_id == entidadRevisionUsuario ||
                    (user.entidad_revision === 5 && revision.entidad_revision_id === 6)) {
                    revision.estados_revision?.forEach(estado_revision => {
                        observacionesArray.push(processEstadoRevision(estado_revision, entidadRevisionUsuario));
                    });
                }
            });
            return observacionesArray;
        } catch (error) {
            console.log(error);
            return [];
        }

    }

    const getProgramaInterno = async () => {
        axios
            .get("/app/es-programa-interno/" + negocio.id)
            .then((result) => {
                let data = result.data;

                if (data[0]) {
                    data = data.map((d) => {
                        d.key = d.id;
                        d.status = -1;
                        return d;
                    });
                    setDocumentos(prevDocumentos => [
                        ...prevDocumentos,
                        data[0]
                    ]);
                }
            });
    }
    //******************** Observaciones from negocio modularizado ********************/

    // useEffect(() => {

    //     if (negocio.id) {
    //         let negocioMarker = {
    //             lat: +negocio.direccion.latitud,
    //             lng: +negocio.direccion.longitude,
    //         };

    //         setPos(negocioMarker);
    //         //setDocumentosAprobados(documentosFromRevisions());
    //         setDocumentosFromUsers(documentosFromUserRequisitos());
    //         setObservacionesHistorial(observacionesFromNegocio);
    //         getCondicionantesNegocioEntidad();
    //         getPermissionsFromEntity();
    //         getProgramaInterno();
    //     }

    //     if (negocio.revisiones) {
    //         RevisionAprobados(negocio.revisiones)
    //     }
    //     //setNegociosDocumentosGrid[negocio]

    //     setUploadedNegocio(negocio)
    //     handleYearChange(selectedYear);
    // }, [negocio]);

    useEffect(() => {
        // Asegurarse de que todas las propiedades necesarias estén presentes

        if (permissions != null) {
            console.log("use effect permission", permissions);
        }
    }, [permissions]);


    useEffect(() => {
        // Asegurarse de que todas las propiedades necesarias estén presentes
        if (negocio.id && negocio.direccion && negocio.direccion.latitud && negocio.direccion.longitude) {
            let negocioMarker = {
                lat: +negocio.direccion.latitud,
                lng: +negocio.direccion.longitude,
            };

            setPos(negocioMarker);
        }
    }, [negocio.id, negocio.direccion]); // Dependencias más específicas para la actualización del marcador

    useEffect(() => {
        if (negocio.id) {
            if (window.user.entidad_revision == 2) {
                getProgramaInterno();
            }
            setDocumentosAprobados(documentosFromRevisions(negocio));
            setDocumentosFromUsers(documentosFromUserRequisitos());
            setObservacionesHistorial(observacionesFromNegocio);
            getCondicionantes();
            setUploadedNegocio(negocio);
            handleYearChange(selectedYear);
            getPermissionsFromEntity();
        }
    }, [negocio.id]); // Dependencias específicas para acciones que necesitan el id del negocio

    useEffect(() => {
        if (negocio.revisiones) {
            RevisionAprobados(negocio.revisiones);
        }
    }, [negocio.revisiones]); // Un bloque específico para manejar las revisiones

    // Este useEffect podría estar siempre llamando a handleYearChange aunque negocio no esté completamente cargado.
    // Si selectedYear depende de la carga completa de negocio, deberías incluirlo en un useEffect donde verifiques la carga completa.
    // De lo contrario, si selectedYear es independiente, puede permanecer fuera o manejarse de forma diferente.

    const RevisionAprobados = (revisiones) => {
        var negocio_status = null;

        try {
            revisiones.map((revision) => {
                if (revision.entidad_revision_id == window.user.entidad_revision ||
                    (window.user.entidad_revision == 5 && revision.entidad_revision_id == 6)) {
                    negocio_status = revision.status;
                }
            });
            setRevisionAprobadoRechazado(
                negocio_status === status.APROBADO ||
                negocio_status === status.VISOR ||
                negocio_status === status.RECHAZADO ||
                // negocio_status === status.ENVIADO ||
                // negocio_status === status.EN_REVISION ||
                // negocio_status === status.PENDIENTE ||
                negocio_status === status.VISTO_BUENO
            );
            setRevisionAprobado(negocio_status === status.APROBADO);
            setShowVistoBueno(true)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        window.user;
        setEntidadRevision(window.user.entidad_revision);
        getDocumentos();
        getCondicionantes();
        forceUpdate();
    }, [useNegocioDetallesEntidadRevisora]);

    const getDocumentos = () => {
        axios
            .get("/app/get-entidad-documentos/" + window.user.entidad_revision)
            .then((result) => {
                let data = result.data;
                data = data.map((d) => {
                    d.key = d.id;
                    d.status = -1;
                    return d;
                });
                setDocumentosPreprocesados(data);
            });
    };

    const getCondicionantes = () => {
        axios
            .get(
                `/app/entidad-revision/${window.user.entidad_revision}/condicionantes`
            )
            .then((result) => {

                let data = result.data;
                data = data.map((d) => {
                    d.key = d.id;
                    d.status = d.estado || -1;
                    return d;
                });
                setCondicionantesPreprocesadas(data);
            }).catch(function (error) {

                console.log(error);
            });
    };

    const openApproveRevision = (type) => {
        notification[type]({
            duration: 3,
            className: "success-notification",
            message: "Aprobar Revisión",
            description: "La revisión se aprobó correctamente.",
            onClose: () => refreshPage(),
        });
    };

    const openApprovedFailedRevision = (type) => {
        notification[type]({
            duration: 3,
            className: "error-notification",
            message: "Aprobar Revisión",
            description: "Hubo un problema con el servidor, intente de nuevo.",
        });
    };

    const openSendNotes = (type) => {
        notification[type]({
            duration: 3,
            className: "success-notification",
            message: "Enviar Observaciones",
            description: "Las observaciones han sido enviadas correctamente.",
            onClose: () => refreshPage(),
        });
    };

    const openSendNotesError = (type) => {
        notification[type]({
            duration: 3,
            className: "error-notification",
            message: "Enviar Observaciones",
            description: "Hubo un problema con el servidor, intente de nuevo.",
        });
    };

    const openRejectRevision = (type) => {
        notification[type]({
            duration: 3,
            className: "success-notification",
            message: "Rechazar Revisión",
            description: "La revisión se rechazó correctamente.",
            onClose: () => refreshPage(),
        });
    };

    const openRejecFailedRevision = (type) => {
        notification[type]({
            duration: 3,
            className: "error-notification",
            message: "Rechazar Revisión",
            description: "Hubo un problema con el servidor, intente de nuevo.",
        });
    };

    const mostrarObservaciones = () => setShowObservaciones(true);

    const ocultarObservaciones = () => setShowObservaciones(false);

    const refreshPage = () => location.reload();

    const refreshDocumentosGrid = () => {
        const routeArray = location.href.split("/");
        const negocioId = routeArray[routeArray.length - 2];
        const selectedYear = routeArray[routeArray.length - 1];
        setSelectedYear(selectedYear)
        handleYearChange(selectedYear)
        updateNegocio(negocioId, window.user.entidad_revision, selectedYear)
        refreshPage()
    };

    const rechazarRevision = () => {
        setModalRechazarRevision(false);
        axios
            .post("/app/reject-revision", {
                entidad_revision_id: entidadRevision,
                negocio_id: negocio.id,
            })
            .then(function (response) {
                if (response.data == 1) {
                    openRejectRevision("success");
                } else {
                    openRejecFailedRevision("error");
                }
            })
            .catch(function (error) {
                setDisableMainButtons(false);
                openRejecFailedRevision("error");
            });
    };

    const checkCurrentRevision = () => {
        var currentRevision = null;
        uploadedNegocio.revisiones?.map((revision) => {
            const entidadRevisionUsuario = window.user.entidad_revision;
            // Permitir que entidad 5 apruebe la revisión con entidad_revision = 6
            if (revision.entidad_revision_id == entidadRevisionUsuario ||
                (revision.entidad_revision_id == 6 && entidadRevisionUsuario == 5)) {
                currentRevision = revision;
            }
        });
        return currentRevision;
    };

    const aprobarRevision = () => {
        var currentRevision = checkCurrentRevision();
        axios
            .post("/app/approve-revision", {
                entidad_revision_id: entidadRevision,
                negocio_id: negocio.id,
                //documentos_aprobados: documentosAprobados,
                revision_id: currentRevision.id,
            })
            .then(function (response) {
                if (response.data == 1) {
                    openApproveRevision("success");
                    // openFailedRevision('error')
                } else {
                    openApprovedFailedRevision("error");
                }
            })
            .catch(function (error) {
                setDisableMainButtons(false);
                setIniciaAprobarRevision(false);
                openApprovedFailedRevision("error");
            });
    };

    const enviarObservaciones = async () => {
        setIsLoading(true);
        try {
            if (observaciones == "") {
                notification.error({
                    duration: 3,
                    className: "error-notification",
                    message: "Observaciones",
                    description: "No se puede enviar el campo de observación vacío, por favor ingrese una nota.",
                });
                setModalEnviarRequisitosYCondicionantes(false)
                setIsLoading(false);
                return
            }
            setModalEnviarObservaciones(false);
            let currentRevision = checkCurrentRevision();

            let newRevision = {
                user_id: window.user.id,
                _token: window.csrf,
                documentos_faltantes: documentosFaltantes,
                documentos_rechazados: documentosRechazados,
                // documentos_aprobados: documentosAprobados,
                observacion: observaciones,
                condicionantes: condicionantesSeleccionadas,
                negocio_id: negocio.id,
                entidad_id: entidadRevision,
                status:
                    documentosRechazados.length > 0 ? "EN REVISION" : "EN REVISION", //preguntar si se rechaza un documento se debe marcar como rechazado el negocio
                revision_id: currentRevision.id,
            };
            axios
                .post("/app/new-revision", newRevision)
                .then(function (response) {
                    //setIsLoading(false);
                    setModalEnviarRequisitosYCondicionantes(false)
                    if (response.data == 1) {
                        openSendNotes("success");
                    } else {
                        openSendNotesError("error");
                    }
                })
                .catch(function (error) {
                    setIsLoading(false);
                    console.log(error)
                    setDisableMainButtons(false);
                    openSendNotesError("error");
                });
        } catch (error) {
            // Manejo de error
            setIsLoading(false);
            console.error(error);
        }
        // finally {
        //     //setIsLoading(false); // Termina la carga, independientemente del resultado
        //     setModalEnviarObservaciones(false); // Cierra el modal
        //     setModalEnviarRequisitosYCondicionantes(false)
        // }
    };


    const removePeople = (personToRemove) => {
        setDocumentosFaltantes(prevDocumentos =>

            prevDocumentos.filter(documento => documento.id !== personToRemove.id)
        );
    };

    const removeCondicionantes = (condicionanteToRemove) => {
        setCondicionantesSeleccionadas(prevCondicionantes =>
            prevCondicionantes.filter(condicionante => condicionante.id !== condicionanteToRemove.id)
        );
    };



    const removeDocuments = (e) => {
        var array = [...documentosRechazados]; // make a separate copy of the array
        var x = 0;
        while (x < array.length) {
            if (array[x].id === e.id) {
                array.splice(x, 1);
                x = array.length;
            }
            x++;
        }
        setDocumentosRechazados(array);
    };

    const onChangeCheckbox = (e) => {
        if (e.target.checked) {
            setDocumentosFaltantes(prevDocumentos => [
                ...prevDocumentos,
                e.target.value,
            ]);
        } else {
            removePeople(e.target.value);
        }
    };

    const onChangeCondicionantes = (e) => {
        if (e.target.checked) {
            setCondicionantesSeleccionadas(prevCondicionantes => [
                ...prevCondicionantes,
                e.target.value,
            ]);
        } else {
            removeCondicionantes(e.target.value);
        }
    };

    const mapCondicionantesRevision = (revisions) => {
        var condicionantesRevision = []
        revisions.map((revision) => {
            revision.condicionantes_revision?.map((condicionante_revision) => {
                condicionantesRevision.push(condicionante_revision.condicionante)
            })
        });
        // Ahora, establecemos los condicionantes de revisión en donde sea necesario.
        // Esto puede ser un estado en un componente React, por ejemplo.
        setCondicionantesRevision(condicionantesRevision);
    }

    const handleYearChange = (value) => {
        if (!value || !negocio || !negocio.id) return;
        // console.log(`selected year: ${value}`);

        setSelectedYear(value);
        setCondicionantesSeleccionadas([]);
        setDocumentosFaltantes([]);
        setDocumentosRechazados([]);
        setObservacionesHistorial([]);
        setNegociosDocumentosGrid([]);
        setDocumentosAprobados([]);
        

        //menu fusionado de alcohol
        if (window.user.role_id == 6 && window.user.entidad_revision == 5) {
            console.log(negocio)
            axios.get('/app/detalles-by-year?negocio_id=' + negocio.id + '&year=' + value + '&entidad_revision_id=6')
                //axios.get('/app/get-tramites-by-year/'+negocio.id+'/'+value+'/'+window.user.entidad_revision+'')
                .then(function (response) {
                    // console.log("detalles-by-year: ", response.data[0])
                    //debugger
                    if (response.data.length > 0) {
                        setUploadedNegocio(response.data[0])
                        setDocumentosAprobados(documentosFromRevisions(negocio));
                        setObservacionesHistorial(observacionesFromNegocioMod(response.data, window.user));
                        setNegociosDocumentosGrid(response.data[0])
                    }
                    if (response.data && response.data[0]?.revisiones != undefined && response.data[0]?.revisiones.length > 0) {
                        RevisionAprobados(response.data[0].revisiones)
                        mapCondicionantesRevision(response.data[0].revisiones)
                    }
                    else {
                        setShowVistoBueno(false)
                    }

                })
                .catch(function (error) {
                    console.log(error);
                })
        }
        else {
            axios.get('/app/detalles-by-year?negocio_id=' + negocio.id + '&year=' + value + '&entidad_revision_id=' + window.user.entidad_revision + '')
                //axios.get('/app/get-tramites-by-year/'+negocio.id+'/'+value+'/'+window.user.entidad_revision+'')
                .then(function (response) {
                    console.log("detalles-by-year: ", response)
                    //debugger
                    if (response.data.length > 0) {
                        setUploadedNegocio(response.data[0])
                        setDocumentosAprobados(documentosFromRevisions(negocio));
                        setObservacionesHistorial(observacionesFromNegocioMod(response.data, window.user));
                        setNegociosDocumentosGrid(response.data[0])
                    }
                    if (response.data && response.data[0]?.revisiones != undefined && response.data[0]?.revisiones.length > 0) {
                        RevisionAprobados(response.data[0].revisiones)
                        mapCondicionantesRevision(response.data[0].revisiones)
                    }
                    else {
                        setNegociosDocumentosGrid([])
                        setObservacionesHistorial([]);
                        setCondicionantesRevision([])
                        setShowVistoBueno(false)
                    }

                })
                .catch(function (error) {
                    console.log(error);
                })
        }
    };

    // const handleYearChange = (value) => {
    //
    //     if (!value || !negocio || !negocio.id) return;
    //     setSelectedYear(value)

    //     const entityId = (window.user.role_id === 6 && window.user.entidad_revision === 5) ? 6 : window.user.entidad_revision;
    //     const url = `/app/detalles-by-year?negocio_id=${negocio.id}&year=${value}&entidad_revision_id=${entityId}`;

    //     // Función para manejar la respuesta de la API
    //     const handleResponse = (response) => {
    //         if (response.data.length > 0) {
    //             const negociosData = response.data[0];
    //             setUploadedNegocio(negociosData);
    //             setObservacionesHistorial(observacionesFromNegocioMod(response.data, window.user));
    //             setNegociosDocumentosGrid(negociosData);

    //             if (negociosData.revisiones && negociosData.revisiones.length > 0) {
    //                 RevisionAprobados(negociosData.revisiones);
    //             } else {
    //                 setShowVistoBueno(false);
    //             }
    //         } else {
    //             // Limpieza si no hay datos
    //             setNegociosDocumentosGrid([]);
    //             setObservacionesHistorial([]);
    //             setShowVistoBueno(false);
    //         }
    //     };

    //     // Función para manejar errores de la API
    //     const handleError = (error) => {
    //         console.log(error);
    //     };

    //     // Realizar la llamada a la API
    //     axios.get(url).then(handleResponse).catch(handleError);
    // };


    const onChangeAcceptedOrReject = (e) => {
        e.target.value.accepted = !e.target.value.accepted;
        if (e.target.checked == true) {
            setDocumentosRechazados((documentosRechazados) => [
                ...documentosRechazados,
                e.target.value,
            ]);
        } else {
            removeDocuments(e.target.value);
        }
    };

    const onChangeObservaciones = (e) => {
        setObservaciones(e.target.value);
    };

    return (
        <div className="sare--container" style={{ backgroundColor: '#E0E0E0' }}>
            <RolesRouter />
            <GeneralHeader negocio={negocio} />
            <PropietarioInfo negocio={negocio} />
            <PersonaMoralInfo negocio={negocio} />
            <DireccionInfo negocio={negocio} pos={pos} />
            <MasDetallesInfo negocio={negocio} />
            <Collapse collapsible="header" className="detalles-entidad-card-container relative" defaultActiveKey={['10']}>
                <div className="sm:absolute right-0 top-0 flex items-center justify-center sm:justify-end p-2 z-50">
                    <span className="mr-1 hidden md:block">Año Fiscal: </span>
                    <Select
                        value={selectedYear}
                        defaultValue={selectedYear}
                        style={{ width: 120 }}
                        onChange={handleYearChange}
                        options={[
                            { value: '2024', label: '2024' },
                            { value: '2023', label: '2023' },
                        ]}
                    />
                </div>

                <Panel header="Detalles de la revisión" key="10">
                    <Collapse collapsible="header" defaultActiveKey={['1']}>
                        <Panel header="Requisitos solicitados" key="1">
                            <DocumentosGrid
                                negocio={negocio}
                                negocioDocumentosGrid={negocioDocumentosGrid}
                                updateNegocioState={updateNegocioState}
                                refreshDocumentosGrid={
                                    refreshDocumentosGrid
                                }
                                refreshPage={refreshPage}
                            ></DocumentosGrid>
                        </Panel>
                    </Collapse>
                    <Collapse collapsible="header">
                        <Panel header="Condicionantes Solicitadas" key="2">
                            <CondicionantesGrid condicionantes={condicionantesRevision}

                            ></CondicionantesGrid>
                        </Panel>
                    </Collapse>
                    <Collapse collapsible="header">
                        <Panel header="Expediente del usuario" key="3">
                            <DocumentosUsuariosGrid
                                documentosUsuariosRequisitos={
                                    documentosFromUsers
                                }
                            ></DocumentosUsuariosGrid>
                        </Panel>
                    </Collapse>
                    <Collapse collapsible="header">
                        <Panel header="Observaciones" key="4">
                            {
                                observacionesHistorial.length > 0 ? (
                                    <ObservacionesTimeline
                                        observacionesHistorial={
                                            observacionesHistorial
                                        }
                                    ></ObservacionesTimeline>
                                ) : null
                            }

                        </Panel>
                    </Collapse>
                </Panel>

                {showObservaciones ? (
                    <div
                        style={{
                            margin: "0 auto",
                            padding: 30,
                        }}
                    >

                        <>
                            <div className="site-card-wrapper">
                                <Row gutter={[
                                    { xs: 8, sm: 16, md: 24 },
                                    { xs: 8, sm: 16, md: 24 },
                                ]}>

                                    {documentosFaltantes.length > 0 ? (
                                        <Col xs={24} sm={24} md={12}>
                                            <Card title="Solicitar estos documentos" bordered={false}>

                                                <ul>
                                                    {documentosFaltantes.map((documento, index) => (
                                                        <li key={index}>{documento.nombre}</li>
                                                    ))}
                                                </ul>
                                            </Card>
                                        </Col>
                                    ) : null}
                                    {condicionantesSeleccionadas.length > 0 ? (
                                        <Col xs={24} sm={24} md={12}>
                                            <Card title="Solicitar estas condicionantes" bordered={false}>
                                                <ul>
                                                    {condicionantesSeleccionadas.map((condicionante, index) => (
                                                        <li key={index}>{condicionante.nombre}</li>
                                                    ))}
                                                </ul>
                                            </Card>
                                        </Col>
                                    ) : null}
                                </Row>
                            </div>

                            <div
                                style={{
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
                            </div>

                            <div className="button-end-flex">
                                <Button
                                    type="primary"
                                    icon={<CloseOutlined />}
                                    onClick={() => {
                                        ocultarObservaciones
                                        setCondicionantesSeleccionadas([])
                                        setDocumentosFaltantes([])
                                    }
                                    }
                                    danger
                                >
                                </Button>
                                <Button
                                    className="blue-button"
                                    onClick={() => {
                                        setModalMostrarDocumentosCondicionantes(true)
                                        //mostrarObservaciones()
                                    }
                                    }
                                >
                                    {/* Observaciones({condicionantesSeleccionadas.length + documentosFaltantes.length}) */}
                                    +DOCUMENTOS/CONDICIONANTES ({condicionantesSeleccionadas.length + documentosFaltantes.length})
                                </Button>
                                {
                                    (condicionantesSeleccionadas.length + documentosFaltantes.length > 0) || observaciones != "" ? (
                                        <Button
                                            className="submit-button"
                                            type="primary"
                                            onClick={() =>
                                                setModalEnviarRequisitosYCondicionantes(true)
                                            }
                                        >
                                            ENVIAR
                                        </Button>
                                    ) : null
                                }

                                <CondicionantesRequisitosModal
                                    modalOpened={modalMostrarDocumentosCondicionantes}
                                    setModalOpened={setModalMostrarDocumentosCondicionantes}
                                    condicionantes={condicionantes}
                                    documentos={documentos}
                                    permissions={permissions}
                                    onChangeCheckbox={onChangeCheckbox}
                                    onChangeCondicionantes={onChangeCondicionantes}
                                    revisionAprobadoRechazado={revisionAprobadoRechazado}
                                />
                            </div>
                        </>
                    </div>
                ) : null}
                {/* )} */}
            </Collapse>
            {
                showVistoBueno ? (
                    <Card className="detalles-entidad-card-container">
                        <div>
                            <>
                                <div className="buttons-container">
                                    {
                                        permissions.aprobarPermission &&
                                        !revisionAprobadoRechazado && (
                                            <>
                                                <Button
                                                    disabled={disableMainButtons}
                                                    type="primary"
                                                    className="ant-btn-primary button-primary aprobar-button"
                                                    onClick={() => {
                                                        setDisableMainButtons(true);
                                                        setModalAprobarRevision(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    Visto bueno
                                                </Button>
                                            </>
                                        )
                                    }
                                    {
                                        !revisionAprobado && (
                                            <Button
                                                disabled={disableMainButtons}
                                                type="primary"
                                                className="ant-btn-primary button-primary aprobar-button"
                                                onClick={mostrarObservaciones}
                                            >
                                                <span>Observaciones</span>
                                            </Button>
                                        )
                                    }

                                    {uploadedNegocio.id ? (
                                        <TramitePagos negocio={uploadedNegocio} year={selectedYear} />
                                    ) : null}
                                </div>
                            </>

                            <Modal
                                title="Visto Bueno"
                                centered
                                visible={modalAprobarRevision}
                                onOk={
                                    () => {
                                        setModalAprobarRevision(false);
                                        setIniciaAprobarRevision(true);
                                    }
                                }
                                onCancel={() => {
                                    setDisableMainButtons(false);
                                    setModalAprobarRevision(false);
                                }}
                            >
                                <p>
                                    ¿Está seguro que desea dar el visto bueno a la revisión?
                                </p>
                            </Modal>

                            <Modal
                                title="Rechazar Revisión"
                                centered
                                visible={modalRechazarRevision}
                                onOk={() => rechazarRevision()}
                                onCancel={() => {
                                    setDisableMainButtons(false);
                                    setModalRechazarRevision(false);
                                }}
                            >
                                <p>¿Está seguro que desea rechazar la revisón?</p>
                            </Modal>

                            <Modal
                                title="Enviar Observaciones"
                                centered
                                visible={modalEnviarObservaciones}
                                onOk={() => enviarObservaciones()}
                                onCancel={() => setModalEnviarObservaciones(false)}
                                footer={[
                                    <Button key="back" onClick={() => setModalEnviarObservaciones(false)} loading={isLoading}>
                                        Cancelar
                                    </Button>,
                                    <Button key="submit" type="primary" loading={isLoading} onClick={enviarObservaciones}>
                                        Enviar
                                    </Button>
                                ]}
                            >
                                <p>
                                    ¿Está seguro que desea enviar estas observaciones?
                                </p>
                            </Modal>

                            <Modal
                                title="Enviar Observaciones"
                                centered
                                visible={modalEnviarRequisitosYCondicionantes}
                                // onOk={() => enviarObservaciones()}
                                // onCancel={() => setModalEnviarRequisitosYCondicionantes(false)}
                                footer={[
                                    <Button key="back" onClick={() => setModalEnviarRequisitosYCondicionantes(false)} disabled={isLoading} loading={isLoading}>
                                        Cancelar
                                    </Button>,
                                    <Button key="submit" type="primary" disabled={isLoading}  loading={isLoading} onClick={() => enviarObservaciones()}>
                                        Enviar
                                    </Button>
                                ]}
                                >
                                <p>
                                    ¿Está seguro que desea enviar estos requisitos y/o condicionantes?
                                </p>
                            </Modal>
                        </div>
                    </Card>
                ) : null
            }
        </div>
    );
}
