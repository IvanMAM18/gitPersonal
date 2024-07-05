import * as ReactDOM from "react-dom/client";
import GirosLayoutPublic from "@/GirosComerciales/GirosLayoutPublic.jsx";
import '/resources/css/app.css';
import '/resources/css/bootstrap.css';
import '/resources/css/theme.css';

const appRoot = document.getElementById("giros-comerciales");
if (appRoot) {
    const root = ReactDOM.createRoot(appRoot);
    root.render(<GirosLayoutPublic />);
}
