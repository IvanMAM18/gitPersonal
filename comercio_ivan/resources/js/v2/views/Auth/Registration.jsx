import React, { useState } from "react";
import {Input, message, Checkbox} from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import LoginRegisterViewPicker from "@/components/Auth/LoginRegisterViewPicker.jsx";
import RegisterHeader from "@/components/Auth/RegisterHeader.jsx";

export default function Registration() {

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        nombre: '',
        apellido_pat: '',
        apellido_mot: '',
        curp: '',
        rfc: '',
        password: '',
        password_confirmation: '',
        terms_and_conditions: false,
    })

    window.user = {};

    // Helper para actualizar los datos del formulario.
    const setData = (property, value) => {
        setForm(prevForm => {
            return {
                ...prevForm,
                [property]: value
            };
        })
    }

    const onSubmit = (event) => {
        event.preventDefault()
        setProcessing(true);
        setErrors({});
        axios.post(`/register`, form)
            .then(response => {
                if (response.data.redirect === "correo-de-verificacion-enviado") {
                    message.success("Te enviamos un correo de verificación, por favor revisa tu bandeja de entrada (considera revisar spam) y sigue las instrucciones")
                    setTimeout(() => location.reload(), 3000);
                    return;
                }
                location.href = response.data.redirect;
            })
            .catch(errors => {
                if (errors?.response) {
                    if(errors.response.data?.errors) {
                        let errorBag = {}
                        Object.keys(errors.response.data.errors).forEach(key => errorBag[key] = errors.response.data.errors[key][0]);
                        setErrors(errorBag)
                    }else{
                        message.error(errors.response.data.message)
                    }
                }
                setProcessing(false)
            })
    }

    return (
        <div className="flex flex-col items-center md:justify-center h-full p-5">

            <div className="max-w-2xl mx-auto text-center">

                <RegisterHeader mode="register"/>

                {errors.rfc_curp && <div className="text-xs text-app text-left mb-5">{errors.rfc_curp}</div>}

                <form action="/register" autoComplete="off" onSubmit={event => onSubmit(event)}>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                        <div>
                            <Input placeholder="Nombres" onChange={event => setData('nombre', event.target.value)}/>
                            {errors.nombre && <div className="text-xs text-app text-left">{errors.nombre}</div>}
                        </div>
                        <div>
                            <Input placeholder="Prmer apellido" onChange={event => setData('apellido_pat', event.target.value)}/>
                            {errors.apellido_pat && <div className="text-xs text-app text-left">{errors.apellido_pat}</div>}
                        </div>
                        <div>
                            <Input placeholder="Segundo apellido" onChange={event => setData('apellido_mot', event.target.value)}/>
                            {errors.apellido_mot && <div className="text-xs text-app text-left">{errors.apellido_mot}</div>}
                        </div>
                        <div>
                            <Input placeholder="RFC" className="text-uppercase" onChange={event => setData('rfc', event.target.value)} />
                            {errors.rfc && <div className="text-xs text-app text-left">{errors.rfc}</div>}
                        </div>

                        <div>
                            <Input className="text-uppercase" placeholder="CURP" onChange={event => setData('curp', event.target.value)}/>
                            {errors.curp && <div className="text-xs text-app text-left">{errors.curp}</div>}
                        </div>
                        <div></div>
                       <div>
                           <Input placeholder="Email" onChange={event => setData('email', event.target.value)}/>
                           {errors.email && <div className="text-xs text-app text-left">{errors.email}</div>}
                       </div>
                        <div>
                            <Input.Password onChange={event => setData('password', event.target.value)}
                                            placeholder="Contraseña"
                                            iconRender={(visible) => visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/> }
                                            type="password"/>
                            {errors.password && <div className="text-xs text-app text-left">{errors.password}</div>}
                        </div>
                        <div>
                            <Input.Password
                                onChange={event => setData('password_confirmation', event.target.value)}
                                iconRender={(visible) => visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/> }
                                placeholder="Confirmar Contraseña"
                                type="password"/>
                            {errors.password_confirmation && <div className="text-xs text-app text-left">{errors.password_confirmation}</div>}
                        </div>
                        <div></div>
                    </div>

                    <div className="mb-5 text-center">
                        <Checkbox onChange={event => setData('terms_and_conditions', event.target.checked)}>
                            <a href="/aviso-de-privacidad-integral" target="_blank">
                                Acepto los términos y condiciones
                            </a>
                        </Checkbox>
                    </div>

                    <button type="submit"
                            className="px-2 py-1 w-full bg-app text-white uppercase disabled:bg-gray-200 disabled:text-black"
                            disabled={processing || !form.terms_and_conditions}>
                        Registrarte
                    </button>

                </form>

                <LoginRegisterViewPicker mode={'register'}/>

            </div>
        </div>
    );
}

