import { Divider, Row, Col } from "antd";
import { useEffect } from "react";
import useGetColonibyId from "../../../utils/hooks/useGetColonibyId";

const colProps = {
    className: "gutter-row",
    xs: 24,
    sm: 24,
    md: 12,
    lg: 12,
    xl: 12,
};
const tiposDePredios = {
    U: "Urbano",
    S: "Suburbano",
    R: "Rural",
    E: "Especial",
};
export default function DetalleDireccion({ negocio }) {
    const [colonia, getColonia] = useGetColonibyId();
    let direccionNotificacion =
        negocio.persona && negocio.persona.direccion_notificacion;
    if (negocio.persona_moral) {
        direccionNotificacion = negocio.persona_moral.direccion_notificacion;
    }
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
                                    <p>
                                        <b className="label-info">
                                            Clave Catastral/Folio:
                                        </b>
                                        {negocio.clave_catastral || "N/D"}
                                    </p>
                                    <p>
                                        <b className="label-info">
                                            Tipo de predio:
                                        </b>
                                        {negocio.tipo_predio
                                            ? tiposDePredios[
                                                  negocio.tipo_predio
                                              ]
                                            : "N/D"}
                                    </p>
                                    <p>
                                        <b className="label-info">Tipo: </b>
                                        {negocio.direccion.tipo || "N/D"}
                                    </p>
                                    {
                                        !!negocio.tipo_predio_propiedad &&
                                        <p><b className="label-info">Propiedad del predio: </b> {negocio.tipo_predio_propiedad}</p>
                                    }
                                </div>
                            )}
                        </Col>
                        <Col {...colProps}>
                            {!!direccionNotificacion && (
                                <div style={{ marginTop: 20 }}>
                                    <Divider orientation="left" plain>
                                        Dirección de Notificación
                                    </Divider>
                                    <p>
                                        <b className="label-info">Calle: </b>
                                        {direccionNotificacion.calle_principal ||
                                            "N/D"}
                                    </p>
                                    <p>
                                        <b className="label-info">
                                            Entre calles:
                                        </b>
                                        {direccionNotificacion.calles || "N/D"}
                                    </p>
                                    <p>
                                        <b className="label-info">
                                            Código postal:
                                        </b>
                                        {direccionNotificacion.codigo_postal ||
                                            "N/D"}
                                    </p>
                                    <p>
                                        <b className="label-info">Nº Ext: </b>
                                        {direccionNotificacion.numero_externo ||
                                            "N/D"}
                                    </p>
                                    <p>
                                        <b className="label-info">Nº Int: </b>
                                        {direccionNotificacion.numero_interno ||
                                            "N/D"}
                                    </p>
                                </div>
                            )}
                        </Col>
                    </Row>
                </div>
            )}
        </>
    );
}
