import React from "react";
import {
    Card,
    Image
} from "antd";
import status from "../../../utils/statuses";
import impactos from "../../../utils/impactoGiroComercial";

function GeneralHeader({negocio}) {

    return (
        <div>
            <Card className="detalles-entidad-card-container"
                style={{
                    height: "100%",
                }}
                cover={
                <Image style={{
                    height: 250,
                    objectFit: "cover",
                }} alt="example" src={"/"+negocio.foto_frontal_fachada} />}
            >
                <div>
                        <div className="sare--descriptions-column">
                        <h3>Negocio</h3>
                        <p>
                            <b>Nombre: </b> {negocio.nombre_del_negocio}
                        </p>
                        <p>
                            <b className="label-info">Teléfono: </b>
                            {negocio.telefono || "N/D"}
                        </p>
                        <p>{impactos.tag(negocio.impacto_giro_comercial)} 
                            {status.tag(
                                `${negocio?.status === "APROBADO"
                                    ? negocio?.status + "_DN"
                                    : negocio?.status
                                }`
                            )}</p>
                        
                    </div>
                </div>
            </Card>
        </div>

    )
}

export default GeneralHeader;