import {Modal, Checkbox, Input} from "antd";
import {useForm} from "@/v2/utils/App";
import {useEffect, useState} from "react";
import {debounce, pickBy} from "lodash";

export default function PermisosRolModal({rol, open, onClose}) {

    const [paginator, setPaginator] = useState({
        data: []
    })
    const [filters, setFilters] = useState({
        per_page: 100,
        current_page: 1,
        search_key: ''
    })
    const {data, setData, processing, put, errors} = useForm({
        permissions: rol.permissions.map(p => p.id)
    })

    useEffect(() => fetchPermissions(), [filters.search_key])

    const fetchPermissions = debounce(() => {
        axios.get(`/v2/api/permissions`, {
            params: pickBy(filters)
        })
            .then(response => {
                setPaginator(response.data)
            })
            .catch(errors => {
                console.log(errors)
            })
    }, 300)

    const onSubmit = () => {
        put(`/v2/api/roles/${rol.id}/permissions`, {
            onSuccess: (response) => {
                onClose()
            },
        })
    }

    const togglePermission = (event) => {
        const checkedId = parseInt(event.target.value);
        if (data.permissions.includes(checkedId)) {
            setData('permissions', data.permissions.filter(id => id !== checkedId))
        } else {
            setData('permissions', [...data.permissions, checkedId])
        }
    }

    const updateFilters = (property, value) => {
        setFilters({...filters, [property] : value})
    }

    return (
        <Modal title="Permisos Assignados"
               width={1200}
               confirmLoading={processing}
               open={open}
               onOk={onSubmit}
               cancelText="Cancelar"
               okText="Guardar"
               onCancel={onClose}>

            <h2 className="text-xl mb-4 text-app">{rol.nombre}</h2>

            {/*Permissions*/}
            <div className="mb-4">

                <Input className="mb-4"
                       placeholder="Buscar permiso..."
                       onChange={event => updateFilters('search_key', event.target.value)} />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {paginator.data.map(permission =>
                        <div className="mb-1" key={permission.id}>
                            <Checkbox defaultChecked={data.permissions.includes(permission.id)}
                                      defaultValue={permission.id}
                                      onClick={event => togglePermission(event)}>
                                {permission.name}
                                <div className="text-xs text-info">{permission.label}</div>
                            </Checkbox>
                        </div>
                    )}
                </div>
            </div>

            <div className="text-xs text-app">{errors.permissions}</div>

        </Modal>
    )
}
