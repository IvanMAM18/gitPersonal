import React, { useEffect, useState } from 'react'

import { PushpinOutlined } from "@ant-design/icons";
import GoogleMapReact from "google-map-react";
import { Card, Row, Col, Space, } from "antd";
import status from "../../../utils/statuses";
import BotonUpdateField from './BotonUpdateField';

export default function NegocioInfo({ negocio }) {

    const [pos, setPos] = useState(null);


    useEffect(() => {
        if (negocio !== null) {
            setPos({
                lat: +negocio?.direccion?.latitud ?? "0",
                lng: +negocio?.direccion?.longitude ?? "0",
            });
        }
    }, [negocio]);

    const Marker = () => (
        <PushpinOutlined
            style={{
                transform: "translate(-7%, -100%)",
                fontSize: 30,
                color: "red",
            }}
        />
    );

    return (
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
                                <b>Nombre: </b>
                                {negocio.nombre_del_negocio}
                            </p>
                            <p>
                                <b>Estado: </b>
                                {status.tag(
                                    `${negocio?.status === "APROBADO"
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
                                    </b>{" "}
                                    {negocio.persona_moral.razon_social}
                                </p>
                                <p>
                                    <b className="label-info">RFC: </b>{" "}
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
                                    <b className="label-info">
                                        Nombre:{" "}
                                    </b>{" "}
                                    {negocio.persona.nombre || "N/D"}
                                </p>
                                <p>
                                    <b className="label-info">
                                        Apellido Paterno:{" "}
                                    </b>{" "}
                                    {negocio.persona.apellido_pat ||
                                        "N/D"}
                                </p>
                                <p>
                                    <b className="label-info">
                                        Apellido Materno:{" "}
                                    </b>{" "}
                                    {negocio.persona.apellido_mot ||
                                        "N/D"}
                                </p>
                                <p>
                                    <b className="label-info">
                                        Email:{" "}
                                    </b>{" "}
                                    {negocio.persona.email || "N/D"}
                                </p>
                                <p>
                                    <b className="label-info">CURP: </b>{" "}
                                    {negocio.persona.curp || "N/D"}
                                </p>
                                <p>
                                    <b className="label-info">RFC: </b>{" "}
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
                                    <b className="label-info">
                                        Calle:{" "}
                                    </b>{" "}
                                    {negocio.direccion
                                        .calle_principal || "N/D"}
                                </p>
                                <p>
                                    <b className="label-info">
                                        Entre calles:
                                    </b>{" "}
                                    {negocio.direccion.calles || "N/D"}
                                </p>
                                <p>
                                    <b className="label-info">
                                        Código postal:
                                    </b>{" "}
                                    {negocio.direccion.codigo_postal ||
                                        "N/D"}
                                </p>
                                <p>
                                    <b className="label-info">
                                        Nº Ext:{" "}
                                    </b>{" "}
                                    {negocio.direccion.numero_externo ||
                                        "N/D"}
                                </p>
                                <p>
                                    <b className="label-info">
                                        Nº Int:{" "}
                                    </b>{" "}
                                    {negocio.direccion.numero_interno ||
                                        "N/D"}
                                </p>
                                <p>
                                    <b className="label-info">Tipo: </b>{" "}
                                    {negocio.direccion.tipo || "N/D"}
                                </p>
                            </div>
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Space size={"middle"} direction={"vertical"}>
                            <h3>Campos a re-establecer</h3>
                            <div>
                                <strong>FOTO DE FACHADA</strong>{" "}
                                <BotonUpdateField 
                                    negocioId={negocio?.id}
                                    campoParaActualizar={"foto_frontal_fachada"}
                                    nuevoValor={null}
                                    nombreParaMostrar={"Foto de fachada"}/>
                            </div>
                            <div>
                                <strong>COMPROBANTE DE DOMICILIO</strong>{" "}
                                <BotonUpdateField
                                    negocioId={negocio?.id}
                                    campoParaActualizar={"comprobante_domicilio"}
                                    nuevoValor={null}
                                    nombreParaMostrar={"Comprobante de domicilio"}/>
                                </div>
                            <div>
                                <strong>DOCUMENTO DE PROPIEDAD</strong>{" "} 
                                <BotonUpdateField
                                negocioId={negocio?.id}
                                campoParaActualizar={"documento_predio_propiedad"}
                                nuevoValor={null}
                                nombreParaMostrar={"Documento de propiedad"}/>
                            </div>
                        </Space>
                        <hr/>
                    </Col>
                </Row>
            </Col>

            <Col className="gutter-row" xs={24} sm={24} lg={12} xl={12}>
                <Row
                    gutter={[24, { xs: 24, sm: 24, md: 24, lg: 32 }]}
                    className="negocio-info-row"
                >
                    <Col
                        className="gutter-row"
                        xs={24}
                        sm={24}
                        lg={24}
                        xl={24}
                    >
                        <Card className="negocio-info-row negocio-info">
                            {!!pos && (
                                <div
                                    style={{
                                        height: "40vh",
                                        width: "100%",
                                    }}
                                >
                                    <GoogleMapReact
                                        bootstrapURLKeys={{
                                            key: "AIzaSyAp2zsijKSTOl9BLx6CDcyNIN9KhINXTzM",
                                        }}
                                        defaultCenter={pos}
                                        center={pos}
                                        defaultZoom={16}
                                    >
                                        {!!pos && (
                                            <Marker
                                                lat={pos.lat}
                                                lng={pos.lng}
                                                text="MARKER"
                                            />
                                        )}
                                    </GoogleMapReact>
                                </div>
                            )}
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}
