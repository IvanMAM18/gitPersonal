import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

//

import "./estilo.css";

import { Button, Steps } from "antd";
import Swal from "sweetalert2";
import RolesRouter from "../views/RolesRouter.jsx";

const { Step } = Steps;

const GrabaSolicitud = () => {

    const navigate = useNavigate();

    const steps = [
        { title: "Datos iniciales" },
        { title: "Datos del Solicitante" },
        { title: "Direccion del Solicitante" },
        { title: "Datos del negocio" },
        { title: "Direccion del negocio" },
    ];

    const [current, setCurrent] = useState(0);

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    /******diseño */

    /******para grabar */

    const [datos, fundatos] = useState({
        nombre: "",
        apelllidopaterno: "",
        apelllidomaterno: "",
        curp: "",
        rfc: "",
        telefono: "",
        correo: "",
        sexo: "",

        calleprincipal: "",
        calles: "",
        numeroexterior: "",
        numerointerior: "",
        catalogo_colonias: [],
        colonia: "",
        codigopostal: "",

        girocomercial: [],
        giro: "",
        tiponegocio: [],
        tipo: "",
        uso: [],
        usonegocio: "",
        anuncio: [],
        tipoanuncio: "",
        asociacion: [],
        tipoasociacion: "",
        nombrenegocio: "",
        apoderadolegal: "",
        actividadprincipal: "",
        clavecatastral: "",
        superficielocal: "",
        numeroestacionamiento: "",
        clavesapa: "",
        leyendaanuncio: "",
        lugaranuncio: "",
        largoanuncio: "",
        anchoanuncio: "",
        totalinversion: "",
        numeroempleado: "",
        numerohombres: "",
        numeromujeres: "",
        personascapdiferentes: "",
        observaciones: "",
        nossa: "",
        claveregistromunicipal: "",

        calleprincipalnegocio: "",
        callesnegocio: "",
        numeroexteriornegocio: "",
        numerointeriornegocio: "",
        colonianegocio: 0,
        codigopostalnegocio: "",

        razonsocialinicial: "",
        rfcinicial: "",
        actaconstitutiva: "",
        cartasituacionfiscal: "",
    });

    const manejador = ({ target }) => {
        fundatos({
            ...datos,
            [target.name]: target.value,
        });
    };

    /******para grabar */
    const manegadorEnvio = async (e) => {
        e.preventDefault();
        const response = await axios.post(
            "http://127.0.0.1:8000/api/agregar",
            datos
        );
        console.log(datos);
        console.log(response);
        if (response.status === 200) {
            Swal.fire(
                "Guardado!",
                "El registro se guardo correctamente",
                "success"
            );
            history.push("/");
        } else {
            Swal.fire("Error!", "Hubo un Error en el proceso!", "error");
        }
    };

    /******Seleccionar el tipo de negocio */
    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/tipogiro")
            .then((response) => {
                datos.tiponegocio = response.data;
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const tipo_negocio = async () => {
        axios
            .get("http://127.0.0.1:8000/tiponegocio")
            .then((response) => {
                datos.girocomercial = response.data;
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const tipo_giro = async () => {
        axios
            .get("http://127.0.0.1:8000/buscagirocom")
            .then((response) => {
                datos.girocomercial = response.data;
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const Uso_negocio = async () => {
        axios
            .get("http://127.0.0.1:8000/busca_uso_negocio")
            .then((response) => {
                datos.uso = response.data;
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const tipo_anuncio = async () => {
        axios
            .get("http://127.0.0.1:8000/busca_tipo_anuncio")
            .then((response) => {
                datos.anuncio = response.data;
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const tipo_camara = async () => {
        axios
            .get("http://127.0.0.1:8000/busca_camara")
            .then((response) => {
                datos.asociacion = response.data;
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const cat_colonia = async () => {
        axios
            .get("http://127.0.0.1:8000/colonias")
            .then((response) => {
                datos.catalogo_colonias = response.data;
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        tipo_negocio();
        tipo_giro();
        Uso_negocio();
        tipo_anuncio();
        tipo_camara();
        cat_colonia();
    }, []);

    /******Seleccionar tipo de asociacion */
    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/colonias")
            .then((response) => {
                datos.catalogo_colonias = response.data;
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <>
            <RolesRouter/>
            <form onSubmit={manegadorEnvio}>
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
                                    <label htmlFor="">Razon social</label>
                                    <input
                                        type="text"
                                        name="razonsocialinicial"
                                        id="razonsocialinicial"
                                        value={datos.razonsocialinicial}
                                        onChange={manejador}
                                        className="form-control"
                                        placeholder=""
                                        aria-describedby="helpId"
                                    />

                                    <label htmlFor="">RFC</label>
                                    <input
                                        type="text"
                                        name="rfcinicial"
                                        id="rfcinicial"
                                        value={datos.rfcinicial}
                                        onChange={manejador}
                                        className="form-control"
                                        placeholder=""
                                        aria-describedby="helpId"
                                    />

                                    <label htmlFor="">Acta constitutiva</label>
                                    <input
                                        type="text"
                                        name="actaconstitutiva"
                                        id="actaconstitutiva"
                                        value={datos.actaconstitutiva}
                                        onChange={manejador}
                                        className="form-control"
                                        placeholder=""
                                        aria-describedby="helpId"
                                    />

                                    <label htmlFor="">Carta situacion fiscal</label>
                                    <input
                                        type="text"
                                        name="cartasituacionfiscal"
                                        id="cartasituacionfiscal"
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
                                    <label htmlFor="">Apellido Paterno</label>
                                    <input
                                        type="text"
                                        name="apelllidopaterno"
                                        id="apelllidopaterno"
                                        value={datos.apelllidopaterno}
                                        onChange={manejador}
                                        className="form-control"
                                        placeholder=""
                                        aria-describedby="helpId"
                                    />
                                    <label htmlFor="">Apellido Materno</label>
                                    <input
                                        type="text"
                                        name="apelllidomaterno"
                                        id="apelllidomaterno"
                                        value={datos.apelllidomaterno}
                                        onChange={manejador}
                                        className="form-control"
                                        placeholder=""
                                        aria-describedby="helpId"
                                    />
                                    <label htmlFor="">CURP</label>
                                    <input
                                        type="text"
                                        name="curp"
                                        id="curp"
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
                                        id="rfc"
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
                                        id="telefono"
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
                                        id="correo"
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
                                    <label htmlFor="">Calle Principal</label>
                                    <input
                                        type="text"
                                        name="calleprincipal"
                                        id="calleprincipal"
                                        value={datos.calleprincipal}
                                        onChange={manejador}
                                        className="form-control"
                                        placeholder=""
                                        aria-describedby="helpId"
                                    />

                                    <label htmlFor="">calles</label>
                                    <input
                                        type="text"
                                        name="calles"
                                        id="calles"
                                        value={datos.calles}
                                        onChange={manejador}
                                        className="form-control"
                                        placeholder=""
                                        aria-describedby="helpId"
                                    />

                                    <label htmlFor="">Numero exterior</label>
                                    <input
                                        type="text"
                                        name="numeroexterior"
                                        id="numeroexterior"
                                        value={datos.numeroexterior}
                                        onChange={manejador}
                                        className="form-control"
                                        placeholder=""
                                        aria-describedby="helpId"
                                    />

                                    <label htmlFor="">Numero interior</label>
                                    <input
                                        type="text"
                                        name="numerointerior"
                                        id="numerointerior"
                                        value={datos.numerointerior}
                                        onChange={manejador}
                                        className="form-control"
                                        placeholder=""
                                        aria-describedby="helpId"
                                    />

                                    <label htmlFor="">Colonia</label>
                                    <select
                                        className="form-control"
                                        name="colonia"
                                        value={datos.colonia}
                                        onChange={manejador}
                                    >
                                        {datos.catalogo_colonias.map(
                                            (cat_colonia) => (
                                                <option
                                                    key={cat_colonia.id}
                                                    value={cat_colonia.id}
                                                >
                                                    {cat_colonia.descripcion}
                                                </option>
                                            )
                                        )}
                                    </select>

                                    <label htmlFor="">Codigo postal</label>
                                    <input
                                        type="text"
                                        name="codigopostal"
                                        id="codigopostal"
                                        value={datos.codigopostal}
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
                                    <label htmlFor="">Tipo del negocio</label>
                                    <select
                                        className="form-control"
                                        name="tipo"
                                        value={datos.tipo}
                                        onChange={manejador}
                                    >
                                        {datos.tiponegocio.map((cat_tipo) => (
                                            <option
                                                key={cat_tipo.cv_tipo_negocio}
                                                value={cat_tipo.cv_tipo_negocio}
                                            >
                                                {cat_tipo.descripcion}
                                            </option>
                                        ))}
                                    </select>

                                    <label htmlFor="">Giro del negocio</label>
                                    <select
                                        className="form-control"
                                        name="giro"
                                        value={datos.giro}
                                        onChange={manejador}
                                    >
                                        {datos.girocomercial.map((cat_giro) => (
                                            <option
                                                key={cat_giro.id_giro}
                                                value={cat_giro.id_giro}
                                            >
                                                {cat_giro.descripcion}
                                            </option>
                                        ))}
                                    </select>

                                    <label htmlFor="">Tipo de giro comercial</label>
                                    <select
                                        className="form-control"
                                        name="giro"
                                        value={datos.giro}
                                        onChange={manejador}
                                    >
                                        {datos.girocomercial.map((cat_giro) => (
                                            <option
                                                key={cat_giro.id_giro}
                                                value={cat_giro.id_giro}
                                            >
                                                {cat_giro.descripcion}
                                            </option>
                                        ))}
                                    </select>

                                    <label htmlFor="">Nombre del negocio</label>
                                    <input
                                        type="text"
                                        name="nombrenegocio"
                                        id="nombrenegocio"
                                        value={datos.nombrenegocio}
                                        onChange={manejador}
                                        className="form-control"
                                        placeholder=""
                                        aria-describedby="helpId"
                                    />

                                    <label htmlFor="">Apoderado legal</label>
                                    <input
                                        type="text"
                                        name="apoderadolegal"
                                        id="apoderadolegal"
                                        value={datos.apoderadolegal}
                                        onChange={manejador}
                                        className="form-control"
                                        placeholder=""
                                        aria-describedby="helpId"
                                    />

                                    <label htmlFor="">Uso</label>
                                    <select
                                        className="form-control"
                                        name="usonegocio"
                                        value={datos.usonegocio}
                                        onChange={manejador}
                                    >
                                        {datos.uso.map((cat_uso) => (
                                            <option
                                                key={cat_uso.id_uso_neg}
                                                value={cat_uso.id_uso_neg}
                                            >
                                                {cat_uso.descripcion}
                                            </option>
                                        ))}
                                    </select>

                                    <label htmlFor="">Actividad principal</label>
                                    <input
                                        type="text"
                                        name="actividadprincipal"
                                        id="actividadprincipal"
                                        value={datos.actividadprincipal}
                                        onChange={manejador}
                                        className="form-control"
                                        placeholder=""
                                        aria-describedby="helpId"
                                    />

                                    <label htmlFor="">Clave catastral</label>
                                    <input
                                        type="text"
                                        name="clavecatastral"
                                        id="clavecatastral"
                                        value={datos.clavecatastral}
                                        onChange={manejador}
                                        className="form-control"
                                        placeholder=""
                                        aria-describedby="helpId"
                                    />

                                    <label htmlFor="">Superficie del local</label>
                                    <input
                                        type="text"
                                        name="superficielocal"
                                        id="superficielocal"
                                        value={datos.superficielocal}
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
                                        name="numeroestacionamiento"
                                        id="numeroestacionamiento"
                                        value={datos.numeroestacionamiento}
                                        onChange={manejador}
                                        className="form-control"
                                        placeholder=""
                                        aria-describedby="helpId"
                                    />

                                    <label htmlFor="">Clave sapa</label>
                                    <input
                                        type="text"
                                        name="clavesapa"
                                        id="clavesapa"
                                        value={datos.clavesapa}
                                        onChange={manejador}
                                        className="form-control"
                                        placeholder=""
                                        aria-describedby="helpId"
                                    />

                                    <label htmlFor="">Tipo de anuncio</label>
                                    <select
                                        className="form-control"
                                        name="tipoanuncio"
                                        value={datos.tipoanuncio}
                                        onChange={manejador}
                                    >
                                        {datos.anuncio.map((cat_anuncio) => (
                                            <option
                                                key={cat_anuncio.id_anuncio}
                                                value={cat_anuncio.id_anuncio}
                                            >
                                                {cat_anuncio.descripcion}
                                            </option>
                                        ))}
                                    </select>

                                    <label htmlFor="">Leyenda del anuncio</label>
                                    <input
                                        type="text"
                                        name="leyendaanuncio"
                                        id="leyendaanuncio"
                                        value={datos.leyendaanuncio}
                                        onChange={manejador}
                                        className="form-control"
                                        placeholder=""
                                        aria-describedby="helpId"
                                    />

                                    <label htmlFor="">Lugar del anuncio</label>
                                    <input
                                        type="text"
                                        name="lugaranuncio"
                                        id="lugaranuncio"
                                        value={datos.lugaranuncio}
                                        onChange={manejador}
                                        className="form-control"
                                        placeholder=""
                                        aria-describedby="helpId"
                                    />

                                    <label htmlFor="">Largo del anuncio</label>
                                    <input
                                        type="text"
                                        name="largoanuncio"
                                        id="largoanuncio"
                                        value={datos.largoanuncio}
                                        onChange={manejador}
                                        className="form-control"
                                        placeholder=""
                                        aria-describedby="helpId"
                                    />

                                    <label htmlFor="">Ancho del anuncio</label>
                                    <input
                                        type="text"
                                        name="anchoanuncio"
                                        id="anchoanuncio"
                                        value={datos.anchoanuncio}
                                        onChange={manejador}
                                        className="form-control"
                                        placeholder=""
                                        aria-describedby="helpId"
                                    />

                                    <label htmlFor="">Total de inversion</label>
                                    <input
                                        type="text"
                                        name="totalinversion"
                                        id="totalinversion"
                                        value={datos.totalinversion}
                                        onChange={manejador}
                                        className="form-control"
                                        placeholder=""
                                        aria-describedby="helpId"
                                    />

                                    <label htmlFor="">Numero de empleados</label>
                                    <input
                                        type="text"
                                        name="numeroempleado"
                                        id="numeroempleado"
                                        value={datos.numeroempleado}
                                        onChange={manejador}
                                        className="form-control"
                                        placeholder=""
                                        aria-describedby="helpId"
                                    />

                                    <label htmlFor="">Numero de Hombres</label>
                                    <input
                                        type="text"
                                        name="numerohombres"
                                        id="numerohombres"
                                        value={datos.numerohombres}
                                        onChange={manejador}
                                        className="form-control"
                                        placeholder=""
                                        aria-describedby="helpId"
                                    />

                                    <label htmlFor="">Numero de mujeres</label>
                                    <input
                                        type="text"
                                        name="numeromujeres"
                                        id="numeromujeres"
                                        value={datos.numeromujeres}
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
                                        name="personascapdiferentes"
                                        id="personascapdiferentes"
                                        value={datos.personascapdiferentes}
                                        onChange={manejador}
                                        className="form-control"
                                        placeholder=""
                                        aria-describedby="helpId"
                                    />

                                    <label htmlFor="">Observaciones</label>
                                    <input
                                        type="text"
                                        name="observaciones"
                                        id="observaciones"
                                        value={datos.observaciones}
                                        onChange={manejador}
                                        className="form-control"
                                        placeholder=""
                                        aria-describedby="helpId"
                                    />

                                    <label htmlFor="">Asociacion</label>
                                    <select
                                        className="form-control"
                                        name="tipoasociacion"
                                        value={datos.tipoasociacion}
                                        onChange={manejador}
                                    >
                                        {datos.asociacion.map((cat_asociacion) => (
                                            <option
                                                key={cat_asociacion.id_cat_camara}
                                                value={cat_asociacion.id_cat_camara}
                                            >
                                                {cat_asociacion.descripcion}
                                            </option>
                                        ))}
                                    </select>

                                    <label htmlFor="">No de SSA</label>
                                    <input
                                        type="text"
                                        name="nossa"
                                        id="nossa"
                                        value={datos.nossa}
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
                                        name="claveregistromunicipal"
                                        id="claveregistromunicipal"
                                        value={datos.claveregistromunicipal}
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
                                    <label htmlFor="">Calle Principal</label>
                                    <input
                                        type="text"
                                        name="calleprincipalnegocio"
                                        id="calleprincipalnegocio"
                                        value={datos.calleprincipalnegocio}
                                        onChange={manejador}
                                        className="form-control"
                                        placeholder=""
                                        aria-describedby="helpId"
                                    />

                                    <label htmlFor="">calles</label>
                                    <input
                                        type="text"
                                        name="callesnegocio"
                                        id="callesnegocio"
                                        value={datos.callesnegocio}
                                        onChange={manejador}
                                        className="form-control"
                                        placeholder=""
                                        aria-describedby="helpId"
                                    />

                                    <label htmlFor="">Numero exterior</label>
                                    <input
                                        type="text"
                                        name="numeroexteriornegocio"
                                        id="numeroexteriornegocio"
                                        value={datos.numeroexteriornegocio}
                                        onChange={manejador}
                                        className="form-control"
                                        placeholder=""
                                        aria-describedby="helpId"
                                    />

                                    <label htmlFor="">Numero interior</label>
                                    <input
                                        type="text"
                                        name="numerointeriornegocio"
                                        id="numerointeriornegocio"
                                        value={datos.numerointeriornegocio}
                                        onChange={manejador}
                                        className="form-control"
                                        placeholder=""
                                        aria-describedby="helpId"
                                    />

                                    <label htmlFor="">Colonia</label>
                                    <select
                                        className="form-control"
                                        name="colonianegocio"
                                        value={datos.colonianegocio}
                                        onChange={manejador}
                                    >
                                        {datos.catalogo_colonias.map(
                                            (cat_colonia) => (
                                                <option
                                                    key={cat_colonia.id}
                                                    value={cat_colonia.id}
                                                >
                                                    {cat_colonia.descripcion}
                                                </option>
                                            )
                                        )}
                                    </select>

                                    <label htmlFor="">Codigo postal</label>
                                    <input
                                        type="text"
                                        name="codigopostalnegocio"
                                        id="codigopostalnegocio"
                                        value={datos.codigopostalnegocio}
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
                                message.success("Proceda a guardar la informacion!")
                            }
                        >
                            Terminado
                        </Button>
                    )}

                    {current > 0 && (
                        <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
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
        </>
    );
};

export default GrabaSolicitud;

if (document.getElementById("grabasolicitud")) {
    ReactDOM.render(
        <GrabaSolicitud />,
        document.getElementById("grabasolicitud")
    );
}
