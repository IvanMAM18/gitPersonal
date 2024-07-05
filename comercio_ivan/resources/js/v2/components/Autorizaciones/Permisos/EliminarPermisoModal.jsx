import {Modal } from "antd";
import { useForm } from '@/v2/utils/App'

export default function EliminarPermisoModal({permission, open, onClose}) {

    const { processing, delete : destroy, errors }= useForm()

    const onSubmit = () => {
        destroy(`/v2/api/permissions/${permission.id}`, {
            onSuccess: () => onClose(),
        })
    }

    return (
        <Modal title="Eliminar Permiso"
               confirmLoading={processing}
               open={open}
               cancelText="Cancelar"
               okText="Si, Eliminar"
               onOk={onSubmit}
               onCancel={onClose}>

            <h2 className="text-xl mb-4 text-app">{permission.nombre}</h2>

            <p>Esta seguro que desea eliminar el rol?</p>

        </Modal>
    )
}
