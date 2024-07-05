import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import routes from '../utils/react-routes.jsx'

export default function RolesRouter() {
    const navigate = useNavigate()

    useEffect(() => {
        const role = window.user.role
        // console.log(role)
        // console.log(routes.allowedByRole)
        if (routes.allowedByRole[role]?.includes(location.pathname.replace(/[0-9]+/g, '__rid__'))) {

        } else {
            navigate(routes.allowedByRole[role][0])
        }
    }, [])
    return <></>
}
