import React, { useEffect, useState } from "react";
import { Checkbox, Input, Tabs } from "antd";
import impactos from "../../utils/impactoGiroComercial";
import { Button, message, Form, Select, Divider, Popconfirm } from "antd";
import NegocioInfo from "./EditarNegocioComercioAdminComponents/NegocioInfo";
import BotonGuardar from "./EditarNegocioComercioAdminComponents/BotonGuardar";
import { useParams } from "react-router-dom";
import FormItemContainer from "./EditarNegocioComercioAdminComponents/FormItemContainer";
import { tiposEmpresa, email_regex, girosAlcoholes, sectoresConPeso } from "./EditarNegocioComercioAdminComponents/Constants";

function EditarNegocioComercioAdmin() {

    const girosAlcoholesIds = girosAlcoholes.map(giro => (giro?.id ?? null));
    const [girosAlcoholesPermitidos, setGirosAlcoholesPermitidos] = useState(null)
    const [form] = Form.useForm();
    const { negocioId } = useParams();
    const [savingData, setSavingData] = useState(false);
    const [negocio, setNegocio] = useState(null);

    const [negocioDataToSave, setNegocioDataToSave] = useState({});

    useEffect(() => {
        fetchNegocio();
    }, []);

    function filterCommonIds(girosAlcoholesIds, negocioGirosIds) {
        return girosAlcoholesIds.filter(id => negocioGirosIds.includes(id));
    }

    const fetchNegocio = async () => {
        axios
            .get(`/app/negocio-entidad-revisora/${negocioId}/${5}/2024`)
            .then((result) => {
                const data = result.data;
                setNegocio(data);
                const girosNegocioIds = data?.giro_comercial?.map(giro => giro?.id ?? null);
                const sectoresGiros = data?.giro_comercial?.map(giro => giro?.tipo_sector ?? null);
                let maxSector = '';
                let maxValue = 0;

                sectoresGiros.forEach(sector => {
                    if (sectoresConPeso[sector] > maxValue) {
                        maxValue = sectoresConPeso[sector];
                        maxSector = sector;
                    }
                });

                // Filtering girosAlcoholes based on maxSector
                const filteredGirosAlcoholes = girosAlcoholes.filter(item => {
                    return sectoresConPeso[item.tipo_sector] <= sectoresConPeso[maxSector];
                });

                const tramitesConPagos =
                    (data?.tramites ?? []).filter(tramite => (tramite?.catalogo?.pago ?? false) === true);
                const tienePagos = tramitesConPagos.filter(tramite => tramite?.avisos_entero?.length > 0)?.length > 0;


                if (tienePagos === true) {
                    setGirosAlcoholesPermitidos(filteredGirosAlcoholes);
                } else {
                    setGirosAlcoholesPermitidos(girosAlcoholes)
                }

                setNegocioDataToSave({
                    id: data?.id ?? null,
                    tamano_empresa: data?.tamano_empresa ?? 0,
                    venta_alcohol: data?.venta_alcohol ?? false,
                    nombre_del_negocio: data?.nombre_del_negocio ?? null,
                    personaId: data?.persona?.id ?? null,
                    persona_correo: data?.persona?.email ?? null,
                    giros_venta_alcoholes: filterCommonIds(girosAlcoholesIds, girosNegocioIds),
                    tiene_pagos: tienePagos,
                    sectore_giros: sectoresGiros,
                    solo_vende_alcohol: filterCommonIds(girosAlcoholesIds, girosNegocioIds)?.length === data?.giro_comercial.length
                });
                console.log(filterCommonIds(girosAlcoholesIds, girosNegocioIds)?.length === data?.giro_comercial.length)
            });
    };


    const cancel = () => message.error('Sin Cambios Generados');

    const _next = () => form.submit();

    const finish = (data) => {
        setSavingData(true);

        axios.post(`/app/guardar-negocio/${negocioDataToSave.id}`, {
            ...negocioDataToSave
        })
            .then((result) => {
                setSavingData(false);
                message.success("Guardado Correctamente");
            })
            .catch((error) => {
                console.log({ error })
                console.log("catch((error", error.response.data);
                message.error("Error al guardar " + error.response.data.message);
                setSavingData(false);
            });
    };

    const finishFailed = (error) => {
        if (error.errorFields && error.errorFields.length) {
            message.error("Formulario incompleto, verifique los campos vacíos");
        }
    };


    const formFieldsChanged = (changedFields, allFields) => {
        const dataChanged = {};
        //console.log({ changedFields }, { negocio }, { allFields })

        changedFields.forEach(changedField => {
            dataChanged[changedField.name[0]] = changedField.value;

            if (changedField?.name[0] === "venta_alcohol" && changedField?.value === false) {
                dataChanged["giros_venta_alcoholes"] = [];
            }
        });
        form.setFieldsValue({ ...negocioDataToSave, ...dataChanged });
        setNegocioDataToSave({ ...negocioDataToSave, ...dataChanged });
    }

    const formProps = {
        name: "basic",
        form: form,
        onFinish: finish,
        onFinishFailed: finishFailed,
        labelAlign: "left",
        layout: "vertical",
        autoComplete: "off",
        validateMessages: { required: "Requerido", },
        onFieldsChange: formFieldsChanged
    }
    return (
        !!negocio && !!negocioDataToSave && (
            <div className="sare--container site-statistic-demo-card">
                <h1>Información del negocio - {negocio.nombre_del_negocio}</h1>
                <p>Trámite: {negocio.catalogo_tramite && negocio.catalogo_tramite.nombre} </p>
                <p>Impacto: {impactos.tag(negocio.impacto_giro_comercial)}</p>
                <Divider />
                <NegocioInfo negocio={negocio} />
                <Tabs>
                    <Tabs.TabPane tab="Modificación a Negocio" key="item-1">
                        {savingData && <h5>Procesando solicitud...</h5>}
                        <Form
                            {...formProps}
                            initialValues={negocioDataToSave}>
                            <FormItemContainer>
                                <Form.Item label="Nombre del negocio" name={"nombre_del_negocio"}
                                    rules={[{
                                        required: true,
                                        pattern: /.+/,
                                        message: "El nombre no puede quedar vacio"
                                    }]}>
                                    <Input />
                                </Form.Item>
                            </FormItemContainer>
                            <FormItemContainer>
                                <Form.Item label="Correo electrónico" name={"persona_correo"}
                                    rules={[{
                                        type: 'email',
                                        pattern: email_regex,
                                        required: true,
                                        message: "El correo no cumple con el formato correcto",
                                    }]}>
                                    <Input />
                                </Form.Item>
                            </FormItemContainer>
                            <FormItemContainer>
                                <Form.Item
                                    label="Venta alcohol"
                                    name={"venta_alcohol"}
                                    valuePropName="checked"
                                    help={negocioDataToSave?.giros_venta_alcoholes?.length > 0 || negocioDataToSave?.venta_alcohol === false
                                        ? ""
                                        : "Seleccione alemenos un giro de la lista de abajo"}>
                                    <Checkbox disabled={negocioDataToSave.solo_vende_alcohol} />

                                </Form.Item>

                                {negocioDataToSave.solo_vende_alcohol === true && <Form.Item>
                                    <strong>
                                        No es posible realizar el cambio de baja de alcohol, favor de realizar trámite nuevo por captura errónea de giros
                                    </strong>
                                </Form.Item>}

                                <Form.Item
                                    label="Giros Venta alcohol"
                                    name={"giros_venta_alcoholes"}

                                >
                                    <Select mode="multiple"
                                        allowClear
                                        placeholder="Seleccione un giro"
                                        disabled={negocioDataToSave?.venta_alcohol === false || negocioDataToSave.solo_vende_alcohol}
                                    >
                                        {girosAlcoholesPermitidos.map(giro => (<Option key={giro?.id} value={giro?.id}>{giro?.nombre ?? ""}</Option>))}
                                    </Select>
                                </Form.Item>
                            </FormItemContainer>

                            <FormItemContainer>
                                <Form.Item label="Tamaño de la empresa" name={"tamano_empresa"}>
                                    <Select placeholder="Elija un nuevo tamaño de Empresa">
                                        {tiposEmpresa.map((tamano_empresa) => (
                                            <Option
                                                value={tamano_empresa.value}
                                                key={tamano_empresa.value}
                                            >
                                                {tamano_empresa.tipo}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </FormItemContainer>

                        </Form>
                        {negocioDataToSave?.venta_alcohol === false
                            || (negocioDataToSave?.venta_alcohol === true && negocioDataToSave?.giros_venta_alcoholes?.length > 0)
                            ? <BotonGuardar confirm={_next} cancel={cancel} savingData={savingData} />
                            :
                            "No puede guardar los datos sin seleccionar un giro compatible con la venta de alcohol"}
                    </Tabs.TabPane>
                </Tabs>
            </div>)
    );
}

export default EditarNegocioComercioAdmin;
