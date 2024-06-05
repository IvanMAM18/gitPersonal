import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {Form, Select, Button, notification} from "antd";
import RegistroPersona from './RegistroPersona';

function IniciarTramitePersona({catalogoTramite}) {
    const navigate = useNavigate();
    const [personasMorales, setPersonasMorales] = useState([]);
    const [form] = Form.useForm();
    const [personaForm] = Form.useForm();

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

                const {persona_moral: personaMoralId} = form.getFieldsValue();
                axios.post('/app/iniciar-tramite', {
                    catalogo_tramites_id: catalogoTramite.id,
                    datos_persona: datosPersona,
                    persona_moral_id: personaMoralId,
                }).then(response => {
                    console.log('crear-tramite response', {response});
                    navigate('/app/mis-tramites');
                }).catch(errors => {
                    if(errors?.response?.data?.message) {
                        notification.error({
                            duration: 3,
                            className: "error-notification",
                            message: "Registro de Persona Moral",
                            description: errors.response.data.message,
                        });
                    }
                });
            })
            .catch(error => console.error(error));
    };

    return (
        <div className="sare--container">
            <RegistroPersona form={personaForm}/>

            <Form
                form={form}
                onFinish={submitForm}
                >
                <Form.Item>
                    <Button type="primary" htmlType="submit">Iniciar</Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default IniciarTramitePersona;
