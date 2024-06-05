import React, { useEffect } from "react";
import { createConstanciaInhabilitacionPdf } from "./componentes/Contraloria/pdfUtils";
import moment from "moment";
// import { Row, Col, Form } from "antd";
// import axios from "axios";
// import {
//     tiposIdentificacion,
//     indentificadores,
//     entidadesExpiden,
// } from "./componentes/Contraloria/constants";
const colProps = {
    className: "gutter-row",
    xs: 24,
    sm: 24,
    md: 24,
    lg: 24,
    xl: 24,
};

const colProps2 = {
    className: "gutter-row",
    xs: 24,
    sm: 24,
    md: 24,
    lg: 24,
    xl: 24,
};

const colProps3 = {
    className: "gutter-row",
    xs: 24,
    sm: 24,
    md: 24,
    lg: 24,
    xl: 24,
};
export default function ResolutivoPersonaDetalles({ resolutivo }) {
    const resolutivoDetalles = resolutivo?.detalles ? JSON.parse(resolutivo?.detalles) : null;
    // const identificacion =
    //     tiposIdentificacion.find((value) => value.id === resolutivoDetalles?.identificacion)
    //         ?.name ?? "-";
    // const identificador =
    //     indentificadores.find((value) => value.id === resolutivoDetalles?.identificador)
    //         ?.name ?? "-";
    // const entidad_expide =
    //     entidadesExpiden.find((value) => value.id === resolutivoDetalles?.entidad_expide)
    //         ?.name ?? "-";

    //const [tramitePersona, setTramitePersona] = useState(null);
    // useEffect(() => {
    //     axios
    //         .get(`/get_tramite_persona_w_persona/${resolutivo?.tramite_id}`)
    //         .then((response) => setTramitePersona(response?.data?.tramite_persona ?? null))
    //         .catch((error) => console.log(error));
    // }, []);
    useEffect(() => {
        const pdfName = resolutivo?.observaciones === "ConstanciaNoSujecion"
            ? "Constancia-NSPA"
            : resolutivo?.observaciones === "ConstanciaInhabilitacion"
                ? "Constancia-NITAPM"
                : ""
        createConstanciaInhabilitacionPdf({ ...resolutivoDetalles, fecha: moment(resolutivoDetalles?.fecha) }, true, pdfName)
    }, []);
    return (
        <div>
            <div id="pdf-preview-ci" style={{ height: "500px", width: "80%", margin: "0 auto" }}></div>
            {/* <Row gutter={[60, { xs: 16, sm: 16, md: 54, lg: 64 }]}>
                <Col {...colProps}>
                    <h3>Resolutivo</h3>
                    <Form.Item label="Solicitante">{resolutivoDetalles?.solicitante ?? "-"}</Form.Item>
                    <Form.Item label="CURP">{resolutivoDetalles?.curp ?? "-"}</Form.Item>
                    <Form.Item label="No. de Identificación">{resolutivoDetalles?.num_identifiacion ?? "-"}</Form.Item>
                    <Form.Item label="Días de vigencia">{resolutivoDetalles?.dias_vigencia ?? "-"}</Form.Item>
                    <Form.Item label="Fecha">{resolutivoDetalles?.fecha ?? "-"}</Form.Item>
                    <Form.Item label="Identificación">{identificacion}</Form.Item>
                    <Form.Item label="Identificador">{identificador}</Form.Item>
                    <Form.Item label="Entidad que expide">{entidad_expide}</Form.Item>
                </Col>
                <Col {...colProps3}></Col>
            </Row>
            {tramitePersona?.persona_type?.includes("PersonaMoral") && <Row gutter={[60, { xs: 16, sm: 16, md: 54, lg: 64 }]}>
                <Col {...colProps2}>Persona
                    <h4>Persona:</h4>
                    <Form.Item label="RFC">{tramitePersona?.persona?.rfc ?? "-"}</Form.Item>
                    <Form.Item label="Regimen capital">{tramitePersona?.persona?.rfc ?? "-"}</Form.Item>
                    <Form.Item label="Regimen fiscal">{tramitePersona?.persona?.rfc ?? "-"}</Form.Item>
                </Col>
            </Row>}
            {tramitePersona?.persona_type?.includes("User") && <Row gutter={[60, { xs: 16, sm: 16, md: 54, lg: 64 }]}>
                <Col {...colProps2}>Persona
                    <h4>Persona:</h4>
                    <Form.Item label="Nombre">
                        {`${tramitePersona?.persona?.nombre ?? "-"} ${tramitePersona?.persona?.apellido_pat ?? "-"} ${tramitePersona?.persona?.apellido_mot
                            ?? "-"}`}
                    </Form.Item>
                    <Form.Item label="Curp">
                        {tramitePersona?.persona?.curp ?? "-"}
                    </Form.Item>
                    <Form.Item label="RFC">
                        {tramitePersona?.persona?.rfc ?? "-"}
                    </Form.Item>
                    <Form.Item label="Correo:">{tramitePersona?.persona?.email ?? "-"}</Form.Item>
                </Col>
            </Row>} */}
        </div>
    );
}
