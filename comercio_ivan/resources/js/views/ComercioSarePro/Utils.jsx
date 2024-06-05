import { Tag } from "antd";
export const getCreatedAtFormattedUtcToLaPazTimezone = (created_at) => {
    const dateObj = new Date(created_at);
    const options = {
        timeZone: "America/Mazatlan", // La Paz, BCS timezone
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    };
    // Format date and time
    const formattedDateTime = dateObj.toLocaleString("en-US", options);
    return <span>{`${formattedDateTime}`}</span>;
}

export const getVentaAlcoholTag = (venta_alcohol) => {
    if (venta_alcohol === null) {
        return <Tag>N/A</Tag>;
    }
    return venta_alcohol ? (
        <Tag color="blue">Sí</Tag>
    ) : (
        <Tag>No</Tag>
    );
}

export const tramiteIdSorter = (a, b) => {
    const tramite_a = a.tramite_comercio_padre?.tramite?.id || 0;
    const tramite_b = b.tramite_comercio_padre?.tramite?.id || 0;
    return tramite_a < tramite_b ? 1 : 0;
}

export const defaultPagination = {
    current: 0,
    pageSize: 50,
    pageSizeOptions: ["5", "10", "20", "50", "100", "200", "500", "1000"],
    total: 0,
}

export const defaultTableFilters = {
    id: '',
    alcohol: null,
    negocio: '',
    impacto: null,
    tamano_empresa: '',
    validado_por: 0,
    progreso: [],
}

