import React, { useState, useEffect } from "react";
import { Spin, Table, Space, Tabs, Tag, Button, Divider, DatePicker, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import status from "../utils/statuses";
import ExpedienteCompletadoWidget from "../components/ExpedienteCompletadoWidget";
import RolesRouter from "./RolesRouter";
import CompletarDatosFaltantes from "./components/CompletarDatosFaltantes";
import moment from 'moment';
import RefrendoDesdeTramites from "./components/RefrendoDesdeTramites/RefrendoDesdeTramites";

const { Text } = Typography;

const misTramitesColumns = [
    { title: "ID Trámite", dataIndex: "tramite_id", key: "tramite_id" },
    { title: "Trámite", dataIndex: "nombre_tramite", key: "nombre_tramite" },
    { title: "Nombre", dataIndex: "nombre", key: "nombre" },
    {
        title: "Estatus",
        dataIndex: "status",
        key: "status",
        render: (_, negocio) => {
            return negocio.revisiones.map((revision) => {
                const tramite = revision.tramites.find(
                    (_tramite) =>
                        _tramite.catalogo_tramites[0]
                            .entidad_revisora_id ===
                        revision.entidad_revision_id
                );

                if (!tramite) {
                    return (
                        <span key={"erid" + revision.id}>
                            <span className="comercio-admin-progreso-row">
                                {revision.entidad.nombre}
                                <Tag
                                    color={status.color(
                                        revision.status
                                    )}
                                >
                                    {revision.status}
                                </Tag>
                            </span>
                            <Divider type="vertical" />
                        </span>
                    );
                }
                const catalogoTramite =
                    tramite.catalogo_tramites[0];

                const avisoEntero = tramite.aviso_entero;

                const estadoAvisoEntero =
                    avisoEntero?.estado ?? "PENDIENTE";

                return (
                    <span key={"erid" + revision.id}>
                        <span className="comercio-admin-progreso-row">

                            {revision.entidad.nombre}
                            <Tag
                                color={status.color(
                                    revision.status
                                )}
                            >
                                {revision.status}
                            </Tag>
                            {catalogoTramite.pago ? (
                                <Tag>
                                    AVISO {estadoAvisoEntero}
                                </Tag>
                            ) : null}
                        </span>
                        <Divider type="vertical" />
                    </span>
                );
            });
        },
        width: "30%",
    },
    {
        width: 120,
        title: "– –",
        dataIndex: "link",
        key: "link",
        render: (link) => {
            return (
                <Space size="middle">
                    <Link to={link}>IR →</Link>
                </Space>
            );
        },
    },
];



function Tramites() {
    const [expedienteCompleto, setExpedienteCompleto] = useState(true);
    const [refrendoDesdeTramites, setRefrendoDesdeTramites] = useState(false);
    const [añoSeleccionado, setAñoSeleccionado] = useState(moment());
    const [tramites, setTramites] = useState(null);
    const [mis_tramites, setMisTramites] = useState(null);
    const [tramites_persona, setTramitesPersona] = useState(null);
    const [mis_tramites_persona, setMisTramitesPersona] = useState(null);
    const navigate = useNavigate();

    const cargandoTramites = tramites === null;
    const existenTramites = tramites != null && tramites.length > 0;

    const mis_tramites_mix = mis_tramites ? [...mis_tramites, ...mis_tramites_persona] : [];

    useEffect(() => {
        obtenerTramites();
    }, []);

    useEffect(() => {
        setTramites(null);
        obtenerTramites();
    }, [añoSeleccionado]);

    const compararTramites = (a, b) => {
        const order = {
            "LICENCIA DE FUNCIONAMIENTO": 1,
            "REFRENDO LICENCIA DE FUNCIONAMIENTO": 2,
            "REFRENDO DE LICENCIA DE ALCOHOLES": 3
        };

        return order[a?.nombre?.toUpperCase()] - order[b?.nombre?.toUpperCase()];
    };

    const obtenerTramites = () => {
        const year = añoSeleccionado ? añoSeleccionado.year() : null;
        axios.get("/app/tramites", { params: { year } }).then((result) => {
            const tramitesForTables = [...result.data.tramites, ...result.data.tramites_persona];
            setTramites(
                tramitesForTables
                    .filter(tramite => tramite.nombre.includes("Licencia"))
                    .sort(compararTramites)
            );
            setTramitesPersona(
                tramitesForTables
                    .filter(tramite => tramite.nombre.includes("Licencia") === false)
            );
            setMisTramites(result.data.mis_tramites);
            setMisTramitesPersona(result.data.mis_tramites_persona);
        });
    };

    const iniciarTramiteNegocio = (tramite) => {
        if (!expedienteCompleto) {
            alert(
                "Debes completar el expediente antes de iniciar un trámite"
            );
            return;
        }
        localStorage.tramite_link = tramite.link;
        localStorage.tramite_padre_id = tramite.id;
        localStorage.tramite_padre_nombre =
            tramite.nombre;

        if (tramite?.id === 3) {
            setRefrendoDesdeTramites(true);
        } else {
            navigate(tramite.link);
        }
    };

    const iniciarTramitePersona = (tramite) => {
        if (!expedienteCompleto) {
            alert(
                "Debes completar el expediente antes de iniciar un trámite"
            );
            return;
        }

        if (tramite.link != '/') {
            navigate(tramite.link);
            return;
        }

        const slug = tramite.nombre.toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
        navigate(`/app/iniciar-tramite/${tramite.id}/${slug}`)
    };

    const tramitesDisponibles = [
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
            width: 120,
            title: "– –",
            dataIndex: "link",
            key: "link",
            render: (_, record) => {
                return (
                    <Space size="middle">
                        <Button
                            type="link"
                            onClick={() => {
                                if (record.tipo_tramite == 'NEGOCIO')
                                    iniciarTramiteNegocio(record)
                                if (record.tipo_tramite == 'PERSONA')
                                    iniciarTramitePersona(record);
                            }}
                        >
                            INICIAR TRÁMITE
                        </Button>
                        {record?.id === 3 && refrendoDesdeTramites && <RefrendoDesdeTramites setRefrendoDesdeTramites={setRefrendoDesdeTramites} refrendoDesdeTramites={refrendoDesdeTramites} />}
                    </Space>
                );
            },
        },
    ];
    return (
        <div className="sare--container">
            <RolesRouter />
            <ExpedienteCompletadoWidget
                onEstaCompletado={(_completo) =>
                    setExpedienteCompleto(_completo)
                }
            />

            <CompletarDatosFaltantes />

            <Tabs>
                <Tabs.TabPane
                    tab="Mis trámites activos"
                    key="tramites-activos"
                //disabled={mis_tramites.length === 0}
                >
                    <Space direction="vertical" style={{ width: "100%" }}>
                        <Space>
                            <Text strong>Año Fiscal:</Text>
                            <DatePicker
                                disabledDate={
                                    (date) => date && date.year() < 2023
                                }
                                picker="year"
                                placeholder="Selecciona un año"
                                onChange={(date) => setAñoSeleccionado(date)}
                                defaultValue={añoSeleccionado}
                            />
                        </Space>

                        {cargandoTramites ? (
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
                        ) : (
                            <>
                                {mis_tramites.length > 0 || mis_tramites_persona.length > 0 ? (
                                    <Table
                                        dataSource={mis_tramites_mix}
                                        columns={misTramitesColumns}
                                        rowKey={(record) => record.id}
                                    />
                                ) : (
                                    <h4>No tiene trámites en curso</h4>
                                )}
                            </>
                        )}
                    </Space>
                </Tabs.TabPane>
                <Tabs.TabPane
                    tab="Trámites disponibles"
                    key="tramites-disponibles"
                //disabled={tramites.length === 0}
                >
                    {
                        cargandoTramites && <div
                            style={{
                                height: 200,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Spin size={"large"} />
                        </div>
                    }

                    {
                        existenTramites && <>
                            <h2>Licencias</h2>
                            <Table
                                dataSource={tramites}
                                columns={tramitesDisponibles}
                                rowKey={(record) => record.id}
                            />

                            <h2>Constancias</h2>
                            <Table
                                dataSource={tramites_persona}
                                columns={tramitesDisponibles}
                                rowKey={(record) => record.id}
                            />
                        </>
                    }
                </Tabs.TabPane>
            </Tabs>

        </div>
    );
}

export default Tramites;
