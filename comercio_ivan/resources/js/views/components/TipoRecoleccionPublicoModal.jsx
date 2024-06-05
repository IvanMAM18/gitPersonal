import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Radio } from 'antd';

const { Option } = Select;

const TipoRecoleccionPublicoModal = ({ visible, onCancel, onSubmit, negocio }) => {
  const [form] = Form.useForm();
  const [radioVolumen, setVolumen] = useState();
  const [radioPeriodo, setPeriodo] = useState();
  const [uma, setUma] = useState();
  const [clasificacion, setClasificacion] = useState();
  

  useEffect(() => {
    // Calcula el nuevo valor de UMA en función de radioPeriodo y radioVolumen
    if (radioPeriodo !== undefined && radioVolumen !== undefined && radioPeriodo !== null && radioVolumen !== null) {
      axios
        .post("/app/get-uma-recoleccion", {
            negocio_id: negocio.id,
            periodo: radioPeriodo,
            volumen: radioVolumen,
        })
        .then((respuesta) => {
            console.log(respuesta?.data.valor_uma);
            setUma(respuesta?.data.valor_uma);
            setClasificacion(respuesta?.data.clasificacion);
            form.setFieldsValue({ tarifa_recoleccion_id: respuesta?.data.id });
            // setRecoleccionBasura(respuesta?.data[0] ?? null);
        })
        .catch((error) => console.log(error));
      console.log(negocio.id)
    

    

    }
  }, [radioPeriodo, radioVolumen]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    });
  };

  const handleRadioVolumenChange = (e) => {
    setVolumen(e.target.value);
  };

  const handleRadioPeriodoChange = (e) => {
    setPeriodo(e.target.value);
  };

  return (
    <Modal
      visible={visible}
      title="Cambio de Servicio de Privado a Público"
      onCancel={handleCancel}
      width={"40%"}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Guardar
        </Button>,
      ]}
    >
      <Form form={form}>
        <Form.Item label="Volumen" name="volumen" rules={[{ required: true, message: 'Seleccione un volumen' }]}>
          <Radio.Group
            onChange={handleRadioVolumenChange}
            style={{ textAlign: "right" }}
          >
            <Radio value={"Bajo"} >
              Bajo
            </Radio>
            <Radio value={"Medio"} >
              Medio
            </Radio>
            <Radio value={"Alto"} >
              Alto
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Periodo" name="periodo" rules={[{ required: true, message: 'Seleccione un periodo' }]}>
          <Radio.Group
            onChange={handleRadioPeriodoChange}
            style={{ textAlign: "right" }}
          >
            <Radio value={"2 veces por semana"} >
              2 veces por semana
            </Radio>
            <Radio value={"3 veces por semana"} >
              3 veces por semana
            </Radio>
            <Radio value={"Diario"} >
              Diario
            </Radio>
          </Radio.Group>
        </Form.Item>
        
        {radioPeriodo !== null &&
          radioPeriodo !== undefined &&
          radioVolumen !== null &&
          radioVolumen !== undefined && (
            <>
              <Form.Item label="UMA" >
                <Input value={uma} readOnly />
              </Form.Item>
              <Form.Item label="Clasificación:" >
                <Input value={clasificacion} readOnly />
              </Form.Item>
              <Form.Item name="tarifa_recoleccion_id" initialValue={uma} style={{ display: 'none' }}>
                <Input type="hidden" />
              </Form.Item>
            </>

        )}
      </Form>
    </Modal>
  );
};

export default TipoRecoleccionPublicoModal;
