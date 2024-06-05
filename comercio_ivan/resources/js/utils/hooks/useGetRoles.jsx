import axios from "axios";
import { useState } from "react";

export default function useGetRoles() {
    const [roles, setRoles] = useState([]);

    const getRoles = () => {
        axios.get("/app/roles_all").then((result) => {
            setRoles(result?.data ?? []);
        });
    };

    return [roles, getRoles];
}
