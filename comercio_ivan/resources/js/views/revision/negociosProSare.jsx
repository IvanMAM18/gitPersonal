import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import moment from "moment";
import { Table, Space, Tag, Input, Button ,Select} from "antd";
import { Link } from "react-router-dom";
import status from "../../utils/statuses";
import impactos from "../../utils/impactoGiroComercial";
import RolesRouter from "../RolesRouter";
import { SearchOutlined, EditOutlined } from "@ant-design/icons";
import { debounce } from 'lodash';
import { defaultPagination, defaultTableFilters, getCreatedAtFormattedUtcToLaPazTimezone, getVentaAlcoholTag, tramiteIdSorter } from "../ComercioSarePro/Utils";

import recolecionStatus from "../../utils/servicios-recoleccion-tags";


function calcRevisionAtendida(revision) {
    return revision?.negocio_requisitos_revision?.filter(
        (nr) => nr.status === status.ENVIADO
    ).length;
}

// Para mostrar filtro por años, automaticamente agrega el año actual.
const currentYear = (new Date).getFullYear();
const aniosFiscalesDisponibles = _.range(2023, (currentYear + 1))

// Estados inicial de los filtros
const INITIAL_STATE_FILTERS = {
    nombre_del_negocio: '',
    aviso_entero_status: '',
    estatus: [],
    tramite_id: null,
    year: 2024,
    page: 1,
    perPage: 50
}

// Estado inicial del paginador
const INITIAL_PAGINATOR = {
    data: [],
    page: 1,
    perPage: 50,
}

function NegociosProSare() {
    const [selectedYear, setSelectedYear] = useState(2024);
    const [isLoading, setIsLoading] = useState(false)
    const [negocios, setNegocios] = useState([]);
    const searchInput = useRef(null);
    const [selectedID, setSelectedID] = useState(0)
    const [selectedNOMBRE, setSelectedNOMBRE] = useState(0)
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [totalState, setTotalState] = useState(0);
    const [filteredStatus, setFilteredStatus] = useState([
        { text: "Enviado", value: status.ENVIADO },
        { text: "Visto bueno", value: status.APROBADO },
        { text: "Rechazado", value: status.RECHAZADO },
        { text: "En revision", value: status.EN_REVISION },
        { text: "Visor", value: status.VISOR },
    ]);
    const [filters, setFilters] = useState({
        nombre_del_negocio: null,
        pago: null,
        status: null,
        tramites: null,
        year: 2024,
        entidad_revision: window.user.entidad_revision,
        currentPage: 1,
        pageSize: 50
    });
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        setFilters({
            nombre_del_negocio: null,
            pago: null,
            status: null,
            tramites: null,
            year: selectedYear,
            entidad_revision: window.user.entidad_revision,
            currentPage: 1,
            pageSize: 50
        });
        clearFilters();
        setSearchText("");
    };

    const getNegociosByFilters = () => {
        setIsLoading(true)
        setNegocios([])
        axios.post("/app/negocios-by-filters-sare", filters)
            .then(res => {
                let data = res.data.negocios;
                data.map((d) => {
                    d.key = d.id;
                });
                data = data.filter(negocio => negocio.tramites.length > 0);
                setIsLoading(false)
                setTotalState(res.data.totalResult)
                setNegocios(data);
            })
            .catch(err => {setIsLoading(false)
                console.error(err);
            })
    }

    const onChange = (pagination, newFilters, sorter, extra) => {
        setFilters({
            ...filters,
            ...newFilters,
            currentPage: pagination.current,
            pageSize: pagination.pageSize
        })
    };


    const getColumnSearchIDProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder="ID DEL TRÁMITE"
                    value={selectedKeys[0]}
                    onChange={(e) =>{
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                        setSelectedID(e.target.value)
                    }

                    }
                    onPressEnter={() => {
                        handleSearch(selectedKeys, confirm, dataIndex);
                        confirm()
                    }}
                    style={{
                        marginBottom: 8,
                        display: "block",
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => {
                            confirm()
                            handleSearch(selectedKeys, confirm, dataIndex);
                        }}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Buscar
                    </Button>
                    <Button
                        onClick={() => {
                            handleReset(clearFilters)

                        }}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reiniciar
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            // setSearchID(selectedKeys[0]);
                            // setSearchedIDColumn(dataIndex);
                        }}
                    >
                        Filtrar
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? "#1890ff" : undefined,
                }}
            />
        ),
        // onFilter: (value, record) =>
        //     record.tramite_padre.id
        //         .toString()
        //         .toLowerCase()
        //         .includes(value.toLowerCase()),
        // onFilterDropdownOpenChange: (visible) => {
        //     if (visible) {
        //         setTimeout(() => searchInput.current?.select(), 100);
        //     }
        // },
        render: (text) => text,
    });
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder="NOMBRE DEL NEGOCIO"
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        {
                            setSelectedKeys(e.target.value ? [e.target.value] : [])
                            setSelectedNOMBRE(e.target.value)
                        }
                    }
                    onPressEnter={() =>{
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                    }
                    style={{
                        marginBottom: 8,
                        display: "block",
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => {
                                handleSearch(selectedKeys, confirm, dataIndex);
                            }
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Buscar
                    </Button>
                    <Button
                        onClick={() => {
                                handleReset(clearFilters)
                                //setBackFilteredStatus()
                            }
                        }
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reiniciar
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filtrar
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? "#1890ff" : undefined,
                }}
            />
        ),
        // onFilter: (value, record) =>
        //     record[dataIndex]
        //         .toString()
        //         .toLowerCase()
        //         .includes(value.toLowerCase()),
        // onFilterDropdownOpenChange: (visible) => {
        //     if (visible) {
        //         setTimeout(() => searchInput.current?.select(), 100);
        //     }
        // },
        render: (text) => text,
    });
    useEffect(() => {
        getNegociosByFilters();
    }, [filters])
    const getColumnSearchPropsAlcohol = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder="N. LICENCIA"
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    style={{
                        marginBottom: 8,
                        display: "block",
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Buscar
                    </Button>
                    <Button
                        onClick={() => handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reiniciar
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filtrar
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? "#1890ff" : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]!=null?record[dataIndex].licencia.clave
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()):null,
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) => text,
    });
    const columns = [
        {
            title: "ID del Trámite",
            key: "tramites",
            ...getColumnSearchIDProps("IDTRAMITE"),
            sorter: (a, b) => (a.tramite_padre.id < b.tramite_padre.id ? 1 : 0),
            sortDirections: ["descend", "ascend"],
            render: (_, record) => {
                const pendiente = calcRevisionAtendida(record.revisiones[0]);

                return (
                    <Space size="middle">
                        <Space size="middle">
                            {!!pendiente ? (
                                <div className="new-content-pending"></div>
                            ) : (
                                <div className="size-3 bg-green-500 rounded-full"></div>
                            )}
                        </Space>
                        <Space size="middle">{record.tramite_padre.id}</Space>
                    </Space>
                );
            },
        },
        {
            title: "Negocio",
            key: "nombre_del_negocio",
            ...getColumnSearchProps("nombre_del_negocio"),
            render: (text, record) => {
                return (
                    <div style={{ maxWidth: "400px", minWidth: "100px" }}>
                        <div>
                            <Space size="middle">
                                {record.nombre_del_negocio}
                            </Space>
                        </div>
                        <br></br>
                        {!!record.giro_comercial && (
                            <div style={{ display: "inline-block" }}>
                                {record.giro_comercial.map(
                                    (giro_comercial, index) => (
                                        <Tag
                                            color="magenta"
                                            key={giro_comercial.id}
                                        >
                                            <span
                                                style={{
                                                    display: "block",
                                                    fontSize: 14,
                                                    wordWrap: "break-word",
                                                    whiteSpace: "normal",
                                                }}
                                            >
                                                {giro_comercial.nombre}
                                            </span>
                                        </Tag>
                                    )
                                )}
                            </div>
                        )}
                        <br></br>
                        {!!record.catalogo_tramite && (
                            <div>
                                <Tag color="geekblue">
                                    <span style={{ fontSize: 14 }}>
                                        {record.catalogo_tramite.nombre.toUpperCase()}
                                    </span>
                                </Tag>
                            </div>
                        )}
                        <br></br>
                        {record.persona_moral != undefined &&
                        record.persona_moral != null ? (
                            <div>
                                <Tag color="gray">
                                    <span
                                        style={{
                                            fontSize: 14,
                                            overflowWrap: "break-word",
                                        }}
                                    >
                                        Razón Social:{" "}
                                        {record.persona_moral.razon_social}
                                    </span>
                                </Tag>
                            </div>
                        ) : record.user != undefined && record.user != null ? (
                            <div>
                                <Tag color="gray">
                                    <span
                                        style={{
                                            fontSize: 14,
                                            overflowWrap: "break-word",
                                        }}
                                    >
                                        Persona Física: {record.user.nombre}{" "}
                                        {record.user.apellido_pat}{" "}
                                        {record.user.apellido_mot}
                                    </span>
                                </Tag>
                            </div>
                        ) : null}
                    </div>
                );
            },
        },
        {
            title: "Fecha y hora de registro",
            dataIndex: "created_at",
            key: "created_at",

            render: (_, record) => {
                return getCreatedAtFormattedUtcToLaPazTimezone(record.revisiones[0].created_at);
            },
            width: 200
        },
        {
            title: "Alcohol",
            dataIndex: "venta_alcohol",
            key: "venta_alcohol",
            render(venta_alcohol) {
                if (venta_alcohol === null) {
                    return <Tag>N/A</Tag>;
                }
                return venta_alcohol ? (
                    <Tag color="blue">Sí</Tag>
                ) : (
                    <Tag>No</Tag>
                );
            },
        },
        {
            title: "Estatus",
            key: "status",

            filters: filteredStatus,
            onFilter: (value, record) => {
                return true;
            },
            onFilterDropdownOpenChange: (visible) => {
                if (visible) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
            sorter: (a, b) =>
                (a.revisiones.length ? a.revisiones[0].created_at : 0) -
                (b.revisiones.length ? b.revisiones[0].created_at : 0),
            sortDirections: ["descend"],
            render: (_, record) => {
                let _status = record.revisiones.length
                    ? record.revisiones[0].status
                    : status.ENVIADO;
                const from = moment(
                    record.revisiones.length
                        ? record.revisiones[0].created_at
                        : record.created_at
                );
                const to = moment();
                const diff = to.diff(from, "days");

                if (_status == "APROBADO") {
                    _status = "VISTO BUENO";
                }

                return (
                    <Space size="middle">
                        <Tag color={status.color(_status)}>
                            <span style={{ fontSize: 15 }}>{_status}</span>
                        </Tag>
                        <Tag color={status.colorByDays(diff)}>
                            <span style={{ fontSize: 15 }}>
                                hace {diff} día/s
                            </span>
                        </Tag>
                    </Space>
                );
            },
        },
        {
            title: "Pago",
            key: "pago",

            filters: [
                { text: "N/A", value: "N/A" },
                { text: "PENDIENTE", value: "PENDIENTE" },
                { text: "VIGENTE", value: "VIGENTE" },
                { text: "PAGADO", value: "PAGADO" },
                { text: "EXPIRADO", value: "EXPIRADO" },
            ],
              onFilter: (value, record) => {
                  let tramite = record.tramites[0];

                  const requierePago = tramite.catalogo_tramite.pago
                  if (!requierePago) return "N/A"

                  const avisoEntero = tramite.aviso_entero;
                  const estadoAvisoEntero = avisoEntero?.estado ?? "PENDIENTE";
                  return estadoAvisoEntero == value;
              },

            render: (_, record) => {
                let tramite = record.tramites[0];
                if (tramite.catalogo_tramite !== null && tramite.catalogo_tramite !== undefined){
                    const requierePago =
                      (tramite && tramite?.catalogo_tramite?.pago) ?? false;

                    if (!requierePago) return "N/A";
                  }
                // const requierePago =
                //     (tramite && tramite.catalogo_tramite?.pago) ?? false;
                // if (!requierePago) return "N/A";

                const avisoEntero = tramite.aviso_entero;

                const estadoAvisoEntero = avisoEntero?.estado ?? "PENDIENTE";
                return <Tag>Aviso {estadoAvisoEntero}</Tag>;
            },
        },
        window.user.entidad_revision == 4 && {
            title: "Tipo de Recolección",
            dataIndex: "nivel_recoleccion_basura",
            key: "nivel_recoleccion_basura",
            filters: [
                { text: "N/A", value: null },
                { text: "DIARIO", value: "diario" },
                { text: "CUENTA PROPIA", value: "cuenta_propia" },
                { text: "SERVICIO PRIVADO", value: "servicio_privado" },
                { text: "2 VECES POR SEMANA", value: "2_veces_por_semana" },
                { text: "3 VECES POR SEMANA", value: "3_veces_por_semana" },


            ],

            onFilter: (value, record) => {
                return record?.nivel_recoleccion_basura === value;
            },
            render: (text, record) => {
                let tramite = record.tramites[0];
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
                            window.open(`/app/cambio-tipo-recoleccion/` + record.id +`/`+selectedYear, '_blank');
                        }}
                    />) : null
                    }
                    {
                    <Space size="middle">
                        {recolecionStatus.tag(record?.nivel_recoleccion_basura)}
                    </Space>
                    }
                    </>
                );
            },
        },
        window.user.entidad_revision == 6 && {
            ...getColumnSearchPropsAlcohol("licencia_alcohol"),
            title: "N. Licencia",
            key: "licencia_alcohol",
            render: (text, record) => {
                return (
                    <Space size="middle">
                        {(record?.licencia_alcohol?.licencia?.clave)}
                    </Space>
                );
            },
        },
        {
            title: "– –",
            dataIndex: "id",
            key: "id",
            render: (text, record) => {
                return (
                    <Space size="middle">
                        <Link to={`/app/detalles-negocios-entidad/${record.id}/${selectedYear}`} target="_blank">
                            DETALLES →
                        </Link>
                    </Space>
                );
            },
        },
    ].filter(Boolean);;

    useEffect(() => {
        getAllNegocios();
    }, []);

    const getAllNegocios = async () => {
        setIsLoading(true)
        setNegocios([])
        axios.get("/app/negocios-not-approved-sare/" + window.user.entidad_revision + `/` + selectedYear)
            .then(function (response) {
                let data = response.data;
                data.map((d) => {
                    d.key = d.id;
                });
                data = data.filter(negocio => negocio.tramites.length > 0);
                setNegocios(data);
                setIsLoading(false)
            })
            .catch(function (error) {
                setIsLoading(false)
            });
    };

    /**
     { text: "Enviado", value: status.ENVIADO },
                { text: "Visto bueno", value: status.APROBADO },
                { text: "Rechazado", value: status.RECHAZADO },
                { text: "En revision", value: status.EN_REVISION },
                { text: "Visor", value: status.VISOR },
     */
    return (
        <div>
            <RolesRouter />

            <div style={{width: '100%', display: 'flex', justifyContent: 'end', alignItems: 'center', padding: '10px'}}>
                <span style={{marginRight: '10px'}}>Año de trabajo: </span>
                <Select
                    defaultValue="2024"
                    style={{
                        width: 120,
                    }}
                    onChange={(value) => {
                            setFilters({...filters, year: value});
                            setSelectedYear(value);
                        }
                    }
                    options={[
                        {
                        value: '2024',
                        label: '2024',
                        },
                        {
                        value: '2023',
                        label: '2023',
                        },
                    ]}
                    />
            </div>

            {isLoading && (
                <div className="text-center font-medium text-lg flex items-center justify-center gap-3">
                    <div className="bg-red-600 size-4 rounded-full animate-ping"></div>
                    Cargando Datos...
                </div>
            )}

            <Table
                bordered
                className="negocios-table"
                dataSource={negocios}
                columns={columns}
                onChange={onChange}
                pagination={{
                    defaultPageSize: 50,
                    showSizeChanger: true,
                    total: totalState,
                    pageSizeOptions: [
                        "10",
                        "50",
                        "100",
                        "500",
                        "1000",
                    ],
                }}
            ></Table>
        </div>
    );
}

export default NegociosProSare;

if (document.getElementById("negocios-content")) {
    ReactDOM.render(<NegociosProSare />, document.getElementById("negocios-content"));
}
