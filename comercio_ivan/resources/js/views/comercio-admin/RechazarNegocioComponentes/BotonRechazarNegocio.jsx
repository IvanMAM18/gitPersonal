import React from 'react';
import {Button,Popconfirm} from "antd";
import status from "@/utils/statuses";

const BotonRechazarNegocio = ({enviarRevision}) => {
  return (
    <>
        {
            window.user.role === "ComercioDirector" && window.user.entidad_revision === 5 &&
            <Popconfirm
                title="Desea rechazar el negocio?"
                onConfirm={()=>enviarRevision(status.RECHAZADO)}
                okText="Sí"
                cancelText="No"
            >
                <Button type={"primary"}>
                    Rechazar
                </Button>
            </Popconfirm>
        }
    </>
  )
}
export default BotonRechazarNegocio;