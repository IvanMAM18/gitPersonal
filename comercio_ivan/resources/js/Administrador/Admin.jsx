import * as ReactDOM from "react-dom/client";
import AdminLayout from "@/Administrador/AdminLayout.jsx";
import '/resources/css/app.css';
import '/resources/css/bootstrap.css';
import '/resources/css/theme.css';

const appRoot = document.getElementById("admin_cruds");
if (appRoot) {
    const root = ReactDOM.createRoot(appRoot);
    root.render(<AdminLayout />);
}
