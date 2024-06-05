import React from "react";
import {
    Card,
    Row,
    Col
} from "antd";
import status from "../../../utils/statuses";
import impactos from "../../../utils/impactoGiroComercial";

import MapaUbicacionNegocio from "../../components/MapaUbicacionNegocio";
import DetallePredio from "../../components/ComponentesModalDetallesNegocio/DetallePredio";

function DireccionInfo({ negocio, pos }) {
    //const [pos, setPos] = useState(undefined);

    return (
        <>
            {!!negocio.direccion && (
                <Card className="detalles-entidad-card-container">
                    <Row gutter={[24, { xs: 8, sm: 8, md: 24, lg: 32 }]}>
                        <Col className="gutter-row" xs={24} sm={24} lg={12} xl={12}>
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
                            {
                                negocio?.clave_catastral != null &&
                                <p>
                                    <DetallePredio
                                        tipo={negocio?.tipo_predio}
                                        clave_catastral={negocio?.clave_catastral}
                                    />
                                </p>
                            }
                            
                            {/* <InfoPredio negocio={negocio} /> */}
                        </div>
                        </Col>
                        <Col className="gutter-row" xs={24} sm={24} lg={12} xl={12}>
                        <div>
                            {!!pos && (
                                <MapaUbicacionNegocio
                                    pos={pos}
                                    tipo={negocio?.tipo_predio}
                                    clave_catastral={negocio?.clave_catastral}
                                />
                            )}
                        </div>
                        </Col>
                    </Row>

                </Card>
            )}
        </>
    )
}

export default DireccionInfo;