import {Modal, Button, Input} from "antd";
import { useForm } from '@/v2/utils/App';
import {useState} from "react";
import {randomPassword} from 'secure-random-password';

export default function CambiarContrasenaUsuarioModal({usuario, open, onClose}) {

    const {data, setData, setDefaults, processing, put, errors, reset }= useForm({
        password: '',
        password_confirmation: '',
    });
    const [suggestedPassword, setSuggestedPassword] = useState(null);

    const onSubmit = () => {
        put(`/v2/api/usuarios/${usuario.id}/password`, {
            onSuccess: () => onClose(),
        });
    }

    const generarContrasenaAleatoria = () => {
        var password = randomPassword();
        setSuggestedPassword(password);
    }

    return (
        <>

            <Modal title="Cambiar Contraseña"
                   confirmLoading={processing}
                   open={open}
                   cancelText="Cancelar"
                   okText="Actualizar"
                   onOk={onSubmit}
                   onCancel={onClose}>

                <h2 className="text-xl mb-4 text-app">{usuario.nombre_completo}</h2>

                {/*Contraseña*/}
                <div className="mb-4">
                    <label className="font-medium mb-0" htmlFor="password">Contraseña</label>
                    <Input.Password id="password"
                           value={data.password}
                           onChange={event => setData('password', event.target.value)} />
                    <div className="text-xs text-app">{errors.password}</div>
                </div>

                {/*Confirmar Contraseña*/}
                <div className="mb-4">
                    <label className="font-medium mb-0" htmlFor="password_confirmation">Confirmar Contraseña</label>
                    <Input.Password id="password_confirmation"
                           value={data.password_confirmation}
                           onChange={event => setData('password_confirmation', event.target.value)} />
                </div>

                <Button onClick={event => generarContrasenaAleatoria()}>Genear Contraseña Aleatoria</Button>
                {suggestedPassword !== null && <pre className="lowercase bg-gray-200 mt-2 p-3">{suggestedPassword}</pre>}
            </Modal>

        </>
    );
}
