// Bootstrap
import './bootstrap';

// import React from "react";
import '../css/tailwind.css';
import '../css/bootstrap.css';
import '../css/theme.css';
import '../css/app.css';

import * as ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "./views/App.jsx";
import store from "./store";
import LoginView from "./views/Auth/Login.jsx";
import RegistrationView from "./views/Auth/Registration.jsx";


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



import './components/Empezar.jsx'
