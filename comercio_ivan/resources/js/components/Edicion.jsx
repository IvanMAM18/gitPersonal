import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

import "./estilo.css";

import { Button, Steps } from "antd";
import RolesRouter from "../views/RolesRouter";

/******diseño */
const { Step } = Steps;

const Editar = () => {
    let { id } = useParams();

    const [datos, listdatos] = useState([]);

    const [datos_catalogos, lista_catalogos] = useState({
        catalogo_colonias: [],
        tiponegocio: [],
        girocomercial: [],
        uso: [],
        anuncio: [],
        asociacion: [],
    });

    const [current, setCurrent] = useState(0);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const steps = [
        { title: "Datos iniciales" },
        { title: "Datos del Solicitante" },
        { title: "Direccion del Solicitante" },
        { title: "Datos del negocio" },
        { title: "Direccion del negocio" },
    ];

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    /******diseño */

    const manejador = ({ target }) => {
        listdatos({
            ...datos,
            [target.name]: target.value,
        });
    };

    const Actualiza_info = async (e) => {
        e.preventDefault();
        const response = await axios.post(
            "http://127.0.0.1:8000/api/editar",
            datos
        );
        if (response.status === 200) {
            Swal.fire(
                "Actualizado!",
                "El registro se actualizo correctamente",
                "success"
            );
            // console.log(datos);
            navigate("/");
        } else {
            Swal.fire("Error!", "Hubo un Error en el proceso!", "error");
        }
    };

    const cargardatos = async () => {
        axios
            .get("http://127.0.0.1:8000/buscar/" + id)
            .then((response) => {
                listdatos(response.data[0]);
                setLoading(response.data[0]);
                console.log(response.data[0]);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const tipo_negocio = async () => {
        axios
            .get("http://127.0.0.1:8000/tiponegocio")
            .then((response) => {
                datos_catalogos.tiponegocio = response.data;
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const tipo_giro = async () => {
        axios
            .get("http://127.0.0.1:8000/buscagirocom")
            .then((response) => {
                datos_catalogos.girocomercial = response.data;
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const Uso_negocio = async () => {
        axios
            .get("http://127.0.0.1:8000/busca_uso_negocio")
            .then((response) => {
                datos_catalogos.uso = response.data;
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const tipo_anuncio = async () => {
        axios
            .get("http://127.0.0.1:8000/busca_tipo_anuncio")
            .then((response) => {
                datos_catalogos.anuncio = response.data;
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const tipo_camara = async () => {
        axios
            .get("http://127.0.0.1:8000/busca_camara")
            .then((response) => {
                datos_catalogos.asociacion = response.data;
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const cat_colonia = async () => {
        axios
            .get("http://127.0.0.1:8000/colonias")
            .then((response) => {
                datos_catalogos.catalogo_colonias = response.data;
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        cargardatos();
        cat_colonia();
        tipo_negocio();
        tipo_giro();
        Uso_negocio();
        tipo_anuncio();
        tipo_camara();
    }, []);

    return (
        <div>
            <RolesRouter/>
            {!loading && <div>cargando...</div>}

            {loading && (
                <form onSubmit={Actualiza_info}>
                    <Steps current={current}>
                        {steps.map((item) => (
                            <Step key={item.title} title={item.title} />
                        ))}
                    </Steps>

                    <div className="steps-content">
                        {current === 0 && (
                            <div className="card">
                                <div className="card-body">
                                    <div className="form-group">
                                        <input
                                            type="hidden"
                                            readonly
                                            name="id_per_mor2"
                                            value={datos.id_per_mor}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">Razon social</label>
                                        <input
                                            type="text"
                                            name="razonsocial"
                                            value={datos.razonsocial}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">RFC</label>
                                        <input
                                            type="text"
                                            name="per_mor_rfc"
                                            value={datos.per_mor_rfc}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">
                                            Acta constitutiva
                                        </label>
                                        <input
                                            type="text"
                                            name="actaconstitutiva"
                                            value={datos.actaconstitutiva}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">
                                            Carta situacion fiscal
                                        </label>
                                        <input
                                            type="text"
                                            name="cartasituacionfiscal"
                                            value={datos.cartasituacionfiscal}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {current === 1 && (
                            <div className="card">
                                <div className="card-body">
                                    <div className="form-group">
                                        <label>Tipo de persona</label>
                                        <br></br>
                                        <input
                                            type="hidden"
                                            readonly
                                            name="id_persona"
                                            value={datos.id_persona}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />
                                        <input
                                            type="radio"
                                            value="1"
                                            name="sexo"
                                            checked={datos.sexo === "1"}
                                            onChange={manejador}
                                        />{" "}
                                        Masculino
                                        <input
                                            type="radio"
                                            value="2"
                                            name="sexo"
                                            checked={datos.sexo === "2"}
                                            onChange={manejador}
                                        />{" "}
                                        Femenino
                                        <br></br>
                                        <label htmlFor="">Nombre</label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            id="nombre"
                                            value={datos.nombre}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />
                                        <label htmlFor="">
                                            Apellido Paterno
                                        </label>
                                        <input
                                            type="text"
                                            name="apellidopaterno"
                                            value={datos.apellidopaterno}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />
                                        <label htmlFor="">
                                            Apellido Materno
                                        </label>
                                        <input
                                            type="text"
                                            name="apellidomaterno"
                                            value={datos.apellidomaterno}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />
                                        <label htmlFor="">CURP</label>
                                        <input
                                            type="text"
                                            name="curp"
                                            value={datos.curp}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />
                                        <label htmlFor="">RFC</label>
                                        <input
                                            type="text"
                                            name="rfc"
                                            value={datos.rfc}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />
                                        <label htmlFor="">Telefono</label>
                                        <input
                                            type="text"
                                            name="telefono"
                                            value={datos.telefono}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />
                                        <label htmlFor="">Correo</label>
                                        <input
                                            type="text"
                                            name="correo"
                                            value={datos.correo}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {current === 2 && (
                            <div className="card">
                                <div className="card-body">
                                    <div className="form-group">
                                        <input
                                            type="hidden"
                                            readonly
                                            name="id_dir_persona"
                                            value={datos.id_dir_persona}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">
                                            Calle Principal
                                        </label>
                                        <input
                                            type="text"
                                            name="calle_principal_persona"
                                            value={
                                                datos.calle_principal_persona
                                            }
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">calles</label>
                                        <input
                                            type="text"
                                            name="calle_persona"
                                            value={datos.calle_persona}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">
                                            Numero exterior
                                        </label>
                                        <input
                                            type="text"
                                            name="numero_externo_persona"
                                            value={datos.numero_externo_persona}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">
                                            Numero interior
                                        </label>
                                        <input
                                            type="text"
                                            name="numero_interno_persona"
                                            value={datos.numero_interno_persona}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">Colonia</label>
                                        <select
                                            className="form-control"
                                            name="id_colonia"
                                            value={datos.id_colonia}
                                            onChange={manejador}
                                        >
                                            <option>
                                                {datos.colonia_persona}
                                            </option>
                                            {datos_catalogos.catalogo_colonias.map(
                                                (cat_colonia) => (
                                                    <option
                                                        key={
                                                            cat_colonia.id_colonia
                                                        }
                                                        value={
                                                            cat_colonia.id_colonia
                                                        }
                                                    >
                                                        {
                                                            cat_colonia.descripcion
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>

                                        <label htmlFor="">Codigo postal</label>
                                        <input
                                            type="text"
                                            name="codigo_postal_persona"
                                            id="codigo_postal_persona"
                                            value={datos.codigo_postal_persona}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {current === 3 && (
                            <div className="card">
                                <div className="card-body">
                                    <div className="form-group">
                                        <input
                                            type="hidden"
                                            readonly
                                            name="id_negocio"
                                            value={datos.id_negocio}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">
                                            Tipo de negocio
                                        </label>
                                        <select
                                            className="form-control"
                                            name="cv_tipo_negocio"
                                            value={datos.cv_tipo_negocio}
                                            onChange={manejador}
                                        >
                                            <option>
                                                {datos.tipo_negocio}
                                            </option>
                                            {datos_catalogos.tiponegocio.map(
                                                (cat_tipo) => (
                                                    <option
                                                        key={
                                                            cat_tipo.cv_tipo_negocio
                                                        }
                                                        value={
                                                            cat_tipo.cv_tipo_negocio
                                                        }
                                                    >
                                                        {cat_tipo.descripcion}
                                                    </option>
                                                )
                                            )}
                                        </select>

                                        <label htmlFor="">
                                            Tipo de giro comercial
                                        </label>
                                        <select
                                            className="form-control"
                                            name="id_giro"
                                            value={datos.id_giro}
                                            onChange={manejador}
                                        >
                                            <option>
                                                {datos.giro_negocio}
                                            </option>
                                            {datos_catalogos.girocomercial.map(
                                                (cat_giro) => (
                                                    <option
                                                        key={cat_giro.id_giro}
                                                        value={cat_giro.id_giro}
                                                    >
                                                        {cat_giro.descripcion}
                                                    </option>
                                                )
                                            )}
                                        </select>

                                        <label htmlFor="">
                                            Nombre del negocio
                                        </label>
                                        <input
                                            type="text"
                                            name="nombrenegocio"
                                            value={datos.nombrenegocio}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">
                                            Apoderado legal
                                        </label>
                                        <input
                                            type="text"
                                            name="apoderado_legal"
                                            value={datos.apoderado_legal}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">Uso</label>
                                        <select
                                            className="form-control"
                                            name="id_uso_neg"
                                            value={datos.id_uso_neg}
                                            onChange={manejador}
                                        >
                                            <option>{datos.uso_negocio}</option>
                                            {datos_catalogos.uso.map(
                                                (cat_uso) => (
                                                    <option
                                                        key={cat_uso.id_uso_neg}
                                                        value={
                                                            cat_uso.id_uso_neg
                                                        }
                                                    >
                                                        {cat_uso.descripcion}
                                                    </option>
                                                )
                                            )}
                                        </select>

                                        <label htmlFor="">
                                            Actividad principal
                                        </label>
                                        <input
                                            type="text"
                                            name="actividad_principal"
                                            value={datos.actividad_principal}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">
                                            Clave catastral
                                        </label>
                                        <input
                                            type="text"
                                            name="clave_catastral"
                                            value={datos.clave_catastral}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">
                                            Superficie del local
                                        </label>
                                        <input
                                            type="text"
                                            name="superficie_local"
                                            value={datos.superficie_local}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">
                                            Numero de estacionamientos
                                        </label>
                                        <input
                                            type="text"
                                            name="no_estacionamientos"
                                            value={datos.no_estacionamientos}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">Clave sapa</label>
                                        <input
                                            type="text"
                                            name="clave_sapa"
                                            value={datos.clave_sapa}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">
                                            Tipo de anuncio
                                        </label>
                                        <select
                                            className="form-control"
                                            name="id_anuncio"
                                            value={datos.id_anuncio}
                                            onChange={manejador}
                                        >
                                            <option>
                                                {datos.tipoanuncio_negocio}
                                            </option>
                                            {datos_catalogos.anuncio.map(
                                                (cat_anuncio) => (
                                                    <option
                                                        key={
                                                            cat_anuncio.id_anuncio
                                                        }
                                                        value={
                                                            cat_anuncio.id_anuncio
                                                        }
                                                    >
                                                        {
                                                            cat_anuncio.descripcion
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>

                                        <label htmlFor="">
                                            Leyenda del anuncio
                                        </label>
                                        <input
                                            type="text"
                                            name="leyenda_anuncio"
                                            value={datos.leyenda_anuncio}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">
                                            Lugar del anuncio
                                        </label>
                                        <input
                                            type="text"
                                            name="lugar_anuncio"
                                            value={datos.lugar_anuncio}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">
                                            Largo del anuncio
                                        </label>
                                        <input
                                            type="text"
                                            name="largo_anuncio"
                                            value={datos.largo_anuncio}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">
                                            Ancho del anuncio
                                        </label>
                                        <input
                                            type="text"
                                            name="ancho_anuncio"
                                            value={datos.ancho_anuncio}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">
                                            Total de inversion
                                        </label>
                                        <input
                                            type="text"
                                            name="total_inversion"
                                            value={datos.total_inversion}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">
                                            Numero de empleados
                                        </label>
                                        <input
                                            type="text"
                                            name="no_empleados"
                                            value={datos.no_empleados}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">
                                            Numero de Hombres
                                        </label>
                                        <input
                                            type="text"
                                            name="no_hombres"
                                            value={datos.no_hombres}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">
                                            Numero de mujeres
                                        </label>
                                        <input
                                            type="text"
                                            name="no_mujeres"
                                            value={datos.no_mujeres}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">
                                            Personas con capacidades diferentes
                                        </label>
                                        <input
                                            type="text"
                                            name="persona_cap_diferentes"
                                            value={datos.persona_cap_diferentes}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">Observaciones</label>
                                        <input
                                            type="text"
                                            name="observaciones"
                                            value={datos.observaciones}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">Asociacion</label>
                                        <select
                                            className="form-control"
                                            name="id_cat_camara"
                                            value={datos.id_cat_camara}
                                            onChange={manejador}
                                        >
                                            <option>
                                                {datos.tipocamara_negocio}
                                            </option>
                                            {datos_catalogos.asociacion.map(
                                                (cat_asociacion) => (
                                                    <option
                                                        key={
                                                            cat_asociacion.id_cat_camara
                                                        }
                                                        value={
                                                            cat_asociacion.id_cat_camara
                                                        }
                                                    >
                                                        {
                                                            cat_asociacion.descripcion
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>

                                        <label htmlFor="">No de SSA</label>
                                        <input
                                            type="text"
                                            name="no_ssa"
                                            value={datos.no_ssa}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">
                                            Clave registro municipal
                                        </label>
                                        <input
                                            type="text"
                                            name="clave_reg_mpal"
                                            value={datos.clave_reg_mpal}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {current === 4 && (
                            <div className="card">
                                <div className="card-body">
                                    <div className="form-group">
                                        <input
                                            type="hidden"
                                            readonly
                                            name="id_dir_neg"
                                            value={datos.id_dir_neg}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">
                                            Calle Principal
                                        </label>
                                        <input
                                            type="text"
                                            name="calle_principal_dir_neg"
                                            value={
                                                datos.calle_principal_dir_neg
                                            }
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">calles</label>
                                        <input
                                            type="text"
                                            name="calles_dir_neg"
                                            value={datos.calles_dir_neg}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">
                                            Numero exterior
                                        </label>
                                        <input
                                            type="text"
                                            name="numero_externo_dir_neg"
                                            value={datos.numero_externo_dir_neg}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">
                                            Numero interior
                                        </label>
                                        <input
                                            type="text"
                                            name="numero_interno_dir_neg"
                                            value={datos.numero_interno_dir_neg}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />

                                        <label htmlFor="">Colonia</label>
                                        <select
                                            className="form-control"
                                            name="colonianegocio"
                                            value={datos.id_colonia}
                                            onChange={manejador}
                                        >
                                            <option>
                                                {datos.colonia_dir_neg}
                                            </option>
                                            {datos_catalogos.catalogo_colonias.map(
                                                (cat_colonia) => (
                                                    <option
                                                        key={
                                                            cat_colonia.id_colonia
                                                        }
                                                        value={
                                                            cat_colonia.id_colonia
                                                        }
                                                    >
                                                        {
                                                            cat_colonia.descripcion
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>

                                        <label htmlFor="">Codigo postal</label>
                                        <input
                                            type="text"
                                            name="codigo_postal_dir_neg"
                                            value={datos.codigo_postal_dir_neg}
                                            onChange={manejador}
                                            className="form-control"
                                            placeholder=""
                                            aria-describedby="helpId"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="steps-action">
                        {current < steps.length - 1 && (
                            <Button type="primary" onClick={() => next()}>
                                Siguiente
                            </Button>
                        )}

                        {current === steps.length - 1 && (
                            <Button
                                type="primary"
                                onClick={() =>
                                    message.success(
                                        "Proceda a guardar la informacion!"
                                    )
                                }
                            >
                                Terminado
                            </Button>
                        )}

                        {current > 0 && (
                            <Button
                                style={{ margin: "0 8px" }}
                                onClick={() => prev()}
                            >
                                Anterior
                            </Button>
                        )}

                        {current === 4 && (
                            <button
                                style={{ margin: "0 8px" }}
                                type="submit"
                                className="btn btn-success"
                            >
                                Grabar
                            </button>
                        )}
                    </div>
                </form>
            )}
        </div>
    );
};

export default Editar;

if (document.getElementById("editar")) {
    ReactDOM.render(<Editar />, document.getElementById("editar"));
}
