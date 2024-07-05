import {Modal } from "antd";
import { useForm } from '@/v2/utils/App'

export default function EliminarUsuarioModal({usuario, open, onClose}) {

    const {data, setData, processing, delete : destroy, errors, reset }= useForm({
        ...usuario,
        password: '',
        password_confirmation: '',
    })

    const onSubmit = () => {
        destroy(`/v2/api/usuarios/${usuario.id}`, {
            onSuccess: () => onClose(),
        })
    }

    return (
        <>

            <Modal title="Eliminar Usuario"
                   confirmLoading={processing}
                   open={open}
                   cancelText="Cancelar"
                   okText="Si, Eliminar"
                   onOk={onSubmit}
                   onCancel={onClose}>

                <h2 className="text-xl mb-4 text-app">{usuario.nombre_completo}</h2>

            </Modal>

        </>
    )
}
