import React, {useEffect, useState} from 'react';
import status from "../../../utils/statuses";
import { Spin, Table, Space, Tabs, Tag, Button, Divider, Modal, Timeline, Upload, Checkbox } from "antd";
import { CloudDownloadOutlined, UploadOutlined } from "@ant-design/icons";

function RequisitoTextoListItem({requisito, onRequisitoRechazado})
{
    if(!requisito)
        return (<></>);

    const respuestaRequisito = requisito;
    const tipoRequisito = requisito.requisito; 
    const requisitoAprobado = requisito.status == status.APROBADO;
    const requisitoRechazado = requisito.status == status.RECHAZADO;

    const _onRequisitoRechazado = (e) => {
        if(typeof onRequisitoRechazado !== 'function')
            return;

        onRequisitoRechazado({
            id: requisito.id,
            rechazado: e.target.checked
        });
    }

    return (
        <div className="sare--list-item">
            <span>{respuestaRequisito ? respuestaRequisito.valor : ''}</span>
            <Tag color={status.color(requisito.status)}>{requisito.status}</Tag>
            <h6>{tipoRequisito.nombre}</h6>
            { requisitoAprobado || requisitoRechazado 
                ? '-' 
                : <Checkbox onChange={_onRequisitoRechazado}>Rechazar</Checkbox> 
            }
        </div>
    );
}

export default RequisitoTextoListItem;