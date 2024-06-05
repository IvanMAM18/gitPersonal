import React from "react";
import * as ReactDOM from "react-dom/client";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Lista from "./ListaNueva";
import Graba from "./GrabaSolicitud";
import Edit from "./Edicion";

class Empezar extends React.Component {
    state = {};

    render() {
        return (
            <Router>
                <Link to={"/"}>Inicio</Link>
                <br></br>
                <Link to={"/Alta"}>Alta</Link>
                <Routes>
                    <Route path="/" element={<Lista />} />
                    <Route path="/Alta" element={<Graba />} />
                    <Route path="/Editar/:id" element={<Edit />} />
                </Routes>
            </Router>
        );
    }
}

export default Empezar;

if (document.getElementById("empezar")) {
    const root = ReactDOM.createRoot(document.getElementById("empezar"));
    root.render(<Empezar />)
}
