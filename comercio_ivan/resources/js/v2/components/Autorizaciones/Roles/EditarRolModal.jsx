import {Modal } from "antd";
import { useForm } from '@/v2/utils/App'
import RoleForm from "@/v2/components/Autorizaciones/Roles/RoleForm";

export default function EditarRolModal({rol, open, onClose}) {

    const {data, setData, processing, put, errors }= useForm({
        nombre: rol.nombre,
        label: rol.label,
        descripcion: rol.descripcion
    })

    const onSubmit = () => {
        put(`/v2/api/roles/${rol.id}`, {
            onSuccess: () => onClose(),
        })
    }

    return (
        <Modal title="Editar Rol"
               confirmLoading={processing}
               open={open}
               cancelText="Cancelar"
               okText="Actualizar"
               onOk={onSubmit}
               onCancel={onClose}>

            <h2 className="text-xl mb-4 text-app">{rol.nombre}</h2>

            <RoleForm data={data} setData={setData} errors={errors} editing={true} />

        </Modal>
    )
}
