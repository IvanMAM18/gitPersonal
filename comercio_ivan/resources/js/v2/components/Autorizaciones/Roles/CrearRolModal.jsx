import {Modal, Button } from "antd";
import { useForm } from '@/v2/utils/App'
import {useState} from "react";
import RoleForm from "@/v2/components/Autorizaciones/Roles/RoleForm";

export default function CrearRolModal({onCreated}) {

    const [isModalOpen, setIsModalOpen] = useState(false)

    const {data, setData, processing, post, errors, reset }= useForm({
        nombre: '',
        label: '',
        descripcion: ''
    })

    const onSubmit = () => {
        post(`/v2/api/roles`, {
            onSuccess: () => {
                reset()
                setIsModalOpen(false)
                onCreated()
            }
        })
    }

    return (
        <>

            <Button type="primary" onClick={() => setIsModalOpen(true)}>Nuevo Rol</Button>

            <Modal title="Crear un Nuevo Rol"
                   confirmLoading={processing}
                   open={isModalOpen}
                   cancelText="Cancelar"
                   okText="Guardar"
                   onCancel={() => setIsModalOpen(false)}
                   onOk={onSubmit}>

                <RoleForm data={data} setData={setData} errors={errors} />

            </Modal>

        </>
    )
}
