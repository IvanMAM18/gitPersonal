import React, { useState, useEffect } from "react";
import { Button, Input, Form } from "antd";
import Notificacion from "../../components/Notificacion";
const email_regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function CrudPersonaFisica() {
    const [user, setUserData] = useState(null);
    const [notificationData, setNotificacionData] = useState({
        title: "Datos actualizados",
        description: "",
        open: false,
    });

    const getUserData = async () => {
        const response = await axios.get(
            `/app/get_user_data_by_id/${window?.user?.id ?? null}`
        );
        console.log({ response });
        setUserData(response?.data ?? null);
    };

    useEffect(() => {
        getUserData();
    }, []);

    const onFinish = (values) => {
        if (values?.password !== values?.confirm) {
            setNotificacionData({
                title: "Contraseñas no coinciden",
                description: "Las contraseñas no coinciden.",
                open: true,
                type: "warning",
                setNotificationData: setNotificacionData,
            });
            return;
        }
        Object.keys(values).map((key) =>
            typeof values[key] === "string" && key !== "email"
                ? (values[key] = values[key].toUpperCase())
                : values[key]
        );

        Object.keys(values).map((key) =>
            key === "email"
                ? (values[key] = values[key].toLowerCase())
                : values[key]
        );
        console.log("Success:", values);
        axios
            .post("/app/actualizar_usuario", values)
            .then((response) => {
                console.log(response);
                if (response?.data?.email_updated === 0) {
                    setNotificacionData({
                        title: "Datos actualizados",
                        description:
                            "Los datos se han actualizado correctamente.",
                        open: true,
                        type: "success",
                        setNotificationData: setNotificacionData,
                    });
                }
                if (response?.data?.email_updated === 1) {
                    setNotificacionData({
                        title: "Datos actualizados",
                        description:
                            "Los datos se han actualizado correctamente, se ha enviado un email de verificación, a la nueva dirección de correo electrónico.",
                        open: true,
                        type: "success",
                        setNotificationData: setNotificacionData,
                    });
                }
                if (response?.data?.email_updated === 3) {
                    setNotificacionData({
                        title: "Email en uso",
                        description:
                            "El correo que intento usar ya esta en uso.",
                        open: true,
                        type: "error",
                        setNotificationData: setNotificacionData,
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                setNotificacionData({
                    ...notificationData,
                    description: "Ha habido un error al actualizar los datos.",
                    open: true,
                    type: "error",
                    setNotificationData: setNotificacionData,
                });
            });
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    return (
        <div style={{ padding: 25, height: "100%", backgroundColor: "#fff" }}>
            <Notificacion {...notificationData} />
            {user && (
                <Form
                    name="crud-persona-fisica"
                    initialValues={{
                        user_id: user?.id ?? 0,
                        nombre: user?.nombre ?? "",
                        apellido_pat: user?.apellido_pat ?? "",
                        apellido_mot: user?.apellido_mot ?? "",
                        rfc: user?.rfc ?? "",
                        curp: user?.curp ?? "",
                        email: user?.email ?? "",
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    layout={"vertical"}
                >
                    <Form.Item label="ID" name="user_id" hidden>
                        <Input
                            style={{ textTransform: "uppercase" }}
                            disabled
                        />
                    </Form.Item>

                    <Form.Item
                        label="Nombre(s)"
                        name="nombre"
                        rules={[
                            { required: true, message: "Campo requerido!" },
                        ]}
                    >
                        <Input style={{ textTransform: "uppercase" }} />
                    </Form.Item>

                    <Form.Item
                        label="Primer Apellido"
                        name="apellido_pat"
                        rules={[
                            { required: true, message: "Campo requerido!" },
                        ]}
                    >
                        <Input style={{ textTransform: "uppercase" }} />
                    </Form.Item>
                    <Form.Item label="Segundo Apellido" name="apellido_mot">
                        <Input style={{ textTransform: "uppercase" }} />
                    </Form.Item>
                    <Form.Item
                        label="CURP"
                        name="curp"
                        rules={[
                            { disabled: true, message: "Campo requerido!" },
                        ]}
                        help={
                            "Si desea actualizar su CURP deberá presentarse en las oficinas del Ayuntamiento"
                        }
                    >
                        <Input
                            style={{ textTransform: "uppercase" }}
                            disabled
                        />
                    </Form.Item>
                    <Form.Item
                        label="RFC"
                        name="rfc"
                        rules={[{ disabled: true }]}
                        help={
                            "Si desea actualizar su RFC deberá presentarse en las oficinas del Ayuntamiento"
                        }
                    >
                        <Input
                            style={{ textTransform: "uppercase" }}
                            disabled
                        />
                    </Form.Item>
                    <Form.Item
                        label="Correo"
                        name="email"
                        rules={[
                            {
                                disabled: true,
                                pattern: email_regex,
                                required: true,
                                message: "Campo requerido!",
                            },
                        ]}
                        help={"Necesita verificación del correo"}
                    >
                        <Input style={{ textTransform: "uppercase" }} />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Contraseña"
                        rules={[
                            {
                                required: false,
                                message: "Por favor ingrese su contraseña!",
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="confirm"
                        label="Confirme Contraseña"
                        dependencies={["password"]}
                        hasFeedback
                        rules={[
                            {
                                required: false,
                                message: "Por favor confirme su contraseña!",
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue("password") === value
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error(
                                            "Las contraseñas no coinciden!"
                                        )
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Actualizar
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </div>
    );
}
