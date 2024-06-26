import { Tag } from "antd";

export const tramitesColumns = [
    {
        title: "Nombre",
        dataIndex: "nombre",
        key: "nombre",
    },
    {
        title: "Descripción",
        dataIndex: "descripcion",
        key: "descripcion",
    },
    {
        title: "Enlace",
        dataIndex: "link",
        key: "link",
    },
    {
        title: "Pago",
        dataIndex: "pago",
        key: "pago",
        render: (text, record) => <Tag>{record?.pago ? "Sí" : "No"}</Tag>,
    },
    {
        title: "Resolutivo",
        dataIndex: "resolutivo",
        key: "resolutivo",
        render: (text, record) => <Tag>{record?.resolutivo ? "Sí" : "No"}</Tag>,
    },
    {
        title: "Tipo",
        dataIndex: "tipo",
        key: "tipo",
        render: (text, record) => <Tag>{record?.tipo?.toUpperCase()}</Tag>,
    },
    {
        title: "En línea",
        dataIndex: "en_linea",
        key: "en_linea",
        render: (text, record) => <Tag>{record?.en_linea ? "Sí" : "No"}</Tag>,
    },
];
export const girosColumns = [
    {
        title: "Nombre",
        dataIndex: "nombre",
        key: "nombre",
    },
    // {
    //     title: "Descripcion",
    //     dataIndex: "descripcion",
    //     key: "descripcion",
    // },
    {
        title: "Giro Recolección de Basura",
        dataIndex: "servicios_publicos",
        key: "servicios_publicos",
        render: (text, record) => (
            // console.log("giros record:", record)
            <span>{record.servicios_publicos.nombre.split(/[a-zA-Z]\) /)}</span>
        ),
    },
    {
        title: "Clave SCIAN",
        dataIndex: "clave_scian",
        key: "clave_scian",
    },
    {
        title: "Tipo",
        dataIndex: "tipo",
        key: "tipo",
        render: (text, record) => (
            <Tag>{record?.tipo?.replace(/\_/g, " ").toUpperCase()}</Tag>
        ),
    },
    {
        title: "Sector",
        dataIndex: "tipo_sector",
        key: "tipo_sector",
        render: (text, record) => (
            <Tag>{record.tipo_sector}</Tag>
        ),
    },
    {
        title: "Cobro de Programa interno",
        dataIndex: "cobro_programa_interno",
        key: "cobro_programa_interno",
        render: (text, record) => (
            <Tag>{record.cobro_programa_interno}</Tag>
        ),
    },
    {
        title: "Certificado de medio ambiente",
        dataIndex: "certificado_medio_ambiente",
        key: "certificado_medio_ambiente",
        render: (text, record) => (
            <Tag>{record.certificado_medio_ambiente}</Tag>
        ),
    },
    {
        title: "Licencia de alcohol",
        dataIndex: "licencia_alcohol_giro_comercial",
        key: "licencia_alcohol_giro_comercial",
        render: (text, record) => (
            <Tag>{record.licencia_alcohol_giro_comercial}</Tag>
        ),
    },
];
