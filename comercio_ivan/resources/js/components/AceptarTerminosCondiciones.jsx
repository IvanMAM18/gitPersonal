import React from "react";
import { Checkbox } from "antd";
export default function AceptarTerminosCondiciones({ setCheckTerminos }) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Checkbox onChange={setCheckTerminos}>
                <a href="/aviso-de-privacidad-integral" target="_blank">
                    Acepto los términos y condiciones
                </a>
            </Checkbox>
        </div>
    );
}
