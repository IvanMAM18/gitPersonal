import { Form, Button, Input, DatePicker, Modal, Select, Space } from "antd";
import locale from "antd/es/date-picker/locale/es_ES";
import moment from "moment";
import { useEffect, useState } from "react";
import {
    createCertificacionPdf_AI,
    createCertificacionPdf_BI,
} from "./funciones_resolutivos";
import useGetEntidadRevisoraDirectorRolId from "../../../utils/hooks/useGetEntidadRevisoraDirectorRolId";
import useCheckAndGetResolutivoPorNegocioAndER from "../../../utils/hooks/useCheckAndGetResolutivoPorNegocioAndER";
import useSaveAndSignResolutivo from "../../../utils/hooks/useSaveAndSignResolutivo";
import { ListaInspectores } from "../../../utils/ListaInspectores";
import {
    fillFormWithResolutivoDataMedidasSeguridad,
    fillFormWithNegocioDataMedidasSeguridad,
    jsonToFormData,
    certificacionMedidasSeguridadFormFields,
    getNombreFromPersona,
    checkGirosEnProgramaInterno,
    inspectorePI,
    inspectorePIEx
} from "../utils";
import { useParams } from "react-router-dom";

const { Option } = Select;

export default function CertificacionMedidasSeguridad({ negocio_data }) {
    const currentYearFilter = parseInt(localStorage?.currentYearFilter);
    const [listaInspectores, setListaInspectores] = useState([]);
    const [inspectorExPI, setInspectoreExPI] = useState([]);
    const { negocioId } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [resolutivoGuardadoYFirmado, saveAndSignResolutivo] =
        useSaveAndSignResolutivo();
    const [entidadRevisoraDirectorRolId, getEntidadRevisoraDirectorRolId] =
        useGetEntidadRevisoraDirectorRolId();
    const [resolutivoGuardado, checkAndGetResolutivoPorNegocioAndER] =
        useCheckAndGetResolutivoPorNegocioAndER();
    const [form] = Form.useForm();
    const loggedUserRolId = window?.user?.role_id ?? null;

    const getInspectoreExPI = () => {
        setInspectoreExPI(inspectorePIEx)
    }

    useEffect(() => {
        getEntidadRevisoraDirectorRolId();
        checkAndGetResolutivoPorNegocioAndER(
            parseInt(window?.user?.entidad_revision ?? 0),
            parseInt(negocioId), currentYearFilter,
            currentYearFilter
        );
        fillFormWithNegocioDataMedidasSeguridad(form, negocio_data);
        if (currentYearFilter === 2023) {
            setListaInspectores(ListaInspectores);
            setInspectoreExPI(inspectorePI);
        } else {
            setListaInspectores(ListaInspectores);
            getInspectoreExPI();
        }
    }, []);

    useEffect(() => {
        if (resolutivoGuardado) {
            console.log({ resolutivoGuardado });
            const resolutivoData = resolutivoGuardado?.detalles
                ? JSON.parse(resolutivoGuardado?.detalles)
                : null;
            if (
                resolutivoData?.nombre === null ||
                resolutivoData?.nombre === undefined
            ) {
                resolutivoData["nombre"] = getNombreFromPersona(negocio_data);
            }
            if (resolutivoData !== null) {
                fillFormWithResolutivoDataMedidasSeguridad(
                    form ?? null,
                    resolutivoData
                );
            }
        }
    }, [resolutivoGuardado]);

    useEffect(() => {
        if (resolutivoGuardadoYFirmado !== null) {
            const values = form.getFieldsValue(
                certificacionMedidasSeguridadFormFields
            );
            crearResolutivoPDF(resolutivoGuardadoYFirmado, {
                ...values,
                año_fiscal: values?.año_fiscal.format("YYYY") ?? "",
            });
        }
    }, [resolutivoGuardadoYFirmado]);

    const onFormComplete = (values) => {
        const valuesData = jsonToFormData({
            ...values,
            fecha: values?.fecha?.format("dddd, MMMM Do YYYY"),
            año_fiscal: values?.año_fiscal?.format("YYYY"),
            negocio_id: negocio_data?.id ?? 0,
            entidad_revisora_id: parseInt(window?.user?.entidad_revision ?? 0),
            firmar:
                parseInt(loggedUserRolId) === entidadRevisoraDirectorRolId
                    ? 1
                    : 0,
            tramite_id: negocio_data?.resolutivo_tramite_id,
            year_creacion_tramite: new Date(negocio_data?.fecha_creacion_tramite).getFullYear()
        });
        valuesData.append(
            "formDataAsString",
            JSON.stringify({
                ...values,
                año_fiscal: values.año_fiscal.format("YYYY"),
                year: currentYearFilter
            })
        );

        saveAndSignResolutivo(
            valuesData,
            "/app/save_resolutivo_proteccion_civil",
            parseInt(loggedUserRolId) === entidadRevisoraDirectorRolId,
            currentYearFilter
        );
    };
    const crearResolutivoPDF = (_resolutivo, formValues) => {
        const detalles = _resolutivo?.detalles
            ? JSON.parse(_resolutivo?.detalles)
            : null;
        if (detalles !== null) {
            switch (checkGirosEnProgramaInterno(negocio_data?.giro_comercial, negocio_data?.no_empleados_h + negocio_data?.no_empleados_m)) {
                case true:
                    createCertificacionPdf_AI({
                        ...formValues,
                        ...detalles,
                        año_fiscal: formValues?.año_fiscal,
                        fecha: formValues?.fecha ?? "",
                        folio: _resolutivo?.folio ?? "NA",
                        year_creacion_tramite: new Date(negocio_data?.fecha_creacion_tramite).getFullYear()
                    });
                    break;
                default:
                    createCertificacionPdf_BI({
                        ...formValues,
                        ...detalles,
                        año_fiscal: formValues?.año_fiscal,
                        fecha: formValues?.fecha ?? "",
                        folio: _resolutivo?.folio ?? "NA",
                        year_creacion_tramite: new Date(negocio_data?.fecha_creacion_tramite).getFullYear()
                    });
                    break;
            }
        }
    };
    const onFormCompleteFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };
    const generarPreview = () => {
        const values = form.getFieldsValue(
            certificacionMedidasSeguridadFormFields
        );
        console.log({ values });
        switch (checkGirosEnProgramaInterno(negocio_data?.giro_comercial, negocio_data?.no_empleados_h + negocio_data?.no_empleados_m)) {
            case true:
                createCertificacionPdf_AI(
                    {
                        ...values,
                        fecha: values?.fecha ?? "",
                        año_fiscal: values?.año_fiscal?.format("YYYY") ?? "",
                    },
                    true
                );
                break;
            default:
                createCertificacionPdf_BI(
                    {
                        ...values,
                        fecha: values?.fecha ?? "",
                        año_fiscal: values?.año_fiscal?.format("YYYY") ?? "",
                    },
                    true
                );
                break;
        }
        setShowModal(true);
    };
    return (
        <>
            <Form
                name="CERTIFICACIÓN DE MEDIDAS DE SEGURIDAD"
                onFinish={onFormComplete}
                onFinishFailed={onFormCompleteFailed}
                autoComplete="off"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                labelAlign="left"
                form={form}
                initialValues={{ fecha: moment(), año_fiscal: moment(negocio_data?.fecha_creacion_tramite) }}
            >
                <Form.Item
                    label="Fecha:"
                    name="fecha"
                    rules={[{ required: true, message: "Ingrese la fecha!" }]}
                >
                    <DatePicker
                        locale={locale}
                        disabledDate={(current) => {
                            if (current && current < moment().endOf("day")) {
                                return true;
                            } else {
                                if (
                                    current.day() !== 0 &&
                                    current.day() !== 1
                                ) {
                                    return false;
                                } else {
                                    return true;
                                }
                            }
                        }}
                        disabled
                    />
                </Form.Item>
                <Form.Item
                    label="Nombre del negocio:"
                    name="negocio"
                    rules={[
                        {
                            required: true,
                            message: "Ingrese el nombre del negocio!",
                        },
                    ]}
                >
                    <Input disabled={!!form.getFieldValue("negocio")} />
                </Form.Item>
                <Form.Item
                    label="Nombre de la persona:"
                    name="nombre"
                    rules={[
                        {
                            required: true,
                            message: "Campo requerido!",
                        },
                    ]}
                >
                    <Input
                        style={{ textTransform: "uppercase" }}
                        disabled={!!form.getFieldValue("nombre")}
                    />
                </Form.Item>
                <Form.Item
                    label="Giro comercial:"
                    name="giro"
                    rules={[
                        {
                            required: true,
                            message: "Ingrese el giro comercial del negocio!",
                        },
                    ]}
                >
                    <Input
                        style={{ textTransform: "uppercase" }}
                        disabled={!!form.getFieldValue("giro")}
                    />
                </Form.Item>
                <Form.Item
                    label="Dirección:"
                    name="direccion"
                    rules={[
                        {
                            required: true,
                            message: "Ingrese la dirección del negocio!",
                        },
                    ]}
                >
                    <Input
                        style={{ textTransform: "uppercase" }}
                        disabled={!!form.getFieldValue("direccion")}
                    />
                </Form.Item>
                <Form.Item
                    label="Año fiscal:"
                    name="año_fiscal"
                    rules={[{ required: true, message: "Ingrese la fecha!" }]}
                >
                    <DatePicker
                        picker="year"
                        locale={locale}
                        disabledDate={(current) =>
                            current.year() < moment().year()
                        }
                        disabled
                    />
                </Form.Item>
                <Form.Item
                    label="Inspector:"
                    name="inspector"
                    rules={[
                        {
                            required: true,
                            message: "Ingrese el nombre del inspector!",
                        },
                    ]}
                >
                    <Select
                        showSearch
                        placeholder="Inspectores"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.includes(input)
                        }
                        filterSort={(optionA, optionB) => {
                            return optionB.value - optionA.value;
                        }}
                    >
                        {listaInspectores?.map((item, optionIndex) => (
                            <Option key={"optionIndex" + optionIndex} value={item.id} >
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Inspector 2:"
                    name="inspector_2"
                    rules={[
                        {
                            required: false,
                        },
                    ]}
                >
                    <Select
                        showSearch
                        placeholder="Inspectores"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.includes(input)
                        }
                        filterSort={(optionA, optionB) => {
                            return optionB.value - optionA.value;
                        }}
                    >
                        {listaInspectores?.map((item, optionIndex) => (
                            <Option key={"optionIndex" + optionIndex} value={item.id} >
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Consultor externo:"
                    name="inspector_pi"
                    rules={[
                        {
                            required: checkGirosEnProgramaInterno(
                                negocio_data?.giro_comercial, negocio_data?.no_empleados_h + negocio_data?.no_empleados_m
                            ),
                            message:
                                "Seleccione el nombre del consultor externo!",
                        },
                    ]}
                >
                    <Select
                        disabled={
                            !checkGirosEnProgramaInterno(
                                negocio_data?.giro_comercial, negocio_data?.no_empleados_h + negocio_data?.no_empleados_m
                            )
                        }
                        showSearch
                        placeholder="Consultor externo"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.includes(input)
                        }
                        filterSort={(optionA, optionB) => {
                            return optionB.value - optionA.value;
                        }}
                    >
                        {inspectorExPI &&
                            inspectorExPI.map((item, optionIndex) => {
                                return (
                                    <Option
                                        key={"optionIndex" + optionIndex}
                                        value={item.id}
                                    >
                                        {item.name}
                                    </Option>
                                );
                            })}
                    </Select>
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        offset: 14,
                        span: 10,
                    }}
                >
                    <Space>
                        <Button
                            type="default"
                            htmlType="button"
                            onClick={() => generarPreview()}
                        >
                            Ver Preview
                        </Button>
                        <Button type="primary" htmlType="submit">
                            {`${parseInt(loggedUserRolId) ===
                                entidadRevisoraDirectorRolId
                                ? "Generar resolutivo"
                                : "Guardar resolutivo"
                                }`}
                        </Button>
                    </Space>
                </Form.Item>
                <Form.Item>
                    <Modal
                        width={"80%"}
                        title={`Vista previa del savedResolutivo para ${negocio_data?.nombre_del_negocio ?? ""
                            }`}
                        open={showModal}
                        footer={
                            <Button onClick={() => setShowModal(false)}>Cerrar</Button>
                        }
                        onCancel={() => setShowModal(false)}
                    >
                        <div id="pdf-preview-pc" style={{ height: "90%" }}></div>
                    </Modal>
                </Form.Item>
            </Form>

        </>
    );
}
