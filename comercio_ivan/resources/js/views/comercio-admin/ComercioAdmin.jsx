import React, { useState, useEffect } from "react";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, message, Checkbox, Popover, Space, Table, Tag, Select } from "antd";
import axios from "axios";
import status from "../../utils/statuses";
import NegocioDetallesModal from "../components/NegocioDetallesModal";
import RolesRouter from "../RolesRouter";
import EditorGirosModal from "./EditorGirosNegocioModal";
import EntidadRevisionModal from "./EntidadRevisionModal";

import { getCreatedAtFormattedUtcToLaPazTimezone } from "../ComercioSarePro/Utils";
import {debounce, pickBy, range} from "lodash";
import TramiteProgreso from '@/components/TramiteProgreso'
import ValidarNegocio from '@/components/ValidarTramite'

// Para mostrar filtro por años, automaticamente agrega el año actual.
const currentYear = (new Date).getFullYear();
const aniosFiscalesDisponibles = range(2023, (currentYear + 1))

// Estados inicial de los filtros
const INITIAL_STATE_FILTERS = {
    nombre_del_negocio: '',
    tamano_empresa: null,
    validado: 0,
    tramite_id: null,
    progreso: null,
    year: currentYear,
    page: 1,
    per_page: 50,
    es_pro_sare: 0,
    obsoletos: false,
    venta_alcohol: null,
    obsoletos: false
}

// Estado inicial del paginador
const INITIAL_PAGINATOR = {
    data: [],
    page: 1,
    perPage: 50,
}

function ComercioAdmin({esProSare = 0, pageTitle = 'Negocios en Trámite'}) {

    // States
    const [isLoading, setIsLoading] = useState(false)
    const [selectedRevision, setSelectedRevision] = useState(null);
    const [modalNegocioDetallesAbierto, setModalNegocioDetallesAbierto] = useState(false);
    const [selectedNegocio, setSelectedNegocio] = useState(null);
    const [negocioModalGiros, setNegocioModalGiros] = useState(null);
    const [paginator, setPaginator] = useState(INITIAL_PAGINATOR);
    const [filters, setFilters] = useState({
        ...INITIAL_STATE_FILTERS,
        es_pro_sare: esProSare
    });

    useEffect(() => {
        if(filters.tramite_id != null){
            setData('validado', null)
        }
        fetchTramites()
    },  [filters.year, filters.page, filters.per_page, filters.obsoletos])

    const getColorByNombre = (nombre) => {
        switch (nombre) {
            case "Licencia de funcionamiento":
                return "green";
            case "Refrendo Licencia de funcionamiento":
                return "purple";
            default:
                return "blue";
        }
    };

    function fetchTramites() {
        setIsLoading(true)
        axios.get("/app/comercio-admin/negocios-en-revision", {
            params: filters
        })
            .then(response => {
                const paginador = response.data
                setPaginator(paginador);
                setIsLoading(false)
            })
            .catch((error) => {
                setIsLoading(false)
            })
    }

    const abrirEditorDeGirosNegocioModal = (negocio_id) => {
        setNegocioModalGiros(negocio_id);
    };

    const onRevisionModalClose = ()=> {
        setSelectedRevision(null)
    }
    const openModal = (revision) => {
        setSelectedRevision(revision);
    }

    const statusDeUsoDeSueloDeNegocio = (negocio) => {
        const revisionUsoDeSuelo = negocio.revisiones.find(
            (revision) => revision.entidad.nombre === "Uso de suelo"
        );

        if (!revisionUsoDeSuelo) {
            return false;
        }

        return (
            revisionUsoDeSuelo.status === status.VISTO_BUENO ||
            revisionUsoDeSuelo.status === status.APROBADO || revisionUsoDeSuelo.status === status.VISOR
        );
    }

    const openNegocioDetallesModal = (negocio) => {
        axios
            .get("/app/comercio-admin/negocios/" + negocio.id)
            .then(({data: negocio}) => {
                setSelectedNegocio(negocio);
                setModalNegocioDetallesAbierto(true);
            })
            .catch(() => {
            });
    }

    const abrirAvisoEntero = (avisoEntero) => {
        if (!avisoEntero) {
            message.error("Aviso de entero no encontrado.");
            return;
        }

        openNewTab(`/entidad-revision/avisos-enteros/${avisoEntero.id}/pdf`, 'fullscreen=yes');
    }

    // Evento cuando algun filtro de la tabla cambia.
    const onTableChange = (pagination, newFilters, sorter, extra) => {
        setData('page', pagination.current)
        setData('per_page', pagination.pageSize)
    }

    // Helper para actualizar los datos del state filters.
    const setData = (property, value) => {
        setFilters(prevFilters => {
            return {
                ...prevFilters,
                [property]: value
            };
        })
    }

    const filterIgnoringValidado = (property, value) => {
        setFilters(prevFilters => {
            return {
                ...prevFilters,
                validado: null,
                [property]: value
            };
        })
    }

    // Filtro tipo texto para la tabla antd.
    const filtroDeTexto = (property, placeholder, type='text', onChange = null) => ({
        filterDropdown: () => (
            <div className="p-2">

                {/*Input del filtro*/}
                <Input
                    type={type}
                    id={`custom-text-filter-${property}`}
                    className="mb-2"
                    placeholder={placeholder.toUpperCase()}
                    value={filters[property]}
                    onChange={event => onChange ? onChange(property, event.target.value) : setData(property, event.target.value)}
                    onPressEnter={() => fetchTramites()}/>
                <div className="inline-flex gap-2">

                    {/*Boton para lanzar la busqueda*/}
                    <Button
                        type="primary"
                        onClick={() => fetchTramites()}
                        icon={<SearchOutlined/>}
                        size="small">
                        Buscar
                    </Button>

                    {/*Boton para borrar input*/}
                    <Button
                        onClick={() => setData(property, INITIAL_STATE_FILTERS[property])}
                        size="small">
                        Reiniciar
                    </Button>
                </div>

            </div>
        ),
        filterIcon: () => (
            <SearchOutlined style={{color: filters[property] != INITIAL_STATE_FILTERS[property] ? '#1890ff' : ''}}/>
        ),
        onFilterDropdownOpenChange: debounce((visible) => {
            if (visible) {
                document.getElementById(`custom-text-filter-${property}`).focus()
            }
        }, 100),
        render: (text) => text,
    });

    // Filtro tipo select/dropdown para la tabla de antd.
    const filtroSelect = (property, options, defaultValue = '') => ({
        filterDropdown: () => (
            <div className="p-2 flex flex-col w-fit">

                {/*Input del filtro*/}
                <Select options={options}
                        value={filters[property]}
                        defaultValue={defaultValue}
                        name={property}
                        className="w-full mb-2"
                        onChange={value => setData(property, value)} />

                <div className="inline-flex gap-2">

                    {/*Boton para lanzar la busqueda*/}
                    <Button
                        type="primary"
                        onClick={() => fetchTramites()}
                        icon={<SearchOutlined/>}
                        size="small">
                        Buscar
                    </Button>

                    {/*Boton para borrar input*/}
                    <Button
                        onClick={() => setData(property, INITIAL_STATE_FILTERS[property])}
                        size="small">
                        Reiniciar
                    </Button>
                </div>

            </div>
        ),
        filterIcon: () => (
            <SearchOutlined style={{color: filters[property] != INITIAL_STATE_FILTERS[property] ? '#1890ff' : ''}}/>
        ),
        render: (text) => text,
    });

    // Abrir el link en una nueva tab
    const openNewTab = (url, options) => {
        window.open(url, '_blank', options)
    }

    const tableColumns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            ...filtroDeTexto('tramite_id', 'Id del Tramite', 'number', filterIgnoringValidado),
            width: 80,
            fixed: 'left',
        },
        {
            title: "Negocio",
            dataIndex: "nombre_del_negocio",
            key: "nombre_del_negocio",
            ...filtroDeTexto('nombre_del_negocio', 'Nombre del Negocio', 'text', filterIgnoringValidado),
            render(_, tramite) {
                const color = getColorByNombre(tramite.catalogo.nombre);
                return (
                    <>
                        {window.user.role_id == 6 &&
                            <Button
                                size="small"
                                icon={<EditOutlined />}
                                type="primary"
                                className="mr-1 mb-1"
                                onClick={() => openNewTab(`/app/comercio-admin/negocio/${tramite.tramitable.id}/editar/`)}
                            />
                        }
                        <a onClick={() => openNegocioDetallesModal(tramite.tramitable)}>{tramite.tramitable.nombre_del_negocio}</a>
                        <Tag color={color}>
                            {tramite.catalogo.nombre}
                        </Tag>
                    </>
                );
            },
            width: 250,
            fixed: 'left'
        },
        {
            title: "Tamaño",
            dataIndex: "tamano_empresa",
            key: "tamano_empresa",
            ...filtroSelect('tamano_empresa', [
                { label: "Todos", value: null },
                { label: "Autoempleo", value: "autoempleo" },
                { label: "Micro", value: "micro" },
                { label: "Pequeña", value: "pequeña" },
                { label: "Mediana", value: "mediana" },
                { label: "Grande", value: "grande" }
            ], null),
            render(_, tramite) {
                return tramite.tramitable.tamano_empresa ? (
                    <Tag color="blue">{tramite.tramitable.tamano_empresa}</Tag>
                ) : (
                    <span>--</span>
                );
            },
            width: 140,
            fixed: 'left'
        },
        {
            title: "Fecha y hora de registro",
            dataIndex: "created_at",
            key: "created_at",
            render: (_, tramite) => {
                return getCreatedAtFormattedUtcToLaPazTimezone(tramite.created_at);
            },
            width: 200
        },
        {
            title: "Giros",
            dataIndex: "giro_comercial",
            key: "giro_comercial",
            render(_, tramite) {
                return (
                    <>
                        {
                            window.user.role != "ComercioAdminVisor" ? (
                                <Button
                                    disabled={statusDeUsoDeSueloDeNegocio(tramite.tramitable)}
                                    size="small"
                                    icon={<EditOutlined />}
                                    type="primary"
                                    onClick={() => {
                                        abrirEditorDeGirosNegocioModal(tramite.tramitable.id);
                                    }}
                                />
                            ) : null
                        }

                        {tramite.tramitable.giro_comercial.map((giro, id) => {
                            return (
                                <Popover
                                    key={"gc" + id}
                                    placement="top"
                                    title={giro.tipo.replace(
                                        /_/g,
                                        " "
                                    )}
                                    content={giro.descripcion}
                                    trigger="click"
                                >
                                    <Tag style={{ whiteSpace: "break-spaces" }}>{giro.nombre}</Tag>
                                </Popover>
                            );
                        })}
                    </>
                );
            },
            width: 600,
        },
        {
            title: "Vende Alcohol",
            dataIndex: "venta_alcohol",
            key: "venta_alcohol",
            ...filtroSelect('venta_alcohol', [
                { label: "Todos", value: null },
                { label: "Si", value: 1 },
                { label: "No", value: 0 },
            ]),
            render(_, tramite) {
                if (tramite.tramitable.venta_alcohol === null) {
                    return <Tag>N/A</Tag>;
                }
                return tramite.tramitable.venta_alcohol ? (
                    <Tag color="blue">Sí</Tag>
                ) : (
                    <Tag>No</Tag>
                );
            },
            width: 170,
        },
        {
            title: "Progreso",
            dataIndex: "revisiones",
            key: "revisiones",
            ...filtroSelect('progreso', [
                { label: "Todos", value: null },
                { label: "Vistos Buenos: 1", value: 1 },
                { label: "Vistos Buenos: 2", value: 2 },
                { label: "Vistos Buenos: 3", value: 3 },
                { label: "Vistos Buenos: 4", value: 4 },
                { label: "Pendiente V.B.: Protección Civil", value: 'PENDIENTE_PROTECCION_CIVIL' },
                { label: "Pendiente V.B.: Medio Ambiente", value: 'PENDIENTE_MEDIO_AMBIENTE' },
                { label: "Pendiente V.B.: Servicios Públicos", value: 'PENDIENTE_SERVICIOS_PUBLICOS' },
            ]),
            render: (_, tramite) => {
                return <TramiteProgreso key={tramite.id}
                                        tramite={tramite}
                                        openModal={openModal}
                                        abrirAvisoEntero={abrirAvisoEntero} />
            },
        },
        {
            title: "Acciones",
            dataIndex: "actions",
            key: "actions",
            ...filtroSelect('validado', [
                { label: "Todos", value: null },
                { label: "Sin Validar", value: 0 },
                { label: "Validados", value: 1 },
                { label: "Rechazados", value: 2 },
            ], 0),
            render: (_, tramite) => {
                const mostrasBotonValidar = tramite.revisiones.filter(revision=>revision.status==="RECHAZADO").length === 0;
                return (
                    <Space direction={"vertical"}>
                        {mostrasBotonValidar && <ValidarNegocio tramite={tramite} onValidated={() => fetchTramites()} />}

                        <Button
                            type="primary"
                            target="_blank"
                            href={'/app/comercio-admin/negocio/' + tramite.tramitable.id + `/` + filters.year}>
                            VER DETALLES
                        </Button>
                    </Space>
                );
            },
            width: 220,
        },
    ];

    return (
        <div className="bg-white p-3">
            <RolesRouter />

            <div className="flex justify-between items-center mb-4">
                <h2>{pageTitle}</h2>

                {/*Filtro por Año Fiscal*/}
                <div className="flex items-center">
                    <div className="flex justify-end items-center mr-4 ">
                        <label htmlFor="chk-obsoletos" className="mb-0 mr-2 flex items-center">
                        NEGOCIOS SIN REFRENDO EN AÑO EN CURSO
                        </label>
                        <Checkbox id="chk-obsoletos" onChange={event => setData('obsoletos', event.target.checked)}/>
                    </div>
                    <div className="flex justify-end items-center">
                        <label className="mb-0 mr-2 flex items-center">
                            Año Fiscal
                        </label>
                        <select disabled={filters.obsoletos === true} defaultValue={filters.year}
                                onChange={event => setData('year', event.target.value)}
                                className="border border-gray-200 rounded-sm py-1 pl-3 w-28">
                            {aniosFiscalesDisponibles.map(year =>
                                <option key={year} value={year}>{year}</option>
                            )}
                        </select>
                    </div>
                </div>

            </div>

            <Table
                loading={isLoading}
                bordered
                rowKey="id"
                dataSource={paginator.data}
                columns={tableColumns}
                onChange={onTableChange}
                pagination={{
                    showSizeChanger: true,
                    defaultPageSize: filters.per_page,
                    total: paginator.total,
                    pageSizeOptions: ["10", "50", "100", "500"],
                }}
                scroll={{ x: 2800 }}>
            </Table>

            {selectedRevision &&
                <EntidadRevisionModal revision={selectedRevision} onClose={() => onRevisionModalClose()} />
            }

            {!!selectedNegocio && (
                <NegocioDetallesModal
                    visible={modalNegocioDetallesAbierto}
                    onOk={() => {
                        setModalNegocioDetallesAbierto(false);
                        setSelectedNegocio(null);
                    }}
                    onCancel={() => {
                        setModalNegocioDetallesAbierto(false);
                        setSelectedNegocio(null);
                    }}
                    negocio={selectedNegocio}
                />
            )}
            {!!negocioModalGiros && (
                <EditorGirosModal
                    negocioId={negocioModalGiros}
                    visible={!!negocioModalGiros}
                    onCancel={() => setNegocioModalGiros(null)}
                />
            )}
        </div>
    );
}

export default ComercioAdmin;
