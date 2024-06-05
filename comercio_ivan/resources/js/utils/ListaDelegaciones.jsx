export const ListaDelegaciones = [
    "La Paz",
    "Todos Santos",
    "San Antonio",
    "El Sargento",
    "Los Barriles",
    "Los Dolores",
    "Los Planes",
    "El Carrizal",
];
export const getListaDelegacionSelectOptions = () => {
    return ListaDelegaciones.map(delegacion => ({ label: delegacion, value: delegacion }));
}
export const delegacionDefault = ListaDelegaciones[0];