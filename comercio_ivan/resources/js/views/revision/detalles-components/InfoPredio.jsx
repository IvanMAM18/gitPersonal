import React from "react";
import {
    Card,
    Collapse,
    Row,
    Col,
} from "antd";
import DetallePredio from "../../components/ComponentesModalDetallesNegocio/DetallePredio";
const { Panel } = Collapse;


function InfoPredio({ negocio }) {
    return (
        <>
            <Collapse collapsible="header" className="detalles-entidad-card-container">
                <Panel header="Información del predio" key="5">
                    <Row gutter={[60, { xs: 16, sm: 16, md: 54, lg: 64 }]}>
                        <Col>
                            <DetallePredio
                                tipo={negocio?.tipo_predio}
                                clave_catastral={negocio?.clave_catastral}
                            />
                        </Col>
                    </Row>
                </Panel>
            </Collapse>
        </>

    )
}

export default InfoPredio;