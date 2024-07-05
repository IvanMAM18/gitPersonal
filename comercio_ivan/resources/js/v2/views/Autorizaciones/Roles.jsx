import React, {useEffect, useState} from "react";
import {Table, Button} from "antd";
import {debounce} from "lodash";

import CrearRolModal from '@/v2/components/Autorizaciones/Roles/CrearRolModal'
import EditarRolModal from '@/v2/components/Autorizaciones/Roles/EditarRolModal'
import PermisosRolModal from '@/v2/components/Autorizaciones/Roles/PermisosRolModal'
import EliminarRolModal from '@/v2/components/Autorizaciones/Roles/EliminarRolModal'
import {authorize} from "@/v2/utils/App";
import CrearPermisoModal from "@/v2/components/Autorizaciones/Permisos/CrearPermisoModal";

export default function Roles() {

    const [isOpenModal, setIsOpenModal] = useState({
        editar: false,
        eliminar: false,
        permisos: false,
    })
    const [selectedRol, setSelectedRol] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [paginator, setPaginator] = useState({
        current_page: 1,
        per_page: 30,
        data: []
    })

    useEffect(() => fetchRoles(), [paginator.current_page])

    const fetchRoles = debounce(() => {
        setIsLoading(true)
        axios.get('/v2/api/roles', {
            params: {
                current_page: paginator.current_page,
                per_page: paginator.per_page
            }
        })
            .then(response => {
                response.data.data.map(r => r.key = r.id)
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
        setSelectedRol(null)
        setIsOpenModal({
            ...isOpenModal,
            [modal]: false
        })
        fetchRoles()
    }

    const openModal = (modal, rol) => {
        setSelectedRol(rol)
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
            render: (rol) => rol.id
        },
        {
            title: "Nombre",
            visible: true,
            render: (rol) => {
                return (
                    <div>
                        {rol.nombre}
                        <div className="text-xs text-gray-400">{rol.descripcion}</div>
                    </div>
                )
            }
        },
        {
            title: "Etiqueta",
            visible: true,
            render: (rol) => <pre className="lowercase m-0">{rol.label}</pre>
        },
        {
            title: "Permisos",
            visible: true,
            className: "text-center",
            render: (rol) => rol.permissions.length
        },
        {
            title: "",
            visible: (authorize('update:roles', 'delete:roles')),
            render: (rol) => {
                return (
                    <>
                        <div className="flex gap-4">
                            {authorize('update:roles') && <Button size="small" onClick={() => openModal('editar', rol)}>Editar</Button>}
                            {authorize('update:roles') && <Button size="small" onClick={() => openModal('permisos', rol)}>Permisos</Button>}
                            {authorize('delete:roles') && <Button danger size="small" onClick={() => openModal('eliminar', rol)}>Eliminar</Button>}
                        </div>
                    </>
                )
            }
        }
    ].filter(column => column.visible)

    return (
        <div>

            <div className="mb-4 flex justify-end">
                {authorize('store:roles') && <CrearRolModal onCreated={() => fetchRoles()} />}
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
            {isOpenModal.editar && authorize('update:roles') &&
            <EditarRolModal rol={selectedRol}
                            open={isOpenModal.editar}
                            onClose={() => closeModal('editar')}/>
            }

            {/*Modal para asignar permisos a un rol*/}
            {isOpenModal.permisos && authorize('update:roles') &&
            <PermisosRolModal rol={selectedRol}
                              open={isOpenModal.permisos}
                              onClose={() => closeModal('permisos')}/>
            }

            {/*Modal para eliminar un rol*/}
            {isOpenModal.eliminar && authorize('delete:roles') &&
            <EliminarRolModal rol={selectedRol}
                              open={isOpenModal.eliminar}
                              onClose={() => closeModal('eliminar')}/>
            }
        </div>
    )
}
