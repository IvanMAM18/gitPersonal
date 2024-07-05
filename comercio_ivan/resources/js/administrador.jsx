// Bootstrap
import '@/bootstrap';

// Importar Estilos CSS
import '@/../css/tailwind.css';
import '@/../css/bootstrap.css';
import '@/../css/theme.css';
import '@/../css/app.css';


import * as ReactDOM from "react-dom/client";
import AdminLayout from "@/Administrador/AdminLayout";

const appRoot = document.getElementById("admin_cruds");

if (appRoot) {
    const root = ReactDOM.createRoot(appRoot);
    root.render(<AdminLayout />);
}
