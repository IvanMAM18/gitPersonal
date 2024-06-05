import React, {useState, useEffect} from 'react';
import catalogoRegimenFiscal from '../../../utils/regimenFiscalList';
import { Row, Col } from "antd";

function InformacionPersona({persona}) {
    if(!persona)
        return (<></>);

    const esPersonaMoral = !!persona.persona_id;
    const tieneDireccionNotificacion = !!persona.direccion_notificacion;

    const regimenFiscal = catalogoRegimenFiscal.find(regimen => {
        return regimen.id == persona.regimen_fiscal && (
            (regimen.persona_moral && esPersonaMoral) ||
            (regimen.persona_fisica && !esPersonaMoral)
        );
    })
    
    const columnProps = {
        className: "gutter-row",
        xs: 24,
        sm: 12,
        lg: 12,
        span: 8,
    };

    return (
        
        <Row>
            <Col {...columnProps}>
                <h3>Solicitante</h3>
                {
                    esPersonaMoral && <>
                        <p>
                            <b className="label-info">Razón social:</b> {persona.razon_social}
                        </p>
                        <p>
                            <b className="label-info">RFC:</b> {persona.rfc}
                        </p>
                        <p>
                            <b className="label-info">Régimen de capital:</b> {persona.rfc}
                        </p>
                        <p>
                            <b className="label-info">Email: </b>
                            { persona.persona.email || "N/D"}
                        </p>
                    </>
                }
                {
                    !esPersonaMoral && <>
                        <p>
                            <b className="label-info">Nombre:</b> {persona.nombre}
                        </p>
                        <p>
                            <b className="label-info">Apellido Paterno:</b> {persona.apellido_pat}
                        </p>
                        <p>
                            <b className="label-info">Apellido Materno:</b> {persona.apellido_mot}
                        </p>
                        <p>
                            <b className="label-info">CURP:</b> {persona.curp || "N/D"}
                        </p>
                        <p>
                            <b className="label-info">RFC:</b> {persona.rfc || "N/D"}
                        </p>
                        <p>
                            <b className="label-info">Email: </b>
                            { persona.email || "N/D"}
                        </p>
                    </>
                }

                <p>
                    <b className="label-info">Régimen fiscal:</b> { 
                        regimenFiscal ? 
                            `${regimenFiscal.id} - ${regimenFiscal.name}` : 
                            'N/D' 
                    }
                </p>
            </Col>
            {
                tieneDireccionNotificacion && <Col {...columnProps}>
                    <h3>Dirección de Notificación</h3>
                    <p>
                        <b className="label-info">Calle: </b>
                        {persona.direccion_notificacion.calle_principal ||
                            "N/D"}
                    </p>
                    <p>
                        <b className="label-info">
                            Entre calles:
                        </b>
                        {persona.direccion_notificacion.calles || "N/D"}
                    </p>
                    <p>
                        <b className="label-info">
                            Código postal:
                        </b>
                        {persona.direccion_notificacion.codigo_postal ||
                            "N/D"}
                    </p>
                    <p>
                        <b className="label-info">Nº Ext: </b>
                        {persona.direccion_notificacion.numero_externo ||
                            "N/D"}
                    </p>
                    <p>
                        <b className="label-info">Nº Int: </b>
                        {persona.direccion_notificacion.numero_interno ||
                            "N/D"}
                    </p>
                    <p>
                        <b className="label-info">Tipo: </b>
                        {persona.direccion_notificacion.tipo || "N/D"}
                    </p>
                </Col>
            }
        </Row>
    )
}

export default InformacionPersona;