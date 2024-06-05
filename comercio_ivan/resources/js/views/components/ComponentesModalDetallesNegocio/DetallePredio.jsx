import { Divider } from "antd";
import { useEffect } from "react";
import useGetInformacionDelPredio from "../../../utils/hooks/useGeInformacionDelPredio";
import LoadingIndicator from "../../../components/LoadingIndicator";
const tiposDePredios = {
    U: "Urbano",
    S: "Suburbano",
    R: "Rural",
    E: "Especial",
};
export default function DetallePredio({ tipo, clave_catastral }) {
    const [predioInfo, getInformacionDelPredio] = useGetInformacionDelPredio();
    useEffect(() => {
        getInformacionDelPredio(tipo, clave_catastral);
    }, []);
    return (
        <div>
            {/* <Divider orientation="left" plain>
                Información del Predio
            </Divider> */}
            {predioInfo ? (
                <div>
                    <p>
                        <strong>Propietario:</strong>
                        {` ${predioInfo?.propietario?.nombre ?? ""}`}
                    </p>
                    <p>
                        <strong>Terreno:</strong>
                        {` ${predioInfo?.terreno ?? ""}`}
                    </p>
                    <p>
                        <strong>Superficie de construcción:</strong>
                        {` ${predioInfo?.construccion ?? ""}`}
                    </p>
                    <p>
                        <strong>Tasa:</strong>
                        {` ${predioInfo?.tasa ?? ""}`}
                    </p>
                    <p>
                        <strong>Dirección:</strong>
                        {` ${predioInfo?.ubicacion_p ?? ""}`}
                    </p>
                    <p>
                        <strong>Clave catastral:</strong>
                        {` ${predioInfo?.clave_catastral ?? ""}`}
                    </p>
                    <p>
                        <strong>Folio:</strong>
                        {` ${predioInfo?.folio ?? ""}`}
                    </p>
                    <p>
                        <strong>Tipo:</strong>
                        {` ${tiposDePredios[predioInfo?.tipo ?? ""] ?? ""}`}
                    </p>
                </div>
            ) : (
                <LoadingIndicator />
            )}
        </div>
    );
}
