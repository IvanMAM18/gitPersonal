import TramitePagosContext from "./TramitePagosContext";
import DetalleNegocio from "../components/ComponentesModalDetallesNegocio/DetalleNegocio";
import { Fragment, useContext, useEffect, useState } from "react";

import {
    Input,
    InputNumber,
    Modal,
    Form,
    Select,
    Collapse,
    message,
    Button,
} from "antd";
import axios from "axios";
import moment from "moment";

const { Panel } = Collapse;
const { TextArea } = Input;

const formatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
});

function GenerarCobrosModal() {
    const {
        crearPagoFormModalVisible,
        setCrearPagoFormModalVisible,
        negocio,
        tramite,
        avisoEntero,
        setAvisoEntero,
        persona,
        year
    } = useContext(TramitePagosContext);
    const [conceptos, setConceptos] = useState([]);
    const [crearPagoForm] = Form.useForm();
    const [conceptoSeleccionado, setConceptoSeleccionado] = useState(null);
    const [conceptoDetalles, setConceptoDetalles] = useState([]);
    const [conceptoDetallesSeleccionado, setConceptoDetallesSeleccionado] =
        useState(null);
    const [conceptoDetallesIncisos, setConceptoDetallesIncisos] = useState([]);
    const [conceptoDetallesTotal, setConceptoDetallesTotal] = useState(0.0);
    const [detalle1, setDetalle1] = useState("");
    const [detalle2, setDetalle2] = useState("");
    const [info, setInfo] = useState("");
    const [adeudo, setAdeudo] = useState(0);
    const [descuento, setDescuento] = useState(0);
    const [descuento2023, setDescuento2023] = useState(0);
    const [total, setTotal] = useState(0);
    const [descuentoId, setDescuentoId] = useState(0);
    const [adeudoCambiado, setAdeudoCambiado] = useState(false);
    const [enviandoForm, setEnviandoForm] = useState(false);
    const [incisosValorManual, setIncisosValorManual] = useState({});
    const [valores, setValores] = useState({});
    const [porcentajeDescuento, setPorcentajeDescuento] = useState('75%');
    const [anioTramite, setAnioTramite] = useState(moment(tramite.created_at).year());
    const [messageApi, contextHolder] = message.useMessage()

    useEffect(() => {
        cargarConceptos();
    }, [tramite]);

    useEffect(() => {
        cargarConceptoDetalles();
    }, [conceptoSeleccionado]);

    useEffect(() => {
        cargarConceptoDetallesIncisos();
    }, [conceptoDetallesSeleccionado]);

    useEffect(() => {
        calcularDescuento2023();
        setDetalle2(getDefaultDetalle2(valores));
        crearPagoForm.setFieldsValue({
            detalle2: getDefaultDetalle2(valores),
        });
    }, [conceptoDetallesIncisos]);

    useEffect(() => {
        setTotal(conceptoDetallesTotal);
    }, [conceptoDetallesTotal]);

    useEffect(() => {
        calcularDescuento2023();
    }, [adeudo, descuento]);

    useEffect(() => {
        recalcularIncisos();
    }, [descuentoId, descuento2023]);

    const cargarConceptos = () => {
        const catalogoTramiteId = tramite?.catalogo_tramites
            ? tramite?.catalogo_tramites[0].id
            : 0;
        if(!catalogoTramiteId)
            return;
        const params = {year};
        if(negocio) {
            params.negocio_id = negocio.id;
        }
        axios
            .get(`/entidad-revision/catalogo-tramites/${catalogoTramiteId}/conceptos`, {
                params
            })
            .then((response) => {
                const _conceptos = response.data;
                setConceptos(_conceptos);
                if(_conceptos.length == 1) {
                    crearPagoForm.setFieldsValue({
                        concepto: _conceptos[0].id
                    });
                    seleccionarConcepto(_conceptos[0].id);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const cargarConceptoDetalles = () => {
        if (!conceptoSeleccionado) return;
        const params = {};
        if(negocio) {
            params.negocio_id = negocio.id;
        }
        axios
            .get(`/entidad-revision/conceptos/${conceptoSeleccionado}/detalles`, {
                params
            })
            .then((response) => {
                const _conceptoDetalles = response.data.map(detalle =>
                    ({
                        ...detalle,
                        descripcion: detalle.descripcion.length
                            ? detalle.descripcion
                            : 'N/A'
                    })
                );
                setConceptoDetalles(_conceptoDetalles);
                if(_conceptoDetalles.length == 1) {
                    crearPagoForm.setFieldsValue({
                        concepto_detalle_id: _conceptoDetalles[0].id
                    });
                    seleccionarConceptoDetalles(_conceptoDetalles[0].id);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const cargarConceptoDetallesIncisos = () => {
        if (!conceptoDetallesSeleccionado) return;
        const params = {};
        if(negocio) {
            params.negocio_id = negocio.id;
            params.anio = moment(tramite.created_at).year();
        }
        axios
            .get(
                `/entidad-revision/concepto-detalles/${conceptoDetallesSeleccionado}/incisos`,
                {
                    params,
                }
            )
            .then((response) => {
                const _concepto = response.data.concepto;
                const _conceptoDetallesIncisos = response.data.conceptos_detalles_incisos;
                const _total = response.data.total;
                const _conceptoDetallesIncisos2 = _conceptoDetallesIncisos.filter(
                        i => i.inciso?.descripcion != _concepto.nombre
                    ).map(c => c);
                const _valores = response.data.valores;
                setConceptoDetallesIncisos(_conceptoDetallesIncisos);
                setConceptoDetallesTotal(_total);
                setDetalle1(defaultValueDetalle1);
                setDetalle2(getDefaultDetalle2(_valores));
                setInfo("");
                setDescuento2023(0);
                setDescuento(0);
                setAdeudo(0);
                setValores(_valores);

                const incisoDescuento = _conceptoDetallesIncisos.find(cdi => !!cdi.descuentos?.length);
                setDescuentoId(incisoDescuento ? incisoDescuento.descuentos[0]?.id ?? 0 : 0);
                crearPagoForm.setFieldsValue({
                    detalle1: defaultValueDetalle1,
                    detalle2: getDefaultDetalle2(_valores),
                    info,
                    total: formatter.format(_total),
                    descuento: 0,
                    adeudo: 0,
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const recalcularIncisos = () => {
        if (!conceptoDetallesSeleccionado) return;
        axios
            .post(
                `/entidad-revision/concepto-detalles/${conceptoDetallesSeleccionado}/incisos/calcular`,
                {
                    negocio_id: negocio?.id ?? 0,
                    descuento2023,
                    descuento,
                    adeudo,
                    incisos_valor_manual: incisosValorManual,
                }
            )
            .then((response) => {
                const _conceptoDetallesIncisos = response.data.conceptos_detalles_incisos;
                const _total = response.data.total;
                const _valores = response.data.valores;
                setAdeudoCambiado(false);
                setConceptoDetallesIncisos(_conceptoDetallesIncisos);
                setConceptoDetallesTotal(_total);
                setValores(_valores);
                setDetalle2(getDefaultDetalle2(_valores));

                crearPagoForm.setFieldsValue({
                    total: formatter.format(_total),
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const seleccionarConcepto = (valor) => {
        setConceptoSeleccionado(valor);
        setConceptoDetallesSeleccionado(null);
        setConceptoDetallesTotal(0.0);
        setConceptoDetallesIncisos([]);
        crearPagoForm.setFieldsValue({
            concepto_detalle_id: null,
            total: 0.0
        });
    };

    const seleccionarConceptoDetalles = (valor) => {
        setConceptoDetallesSeleccionado(valor);
    };

    const enviarGenerarCobroForm = () => {
        if(adeudoCambiado) {
            messageApi.open({
                type: 'warning',
                content: 'Adeudo agregado, verifica el total del pago.',
            });
            return;
        }
        const datosCobro = {
            tramite_id: tramite.id,
            anio: moment(tramite.created_at).year(),
            concepto_id: conceptoSeleccionado,
            concepto_detalle_id: conceptoDetallesSeleccionado,
            incisos: conceptoDetallesIncisos.map(
                (detalleInciso) => detalleInciso.id
            ),
            adeudo: adeudo,
            descuento: descuento,
            descuento2023: descuento2023,
            total: total,
            detalle1,
            detalle2,
            info,
            incisos_valor_manual: incisosValorManual
        };
        setEnviandoForm(true);
        axios
            .post("/entidad-revision/pagos", datosCobro)
            .then((response) => {
                setAvisoEntero(response.data);
                setCrearPagoFormModalVisible(false);
                setEnviandoForm(false)
            })
            .catch(errors => {
                if (errors?.response.data?.errors) {
                    message.error(errors.response.data.message)
                }
                setEnviandoForm(false)
            })
    };

    const calcularDescuento2023 = () => {
        const inciso = conceptoDetallesIncisos.find(cdi => !!cdi.inciso?.descuentos?.length);
        if(!inciso)
            return;
        const _descuento2023 = adeudo > 0
            ? inciso.total * 0.75
            : inciso.total * 0.75;
        setDescuento2023(_descuento2023);
        setPorcentajeDescuento(adeudo > 0 ? '75%' : '75%')
        crearPagoForm.setFieldsValue({descuento2023: _descuento2023});
    };

    const errorEnviarGenerarCobroForm = () => {
        console.log("errorEnviarGenerarCobroForm");
    };

    const formatearDireccion = (direccion) => {
        const callePrincipal = direccion.calle_principal
            ? `${direccion.calle_principal} `
            : "Sin calle ";
        const numeroExterno = direccion.numero_externo
            ? `No.Ext.${direccion.numero_externo} `
            : "";
        const numeroInterno = direccion.numero_interno
            ? `No.Int.${direccion.numero_interno} `
            : "";
        const entreCalles = direccion.calles
            ? `${direccion.calles} `
            : "";
        const codigoPostal = direccion.codigo_postal
            ? `C.P. ${direccion.codigo_postal} `
            : "";
        const colonia = direccion.colonia
            ? `Col. ${direccion.colonia} `
            : "";
        return `${callePrincipal}${numeroExterno}${
            numeroInterno
        }${entreCalles}${codigoPostal}${colonia}`;
    }

    const getDefaultDetalle2 = (valores) => {
        const concepto = conceptos.find(c => c.id == conceptoSeleccionado);
        const conceptoDetalle = conceptoDetalles.find(cd => cd.id == conceptoDetallesSeleccionado);
        const entidadRevision = parseInt(user.entidad_revision);
        const _valores = valores ? valores : {};
        const añoTramite = moment(tramite.created_at).year()
        let detalle2 = '';
        switch(entidadRevision) {
            case 1:
                //Uso de suelo
                break;
            case 2:
                //Protección civil
                if(añoTramite == 2024) {
                    detalle2 = `${conceptoDetalle ? conceptoDetalle.descripcion : 'N/A'}, ${_valores.NO_EMPLEADOS
                            ? _valores.NO_EMPLEADOS + ' EMPLEADOS' : ''}, ${_valores.VALOR ? _valores.VALOR + ' UMAs' : ''
                        }${_valores.TARIFA_PROGRAMA_INTERNO ? ', PROGRAMA INTERNO ' + parseInt(_valores.TARIFA_PROGRAMA_INTERNO)
                        + ' UMAs' : '' }`.replace(/\s+/g, ' ').trim().toUpperCase();
                } else {
                    const programaInterno = concepto
                        && concepto.opciones
                        && concepto.opciones.includes('PROGRAMA_INTERNO');
                    detalle2 = `${conceptoDetalle ? conceptoDetalle.descripcion : 'N/A'} ${programaInterno
                        ? _valores.NEGOCIO_M2 + ' METROS CUADRADOS' : ''}, ${programaInterno
                            ? _valores.NO_EMPLEADOS + ' EMPLEADOS' : ''}`.replace(/\s+/g, ' ').trim().toUpperCase();
                }
                break;
            case 3:
                break;
            case 4:
                //Servicios Publicos
                const tieneDescuento = conceptoDetallesIncisos.filter(
                    inciso => !!inciso.inciso?.descuentos?.length
                ).length > 0;
                if(añoTramite == 2024) {
                    detalle2 = `${_valores.DESCRIPCION_TARIFA} (${_valores.UMA_ANUAL ? _valores.UMA_ANUAL + ' UMA ANUAL': 'N/A'}) ${_valores.MESES_TEXTO ?? 'N/A'} ${tieneDescuento ? 'DESCUENTO ' + porcentajeDescuento : ''}`.replace(/\s+/g, ' ').trim().toUpperCase();
                } else {
                    detalle2 = `${_valores.GIRO  ?? 'N/A'} - ${_valores.FRECUENCIA ?? 'N/A'} ${
                        _valores.VOLUMEN ? 'VOLUMEN ' + _valores.VOLUMEN : 'N/A'
                    } (${_valores.VALOR_UMA ? _valores.VALOR_UMA + ' UMA': 'N/A'}) ${_valores.MESES_TEXTO ?? 'N/A'} ${tieneDescuento ? 'DESCUENTO ' + porcentajeDescuento : ''}`.replace(/\s+/g, ' ').trim().toUpperCase();
                }
                detalle2=detalle2 +' '+añoTramite;
                break;
            case 5:
                //Comercio
                detalle2 = `${conceptoDetalle ? conceptoDetalle.descripcion : 'N/A'}`.replace(/\s+/g, ' ').trim().toUpperCase();
                break;
            case 6:
                //Alcoholes
                detalle2 = `${conceptoDetalle ? conceptoDetalle.descripcion : 'N/A'}`.replace(/\s+/g, ' ').trim().toUpperCase();
                break;
        }
        detalle2 = reemplazarAcentos(detalle2);
        return detalle2;
    }

    const reemplazarAcentos = (cadena) => {
        return cadena
            .replace(/[ÁÀ]+/g, 'A')
            .replace(/[ÉÈ]+/g, 'E')
            .replace(/[ÍÌ]+/g, 'I')
            .replace(/[ÓÒ]+/g, 'O')
            .replace(/[ÚÙ]+/g, 'U')
    }

    const descripcionTramite = tramite?.catalogo_tramites
        ? tramite?.catalogo_tramites[0].descripcion
        : '';

    const direccion = formatearDireccion(negocio?.direccion ?? persona?.direccion ?? persona?.direccion_notificacion ?? {});

    let solicitante = negocio ? negocio.nombre_del_negocio : 'N/A';

    if(persona) {
        const esPersonaMoral = !!persona.persona_id;
        solicitante = esPersonaMoral ?
            persona.razon_social :
            `${persona.apellido_pat} ${persona.apellido_mot}, ${persona.nombre}`;
    }
    const defaultValueDetalle1 =
        reemplazarAcentos(
`Tramite ID: ${tramite.tramite_padre_id}
${negocio ? 'Nombre comercial:' : 'Solicitante:'} ${solicitante},
${direccion}`.replace(/\s+/g, ' ').trim().toUpperCase()
        );

    const defaultValueDetalle2 = getDefaultDetalle2(valores);

    return (
        <Fragment>
            {contextHolder}
            <Modal
                title="Solicitar pago"
                centered
                visible={crearPagoFormModalVisible}
                onOk={crearPagoForm.submit}
                onCancel={() => setCrearPagoFormModalVisible(false)}
                width={900}
                forceRender={true}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => setCrearPagoFormModalVisible(false)}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        disabled={enviandoForm}
                        loading={enviandoForm}
                        onClick={crearPagoForm.submit}>
                        Ok
                    </Button>,
                ]}
            >
                <Form
                    name="crearPagoForm"
                    form={crearPagoForm}
                    onFinish={enviarGenerarCobroForm}
                    onFinishFailed={errorEnviarGenerarCobroForm}
                    autoComplete="off"
                    validateMessages={{
                        required: "Requerido",
                    }}
                    initialValues={{
                        detalle1: defaultValueDetalle1,
                        detalle2: defaultValueDetalle2
                    }}
                >
                    <Collapse
                        defaultActiveKey={[]}
                        expandIconPosition="end"
                        ghost>
                        { negocio
                            ? <Panel header={
                                    <Form.Item label="Negocio" className="mb-0">
                                        <Input
                                            disabled={true}
                                            value={negocio?.nombre_del_negocio}
                                        />
                                    </Form.Item>
                                }
                                key="1">
                                    <DetalleNegocio
                                        useDivider={false}
                                        negocio={negocio} />
                                </Panel>
                            : null
                        }
                    </Collapse>


                    <Form.Item label="Tramite">
                        <Input disabled={true} value={descripcionTramite ?? ""} />
                    </Form.Item>
                    <Form.Item name="concepto" label="Concepto">
                        <Select
                            showSearch
                            placeholder="Seleciona un concepto"
                            optionFilterProp="nombre"
                            fieldNames={{
                                label: "nombre",
                                value: "id",
                            }}
                            onChange={seleccionarConcepto}
                            options={conceptos}
                        />
                    </Form.Item>
                    <Form.Item name="concepto_detalle_id" label="Detalles concepto">
                        <Select
                            showSearch
                            placeholder="Seleciona un detalle de concepto"
                            optionFilterProp="descripcion"
                            fieldNames={{
                                label: "descripcion",
                                value: "id",
                            }}
                            onChange={seleccionarConceptoDetalles}
                            options={conceptoDetalles}
                        />
                    </Form.Item>
                    {conceptoDetallesIncisos &&
                        conceptoDetallesIncisos.map(
                            (inciso) => {
                                const tieneDescuento = !!inciso.inciso?.descuentos?.length;
                                const mostrarAdeudo = !!inciso.opciones?.includes('MOSTRAR_ADEUDO');
                                const esValorManual = !!inciso.opciones?.includes('VALOR_MANUAL');

                                if(esValorManual) {
                                    const numeroInciso = inciso.inciso.inciso;

                                    const valorManualItem = <Form.Item label={
                                        inciso.inciso?.descripcion ??
                                        "Inciso no encontrado"
                                    }>
                                        <InputNumber
                                            precision={2}
                                            min={0}
                                            max={1000000000}
                                            defaultValue={0.00}
                                            onChange={
                                                (valor) => {
                                                    const _incisosValorManual = {...incisosValorManual};
                                                    _incisosValorManual[numeroInciso] = valor;
                                                    setIncisosValorManual(_incisosValorManual);
                                                    setAdeudoCambiado(true);
                                                }
                                            }
                                            onBlur={recalcularIncisos}/>
                                    </Form.Item>;

                                    return (
                                        <Fragment key={`inciso${inciso.inciso.id}descuento`}>
                                            {valorManualItem}
                                        </Fragment>
                                    );
                                }

                                const descuentoFragment = <Fragment key={`inciso${inciso.inciso.id}descuento`}>
                                    <Form.Item name="descuento2023" label="Descuento 2023">
                                        <InputNumber
                                            disabled={true}
                                            precision={2}
                                            min={0}
                                            max={1000000000} />
                                    </Form.Item>
                                </Fragment>;

                                const adeudoFormItem = <Form.Item name="adeudo" label="Adeudo">
                                    <InputNumber
                                        precision={2}
                                        min={0}
                                        max={1000000000}
                                        onChange={(valor) => {setAdeudo(valor); setAdeudoCambiado(true);}}
                                        onBlur={recalcularIncisos}/>
                                </Form.Item>;

                                const descuentoAdeudoItem = <Form.Item
                                    name="descuento"
                                    label="Descuento del adeudo"
                                    >
                                    <InputNumber
                                        precision={2}
                                        min={0}
                                        max={1000000000}
                                        onChange={(valor) => setDescuento(valor)}
                                        onBlur={recalcularIncisos}/>
                                </Form.Item>;

                                return <Fragment key={inciso.id}>
                                    <Form.Item
                                        key={inciso.id}
                                        label={
                                            inciso.inciso?.descripcion ??
                                            "Inciso no encontrado"
                                        }
                                    >
                                        <Input
                                            disabled={true}
                                            value={formatter.format(inciso.total)}
                                        />
                                    </Form.Item>
                                    { tieneDescuento ? descuentoFragment : null }
                                    {/* { tieneDescuento ? adeudoFormItem : null }
                                    { tieneDescuento ? descuentoAdeudoItem : null } */}
                                    { !tieneDescuento && mostrarAdeudo ? adeudoFormItem : null}
                                </Fragment>
                            }
                        )
                    }
                    <Form.Item name="total" label="Total">
                        <Input
                            disabled={true}
                            value={formatter.format(conceptoDetallesTotal)}
                        />
                    </Form.Item>
                    {
                        conceptoDetallesIncisos && conceptoDetallesIncisos.length ?
                            <>
                                <Form.Item name="detalle1" label="Detalle 1">
                                    <TextArea
                                        rows={3}
                                        onChange={(e) => setDetalle1(e.target.value)}
                                        disabled={true}
                                        />
                                </Form.Item>
                                <Form.Item name="detalle2" label="Detalle 2">
                                    <TextArea
                                        rows={2}
                                        onChange={(e) => setDetalle2(e.target.value)}
                                        disabled={true}
                                        />
                                </Form.Item>
                                <Form.Item name="info" label="Mas información">
                                    <TextArea rows={2} onChange={(e) => setInfo(e.target.value)}/>
                                </Form.Item>
                            </>
                        : null
                    }
                </Form>
            </Modal>
        </Fragment>
    );
}

export default GenerarCobrosModal;
