import { Divider, Row, Col } from "antd";
import { useEffect } from "react";
import useGetColonibyId from "../../../../utils/hooks/useGetColonibyId";
import GoogleMapReact from "google-map-react";

const AnyReactComponent = ({ text }) => (
    <div style={{ height: 33, width: 25 }}>
        <img
            src="/imagenes/location-dot-solid.png"
            style={{ width: "100%" }}
        ></img>
    </div>
);
const colProps = {
    className: "gutter-row",
    xs: 24,
    sm: 24,
    md: 24,
    lg: 24,
    xl: 24,
};
const tiposDePredios = {
    U: "Urbano",
    S: "Suburbano",
    R: "Rural",
    E: "Especial",
};
export default function DetalleDireccionResolutivo({ negocio }) {
    const [colonia, getColonia] = useGetColonibyId();
    let direccionNotificacion =
        negocio.persona && negocio.persona.direccion_notificacion;
    if (negocio.persona_moral) {
        direccionNotificacion = negocio.persona_moral.direccion_notificacion;
    }
    const defaultPropsD1 = {
        center: {
            lat: +negocio?.direccion?.latitud ?? 24.141858,
            lng: +negocio?.direccion?.longitude ?? -110.313095,
        },
        zoom: 14,
    };
    useEffect(() => {
        getColonia(negocio?.direccion?.colonia_id ?? 0);
    }, []);
    return (
        <>
            {!!negocio.created_at && (
                <div className="sare--descriptions-column">
                    <Row gutter={[24, { xs: 8, sm: 8, md: 24, lg: 32 }]}>
                        <Col {...colProps}>
                            {!!negocio.direccion && (
                                <div style={{ marginTop: 20 }}>
                                    <Divider orientation="left" plain>
                                        Dirección
                                    </Divider>
                                    <p>
                                        <b className="label-info">Calle: </b>
                                        {negocio.direccion.calle_principal ||
                                            "N/D"}
                                    </p>
                                    <p>
                                        <b className="label-info">
                                            Entre calles:
                                        </b>
                                        {negocio.direccion.calles || "N/D"}
                                    </p>
                                    <p>
                                        <b className="label-info">
                                            Código postal:
                                        </b>
                                        {negocio.direccion.codigo_postal ||
                                            "N/D"}
                                    </p>
                                    <p>
                                        <b className="label-info">Colonia:</b>
                                        {colonia?.nombre_localidad ?? "N/D"}
                                    </p>
                                    <p>
                                        <b className="label-info">Nº Ext: </b>
                                        {negocio.direccion.numero_externo ||
                                            "N/D"}
                                    </p>
                                    <p>
                                        <b className="label-info">Nº Int: </b>
                                        {negocio.direccion.numero_interno ||
                                            "N/D"}
                                    </p>
                                </div>
                            )}
                            <hr></hr>
                            <div style={{ height: "350px", width: "100%" }}>
                                <GoogleMapReact
                                    bootstrapURLKeys={{
                                        key: "AIzaSyAp2zsijKSTOl9BLx6CDcyNIN9KhINXTzM",
                                    }}
                                    defaultCenter={defaultPropsD1.center}
                                    defaultZoom={defaultPropsD1.zoom}
                                >
                                    <AnyReactComponent
                                        lat={
                                            +negocio?.direccion?.latitud ??
                                            24.141858
                                        }
                                        lng={
                                            +negocio?.direccion?.longitude ??
                                            -110.313095
                                        }
                                        text={
                                            negocio?.direccion
                                                ?.calle_principal ?? ""
                                        }
                                    />
                                </GoogleMapReact>
                            </div>
                        </Col>
                    </Row>
                </div>
            )}
        </>
    );
}
