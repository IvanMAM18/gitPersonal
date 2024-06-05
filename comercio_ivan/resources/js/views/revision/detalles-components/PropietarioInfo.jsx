import React from "react";
import {
    Card,
} from "antd";
import status from "../../../utils/statuses";
import impactos from "../../../utils/impactoGiroComercial";

function PropietarioInfo({ negocio }) {
    return (
        <>
            {!!negocio.persona && (
                <div>
                    <Card className="detalles-entidad-card-container">
                        <h5>Propietario</h5>
                        <div>
                            <b className="label-info">Usuario: </b>
                            <p>{negocio.persona.nombre || "N/D"} {negocio.persona.apellido_pat || ""} {negocio.persona.apellido_mot || ""}</p>
                        </div>

                        <div>
                            <b className="label-info">Email: </b>
                            <p>{negocio.persona.email || "N/D"}</p>
                        </div>
                        <div>
                            <b className="label-info">CURP: </b>
                            <p>{negocio.persona.curp || "N/D"}</p>
                        </div>
                        <div>
                            <b className="label-info">RFC: </b>
                            <p>{negocio.persona.rfc || "N/D"}</p>
                        </div>
                    </Card>
                </div>
            )}
        </>
    )
}

export default PropietarioInfo;