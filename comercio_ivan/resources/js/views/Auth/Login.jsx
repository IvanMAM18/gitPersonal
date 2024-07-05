import React, { useState, createRef } from "react";
import { Input, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import LoginRegisterViewPicker from "@/components/Auth/LoginRegisterViewPicker.jsx";
import RegisterHeader from "@/components/Auth/RegisterHeader.jsx";

const passwordInput = createRef();

export default function Login() {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState(false);
    const [form, setForm] = useState({
        email: '',
        password: '',
        remember: false,
    })

    const onSubmit = (event) => {
        event.preventDefault()
        setProcessing(true)
        setErrors({});
        axios.post(`/login`, form)
            .then(response => location.reload())
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

    // Helper para actualizar los datos del formulario.
    const setData = (property, value) => {
        setForm(prevForm => {
            return {
                ...prevForm,
                [property]: value
            };
        })
    }

    // Cuando presionamos enter en el campo de correo electronico.
    const onEmailKeyDown = (event) => {
        if (event.key == "Enter") {
            event.preventDefault()
            passwordInput.current.focus()
        }
    }

    return (
        <div className="flex flex-col items-center mt-32 md:mt-0 md:justify-center h-full">
            <span>Ahora si</span>

           <div className="max-w-md mx-auto text-center">

               <RegisterHeader mode="login"/>

               <div className="w-50 mx-auto">
                   <form action="/login" method="post" autoComplete="off" onSubmit={event => onSubmit(event)}>

                       <div className="mb-4" onKeyDown={event => onEmailKeyDown(event)}>
                           <Input type="email" placeholder="Email" onChange={event => setData('email', event.target.value)}/>
                           {errors.email && <div className="text-xs text-app text-left">{errors.email}</div>}
                       </div>

                       <div className="mb-4">
                           <Input.Password
                               placeholder="Contraseña"
                               iconRender={visible => visible ?  <EyeTwoTone/> : <EyeInvisibleOutlined/>}
                               onChange={event => setData('password', event.target.value)}
                               ref={passwordInput}
                           />
                           {errors.password && <div className="text-xs text-app text-left">{errors.password}</div>}
                       </div>

                       <button type="submit" className="px-2 py-1 w-full bg-app text-white uppercase" disabled={processing}>
                           Entrar
                       </button>
                   </form>
               </div>
               

               <LoginRegisterViewPicker mode="login"/>

           </div>

        </div>
    );
}
