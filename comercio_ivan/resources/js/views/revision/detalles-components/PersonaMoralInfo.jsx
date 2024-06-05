import React from "react";
import {
    Card,
} from "antd";
import status from "../../../utils/statuses";
import impactos from "../../../utils/impactoGiroComercial";

function PersonaMoralInfo({ negocio }) {
    return (
        <>
           {!!negocio.persona_moral &&
                negocio.persona_moral != null ? (
                <Card className="detalles-entidad-card-container">
                    <div>
                        <h5>Persona Moral</h5>
                        <p>
                            <b className="label-info">
                                Razón Social:
                            </b>
                            {negocio.persona_moral.razon_social}
                        </p>
                        <p>
                            <b className="label-info">RFC: </b>
                            {negocio.persona_moral.rfc}
                        </p>
                    </div>
                </Card>
            ) : (
                <Card className="detalles-entidad-card-container">
                    <div>
                        <h5>Persona Moral</h5>
                        <p>N/A</p>
                    </div>
                </Card>
            )}
        </>
    )
}

export default PersonaMoralInfo;