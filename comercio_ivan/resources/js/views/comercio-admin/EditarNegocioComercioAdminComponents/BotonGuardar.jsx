import React from 'react';

import { Button, Popconfirm } from "antd";

export default function BotonGuardar({ confirm, cancel, savingData }) {
    return (
        <div style={{ textAlign: "right" }}>
            <Popconfirm
                title="¿Realmente desea modificar el tamaño y desvincular los avisos (Protección Civil y Servicios Públicos) en caso de estar generados?"
                description="Actualización"
                onConfirm={confirm}
                onCancel={cancel}
                okText="Si"
                cancelText="No"
            >
                <Button
                    type="primary"

                    disabled={savingData}>
                    Guardar
                </Button>
            </Popconfirm>
        </div>
    )
}
