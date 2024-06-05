import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useNavigate,
} from "react-router-dom";

import Edit from "./Edicion";
import Solicitud from "./Solicitud";
import RolesRouter from "../views/RolesRouter";

const ListaNueva = () => {
    const navegar = useNavigate();

    const [datos, listadatos] = useState([]);

    const cargardatos = async () => {
        const response = await axios.get("http://127.0.0.1:8000/listar");
        listadatos(response.data);
    };

    const Eliminar = async (id) => {
        Swal.fire({
            title: "Estas seguro de eliminar el registro?",
            //text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "cancelar",
            confirmButtonText: "Si, Borralo!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`http://127.0.0.1:8000/api/borrar/${id}`)
                    .then((response) => {
                        if (response.status === 200) {
                            Swal.fire(
                                "Eliminado!",
                                "El registro se elimino correctamente",
                                "success"
                            );
                            cargardatos();
                            navegar("/");
                        } else {
                            Swal.fire(
                                "Error!",
                                "Hubo un Error en el proceso!",
                                "error"
                            );
                        }
                    });
            }
        });
    };

    useEffect(() => {
        cargardatos();
    }, []);

    return (
        <div className="card">
            <RolesRouter />
            <div className="card-header"></div>
            <div className="card-body">
                <table className="table table-light">
                    <thead className="thead-light">
                        <tr>
                            <th>ID</th>
                            <th>NOMBRE</th>
                            <th>APELLIDO</th>
                            <th>RFC</th>
                            <th>TELEFONO</th>
                            <th>ACCIÓN</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datos.map((fila) => (
                            <tr>
                                <td>{fila.id}</td>
                                <td>{fila.nombre}</td>
                                <td>{fila.apellidopaterno}</td>
                                <td>{fila.rfc}</td>
                                <td>{fila.telefono}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => Eliminar(fila.id)}
                                    >
                                        Eliminar
                                    </button>
                                    <Link
                                        type="button"
                                        className="btn btn-primary"
                                        to={"/Editar/" + fila.id}
                                    >
                                        edicion
                                    </Link>
                                    <Routes>
                                        <Route
                                            path="/Editar/"
                                            element={<Edit />}
                                        />
                                        <Route
                                            path="/Editar/"
                                            element={<Solicitud />}
                                        />
                                    </Routes>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="card-footer text-muted"></div>
        </div>
    );
};

export default ListaNueva;

if (document.getElementById("listanueva")) {
    ReactDOM.render(<ListaNueva />, document.getElementById("listanueva"));
}
