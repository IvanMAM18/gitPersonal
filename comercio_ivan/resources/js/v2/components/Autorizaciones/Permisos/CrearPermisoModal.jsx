import {Modal, Button } from "antd";
import { useForm } from '@/v2/utils/App'
import {useState} from "react";
import PermisoForm from "@/v2/components/Autorizaciones/Permisos/PermisoForm";

export default function CrearPermisoModal() {

    const [isModalOpen, setIsModalOpen] = useState(false)

    const {data, setData, processing, post, errors, reset }= useForm({
        name: '',
        label: '',
    })

    const onSubmit = () => {
        post(`/v2/api/permissions`, {
            onSuccess: () => {
                reset()
                setIsModalOpen(false)
            }
        })
    }

    return (
        <>

            <Button type="primary" onClick={() => setIsModalOpen(true)}>Nuevo Permiso</Button>

            <Modal title="Crear un Nuevo Permiso"
                   confirmLoading={processing}
                   open={isModalOpen}
                   cancelText="Cancelar"
                   okText="Guardar"
                   onCancel={() => setIsModalOpen(false)}
                   onOk={onSubmit}>

                <PermisoForm data={data} setData={setData} errors={errors} />

            </Modal>

        </>
    )
}
