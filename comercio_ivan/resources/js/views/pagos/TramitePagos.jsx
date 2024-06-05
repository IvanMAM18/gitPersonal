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

function GenerarCobros({negocio: _negocio, year}) {
    const [crearPagoFormModalVisible, setCrearPagoFormModalVisible] = useState(false);

    const [negocio, setNegocio] = useState(null);
    const [tramite, setTramite] = useState(null);
    const [requierePago, setRequierePago] = useState(false);
    const [generaResolutivo, setGeneraResolutivo] = useState(false);
    const [avisoEntero, setAvisoEntero] = useState(null);
    const [requiereLicenciaAlcohol, setRequiereLicenciaAlcohol] = useState(false);
    const [cargando, setCargando] = useState(false);

    // useEffect(() => {
    //     obtenerTramite();
    // }, []);

    useEffect(() => {
        obtenerTramite();
    }, [year])

    const obtenerTramite = () => {
        if(!_negocio)
            return;

        setCargando(true);

        axios
            .get('/entidad-revision/tramite/por-negocio', { params: {negocio_id: _negocio.id, year}})
            .then(response => {
                setNegocio(_negocio);
                if(response.data) {
                    setTramite(response.data);
                    setRequierePago(response.data.catalogo_tramites[0].pago == 1);
                    setGeneraResolutivo(response.data.catalogo_tramites.resolutivo == 1);
                    setAvisoEntero(response.data.aviso_entero);
                    setRequiereLicenciaAlcohol(response.data.catalogo_tramites[0].departamento_id == 6);
                }
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => setCargando(false));
    }

    const abrirAvisoEntero = () => {
        window.open(`/entidad-revision/avisos-enteros/${avisoEntero.id}/pdf`, '_blank', 'fullscreen=yes');
    };

    const abrirPagoFormModal = () => {
        const entidadRevisoraId = window.user.entidad_revision;
        const entidadesPagoDesactivado = [];
         //const entidadesPagoDesactivado = ["2"]; //Proteccion civil

        if(entidadesPagoDesactivado.includes(entidadRevisoraId) && year==2024) {
            message.error('Pago desactivado temporalmente.');
            return;
        }

        if(!requiereLicenciaAlcohol) {
            setCrearPagoFormModalVisible(true);
            return;
        }

        if(!negocio.licencia_alcohol) {
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
            disabled={cargando}
        >
            Aviso expirado
        </Button>
        <Button
            type="primary"
            className="ant-btn-primary button-primary tall-button"
            onClick={() => setCrearPagoFormModalVisible(true)}
            style={{'margin-left': '12px'}}
            disabled={cargando}
        >
            Actualizar aviso
        </Button>
    </React.Fragment>;

    const verAvisoButton = <Button
        type="primary"
        className="ant-btn-primary button-primary tall-button"
        onClick={abrirAvisoEntero}
        disabled={cargando}
    >
        Ver aviso entero
    </Button>;

    if(!requierePago)
        return ( null );

    return (
        <CobrosContext.Provider value={{
            crearPagoFormModalVisible,
            setCrearPagoFormModalVisible,
            tramite,
            setTramite,
            negocio,
            setNegocio,
            avisoEntero,
            setAvisoEntero,
            year,
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
