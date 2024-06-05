import { useEffect, useState } from "react";
import {
    Button,
    Checkbox,
    Col,
    DatePicker,
    Form,
    Input,
    Modal,
    Row,
    Space,
    Select,
} from "antd";
import locale from "antd/es/date-picker/locale/es_ES";
import moment from "moment";
import { createDictamenEcologiaPdf } from "./funciones_resolutivos";
//HOOKS
import useCheckAndGetResolutivoPorNegocioAndER from "../../../utils/hooks/useCheckAndGetResolutivoPorNegocioAndER";
import useGetEntidadRevisoraDirectorRolId from "../../../utils/hooks/useGetEntidadRevisoraDirectorRolId";
import useSaveAndSignResolutivo from "../../../utils/hooks/useSaveAndSignResolutivo";
//END HOOKS
import {
    fillFormWithNegocioDataEcologia,
    fillFormWithResolutivoDataEcologia,
    ecologiaFormFields,
    jsonToFormData,
} from "../utils";
import { useParams } from "react-router-dom";

export default function DictamenTecnicoEcologia({ negocio_data }) {
    const currentYearFilter = parseInt(localStorage?.currentYearFilter);
    const loggedUserRolId = parseInt(window?.user?.role_id ?? "-1");
    const { negocioId } = useParams();
    const entidadRevisoraId = parseInt(window?.user?.entidad_revision ?? "-1");
    //HOOKS
    const [resolutivoGuardado, checkAndGetResolutivoPorNegocioAndER] =
        useCheckAndGetResolutivoPorNegocioAndER();
    const [entidadRevisoraDirectorRolId, getEntidadRevisoraDirectorRolId] =
        useGetEntidadRevisoraDirectorRolId();
    const [resolutivoGuardadoYFirmado, saveAndSignResolutivo] =
        useSaveAndSignResolutivo();
    const [showModal, setShowModal] = useState(false);
    //END HOOKS
    const [form] = Form.useForm();

    useEffect(() => {
        if (resolutivoGuardado) {
            const resolutivoData = resolutivoGuardado?.detalles
                ? JSON.parse(resolutivoGuardado?.detalles)
                : null;
            if (resolutivoData !== null) {
                fillFormWithResolutivoDataEcologia(
                    form ?? null,
                    {
                        ...resolutivoData,
                        fecha_valido: moment(negocio_data?.fecha_creacion_tramite)
                    }
                );
            }
        }
    }, [resolutivoGuardado]);

    useEffect(() => {
        getEntidadRevisoraDirectorRolId();
        checkAndGetResolutivoPorNegocioAndER(
            parseInt(window?.user?.entidad_revision ?? 0),
            parseInt(negocioId), currentYearFilter,
            currentYearFilter
        );
        fillFormWithNegocioDataEcologia(form, negocio_data);
    }, []);

    useEffect(() => {
        if (resolutivoGuardadoYFirmado !== null) {
            const values = form.getFieldsValue(ecologiaFormFields);
            crearResolutivoPDF(resolutivoGuardadoYFirmado, {
                ...values,
                fecha_valido: moment(negocio_data?.fecha_creacion_tramite).format("YYYY") ?? "",
                folio: resolutivoGuardadoYFirmado?.folio ?? "",
            });
        }
    }, [resolutivoGuardadoYFirmado]);

    const crearResolutivoPDF = (_resolutivo, formValues) => {
        const detalles = _resolutivo?.detalles
            ? JSON.parse(_resolutivo?.detalles)
            : null;
        if (detalles !== null)
            createDictamenEcologiaPdf({
                ...formValues,
                ...detalles,
                fecha_ingreso_informacion: moment(
                    negocio_data?.tramites_comercio?.[0]?.created_at
                ),
                fecha_valido: moment(negocio_data?.fecha_creacion_tramite).format("YYYY") ?? "",
                folio: _resolutivo?.folio ?? "NA",
                superficie_mayor_250: negocio_data?.superficie_m2 > 250,
            });
    };
    const onFormComplete = (values) => {
        const valuesData = jsonToFormData({
            ...values,
            fecha_ingreso_informacion:
                values?.fecha_ingreso_informacion?.format("dddd, MMMM Do YYYY"),
            fecha_valido: moment(negocio_data?.fecha_creacion_tramite).format("YYYY") ?? "",
            negocio_id: parseInt(negocioId ?? "-1"),
            entidad_revisora_id: entidadRevisoraId,
            firmar: loggedUserRolId === entidadRevisoraDirectorRolId ? 1 : 0,
            tramite_id: negocio_data?.resolutivo_tramite_id,
        });

        valuesData.append(
            "formDataAsString",
            JSON.stringify({
                ...values,
                fecha_valido: moment(negocio_data?.fecha_creacion_tramite).format("YYYY") ?? "",
                year: currentYearFilter
            })
        );

        saveAndSignResolutivo(
            valuesData,
            "/app/save_resolutivo_proteccion_civil",
            loggedUserRolId === entidadRevisoraDirectorRolId,
            currentYearFilter
        );
    };
    const generarPreview = () => {
        const values = form.getFieldsValue(ecologiaFormFields);
        createDictamenEcologiaPdf(
            {
                ...values,
                fecha_ingreso_informacion:
                    values?.fecha_ingreso_informacion ?? "",
                fecha_valido: moment(negocio_data?.fecha_creacion_tramite).format("YYYY") ?? "",
                superficie_mayor_250: +negocio_data?.superficie_m2 > 250,
            },
            true
        );
        setShowModal(true);
    };
    return (
        <>
            <Form
                name="DICTAMEN TÉCNICO DE ECOLOGÍA"
                onFinish={onFormComplete}
                autoComplete="off"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                labelAlign="left"
                form={form}
            >
                <Form.Item
                    label="Persona:"
                    name="encabezado_1"
                    rules={[{ required: true, message: "Ingrese el dato!" }]}
                >
                    <Input
                        style={{ textTransform: "uppercase" }}
                        disabled={!!form.getFieldValue("encabezado_1")}
                    />
                </Form.Item>
                <Form.Item
                    label="Negocio:"
                    name="negocio"
                    rules={[{ required: true, message: "Ingrese el dato!" }]}
                >
                    <Input
                        style={{ textTransform: "uppercase" }}
                        disabled={!!form.getFieldValue("negocio")}
                    />
                </Form.Item>

                <Form.Item
                    label="Direccion:"
                    name="direccion"
                    rules={[{ required: true, message: "Ingrese el dato!" }]}
                >
                    <Input
                        style={{ textTransform: "uppercase" }}
                        disabled={!!form.getFieldValue("direccion")}
                    />
                </Form.Item>
                <Form.Item
                    label="Giro:" //80 caracteres 1er linea
                    name="giro"
                    rules={[{ required: true, message: "Ingrese el giro!" }]}
                >
                    <Input
                        disabled={!!form.getFieldValue("giro")}
                        style={{ textTransform: "uppercase" }}
                    />
                </Form.Item>
                <Form.Item
                    label="Generador de:"
                    name="generador_de"
                    rules={[
                        {
                            required: true,
                            message: "Seleccione los residuos que genera!",
                        },
                    ]}
                //valuePropName="checked"
                >
                    <Checkbox.Group style={{ width: "100%" }}>
                        <Row>
                            <Col span={8}>
                                <Checkbox value="Emisiones (humos)">
                                    Emisiones (humos)
                                </Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="Emisiones (olores)">
                                    Emisiones (olores)
                                </Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="Emisiones (solventes)">
                                    Emisiones (solventes)
                                </Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="Residuos Peligrosos (RP)">
                                    Residuos Peligrosos (RP)
                                </Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="Residuos Peligrosos Biológico Infecciosos (RPBI)">
                                    Residuos Peligrosos Biológico Infecciosos
                                    (RPBI)
                                </Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="Residuos Manejo Especial (aceites)">
                                    Residuos Manejo Especial (aceites)
                                </Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="Residuos Manejo Especial (trampas de grasas)">
                                    Residuos Manejo Especial (trampas de grasas)
                                </Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="Ruido">Ruido</Checkbox>
                            </Col>
                        </Row>
                    </Checkbox.Group>
                </Form.Item>
                <Form.Item
                    label={`No. de expediente`}
                    name="numero_expediente"
                    rules={[
                        {
                            required: true,
                            message: "Ingrese el número de expediente!",
                        },
                    ]}
                >
                    <Input style={{ textTransform: "uppercase" }} />
                </Form.Item>
                <Form.Item
                    label="Resolucion que otorga:"
                    name="otorga"
                    rules={[
                        {
                            required: true,
                            message: "Ingrese la resolutcion!",
                        },
                    ]}
                >
                    <Select>
                        <Select.Option value="A FAVOR">A FAVOR</Select.Option>
                        <Select.Option value="NO FAVORABLE">
                            NO FAVORABLE
                        </Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Observaciones:"
                    name="observaciones"
                    rules={[
                        {
                            required: true,
                            message:
                                "Ingrese las observaciones para el negocio!",
                        },
                    ]}
                >
                    <Input.TextArea style={{ textTransform: "uppercase" }} />
                </Form.Item>
                <Form.Item
                    label="Valido en el año fiscal:"
                    name="fecha_valido"
                    rules={[
                        {
                            required: true,
                            message:
                                "Ingrese la fecha hasta donde es valido el documento!",
                        },
                    ]}
                >
                    <DatePicker
                        locale={locale}
                        picker="year"
                        disabledDate={(current) =>
                            current.year() < moment().year()
                        }
                        disabled={!!form.getFieldValue("fecha_valido")}
                    />
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
                            {`${loggedUserRolId === entidadRevisoraDirectorRolId
                                ? "Generar resolutivo"
                                : "Guardar resolutivo"
                                }`}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
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
                <div id="pdf-preview-ec" style={{ height: "90%" }}></div>
            </Modal>
        </>
    );
}
