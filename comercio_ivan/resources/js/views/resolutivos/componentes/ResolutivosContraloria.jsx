import React, { useEffect, useRef, useState } from "react";
import { Input, Table, Space, Button, Spin, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { getResolutivoStatus } from "./Contraloria/utils";
import ResolutivosCollapseContainer from "./Contraloria/ResolutivosCollapseContainer";

export default function ResolutivosContraloria() {
    const searchInput = useRef(null);

    const [tramitesPersona, setTramitesPersona] = useState(null);
    const [currentTramite, setCurrentTramite] = useState(null);

    const getColumnSearchTramiteIDProps = (_dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder="Nombre del Giro Comercial"
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() => confirm()}
                    style={{
                        marginBottom: 8,
                        display: "block",
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => confirm()}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Buscar
                    </Button>
                    <Button
                        title="No cierra el buscador"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                        }}
                        style={{ width: 90 }}
                    >
                        Filtrar
                    </Button>
                    <Button
                        type="link"
                        onClick={() => clearFilters()}
                        size="small"
                        style={{ width: 120 }}
                    >
                        Limpiar filtro
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
            record?.id.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) => text,
    });

    const getTramitesConTramitePersona = () => {
        axios
            .get("/app/get_tramites_con_tramite_persona")
            .then(({ data }) => setTramitesPersona(data))
            .catch((error) => {
                console.log({ error });
                setTramitesPersona([]);
            });
    };

    useEffect(() => {
        getTramitesConTramitePersona();
    }, []);

    const columns = [
        {
            title: "Trámite ID",
            key: "tramite_persona_id",
            ...getColumnSearchTramiteIDProps("id"),
            render: (text, record) => (
                <Space size="middle">{record?.tramite_persona_id}</Space>
            ),
        },
        {
            title: "Trámite",
            key: "nombre_tramite",
            filters: [
                {
                    text: "Licencia de funcionamiento",
                    value: "Licencia de funcionamiento",
                },
                {
                    text: "Refrendo Licencia de funcionamiento",
                    value: "Refrendo Licencia de funcionamiento",
                },
            ],
            onFilter: (value, record) => record?.nombre_tramite === value,
            render: (text, record) => (
                <Space size="middle">{record?.nombre_tramite}</Space>
            ),
        },
        {
            title: "Nombre de la persona",
            key: "nombre_persona",
            render: (text, record) => (
                <Space size="middle">{record.nombre_persona}</Space>
            ),
        },
        {
            title: "Tipo Persona",
            key: "tipo_persona",
            render: (text, record) => <Tag>{record?.tipo_persona}</Tag>,
        },
        {
            title: "Tipo Trámite",
            key: "tipo_tramite",
            render: (text, record) => <Tag>{record?.tipo_tramite}</Tag>,
        },
        {
            title: "Estado",
            key: "status",
            render: (text, record) => <Tag>{record?.status}</Tag>,
        },
        {
            title: "Resolutivo",
            key: "status_resolutivo",
            render: (text, record) => getResolutivoStatus(record?.resolutivo),
        },
        {
            title: "– –",
            dataIndex: "actions",
            key: "actions",
            render: (text, record) => (
                <Space size="middle" key={record?.id ?? Math.random()}>
                    <Button
                        type="link"
                        onClick={() => setCurrentTramite(record)}
                    >
                        Detalles →
                    </Button>
                </Space>
            ),
        },
    ];

    const getContent = () =>
        currentTramite === null ? (
            tramitesPersona !== null ? (
                <Table
                    className="negocios-table"
                    dataSource={tramitesPersona}
                    columns={columns}
                ></Table>
            ) : (
                <div
                    style={{
                        height: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Spin size={"large"} />
                </div>
            )
        ) : (
            <ResolutivosCollapseContainer tramite={currentTramite} />
        );
    return (
        <>
            <div>
                <Button
                    style={{ marginBottom: 15 }}
                    type="link"
                    onClick={() => setCurrentTramite(null)}
                >
                    Volver a la lista de resolutivos
                </Button>
            </div>
            {getContent()}
        </>
    );
}
