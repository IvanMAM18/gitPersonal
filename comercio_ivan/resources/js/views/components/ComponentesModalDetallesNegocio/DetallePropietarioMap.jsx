import { Divider, Card, Collapse } from "antd";
const { Panel } = Collapse;

export default function DetallePropietarioMap({ negocio }) {
    return (
        <>
            {negocio?.created_at && (
                <div className="sare--descriptions-column">
                    {!!negocio.persona && (
                        <>
                            <div style={{ marginTop: 20 }}>
                                <Collapse bordered={false}>
                                    <Panel header="Propietario" key="1">
                                        <p>
                                            <b className="label-info">Nombre: </b>
                                            {negocio.persona.nombre} {negocio.persona.apellido_pat} {negocio.persona.apellido_mot}
                                        </p>
                                        <p>
                                            <b className="label-info">Email: </b>
                                            {negocio.persona.email || "N/D"}
                                        </p>
                                        <p>
                                            <b className="label-info">CURP: </b>
                                            {negocio.persona.curp || "N/D"}
                                        </p>
                                        <p>
                                            <b className="label-info">RFC: </b>
                                            {negocio.persona.rfc || "N/D"}
                                        </p>
                                    </Panel>
                                </Collapse>
                            </div>

                            {!!negocio.persona_moral && (
                                <div style={{ marginTop: 20 }}>
                                    <Collapse bordered={false}>
                                        <Panel header="Persona Moral" key="2">
                                            <div style={{ marginTop: 20 }}>
                                                <p>
                                                    <b className="label-info">Razón Social: </b>
                                                    {negocio.persona_moral.razon_social}
                                                </p>
                                                <p>
                                                    <b className="label-info">RFC: </b>
                                                    {negocio.persona_moral.rfc}
                                                </p>
                                                <p>
                                                    <b className="label-info">
                                                        Direccion de Notificación:
                                                    </b><br />
                                                    <span><b className="label-info">Calle Principal:</b> {negocio.persona_moral.direccion_notificacion.calle_principal}</span><br />
                                                    <span><b className="label-info">Entre: </b>{negocio.persona_moral.direccion_notificacion.calles}</span><br />
                                                    <span><b className="label-info">Código Postal:</b> {negocio.persona_moral.direccion_notificacion.codigo_postal}</span><br />
                                                    <span><b className="label-info">Localidad: </b>{negocio.persona_moral.direccion_notificacion.colonia.nombre_localidad}</span><br />
                                                </p>
                                            </div>
                                        </Panel>
                                    </Collapse>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </>
    );
}
