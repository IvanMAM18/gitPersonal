import React, { useState, useEffect } from "react";
import { Table, Tag, Space, Modal, Input, Button, message } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined, ShopOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import status from "../../../utils/statuses";
import CrudNegocio from "../../../Administrador/Cruds/CrudNegocio/CrudNegocio";
import RefrendoIndividualLink from "../RefrendoIndividual/RefrendoIndividualLink";
import useGetGirosComerciales from "../RefrendoIndividual/Componentes/SelectGiros/Hooks/useGetGirosComerciales";

function NegociosTable({ negocios }) {
    const [giros, getGiros] = useGetGirosComerciales();
    useEffect(() => {
        getGiros();
    }, []);
    const [negocioABorrarId, setNegocioABorrarId] = useState(null);
    const [negocioABorrarNombre, setNegocioABorrarNombre] = useState("");
    const [confirmarBorrarTexto, setConfirmarBorrarTexto] = useState("");
    const [loading, setLoading] = useState(false);

    const abrirBorrarTramiteModal = (id, nombre_del_negocio) => {
        setNegocioABorrarId(id);
        setNegocioABorrarNombre(nombre_del_negocio);
    };

    const cerrarModal = () => {
        setConfirmarBorrarTexto("");
        setNegocioABorrarId(null);
    };

    const borrarTramite = () => {
        setLoading(true);
        axios
            .post("/app/borrar-negocio/" + negocioABorrarId)
            .then((response) => {
                if (response.data) {
                    if (!response.data.ok) {
                        setLoading(false);
                        message.error(
                            response.data.message || "Error al borrar trámite"
                        );
                        return;
                    }
                    message.success(`${response?.data?.message}`);
                    setTimeout(()=>{location.reload();},1000);
                    
                }
            })
            .catch((error) => {
                setLoading(false);
                message.error("Error al borrar trámite");
            });
    };

    const checkValidoUsoSueloAnnioPasado = (tramites) => {
        if ((tramites?.length ?? 0) === 0)
            return false;
        const tramitesAnnioPasadoUsoSuelo = tramites?.filter(tramite =>
            new Date(tramite?.created_at).getFullYear() === new Date().getFullYear() - 1
            && [5, 6].includes(tramite?.catalogo_tramites_id)
            && ["APROBADO", "VISTO BUENO", "VISOR"].includes(tramite?.ultima_revision?.status)
            && (
                (tramite?.catalogo_tramites_id === 6
                    && tramite?.aviso_entero !== null
                    && tramite?.aviso_entero?.pagado === true) || tramite?.catalogo_tramites_id === 5
            ))
        if (tramitesAnnioPasadoUsoSuelo.length === 0) return false;
        return true;

    }

    const columns = [
        {
            title: "ID del Negocio",
            dataIndex: "id",
            key: "id",
            width: 120,
            render: (id) => {
                return (
                    <div>
                        <p>{id}</p>
                    </div>
                );
            },
        },
        {
            title: "Empresa",
            dataIndex: "nombre_del_negocio",
            key: "nombre_del_negocio",
            width: 200,
        },
        {
            width: 200,
            title: "Tipo",
            dataIndex: "persona_moral",
            key: "persona_moral",
            render: (persona_moral) => {
                if (persona_moral == undefined || persona_moral == null) {
                    return (
                        <div>
                            <p>Persona Física</p>
                        </div>
                    );
                } else {
                    return (
                        <div>
                            <p>Persona Moral </p>
                        </div>
                    );
                }
            },
        },
        {
            width: 200,
            title: "Identificador",
            dataIndex: "persona_moral",
            key: "persona",
            render: (persona, persona_moral) => {
                if (persona == undefined || persona == null) {
                    return (
                        <div>
                            <p>
                                {persona_moral.persona.nombre}{" "}
                                {persona_moral.persona.apellido_pat}{" "}
                                {persona_moral.persona.apellido_mot}
                            </p>
                        </div>
                    );
                } else {
                    return (
                        <div>
                            <p>{persona.razon_social}</p>
                        </div>
                    );
                }
            },
        },
        {
            width: 120,
            title: "Estatus",
            dataIndex: "estador",
            key: "estador",
            render: (estador) => {
                return <Tag color={status.color(estador)}>{estador}</Tag>;
            },
        },
        {
            width: 140,
            title: "– –",
            dataIndex: "id",
            key: "id",
            render: (id, record) => {
                return (
                    <Space size="middle" direction={"horizontal"}>
                        <Link to={`/app/mis-negocios/${id}`}>
                            <ExclamationCircleOutlined style={{ fontSize: 16 }} />
                        </Link>
                        <a href={`/negocio/${record.id}/qr`} target="_blank">
                            <ShopOutlined />
                        </a>
                        <CrudNegocio negocio={record} />
                        {record?.tramite_comercio_refrendo_current_year?.length === 0
                            && checkValidoUsoSueloAnnioPasado(record?.tramites ?? [])
                            && <RefrendoIndividualLink negocio={record} giros={giros} />}

                            <Button type="link" danger onClick={() =>
                                abrirBorrarTramiteModal(
                                    id,
                                    record.nombre_del_negocio
                                )
                            }>
                                <DeleteOutlined style={{ fontSize: 16 }} />
                            </Button>
                    </Space>
                );
            },
        },
    ];

    return (
        <>
            <Table
                dataSource={negocios}
                columns={columns}
                rowKey={(record) => record.id}
            />
            <Modal
                open={!!negocioABorrarId}
                footer={null}
                onCancel={cerrarModal}
            >
                <p>
                    Esta acción no se puede deshacer ¿Está seguro de borrar el
                    negocio "{negocioABorrarNombre}"?
                </p>
                <p></p>
                <Input
                    disabled={loading}
                    value={confirmarBorrarTexto}
                    placeholder="Escriba 'BORRAR' para confirmar"
                    onChange={(e) => setConfirmarBorrarTexto(e.target.value)}
                />
                <p></p>
                <Button
                    loading={loading}
                    disabled={confirmarBorrarTexto.toUpperCase() !== "BORRAR"}
                    onClick={borrarTramite}
                    type="primary"
                    block
                >
                    BORRAR TRÁMITE
                </Button>
                <p></p>
                <Button
                    loading={loading}
                    disabled={loading}
                    onClick={cerrarModal}
                    block
                >
                    CANCELAR
                </Button>
            </Modal>
        </>
    );
}

export default NegociosTable;
