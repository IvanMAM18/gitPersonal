import * as ReactDOM from "react-dom/client";
import ResolutivoDetailsMain from "@/views/resolutivos/ResolutivoDetailsMain";

const appRoot = document.getElementById("resolutivo-details-view");

if (appRoot) {
    const root = ReactDOM.createRoot(appRoot);
    root.render(<ResolutivoDetailsMain />);
}
