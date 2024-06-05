import React, { useEffect, useState } from 'react';
import { Button, notification, Space } from 'antd';
import { validateClaveCatastralDeNegocios } from './Utils';
import LoadingIndicator from '../../../components/LoadingIndicator';

export default function RefrendoIndividualHeader({ negocio, setIsModelOpen, setActulizarDatos }) {

    const [api, contextHolder] = notification.useNotification();
    const [negocioAprobado, setNegocioAprobado] = useState(null);

    useEffect(() => {
        console.log({ negocio });
        axios
            .get("/app/get_comercio_token")
            .then((respuesta) => {
                const token = respuesta?.data?.token;
                validateClaveCatastralDeNegocios(token, setNegocioAprobado, negocio);
            })
            .catch((error) => {
                console.log({ error });
            });
    }, []);

    useEffect(() => {
        if (negocio !== null) {
            console.log({ negocio });
        }
    }, [negocio]);

    const refrendarNegocio = async () => {
        await axios.post("/app/crear_refrendos_para_año_en_curso", { negocio_ids: [negocio?.id] })
            .then(response => {
                openNotification("success", "Creación de Refrendos", "Se ha creado el refrendo del negocio, al debe volver a iniciar sesión para actualizar su comprobante de domicilio.");
            })
            .catch(error => {
                console.log({ error });
                openNotification("error", "Creación de Refrendos", "Ha habido un error al crear el refrendo.");
            })
            .finally(() => {
                setIsModelOpen(false);
            });
    };
    const openNotification = (type, message, description) => {
        api[type]({
            message: message,
            description: description,
            duration: 5,
        });
    };
    return (
        <>{contextHolder}
            {negocioAprobado !== null
                ? <div className='refrendo_header'>
                    {negocioAprobado?.pagoClaveCatastral
                        ? <h6>¿Desea realizar algún cambio en los datos del negocio?</h6>
                        : <h6>Hay un problema con el predio: {negocioAprobado?.statusClaveCatastralMessage}</h6>}
                    {negocioAprobado?.pagoClaveCatastral
                        && <Space size={"middle"}>
                            <Button type={"default"} onClick={() => setActulizarDatos(true)}>
                                Sí quiero realizar cambios
                            </Button>
                            <Button type={"primary"} onClick={() => refrendarNegocio()}>Refrendar</Button>
                        </Space>
                    }
                </div>
                : <Space direction={"horizontal"} align={"center"}>
                    <h6>Validando predio</h6>
                    <LoadingIndicator />
                </Space>}

        </>
    )
}
