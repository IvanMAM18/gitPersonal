import React from "react";
import { Tag } from "antd";
import {
    InfoCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    RightOutlined,
    SendOutlined
} from "@ant-design/icons";

const recolecionStatus = {
    ENVIADO: "ENVIADO",
    PENDIENTE: "PENDIENTE",
    APROBADO: "APROBADO",
    VISTO_BUENO: "VISTO BUENO",
    RECHAZADO: "RECHAZADO",
    EN_REVISION: "EN REVISION",
    SIN_REVISION: "SIN_REVISION",
    SERVICIO_PRIVADO: "SERVICIO_PRIVADO",
    color (_status) {
        switch (_status) {
            case "PENDIENTE":
                return undefined;
            case "ENVIADO":
                return "volcano";
            case "APROBADO":
            case "SERVICIO_PRIVADO":
                return "green";
            case "VISTO BUENO":
                return "green";
            case "RECHAZADO":
                return "red";
            case "EN REVISION":
                return "blue";
        }
    },
    format(_status) {
        switch (_status) {
            case "PENDIENTE":
                return "Pendiente";
            case "ENVIADO":
                return "Enviado";
            case "APROBADO":
                return "Aprobado";
            case "SERVICIO_PRIVADO":
                return "Sector Privado";
            case "VISTO_BUENO":
                return "Visto bueno";
            case "RECHAZADO":
                return "Rechazado";
            case "EN REVISION":
                return "En revisión";
        }
    },
    iconoConColor(_status) {
        switch (_status) {
            case "PENDIENTE":
                return <InfoCircleOutlined className="timeline-clock-icon" />;
            case "ENVIADO":
                return (
                    <SendOutlined
                        style={{ color: "red" }}
                        className="timeline-clock-icon"
                    />
                );
            case "APROBADO":
                return (
                    <CheckCircleOutlined
                        style={{ color: "green" }}
                        className="timeline-clock-icon"
                    />
                );
            case "VISTO BUENO":
                return (
                    <CheckCircleOutlined
                        style={{ color: "green" }}
                        className="timeline-clock-icon"
                    />
                );
            case "SERVICIO_PRIVADO":
                return (
                    <CheckCircleOutlined
                        style={{ color: "green" }}
                        className="timeline-clock-icon"
                    />
                );
            case "RECHAZADO":
                return (
                    <CloseCircleOutlined
                        style={{ color: "red" }}
                        className="timeline-clock-icon"
                    />
                );
            case "EN REVISION":
                return (
                    <RightOutlined
                        style={{ color: "blue" }}
                        className="timeline-clock-icon"
                    />
                );
            default:
                return (
                    <RightOutlined
                        style={{ color: "blue" }}
                        className="timeline-clock-icon"
                    />
                );
        }
    },
    icono(_status) {
        switch (_status) {
            case "PENDIENTE":
                return <InfoCircleOutlined />;
            case "ENVIADO":
                return <RightOutlined />;
            case "APROBADO":
                return <CheckCircleOutlined />;
            case "VISTO BUENO":
                return <CheckCircleOutlined />;
            case "SERVICIO_PRIVADO":
                return <CheckCircleOutlined />;
            case "RECHAZADO":
                return <CloseCircleOutlined />;
            case "EN REVISION":
                return <RightOutlined />;
            default:
                return <RightOutlined />;
        }
    },
    tag(_status) {
        switch (_status) {
            case "diario":
                return <Tag color="cyan">DIARIO</Tag>;
            case "cuenta_propia":
                return <Tag color="magenta">CUENTA PROPIA</Tag>;
            case "servicio_privado":
                return <Tag color="green">SERVICIO PRIVADO</Tag>;
            case "2_veces_por_semana":
                return <Tag color="blue">2 VECES POR SEMANA</Tag>;
            case "3_veces_por_semana":
                return <Tag color="purple">3 VECES POR SEMANA</Tag>;
            case null:
                return <Tag color="volcano">N/A</Tag>;
        }
    },
    colorByDays(days) {
        if (days > 10) {
            return "red";
        }
        return "blue";
    },
};

export default recolecionStatus;
