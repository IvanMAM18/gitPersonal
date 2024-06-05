import React, { useState } from "react";
import { Checkbox, Col, Form, Input, InputNumber, Select, Row } from "antd";

const { Option } = Select;

const tipos_anuncio = [
    {
        tipo: "NO TENGO",
        value: "NO TENGO",
    },
    {
        tipo: "PINTADO Y MURAL",
        value: "PINTADO Y MURAL",
    },
    {
        tipo: "ESTRUCTURAL",
        value: "ESTRUCTURAL",
    },
    {
        tipo: "LUMINOSO",
        value: "LUMINOSO",
    },
    {
        tipo: "OTROS",
        value: "OTROS",
    },
];
export default function AnunciosPublicitarios({
    setNegocioData,
    negocioData,
    dbNegocioData,
}) {
    const [tieneAnunciosCheckbox, setTieneAnunciosCheckbox] = useState(
        negocioData?.tipo_anuncio === "NO TENGO" ? false : true
    );
    const cuentaConAnunciosChange = (e) => {
        setTieneAnunciosCheckbox(e.target.checked);
        if (e.target.checked === false) {
            setNegocioData({
                ...negocioData,
                tipo_anuncio: "NO TENGO",
                leyenda_anuncio: null,
                lugar_instalacion: null,
                largo_anuncio: null,
                ancho_anuncio: null,
            });
        } else {
            setNegocioData({
                ...negocioData,
                tipo_anuncio: dbNegocioData?.tipo_anuncio,
                leyenda_anuncio: dbNegocioData?.leyenda_anuncio,
                lugar_instalacion: dbNegocioData?.lugar_instalacion,
                largo_anuncio: dbNegocioData?.largo_anuncio,
                ancho_anuncio: dbNegocioData?.ancho_anuncio,
            });
        }
    };
    return (
        <>
            <h5 className="anuncio-publicitario-header">
                <span>ANUNCIO PUBLICITARIO</span>

                <Checkbox
                    onChange={(e) => {
                        cuentaConAnunciosChange(e);
                    }}
                    checked={tieneAnunciosCheckbox}
                >
                    ¿Cuenta con anuncios publicitarios?
                </Checkbox>
            </h5>
            <Row
                style={{ justifyContent: "space-between" }}
                gutter={[
                    { xs: 8, sm: 16 },
                    { xs: 8, sm: 16 },
                ]}
            >
                <Col xs={24} sm={24} md={8}>
                    <Form.Item label="Tipo de anuncio">
                        <Select
                            style={{ width: "100%" }}
                            placeholder="Elija Un tipo de anuncio publicitario"
                            disabled={!tieneAnunciosCheckbox}
                            onChange={(value) => {
                                if (value === "NO TENGO") {
                                    setTieneAnunciosCheckbox(false);
                                }
                                setNegocioData({
                                    ...negocioData,
                                    tipo_anuncio: value,
                                });
                            }}
                            value={negocioData?.tipo_anuncio}
                        >
                            {tipos_anuncio.map((tipo_anuncio) => (
                                <Option
                                    value={tipo_anuncio.value}
                                    key={tipo_anuncio.value}
                                >
                                    {tipo_anuncio.tipo}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={8}>
                    <Form.Item label="Lugar de instalación">
                        <Input
                            style={{ width: "100%" }}
                            maxLength={250}
                            disabled={!tieneAnunciosCheckbox}
                            onChange={(e) => {
                                setNegocioData({
                                    ...negocioData,
                                    lugar_instalacion: e.target.value,
                                });
                            }}
                            value={negocioData?.lugar_instalacion}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={4}>
                    <Form.Item label="Largo en mts">
                        <InputNumber
                            style={{ width: "100%" }}
                            max={100}
                            min={0.1}
                            disabled={!tieneAnunciosCheckbox}
                            onChange={(value) => {
                                setNegocioData({
                                    ...negocioData,
                                    largo_anuncio: value >= 0 ? value : 0,
                                });
                            }}
                            value={negocioData?.largo_anuncio}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={4}>
                    <Form.Item label="Ancho en mts">
                        <InputNumber
                            style={{ width: "100%" }}
                            max={100}
                            min={0.1}
                            disabled={!tieneAnunciosCheckbox}
                            onChange={(value) => {
                                setNegocioData({
                                    ...negocioData,
                                    ancho_anuncio: value >= 0 ? value : 0,
                                });
                            }}
                            value={negocioData?.ancho_anuncio}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24}>
                    <Form.Item label="Leyenda del anuncio">
                        <Input.TextArea
                            style={{ width: "100%" }}
                            maxLength={250}
                            disabled={!tieneAnunciosCheckbox}
                            onChange={(e) => {
                                setNegocioData({
                                    ...negocioData,
                                    leyenda_anuncio: e.target.value,
                                });
                            }}
                            value={negocioData?.leyenda_anuncio}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </>
    );
}
