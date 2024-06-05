import { useState } from "react";
import axios from "axios";
export default function useGetPersonasMorales() {
    const [personasMorales, setPersonasMorales] = useState(null);
    const getPersonasMorales = async () => {
        const response = await axios
            .get("/app/personas-morales")
            .catch((error) => console.log(error));
        setPersonasMorales(
            response?.data?.map((personaMoral) => ({
                ...personaMoral,
                key: personaMoral?.id,
            })) ?? null
        );
    };

    return [personasMorales, getPersonasMorales];
}
