import React, { useEffect, useState } from "react";
import { Form, Tabs } from "antd";
import Direccion from "./Direccion";
import "./CrudPersonaModalStyles.scss";

export default function DireccionesPersonaMoral({
    personaMoral,
    codigosPostales,
}) {
    const [isTabChanged, setIsTabChanged] = useState(false);
    const [direccionId, setDireccionId] = useState(
        personaMoral?.direccion_id ?? null
    );
    const [direccionNotificacionId, setDireccionNotificacionId] = useState(
        personaMoral?.direccion_de_notificacion_id ?? null
    );

    const getDireccionHelpText = () => (
        <strong>
            {direccionId === direccionNotificacionId
                ? "La dirección de la persona moral y la dirección de notificación son la misma, si actualiza una se actualizaran ambas"
                : ""}
        </strong>
    );
    const onChange = (key) => {
        console.log(key);
        setIsTabChanged(!isTabChanged);
    };
    const items = [
        {
            key: "1",
            label: `Dirección de facturación`,
            children: (
                <>
                    <p>{getDireccionHelpText()}</p>

                    <Direccion
                        key={"direccion_id"}
                        showAdd={direccionId === direccionNotificacionId}
                        setDireccionNotificacionId={setDireccionNotificacionId}
                        setDireccionId={setDireccionId}
                        codigosPostales={codigosPostales}
                        direccionAActualizar={"direccion_id"}
                        personaMoralId={personaMoral?.id ?? 0}
                        showDelegacion={false}
                    />
                </>
            ),
        },
        {
            key: "2",
            label: `Dirección de notificación`,
            children: (
                <>
                    <p>{getDireccionHelpText()}</p>

                    <Direccion
                        key={"direccion_notificacion_id"}
                        showAdd={direccionId === direccionNotificacionId}
                        setDireccionNotificacionId={setDireccionNotificacionId}
                        setDireccionId={setDireccionId}
                        codigosPostales={codigosPostales}
                        direccionAActualizar={"direccion_notificacion_id"}
                        personaMoralId={personaMoral?.id ?? 0}
                    />
                </>
            ),
        },
    ];
    return (
        <div className="direcciones">
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </div>
    );
}
