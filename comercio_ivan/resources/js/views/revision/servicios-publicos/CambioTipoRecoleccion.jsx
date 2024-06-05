import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useNegocioDetallesEntidadRevisora from "../../../utils/hooks/useNegocioDetallesEntidadRevisora";
import { PushpinOutlined } from "@ant-design/icons";
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
} from "antd";
import TramitePagos from "../../pagos/TramitePagos";

import ReactDOM from "react-dom";

import DetalleRecoleccionBasura from "../../components/ComponentesModalDetallesNegocio/DetalleRecoleccionBasura";

const { TextArea } = Input;

import moment from "moment";
import status from "../../../utils/statuses";
import RolesRouter from "../../RolesRouter";
import NegocioDetallesModal from "../../components/NegocioDetallesModal";
import impactos from "../../../utils/impactoGiroComercial";
import MapaUbicacionNegocio from "../../components/MapaUbicacionNegocio";
import TipoRecoleccionPublicoModal from "../../components/TipoRecoleccionPublicoModal";
import TipoRecoleccionPrivadoModal from "../../components/TipoRecoleccionPrivadoModal";
import useGetRecoleccionBasuraInfoByTarifaId from "../../../utils/hooks/useGetRecoleccionBasuraInfoByTarifaId";

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

function CambioTipoRecoleccion(props) {
    const [modalNegocioDetallesAbierto, setModalNegocioDetallesAbierto] = useState(false);
    const [modalTipoRecoleccionPrivadoAbierto, setModalTipoRecoleccionPrivadoAbierto] = useState(false);
    const [modalTipoRecoleccionPublicoAbierto, setModalTipoRecoleccionPublicoAbierto] = useState(false);
    const [entidadRevision, setEntidadRevision] = useState(0);
    const [revisionAprobadoRechazado, setRevisionAprobadoRechazado] =
    useState(false);


    const [year, setYear] = useState();

    const [revisionAprobado, setRevisionAprobado] = useState(false);
    const [negocio, updateNegocio] = useNegocioDetallesEntidadRevisora(

        window.user.entidad_revision,
        year
    );


    const [pos, setPos] = useState(undefined);


    const [recoleccionBasuraInfo, getRecoleccionBasuraInfoByTarifaId] =
        useGetRecoleccionBasuraInfoByTarifaId();
    useEffect(() => {
        getRecoleccionBasuraInfoByTarifaId( negocio?.tarifa_recoleccion_id ?? -1);
    }, [ negocio?.tarifa_recoleccion_id ?? -1]);

    const navigate = useNavigate();
    const forceUpdate = useForceUpdate();

    const handleSubmitPrivadoModal = (values) => {
        axios
        .post("/app/update-recoleccion-privado", {
            negocio_id: negocio.id,
            year: year,
            privado_o_propia: values.privado_o_propia,
            empresa: (values.privado_o_propia == 'servicio_privado') ? values.empresa : null,
            entidad_revision_id: window.user.entidad_revision,
        })
        .then((respuesta) => {
            console.log(respuesta.data.message);
            if(respuesta.data.ok){
                setModalTipoRecoleccionPrivadoAbierto(false);
                setTimeout(() => {
                    window.location.reload();
                    }, 1000);
            }
        })
        .catch((error) => console.log(error));
        console.log('Formulario privado enviado:', values);
    };
    const handleSubmitPublicoModal = (values) => {
        axios
        .post("/app/update-recoleccion-publico", {
            negocio_id: negocio.id,
            year: year,
            periodo: values.periodo,
            volumen: values.volumen,
            tarifa_recoleccion_id: values.tarifa_recoleccion_id,
            entidad_revision_id: window.user.entidad_revision,
        })
        .then((respuesta) => {
            console.log(respuesta.data.message);
            if(respuesta.data.ok){
                setModalTipoRecoleccionPublicoAbierto(false);
                setTimeout(() => {
                    window.location.reload();
                  }, 1000);
            }
        })
        .catch((error) => console.log(error));
        console.log('Formulario publico enviado:', values);
    };

    const updateNegocioState = () => {
        const routeArray = location.href.split("/");
        const negocioId = routeArray[routeArray.length - 2];
        updateNegocio(negocioId,4,routeArray[routeArray.length - 1]);
        setYear(routeArray[routeArray.length - 1]);
    };

    useEffect(() => {
        updateNegocioState();
    }, []);


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
        switch (impacto) {
            case "bajo_impacto":
                switch (entidad_id) {
                    case "1":
                        setPermissions({
                            ...permissionsStates,
                            aprobarPermission: true,
                            condicionantesPermission: true,
                        });
                        break;
                    case "2":
                        setPermissions({
                            ...permissionsStates,
                            pagoPermission: true,
                            condicionantesPermission: true,
                        });
                        break;
                    case "3":
                        setPermissions({
                            ...permissionsStates,
                            pagoPermission: true,
                        });
                        break;
                    case "4":
                        setPermissions({
                            ...permissionsStates,
                        });
                        break;
                }
                break;
            case "mediano_alto_impacto":
                switch (entidad_id) {
                    case "1":
                        setPermissions({
                            ...permissionsStatesTrue,
                        });
                        break;
                    case "2":
                        setPermissions({
                            ...permissionsStatesTrue,
                        });
                        break;
                    case "3":
                        setPermissions({
                            ...permissionsStates,
                            pagoPermission: true,
                            condicionantesPermission: true,
                        });
                        break;
                    case "4":
                        setPermissions({
                            ...permissionsStatesTrue,
                        });
                        break;
                }
                break;
        }
    };

    useEffect(() => {
        if (negocio.id) {
            let negocioMarker = {
                lat: +negocio.direccion.latitud,
                lng: +negocio.direccion.longitude,
            };

            setPos(negocioMarker);
            //setDocumentosAprobados(documentosFromRevisions());
            getPermissionsFromEntity();
        }
        if (negocio.revisiones) {
            var negocio_status = null;

            negocio.revisiones.map((revision) => {
                if (
                    revision.entidad_revision_id == window.user.entidad_revision
                ) {
                    negocio_status = revision.status;
                }
            });

            setRevisionAprobadoRechazado(
                negocio_status === status.APROBADO ||
                    negocio_status === status.VISOR ||
                    negocio_status === status.RECHAZADO ||
                    negocio_status === status.VISTO_BUENO
            );
            //console.log("negocio_status: ", negocio_status);
            setRevisionAprobado(negocio_status === status.APROBADO);
        }
    }, [negocio]);

    useEffect(() => {
        window.user;
        setEntidadRevision(window.user.entidad_revision);
        forceUpdate();
        console.log("effect useNegocioDetallesEntidadRevisora");
    }, [useNegocioDetallesEntidadRevisora]);


    const mostrarCambiarRecoleccionPrivado = () => {
        setShowCambiarRecoleccionPrivado(true);
    };

    const mostrarCambiarRecoleccionPublico = () => {
        setShowCambiarRecoleccionPublico(true);
    };

    const navigateToHome = () => {
        navigate("/app/revision-negocios/");
    };

    return (
        <div className="sare--container">
            <RolesRouter />
            <h1>Cambio de tipo de recolección de Basura</h1>
            <h3>Información del negocio - {negocio.nombre_del_negocio}</h3>
            <p>
                Trámite:{" "}
                {negocio.catalogo_tramite && negocio.catalogo_tramite.nombre}
            </p>
            <p>Impacto: {impactos.tag(negocio.impacto_giro_comercial)}</p>
            <Divider></Divider>
            <Row
                gutter={[24, { xs: 8, sm: 8, md: 24, lg: 32 }]}
                className="negocio-info-row"
            >
                <Col className="gutter-row" xs={24} sm={24} lg={12} xl={12}>
                    <Row>
                        <Col
                            className="gutter-row"
                            xs={24}
                            sm={12}
                            lg={12}
                            span={8}
                        >
                            <div className="sare--descriptions-column">
                                <h3>Negocio</h3>
                                <p>
                                    <b>Nombre: </b> {negocio.nombre_del_negocio}
                                </p>
                                <p>
                                    <b>Estado:</b>
                                    {status.tag(
                                        `${
                                            negocio?.status === "APROBADO"
                                                ? negocio?.status + "_DN"
                                                : negocio?.status
                                        }`
                                    )}
                                </p>
                                <p>
                                    <b className="label-info">Teléfono: </b>
                                    {negocio.telefono || "N/D"}
                                </p>
                            </div>
                        </Col>
                        <Col
                            className="gutter-row"
                            xs={24}
                            sm={12}
                            lg={12}
                            span={8}
                        >
                            {!!negocio.persona_moral &&
                            negocio.persona_moral != null ? (
                                <div>
                                    <h3>Persona Moral</h3>
                                    <p>
                                        <b className="label-info">
                                            Razón Social:
                                        </b>
                                        {negocio.persona_moral.razon_social}
                                    </p>
                                    <p>
                                        <b className="label-info">RFC: </b>
                                        {negocio.persona_moral.rfc}
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <h3>Persona Moral</h3>
                                    <p>N/A</p>
                                </div>
                            )}
                        </Col>
                        <Col
                            className="gutter-row"
                            xs={24}
                            sm={12}
                            lg={12}
                            span={8}
                        >
                            {!!negocio.persona && (
                                <div>
                                    <h3>Propietario</h3>
                                    <p>
                                        <b className="label-info">Nombre: </b>
                                        {negocio.persona.nombre || "N/D"}
                                    </p>
                                    <p>
                                        <b className="label-info">
                                            Apellido Paterno:
                                        </b>
                                        {negocio.persona.apellido_pat || "N/D"}
                                    </p>
                                    <p>
                                        <b className="label-info">
                                            Apellido Materno:
                                        </b>
                                        {negocio.persona.apellido_mot || "N/D"}
                                    </p>
                                    <p>
                                        <b className="label-info">Email: </b>
                                        {negocio.persona.email || "N/D"}
                                    </p>
                                    <p>
                                        <b className="label-info">CURP: </b>
                                        {negocio.persona.curp || "N/D"}
                                    </p>
                                    <p>
                                        <b className="label-info">RFC: </b>
                                        {negocio.persona.rfc || "N/D"}
                                    </p>
                                </div>
                            )}
                        </Col>
                        <Col className="gutter-row" xs={24} sm={12} lg={12}>
                            {!!negocio.direccion && (
                                <div>
                                    <h3>Dirección</h3>
                                    <p>
                                        <b className="label-info">Calle: </b>
                                        {negocio.direccion.calle_principal ||
                                            "N/D"}
                                    </p>
                                    <p>
                                        <b className="label-info">
                                            Entre calles:
                                        </b>
                                        {negocio.direccion.calles || "N/D"}
                                    </p>
                                    <p>
                                        <b className="label-info">
                                            Código postal:
                                        </b>
                                        {negocio.direccion.codigo_postal ||
                                            "N/D"}
                                    </p>
                                    <p>
                                        <b className="label-info">Nº Ext: </b>
                                        {negocio.direccion.numero_externo ||
                                            "N/D"}
                                    </p>
                                    <p>
                                        <b className="label-info">Nº Int: </b>
                                        {negocio.direccion.numero_interno ||
                                            "N/D"}
                                    </p>
                                    <p>
                                        <b className="label-info">Tipo: </b>
                                        {negocio.direccion.tipo || "N/D"}
                                    </p>
                                </div>
                            )}
                        </Col>
                        <Col className="gutter-row" xs={24} sm={12} lg={12}>

                                <div>
                                    <h3>Recolección de Basura</h3>
                                    {(recoleccionBasuraInfo?.periodo ?? "") !== "" &&
                                    (recoleccionBasuraInfo?.volumen ?? "") ? (

                                        <>
                                            <p>
                                                <b>Periodo: </b>
                                                {recoleccionBasuraInfo?.periodo || ""}
                                            </p>
                                            <p>
                                                <b>Volumen: </b>
                                                {recoleccionBasuraInfo?.volumen || ""}
                                            </p>
                                            {/* <p>
                                                <b>Servicio privado de recolección de basura: </b>
                                                {negocio.servicio_priv_recoleccion || 'N/A'}
                                            </p> */}
                                        </>
                                    ) : (
                                        <div>
                                            <p>
                                                <b>Descripción: </b>
                                                {recoleccionBasuraInfo?.descripcion ?? ""}
                                            </p>
                                            <p>
                                                <b>Servicio privado de recolección de basura: </b>
                                                {negocio.servicio_priv_recoleccion || 'N/A'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                        </Col>
                    </Row>
                </Col>
                <Col className="gutter-row" xs={24} sm={24} lg={12} xl={12}>
                    {!!pos && (
                        <MapaUbicacionNegocio
                            pos={pos}
                            tipo={negocio?.tipo_predio}
                            clave_catastral={negocio?.clave_catastral}
                        />
                    )}

                    {!!negocio?.created_at && (
                        <div style={{ padding: 30 }}>
                            <Button
                                onClick={() =>
                                    setModalNegocioDetallesAbierto(true)
                                }
                                type="primary"
                                block
                            >
                                Ver Información Completa del Negocio
                            </Button>
                        </div>
                    )}
                </Col>
            </Row>
            <NegocioDetallesModal
                visible={modalNegocioDetallesAbierto}
                onOk={() => setModalNegocioDetallesAbierto(false)}
                onCancel={() => setModalNegocioDetallesAbierto(false)}
                negocio={negocio}
            />
            <TipoRecoleccionPublicoModal
                visible={modalTipoRecoleccionPublicoAbierto}
                onOk={() => setModalTipoRecoleccionPublicoAbierto(false)}
                onCancel={() => setModalTipoRecoleccionPublicoAbierto(false)}
                onSubmit={handleSubmitPublicoModal}
                negocio={negocio}
            />
            <TipoRecoleccionPrivadoModal
                visible={modalTipoRecoleccionPrivadoAbierto}
                onOk={() => setModalTipoRecoleccionPrivadoAbierto(false)}
                onCancel={() => setModalTipoRecoleccionPrivadoAbierto(false)}
                onSubmit={handleSubmitPrivadoModal}
                negocio={negocio}
                year={year}
            />

            <div>
            <div className="cambiar-recoleccion">

                <>
                    <div className="buttons-container">
                    {(recoleccionBasuraInfo?.periodo ?? "") !== "" &&
                    (recoleccionBasuraInfo?.volumen ?? "") ? (
                        <>
                            <Button
                                // disabled={disableMainButtons}
                                type="primary"
                                className="ant-btn-primary button-primary aprobar-button"
                                onClick={ () => setModalTipoRecoleccionPrivadoAbierto(true)}

                            >
                                <span>Cambiar a Privado</span>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                // disabled={disableMainButtons}
                                type="primary"
                                className="ant-btn-primary button-primary aprobar-button"
                                onClick={ () => setModalTipoRecoleccionPrivadoAbierto(true)}
                            >
                                <span>Cambiar a Privado</span>
                            </Button>
                            <Button
                            // disabled={disableMainButtons}
                            type="primary"
                            className="ant-btn-primary button-primary aprobar-button"
                            onClick={ () => setModalTipoRecoleccionPublicoAbierto(true)}
                            >
                                <span>Cambiar Público</span>
                            </Button>
                        </>
                    )}



                    </div>
                </>

            </div>


            </div>
        </div>
    );
}

export default CambioTipoRecoleccion;

