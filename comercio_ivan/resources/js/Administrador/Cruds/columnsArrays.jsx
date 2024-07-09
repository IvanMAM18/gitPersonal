import {Checkbox, Input,Button,Popover,Table, Tag} from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';
import SioNoTag from "@/v2/components/SioNo";


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
const tipoSectorClasss = {
    'COMERCIO' :'green',
    'INDUSTRIA': 'blue',
    'SERVICIOS' : 'pink',
}

const tipoImpactoClasss = {
    'bajo_impacto' :'green',
    'mediano_alto_impacto': 'blue',
    'alto_impacto' : 'pink',
}
export const girosColumns = [
    {
        title: "Clave SCIAN",
        dataIndex: "clave_scian",
        key: "clave_scian",
        filterDropdown: (
            <div className="p-2">
                <Input placeholder="Buscar clave SCIAN" className="w-full" onChange={event => setData('clave_scian', event.target.value)} />
            </div>
        ),
    },
    {
        title: "Nombre",
        dataIndex: "nombre",
        key: "nombre",
        filterDropdown: (
            <div className="p-2">
                <Input placeholder="Buscar nombre" className="w-full" onChange={event => setData('nombre', event.target.value)} />
            </div>
        ),
    },
    // {
    //     title: "Descripcion",
    //     dataIndex: "descripcion",
    //     key: "descripcion",
    // },
    // {
    //     title: "Giro Recolección de Basura",
    //     dataIndex: "servicios_publicos",
    //     key: "servicios_publicos",
    //     render: (text, record) => (
    //         // console.log("giros record:", record)
    //         <span>{record.servicios_publicos.nombre.split(/[a-zA-Z]\) /)}</span>
    //     ),
    // },
    {
        title: "Tipo",
        dataIndex: "tipo",
        key: "tipo",
        filters: [
            { text: "Bajo Impacto", value: 'bajo_impacto' },
            { text: "Mediano alto impacto",value: 'mediano_alto_impacto' },
            { text: "Alto impacto", value: 'alto_impacto' },
            { text: "Restablecer", value: null},
        ],
        filterMultiple: false,
        render: (value, giro) => <Tag color={tipoImpactoClasss[value]}>{giro.nombre_impacto}</Tag>
    },
    {
        title: "Sector",
        dataIndex: "tipo_sector",
        key: "tipo_sector",
        filters: [
            { text: "SERVICIOS", value: 'SERVICIOS' },
            { text: "INDUSTRIA",value: 'INDUSTRIA' },
            { text: "COMERCIO", value: 'COMERCIO' },
            { text: "Restablecer", value: null},
        ],
        filterMultiple: false,
        render: (value) => <Tag color={tipoSectorClasss[value]}>{value}</Tag>
    },
    {
        title: "Cobro de Programa interno",
        dataIndex: "cobro_programa_interno",
        key: "cobro_programa_interno",
        filters: [
            { text: "SI", value: 'true' },
            { text: "NO", value: 'false' },
            { text: "Restablecer", value: null },
        ],
        filterMultiple: false,
        render: (value) => <SioNoTag valor={value} />
    },
    {
        title: "Certificado de medio ambiente",
        dataIndex: "certificado_medio_ambiente",
        key: "certificado_medio_ambiente",
        filters: [
            { text: "SI", value: 'true' },
            { text: "NO", value: 'false' },
            { text: "Restablecer", value: null },
        ],
        filterMultiple: false,
        render: (value) => <SioNoTag valor={value} />
    },
    {
        title: "Licencia de alcohol",
        dataIndex: "licencia_alcohol_giro_comercial",
        key: "licencia_alcohol_giro_comercial",
        filters: [
            { text: "SI", value: 'true' },
            { text: "NO", value: 'false' },
            { text: "Restablecer", value: null },
        ],
        filterMultiple: false,
        render: (value) => <SioNoTag valor={value} />
    },
];
