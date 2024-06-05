import React from "react";
import { Tag } from "antd";
import {
    InfoCircleOutlined,
    LoginOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    RightOutlined,
    RightCircleOutlined,
    SendOutlined,
} from "@ant-design/icons";

const status = {
    ENVIADO: "ENVIADO",
    PENDIENTE: "PENDIENTE",
    APROBADO: "APROBADO",
    VISTO_BUENO: "VISTO BUENO",
    RECHAZADO: "RECHAZADO",
    EN_REVISION: "EN REVISION",
    SIN_REVISION: "SIN_REVISION",
    VISOR: "VISOR",
    color(_status) {
        switch (_status) {
            case "PENDIENTE":
                return undefined;
            case "ENVIADO":
                return "volcano";
            case "APROBADO":
            case "VISOR":
                return "green";
            case "VISTO BUENO":
                return "green";
            case "VISOR":
                return "green";
            case "RECHAZADO":
                return "red";
            case "EN REVISION":
                return "blue";
            case "VIGENTE":
                return "green";
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
            case "VISOR":
                return "Visor";
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
            case "VISOR":
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
            case "VISOR":
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
            case "PENDIENTE":
                return <Tag>REVISIÓN PENDIENTE</Tag>;
            case "ENVIADO":
                return <Tag color="volcano">ENVIADO</Tag>;
            case "APROBADO":
                return <Tag color="green">VISTO BUENO</Tag>;
            case "APROBADO_DN":
                return <Tag color="blue">APROBADO</Tag>;
            case "VISTO BUENO":
                return <Tag color="green">VISTO BUENO</Tag>;
            case "VISOR":
                return <Tag color="green">VISOR</Tag>;
            case "RECHAZADO":
                return <Tag color="red">RECHAZADO</Tag>;
            case "EN REVISION":
                return <Tag color="blue">EN REVISION</Tag>;
            case "VIGENTE":
                return <Tag color="green">VIGENTE</Tag>;
        }
    },
    colorByDays(days) {
        if (days > 10) {
            return "red";
        }
        return "blue";
    },
};

export default status;
