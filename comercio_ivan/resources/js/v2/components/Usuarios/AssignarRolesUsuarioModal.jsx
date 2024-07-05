import {Checkbox, Input, Modal} from "antd";
import { useForm } from '@/v2/utils/App'
import {debounce, pickBy} from "lodash";
import {useEffect, useState} from "react";

export default function AssignarRolesUsuarioModal({usuario, open, onClose}) {

    const [paginator, setPaginator] = useState({
        data: []
    })
    const [filters, setFilters] = useState({
        search_key: ''
    })
    const {data, setData, processing, put, errors} = useForm({
        roles: usuario.roles.map(p => p.id)
    })

    useEffect(() => fetchRoles(), [filters.search_key])

    const fetchRoles = debounce(() => {
        axios.get('/v2/api/roles', {
            params: pickBy(filters)
        })
            .then(response => {
                setPaginator(response.data)
            })
            .catch(errors => console.log(errors))
    }, 300)

    const onSubmit = () => {
        put(`/v2/api/usuarios/${usuario.id}/roles`, {
            onSuccess: () => onClose(),
        })
    }

    const toggleRoles = (event) => {
        const checkedId = parseInt(event.target.value);
        if (data.roles.includes(checkedId)) {
            setData('roles', data.roles.filter(id => id !== checkedId))
        } else {
            setData('roles', [...data.roles, checkedId])
        }
    }

    const updateFilters = (property, value) => {
        setFilters({...filters, [property] : value})
    }

    return (
        <>

            <Modal title="Assignar Roles"
                   width={1200}
                   confirmLoading={processing}
                   open={open}
                   cancelText="Cancelar"
                   okText="Actualizar"
                   onOk={onSubmit}
                   onCancel={onClose}>

                <h2 className="text-xl mb-4 text-app">{usuario.nombre_completo}</h2>

                {/*Roles*/}
                <div className="mb-4">

                    <Input className="mb-4"
                           placeholder="Buscar roles..."
                           onChange={event => updateFilters('search_key', event.target.value)} />

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {paginator.data.map(rol =>
                            <div className="mb-1" key={rol.id}>
                                <Checkbox defaultChecked={data.roles.includes(rol.id)}
                                          defaultValue={rol.id}
                                          onClick={event => toggleRoles(event)}>
                                    {rol.nombre}
                                    <div className="text-xs text-info">{rol.label}</div>
                                </Checkbox>
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-xs text-app">{errors.roles}</div>

            </Modal>

        </>
    )
}
