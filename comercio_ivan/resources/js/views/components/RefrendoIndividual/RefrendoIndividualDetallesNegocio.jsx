import React from 'react';
import DetalleNegocio from "../ComponentesModalDetallesNegocio/DetalleNegocio";
import DetallePropietario from "../ComponentesModalDetallesNegocio/DetallePropietario";
import DetalleDireccion from "../ComponentesModalDetallesNegocio/DetalleDireccion";
import DetalleHorario from "../ComponentesModalDetallesNegocio/DetalleHorario";
import DetalleEstadistica from "../ComponentesModalDetallesNegocio/DetalleEstadistica";
import DetallePredio from "../ComponentesModalDetallesNegocio/DetallePredio";
import DetalleRecoleccionBasura from "../ComponentesModalDetallesNegocio/DetalleRecoleccionBasura";
import { Col, Row } from 'antd';
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

export default function RefrendoIndividualDetallesNegocio({ negocio }) {
    return (
        <>
            <Row gutter={[60, { xs: 16, sm: 16, md: 54, lg: 64 }]}>
                <Col {...colProps}>
                    <DetalleNegocio negocio={negocio} />
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
                        negocio={negocio}
                    />
                </Col>
            </Row>
        </>
    )
}
