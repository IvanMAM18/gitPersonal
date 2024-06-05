import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Select, Button, InputNumber, Input, Divider, Radio, Alert, message } from "antd";

import { UploadOutlined, PushpinOutlined } from "@ant-design/icons";

import RegistroPersona from './RegistroPersona';
import Upload from "antd/lib/upload/Upload";

function IniciarRefrendoLicenciaAlcohol() {
    const navigate = useNavigate();
    const [personasMorales, setPersonasMorales] = useState([]);
    const [form] = Form.useForm();
    const [personaForm] = Form.useForm();
    const [numeroLicencias, setNumeroDeLicencias] = useState(1);
    const [requisitosLicencias, setRequisitosLicencias] = useState([
        {numero: '', direccion_operador: '', nombre_operador: ''}
    ]);
    const [requisitosLicenciasFormato, setRequisitosLicenciasFormato] = useState([]);
    const [tipoDeCarga, setTipoDeCarga] = useState('');

    const requisitoDefault = {numero: '', direccion_operador: '', nombre_operador: ''};

    useEffect(() => {
        loadPersonasMorales();
    }, [])

    const loadPersonasMorales = () => {
        axios.get('/app/personas-morales')
            .then((response) => {
                if(!response.data) {
                    console.error('Error al cargar personas morales');
                    return;
                }
                // console.log({personas_morales: response.data});
                setPersonasMorales(response.data);
            })
            .catch((error) => console.error(error));
    };

    const submitForm = () => {
        personaForm.validateFields()
            .then(values => {
                const datosPersona = values;

                datosPersona.acta_constitutiva = datosPersona.acta_constitutiva &&
                    datosPersona.acta_constitutiva.length > 0 ?
                    datosPersona.acta_constitutiva[0].response : null;

                const requisitos = tipoDeCarga == 'manual'
                    ? requisitosLicencias.slice(0,numeroLicencias)
                    : requisitosLicenciasFormato;

                const numeroDeLicencias = tipoDeCarga == 'manual'
                    ? numeroLicencias
                    : requisitosLicenciasFormato.length;

                const {persona_moral: personaMoralId} = form.getFieldsValue();
                axios.post('/app/iniciar-tramite/refrendo-de-licencia-de-alcoholes', {
                    datos_persona: datosPersona,
                    persona_moral_id: personaMoralId,
                    numero_de_licencias: numeroDeLicencias,
                    requisitos: requisitos,
                }).then(response => {
                    console.log('crear-tramite response', {response});
                    navigate('/app/mis-tramites');
                }).catch(error => {console.error(error)
                    message.error(
                        `El RFC  se encuentra vinculado a otra Persona Moral, favor de corroborar`
                    );
                    return;}
                 );
            })
            .catch(error => console.error(error));
    };

    const onNumeroLicenciasChange = (value) => {
        setNumeroDeLicencias(value);
        let _requisitosLicencias = [...requisitosLicencias];
        while(value > _requisitosLicencias.length) {
            _requisitosLicencias = [..._requisitosLicencias, {...requisitoDefault}];
        }
        setRequisitosLicencias(_requisitosLicencias);
    };

    const setRequisito = (key, index, value) => {
        const _requisitosLicencias = requisitosLicencias;
        _requisitosLicencias[index][key] = value;
        setRequisitosLicencias(_requisitosLicencias);
    };

    const cargaFormatoCompletada = ({file, fileList, event}) => {
        if(!file.response) {
            setRequisitosLicenciasFormato([]);
            return;
        }
        if(!file.response.length || file.response[0][0] != 'Número de licencia') {
            message.error(
                `Verifica el formato del archivo cargado, la primera fila debe contener las cabeceras del formato descargado.`
            );
            return;
        }
        const requisitos = file.response.slice(1).map(row => ({
            numero: row[0],
            nombre_operador: row[1],
            direccion_operador: row[2],
        }));
        setRequisitosLicenciasFormato(requisitos);
    }

    return (
        <div className="sare--container">
            <h1>Tramite: Refrendo de Licencia de Alcoholes</h1>

            <Divider/>

            <RegistroPersona form={personaForm}/>

            <Divider orientation="left">Datos del tramite</Divider>

            <Form
                form={form}
                onFinish={submitForm}
                >
                <Form.Item
                    label="Método de carga de información para licencias"
                    name="tipo_carga"
                    rules={[
                        {
                            required: true,
                            message:
                                "Seleccione un valor para el tipo de carga",
                        },
                    ]}>
                    <Radio.Group
                        onChange={(e) => {
                            setTipoDeCarga(e.target.value);
                        }}
                        value={tipoDeCarga}
                        initialValue="manual"
                    >
                        <Radio value="manual" defaultChecked>Manual</Radio>
                        <Radio value="archivo">Archivo</Radio>
                    </Radio.Group>
                </Form.Item>
                {
                    tipoDeCarga == 'manual' && (<>
                    <Divider orientation="left">Carga manual</Divider>
                    <Form.Item
                        label="Cantidad de licencias a refrendar"
                        >
                        <InputNumber min={1} max={20} defaultValue={1} onChange={onNumeroLicenciasChange} />
                    </Form.Item>
                    {
                        requisitosLicencias.slice(0,numeroLicencias).map((requisitos, index) => (
                            <React.Fragment key={'requisito'+index}>
                                <Divider>Licencia {index + 1}</Divider>
                                <Form.Item
                                    label="Número de licencia"

                                    >
                                    <Input
                                        defaultValue={requisitos.numero} required
                                        onChange={(e) => setRequisito('numero', index, e.target.value)}/>
                                </Form.Item>
                                <Form.Item
                                    label="Nombre del operador"
                                    >
                                    <Input
                                        defaultValue={requisitos.nombre_operador}
                                        onChange={(e) => setRequisito('nombre_operador', index, e.target.value)}/>
                                </Form.Item>
                                <Form.Item
                                    label="Dirección del operador"
                                    >
                                    <Input
                                        defaultValue={requisitos.direccion_operador}
                                        onChange={(e) => setRequisito('direccion_operador', index, e.target.value)}/>
                                </Form.Item>
                            </React.Fragment>
                        ))
                    }
                    </>)
                }
                {
                    tipoDeCarga == 'archivo' && (<>
                        <Divider orientation="left">Carga por archivo</Divider>
                        <Form.Item>
                            <Alert
                                showIcon
                                type="warning"
                                message="Carga por achivo"
                                description="Carga multiples licencias a través de un archivo de hoja de datos (Excel). Descarga el formato, llena las columnas y subelo para continuar."
                                action={
                                    <a href="/Formatos/Formato%20Refrendo%20Licencia%20Alcoholes.xlsx">Descargar Formato</a>
                                }
                            />
                        </Form.Item>
                        <Form.Item
                            label="Cargar datos de licencias con archivo"
                            >
                            <Upload
                                accept="application/xls,application/xlsx"
                                name="licencias"
                                action="/app/importar/licencias-alcoholes"
                                data={{ _token: document.head.querySelector('meta[name="csrf-token"]').content , filename: "licencias"}}
                                showUploadList={{
                                    showPreviewIcon: false,
                                    showDownloadIcon: false,
                                    showRemoveIcon: false
                                }}
                                onChange={cargaFormatoCompletada}
                            >
                                <Button icon={<UploadOutlined />}>
                                    Da click para cargar
                                </Button>
                            </Upload>
                        </Form.Item>
                        {
                            requisitosLicenciasFormato.map((requisitos, index) => (
                                <React.Fragment key={'requisitoFormato' + index}>
                                    <Divider>Licencia {index + 1}</Divider>
                                    <Form.Item
                                        label="Número de licencia"
                                        >
                                        <Input
                                            defaultValue={requisitos.numero}
                                            disabled/>
                                    </Form.Item>
                                    <Form.Item
                                        label="Nombre del operador"
                                        >
                                        <Input
                                            defaultValue={requisitos.nombre_operador}
                                            disabled/>
                                    </Form.Item>
                                    <Form.Item
                                        label="Dirección del operador"
                                        >
                                        <Input
                                            defaultValue={requisitos.direccion_operador}
                                            disabled/>
                                    </Form.Item>
                                </React.Fragment>
                            ))
                        }
                    </>)
                }
                <Form.Item>
                    <Button type="primary" htmlType="submit">Iniciar</Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default IniciarRefrendoLicenciaAlcohol;
