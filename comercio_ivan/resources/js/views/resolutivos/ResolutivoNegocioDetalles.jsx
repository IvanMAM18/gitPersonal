import React from "react";
import { Row, Col } from "antd";
import DetalleNegocio from "./componentes/DetallesNegocio/DetalleNegocio";
import DetalleDireccionResolutivo from "./componentes/DetallesNegocio/DetalleDireccionResolutivo";
import DetalleEstadistica from "./componentes/DetallesNegocio/DetalleEstadistica";

const colProps = {
    className: "gutter-row",
    xs: 24,
    sm: 24,
    md: 24,
    lg: 24,
    xl: 24,
};

const colProps2 = {
    className: "gutter-row",
    xs: 24,
    sm: 24,
    md: 24,
    lg: 24,
    xl: 24,
};

const colProps3 = {
    className: "gutter-row",
    xs: 24,
    sm: 24,
    md: 24,
    lg: 24,
    xl: 24,
};
export default function ResolutivoNegocioDetalles({ negocio }) {
    return (
        <div>
            <Row gutter={[60, { xs: 16, sm: 16, md: 54, lg: 64 }]}>
                <Col {...colProps}>
                    <DetalleNegocio negocio={negocio} />
                </Col>
                <Col {...colProps3}>
                    <DetalleDireccionResolutivo negocio={negocio} />
                </Col>
            </Row>
            <Row gutter={[60, { xs: 16, sm: 16, md: 54, lg: 64 }]}>
                <Col {...colProps2}>
                    <DetalleEstadistica negocio={negocio} />
                </Col>
            </Row>
        </div>
    );
}
