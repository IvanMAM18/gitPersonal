import React, { useEffect, useState } from "react";

import TablaDeRevisiones from "../../components/TablaDeLicenciasAlcohol";
import { Tabs } from "antd";
import { CheckSquareOutlined ,WarningOutlined} from "@ant-design/icons";

import { Card, Button,  Statistic, message, Form,Select } from "antd";

import moment from "moment";

const d = (date) => moment(date).format("DD/MM/YYYY HH a");

export default  function LicenciaAlcoholes() {

    const [form] = Form.useForm();

     const rules = {
         requiredOnly: [{required: true}],
         unrequired: [{required: false}],
     };
    const [savingData, setSavingData] = useState(false);
    const [selectedYear, setSelectedYear] = useState(2024);
    const [licencias, setLicencias] = useState([]);
    const [negocios, setNegocios] = useState([]);
    const [negociosSinLicencia, setNegociosSinLicencia] = useState([]);
    const [licenciasNegocios, setLicenciasNegocios] = useState([]);
    const [asingadas, setAsingadas] = useState(0);
    const [sinAsingar, setSinAsingar] = useState(0);
    const [disableLic, setDisableLic] = useState(false);
    const [disableProp, setDisableProp] = useState(false);
    const [disableOpe, setDisableOpe] = useState(false);
    const [filterNombrePro, setFilterNombrePro] = useState([]);
    const [filterNombreOp, setFilterNombreOp] = useState([]);
    const [filterLicencia, setFilterLicencia] = useState([]);
    useEffect(() => {
        reload();
    }, []);
    const reload = () => {
        getLicencias();
        getTodosNegocios();
        getNegociosSinLicencia();
        getNegociosLicencias();
    }
    const getLicencias = () => {
        axios.get("/app/get-licencias").then((result) => {
            setLicencias(result?.data.licencias ?? []);
            setAsingadas(result?.data.licenciaAsignadas??0);
            setSinAsingar(result?.data.licenciaPorAsingar??0);
        });
    }
    useEffect(() => {
        form.setFieldsValue({

            negocio_propietario_id: null,
            negocio_operador_id: null,
        });
        getNegociosSinLicencia();
        getTodosNegocios();
    }, [selectedYear])
    const getTodosNegocios = () => {
        axios.get(`/app/contribuyentes/${selectedYear}/con-licencia-de-alcoholes`)
            .then((result) => {
            setNegocios(result.data);
        })
    }
    const getNegociosSinLicencia = () => {
        setNegociosSinLicencia([]);

        axios.get(`/app/get-negocios-no-licencia/${selectedYear}`)
            .then((result) => {
                setNegociosSinLicencia(result.data);
            })
    }

    const getNegociosLicencias = () => {
        axios.get("/app/get-licencia-negocios").then((result) => {
            setLicenciasNegocios(result?.data ?? []);
            let filterOp = [];
            let filterPr = [];
            let filterLi = [];


            result?.data.map((negocio) => {
                filterOp = [
                    ...filterOp,
                    {
                        text: negocio.negocio_operador?.nombre_del_negocio,
                        value: negocio.negocio_operador?.nombre_del_negocio,
                    },
                ];
                // rst[status.name] = 0;
            });
            setFilterNombreOp(filterOp);
            result?.data.map((negocio) => {
                filterLi = [
                    ...filterLi,
                    {
                        text: negocio.licencia.clave,
                        value: negocio.licencia.clave,
                    },
                ];
                // rst[status.name] = 0;
            });
            setFilterLicencia(filterLi);

        })
    }

    const _next = () => {
        form.submit();
    };

    const finish = (data) => {
        
        setSavingData(true);
            axios
            .post("/app/licencia-negocio", {
            ...data, "year":selectedYear
            })
            .then((result) => {
                setSavingData(false);
                message.success("Guardado Correctamente");
                reload();
                reable();
                //location.href = `/app/mis-negocios/${result?.data?.id}`;
            })
            .catch((error) => {
                console.log("catch((error", error.response.data);
                message.error("Error al guardar"+error.response.data.message);
                setSavingData(false);
            });
        };
        const finishFailed = (error) => {
            if (error.errorFields && error.errorFields.length) {
                message.error("Formulario incompleto, verifique los campos vacíos");
            }
        };

    const reable = ( ) => {
        setDisableOpe(false)
        setDisableProp(false)
        setDisableLic(false)
        form.setFieldsValue({
            licencia_id: null,
            negocio_propietario_id: null,
            negocio_operador_id: null,
        });
    }

    return (
        <div className="sare--container site-statistic-demo-card">

            <h2 className="mb-5">Asignación de Licencias de Alcohol</h2>

            <div className="flex justify-center gap-5">
                    <Statistic className="border border-gray-400 px-5 py-2 text-center"
                               title="Licencias Asignadas"
                               valueStyle={{color: '#03A9F4',}}
                               value={asingadas}
                    />
                    <Statistic className="border border-gray-400 px-5 py-2 text-center"
                        title="Licencias Por Asignar"
                        valueStyle={{color: '#FBC02D',}}
                        value={sinAsingar}
                    />
            </div>

            <br/><br />

            <div className="w-full flex justify-end items-center p-3">

                <span className="mr-2">Año Fiscal: </span>

                <Select
                    defaultValue="2024"
                    className="w-24"
                    onChange={(value) => {
                            setSelectedYear(value);
                        }
                    }
                    options={[
                        {
                        value: '2024',
                        label: '2024',
                        },
                        {
                        value: '2023',
                        label: '2023',
                        },
                    ]}
                    />
            </div>

            <div className="card-container">
                <Tabs>
                    <Tabs.TabPane tab="Asignar Una Licencia" key="item-1">
                    {savingData && <h5>Procesando solicitud...</h5>}
                <Form
                    name="basic"
                    form={form}
                    onFinish={finish}
                    onFinishFailed={finishFailed}
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    autoComplete="off"
                    validateMessages={{
                        required: "Requerido",
                    }}
                    initialValues={{
                    }}>
                        <Form.Item
                            label="Licencia"
                            name="licencia_id"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Seleccione la licencia a asingar",
                                },
                            ]}>
                            <Select
                                rules={rules.requiredOnly}
                                showSearch
                                disabled={disableLic}
                                placeholder="Seleccione Licencia..."
                                loading={false}
                                optionFilterProp="children"
                            >
                                {licencias.map((nom) => (
                                    <Select.Option key={nom.id+1} value={nom.id}> {nom.clave} -  {nom.tipo}   </Select.Option>
                                ))}

                            </Select>
                            </Form.Item>
                            <Form.Item
                            label="Negocio Propietario: "
                            name="negocio_propietario_id"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Seleccione el negocio propietario de la licencia",
                                },
                            ]}
                        >
                            <Select
                                rules={rules.requiredOnly}
                                showSearch
                                disabled={disableProp}
                                placeholder="Seleccione el negocio dueño de la licencia"
                                optionFilterProp="children"
                            >
                             {negocios.map((nom) => (
                                    <Select.Option key={(nom.licencia_refrendar)} value={nom.id+'|'+nom.tipomodelo+'|'+nom.tramite_persona_id}>{nom.licencia_refrendar} - {nom.nombre_del_negocio} - {nom.rfc}
                                    </Select.Option>
                                ))}

                            </Select>
                            </Form.Item>
                            <Form.Item
                            label="Negocio Operador:"
                            name="negocio_operador_id"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Seleccione el negocio operador de la licencia",
                                },
                            ]}>
                            <Select
                                rules={rules.requiredOnly}
                                showSearch
                                disabled={disableOpe}
                                placeholder="Seleccione el negocio operador de la licencia"
                                optionFilterProp="children"
                                value={null}
                            >
                             {negociosSinLicencia.map((nom) => (
                                    <Select.Option key={nom.id+3} value={nom.id}>
                                        {nom.tramitePadre.id} -{nom.nombre_del_negocio} - {nom.persona_moral==null?nom.user.rfc:nom.persona_moral.rfc}    </Select.Option>
                                ))}
                            </Select>
                            </Form.Item>
                </Form>
                <div style={{ textAlign: "right" }}>
                    <Button
                        style={{marginRight: "2%"}}
                        type="secundary"
                        onClick={reable}
                        disabled={savingData}>
                            Limpiar
                        </Button>
                    <Button
                        type="primary"
                        onClick={_next}
                        disabled={savingData}>
                             Guardar
                    </Button>
                </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Ver Licencias Asignadas" key="item-2">
                <TablaDeRevisiones
                    data={licenciasNegocios}
                    filterNombrePro={filterNombrePro}
                    filterNombreOp={filterNombreOp}
                    filterLicencia={filterLicencia}
                />
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </div>
    );
}

