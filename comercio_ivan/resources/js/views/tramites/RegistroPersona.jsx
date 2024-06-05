import React, { useState, useEffect } from 'react';
import { Form, Radio, Input, Select, Upload, Button, Alert, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import useGetCodigosPostales from "../../utils/hooks/useGetCodigosPostales";
import useGetColoniasByCodigoPostal from "../../utils/hooks/useGetColoniasByCodigoPostal";
import usePersonasMorales from "../../utils/hooks/usePersonasMorales";
import catalogoRegimenFiscal from "../../utils/regimenFiscalList";
import { regimenes_capital } from "../../utils/ListaRegimenesCapital";

const { Option } = Select;
const { Search } = Input;

function RegistroPersona({form}) {
    const [codigosPostales, getCodigosPostales] = useGetCodigosPostales();
    const [coloniasMA, getColoniasByCodigoPostalMA] = useGetColoniasByCodigoPostal();
    const [coloniasPF, getColoniasByCodigoPostalPF] = useGetColoniasByCodigoPostal();
    const [tipoPersona, setTipoPersona] = useState(null);
    const [personaMoral, setPersonaMoral] = useState("nueva_persona");
    const [personasMorales] = usePersonasMorales();
    const [personaFisicaNuevaDireccion, setPersonaFisicaNuevaDireccion] = useState(true);
    const [tipoDireccionNotificacion, setTipoDireccionNotificacion] = useState("direccion_facturacion");
    const [tipoDireccionFacturacion, setTipoDireccionFacturacion] = useState("negocio");

    const rules = {
        requiredOnly: [{ required: true }],
        unrequired: [{ required: false }],
    };

    const uploadHeaders = {
        _token: document.head.querySelector('meta[name="csrf-token"]').content  ?? window.csrf,
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e.fileList;
    };

    const onChangeCapitalLettersRFC = (e) => {
        form.setFieldsValue({
            ma_rfc: e.toUpperCase(),
        });
    };

    const resetDireccion = () => {
        form.setFieldsValue({
            ma_calle_principal: null,
            ma_calles: null,
            ma_numero_interno: null,
            ma_codigo_postal: null,
            ma_colonia_id: null,
        });
        setPersonaFisicaNuevaDireccion(true);
        form.setFieldsValue({
            pf_calle_principal: null,
            pf_calles: null,
            pf_numero_interno: null,
            pf_codigo_postal: null,
            pf_colonia_id: null,
        });
        form.setFieldsValue({
            dn_calle_principal: null,
            dn_calles: null,
            dn_numero_interno: null,
            dn_codigo_postal: null,
            dn_colonia_id: null,
        });
    };

    useEffect(() => {
        getCodigosPostales();
        getColoniasByCodigoPostalMA();
        getColoniasByCodigoPostalPF();
    }, []);

    return (
        <Form form={form}>
            <div
                >
                    <Form.Item
                        label="Usar tu perfil"
                        name="tipo_persona"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Seleccione un valor para el perfil de solicitante",
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
                                if (e.target.value === "moral")
                                    setPersonaMoral("nueva_persona");
                            }}
                        >
                            <Radio value="fisica">Persona física</Radio>
                            <Radio value="moral">Persona moral</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {tipoPersona && (
                    <>
                    {tipoPersona === "moral" ?
                    (
                        <>
                            <Form.Item
                                name="persona_moral_id"
                                label="Persona moral:"
                                rules={rules.requiredOnly}
                                initialValue={"nueva_persona"}
                            >
                                <Radio.Group
                                    onChange={(e) =>
                                        setPersonaMoral(e.target.value)
                                    }
                                    value={personaMoral}
                                >
                                    {!!personasMorales && personasMorales.map(
                                            (pm) => {
                                                return (
                                                    <Radio value={pm.id}>
                                                        {pm.razon_social}
                                                    </Radio>
                                                );
                                            }
                                        )}
                                    <Radio value="nueva_persona" defaultChecked>
                                        + Agregar persona moral
                                    </Radio>
                                </Radio.Group>
                            </Form.Item>
                            {personaMoral === "nueva_persona" && (
                                <>
                                    <Form.Item
                                        name="razon_social"
                                        label="Razón Social"
                                        rules={rules.requiredOnly}
                                    >
                                        <Input placeholder="RAZÓN SOCIAL" />
                                    </Form.Item>
                                    <Form.Item
                                        name="regimen_capital"
                                        label="Regimen de capital"
                                        rules={rules.requiredOnly}
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
                                        rules={rules.requiredOnly}
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
                                            {required: true}
                                        ]}
                                    >
                                        <Input placeholder="ABAB090807ASD" />
                                    </Form.Item>
                                    <Form.Item
                                        name="acta_constitutiva"
                                        label="Acta Constitutiva"
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
                                                rules={rules.requiredOnly}
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
                                        rules={rules.requiredOnly}
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
                                </>
                            )}
                        </div>
                    )}

                    {/*
                     * DIRECCIÓN DE NOTIFICACIÓN INICIO
                     */}

                    {
                        (
                            (tipoPersona === "moral" && personaMoral === "nueva_persona")
                            || tipoPersona !== "moral"
                        ) && (<>
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

                            <Form.Item
                                name="tipo_direccion_notificacion"
                                rules={rules.requiredOnly}
                                initialValue={"direccion_facturacion"}
                            >
                                <Radio.Group
                                    onChange={(e) => {
                                        setTipoDireccionNotificacion(e.target.value);
                                        form.setFieldsValue({
                                            dn_calle_principal: null,
                                            dn_calles: null,
                                            dn_numero_externo: null,
                                            dn_codigo_postal: null,
                                            dn_colonia_id: null,
                                        });
                                    }}
                                    value={tipoDireccionNotificacion}
                                    style={{ marginBottom: 30, marginTop: 15 }}
                                >
                                    <Radio
                                        value="direccion_facturacion"
                                        defaultChecked
                                    >
                                        Utilizar dirección de facturación
                                    </Radio>

                                    {
                                        tipoPersona === "fisica" && window.user.direccion_notificacion && (<>
                                            <Radio
                                                value="direccion_existente"
                                            >
                                                Utilizar dirección existente
                                            </Radio>
                                        </>)
                                    }

                                    {
                                        (tipoPersona === "moral" || !window.user.direccion_notificacion) && (<>
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
                                        </>)
                                    }
                                </Radio.Group>
                            </Form.Item>


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
                                    </>
                                )
                            }
                        </>)
                    }


                    </>
                    )}

                    {/*
                     * DIRECCIÓN DE NOTIFICACIÓN FINAL
                     */}
                </div>
        </Form>
    )
}

export default RegistroPersona;
