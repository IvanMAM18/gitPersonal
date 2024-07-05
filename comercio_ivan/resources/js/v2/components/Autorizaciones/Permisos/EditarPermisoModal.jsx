import {Modal } from "antd";
import { useForm } from '@/v2/utils/App'
import PermisoForm from "@/v2/components/Autorizaciones/Permisos/PermisoForm";

export default function EditarPermisoModal({permission, open, onClose}) {

    const {data, setData, processing, put, errors }= useForm({
        name: permission.name,
        label: permission.label,
    })

    const onSubmit = () => {
        put(`/v2/api/permissions/${permission.id}`, {
            onSuccess: () => onClose(),
        })
    }

    return (
        <Modal title="Editar Permiso"
               confirmLoading={processing}
               open={open}
               cancelText="Cancelar"
               okText="Actualizar"
               onOk={onSubmit}
               onCancel={onClose}>

            <h2 className="text-xl mb-4 text-app">{permission.nombre}</h2>

            <PermisoForm data={data} setData={setData} errors={errors} editing={true} />

        </Modal>
    )
}
