import React, { useEffect, useState } from "react";
import {
    Form,
    Input,
    Upload,
    Divider,
    Radio,
    Button,
    Select,
    InputNumber,
    Steps,
    message,
    Checkbox,
    DatePicker,
    Alert,
    Row,
    Col,
} from "antd";
import { UploadOutlined, PushpinOutlined } from "@ant-design/icons";
import axios from "axios";
import usePersonasMorales from "../../utils/hooks/usePersonasMorales";
import triggerErrorMessageForFields from "../../utils/triggerErrorMessageForFields";
import GoogleMapReact from "google-map-react";
import RecoleccionBasura from "./RecoleccionBasura";
import NumericInput from "../../components/NumericInput";
import locale from "antd/es/date-picker/locale/es_ES";
import Horario from "./Horario";
import useGetCodigosPostalesLaPaz from "../../utils/hooks/useGetCodigosPostalesLaPaz";
import useGetCodigosPostales from "../../utils/hooks/useGetCodigosPostales";
import useGetColoniasByCodigoPostal from "../../utils/hooks/useGetColoniasByCodigoPostal";
import catalogoRegimenFiscal from "../../utils/regimenFiscalList";
import useGetGirosComerciales from "../../utils/hooks/useGetGirosComerciales";
import { regimenes_capital } from "../../utils/ListaRegimenesCapital";
import { delegacionDefault, getListaDelegacionSelectOptions } from "../../utils/ListaDelegaciones";

function esFederalOEjidal(tipoPredio) {
    return tipoPredio === "ejidal" || tipoPredio === "federal";
}

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

const datos_estadisticos_sector = [
    {
        tipo: "INDUSTRIAL",
        value: "INDUSTRIAL",
    },
    {
        tipo: "COMERCIAL",
        value: "COMERCIAL",
    },
    {
        tipo: "SERVICIOS",
        value: "SERVICIOS",
    },
];
const divStyles = {
    marginTop: 20,
    marginBottom: 20,
    display: "flex",
    justifyContent: "space-between",
    position: "relative",
};

const Marker = () => (
    <PushpinOutlined
        style={{
            transform: "translate(-7%, -100%)",
            fontSize: 30,
            color: "red",
        }}
    />
);

const { Option } = Select;
const { Search } = Input;

const rules = {
    requiredOnly: [{ required: true }],
    unrequired: [{ required: false }],
};

const uploadHeaders = {
    _token: document.head.querySelector('meta[name="csrf-token"]').content,
};

const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e.fileList;
};

function NegocioModal() {
    const [selectedGirosComerciales, setSelectedGirosComerciales] = useState(
        []
    );
    const [fotoFrontalNegocioRuta, setFotoFrontalNegocioRuta] = useState("");
    const [comprobanteDomicilioNegocio, setComprobanteDomicilioNegocio] =
        useState("");
    const [codigosPostalesLaPaz, getCodigosPostalesLaPaz] =
        useGetCodigosPostalesLaPaz();
    const [codigosPostales, getCodigosPostales] = useGetCodigosPostales();
    const [colonias, getColoniasByCodigoPostal] =
        useGetColoniasByCodigoPostal();
    const [coloniasMA, getColoniasByCodigoPostalMA] =
        useGetColoniasByCodigoPostal();
    const [coloniasPF, getColoniasByCodigoPostalPF] =
        useGetColoniasByCodigoPostal();
    const [disable_anuncio_item, setHasAnuncioPublicitario] = useState(true);
    const [girosComerciales, getGirosComerciales] = useGetGirosComerciales();
    const [claveCatastralHelpMessage, setClaveCatastralHelpMessage] =
        useState("");
    const [claveCatastralPagado, setClaveCatastralPagado] = useState();
    const [claveFolio, setClaveFolio] = useState();
    // const [comercioToken, setComercioToken] = useState(null);
    const [current, setCurrent] = useState(0);
    const [tipoPredial, setTipoPredial] = useState("U");

    const [tipoPredioPropiedad, setTipoPredioPropiedad] = useState(null);
    const [documentoPredioPropiedad, setDocumentoPredioPropiedad] =
        useState(null);

    const [predialCheckLoading, setPredialCheckLoading] = useState(false);
    const [tipoPersona, setTipoPersona] = useState("sin_facturar");
    const [personaMoral, setPersonaMoral] = useState("");
    const [
        utilizarDireccionDeEstablecimiento,
        setUtilizarDireccionDeEstablecimiento,
    ] = useState(false);
    const [savingData, setSavingData] = useState(false);
    const [form] = Form.useForm();
    const [personasMorales] = usePersonasMorales();
    const [pos, setPos] = useState(null);
    const [recoleccionBasura, setRecoleccionBasura] = useState(null);
    const [horario, setHorario] = useState();
    const [personaFisicaNuevaDireccion, setPersonaFisicaNuevaDireccion] =
        useState(false);
    const [tipoDireccionNotificacion, setTipoDireccionNotificacion] =
        useState("direccion_negocio");
    const [tipoDireccionFacturacion, setTipoDireccionFacturacion] =
        useState("negocio");
    const [esRefrendo, setEsRefrendo] = useState(false);
    const [autoempleo, setAutoempleo] = useState(false);
    const [nivelRecoleccionBasura, setNivelRecoleccionBasura] = useState("");
    const [servicioDeRecoleccionPrivado, setServicioDeRecoleccionPrivado] =
        useState("selecciona una opción");
    const [tamanoEmpresa, setTamanoEmpresa] = useState("grande");
    const [camaras, setCamaras] = useState([]);

    useEffect(() => {
        if (
            localStorage.tramite_padre_nombre ===
            "Refrendo Licencia de funcionamiento"
        ) {
            setEsRefrendo(true);
        }
    });

    function formatNumber(phone_value) {
        if (phone_value.length > 3) {
            if (phone_value.length > 6) {
                const prefix = phone_value.substring(0, 3);
                const phone_i = phone_value.substring(3, 6);
                const phone_ii = phone_value.substring(6);
                return `(${prefix}) ${phone_i}-${phone_ii}`;
            } else {
                const prefix = phone_value.substring(0, 3);
                const phone = phone_value.substring(3);
                return `(${prefix}) ${phone}`;
            }
        } else {
            return `${phone_value}`;
        }
    }

    useEffect(() => {
        setTipoDireccionFacturacion(
            utilizarDireccionDeEstablecimiento === false
                ? "negocio"
                : "persona_moral"
        );
    }, [utilizarDireccionDeEstablecimiento]);

    useEffect(() => {
        setTipoDireccionFacturacion(
            personaFisicaNuevaDireccion == false ? "negocio" : "persona_fisica"
        );
    }, [personaFisicaNuevaDireccion]);

    const _next = () => {
        if (current === 0) {
            if (recoleccionBasura === null || recoleccionBasura === undefined) {
                message.error("Datos para recoleccion de basura vacios");
                return;
            }
            const fields1 = form.getFieldsValue(["name", "giro_id"]);

            if (triggerErrorMessageForFields(fields1)) {
                return;
            }
            if (horario === null || horario === undefined) {
                message.error("No seleccionado un horario");
                return;
            }

            if (
                nivelRecoleccionBasura === "servicio_privado" &&
                servicioDeRecoleccionPrivado === "selecciona una opción"
            ) {
                message.error(
                    "No seleccionado un servicio de recolección privado"
                );
                return;
            }
        }
        if (current === 0) {
            const fields2 = form.getFieldsValue([
                "calle_principal",
                // "calles",
                // "numero_externo",
                "colonia_id",
                "codigo_postal",
                //"pf_regimen_fiscal",
                "descripcion_actividad",
                "superficie_m2",

                "foto_frontal_negocio",
                "cajones_estacionamiento",
                "fecha_inicio_operaciones",
                "telefono",
            ]);
            if (esFederalOEjidal(tipoPredioPropiedad)) {
                delete fields2.clave_catastral;
            }
            if (tamanoEmpresa === 'autoempleo') {
                form.setFieldValue("no_empleados_m", 0);
                form.setFieldValue("no_empleados_h", 0);
                form.setFieldValue("autoempleo", true);
            }
            else {

                // if(form.getFieldValue("no_empleados_h")===undefined || form.getFieldValue("no_empleados_h")===null || form.getFieldValue("no_empleados_m")===undefined ||
                // form.getFieldValue("no_empleados_m")===null)
                // {
                //     message.error(
                //         "Debe existir al menos un empleado, si en algún caso no cuenta ingrese 0"
                //     );
                //     return;
                // }

                // if (( form.getFieldValue("no_empleados_h")+form.getFieldValue("no_empleados_m"))<1) {
                //     message.error(
                //         "Debe existir al menos un empleado"
                //     );
                //     return;
                // }
                // form.setFieldValue("autoempleo",false);
            }
            if (triggerErrorMessageForFields(fields2)) {
                return;
            }
            if (!pos) {
                message.error(
                    "Debes seleccionar la ubicación de tu negocio en el mapa"
                );
                return;
            }
        }
        if (current === 1) {
            if (
                form.getFieldValue("tipo_persona") === "moral" &&
                !personaMoral
            ) {
                return message.error("Debes seleccionar una persona moral");
            }
            if (personaMoral === "nueva_persona") {
                const fields3_1 = form.getFieldsValue([
                    "ma_rfc",
                    "razon_social",
                    "regimen_capital",
                    "acta_constitutiva",
                ]);
                if (triggerErrorMessageForFields(fields3_1)) {
                    return;
                }
                if (utilizarDireccionDeEstablecimiento) {
                    const fields3_2 = form.getFieldsValue([
                        "ma_calle_principal",
                        // "ma_calles",
                        // "ma_numero_externo",
                        // "ma_numero_interno",
                        "ma_colonia_id",
                        "ma_codigo_postal",
                    ]);
                    if (triggerErrorMessageForFields(fields3_2)) {
                        return;
                    }
                }
                if (personaFisicaNuevaDireccion) {
                    const fieldsDireccionFacturacionPersonaFisica =
                        form.getFieldsValue([
                            "pf_calle_principal",
                            // "pf_calles",
                            // "pf_numero_externo",
                            // "pf_numero_interno",
                            "pf_colonia_id",
                            "pf_codigo_postal",
                        ]);
                    if (
                        triggerErrorMessageForFields(
                            fieldsDireccionFacturacionPersonaFisica
                        )
                    ) {
                        return;
                    }
                }
            }
        }
        if (current > 1) {
            return form.submit();
        }
        setCurrent(current + 1);
    };

    const _prev = () => {
        setCurrent(current - 1);
    };

    const getCamaras = async () => {
        const { data } = await axios.get("/app/camaras_all");
        setCamaras(
            data.map((cam) => ({
                value: cam.id,
                label: cam.nombre,
            }))
        );
    };

    const finish = (data) => {
        if (!localStorage.tramite_padre_id) {
            alert("ERROR: tramite indefinido");
            return;
        }

        if (!tipoPredioPropiedad || !documentoPredioPropiedad) {
            message.error(
                "Debes seleccionar los datos de pertenencia de predio y subir el documento el documento que acredite su propiedad"
            );
            return;
        }

        data.persona_moral_id = personaMoral;
        data.tarifa_recoleccion_id = recoleccionBasura?.id ?? null;
        data.tipo_direccion_facturacion = tipoDireccionFacturacion;

        (data.acta_constitutiva = data.acta_constitutiva
            ? data.acta_constitutiva[0].response
            : null),
            (data.horarios = horario);
        setSavingData(true);
        axios
            .post("/app/negocio", {
                ...data,
                superficie_m2: parseInt(data.superficie_m2),
                pos,
                tamano_empresa: tamanoEmpresa,
                servicio_priv_recoleccion:
                    nivelRecoleccionBasura === "servicio_privado"
                        ? servicioDeRecoleccionPrivado
                        : null,
                foto_frontal_fachada: fotoFrontalNegocioRuta,
                comprobante_domicilio_negocio: comprobanteDomicilioNegocio,
                tipo_predio: tipoPredial,
                nivel_recoleccion_basura: nivelRecoleccionBasura,
                catalogo_tramite_padre_id: localStorage.tramite_padre_id,
                catalogo_tramite_hijo_id: 1,
                documento_predio_propiedad: documentoPredioPropiedad,
                tipo_predio_propiedad: tipoPredioPropiedad,
                orden: 1,
                utilizarDireccionDeEstablecimiento,
                tipo_direccion_notificacion: tipoDireccionNotificacion,
                camara_id:
                    data.camara_comercio === 0 ? null : data.camara_comercio,
            })
            .then((result) => {
                location.href = `/app/mis-negocios/${result?.data?.id}`;
            })
            .catch((error) => {
                console.log("catch((error", error);
                message.error("Error al guardar negocio");
                setSavingData(false);
            });
    };

    const onChangeCapitalLettersRFC = (e) => {
        form.setFieldsValue({
            ma_rfc: e.toUpperCase(),
        });
    };
    const finishFailed = (error) => {
        if (error.errorFields && error.errorFields.length) {
            message.error("Formulario incompleto");
        }
        const errorFields = error.errorFields.map((field) => field.name[0]);

        // TODO: Validar para enviar el stepper al erro exacto

        if (errorFields.includes("name")) {
            setCurrent(0);
            return;
        }

        if (
            errorFields.includes("name") ||
            errorFields.includes("numero_licencia_funcionamiento_previa") ||
            errorFields.includes("calle_principal") ||
            errorFields.includes("colonia_id") ||
            errorFields.includes("codigo_postal") ||
            (!esFederalOEjidal(tipoPredioPropiedad) &&
                errorFields.includes("clave_catastral")) ||
            errorFields.includes("foto_frontal_negocio") ||
            errorFields.includes("descripcion_actividad") ||
            errorFields.includes("superficie_m2") ||
            errorFields.includes("cajones_estacionamiento")
        ) {
            setCurrent(1);
            return;
        }

        if (
            errorFields.includes("ma_calle_principal") ||
            errorFields.includes("ma_colonia_id") ||
            errorFields.includes("ma_codigo_postal") ||
            errorFields.includes("ma_clave_catastral") ||
            errorFields.includes("ma_rfc") ||
            errorFields.includes("razon_social") ||
            errorFields.includes("acta_constitutiva")
        ) {
            setCurrent(1);
            return;
        }
    };
    //
    useEffect(() => {
        getCamaras();
        getGirosComerciales();
        getCodigosPostalesLaPaz();
        getCodigosPostales();
        // if (comercioToken === null || comercioToken === undefined) {
        //     axios
        //         .get("/app/get_comercio_token")
        //         .then((respuesta) => {
        //             setComercioToken(respuesta?.data?.token);
        //         })
        //         .catch((error) => {
        //             if (esFederalOEjidal(tipoPredioPropiedad)) {
        //                 setClaveCatastralHelpMessage("Error en la validación");
        //                 setClaveCatastralPagado("error");
        //                 setComercioToken(null);
        //             }
        //             setClaveCatastralHelpMessage("Enviado");
        //             setClaveCatastralPagado("sucess");
        //         });
        // }
    }, []);

    useEffect(() => {
        console.log({ tipoPredioPropiedad }, { claveFolio }, { tipoPredial });
        if (esFederalOEjidal(tipoPredioPropiedad) === false) {
            setClaveCatastralPagado("");
        }
        if (
            claveFolio === null ||
            claveFolio === undefined ||
            claveFolio.replace("-", "") === "" ||
            claveFolio === "" ||
            tipoPredial === null ||
            tipoPredial === undefined ||
            esFederalOEjidal(tipoPredioPropiedad) === true
        ) {
            return;
        }

        if (claveFolio.length > 1) {
            setPredialCheckLoading(true);
            axios
                .post("/app/validar_predial_pagado", {
                    // comercio_token: comercioToken,
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
                                        href={`https://predial-web.lapaz.gob.mx/?folio=${claveFolio.replace(
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
                    // setComercioToken();
                    setPredialCheckLoading(false);
                });
        } else {
            setClaveCatastralHelpMessage();
            setClaveCatastralPagado();
        }
    }, [tipoPredial, claveFolio, tipoPredioPropiedad]);

    const onRecoleccionBasuraChange = (value) => {
        setNivelRecoleccionBasura(value);
    };

    // const onAutoEmpleoCheck= (value) => {


    //     setAutoempleo(value.target.checked);
    // };
    const onServicioDeRecoleccionChange = (value) => {
        setServicioDeRecoleccionPrivado(value);
    };

    const resetDireccion = () => {
        setUtilizarDireccionDeEstablecimiento(false);
        form.setFieldsValue({
            ma_calle_principal: null,
            ma_calles: null,
            ma_numero_externo: null,
            ma_numero_interno: null,
            ma_codigo_postal: null,
            ma_codigo_postal: null,
            ma_colonia_id: null,
            ma_tipo: null,
        });
        setPersonaFisicaNuevaDireccion(false);
        form.setFieldsValue({
            pf_calle_principal: null,
            pf_calles: null,
            pf_numero_externo: null,
            pf_numero_interno: null,
            pf_codigo_postal: null,
            pf_codigo_postal: null,
            pf_colonia_id: null,
            pf_tipo: null,
        });
        form.setFieldsValue({
            dn_calle_principal: null,
            dn_calles: null,
            dn_numero_externo: null,
            dn_numero_interno: null,
            dn_codigo_postal: null,
            dn_codigo_postal: null,
            dn_colonia_id: null,
            dn_tipo: null,
        });
    };

    return (
        <div>
            <Steps current={current}>
                <Steps.Step title="Información del establecimiento" />
                <Steps.Step title="Datos del propietario" />
                <Steps.Step title="Finalizar" />
            </Steps>

            <hr></hr>
            <Form
                name="basic"
                form={form}
                labelAlign="left"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={finish}
                onFinishFailed={finishFailed}
                autoComplete="off"
                validateMessages={{
                    required: "Requerido",
                }}
                initialValues={{
                    tipo_persona: "sin_facturar",
                    delegacion: delegacionDefault, dn_delegacion: delegacionDefault
                }}
            >
                <div style={{ padding: 15 }}>
                    El registro debe de ser por persona física, si eres persona
                    moral, el representante legal debe de registrarse para dar
                    de alta la empresa moral
                </div>
                {/* S T E P  1 NEGOCIO */}
                <div
                    style={{
                        display: current === -1 ? "block" : "none",
                        paddingTop: 30,
                    }}
                ></div>

                {/* S T E P  2 DIRECCION */}
                <div
                    style={{
                        display: current === 0 ? "block" : "none",
                        paddingTop: 30,
                    }}
                >
                    <Form.Item
                        label="Nombre comercial del establecimiento"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Nombre comercial del establecimiento es requerido!",
                            },
                        ]}
                    >
                        <Input placeholder="Restaurante La Paz" />
                    </Form.Item>
                    {!!esRefrendo && (
                        <Form.Item
                            label="Nº lic. de funcionamiento del periodo anterior"
                            name="numero_licencia_funcionamiento_previa"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "El número de licencia de funcionamiento  del año anterior es requerido",
                                },
                            ]}
                        >
                            <InputNumber
                                style={{ width: "100%" }}
                                placeholder="Nº lic. de funcionamiento  del año anterior"
                            />
                        </Form.Item>
                    )}
                    <Form.Item
                        label="Teléfono del establecimiento"
                        name="telefono"
                        rules={rules.requiredOnly}
                    >
                        <Input
                            placeholder="(612) 123-4567"
                            onChange={(e) => {
                                let phone_value = e.target.value;
                                phone_value = phone_value.replace("-", "");
                                phone_value = phone_value.replace(/\s/g, "");
                                phone_value = phone_value.replace("(", "");
                                phone_value = phone_value.replace(")", "");
                                form.setFieldsValue({
                                    telefono: formatNumber(
                                        phone_value.substring(0, 10)
                                    ),
                                });
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Giros comerciales"
                        name="giro_id"
                        rules={rules.requiredOnly}
                    >
                        <Select
                            mode="multiple"
                            showSearch
                            placeholder="Giros Comerciales"
                            optionFilterProp="children"
                            filterOption={(input, option) => {
                                return option.children
                                    .toUpperCase()
                                    .includes(input.toUpperCase());
                            }}
                            filterSort={(optionA, optionB) => {
                                return optionB.value - optionA.value;
                            }}
                            onChange={(value, option) => {
                                const selectedGirosComerciales_ =
                                    girosComerciales.filter((giroComercial) =>
                                        value.includes(
                                            giroComercial.id.toString()
                                        )
                                    );
                                setSelectedGirosComerciales(
                                    selectedGirosComerciales_
                                );
                            }}
                        >
                            {girosComerciales &&
                                girosComerciales.map((item, optionIndex) => {
                                    return (
                                        <Option
                                            key={"optionIndex" + optionIndex}
                                            value={item.id.toString()}
                                        >
                                            {item.nombre}
                                        </Option>
                                    );
                                })}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Descripcion de actividad"
                        name="descripcion_actividad"
                        rules={rules.requiredOnly}
                    >
                        <Input.TextArea
                            placeholder="Mi establecimiento se dedica a..."
                            rows={3}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Fecha de inicio de operaciones"
                        name="fecha_inicio_operaciones"
                        help="Fecha de inicio  de operaciones del establecimiento"
                        rules={rules.requiredOnly}
                    >
                        <DatePicker locale={locale} />
                    </Form.Item>
                    <div style={{ marginBottom: 50 }}></div>
                    <Form.Item
                        label="Camara de comercio"
                        name="camara_comercio"
                    >
                        <Select
                            defaultValue={0}
                            style={{ width: "100%" }}
                            options={[
                                { value: 0, label: "Ninguna" },
                                ...camaras,
                            ]}
                        />
                    </Form.Item>
                    <div style={{ marginBottom: 50 }}></div>
                    <Form.Item
                        label="¿Se vende alcohol en su establecimiento?"
                        name="venta_alcohol"
                        rules={rules.requiredOnly}
                    >
                        <Radio.Group>
                            <div>
                                <Radio value={true}>Sí</Radio>
                            </div>
                            <div>
                                <Radio value={false}>No</Radio>
                            </div>
                        </Radio.Group>
                    </Form.Item>
                    <div style={{ marginBottom: 50 }}></div>
                    {/* FOTO FRONTAL DEL NEGOCIO */}
                    <Form.Item
                        name="comprobante_domicilio_negocio"
                        label="Comprobante del domicilio del establecimiento (SAPA)"
                        valuePropName="comprobante_domicilio_negocio"
                        getValueFromEvent={normFile}
                        extra="Admite archivos JPG, PNG, y PDF"
                        rules={rules.requiredOnly}
                    >
                        <Upload
                            multiple={false}
                            onChange={(info) => {
                                const { status } = info.file;
                                if (status === "done") {
                                    setComprobanteDomicilioNegocio(
                                        info.file.response
                                    );
                                    message.success(
                                        `Comprobante subida correctamente`
                                    );
                                } else if (status === "error") {
                                }
                            }}
                            name="comprobante_domicilio_negocio"
                            action="/app/uploads/comprobante-domicilio-negocio"
                            listType="picture"
                            accept="image/png, image/jpeg, image/jpg, application/pdf"
                            maxCount={1}
                            data={uploadHeaders}
                        >
                            <Button icon={<UploadOutlined />}>
                                Da click para cargar
                            </Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        name="foto_frontal_negocio"
                        label="Foto frontal del establecimiento"
                        valuePropName="foto_frontal_negocio"
                        getValueFromEvent={normFile}
                        extra="Admite archivos JPG y PNG"
                        rules={rules.requiredOnly}
                    >
                        <Upload
                            multiple={false}
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={(info) => {
                                const { status } = info.file;
                                if (status === "done") {
                                    setFotoFrontalNegocioRuta(
                                        info.file.response
                                    );
                                    message.success(
                                        `Foto subida correctamente`
                                    );
                                    //location.reload()
                                } else if (status === "error") {
                                }
                            }}
                            name="foto_frontal_negocio"
                            action="/app/uploads/foto-frontal-negocio"
                            data={uploadHeaders}
                        >
                            <Button icon={<UploadOutlined />}>
                                Da click para cargar
                            </Button>
                        </Upload>
                    </Form.Item>
                    <div style={{ marginBottom: 50 }}></div>
                    <Row>
                        <Col span={8}>
                            <h5>Horario (use AM o PM)</h5>
                        </Col>
                        <Col span={16}>
                            <Horario setScheduleForm={setHorario} />
                        </Col>
                    </Row>
                    <h5>Dirección</h5>
                    <Form.Item
                        label="Calle principal"
                        name="calle_principal"
                        rules={rules.requiredOnly}
                    >
                        <Input placeholder="15 de Febrero" />
                    </Form.Item>
                    <Form.Item
                        label="Calles"
                        name="calles"
                        rules={rules.unrequired}
                    >
                        <Input placeholder="Entre Granito y Alga" />
                    </Form.Item>
                    <Form.Item
                        label="Número externo"
                        name="numero_externo"
                        rules={rules.unrequired}
                    >
                        <InputNumber placeholder="2333" />
                    </Form.Item>
                    <Form.Item
                        label="Número interno"
                        name="numero_interno"
                        rules={rules.unrequired}
                    >
                        <Input placeholder="4A" />
                    </Form.Item>
                    <Form.Item
                        label="Código postal"
                        name="codigo_postal"
                        rules={rules.requiredOnly}
                    >
                        <Select
                            showSearch
                            placeholder="Códigos Postales"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.value.includes(input.toString())
                            }
                            filterSort={(optionA, optionB) => {
                                return optionB.value - optionA.value;
                            }}
                            onChange={(value) => {
                                getColoniasByCodigoPostal(value.toString());
                            }}
                        >
                            {codigosPostalesLaPaz &&
                                codigosPostalesLaPaz.map(
                                    (item, optionIndex) => {
                                        return (
                                            <Option
                                                key={
                                                    "optionIndex" + optionIndex
                                                }
                                                value={item.id}
                                            >
                                                {item.nombre}
                                            </Option>
                                        );
                                    }
                                )}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Colonia"
                        name="colonia_id"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Seleccione la colonia donde se encuentra el establecimiento!",
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            placeholder="Colonias"
                            optionFilterProp="children"
                            filterOption={(input, option) => {
                                return (
                                    option?.children
                                        ?.toUpperCase()
                                        ?.includes(input.toUpperCase()) ?? false
                                );
                            }}
                            filterSort={(optionA, optionB) => {
                                return optionB.value - optionA.value;
                            }}
                        >
                            {colonias &&
                                colonias.map((item, optionIndex) => {
                                    return (
                                        <Option
                                            key={"optionIndex" + optionIndex}
                                            value={item.id}
                                        >
                                            {item.nombre_localidad}
                                        </Option>
                                    );
                                })}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Delegación"
                        name="delegacion"
                        rules={rules.requiredOnly}
                    >
                        <Select options={getListaDelegacionSelectOptions()} />
                    </Form.Item>
                    <Form.Item
                        rules={rules.requiredOnly}
                        label="¿A quien pertenece el predio?"
                        name="tipo_predio_propiedad"
                    >
                        <Radio.Group
                            onChange={(e) => {
                                if (esFederalOEjidal(e.target.value)) {
                                    setClaveCatastralPagado("sucess");
                                }
                                setTipoPredioPropiedad(e.target.value);
                            }}
                            value={tipoPredioPropiedad}
                        >
                            <Radio value="mi_propiedad">De mi propiedad</Radio>
                            <Radio value="rentado">Rentado</Radio>
                            <Radio value="prestado">Prestado</Radio>
                            <Radio value="federal">Zona federal</Radio>
                            <Radio value="ejidal">Ejidal</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        rules={rules.requiredOnly}
                        label={
                            {
                                mi_propiedad:
                                    "Subir escrituras o titulo de propiedad",
                                rentado: "Subir contrato de arrendamiento",
                                prestado: "Subir carta comodato",
                                federal: "Subir acta de zona federal",
                                ejidal: "Mapa cartográfico o croquis de coordenadas UTM",
                            }[tipoPredioPropiedad] ||
                            "Seleccione una opción arriba"
                        }
                        name="documento_predio_propiedad"
                    >
                        <Upload
                            disabled={!tipoPredioPropiedad}
                            onChange={(info) => {
                                const { status } = info.file;
                                if (status === "done") {
                                    message.success(
                                        `Acta subida correctamente`
                                    );
                                    setDocumentoPredioPropiedad(
                                        info.file.response
                                    );
                                } else if (status === "error") {
                                    if (
                                        info.file.response.includes(
                                            "bytes exceeds the limit"
                                        )
                                    ) {
                                        message.error(
                                            "El archivo es demasiado grande, el límite de subida es de 50 MB"
                                        );
                                    } else {
                                        message.error(
                                            "Ocurrió un error al subir el archivo"
                                        );
                                    }
                                }
                            }}
                            name="documento_tipo_predio"
                            action="/app/uploads/predio-propiedad"
                            data={uploadHeaders}
                        >
                            <Button icon={<UploadOutlined />}>
                                {{
                                    mi_propiedad:
                                        "escrituras o titulo de propiedad",
                                    rentado: "contrato de arrendamiento",
                                    prestado: "carta comodato",
                                    federal: "Subir acta de zona federal",
                                    ejidal: "Mapa cartográfico o croquis de coordenadas UTM",
                                }[tipoPredioPropiedad] || "Cargar documento"}
                            </Button>
                        </Upload>
                    </Form.Item>
                    <h5>Información del predio</h5>
                    <div style={divStyles}>
                        <span style={{ marginRight: 10 }}>Tipo de predio:</span>
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
                    </div>
                    <Form.Item
                        label="Clave catastral o folio"
                        name="clave_catastral"
                        validateStatus={claveCatastralPagado}
                        help={claveCatastralHelpMessage}>
                        <Search
                            disabled={esFederalOEjidal(tipoPredioPropiedad)}
                            onSearch={(value) => setClaveFolio(value)}
                            placeholder="22424-242-0200"
                            loading={predialCheckLoading}
                            onChange={(e) => {
                                if (e.target.value.length === 0) {
                                    setClaveFolio(e?.target?.value ?? "");
                                    setClaveCatastralHelpMessage();
                                    setClaveCatastralPagado();
                                }
                            }}
                            enterButton="Verifica para continuar"
                        />
                    </Form.Item>
                    <h5 style={{ marginTop: 10 }}>Carga de desechos</h5>
                    <div style={{ ...divStyles, width: "100%" }}>
                        <div className="ant-col ant-col-24 ant-form-item-control">
                            <RecoleccionBasura
                                onServicioDeRecoleccionChange={onServicioDeRecoleccionChange}
                                onChange={onRecoleccionBasuraChange}
                                setRecoleccionBasura={setRecoleccionBasura}
                                girosComerciales={selectedGirosComerciales}
                            />
                        </div>
                    </div>
                    <p>
                        Seleccione la ubicación exacta del establecimiento
                        haciendo click en el mapa:
                    </p>
                    <div
                        style={{
                            height: "35vw",
                            width: "100%",
                            marginBottom: "15px",
                        }}
                    >
                        <GoogleMapReact
                            onClick={({ lat, lng }) => {
                                setPos({ lat, lng });
                            }}
                            bootstrapURLKeys={{
                                key: "AIzaSyAp2zsijKSTOl9BLx6CDcyNIN9KhINXTzM",
                            }}
                            defaultCenter={{
                                lat: 24.1481589,
                                lng: -110.3181937,
                            }}
                            defaultZoom={13}
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
                    <Form.Item
                        label="Superficie construida del establecimiento (m^2)"
                        name="superficie_m2"
                        rules={[
                            {
                                type: "number",
                                min: 1,
                                message: "El número mínimo de m2 es 1",
                            },
                        ]}
                    >
                        <InputNumber
                            placeholder="Ejem: 40"
                            emptyMessage="Ingrese los m2 de superficie"
                            formattooltip={false}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Cajones de estacionamiento"
                        name="cajones_estacionamiento"
                        rules={rules.requiredOnly}
                    >
                        <NumericInput
                            placeholder="10"
                            min={0}
                            emptyMessage="Ingrese el número de cajones de estacionamiento"
                            formattooltip={false}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Tipo"
                        name="tipo"
                        rules={rules.requiredOnly}
                    >
                        <Select>
                            <Option value="BODEGA_INDUSTRIA">
                                Bodega / Industria
                            </Option>
                            <Option value="OFICINA">Oficina</Option>
                            <Option value="COMERCIO">Comercio</Option>
                            <Option value="SERVICIO">Servicio</Option>
                        </Select>
                    </Form.Item>{" "}
                    <h5>ANUNCIO PUBLICITARIO</h5>
                    <Form.Item
                        name="tiene_anuncios_publicitarios"
                        valuePropName="checked"
                    >
                        <Checkbox
                            onChange={(e) => {
                                setHasAnuncioPublicitario(!e.target.checked);
                                if (!e.target.checked) {
                                    form.setFieldsValue({
                                        tipo_anuncio: "NO TENGO",
                                        leyenda_anuncio: null,
                                        lugar_instalacion: null,
                                        largo_anuncio: null,
                                        ancho_anuncio: null,
                                    });
                                } else {
                                    form.setFieldsValue({
                                        tipo_anuncio: null,
                                        leyenda_anuncio: null,
                                        lugar_instalacion: null,
                                        largo_anuncio: null,
                                        ancho_anuncio: null,
                                    });
                                }
                            }}
                        >
                            ¿Cuenta con anuncios publicitarios?
                        </Checkbox>
                    </Form.Item>
                    <Form.Item label="Tipo de anuncio" name="tipo_anuncio">
                        <Select
                            placeholder="Elija Un tipo de anuncio publicitario"
                            disabled={disable_anuncio_item}
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
                    <Form.Item
                        label="Leyenda del anuncio"
                        name="leyenda_anuncio"
                    >
                        <Input.TextArea
                            maxLength={250}
                            disabled={disable_anuncio_item}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Lugar de instalación"
                        name="lugar_instalacion"
                    >
                        <Input
                            maxLength={250}
                            disabled={disable_anuncio_item}
                        />
                    </Form.Item>
                    <Form.Item label="Largo en mts" name="largo_anuncio">
                        <InputNumber
                            max={100}
                            min={0.1}
                            disabled={disable_anuncio_item}
                        />
                    </Form.Item>
                    <Form.Item label="Ancho en mts" name="ancho_anuncio">
                        <InputNumber
                            max={100}
                            min={0.1}
                            disabled={disable_anuncio_item}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Tamaño de empresa"
                        name="cantidad_empleados"
                    >
                        <label >Favor de proporcionar la información correctamente, de acuerdo a la siguiente estratificación</label>
                        <Radio.Group defaultValue="grande" value={tamanoEmpresa} onChange={e => {
                            setTamanoEmpresa(e.target.value)
                        }}>
                            <Radio value="autoempleo">AUTOEMPLEO (sin empleados)</Radio>
                            <Radio value="micro">MICRO ( 1-10 empleados)</Radio>
                            <Radio value="pequeña">PEQUEÑA (11-30 empleados)</Radio>
                            <Radio value="mediana">MEDIANA (31-100 empleados)</Radio>
                            <Radio value="grande">GRANDE (101 empleados en adelante)</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <label style={{ textAlign: 'justify' }}><b>La falta oportuna de las declaraciones, así como la falsedad de datos contenidos en las mismas, la resistencia a
                        las visitas de inspección conducentes a la correcta determinación de la base gravable, y, en general, el incumplimiento de las obligaciones fiscales será sancionadas, independientemente de
                        la responsabilidad de tipo penal en qué se incurre, con multa de 150 veces el valor de la Unidad de Medida y Actualización.
                        Ley de Hacienda para el Municipio de La Paz, B.C.S. Artículo 124.</b></label>
                    <h5>DATOS ESTADÍSTICOS</h5>
                    <Form.Item label="Sector" name="sector">
                        <Select placeholder="Elija Un tipo de anuncio publicitario">
                            {datos_estadisticos_sector.map((sector) => (
                                <Option value={sector.value} key={sector.value}>
                                    {sector.tipo}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Total de inversión requerida"
                        name="inversion"
                    >
                        <InputNumber width={200} />
                    </Form.Item>
                    {/* <Form.Item
                        name="autoempleo"
                        valuePropName="checked"
                        onChange={onAutoEmpleoCheck}
                    >
                        <Checkbox>
                            Autoempleo
                        </Checkbox>
                    </Form.Item> */}
                    <Form.Item
                        label="No. de empleados hombres"
                        name="no_empleados_h"
                    >
                        <InputNumber min={0} disabled={tamanoEmpresa === 'autoempleo'} />
                    </Form.Item>
                    <Form.Item
                        label="No. de empleados mujeres"
                        name="no_empleados_m"
                    >
                        <InputNumber min={0} disabled={tamanoEmpresa === 'autoempleo'} />
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
                </div>

                {/* S T E P  3 PERSONA FISICA/MORAL */}
                <div
                    style={{
                        display: current === 1 ? "block" : "none",
                        paddingtop: 30,
                    }}
                >
                    <p>
                        <strong>
                            Si va a facturar llene los datos necesarios, si no
                            seleccion "No facturar" y vaya al siguiente paso
                        </strong>
                    </p>

                    <Form.Item
                        label="Usar tu perfil"
                        name="tipo_persona"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Seleccione un valor para la información de facturacion!",
                            },
                        ]}
                    >
                        <Radio.Group
                            onChange={(e) => {
                                setTipoPersona(e.target.value);
                                setTipoDireccionFacturacion("negocio");
                                resetDireccion();
                                if (e.target.value === "fisica")
                                    setPersonaMoral("");

                                if (e.target.value === "sin_facturar")
                                    form.setFieldsValue({
                                        pf_regimen_fiscal: null,
                                    });
                            }}
                        >
                            <Radio value="fisica">Persona física</Radio>
                            <Radio value="moral">Persona moral</Radio>
                            <Radio value="sin_facturar">No facturar</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {tipoPersona === "moral" ? (
                        <>
                            <Form.Item
                                label="Persona moral:"
                                rules={rules.requiredOnly}
                            >
                                <Radio.Group
                                    onChange={(e) =>
                                        setPersonaMoral(e.target.value)
                                    }
                                >
                                    {!!personasMorales &&
                                        personasMorales.map(
                                            (pm) => {
                                                return (
                                                    <Radio value={pm.id}>
                                                        {pm.razon_social}
                                                    </Radio>
                                                );
                                            }
                                        )}
                                    <Radio value="nueva_persona">
                                        + Agregar persona moral
                                    </Radio>
                                </Radio.Group>
                            </Form.Item>
                            {personaMoral === "nueva_persona" && (
                                <>
                                    <Form.Item
                                        name="razon_social"
                                        label="Razón Social"
                                    >
                                        <Input placeholder="RAZÓN SOCIAL" />
                                    </Form.Item>
                                    <Form.Item
                                        name="regimen_capital"
                                        label="Regimen de capital"
                                    >
                                        <Select
                                            showSearch
                                            placeholder="Regimen de capital"
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option?.children
                                                    ?.toUpperCase()
                                                    .includes(
                                                        input.toUpperCase()
                                                    )
                                            }
                                            filterSort={(optionA, optionB) => {
                                                return (
                                                    optionB.value -
                                                    optionA.value
                                                );
                                            }}
                                        >
                                            {regimenes_capital &&
                                                regimenes_capital.map(
                                                    (item, optionIndex) => {
                                                        return (
                                                            <Option
                                                                key={
                                                                    "optionIndex" +
                                                                    optionIndex
                                                                }
                                                                value={item.id}
                                                            >
                                                                {`(${item.id}) - ${item.name}`}
                                                            </Option>
                                                        );
                                                    }
                                                )}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        name="regimen_fiscal"
                                        label="Régimen Fiscal"
                                    >
                                        <Select
                                            showSearch
                                            placeholder="Régimen Fiscal"
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children.includes(input)
                                            }
                                            filterSort={(optionA, optionB) => {
                                                return (
                                                    optionB.value -
                                                    optionA.value
                                                );
                                            }}
                                        >
                                            {catalogoRegimenFiscal &&
                                                catalogoRegimenFiscal.map(
                                                    (item, optionIndex) => {
                                                        return (
                                                            <Option
                                                                disabled={
                                                                    item?.persona_moral ===
                                                                        true
                                                                        ? false
                                                                        : true
                                                                }
                                                                key={
                                                                    "optionIndex" +
                                                                    optionIndex
                                                                }
                                                                value={item.id}
                                                            >
                                                                {item.id} -{" "}
                                                                {item.name}
                                                            </Option>
                                                        );
                                                    }
                                                )}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        onChange={(e) =>
                                            onChangeCapitalLettersRFC(
                                                e.target.value
                                            )
                                        }
                                        label="RFC"
                                        name="ma_rfc"
                                        validations={[
                                            {
                                                pattern:
                                                    /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/,
                                            },
                                        ]}
                                        rules={[
                                            {
                                                pattern:
                                                    /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/,
                                            },
                                        ]}
                                    >
                                        <Input placeholder="ABAB090807ASD" />
                                    </Form.Item>
                                    <Form.Item
                                        name="acta_constitutiva"
                                        label="Acta Constitutiva y Poder Notarial"
                                        valuePropName="acta_constitutiva"
                                        getValueFromEvent={normFile}
                                        extra="Admite archivos PDF"
                                        rules={rules.requiredOnly}
                                    >
                                        <Upload
                                            onChange={(info) => {
                                                const { status } = info.file;
                                                if (status === "done") {
                                                    message.success(
                                                        `Acta subida correctamente`
                                                    );
                                                    //location.reload()
                                                } else if (status === "error") {
                                                    if (
                                                        info.file.response.includes(
                                                            "bytes exceeds the limit"
                                                        )
                                                    ) {
                                                        message.error(
                                                            "El archivo es demasiado grande, el límite de subida es de 50 MB"
                                                        );
                                                    } else {
                                                        message.error(
                                                            "Ocurrió un error al subir el archivo"
                                                        );
                                                    }
                                                }
                                            }}
                                            name="acta_constitutiva"
                                            action="/app/uploads/acta-constitutiva"
                                            data={uploadHeaders}
                                        >
                                            <Button icon={<UploadOutlined />}>
                                                Da click para cargar
                                            </Button>
                                        </Upload>
                                    </Form.Item>
                                    {/* Datos de facturación */}
                                    <h5>Datos de facturación</h5>
                                    <Form.Item
                                        label="Dirección de facturación"
                                        rules={rules.requiredOnly}
                                    >
                                        <Radio.Group
                                            onChange={(e) => {
                                                setUtilizarDireccionDeEstablecimiento(
                                                    e.target.value
                                                );
                                                form.setFieldsValue({
                                                    ma_calle_principal: null,
                                                    ma_calles: null,
                                                    ma_numero_externo: null,
                                                    ma_numero_interno: null,
                                                    ma_codigo_postal: null,
                                                    ma_codigo_postal: null,
                                                    ma_colonia_id: null,
                                                    ma_tipo: null,
                                                });
                                            }}
                                            value={
                                                utilizarDireccionDeEstablecimiento
                                            }
                                        >
                                            <Radio value={false}>
                                                Utilizar dirección del
                                                establecimiento
                                            </Radio>
                                            <Radio value={true}>
                                                Dirección distinta para la
                                                persona moral
                                            </Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    {utilizarDireccionDeEstablecimiento && (
                                        <>
                                            <Form.Item
                                                label="Calle principal"
                                                name="ma_calle_principal"
                                                rules={rules.requiredOnly}
                                            >
                                                <Input placeholder="15 de febrero" />
                                            </Form.Item>
                                            <Form.Item
                                                label="Calles"
                                                name="ma_calles"
                                                rules={rules.unrequired}
                                            >
                                                <Input placeholder="Entre Granito y Alga" />
                                            </Form.Item>
                                            <Form.Item
                                                label="Numero externo"
                                                name="ma_numero_externo"
                                                rules={rules.unrequired}
                                            >
                                                <Input placeholder="220" />
                                            </Form.Item>
                                            <Form.Item
                                                label="Numero interno"
                                                name="ma_numero_interno"
                                                rules={rules.unrequired}
                                            >
                                                <Input placeholder="4B" />
                                            </Form.Item>
                                            <Form.Item
                                                label="Codigo postal"
                                                name="ma_codigo_postal"
                                                rules={rules.requiredOnly}
                                            >
                                                <Select
                                                    showSearch
                                                    placeholder="Códigos Postales"
                                                    optionFilterProp="children"
                                                    filterOption={(
                                                        input,
                                                        option
                                                    ) =>
                                                        option.value.includes(
                                                            input.toString()
                                                        )
                                                    }
                                                    filterSort={(
                                                        optionA,
                                                        optionB
                                                    ) =>
                                                        optionB.value -
                                                        optionA.value
                                                    }
                                                    onChange={(value) =>
                                                        getColoniasByCodigoPostalMA(
                                                            value.toString()
                                                        )
                                                    }
                                                >
                                                    {codigosPostales &&
                                                        codigosPostales.map(
                                                            (
                                                                item,
                                                                optionIndex
                                                            ) => {
                                                                return (
                                                                    <Option
                                                                        key={
                                                                            "optionIndex" +
                                                                            optionIndex
                                                                        }
                                                                        value={
                                                                            item.id
                                                                        }
                                                                    >
                                                                        {
                                                                            item.nombre
                                                                        }
                                                                    </Option>
                                                                );
                                                            }
                                                        )}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                label="Colonia"
                                                name="ma_colonia_id"
                                                rules={rules.requiredOnly}
                                            >
                                                <Select
                                                    showSearch
                                                    placeholder="Colonias"
                                                    optionFilterProp="children"
                                                    filterOption={(
                                                        input,
                                                        option
                                                    ) => {
                                                        return (
                                                            option?.children
                                                                ?.toUpperCase()
                                                                ?.includes(
                                                                    input.toUpperCase()
                                                                ) ?? false
                                                        );
                                                    }}
                                                    filterSort={(
                                                        optionA,
                                                        optionB
                                                    ) =>
                                                        optionB.value -
                                                        optionA.value
                                                    }
                                                >
                                                    {coloniasMA &&
                                                        coloniasMA.map(
                                                            (
                                                                item,
                                                                optionIndex
                                                            ) => (
                                                                <Option
                                                                    key={
                                                                        "optionIndex" +
                                                                        optionIndex
                                                                    }
                                                                    value={
                                                                        item.id
                                                                    }
                                                                >
                                                                    {
                                                                        item.nombre_localidad
                                                                    }
                                                                </Option>
                                                            )
                                                        )}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                label="Tipo"
                                                name="ma_tipo"
                                                rules={rules.requiredOnly}
                                            >
                                                <Select>
                                                    <Option value="BODEGA_INDUSTRIA">
                                                        Bodega / Industria
                                                    </Option>
                                                    <Option value="OFICINA">
                                                        Oficina
                                                    </Option>
                                                    <Option value="COMERCIO">
                                                        Comercio
                                                    </Option>
                                                    <Option value="SERVICIO">
                                                        Servicio
                                                    </Option>
                                                </Select>
                                            </Form.Item>
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <div>
                            <h5>Dirección de facturación</h5>

                            <Form.Item
                                name="pf_regimen_fiscal"
                                label="Régimen Fiscal"
                                rules={[
                                    {
                                        required:
                                            tipoPersona !== "sin_facturar"
                                                ? true
                                                : false,
                                        message:
                                            "Por favor ingrese un régimen fiscal para su factura!",
                                    },
                                ]}
                            >
                                <Select
                                    disabled={
                                        tipoPersona === "sin_facturar"
                                            ? true
                                            : false
                                    }
                                    showSearch
                                    placeholder="Régimen Fiscal"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.includes(input)
                                    }
                                    filterSort={(optionA, optionB) => {
                                        return optionB.value - optionA.value;
                                    }}
                                >
                                    {catalogoRegimenFiscal &&
                                        catalogoRegimenFiscal.map(
                                            (item, optionIndex) => {
                                                return (
                                                    <Option
                                                        disabled={
                                                            item?.persona_fisica ===
                                                                true
                                                                ? false
                                                                : true
                                                        }
                                                        key={
                                                            "optionIndex" +
                                                            optionIndex
                                                        }
                                                        value={item.id}
                                                    >
                                                        {item.id} - {item.name}
                                                    </Option>
                                                );
                                            }
                                        )}
                                </Select>
                            </Form.Item>
                            <Radio.Group
                                disabled={tipoPersona === "sin_facturar"}
                                onChange={(e) => {
                                    setPersonaFisicaNuevaDireccion(
                                        e.target.value
                                    );
                                    form.setFieldsValue({
                                        pf_calle_principal: null,
                                        pf_calles: null,
                                        pf_numero_externo: null,
                                        pf_numero_interno: null,
                                        pf_codigo_postal: null,
                                        pf_codigo_postal: null,
                                        pf_colonia_id: null,
                                        pf_tipo: null,
                                    });
                                }}
                                value={personaFisicaNuevaDireccion}
                                style={{ marginBottom: 30, marginTop: 15 }}
                            >
                                <Radio value={false}>
                                    Utilizar dirección del establecimiento
                                </Radio>
                                <Radio value={true}>Dirección distinta</Radio>
                            </Radio.Group>
                            {personaFisicaNuevaDireccion && (
                                <>
                                    <Form.Item
                                        label="Calle principal"
                                        name="pf_calle_principal"
                                        rules={rules.requiredOnly}
                                    >
                                        <Input placeholder="15 de febrero" />
                                    </Form.Item>
                                    <Form.Item
                                        label="Calles"
                                        name="pf_calles"
                                        rules={rules.unrequired}
                                    >
                                        <Input placeholder="Entre Granito y Alga" />
                                    </Form.Item>
                                    <Form.Item
                                        label="Numero externo"
                                        name="pf_numero_externo"
                                        rules={rules.unrequired}
                                    >
                                        <Input placeholder="220" />
                                    </Form.Item>
                                    <Form.Item
                                        label="Numero interno"
                                        name="pf_numero_interno"
                                        rules={rules.unrequired}
                                    >
                                        <Input placeholder="4B" />
                                    </Form.Item>
                                    <Form.Item
                                        label="Codigo postal"
                                        name="pf_codigo_postal"
                                        rules={rules.requiredOnly}
                                    >
                                        <Select
                                            showSearch
                                            placeholder="Códigos Postales"
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.value.includes(
                                                    input.toString()
                                                )
                                            }
                                            filterSort={(optionA, optionB) => {
                                                return (
                                                    optionB.value -
                                                    optionA.value
                                                );
                                            }}
                                            onChange={(value) => {
                                                getColoniasByCodigoPostalPF(
                                                    value.toString()
                                                );
                                            }}
                                        >
                                            {codigosPostales &&
                                                codigosPostales.map(
                                                    (item, optionIndex) => {
                                                        return (
                                                            <Option
                                                                key={
                                                                    "optionIndex" +
                                                                    optionIndex
                                                                }
                                                                value={item.id}
                                                            >
                                                                {item.nombre}
                                                            </Option>
                                                        );
                                                    }
                                                )}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        label="Colonia"
                                        name="pf_colonia_id"
                                        rules={rules.requiredOnly}
                                    >
                                        <Select
                                            showSearch
                                            placeholder="Colonias"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => {
                                                return (
                                                    option?.children
                                                        ?.toUpperCase()
                                                        ?.includes(
                                                            input.toUpperCase()
                                                        ) ?? false
                                                );
                                            }}
                                            filterSort={(optionA, optionB) => {
                                                return (
                                                    optionB.value -
                                                    optionA.value
                                                );
                                            }}
                                        >
                                            {coloniasPF &&
                                                coloniasPF.map(
                                                    (item, optionIndex) => {
                                                        return (
                                                            <Option
                                                                key={
                                                                    "optionIndex" +
                                                                    optionIndex
                                                                }
                                                                value={item.id}
                                                            >
                                                                {
                                                                    item.nombre_localidad
                                                                }
                                                            </Option>
                                                        );
                                                    }
                                                )}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        label="Tipo"
                                        name="pf_tipo"
                                        rules={rules.requiredOnly}
                                    >
                                        <Select>
                                            <Option value="BODEGA_INDUSTRIA">
                                                Bodega / Industria
                                            </Option>
                                            <Option value="OFICINA">
                                                Oficina
                                            </Option>
                                            <Option value="COMERCIO">
                                                Comercio
                                            </Option>
                                            <Option value="SERVICIO">
                                                Servicio
                                            </Option>
                                        </Select>
                                    </Form.Item>
                                </>
                            )}
                        </div>
                    )}

                    {/*
                     * DIRECCIÓN DE NOTIFICACIÓN INICIO
                     */}

                    <h5>Dirección de notificación</h5>

                    {tipoPersona === "moral" &&
                        personaMoral !== "nueva_persona" && (
                            <Alert
                                showIcon
                                type="warning"
                                message="Dirección existente"
                                description="Si selecciona una persona moral existente se utilizará su dirección de notificación asiganda"
                            />
                        )}

                    {tipoPersona === "fisica" &&
                        window.user.direccion_notificacion && (
                            <Alert
                                showIcon
                                type="info"
                                message="Dirección existente"
                                description={`Usted cuenta con una dirección de notificación "${window.user.direccion_notificacion}" como persona física`}
                            />
                        )}

                    <Radio.Group
                        onChange={(e) => {
                            setTipoDireccionNotificacion(e.target.value);
                            form.setFieldsValue({
                                dn_calle_principal: null,
                                dn_calles: null,
                                dn_numero_externo: null,
                                dn_numero_interno: null,
                                dn_codigo_postal: null,
                                dn_codigo_postal: null,
                                dn_colonia_id: null,
                                dn_tipo: null,
                            });
                        }}
                        value={tipoDireccionNotificacion}
                        style={{ marginBottom: 30, marginTop: 15 }}
                    >
                        <Radio
                            disabled={
                                (tipoPersona === "fisica" &&
                                    window.user.direccion_notificacion) ||
                                (tipoPersona === "moral" &&
                                    personaMoral !== "nueva_persona")
                            }
                            value="direccion_negocio"
                        >
                            Utilizar dirección del establecimiento
                        </Radio>

                        <Radio
                            value="direccion_facturacion"
                            disabled={
                                (tipoPersona === "fisica" &&
                                    window.user.direccion_notificacion) ||
                                (tipoPersona === "moral" &&
                                    personaMoral !== "nueva_persona") ||
                                tipoPersona === "sin_facturar" ||
                                !personaFisicaNuevaDireccion
                            }
                        >
                            Utilizar dirección de facturación
                        </Radio>

                        <Radio
                            disabled={
                                (tipoPersona === "fisica" &&
                                    window.user.direccion_notificacion) ||
                                (tipoPersona === "moral" &&
                                    personaMoral !== "nueva_persona")
                            }
                            value="direccion_distinta"
                        >
                            Utilizar una dirección distinta
                        </Radio>
                    </Radio.Group>

                    {
                        // dn_ = dirección notificación
                        tipoDireccionNotificacion === "direccion_distinta" && (
                            <>
                                <Form.Item
                                    label="Calle principal"
                                    name="dn_calle_principal"
                                    rules={rules.requiredOnly}
                                >
                                    <Input placeholder="15 de febrero" />
                                </Form.Item>
                                <Form.Item
                                    label="Calles"
                                    name="dn_calles"
                                    rules={rules.unrequired}
                                >
                                    <Input placeholder="Entre Granito y Alga" />
                                </Form.Item>
                                <Form.Item
                                    label="Numero externo"
                                    name="dn_numero_externo"
                                    rules={rules.unrequired}
                                >
                                    <Input placeholder="220" />
                                </Form.Item>
                                <Form.Item
                                    label="Numero interno"
                                    name="dn_numero_interno"
                                    rules={rules.unrequired}
                                >
                                    <Input placeholder="4B" />
                                </Form.Item>
                                <Form.Item
                                    label="Codigo postal"
                                    name="dn_codigo_postal"
                                    rules={rules.requiredOnly}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Códigos Postales"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.value.includes(
                                                input.toString()
                                            )
                                        }
                                        filterSort={(optionA, optionB) =>
                                            optionB.value - optionA.value
                                        }
                                        onChange={(value) =>
                                            getColoniasByCodigoPostalMA(
                                                value.toString()
                                            )
                                        }
                                    >
                                        {codigosPostales &&
                                            codigosPostales.map(
                                                (item, optionIndex) => {
                                                    return (
                                                        <Option
                                                            key={
                                                                "optionIndex" +
                                                                optionIndex
                                                            }
                                                            value={item.id}
                                                        >
                                                            {item.nombre}
                                                        </Option>
                                                    );
                                                }
                                            )}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="Colonia"
                                    name="dn_colonia_id"
                                    rules={rules.requiredOnly}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Colonias"
                                        optionFilterProp="children"
                                        filterOption={(input, option) => {
                                            return (
                                                option?.children
                                                    ?.toUpperCase()
                                                    ?.includes(
                                                        input.toUpperCase()
                                                    ) ?? false
                                            );
                                        }}
                                        filterSort={(optionA, optionB) =>
                                            optionB.value - optionA.value
                                        }
                                    >
                                        {coloniasMA &&
                                            coloniasMA.map(
                                                (item, optionIndex) => (
                                                    <Option
                                                        key={
                                                            "optionIndex" +
                                                            optionIndex
                                                        }
                                                        value={item.id}
                                                    >
                                                        {item.nombre_localidad}
                                                    </Option>
                                                )
                                            )}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="Delegación"
                                    name="dn_delegacion"
                                    rules={rules.requiredOnly}
                                >
                                    <Select options={getListaDelegacionSelectOptions()} />

                                </Form.Item>{" "}
                                <Form.Item
                                    label="Tipo"
                                    name="dn_tipo"
                                    rules={rules.requiredOnly}
                                >
                                    <Select>
                                        <Option value="BODEGA_INDUSTRIA">
                                            Bodega / Industria
                                        </Option>
                                        <Option value="OFICINA">Oficina</Option>
                                        <Option value="COMERCIO">
                                            Comercio
                                        </Option>
                                        <Option value="SERVICIO">
                                            Servicio
                                        </Option>
                                    </Select>
                                </Form.Item>
                            </>
                        )
                    }

                    {/*
                     * DIRECCIÓN DE NOTIFICACIÓN FINAL
                     */}
                </div>

                <div
                    style={{
                        display: current === 2 ? "block" : "none",
                        paddingTop: 30,
                    }}
                >
                    <h1>Finalizar registro</h1>
                    <p>
                        Si presionas finalizar, enviarás tu solicitud de
                        registro del establecimiento
                    </p>
                    {savingData && <h5>Procesando solicitud...</h5>}
                </div>
            </Form>

            <div style={{ textAlign: "right" }}>
                <Button disabled={current === 0} onClick={_prev}>
                    Anterior
                </Button>
                <Divider type="vertical" />
                {!savingData && (
                    <Button
                        type="primary"
                        onClick={_next}
                        disabled={
                            (claveCatastralPagado ?? "") === "sucess"
                                ? false
                                : true
                        }
                    >
                        {current > 1 ? "Finalizar" : "Siguiente"}
                    </Button>
                )}
            </div>
        </div>
    );
}

export default NegocioModal;
