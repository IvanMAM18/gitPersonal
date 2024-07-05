import React, {useEffect, useState} from "react";
import {Table, Button} from "antd";
import {debounce} from "lodash";

import CrearPermisoModal from '@/v2/components/Autorizaciones/Permisos/CrearPermisoModal'
import EditarPermisoModal from '@/v2/components/Autorizaciones/Permisos/EditarPermisoModal'
import EliminarPermisoModal from '@/v2/components/Autorizaciones/Permisos/EliminarPermisoModal'
import {authorize} from "@/v2/utils/App";

export default function Permissions() {

    const [isOpenModal, setIsOpenModal] = useState({
        editar: false,
        eliminar: false,
        permisos: false,
    })
    const [selectedPermission, setSelectedPermission] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [paginator, setPaginator] = useState({
        current_page: 1,
        per_page: 30,
        data: []
    })

    useEffect(() => fetchPermissions(), [paginator.current_page])

    const fetchPermissions = debounce(() => {
        setIsLoading(true)
        axios.get(`/v2/api/permissions`, {
            params: {
                current_page: paginator.current_page,
                per_page: paginator.per_page
            }
        })
            .then(response => {
                response.data.data.map(p => p.key = p.id)
                setPaginator(response.data)
                setIsLoading(false)
            })
            .catch(errors => {
                console.log(errors)
                setIsLoading(false)
            })
    }, 300)

    const onTableChange = (pagination) => setPaginator({...paginator, current_page: pagination.current })

    const closeModal = (modal) => {
        setSelectedPermission(null)
        setIsOpenModal({
            ...isOpenModal,
            [modal]: false
        })
        fetchPermissions()
    }

    const openModal = (modal, rol) => {
        setSelectedPermission(rol)
        setIsOpenModal({
            ...isOpenModal,
            [modal]: true
        })
    }


    // Definir las columnas de la tabla
    const columns = [
        {
            title: "ID",
            visible: true,
            render: (permission) => permission.id
        },
        {
            title: "Nombre",
            visible: true,
            render: (permission) => permission.name
        },
        {
            title: "Etiqueta",
            visible: true,
            render: (permission) => <pre className="lowercase m-0">{permission.label}</pre>
        },
        {
            title: "Roles",
            visible: true,
            className: "text-center",
            render: (permission) => permission.roles_count
        },
        {
            title: "",
            visible: authorize(['update:permisos', 'delete:permisos']),
            render: (rol) => {
                return (
                    <>
                        <div className="flex gap-4">
                            {authorize('update:permisos') && <Button size="small" onClick={() => openModal('editar', rol)}>Editar</Button>}
                            {authorize('delete:permisos') && <Button danger size="small" onClick={() => openModal('eliminar', rol)}>Eliminar</Button>}
                        </div>
                    </>
                )
            }
        }
    ].filter(column => column.visible)

    return (
        <div>

            <div className="mb-4 flex justify-end">
                {authorize('store:permisos') && <CrearPermisoModal onCreated={() => fetchPermissions()} />}
            </div>

            {/*Tabla*/}
            <Table loading={isLoading}
                   dataSource={paginator.data}
                   columns={columns}
                   onChange={onTableChange}
                   pagination={{
                       defaultPageSize: paginator.per_page,
                       total: paginator.total,
                   }}>
            </Table>

            {/*Modal para editar un rol*/}
            {isOpenModal.editar && authorize('update:permisos') &&
            <EditarPermisoModal permission={selectedPermission}
                            open={isOpenModal.editar}
                            onClose={() => closeModal('editar')}/>
            }

            {/*Modal para eliminar un rol*/}
            {isOpenModal.eliminar && authorize('delete:permisos') &&
            <EliminarPermisoModal permission={selectedPermission}
                              open={isOpenModal.eliminar}
                              onClose={() => closeModal('eliminar')}/>
            }
        </div>
    )
}
