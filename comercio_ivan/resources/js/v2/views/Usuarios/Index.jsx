import { useEffect, useState, useRef } from "react";
import { pickBy, debounce } from 'lodash'
import { authorize, entidadRevisoras } from "@/v2/utils/App";
import {Input, Select, Button,} from 'antd'
import {Table, Row, Column, Thead, Tbody, Paginator} from "@/v2/components/Elements";
import CrearUsuarioModal from '@/v2/components/Usuarios/CrearUsuarioModal'
import EditarUsuarioModal from '@/v2/components/Usuarios/EditarUsuarioModal'
import CambiarContrasenaUsuarioModal from '@/v2/components/Usuarios/CambiarContrasenaUsuarioModal'
import AssignarRolesUsuarioModal from '@/v2/components/Usuarios/AssignarRolesUsuarioModal'
import EliminarUsuarioModal from '@/v2/components/Usuarios/EliminarUsuarioModal'
import RolBadge from '@/v2/components/Autorizaciones/Roles/Badge'

// Estados inicial de los filtros
const INITIAL_STATE_FILTERS = {
    search_key: '',
    page: 1,
    rol_id: '',
    entidad_revisora_id: '',
}

export default function UsuariosIndex() {

    const [isOpenModal, setIsOpenModal] = useState({
        editar: false,
        assignar_roles: false,
        cambiar_contrasena: false,
        eliminar: false,
    })
    const [roles, setRoles] = useState([])
    const [selectedUsuario, setSelectedUsuario] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [paginator, setPaginator] = useState({
        links: [],
        data: [],
    })
    const [filters, setFilters] = useState({
        ...INITIAL_STATE_FILTERS,
    });

    useEffect(() => fetchRoles(), [])
    useEffect(() => fetchUsuarios(), [filters])

    // Obtener todos los usuarios del sistema paginados.
    const fetchUsuarios = debounce(() => {
        setIsLoading(true)
        axios.get(`/v2/api/usuarios`, {
            params: pickBy(filters)
        })
            .then(response => {
                setIsLoading(false)
                response.data.data.map(u => u.key = u.id)
                setPaginator(response.data)
            })
            .catch(errors => {
                setIsLoading(false)
                console.log(errors)
            })
    }, 300)

    // Jalar roles para usar en el filtro de dropdown.
    const fetchRoles = () => {
        axios.get(`/v2/api/roles?all`)
            .then(response => {
                setRoles(response.data)
            })
            .catch(errors => console.log(errors))
    }

    // Helper para actualizar los datos del state filters.
    const setData = (property, value) => {
        setFilters(prevFilters => {
            return {
                ...prevFilters,
                [property]: value
            };
        })
    }

    // Cerrar modal
    const closeModal = (modal) => {
        setSelectedUsuario(null)
        setIsOpenModal({
            ...isOpenModal,
            [modal]: false
        })
        fetchUsuarios()
    }

    // Abribr modal y setear el rol seleccionado.
    const openModal = (modal, rol) => {
        setSelectedUsuario(rol)
        setIsOpenModal({
            ...isOpenModal,
            [modal]: true
        })
    }

    return (
        <div>

            {/*Encabezado*/}
            <div className="mb-4 flex justify-between items-end">
                <h1 className="text-3xl text-gray-700 mb-0">Usuarios</h1>
            </div>

            {/*Filtros*/}
            <div className="w-full flex items-end justify-between mb-4 gap-2">

                <div className="w-full xl:w-3/4 flex gap-2">

                    {/*Filtrar por varios campos*/}
                    <Input onChange={event => setData('search_key', event.target.value)}
                           placeholder="Buscar por Nombre, Correo Electrónico, RFC, CURP" />

                    {/*Filtrar por Entidad Revisora*/}
                    <Select value={filters.entidad_revisora_id}
                            className="w-1/4 xl:1/2"
                            onChange={value => setData('entidad_revisora_id', value)} >
                        <Select.Option value="">Todas las Entidades Revisoras</Select.Option>
                        {entidadRevisoras.map(entidad =>
                            <Select.Option key={entidad.id} value={entidad.id}>{entidad.nombre}</Select.Option>
                        )}
                    </Select>

                    {/*Filtrar por Role*/}
                    <Select value={filters.rol_id}
                            className="w-1/4 xl:1/2"
                            onChange={value => setData('rol_id', value)} >
                        <Select.Option value="">Todos los Roles</Select.Option>
                        {roles.map(rol =>
                            <Select.Option key={rol.id} value={rol.id}>{rol.nombre}</Select.Option>
                        )}
                    </Select>

                </div>

                {/*Boton y Modal Crear Usuario*/}
                {authorize('store:usuarios') && <CrearUsuarioModal />}

            </div>

            {/*Tabla*/}
            <Table className="mb-4">
                <Thead>
                    <Row header>
                        <Column header>ID</Column>
                        <Column header>Nombre</Column>
                        <Column header>Email</Column>
                        <Column header>RFC</Column>
                        <Column header>CURP</Column>
                        <Column header>Roles</Column>
                        <Column header>Entidad Revisora</Column>
                        <Column header></Column>
                    </Row>
                </Thead>
                <Tbody>
                    {paginator.data.map(usuario =>
                        <Row hover key={usuario.id}>
                            <Column>{usuario.id}</Column>
                            <Column>{usuario.nombre_completo}</Column>
                            <Column>
                                <div className="flex items-center gap-1">
                                    {!usuario.email_verified_at &&
                                    <div className="size-2 rounded-full bg-red-500" title="No Verificado"></div>
                                    }
                                    <div className="text-xs text-gray-500">{usuario.email}</div>
                                </div>
                            </Column>
                            <Column>{usuario.rfc}</Column>
                            <Column>{usuario.curp}</Column>
                            <Column>
                                <div className="flex">
                                    {usuario.roles.map(rol =>
                                        <RolBadge key={rol.id} rol={rol} />
                                    )}
                                </div>
                            </Column>
                            <Column>{usuario.entidad_revision?.nombre}</Column>
                            <Column>
                                <div className="flex gap-1 ml-auto w-fit">
                                    {authorize('update:usuarios') &&
                                        <>
                                            <Button size="small" onClick={() => openModal('editar', usuario)}>
                                                Editar
                                            </Button>
                                            <Button size="small" onClick={() => openModal('cambiar_contrasena', usuario)}>
                                                Cambiar Contraseña
                                            </Button>
                                            <Button size="small" onClick={() => openModal('assignar_roles', usuario)}>
                                                Roles
                                            </Button>
                                        </>
                                    }
                                    {authorize('delete:usuarios') &&
                                        <Button size="small" onClick={() => openModal('eliminar', usuario)} danger>
                                            Eliminar
                                        </Button>
                                    }
                                </div>
                            </Column>
                        </Row>
                    )}
                </Tbody>
            </Table>

            {/*Footer*/}
            <div className="flex">

                {/*Leyenda de emails no validados*/}
                <div className="flex items items-center gap-1 text-xs">
                    <div className="size-2 bg-red-500 rounded-full"></div>
                    Usuarios no validados.
                </div>

                {/*Paginador*/}
                <Paginator paginator={paginator}
                           onPageChange={pageNumber => setData('page', pageNumber)}
                           className="ml-auto" />
            </div>

            {/*Modales*/}
            {(authorize('update:usuarios') && isOpenModal.editar) &&
            <EditarUsuarioModal usuario={selectedUsuario}
                                open={isOpenModal.editar}
                                onClose={() => closeModal('editar')}/>
            }

            {(authorize('update:usuarios') && isOpenModal.cambiar_contrasena) &&
            <CambiarContrasenaUsuarioModal usuario={selectedUsuario}
                                       open={isOpenModal.cambiar_contrasena}
                                       onClose={() => closeModal('cambiar_contrasena')}/>
            }

            {(authorize('update:usuarios') && isOpenModal.assignar_roles) &&
            <AssignarRolesUsuarioModal usuario={selectedUsuario}
                                open={isOpenModal.assignar_roles}
                                onClose={() => closeModal('assignar_roles')}/>
            }

            {(authorize('delete:usuarios') && isOpenModal.eliminar) &&
            <EliminarUsuarioModal usuario={selectedUsuario}
                                open={isOpenModal.eliminar}
                                onClose={() => closeModal('eliminar')}/>
            }

        </div>

    );
}
