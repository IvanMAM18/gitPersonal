import React from "react";
import { ExclamationCircleTwoTone } from "@ant-design/icons";

export default function HorarioHeader({ errorEnHorario }) {
    return (
        <>
            <h5 className="horario-header">
                <span>Horario</span>
                {errorEnHorario.error && (
                    <span className="horario-error-feedback">
                        {errorEnHorario.reason}
                        <ExclamationCircleTwoTone
                            style={{ marginLeft: 10 }}
                            twoToneColor="#eb2f96"
                        />
                    </span>
                )}
            </h5>
        </>
    );
}
