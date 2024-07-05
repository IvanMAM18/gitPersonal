import {Modal } from "antd";
import { useForm } from '@/v2/utils/App'
import UsuarioForm from "@/v2/components/Usuarios/UsuarioForm";

export default function EditarUsuarioModal({usuario, open, onClose}) {

    const {data, setData, processing, put, errors, reset }= useForm({
        ...usuario,
        password: '',
        password_confirmation: '',
    })

    const onSubmit = () => {
        put(`/v2/api/usuarios/${usuario.id}`, {
            onSuccess: () => onClose(),
        })
    }

    return (
        <>

            <Modal title="Editar Usuario"
                   confirmLoading={processing}
                   open={open}
                   cancelText="Cancelar"
                   okText="Actualizar"
                   onOk={onSubmit}
                   onCancel={onClose}>

                <UsuarioForm data={data} setData={setData} errors={errors} />

            </Modal>

        </>
    )
}
