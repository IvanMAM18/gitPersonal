import React, { useEffect, useState } from 'react'
import SelectGiros from './Componentes/SelectGiros/SelectGiros';
import Horario from './Componentes/Horario/Horario';
import {
    tipos_anuncio,
    datos_estadisticos_sector,
    getInitialValuesFromNegocio,
    getAnunciosValuesFromNegocio
} from './Utils';
import { Button, Checkbox, Form, Input, notification, Radio, Select, InputNumber, Space } from 'antd';
import { getImpactoFromGiros } from './Componentes/SelectGiros/Utils';

export default function RefrendoActulizarDatosNegocio({ negocio, giros, setIsModelOpen, setHideIcon }) {
    const [api, contextHolder] = notification.useNotification();
    const [refrendando, setRefrendando] = useState(false);
    const [errorEnHorario, setErrorEnHorario] = useState({
        error: false,
        reason: "",
        horario: ""
    });
    const [updatedInfo, setUpdatedInfo] = useState(null);
    const [form] = Form.useForm();
    const onAutoEmpleoCheck = (value) => {
        if (value === "autoempleo")
            form.setFieldsValue({
                no_empleados_h: 0,
                no_empleados_m: 0,
            });
    };
    useEffect(() => {
        axios.get(`/app/get_tarifa_recoleccion_basura_info_by_id/${negocio?.tarifa_recoleccion_id}`)
            .then(response => setUpdatedInfo({ ...updatedInfo, tarifaRecoleccionBasura: response?.data ?? null }))
            .catch(error => console.log(error))
    }, []);


    useEffect(() => {
        if (updatedInfo?.tarifaRecoleccionBasura ?? false) {
            setUpdatedInfo({
                girosIds: negocio?.giro_comercial.map(giro => giro?.id),
                ...updatedInfo,
                ...getInitialValuesFromNegocio(negocio, updatedInfo),
            });
        }
    }, [updatedInfo?.tarifaRecoleccionBasura]);

    const setGirosIds = (girosIds, impacto) => {
        const impactoAltoFromVentaAlcoholM2 = updatedInfo?.venta_alcohol && updatedInfo?.superficie_m2 > 150;
        setUpdatedInfo({
            ...updatedInfo,
            girosIds: girosIds,
            impacto_from_giros: impacto,
            impacto_giro_comercial: impactoAltoFromVentaAlcoholM2 ? "mediano_alto_impacto" : impacto,
            hasUpdates: true
        });
    }

    const setHorario = (horario) => {
        setUpdatedInfo({ ...updatedInfo, horario: horario, horarios: JSON.stringify(horario), hasUpdates: true });
    }

    const setServicioRecoleccionPrivado = (value) => {
        setUpdatedInfo({ ...updatedInfo, servicio_priv_recoleccion: value, tarifa_recoleccion_id: null, hasUpdates: true });
    }

    const setNivelRecoleccionBasura = (nivelRecoleccionBasura) => {
        setUpdatedInfo({ ...updatedInfo, nivel_recoleccion_basura: nivelRecoleccionBasura, hasUpdates: true });
    }

    const setTarifaRecoleccionId = (tarifaRecoleccionId) => {
        setUpdatedInfo({ ...updatedInfo, tarifa_recoleccion_id: tarifaRecoleccionId?.id, hasUpdates: true });
    }

    const tieneAnunciosPublicitariosChange = (value) => {
        if (!value) {
            form.setFieldsValue({
                tipo_anuncio: "NO TENGO",
                leyenda_anuncio: null,
                lugar_instalacion: null,
                largo_anuncio: null,
                ancho_anuncio: null,
            });
        } else {
            form.setFieldsValue(getAnunciosValuesFromNegocio(negocio));
        }
    };

    const openNotification = (type, message, description) => {
        api[type]({
            message: message,
            description: description,
            duration: 5,
        });
    };

    const refrendarNegocio = async () => {
        setRefrendando(true);
        if (updatedInfo?.girosIds?.length === 0) {
            openNotification("warning", "Giros", "No se han seleccionado giros.");
            setRefrendando(false);
            return;
        }
        await axios.post("/app/crear_refrendo_individual", { negocio_id: negocio?.id, ...updatedInfo })
            .then(response => {
                openNotification("success", "Creación de Refrendo", "Se ha creado el refrendo del negocio.");
                setIsModelOpen(false);
                setHideIcon(true);
            })
            .catch(error => {
                console.log({ error });
                openNotification("error", "Creación de Refrendo", "Ha habido un error al refrendar.");
            })
            .finally(() => {
                setRefrendando(false);
            });
    }

    useEffect(() => {
        const numEmpleados = updatedInfo?.no_empleados_h + updatedInfo?.no_empleados_m
        switch (true) {
            case (numEmpleados === 0):
                form.setFieldsValue({ tamano_empresa: "autoempleo", });
                break;
            case (numEmpleados >= 1 && numEmpleados <= 10):
                form.setFieldsValue({ tamano_empresa: "micro", });
                break;
            case (numEmpleados >= 11 && numEmpleados <= 30):
                form.setFieldsValue({ tamano_empresa: "pequeña", });

                break;
            case (numEmpleados >= 31 && numEmpleados <= 100):
                form.setFieldsValue({ tamano_empresa: "mediana", });
                break;
            default:
                form.setFieldsValue({ tamano_empresa: "grande", });
                break;
        }
    }, [updatedInfo?.no_empleados_h, updatedInfo?.no_empleados_m]);

    return (
        updatedInfo?.girosIds ? <>
            {contextHolder}

            <div style={{ marginBottom: 15 }}>
                <SelectGiros
                    impacto={updatedInfo?.impacto_from_giros  ?? updatedInfo?.impacto_giro_comercial}
                    setGirosIds={setGirosIds}
                    defaultValuesRecoleccionBasura={{
                        girosIds: updatedInfo?.girosIds,
                        servicio_priv_recoleccion: updatedInfo?.servicio_priv_recoleccion,
                        tarifaRecoleccionBasura: updatedInfo?.tarifaRecoleccionBasura,
                        nivel_recoleccion_basura: updatedInfo?.nivel_recoleccion_basura,
                    }}
                    setServicioRecoleccionPrivado={setServicioRecoleccionPrivado}
                    setTarifaRecoleccionId={setTarifaRecoleccionId}
                    setNivelRecoleccionBasura={setNivelRecoleccionBasura}
                    giros={giros}
                />

                <Horario
                    setHorario={setHorario}
                    horarios={updatedInfo?.horarios ?? null}
                    setErrorEnHorario={setErrorEnHorario}
                    errorEnHorario={errorEnHorario}
                />
            </div >
            <Form
                key={"RefrendoActulizarInfo"}
                layout={"vertical"}
                form={form}
                name="RefrendoActulizarInfo"
                onFinish={(values) => refrendarNegocio()}
                onFinishFailed={(values) => { console.log({ ERROR: values }); }}
                style={{ paddingTop: 15, paddingBottom: 15 }}
                onValuesChange={(changedValues, allValues) => {
                    let impacto = null;
                    Object.keys(changedValues).forEach(changedValueKey => {
                        if (changedValueKey === "superficie_m2") {
                            impacto = changedValues[changedValueKey] > 150 ? "mediano_alto_impacto" : null
                        }

                        if (changedValueKey === "venta_alcohol") {
                            impacto = changedValues[changedValueKey] === true ? "mediano_alto_impacto" : null
                        }
                    });
                    setUpdatedInfo({
                        ...updatedInfo,
                        ...allValues,
                        ...changedValues,
                        hasUpdates: true,
                        impacto_giro_comercial: impacto ?? getImpactoFromGiros(giros?.filter(giro => updatedInfo?.girosIds?.includes(giro?.id)))
                    })
                }}
                initialValues={updatedInfo}
            >
                <hr></hr>
                <Form.Item
                    name="venta_alcohol"
                    valuePropName="checked"
                >
                    <Checkbox>
                        Venta de alcohol
                    </Checkbox>
                </Form.Item>
                <Form.Item label="Tamaño de empresa" name={"tamano_empresa"}>
                    <Radio.Group onChange={(e) => { onAutoEmpleoCheck(e?.target?.value) }}>
                        <Radio value="autoempleo">AUTOEMPLEO (sin empleados)</Radio>
                        <Radio value="micro">MICRO ( 1-10 empleados)</Radio>
                        <Radio value="pequeña">PEQUEÑA (11-30 empleados)</Radio>
                        <Radio value="mediana">MEDIANA (31-100 empleados)</Radio>
                        <Radio value="grande">GRANDE (101 empleados en adelante)</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    label="Nombre del negocio"
                    name="nombre_del_negocio"
                >
                    <Input />
                </Form.Item>
                <Form.Item label={<span>m<sup>2</sup> de construcción</span>} name={"superficie_m2"}>
                    <InputNumber width={200} min={0} />
                </Form.Item>

                <div style={{ marginTop: 15 }}></div>
                <h5>ANUNCIO PUBLICITARIO</h5>
                <Form.Item
                    name="tiene_anuncios_publicitarios"
                    valuePropName="checked"
                    onChange={(e) => {
                        tieneAnunciosPublicitariosChange(e.targe.value)
                    }}

                >
                    <Checkbox

                    >
                        ¿Cuenta con anuncios publicitarios?
                    </Checkbox>
                </Form.Item>
                <Form.Item label="Tipo de anuncio" name="tipo_anuncio">
                    <Select
                        placeholder="Elija Un tipo de anuncio publicitario"
                        disabled={!updatedInfo?.tiene_anuncios_publicitarios}
                        options={tipos_anuncio.map((tipo_anuncio) => (
                            { label: tipo_anuncio.tipo, value: tipo_anuncio.value }
                        ))}
                    />
                </Form.Item>
                <Form.Item
                    label="Leyenda del anuncio"
                    name="leyenda_anuncio"
                >
                    <Input.TextArea
                        maxLength={250}
                        disabled={!updatedInfo?.tiene_anuncios_publicitarios}
                    />
                </Form.Item>
                <Form.Item
                    label="Lugar de instalación"
                    name="lugar_instalacion"
                >
                    <Input
                        maxLength={250}
                        disabled={!updatedInfo?.tiene_anuncios_publicitarios}
                    />
                </Form.Item>
                <Form.Item label="Largo en mts" name="largo_anuncio">
                    <InputNumber
                        max={100}
                        min={0.1}
                        disabled={!updatedInfo?.tiene_anuncios_publicitarios}
                    />
                </Form.Item>
                <Form.Item label="Ancho en mts" name="ancho_anuncio">
                    <InputNumber
                        max={100}
                        min={0.1}
                        disabled={!updatedInfo?.tiene_anuncios_publicitarios}
                    />
                </Form.Item>

                <h5>DATOS ESTADÍSTICOS</h5>
                <Form.Item label="Sector" name="sector">
                    <Select placeholder="Elija Un tipo de anuncio publicitario"
                        options={datos_estadisticos_sector?.map((sector) => ({
                            value: sector.value,
                            label: sector.tipo
                        }))}
                    />
                </Form.Item>
                <Form.Item
                    label="Total de inversión requerida"
                    name="inversion"
                >
                    <InputNumber width={200} />
                </Form.Item>

                <Form.Item
                    label="No. de empleados hombres"
                    name="no_empleados_h"
                >
                    <InputNumber min={0} disabled={updatedInfo?.autoempleo} />
                </Form.Item>
                <Form.Item
                    label="No. de empleados mujeres"
                    name="no_empleados_m"
                >
                    <InputNumber min={0} disabled={updatedInfo?.autoempleo} />
                </Form.Item>
                <Form.Item
                    name="empleados_cap_diferentes"
                    valuePropName="checked"
                >
                    <Checkbox>
                        ¿Emplea persona con capacidades diferentes?
                    </Checkbox>
                </Form.Item>

                <p>
                    <strong>Nota:</strong> La información proporcionada será
                    utilizada exclusivamente para efectos estadísticos
                </p>
                <Space direction={"horizontal"} align={"end"} style={{ width: "100%", justifyContent: "flex-end" }}>
                    <Button type="primary" htmlType="submit" disabled={refrendando} loading={refrendando}>
                        Refrendar negocio
                    </Button>
                </Space>
            </Form>
        </>
            : <div>Cargando info...</div>
    )
}
