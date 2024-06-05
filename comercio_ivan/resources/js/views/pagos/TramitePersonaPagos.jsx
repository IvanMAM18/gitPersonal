import React, { useEffect, useState } from "react";
import GenerarCobrosModal from "./CrearPagoModal";
import CobrosContext from "./TramitePagosContext";

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
    message
} from "antd";

function GenerarCobros({ tramitePadreId }) {
    const [crearPagoFormModalVisible, setCrearPagoFormModalVisible] = useState(false);
    const [tramitePadre, setTramitePadre] = useState(null);
    const [tramiteEntidadRevision, setTramiteEntidadRevision] = useState(null);
    const [requierePago, setRequierePago] = useState(false);
    const [generaResolutivo, setGeneraResolutivo] = useState(false);
    const [avisoEntero, setAvisoEntero] = useState(null);
    const [requiereLicenciaAlcohol, setRequiereLicenciaAlcohol] = useState(false);
    const [tieneLicenciaDeAlcohol, setTieneLicenciaDeAlcohol] = useState(true);
    const [persona, setPersona] = useState(null);

    useEffect(() => {
        obtenerTramite();
    }, [])

    const obtenerTramite = () => {
        if(!tramitePadreId)
            return;

        axios
            .get(`/entidad-revision/tramites/${tramitePadreId}/detalles`)
            .then(response => {
                const _tramiteEntidadRevision = response.data.tramite_entidad_revision;
                _tramiteEntidadRevision.catalogo_tramites = [_tramiteEntidadRevision.catalogo_tramite];
                setTramitePadre(response.data);
                setTramiteEntidadRevision(_tramiteEntidadRevision);
                setRequierePago(_tramiteEntidadRevision.catalogo_tramite.pago == 1);
                setGeneraResolutivo(_tramiteEntidadRevision.catalogo_tramite.resolutivo == 1);
                setAvisoEntero(_tramiteEntidadRevision.aviso_entero);
                setRequiereLicenciaAlcohol(_tramiteEntidadRevision.catalogo_tramite.entidad_revisora_id == 6);
                setPersona(response.data.tramitable);
            })
            .catch(error => {
                console.error(error);
            })
    }

    const abrirAvisoEntero = () => {
        window.open(`/entidad-revision/avisos-enteros/${avisoEntero.id}/pdf`, '_blank', 'fullscreen=yes');
    };

    const abrirPagoFormModal = () => {
        if(!requiereLicenciaAlcohol) {
            setCrearPagoFormModalVisible(true);
            return;
        }

        if(!tieneLicenciaDeAlcohol) {
            message.error('Este negocio no cuenta con licencia de alcohol operativa.');
            return;
        }

        setCrearPagoFormModalVisible(true);
    }

    const solicitarPagoButton = <Button
        type="primary"
        className="ant-btn-primary button-primary tall-button"
        onClick={() => abrirPagoFormModal()}
    >
        Solicitar pago
    </Button>;

    const avisoExpiradoFragment = <React.Fragment>
        <Button
            type="primary"
            className="ant-btn-primary button-primary tall-button"
            onClick={abrirAvisoEntero}
        >
            Aviso expirado
        </Button>
        <Button
            type="primary"
            className="ant-btn-primary button-primary tall-button"
            onClick={() => setCrearPagoFormModalVisible(true)}
            style={{'margin-left': '12px'}}
        >
            Actualizar aviso
        </Button>
    </React.Fragment>;

    const verAvisoButton = <Button
        type="primary"
        className="ant-btn-primary button-primary tall-button"
        onClick={abrirAvisoEntero}
    >
        Ver aviso entero
    </Button>;

    if(!requierePago)
        return ( null );

    return (
        <CobrosContext.Provider value={{
            crearPagoFormModalVisible,
            setCrearPagoFormModalVisible,
            tramite: tramiteEntidadRevision,
            setTramite: setTramiteEntidadRevision,
            negocio: null,
            setNegocio: null,
            avisoEntero,
            setAvisoEntero,
            persona,
        }}>
            {
                <div style={{display: "flex", justifyContent: "center"}}>
                    { !avisoEntero ? solicitarPagoButton : null }
                    { !!avisoEntero && avisoEntero.expirado ? avisoExpiradoFragment : null }
                    { !!avisoEntero && !avisoEntero.expirado ? verAvisoButton : null }
                    <GenerarCobrosModal/>
                </div>
            }
        </CobrosContext.Provider>
    )
}

export default GenerarCobros;
