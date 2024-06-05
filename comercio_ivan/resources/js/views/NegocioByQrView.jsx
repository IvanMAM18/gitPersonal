import * as ReactDOM from "react-dom/client";
import NegocioByQrWrapper from "@/views/components/NegocioByQr/NegocioByQrWrapper";

const appRoot = document.getElementById("negocio-details-view");

if (appRoot) {
    const root = ReactDOM.createRoot(appRoot);
    root.render(<NegocioByQrWrapper />);
    console.log('loaded')
}
