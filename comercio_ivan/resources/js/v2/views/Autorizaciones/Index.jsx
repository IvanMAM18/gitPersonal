import {Tabs} from "antd";

import Roles from '@/v2/views/Autorizaciones/Roles'
import Permisos from '@/v2/views/Autorizaciones/Permissions'
import {authorize} from "@/v2/utils/App";

export default function AutorizacionesIndex() {

    const items = [
        {
            visible: authorize('index:roles'),
            key: 'roles',
            label: 'Roles',
            children: <Roles />,
        },
        {
            visible: authorize('index:permisos'),
            key: 'permissions',
            label: 'Permisos',
            children: <Permisos />,
        },
    ].filter(item => item.visible)

    return (
        <div>

            <div className="mb-4 flex justify-between items-end">
                <h1 className="text-3xl text-gray-700 mb-0">Autorizaciónes</h1>
            </div>

            <Tabs defaultActiveKey="roles" items={items} />
        </div>
    )
}
