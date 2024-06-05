import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Divider, Space, notification } from 'antd';
import { WarningFilled } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
export default function ListaNegociosRefrendo({ negocios, negociosNoValidos, modalProps, setModalPros, resetModal }) {
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();
    const [refrendando, setRefrendando] = useState(false);
    const [checksProps, setChecksPros] = useState({
        refrendarTodos: true,
        checkedList: [],
        refrendarTodos: true,
        checkedList: []
    });
    const numberOfNegocios = negocios?.length;
    const indeterminate = checksProps?.checkedList?.length > 0 && checksProps?.checkedList?.length < numberOfNegocios;

    const onChangeNegociosCheckGroup = (checkedValues) => {
        setChecksPros({
            ...checksProps, refrendarTodos: checkedValues.length === numberOfNegocios,
            checkedList: checkedValues,
        });
    };

    const refrendarNegocios = () => {

        if(refrendando == true)
            return

        if (checksProps?.checkedList?.length === 0) {
            openNotification("warning", 'No se seleccionaron negocios', 'Por favor seleccione almenos un negocio.');
        } else {
            setRefrendando(true)
            axios.post("/app/crear_refrendos_para_año_en_curso", { negocio_ids: checksProps?.checkedList })
                .then(response => {
                    openNotification("success", "Creación de Refrendos", "Se han creado el refrendo de los negocios seleccionados.");
                })
                .catch(error => {
                    openNotification("error", "Creación de Refrendos", "Ha habido un error al crear los refrendos.");
                    setRefrendando(false)
                })
                .finally(() => {
                    resetModal();
                });
        }
    }

    const openNotification = (type, message, description) => {
        api[type]({
            message: message,
            description: description,
            duration: 5,
        });
    };

    useEffect(() => {
        if (negocios?.length > 0)
            setChecksPros({
                ...checksProps,
                checkedList: negocios?.map(negocio => negocio?.value),
            });
    }, [negocios]);

    return (
        <>
            {contextHolder}
            <Checkbox
                indeterminate={indeterminate}
                checked={checksProps.refrendarTodos}
                onChange={(e) => setChecksPros({
                    ...checksProps,
                    refrendarTodos: e.target.checked,
                    checkedList: e.target.checked ? negocios?.map(negocio => negocio?.value) : []
                })}>
                Refrendar todos los negocios
            </Checkbox>

            <Divider />

            <Checkbox.Group
                options={negocios}
                value={checksProps?.checkedList}
                onChange={onChangeNegociosCheckGroup}
                className="refrendar_negocios_check_group" />
            {
                negociosNoValidos.length > 0 && <>
                    <Divider />
                    <h5 style={{ marginBottom: 15 }}>Trámites con problemas en la clave catastral</h5>
                    {
                        negociosNoValidos.map(negocio => <div key={negocio.value}>
                            <strong>{negocio.label}:</strong> {negocio?.statusClaveCatastralMessage}
                        </div>)
                    }
                </>
            }
            {checksProps?.checkedList?.length === 0 && <>
                <Divider />
                <div style={{ display: "flex", alignItems: "center", height: 20 }}>
                    <WarningFilled style={{ color: "#faad14", fontSize: 18, marginRight: 10 }} />
                    <span style={{ fontSize: 16, lineHeight: 16 }}>No ha seleccionado ningún negocio</span>
                </div>
            </>}

            <Space direction={"horizontal"} size={"middle"} style={{ marginTop: 45, width: "100%", justifyContent: "space-between" }}>
                <Button key="back" onClick={() => { navigate(localStorage.tramite_link); }}>
                    Nuevo Negocio a Refrendar
                </Button>
                <Space direction={"horizontal"} size={"middle"} style={{ marginTop: 45, width: "100%", justifyContent: "flex-end" }}>
                    <Button key="back" onClick={() => { setModalPros({ ...modalProps, open: false }) }}>
                        Cancelar
                    </Button>
                    <Button key="submit"
                        type={"primary"}
                        loading={false}
                        onClick={() => { refrendarNegocios() }}
                        disabled={refrendando}
                    >
                        Refrendar
                    </Button>
                </Space>
            </Space>

        </>
    )
}
