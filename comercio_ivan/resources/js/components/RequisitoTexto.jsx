import React, {useEffect, useState} from 'react';
import status from "../utils/statuses";
import { Spin, Table, Space, Tabs, Tag, Button, Divider, Modal, Timeline, Upload, Form, Input, message } from "antd";
import { CloudDownloadOutlined, EditOutlined } from "@ant-design/icons";

function RequisitoTexto({requisito, revisionStatus, estadoRevisionId, reload}) {
    const [modalVisible, setModalVisible] = useState(false); 
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage()

    const submitRequisito = () => {
        const valor = form.getFieldValue('valor');
        axios.post('/app/responder-requisito', {
            valor, 
            requisito_id: requisito.requisito.id, 
            estado_revision_id: estadoRevisionId
        }).then(response => {
            reload();
            messageApi.open({
                type: 'success',
                content: 'Requisito enviado con exito.',
            });
            cerrarModal();
        }).catch(error => console.error(error));
    };

    const abrirModal = () => {
        setModalVisible(true);
    };

    const cerrarModal = () => {
        setModalVisible(false);
    }

    return (
        <div>
            {contextHolder}
            <Button onClick={() => abrirModal()}>
                <EditOutlined />
                Editar
            </Button>
            <Modal 
                title="Editar requisito" 
                open={modalVisible} 
                onOk={() => submitRequisito()} 
                onCancel={() => cerrarModal()}
            >
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={() => submitRequisito()}
                >
                    <Form.Item 
                        name="valor"
                        label={requisito.requisito.nombre}
                        required
                        rules={[{required: true}]}
                        validateMessages={{
                            required: "Requerido",
                        }}
                    >
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default RequisitoTexto;