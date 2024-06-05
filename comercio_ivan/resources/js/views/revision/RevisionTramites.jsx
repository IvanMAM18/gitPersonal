import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import moment from "moment";
import { Table, Space, Tag, Input, Button, Select } from "antd";
import { Link } from "react-router-dom";
import status from "../../utils/statuses";
import impactos from "../../utils/impactoGiroComercial";
import RolesRouter from "../RolesRouter";
import { SearchOutlined } from "@ant-design/icons";
import { debounce } from "lodash";

import recolecionStatus from "../../utils/servicios-recoleccion-tags";

function calcRevisionAtendida(revision) {
    return revision?.negocio_requisitos_revision?.filter(
        (nr) => nr.status === status.ENVIADO
    ).length;
}

function RevisionTramites() {
    const [tramites, setTramites] = useState([]);
    const [negocios, setNegocios] = useState([]);
    const [filteredStatus, setFilteredStatus] = useState([
        { text: "Enviado", value: status.ENVIADO },
        { text: "Visto bueno", value: status.APROBADO },
        { text: "Rechazado", value: status.RECHAZADO },
        { text: "En revision", value: status.EN_REVISION },
        { text: "Visor", value: status.VISOR },
    ]);
    const [selectedYear, setSelectedYear] = useState(2024);
    const mostrarNumLicencia = !!user && (user.entidad_revision == 6 || user.entidad_revision == 5);

    const getColumnSearchIDProps = () => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder="ID DEL TRÁMITE"
                    value={selectedKeys[0]}
                    onChange={(e) => {
                        setSelectedKeys(e.target.value ? [e.target.value] : []);
                    }}
                    onPressEnter={() => {
                        confirm();
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
                            confirm();
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
                            clearFilters();
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
        onFilter: (value, record) => {
            return record.tramite_padre.id
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase());
        },
        render: (text) => text,
    });
    const getColumnSearchProps = () => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder="NOMBRE DEL SOLICITANTE"
                    value={selectedKeys[0]}
                    onChange={(e) => {
                        setSelectedKeys(e.target.value ? [e.target.value] : []);
                    }}
                    onPressEnter={() => {
                        confirm();
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
                            confirm();
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
                            clearFilters();
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
        onFilter: (value, record) => {
            try {
                const persona = record.tramitable;
                const esPersonaMoral = !!persona?.persona_id;
                const nombre = esPersonaMoral ?
                    persona.razon_social :
                    `${persona.apellido_pat} ${persona.apellido_mot}, ${persona.nombre}`;
                return nombre
                        .toString()
                        .toLowerCase()
                        .includes(value.toLowerCase());
              } catch (error) {
                console.error(error);
                // Expected output: ReferenceError: nonExistentFunction is not defined
                // (Note: the exact output may be browser-dependent)
              }

        },
        render: (text) => text,
    });
    const getColumnLicenciaSearchProps = () => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder="#Licencia"
                    value={selectedKeys[0]}
                    onChange={(e) => {
                        setSelectedKeys(e.target.value ? [e.target.value] : []);
                    }}
                    onPressEnter={() => {
                        confirm();
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
                            confirm();
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
                            clearFilters();
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
        onFilter: (value, record) => {
            let numeroLicencia;
            const registrosFiltrados = record.ultima_revision?.estados_revision?.filter(recor => {
                const requisitos = recor.requisitos;
                return requisitos && requisitos.length >= 3;
            });
            const requisitos = registrosFiltrados[0].requisitos;
            const numeroLicenciaRequisito = requisitos?.find(r => r.requisito.id == 54);
            numeroLicencia = numeroLicenciaRequisito ? numeroLicenciaRequisito.valor : 'N/A';
            return numeroLicencia
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase());
        },
        render: (text) => text,
    });

    let columns = [
        {
            title: "ID del Trámite",
            key: "tramites",
            ...getColumnSearchIDProps(),
            sorter: (a, b) => (a.tramite_padre.id < b.tramite_padre.id ? 1 : 0),
            sortDirections: ["descend", "ascend"],
            render: (_, record) => {
                const pendiente = calcRevisionAtendida(record.ultima_revision);

                return (
                    <Space size="middle">
                        <Space size="middle">
                            {!!pendiente ? (
                                <div className="new-content-pending"></div>
                            ) : (
                                <div
                                    className="new-content-pending"
                                    style={{ backgroundColor: "lightgray" }}
                                ></div>
                            )}
                        </Space>
                        <Space size="middle">{record.tramite_padre.id}</Space>
                    </Space>
                );
            },
        },
        {
            title: "Nombre del solicitante",
            key: "nombre",
            ...getColumnSearchProps(),
            render: (text, record) => {
                const persona = record.tramitable;
                const esPersonaMoral = !!persona.persona_id;
                const nombre = esPersonaMoral ?
                    persona.razon_social :
                    `${persona.apellido_pat} ${persona.apellido_mot}, ${persona.nombre}`;
                const tipoPersona = esPersonaMoral ? 'Persona Moral' : 'Persona Fisica';

                return (
                    <div style={{ maxWidth: "400px", minWidth: "100px" }}>
                        <div>
                            <Space size="middle">
                                {nombre}
                            </Space>
                        </div>
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
                        <Tag color="gray">{tipoPersona}</Tag>
                    </div>
                );
            },
        },
    ].filter(Boolean);

    if(mostrarNumLicencia) {
        columns = [...columns,
            {
                title: "#Licencia",
                key: "numero_licencia",
                ...getColumnLicenciaSearchProps(),
                render: (text, record) => {
                    let numeroLicencia;
                    const registrosFiltrados = record.ultima_revision?.estados_revision?.filter(recor => {
                        const requisitos = recor.requisitos;
                        return requisitos && requisitos.length >= 3;
                    });
                    const requisitos = registrosFiltrados[0].requisitos;
                    const numeroLicenciaRequisito = requisitos?.find(r => r.requisito.id == 54);
                    numeroLicencia = numeroLicenciaRequisito ? numeroLicenciaRequisito.valor : 'N/A';
                    return (
                        <div style={{ maxWidth: "400px", minWidth: "100px" }}>
                            <span>{numeroLicencia}</span>
                        </div>
                    );
                },
            },]
    }

    columns = [...columns,
        {
            title: "Estatus",
            key: "status",

            filters: filteredStatus,
            onFilter: (value, record) => {
                let _status = record.ultima_revision.status;
                return _status == value;
            },
            onFilterDropdownOpenChange: (visible) => {},
            sorter: (a, b) =>
                a.ultima_revision.created_at - b.ultima_revision.created_at,
            sortDirections: ["descend"],
            render: (_, record) => {
                let _status = record.ultima_revision.status;
                const from = moment(record.ultima_revision.created_at);
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
            key: "Pago",

            filters: [
                { text: "N/A", value: "N/A" },
                { text: "PENDIENTE", value: "PENDIENTE" },
                { text: "VIGENTE", value: "VIGENTE" },
                { text: "PAGADO", value: "PAGADO" },
                { text: "EXPIRADO", value: "EXPIRADO" },
            ],
            onFilter: (value, record) => {
                let tramite = record;
                const requierePago = (tramite && tramite.catalogo_tramite.pago) ?? false;

                if (!requierePago) return "N/A" == value;

                const avisoEntero = tramite.aviso_entero;
                const estadoAvisoEntero = avisoEntero?.estado ?? "PENDIENTE";
                return estadoAvisoEntero == value;
            },

            render: (_, record) => {
                let tramite = record;
                const requierePago =
                    (tramite && tramite.catalogo_tramite.pago) ?? false;
                if (!requierePago) return "N/A";

                const avisoEntero = tramite.aviso_entero;

                const estadoAvisoEntero = avisoEntero?.estado ?? "PENDIENTE";
                return <Tag>Aviso {estadoAvisoEntero}</Tag>;
            },
        },
        {
            title: "– –",
            dataIndex: "id",
            key: "id",
            render: (text, record) => {
                return (
                    <Space size="middle">
                        <Link
                            to={`/app/tramites/${record.tramite_padre_id}/detalles`}
                            target="_blank"
                        >
                            DETALLES →
                        </Link>
                    </Space>
                );
            },
        },
    ];

    useEffect(() => {
        loadTramites();
    }, []);
    useEffect(() => {
        if (selectedYear ) {
            loadTramites()
        }
    }, [selectedYear])

    const loadTramites = async () => {
        axios
            .get("/entidad-revision/tramites/en-revision",
            {
                params: {
                    year: selectedYear
                }
            })
            .then(function (response) {
                setTramites(response.data);
            })
            .catch(function (error) {
                console.log("error al cargar tramites: ", error);
            });
    };

    return (
        <div>
            <RolesRouter />

            <div style={{width: '100%', display: 'flex', justifyContent: 'end', alignItems: 'center', padding: '10px'}}>
                <span style={{marginRight: '10px'}}>Año Fiscal: </span>
                <Select
                    defaultValue="2024"
                    style={{
                        width: 120,
                    }}
                    onChange={(value) => {

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
            <Table
                bordered
                className="tramites-table"
                dataSource={tramites}
                columns={columns}
                pagination={{
                    defaultPageSize: 50,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "50", "100", "500", "1000"],
                }}
            ></Table>
        </div>
    );
}

export default RevisionTramites;

// if (document.getElementById("negocios-content")) {
//     ReactDOM.render(<Negocios />, document.getElementById("negocios-content"));
// }
