import {useState, useEffect} from "react";
import moment from "moment";
import { Table, Space, Tag, Input, Button, Select } from "antd";
import { Link } from "react-router-dom";
import status from "../../utils/statuses";
import RolesRouter from "../RolesRouter";
import { SearchOutlined, EditOutlined } from "@ant-design/icons";
import { debounce, pickBy, range } from 'lodash';
import { getCreatedAtFormattedUtcToLaPazTimezone} from "../ComercioSarePro/Utils";

import recolecionStatus from "../../utils/servicios-recoleccion-tags";

function calcRevisionAtendida(revisiones) {
    let revision = revisiones.length ? revisiones[0] : null
    if(revision) {
        return revision.negocio_requisitos_revision?.filter(
            (nr) => nr.status === status.ENVIADO
        ).length;
    }
    return 0
}

// Para mostrar filtro por años, automaticamente agrega el año actual.
const currentYear = (new Date).getFullYear();
const aniosFiscalesDisponibles = range(2023, (currentYear + 1))

// Estados inicial de los filtros
const INITIAL_STATE_FILTERS = {
    nombre_del_negocio: '',
    aviso_entero_status: '',
    nivel_recoleccion_basura: [],
    tamano_empresa: '',
    estatus: [
        status.ENVIADO,
        status.EN_REVISION,
        status.PENDIENTE,
        status.VISOR,
    ],
    tramite_id: null,
    year: currentYear,
    page: 1,
    per_page: 50,
    es_pro_sare: false
}

// Estado inicial del paginador
const INITIAL_PAGINATOR = {
    data: [],
    page: 1,
    perPage: 50,
}

export default function Negocios({esProSare = false}) {

    // States
    const [isLoading, setIsLoading] = useState(false)
    const [paginator, setPaginator] = useState(INITIAL_PAGINATOR);
    const [filters, setFilters] = useState({
        ...INITIAL_STATE_FILTERS,
        es_pro_sare: esProSare
    });

    // llamamos fetchTramites solo cuando ciertos filtros cambian, otros filtros los llamamos al pulsar el boton buscar.
    useEffect(() => fetchTramites(), [filters.year, filters.page, filters.per_page, filters.estatus, filters.es_pro_sare, filters.nivel_recoleccion_basura])

    // Llama la API del backend para traer todos los tramites.
    // Mapeamos los datos para usarlos en la tabla de antd.
    // La api regresa el objeto paginador, lo setea en el state.
    const fetchTramites = debounce(() => {
        setIsLoading(true)
        axios.get('/app/entidad-revision/revision-de-negocios', {
            params: pickBy(filters)
        })
            .then(response => {
                response.data.data.map(t => t.key = t.id);
                setPaginator(response.data);
                setIsLoading(false)
            })
            .catch(errors => {
                setIsLoading(false)
            })
    }, 300)

    // Evento cuando algun filtro de la tabla cambia.
    const onTableChange = (pagination, newFilters, sorter, extra) => {
        setData('page', pagination.current)
        setData('per_page', pagination.pageSize)
        setData('estatus', newFilters.estatus)
        setData('nivel_recoleccion_basura', newFilters.nivel_recoleccion_basura)
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

    // Cuando buscamos por tramite ID se deben quitar cualquier otro filtro que este antes.
    const buscarPorTramiteId = () => {
        const tramiteId = filters.tramite_id
        setFilters(INITIAL_STATE_FILTERS)
        setData('estatus', [])
        setData('year', currentYear)
        setData('es_pro_sare', esProSare)
        setData('tramite_id', tramiteId)
    }

    // Filtro tipo texto para la tabla antd.
    const filtroDeTexto = (property, placeholder, searchFunction, type='text') => ({
        filterDropdown: () => (
            <div className="p-2">

                {/*Input del filtro*/}
                <Input
                    type={type}
                    id={`custom-text-filter-${property}`}
                    className="mb-2"
                    placeholder={placeholder.toUpperCase()}
                    value={filters[property]}
                    onChange={event => setData(property, event.target.value)}
                    onPressEnter={() => searchFunction()}/>
                <div className="inline-flex gap-2">

                    {/*Boton para lanzar la busqueda*/}
                    <Button
                        type="primary"
                        onClick={() => searchFunction()}
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
            <div className="p-2 flex flex-col">

                {/*Input del filtro*/}
                <Select options={options}
                        value={filters[property]}
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

    // Definir las columnas de la tabla, se le agrega la propiedad visible, algunas columnas
    // por default son true, pero otras las evaluamos segun la entidad revisora que este authenticada.
    // y al final filtramos solos los visibles = true
    const columns = [
        {
            ...filtroDeTexto('tramite_id', 'Id del Tramite', buscarPorTramiteId, 'number'),
            title: "ID del Trámite",
            key: "tramite_id",
            visible: true,
            // sorter: (a, b) => {
            // },
            // sortDirections: ["descend", "ascend"],
            render: (_, tramite) => {

                const pendiente = calcRevisionAtendida(tramite.revisiones);

                return (
                    <Space size="middle">
                        <Space size="middle">
                            {!!pendiente ? (
                                <div className="size-3 rounded-full bg-green-500"></div>
                            ) : (
                                <div
                                    className="size-3 rounded-full bg-gray-300"
                                ></div>
                            )}
                        </Space>
                        <Space size="middle">{tramite.tramite_padre_id}</Space>
                    </Space>
                );
            },
        },
        {
            ...filtroDeTexto('nombre_del_negocio', 'Nombre del Negocio', fetchTramites),
            title: "Negocio",
            key: "nombre_del_negocio",
            visible: true,
            render: (_, tramite) => {
                return (
                    <div style={{ maxWidth: "400px", minWidth: "100px" }}>
                        <div>
                            <Space size="middle">
                                {tramite.tramitable.nombre_del_negocio}
                            </Space>
                        </div>
                        <br></br>
                        {tramite.tramitable.giro_comercial != null &&
                            <div className="inline-block">
                                {tramite.tramitable.giro_comercial.map((giro_comercial, index) => (
                                        <Tag color="magenta" key={`giro-${index}-${giro_comercial.id}`}>
                                            <span className="block text-[14px] word-break whitespace-normal">
                                                {giro_comercial.nombre}
                                            </span>
                                        </Tag>
                                    )
                                )}
                            </div>
                        }
                        <br></br>
                        <Tag color="geekblue">
                            <span className="text-[14px]">
                                {tramite.catalogo_tramite.nombre}
                            </span>
                        </Tag>
                    </div>
                );
            },
        },
        {
            title: "Fecha y hora de registro",
            dataIndex: "created_at",
            key: "created_at",
            visible: true,
            render: (_, tramite) => {
                return getCreatedAtFormattedUtcToLaPazTimezone(tramite.created_at);
            },
            width: 200
        },
        {
            title: "Tamaño",
            dataIndex: "tamano_empresa",
            key: "tamano_empresa",
            visible: true,
            ...filtroSelect('tamano_empresa', [
                { label: "--", value: -1 },
                { label: "Autoempleo", value: "autoempleo" },
                { label: "Micro", value: "micro" },
                { label: "Pequeña", value: "pequeña" },
                { label: "Mediana", value: "mediana" },
                { label: "Grande", value: "grande" }
            ]),
            render(_, tramite) {
                return tramite.tramitable.tamano_empresa ? (
                    <Tag color="blue">{tramite.tramitable.tamano_empresa}</Tag>
                ) : (
                    <span>--</span>
                );
            },
        },
        {
            title: "Alcohol",
            dataIndex: "venta_alcohol",
            key: "venta_alcohol",
            visible: true,
            render(_, tramite) {
                return tramite.tramitable.venta_alcohol ? (
                    <Tag color="blue">Sí</Tag>
                ) : (
                    <Tag>No</Tag>
                );
            },
        },
        {
            title: "Estatus",
            key: "estatus",
            visible: true,
            filteredValue: filters.estatus,
            filters: [
                { text: "Enviado", value: status.ENVIADO },
                { text: "Visto bueno", value: status.APROBADO },
                { text: "Rechazado", value: status.RECHAZADO },
                { text: "En revision", value: status.EN_REVISION },
                { text: "Pendiente", value: status.PENDIENTE },
                { text: "Visor", value: status.VISOR },
            ],
            // sorter: (a, b) =>
            //     (a.revisiones.length ? a.revisiones[0].created_at : 0) -
            //     (b.revisiones.length ? b.revisiones[0].created_at : 0),
            // sortDirections: ["descend"],
            render: (_, tramite) => {

                let _status = tramite.revisiones.length ? tramite.revisiones[0].status : status.ENVIADO;

                const from = moment(
                    tramite.revisiones.length ? tramite.revisiones[0].created_at : tramite.created_at
                )

                const to = moment();
                const diff = to.diff(from, "days");

                if (_status == "APROBADO") {
                    _status = "VISTO BUENO";
                }

                return (
                    <Space size="middle">
                        <Tag color={status.color(_status)}>
                            <span className="text-[15px]">{_status}</span>
                        </Tag>
                        <Tag color={status.colorByDays(diff)}>
                            <span className="text-[15px]">
                                hace {diff} día/s
                            </span>
                        </Tag>
                    </Space>
                );
            },
        },
        {
            title: "Pago",
            key: "aviso_entero_status",
            ...filtroSelect('aviso_entero_status', [
                { label: "NO APLICA", value: "N/A" },
                { label: "PENDIENTE", value: "PENDIENTE" },
                { label: "VIGENTE", value: "VIGENTE" },
                { label: "PAGADO", value: "PAGADO" },
                { label: "EXPIRADO", value: "EXPIRADO" }
            ]),
            visible: true,
            render: (_, tramite) => {

                const requierePago = tramite.catalogo_tramite.pago

                if (requierePago) {
                    const avisoEntero = tramite.aviso_entero;
                    const estadoAvisoEntero = avisoEntero?.estado ?? "PENDIENTE";
                    return <Tag>Aviso {estadoAvisoEntero}</Tag>;
                    return ''
                }

                return "N/A"
            },
        },
        {
            title: "Tipo de Recolección",
            dataIndex: "nivel_recoleccion_basura",
            key: "nivel_recoleccion_basura",
            filteredValue: filters.nivel_recoleccion_basura,
            visible : (window.user.entidad_revision == 4),
            filters: [
                { text: "N/A", value: null },
                { text: "DIARIO", value: "diario" },
                { text: "CUENTA PROPIA", value: "cuenta_propia" },
                { text: "SERVICIO PRIVADO", value: "servicio_privado" },
                { text: "2 VECES POR SEMANA", value: "2_veces_por_semana" },
                { text: "3 VECES POR SEMANA", value: "3_veces_por_semana" },
            ],
            render: (text, tramite) => {
                const avisoEntero = tramite.aviso_entero;
                return (
                    <>
                    {
                     (window.user.entidad_revision == 4 && window.user.role_id == 5 && avisoEntero?.estado!='PAGADO') ? (
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        type="primary"
                        onClick={() => {
                            window.open(`/app/cambio-tipo-recoleccion/` + tramite.tramitable.id+`/`+filters.year, '_blank');
                        }}
                    />) : null
                    }
                    {
                    <Space size="middle">
                        {recolecionStatus.tag(tramite?.tramitable?.nivel_recoleccion_basura)}
                    </Space>
                    }
                    </>
                );
            },
        },
        {
            ...filtroDeTexto("licencia_alcohol", "# Licencia de Alcohol", fetchTramites),
            title: "N. Licencia",
            key: "licencia_alcohol",
            visible : (window.user.entidad_revision == 6 || window.user.entidad_revision == 5),
            render: (_, tramite) => {
                return (
                    <Space size="middle">
                        {(tramite?.tramitable?.licencia_alcohol?.licencia?.clave)}
                    </Space>
                );
            },
        },
        {
            title: "––",
            dataIndex: "id",
            key: "id",
            visible: true,
            render: (_, tramite) => {
                return (
                    <Link to={`/app/detalles-negocios-entidad/` + tramite.tramitable.id + `/` + filters.year} target="_blank">
                        Detalles →
                    </Link>
                );
            },
        },
    ].filter(column => column.visible)

    return (
        <div>
            <RolesRouter />

            {/*Filtro por Año Fiscal*/}
            <div className="w-full flex justify-end items-center px-4 pt-3">
                <label htmlFor="" className="mb-0 gap-1 flex items-center">
                    Año Fiscal
                    <select defaultValue={filters.year} onChange={event => setData('year', event.target.value)} className="border border-gray-200 rounded-sm py-1 pl-3 w-28">
                        {aniosFiscalesDisponibles.map(year =>
                            <option key={year} value={year}>{year}</option>
                        )}
                    </select>
                </label>
            </div>

            {/*Tabla*/}
            <Table
                loading={isLoading}
                bordered
                className="negocios-table"
                dataSource={paginator.data}
                columns={columns}
                onChange={onTableChange}
                pagination={{
                    showSizeChanger: true,
                    defaultPageSize: filters.pageSize,
                    total: paginator.total,
                    pageSizeOptions: ["10", "50", "100", "500"],
                }}>
            </Table>
        </div>
    );
}
