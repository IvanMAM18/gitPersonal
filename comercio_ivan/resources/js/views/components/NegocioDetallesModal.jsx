import { Divider, Modal, Popover, Tag, Row, Col, Image } from "antd";
import React from "react";
import moment from "moment";
import status from "../../utils/statuses";
import DetalleNegocio from "./ComponentesModalDetallesNegocio/DetalleNegocio";
import DetallePropietario from "./ComponentesModalDetallesNegocio/DetallePropietario";
import DetalleDireccion from "./ComponentesModalDetallesNegocio/DetalleDireccion";
import DetalleHorario from "./ComponentesModalDetallesNegocio/DetalleHorario";
import DetalleEstadistica from "./ComponentesModalDetallesNegocio/DetalleEstadistica";
import DetallePredio from "./ComponentesModalDetallesNegocio/DetallePredio";
import DetalleRecoleccionBasura from "./ComponentesModalDetallesNegocio/DetalleRecoleccionBasura";

const colProps = {
    className: "gutter-row",
    xs: 24,
    sm: 24,
    md: 12,
    lg: 12,
    xl: 8,
};

const colProps2 = {
    className: "gutter-row",
    xs: 24,
    sm: 24,
    md: 12,
    lg: 12,
    xl: 6,
};

const colProps3 = {
    className: "gutter-row",
    xs: 24,
    sm: 24,
    md: 12,
    lg: 24,
    xl: 10,
};
function NegocioDetallesModal(props) {
    const { negocio } = props;
    const sectoresConPeso = {
        SERVICIOS: 1,
        COMERCIO: 2,
        INDUSTRIA: 3
    }
    const getSector =()=>{
        const sectoresGiros = negocio?.giro_comercial?.map(giro => giro?.tipo_sector ?? null);
        let maxSector = '';
        let maxValue = 0;
        if(sectoresGiros!=null)
        sectoresGiros.forEach(sector => {
            if (sectoresConPeso[sector] > maxValue) {
                maxValue = sectoresConPeso[sector];
                maxSector = sector;
            }
        });
        return maxSector;
    }
    

    return (
        <Modal
            title="Detalles Negocio"
            visible={props.visible}
            onOk={props.onOk}
            onCancel={props.onCancel}
            destroyOnClose={true}
            width={"90%"}
        >
            <Row gutter={[60, { xs: 16, sm: 16, md: 54, lg: 64 }]}>
                <Col {...colProps}>
                    <DetalleNegocio negocio={{...negocio,sector:getSector()}} />
                </Col>
                <Col {...colProps2}>
                    <DetallePropietario negocio={negocio} />
                </Col>
                <Col {...colProps3}>
                    <DetalleDireccion negocio={negocio} />
                </Col>
            </Row>
            <Row gutter={[60, { xs: 16, sm: 16, md: 54, lg: 64 }]}>
                <Col {...colProps}>
                    <DetalleHorario negocio={negocio} />
                </Col>
                <Col {...colProps2}>
                    <DetalleEstadistica negocio={negocio} />
                </Col>
                <Col {...colProps3}>
                    <DetallePredio
                        tipo={negocio?.tipo_predio}
                        clave_catastral={negocio?.clave_catastral}
                    />
                </Col>
                <Col {...colProps3}>
                    <DetalleRecoleccionBasura
                        tarifa_recoleccion_id={
                            negocio?.tarifa_recoleccion_id ?? -1
                        }
                        negocio = {negocio}
                    />
                </Col>
            </Row>
        </Modal>
    );
}

export default NegocioDetallesModal;
