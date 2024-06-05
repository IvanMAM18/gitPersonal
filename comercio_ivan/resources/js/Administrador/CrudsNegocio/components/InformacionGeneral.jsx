import React, { useState, useEffect } from "react";
import catalogoRegimenFiscal from "../../../utils/regimenFiscalList";
import { regimenes_capital } from "../../../utils/ListaRegimenesCapital";
import Notificacion from "../../../components/Notificacion";
import { Button, Form, Input, Select, Space, Tabs } from "antd";

const { Option } = Select;

export default function InformacionGeneral({ personaMoral, setShowModal }) {
    const formRef = React.useRef(null);
    const [notificationData, setNotificacionData] = useState({
        title: "Datos actualizados",
        description: "",
        open: false,
    });
    const [_personaMoral, setPersonaMoral] = useState(personaMoral);
    const [regimenFiscalList] = useState(
        catalogoRegimenFiscal.filter(
            (regimenFiscal) => regimenFiscal?.persona_moral === true
        )
    );
    const [regimenCapitalList] = useState(regimenes_capital);

    useEffect(() => {
        console.log({ _personaMoral });
    }, [_personaMoral]);

    const onFinish = (values) => {
        Object.keys(values).forEach((key) => {
            if (typeof values[key] === "string") {
                values[key] = values[key].toUpperCase();
            }
        });
        console.log(values);
        const personaMoraltoSave = {
            ...values,
            id: _personaMoral?.id ?? 0,
        };
        axios
            .post("/app/actualizar_persona_moral", personaMoraltoSave)
            .then((response) => {
                console.log({ response });
                setNotificacionData({
                    title: "Actualización de datos generales.",
                    description: "Actualización de datos exitosa.",
                    open: true,
                    type: "success",
                    setNotificationData: setNotificacionData,
                });
                setPersonaMoral(response?.data ?? personaMoral);
            })
            .catch((error) => {
                console.log(error);
                setNotificacionData({
                    title: "Actualización de datos generales.",
                    description: "Ha habido un erro al actualizar los datos.",
                    open: true,
                    type: "error",
                    setNotificationData: setNotificacionData,
                });
            });
    };

    const getRegimenFiscalSelectOptions = () =>
        regimenFiscalList?.map((regimenFiscal) => (
            <Option
                value={regimenFiscal?.id}
                key={regimenFiscal?.id ?? Math.random()}
            >
                {regimenFiscal?.name}
            </Option>
        )) ?? <></>;

    const getRegimenCapitalSelectOptions = () =>
        regimenCapitalList?.map((regimenCapital) => (
            <Option
                value={regimenCapital?.id}
                key={regimenCapital?.id ?? Math.random()}
            >
                {`${regimenCapital?.id} - ${regimenCapital?.name}`}
            </Option>
        )) ?? <></>;
    return (
        <>
            <Notificacion {...notificationData} />
            <Form
                key={Math.random()}
                layout={"vertical"}
                ref={formRef}
                name="persona_moral"
                onFinish={onFinish}
                initialValues={{
                    razon_social: _personaMoral?.razon_social ?? null,
                    regimen_fiscal: _personaMoral?.regimen_fiscal ?? null,
                    regimen_capital: _personaMoral?.regimen_capital ?? null,
                }}
            >
                <Form.Item
                    name="razon_social"
                    label="Razón social"
                    rules={[
                        {
                            required: true,
                            message: "Este campo es requerido!",
                        },
                    ]}
                >
                    <Input style={{ textTransform: "uppercase" }} />
                </Form.Item>
                <Form.Item
                    name="regimen_fiscal"
                    label="Régimen fiscal"
                    rules={[
                        {
                            required: true,
                            message: "Este campo es requerido!",
                        },
                    ]}
                >
                    <Select
                        placeholder="Seleccione un régimen fiscal"
                        allowClear
                    >
                        {getRegimenFiscalSelectOptions()}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="regimen_capital"
                    label="Régimen de capital"
                    rules={[
                        {
                            required: true,
                            message: "Este campo es requerido!",
                        },
                    ]}
                >
                    <Select
                        placeholder="Seleccione un régimen de capital"
                        allowClear
                    >
                        {getRegimenCapitalSelectOptions()}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Space
                        direction={"horizontal"}
                        align={"end"}
                        style={{
                            justifyContent: "flex-end",
                            display: "flex",
                        }}
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            key={"guardar"}
                        >
                            Guardar
                        </Button>
                        <Button
                            onClick={() => setShowModal(false)}
                            key={"cerrar"}
                        >
                            Cerrar
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </>
    );
}
