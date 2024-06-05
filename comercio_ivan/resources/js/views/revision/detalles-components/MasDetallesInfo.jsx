import React from "react";
import {
    Card,
    Collapse,
    Row,
    Col,
    Popover,
    Tag
} from "antd";
const { Panel } = Collapse;


import DetalleNegocio from "../../components/ComponentesModalDetallesNegocio/DetalleNegocio";
import DetallePropietario from "../../components/ComponentesModalDetallesNegocio/DetallePropietario"
import DetalleDireccion from "../../components/ComponentesModalDetallesNegocio/DetalleDireccion";
import DetalleHorario from "../../components/ComponentesModalDetallesNegocio/DetalleHorario";
import DetalleEstadistica from "../../components/ComponentesModalDetallesNegocio/DetalleEstadistica";
import DetallePredio from "../../components/ComponentesModalDetallesNegocio/DetallePredio";
import DetalleRecoleccionBasura from "../../components/ComponentesModalDetallesNegocio/DetalleRecoleccionBasura";

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

function MasDetallesInfo({ negocio }) {

    console.log("MasDetallesInfo: ", negocio)
    return (
        <>
                <Collapse collapsible="header" className="detalles-entidad-card-container">
                    <Panel header="Mas Detalles" key="1">
                        <Collapse collapsible="header">
                            <Panel header="Negocio" key="1">
                                <Row gutter={[60, { xs: 16, sm: 16, md: 54, lg: 64 }]}>
                                    <Col>
                                        <DetalleNegocio negocio={negocio} />
                                    </Col>
                                    {/* <Col {...colProps2}>
                                        <DetallePropietario negocio={negocio} />
                                    </Col>
                                    <Col {...colProps3}>
                                        <DetalleDireccion negocio={negocio} />
                                    </Col> */}
                                </Row>
                            </Panel>
                            <Panel header="Giros Comerciales" key="2">
                                <Row gutter={[60, { xs: 16, sm: 16, md: 54, lg: 64 }]}>
                                    <Col>
                                        {negocio?.giro_comercial?.length && (
                                            <div style={{ marginTop: 20 }}>
                                                {negocio?.giro_comercial?.map((gc, id) => (
                                                    <Popover
                                                        key={"gc" + id}
                                                        placement="top"
                                                        title={gc?.tipo?.replace(/_/g, " ")}
                                                        content={gc?.descripcion}
                                                        trigger="click"
                                                    >
                                                        <Tag>
                                                            <tt>
                                                                <b>{gc?.nombre}</b>
                                                            </tt>
                                                        </Tag>
                                                    </Popover>
                                                ))}
                                            </div>
                                        )}
                                    </Col>
                                </Row>
                            </Panel>
                            <Panel header="Horarios" key="3">
                                <Row gutter={[60, { xs: 16, sm: 16, md: 54, lg: 64 }]}>
                                    <Col>
                                        <DetalleHorario negocio={negocio} />
                                    </Col>
                                </Row>
                            </Panel>
                            <Panel header="Estadística" key="4">
                                <Row gutter={[60, { xs: 16, sm: 16, md: 54, lg: 64 }]}>
                                    <Col>
                                        <DetalleEstadistica negocio={negocio} />
                                    </Col>
                                </Row>
                            </Panel>
                            {/* <Panel header="Información del predio" key="5">
                                <Row gutter={[60, { xs: 16, sm: 16, md: 54, lg: 64 }]}>
                                    <Col>
                                        <DetallePredio
                                        tipo={negocio?.tipo_predio}
                                        clave_catastral={negocio?.clave_catastral}
                                    />
                                    </Col>
                                </Row>
                            </Panel> */}
                            <Panel header="Recolección de basura" key="6">
                                <Row gutter={[60, { xs: 16, sm: 16, md: 54, lg: 64 }]}>
                                    <Col>
                                        <DetalleRecoleccionBasura
                                            tarifa_recoleccion_id={
                                                negocio?.tarifa_recoleccion_id ?? -1
                                            }
                                            negocio={negocio}
                                        />
                                    </Col>
                                </Row>
                            </Panel>
                        </Collapse>
                        {/* <Row gutter={[60, { xs: 16, sm: 16, md: 54, lg: 64 }]}>
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
                        </Row> */}
                    </Panel>
                </Collapse>
        </>
    )
}

export default MasDetallesInfo;