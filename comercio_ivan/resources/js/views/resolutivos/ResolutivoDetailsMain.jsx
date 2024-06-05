import React, { useEffect, useState } from "react";
import useGetResolutivoPorFolio from "../../utils/hooks/useGetResolutivoPorFolio";
import ResolutivoPersonaDetalles from "./ResolutivoPersonaDetalles";
import ResolutivoNegocioDetalles from "./ResolutivoNegocioDetalles";


export default function ResolutivoDetailsMain() {
    const folio = window?.resolutivo_folio ?? null;
    const [resolutivo, getResolutivo] = useGetResolutivoPorFolio();
    const [detallesResolutivo, setDetallesResolutivo] = useState(null);
    const setDetallesResolutivoData = () => {
        try {
            const detalles = JSON.parse(resolutivo?.detalles);
            setDetallesResolutivo(detalles);
        } catch (error) {
            setDetallesResolutivo(null);
        }
    };
    useEffect(() => {
        if (folio !== null && resolutivo === null) {
            getResolutivo(folio);
        }
        if (resolutivo !== null) {
            setDetallesResolutivoData(resolutivo);
        }
    }, [resolutivo]);

    return (
        <div className="details-container">
            <h1>
                Resolutivo: <i>{resolutivo?.folio ?? "Folio no valido"}</i>
            </h1>
            <hr />
            {resolutivo && (resolutivo?.entidad_revisora_id ?? 0) !== 7 && (
                <ResolutivoNegocioDetalles
                    negocio={resolutivo?.negocio ?? null}
                />
            )}
            {resolutivo && (resolutivo?.entidad_revisora_id ?? 0) === 7 && (
                <ResolutivoPersonaDetalles
                    resolutivo={resolutivo ?? null}
                />
            )}
        </div>
    );
}
