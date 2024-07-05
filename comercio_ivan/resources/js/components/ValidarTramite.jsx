import {Button, message, Popconfirm, Tag} from "antd";
import React, {useState} from "react";
import axios from "axios";

function ValidarNegocio({tramite, onValidated}) {

    const [isSubmitting, setIsSubmitting] = useState(false)

    function validarNegocio(tramite) {
        setIsSubmitting(true)
        axios.post(`/app/comercio-admin/tramite/${tramite.id}/validar`)
            .then(response => {
                message.success("Negocio Validado");
                setIsSubmitting(false)
                onValidated();
            })
            .catch(errors => {
                console.log(errors.response.data)
                setIsSubmitting(false)
            })
    }

return (
    <>
        {tramite.tramitable.validado_por ? (
            <Tag
                className="w-full"
                color="green"
            >
                Validado por{" "}
                {tramite.tramitable.validador.nombre}
            </Tag>
        ) : (
            window.user.role != "ComercioAdminVisor" ? (

                <Popconfirm
                    okText="Validar"
                    cancelText="Cancelar"
                    title="Esta acción no se puede deshacer"
                    onConfirm={() =>
                        validarNegocio(tramite)
                    }
                    onCancel={() => { }}
                >
                    <Button loading={isSubmitting}
                            disabled={isSubmitting}>
                        Validar Negocio
                    </Button>

                </Popconfirm>

            ) : null

        )}
    </>
)
}

export default ValidarNegocio;
