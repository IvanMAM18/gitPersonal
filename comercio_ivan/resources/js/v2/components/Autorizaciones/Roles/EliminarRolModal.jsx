import {Modal } from "antd";
import { useForm } from '@/v2/utils/App'

export default function EliminarRolModal({rol, open, onClose}) {

    const { processing, delete : destroy, errors }= useForm()

    const onSubmit = () => {
        destroy(`/v2/api/roles/${rol.id}`, {
            onSuccess: () => onClose(),
        })
    }

    return (
        <Modal title="Eliminar Rol"
               confirmLoading={processing}
               open={open}
               cancelText="Cancelar"
               okText="Si, Eliminar"
               onOk={onSubmit}
               onCancel={onClose}>

            <h2 className="text-xl mb-4 text-app">{rol.nombre}</h2>

            <p>Esta seguro que desea eliminar el rol?</p>

        </Modal>
    )
}
