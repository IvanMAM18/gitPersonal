import React, { useState, useEffect } from "react";
import { Col, Input, Form, Radio, Row } from "antd";

const { Search } = Input;

function esFederalOEjidal(tipoPredio) {
    return tipoPredio === "ejidal" || tipoPredio === "federal";
}

export default function ComprobarPredial({
    setNegocioData,
    negocioData,
    tipo_predio_propiedad,
    claveCatastralPagado,
    setClaveCatastralPagado,
}) {
    const [predialCheckLoading, setPredialCheckLoading] = useState(false);
    const [tipoPredioPropiedad, setTipoPredioPropiedad] = useState(
        tipo_predio_propiedad
    );
    const [tipoPredial, setTipoPredial] = useState("U");
    const [claveCatastralHelpMessage, setClaveCatastralHelpMessage] =
        useState("");
    const [claveFolio, setClaveFolio] = useState(negocioData?.clave_catastral);
    const [comercioToken, setComercioToken] = useState(null);

    useEffect(() => {
        if (comercioToken === null || comercioToken === undefined) {
            axios
                .get("/app/get_comercio_token")
                .then((respuesta) => {
                    setComercioToken(respuesta?.data?.token);
                })
                .catch((error) => {
                    if (esFederalOEjidal(tipoPredioPropiedad)) {
                        setClaveCatastralHelpMessage("Error en la validación");
                        setClaveCatastralPagado("error");
                        setComercioToken(null);
                    }
                    setClaveCatastralHelpMessage("Enviado");
                    setClaveCatastralPagado("sucess");
                });
        }
    }, []);

    useEffect(() => {
        if (
            claveFolio === null ||
            claveFolio === undefined ||
            claveFolio.replace("-", "") === "" ||
            tipoPredial === null ||
            tipoPredial === undefined
        )
            return;

        if (comercioToken !== null && claveFolio.length > 1) {
            setPredialCheckLoading(true);
            axios
                .post("/app/validar_predial_pagado", {
                    comercio_token: comercioToken,
                    clave_folio: claveFolio.replace("-", ""),
                    tipo_predial: tipoPredial,
                })
                .then((respuesta) => {
                    if (esFederalOEjidal(tipoPredioPropiedad)) {
                        setClaveCatastralHelpMessage("No se requiere pago");
                        setClaveCatastralPagado("sucess");
                    } else if (respuesta.data.message === "NOT_FOUND") {
                        setClaveCatastralHelpMessage("Predial no encontrado");
                        setClaveCatastralPagado("error");
                    } else {
                        if (respuesta.data === false) {
                            setClaveCatastralHelpMessage("Predial pagado");
                            setClaveCatastralPagado("sucess");
                        } else {
                            setClaveCatastralHelpMessage(
                                <span>
                                    Lo invitamos a realizar su pago
                                    <a
                                        href={`https://servicios.lapaz.gob.mx/predial.php?folio=${claveFolio.replace(
                                            "-",
                                            ""
                                        )}&tipo=${tipoPredial}`}
                                        target="_blank"
                                    >
                                        click aquí
                                    </a>
                                </span>
                            );
                            setClaveCatastralPagado("error");
                        }
                    }
                    setPredialCheckLoading(false);
                })
                .catch((error) => {
                    setClaveCatastralHelpMessage("Error en la validación");
                    setClaveCatastralPagado("error");
                    setComercioToken();
                    setPredialCheckLoading(false);
                });
        } else {
            setClaveCatastralHelpMessage();
            setClaveCatastralPagado();
        }
    }, [tipoPredial, claveFolio]);
    return (
        <>
            <h5>Información del predio</h5>
            <Row
                gutter={[
                    { xs: 8, sm: 16 },
                    { xs: 8, sm: 16 },
                ]}
            >
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Form.Item label="Tipo de predio">
                        <Radio.Group
                            onChange={(e) => setTipoPredial(e.target.value)}
                            value={tipoPredial}
                        >
                            <Radio value={"U"}>Urbano</Radio>
                            <Radio value={"S"}>Suburbano</Radio>
                            <Radio value={"R"}>Rustico</Radio>
                            <Radio value={"E"}>Especial</Radio>
                        </Radio.Group>
                        {(tipoPredial === "S" || tipoPredial === "E") && (
                            <span
                                style={{
                                    position: "absolute",
                                    right: 0,
                                    bottom: -18,
                                    fontSize: 12,
                                }}
                            >
                                Tipo de predio especial y suburbano, solo se
                                consultan por folio
                            </span>
                        )}
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Form.Item
                        label="Clave catastral o folio"
                        validateStatus={claveCatastralPagado}
                        help={claveCatastralHelpMessage}
                    >
                        <Search
                            disabled={esFederalOEjidal(tipoPredioPropiedad)}
                            onSearch={(value) => setClaveFolio(value)}
                            placeholder="22424-242-0200"
                            loading={predialCheckLoading}
                            onChange={(e) => {
                                setClaveFolio(e?.target?.value ?? "");
                                setClaveCatastralPagado("");
                                setNegocioData({
                                    ...negocioData,
                                    clave_catastral: e?.target?.value,
                                });
                                if (e.target.value.length === 0) {
                                    setClaveCatastralHelpMessage();
                                    setClaveCatastralPagado();
                                }
                            }}
                            enterButton="Verifica para continuar"
                            value={claveFolio}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </>
    );
}
