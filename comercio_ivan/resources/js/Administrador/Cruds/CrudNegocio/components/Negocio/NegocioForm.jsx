import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, InputNumber, Row, Space } from "antd";
import AnunciosPublicitarios from "./AnunciosPublicitarios";
import ComprobarPredial from "./ComprobarPredial";
import Horario from "../Horario/Horario";
import { validarDatosRequeridos } from "./utils";
import Notificacion from "../../../../../components/Notificacion";

export default function NegocioForm({ negocio }) {
    const canEdit = negocio?.validado_por === 0;
    const [notificationData, setNotificacionData] = useState({
        title: "Datos actualizados",
        description: "",
        open: false,
    });
    const [errorEnHorario, setErrorEnHorario] = useState({
        error: false,
        reason: "",
    });
    const [claveCatastralPagado, setClaveCatastralPagado] = useState("sucess");
    const [negocioData, setNegocioData] = useState({
        id: negocio?.id,
        nombre_del_negocio: negocio?.nombre_del_negocio,
        superficie_m2: negocio?.superficie_m2,
        cajones_estacionamiento: negocio?.cajones_estacionamiento,
        tipo_anuncio: negocio?.tipo_anuncio ?? false,
        leyenda_anuncio: negocio?.leyenda_anuncio ?? null,
        lugar_instalacion: negocio?.lugar_instalacion ?? null,
        largo_anuncio: negocio?.largo_anuncio ?? null,
        ancho_anuncio: negocio?.ancho_anuncio ?? null,
        clave_catastral: negocio?.clave_catastral ?? null,
        horarios: negocio?.horarios ?? null,
    });

    const tieneLicenciaFuncionamiento = !!negocio?.resolutivos?.find(resolutivo => resolutivo.entidad_revisora_id === 2);
    const avisoEnteroPagado = !!negocio?.tramites_comercio?.find(tc => tc?.tramite?.catalogo_tramite?.entidad_revisora_id === 2 && tc?.tramite?.aviso_entero?.pagado === true)

    const actualizarNegocio = () => {
        if (validarDatosRequeridos(negocioData, setNotificacionData) === true) {
            axios
                .post(`/app/update_negocio_by_user`, negocioData)
                .then((response) => {
                    setNotificacionData({
                        title: "Negocio actualizado",
                        description: "Actualización de negocio exitosa. ",
                        open: true,
                        type: "success",
                        setNotificationData: setNotificacionData,
                    });
                })
                .catch((error) => {
                    setNotificacionData({
                        title: "Negocio actualizado",
                        description:
                            "Ha habido un erro al actualizar la información del negocio.",
                        open: true,
                        type: "error",
                        setNotificationData: setNotificacionData,
                    });
                    console.log(error);
                });
        }
    };

    return (
        <>
            <Notificacion {...notificationData} />


            <Row
                gutter={[
                    { xs: 8, sm: 16 },
                    { xs: 8, sm: 16 },
                ]}
            >
                {canEdit && (<Col xs={24} sm={24} md={8} lg={10} xl={14}>
                    <Form.Item label="Nombre comercial">
                        <Input
                            value={negocioData?.nombre_del_negocio}
                            onChange={(e) => {
                                setNegocioData({
                                    ...negocioData,
                                    nombre_del_negocio: e.target.value,
                                });
                            }}
                        ></Input>
                    </Form.Item>
                </Col>)}
                {tieneLicenciaFuncionamiento === false && avisoEnteroPagado === false && <Col xs={24} sm={24} md={8} lg={8} xl={5}>
                    <Form.Item label={<span>Superficie en m<sup>2</sup></span>}>
                        <InputNumber
                            style={{ width: "100%" }}
                            value={negocioData?.superficie_m2}
                            onChange={(value) => {
                                setNegocioData({
                                    ...negocioData,
                                    superficie_m2:
                                        value >= 0 ? value : 0,
                                });
                            }}
                        ></InputNumber>
                    </Form.Item>
                </Col>}
                {canEdit && (<Col xs={24} sm={24} md={8} lg={6} xl={5}>
                    <Form.Item label="Cajones de estacionamiento">
                        <InputNumber
                            style={{ width: "100%" }}
                            value={negocioData?.cajones_estacionamiento}
                            onChange={(value) => {
                                setNegocioData({
                                    ...negocioData,
                                    cajones_estacionamiento:
                                        value >= 0 ? value : 0,
                                });
                            }}
                        ></InputNumber>
                    </Form.Item>
                </Col>)}
            </Row>
            {canEdit && (<AnunciosPublicitarios
                setNegocioData={setNegocioData}
                negocioData={negocioData}
                dbNegocioData={negocio}
            />)}



            <Horario
                setHorario={setNegocioData}
                negocioData={negocioData}
                horarios={negocioData?.horarios ?? null}
                setErrorEnHorario={setErrorEnHorario}
                errorEnHorario={errorEnHorario}
            ></Horario>
            <Row
                gutter={[
                    { xs: 8, sm: 16 },
                    { xs: 8, sm: 16 },
                ]}
            >
                <Col xs={24} sm={24}>
                    <Space
                        direction={"horizontal"}
                        align={"end"}
                        style={{
                            justifyContent: "flex-end",
                            display: "flex",
                        }}
                    >
                        <Button
                            onClick={() => {
                                actualizarNegocio();
                            }}
                            disabled={errorEnHorario.error}
                        >
                            Actualizar Negocio
                        </Button>
                    </Space>
                </Col>
            </Row>
        </>
    );
}
