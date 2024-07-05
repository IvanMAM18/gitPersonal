import React from 'react';
import { Button, message, Popconfirm } from 'antd';
import axios from "axios";
import { EditFilled } from '@ant-design/icons';

export default function BotonUpdateField({negocioId,campoParaActualizar,nuevoValor,nombreParaMostrar}) {


    const confirm = (e) => {
        console.log(e);
        axios.patch(`/app/actualizar-campo-negocio/${negocioId}`,{
          field:campoParaActualizar,
          value:nuevoValor
        })
        .then(response => {
          console.log(response)
          message.success(nuevoValor === null ?"Campo eliminado correctamente":"Campo actializado correctamente");
        })
        .catch(error=>{
          message.error(nuevoValor === null ?"Error al eliminar campo":"Error al actualizar campo")
        })
        
      };
      const cancel = (e) => {
        console.log(e);
        //message.error('Click on No');
      };

      const popConfirmDescription = nuevoValor === null ? `Esta seguro de eliminar el campo ${nombreParaMostrar}` : `Esta seguro de actualizar el campo ${nombreParaMostrar}`
  return (
    <Popconfirm
    title={popConfirmDescription}
    onConfirm={confirm}
    onCancel={cancel}
    okText="Sí"
    cancelText="No"
    
  >
    <Button 
      size="small"
      icon={<EditFilled />}
      type="primary"/>
  </Popconfirm>
  )
}
