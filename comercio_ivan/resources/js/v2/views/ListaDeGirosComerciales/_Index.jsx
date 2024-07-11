import {Checkbox, Input, Select, Table, Tag} from "antd";
import React, {useEffect, useState} from "react";
import SioNoTag from "@/v2/components/SioNo";
import {debounce, pickBy} from "lodash";
import {Option} from "antd/es/mentions";
import status from "@/utils/statuses";

// Estados inicial de los filtros
const INITIAL_STATE_FILTERS = {
    nombre: '',
    clave_scian: '',
    impacto: null,
    vende_alchol: false,
    programa_interno: false,
    vende_alcohol: false,
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
        if (tableFilters['tipo']){
            setData('impacto', tableFilters['tipo'][0])
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
        },
        {
            title: "Nombre",
            dataIndex: "nombre",
            key: "nombre",
        },
        {
            title: "Tipo",
            dataIndex: "tipo",
            key: "tipo",
            width: 300,
            filters: [
                { text: "Bajo Impacto", value: 'bajo_impacto' },
                { text: "Mediano_alto_impacto",value: 'mediano_alto_impacto' },
                { text: "Alto_impacto", value: 'alto_impacto' },
            ],
            render: (value, giro) => <Tag color={tipoImpactoClasss[value]}>{giro.nombre_impacto}</Tag>
        },
        {
            title: "Sector",
            dataIndex: "tipo_sector",
            key: "tipo_sector",
            render: (value) => <Tag color={tipoSectorClasss[value]}>{value}</Tag>
        },
        {
            title: "Cobro de Programa interno",
            dataIndex: "cobro_programa_interno",
            key: "cobro_programa_interno",
            render: (value) => <SioNoTag valor={value} />
        },
        {
            title: "Certificado de medio ambiente",
            dataIndex: "certificado_medio_ambiente",
            key: "certificado_medio_ambiente",
            render: (value) => <SioNoTag valor={value} />
        },
        {
            title: "Licencia de alcohol",
            dataIndex: "licencia_alcohol",
            key: "licencia_alcohol",
            render: (value) => <SioNoTag valor={value} />
        },
    ]

    return (
        <div className="p-4">

            <h1 className="text-gray-700">Giros Comerciales</h1>

            <div className="mb-3 grid grid-cols-1 xl:grid-cols-3 gap-2 bg-gray-100 border px-4 py-2 rounded-sm">
                <div className="w-full flex flex-col">
                    Clave Scian:
                    <Input placeholder="Clave Scian" className="w-full" onChange={event => setData('clave_scian', event.target.value)} />
                </div>
                <div className="w-full flex flex-col">
                    Giro Comercial:
                    <Input className="w-full" placeholder="Nombre"  onChange={event => setData('nombre', event.target.value)} />
                </div>
               <div className="w-full flex flex-col">
                   Impacto:
                   <Select value={filters.impacto} className="min-w-48" onChange={value => setData('impacto', value)}>
                       <Option value={null}>Todos</Option>
                       <Option value="bajo_impacto">Bajo Impacto</Option>
                       <Option value="mediano_alto_impacto">Mediano Alto Imapcto</Option>
                       <Option value="alto_impacto">Alto Impacto</Option>
                   </Select>
               </div>
                <div>
                    <label htmlFor="chk_programa_interno" className="flex gap-2">
                        <Checkbox id="chk_programa_interno" defaultValue={filters.programa_interno} onChange={event => setData('programa_interno', event.target.checked)} />
                        Cobro de Programa interno
                    </label>
                </div>
                <div>
                    <label htmlFor="chk_medio_ambiente" className="flex gap-2">
                        <Checkbox id="chk_medio_ambiente" defaultValue={filters.medio_ambiente} onChange={event => setData('medio_ambiente', event.target.checked)} />
                        Certificado de medio ambiente
                    </label>
                </div>
                <div>
                    <label htmlFor="chk_vende_alcohol" className="flex gap-2">
                        <Checkbox id="chk_vende_alcohol" defaultValue={filters.vende_alcohol} onChange={event => setData('vende_alcohol', event.target.checked)} />
                        Licencia de alcohol
                    </label>
                </div>
            </div>

            <Table
                className="border border-gray-50 p-1"
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
                        "500",
                        "1000",
                    ],
                }}
            />
        </div>
    )
}
