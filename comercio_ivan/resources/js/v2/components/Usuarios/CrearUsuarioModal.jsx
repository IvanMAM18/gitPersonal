import {Modal, Button } from "antd";
import { useForm } from '@/v2/utils/App'
import {useState} from "react";
import UsuarioForm from "@/v2/components/Usuarios/UsuarioForm";

export default function CrearUsuarioModal() {

    const [isModalOpen, setIsModalOpen] = useState(false)

    const {data, setData, processing, post, errors, reset }= useForm({
        email: '',
        email_verified_at: null,
        telefono: '',
        password: '',
        password_confirmation: '',
        nombre: '',
        apellido_pat: '',
        apellido_mot: '',
        password: '',
        curp: '',
        rfc: '',
        regimen_fiscal: '',
        entidad_revision_id: null,
        direccion_de_notificacion: {},
    })

    const onSubmit = () => {
        post(`/v2/api/usuarios`, {
            onSuccess: () => {
                reset()
                setIsModalOpen(false)
            }
        })
    }

    return (
        <>

            <Button type="primary" onClick={() => setIsModalOpen(true)}>Crear Nuevo Usuario</Button>

            <Modal title="Crear un nuevo Usuario"
                   confirmLoading={processing}
                   open={isModalOpen}
                   cancelText="Cancelar"
                   okText="Guardar"
                   onCancel={() => setIsModalOpen(false)}
                   onOk={onSubmit}>

                <UsuarioForm data={data} setData={setData} errors={errors} />

            </Modal>

        </>
    )
}
