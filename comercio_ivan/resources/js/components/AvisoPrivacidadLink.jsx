import React from "react";

export default function AvisoPrivacidadLink() {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 30,
            }}
        >
            <small>
                <a href="/aviso-de-privacidad-integral" target="_blank">
                    Aviso de privacidad
                </a>
            </small>
        </div>
    );
}
