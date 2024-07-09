import {Checkbox, Input,Button,Popover,Table, Tag} from "antd";
import React, {useEffect, useState} from "react";
import SioNoTag from "@/v2/components/SioNo";
import { InfoCircleOutlined } from '@ant-design/icons';
import {debounce, pickBy} from "lodash";

// Estados inicial de los filtros
const INITIAL_STATE_FILTERS = {
    nombre: '',
    clave_scian: '',
    descripcion: '',
    impacto: null,
    sector: null,
    vende_alchol: null,
    programa_interno: null,
    vende_alcohol: null,
    page: 1,
    per_page: 10,
}

// Estado inicial del paginador
const INITIAL_PAGINATOR = {
    data: [],
    total: 0,
    page: 1,
    perPage: 50,
}

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

export default function ListaDeGirosComerciales(){

    const [isLoading, setIsLoading] = useState(false)
    const [filters, setFilters] = useState(INITIAL_STATE_FILTERS)
    const [paginador, setPaginador] = useState(INITIAL_PAGINATOR)

    useEffect(() => fetchGirosComerciales(), [filters])

    const [showPopover, setShowPopover] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const handleButtonClick = (nombre) => {
        setSelectedRecord(nombre);
        setShowPopover(!showPopover);
    };

    const fetchGirosComerciales = debounce(() => {
        setIsLoading(true)
        axios.get(`/v2/api/giros-comerciales`, {
            params: pickBy(filters)
        })
            .then(response => {
                setPaginador(response.data)
                setIsLoading(false)
            })
            .catch(errors => {
                console.log(errors)
                setIsLoading(false)
            })
    }, 500)

    const onTableChange = (event, tableFilters) => {
        if (tableFilters['nombre']){
            setData('nombre', tableFilters['nombre'][0])
        }
        if (tableFilters['tipo']){
            setData('impacto', tableFilters['tipo'][0])
        }
        if (tableFilters['tipo_sector']){
            setData('sector', tableFilters['tipo_sector'][0])
        }
        if (tableFilters['cobro_programa_interno']){
            console.log(tableFilters['cobro_programa_interno'][0]);
            setData('programa_interno', tableFilters['cobro_programa_interno'][0])
        }
        if (tableFilters['certificado_medio_ambiente']){
            setData('medio_ambiente', tableFilters['certificado_medio_ambiente'][0])
        }
        if (tableFilters['licencia_alcohol_giro_comercial']){
            setData('vende_alcohol', tableFilters['licencia_alcohol_giro_comercial'][0])
        }

        setData('page', event.current)
        setData('per_page', event.pageSize)
    }

    const setData =(property, value) => {
        setFilters(prevFilters => {
            return {
                ...prevFilters,
                [property]: value
            };
        })
    }

    const columns = [
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
            render: (text, record) => {
                return (
                    <span> 
                        {text}
                        <Popover
                            content={selectedRecord === record.nombre && (
                                <div className="w-96 text-justify">
                                    <span className="text-red-800 text-lg">Descripcion:</span>
                                    <br/>
                                    {record.descripcion}
                                </div>
                            )}
                            visible={showPopover}
                            placement="right"
                        >
                            <Button
                            type="text"
                            title="Descripcion"
                            icon={<InfoCircleOutlined style={{ color:'red'}}/>}
                            onClick={() => handleButtonClick(record.nombre)}
                            />
                        </Popover>
                    </span>
                  );
              },
        },
        {
            title: "Tipo de impacto",
            dataIndex: "tipo",
            key: "tipo",
            width: 200,
            filters: [
                { text: "Bajo Impacto", value: 'bajo_impacto' },
                { text: "Mediano alto impacto",value: 'mediano_alto_impacto' },
                { text: "Alto impacto", value: 'alto_impacto' },
                { text: "Reiniciar", value: null},
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
                { text: "Reiniciar", value: null},
            ],
            filterMultiple: false,
            render: (value) => <Tag color={tipoSectorClasss[value]}>{value}</Tag>
        },
        {
            title: "Cobro de Programa interno",
            dataIndex: "cobro_programa_interno",
            key: "cobro_programa_interno",
            width: 80,
            filters: [
                { text: "SI", value: 'true' },
                { text: "NO", value: 'false' },
                { text: "Reiniciar", value: null },
            ],
            filterMultiple: false,
            render: (value) => <SioNoTag valor={value} />
        },
        {
            title: "Certificado de medio ambiente",
            dataIndex: "certificado_medio_ambiente",
            key: "certificado_medio_ambiente",
            width: 80,
            filters: [
                { text: "SI", value: 'true' },
                { text: "NO", value: 'false' },
                { text: "Reiniciar", value: null },
            ],
            filterMultiple: false,
            render: (value) => <SioNoTag valor={value} />
        },
        {
            title: "Licencia de alcohol",
            dataIndex: "licencia_alcohol_giro_comercial",
            key: "licencia_alcohol_giro_comercial",
            width: 80,
            filters: [
                { text: "SI", value: 'true' },
                { text: "NO", value: 'false' },
                { text: "Reiniciar", value: null },
            ],
            filterMultiple: false,
            render: (value) => <SioNoTag valor={value} />
        },
    ]

    return (
        <div className="p-4">

            <h1 className="text-gray-700 text-center">Giros Comerciales</h1>

            <div className="mb-3 grid grid-cols-1 xl:grid-cols gap-2 bg-gray-100 border px-4 py-2 rounded-sm">
                <div className="w-full flex flex-col">
                    <h2 className="text-red-800">Buscar palabras claves</h2>
                    <Input placeholder="Buscar palabras claves" className="w-full" onChange={event => setData('descripcion', event.target.value)} />
                </div>
            </div>

            <Table
                className="border border-gray-200 p-2"
                loading={isLoading}
                columns={columns}
                dataSource={paginador.data}
                onChange={onTableChange}
                pagination={{
                    defaultPageSize: 50,
                    defaultPageSize: filters.per_page,
                    showSizeChanger: true,
                    total: paginador.total,
                    pageSizeOptions: [
                        "10",
                        "50",
                        "100",
                        "300",
                        "1000",
                    ],
                }}
            />
        </div>
    )
}
