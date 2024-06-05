import { useEffect } from "react";
import { Divider } from "antd";
import useGetRecoleccionBasuraInfoByTarifaId from "../../../utils/hooks/useGetRecoleccionBasuraInfoByTarifaId";

export default function DetalleRecoleccionBasura({ tarifa_recoleccion_id, negocio }) {
    const [recoleccionBasuraInfo, getRecoleccionBasuraInfoByTarifaId] =
        useGetRecoleccionBasuraInfoByTarifaId();
    useEffect(() => {
        getRecoleccionBasuraInfoByTarifaId(tarifa_recoleccion_id);
    }, [tarifa_recoleccion_id]);
    return (

        <div style={{ marginTop: 20 }}>
            {/* <Divider orientation="left" plain>
                Recolección de basura
            </Divider> */}
            {(recoleccionBasuraInfo?.periodo ?? "") !== "" &&
            (recoleccionBasuraInfo?.volumen ?? "") ? (
                
                <>
                    <p>
                        <b>Periodo: </b>
                        {recoleccionBasuraInfo?.periodo || ""}
                    </p>
                    <p>
                        <b>Volumen: </b>
                        {recoleccionBasuraInfo?.volumen || ""}
                    </p>
                    <p>
                        <b>Servicio privado de recolección de basura: </b>
                        {negocio.servicio_priv_recoleccion || 'N/A'}
                    </p>
                </>
            ) : (
                <div>
                    <p>
                        <b>Descripción: </b>
                        {recoleccionBasuraInfo?.descripcion ?? ""}
                    </p>
                    <p>
                        <b>Servicio privado de recolección de basura: </b>
                        {negocio.servicio_priv_recoleccion || 'N/A'}
                    </p>
                </div>
            )}
        </div>
    );
}
