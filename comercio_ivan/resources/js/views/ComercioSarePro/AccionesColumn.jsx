import React from 'react'
import {
    Button,
    Popconfirm,
    Tag,
} from "antd";

export default function AccionesColumn({ negocio, validarNegocio }) {
    return (
        <>
            {negocio?.validado_por ? (
                <Tag style={{ width: "100%" }} color="green" >
                    {`Validado por ${negocio?.validador?.nombre}`}
                </Tag>
            ) : (
                window.user.role != "ComercioAdminVisor" ? (
                    <>
                        <Popconfirm
                            okText="Validar"
                            cancelText="Cancelar"
                            title="Esta acción no se puede deshacer"
                            onConfirm={() =>
                                validarNegocio(negocio.id)
                            }
                            onCancel={() => { }}
                        >
                            <Button>Validar negocio</Button>
                        </Popconfirm>
                        <br />
                    </>
                ) : null

            )}

            <Button
                type="primary"
                target="_blank"
                href={'/app/comercio-admin/negocio/' + negocio?.id}>
                VER DETALLES
            </Button>
        </>
    )
}
