// Bootstrap
import '@/bootstrap';

// Importar Estilos CSS
import '@/../css/tailwind.css';
import '@/../css/bootstrap.css';
import '@/../css/theme.css';
import '@/../css/app.css';

import * as ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "@/v2/Layouts/App";
import store from "./store";
import LoginView from "@/v2/views/Auth/Login";
import RegistrationView from "@/v2/views/Auth/Registration";
import ListaDeGirosComerciales from "@/v2/views/ListaDeGirosComerciales/Index";
import PreguntasFreguntes from "@/preguntasFrecuentes/views/Index";


const appRoot = document.getElementById("root");
if (appRoot) {
    const root = ReactDOM.createRoot(appRoot);
    root.render(
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    );
}

const loginRoot = document.getElementById("login-root");
if (loginRoot) {
    const root = ReactDOM.createRoot(loginRoot);
    root.render(
        <Provider store={store}>
            <LoginView />
        </Provider>
    );
}

const registerRoot = document.getElementById("register-root");
if (registerRoot) {
    const root = ReactDOM.createRoot(registerRoot);
    root.render(
        <Provider store={store}>
            <RegistrationView />
        </Provider>
    );
}


const girosRoot = document.getElementById("lista-degiros-comerciales");
if (girosRoot) {
    const root = ReactDOM.createRoot(girosRoot);
    root.render(<ListaDeGirosComerciales />);
}

const preguntasRoot = document.getElementById("preguntas-frecuentes");
if (preguntasRoot) {
    const root = ReactDOM.createRoot(preguntasRoot);
    root.render(<PreguntasFreguntes />);
}

// import './components/Empezar.jsx'
