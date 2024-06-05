import { Divider } from "antd";
export default function DetalleEstadistica({ negocio }) {
    return (
        <>
            {!!negocio.created_at && (
                <div className="sare--descriptions-column">
                    <div style={{ marginTop: 20 }}>
                        <Divider orientation="left" plain>
                            Anuncio
                        </Divider>
                        <p>
                            <b className="label-info">
                                Ancho / Largo de anuncio en metros:
                            </b>
                            {negocio.ancho_anuncio || "N/A"} /
                            {negocio.largo_anuncio || "N/A"}
                        </p>
                        <p>
                            <b className="label-info">Tipo de anuncio: </b>
                            {negocio.tipo_anuncio || "N/A"}
                        </p>
                        <p>
                            <b className="label-info">Leyenda de anuncio: </b>
                            {negocio.leyenda_anuncio || "N/A"}
                        </p>
                        <p>
                            <b className="label-info">Lugar de instalación: </b>
                            {negocio.lugar_instalacion || "N/A"}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
