import { Divider } from "antd";

export default function DetallesPropietario({ negocio }) {
    return (
        <>
            {!!negocio.created_at && (
                <div className="sare--descriptions-column">
                    {!!negocio.persona && (
                        <div style={{ marginTop: 20 }}>
                            <Divider orientation="left" plain>
                                Propietario
                            </Divider>
                            <p>
                                <b className="label-info">Nombre: </b>
                                {negocio.persona.nombre || "N/D"}
                            </p>
                            <p>
                                <b className="label-info">Apellido Paterno: </b>
                                {negocio.persona.apellido_pat || "N/D"}
                            </p>
                            <p>
                                <b className="label-info">Apellido Materno: </b>
                                {negocio.persona.apellido_mot || "N/D"}
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
                        </div>
                    )}
                    {!!negocio.persona_moral && (
                        <div style={{ marginTop: 20 }}>
                            <Divider orientation="left" plain>
                                Persona Moral
                            </Divider>
                            <p>
                                <b className="label-info">Razón Social: </b>
                                {negocio.persona_moral.razon_social}
                            </p>
                            <p>
                                <b className="label-info">Régimen Capital: </b>
                                {negocio.persona_moral.regimen_capital || "N/D"}
                            </p>
                            <p>
                                <b className="label-info">RFC: </b>
                                {negocio.persona_moral.rfc}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
