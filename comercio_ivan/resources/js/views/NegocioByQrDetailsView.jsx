import React from "react";
import * as ReactDOM from "react-dom/client";

import NegocioByQrDetailsWrapper from "./components/NegocioByQr/NegocioByQrDetailsWrapper";

const appRoot = document.getElementById("informacion_negocio_detalles");

if (appRoot) {
    const root = ReactDOM.createRoot(appRoot);
    root.render(<NegocioByQrDetailsWrapper />);
}
