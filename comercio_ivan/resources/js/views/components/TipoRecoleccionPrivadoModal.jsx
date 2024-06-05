import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, Radio } from 'antd';
import axios from 'axios';

const { Option } = Select;

const TipoRecoleccionPrivadoModal = ({ visible, onCancel, onSubmit, negocio, year }) => {
  const [form] = Form.useForm();
  const [radioValue, setRadioValue] = useState(''); // Valor predeterminado
  const [SelectData, setSelectData] = useState([]); // Valor predeterminado

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
  const loadItems = async () => {
    const añoActual = new Date().getFullYear();
    if(year==añoActual-1)
    {
      await axios.post('/app/catalogo-servicio-privado-recoleccion-basura' , {
      tramite_pasado:true
    })
      .then(response => {
        console.log(response.data);
        setSelectData(response.data);
      });
    }
    else
    {
      await axios.post('/app/catalogo-servicio-privado-recoleccion-basura', {
        tramite_pasado:false
      })
        .then(response => {
          console.log(response.data);
          setSelectData(response.data);
        });
    }
  };
  const handleRadioChange = (e) => {
    setRadioValue(e.target.value);
    loadItems();
  };

  return (
    <Modal
      visible={visible}
      title="Cambio de Servicio de Público a Privado"
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
      <Form.Item label="" name="privado_o_propia" rules={[{ required: true, message: 'Seleccione una opción' }]}>
          <Radio.Group onChange={handleRadioChange}>
            <Radio value="cuenta_propia">Tiro la basura por mi cuenta en el relleno sanitario</Radio>
            <Radio value="servicio_privado">Contrato de recolección de basura privado</Radio>
          </Radio.Group>
        </Form.Item>
        {radioValue === 'servicio_privado' && (
          <Form.Item label="Seleccione una opción" name="empresa" rules={[{ required: true, message: 'Seleccione una opción' }]}>
            <Select
              showSearch  // Agregar esta propiedad para habilitar la búsqueda
              options={SelectData}  // Pasar las opciones al componente
              optionFilterProp="children"  // Especificar qué propiedad se utiliza para filtrar las opciones
              filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0

            }>
              {/* <Option value="Recolectora ambiental y servicios integrales">Recolectora ambiental y servicios integrales</Option>
              <Option value="Ecología y movimiento">Ecología y movimiento</Option>
              <Option value="Servicios Ecológicos Californias">Servicios Ecológicos Californias</Option>
              <Option value="Servicios Blanco (SARRS)">Servicios Blanco (SARRS)</Option>
              <Option value="ECOERIBE">ECOERIBE</Option>
              <Option value="King Kong">King Kong</Option>
              <Option value="ECO TRASH SERVICIOS">ECO TRASH SERVICIOS</Option>
              <Option value="SERVICIO DE RECOLECCIÓN DE BASURA CARBALLO">SERVICIO DE RECOLECCIÓN DE BASURA CARBALLO</Option>
              <Option value="ANTONIO ESPINOZA CAMACHO">ANTONIO ESPINOZA CAMACHO</Option>
              <Option value="VANILU">VANILU</Option>
              <Option value="SERVICIOS MEMIN">SERVICIOS MEMIN</Option>
              <Option value="RECOLECTO">RECOLECTO</Option>
              <Option value="Contrato con Plaza comercial (La plaza paga la recolección)">Contrato con Plaza comercial (La plaza paga la recolección)</Option> */}
            </Select>
          </Form.Item>
        )}
        
      </Form>
    </Modal>
  );
};

export default TipoRecoleccionPrivadoModal;
