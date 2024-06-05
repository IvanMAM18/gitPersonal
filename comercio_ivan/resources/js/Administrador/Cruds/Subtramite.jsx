import { useEffect, useState } from "react";
import useGetListaTramites from "../../utils/hooks/useGetListaTramites";
import CrudView from "./CrudView";
import axios from "axios";
import CrudViewSubtramitesTable from "./CrudViewSubtramitesTable";

export default function Subtramite() {
    const [tramites, getTramites] = useGetListaTramites();
    const [tableData, setTableData] = useState([]);
    const [tramitesAgrupados, setTramitesAgrupados] = useState([])



    const [renderCrudView, setRenderCrudView] = useState(false);

    const loadItems = () => {
        axios
            .get(`/app/dashadmin_get_todos_los_subtramites`)
            .then((response) => {
                const formData = response.data;
                formData.map((item) => {
                    item.key = item.id;
                }); 
                console.log("get todos los: ", formData)
                setTableData(formData);
            })
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        getTramites();
        loadItems()
    }, []);

    useEffect(() => {
        if (tableData?.length > 0 && tramites?.length > 0) {
            setTramitesAgrupados(agruparNuevosTramites(tramites, tableData))
            console.log('tramitesAgrupados', tramitesAgrupados)
        }
    }, [tableData, tramites]);

    useEffect(() => {
        if (tramites.length > 0) {
            setRenderCrudView(true);
        }
    }, [tramites]);

    function agruparNuevosTramites(tramites, catalogos) {
        let tramitesPadres = {};
      
        for (const cat of catalogos) {
          const padreId = cat['catalogo_tramite_padre_id'];
          const hijoId = cat['catalogo_tramite_hijo_id'];
          const orden = cat['orden'];
          const key = cat['key'];
          const id = cat['id'];
      
          if (!(padreId in tramitesPadres)) {
            const tramite = tramites.filter(
                (tramite) => tramite.id === padreId
            );
            tramitesPadres[padreId] = {'tramite_padre': tramite, 'catalogo_tramite_padre_id': padreId, 'catalogo_tramite_hijos': []};
          }
          
        const tramiteHijo = tramites.filter(
            (tramite) => tramite.id === hijoId
        );
          tramitesPadres[padreId]['catalogo_tramite_hijos'].push({'tramite_hijo': tramiteHijo, 'catalogo_tramite_padre_id': padreId, 'catalogo_tramite_hijo_id': hijoId, 'orden': orden, 'key': key, 'id': id});
        }
      
        let result = Object.values(tramitesPadres);
        console.log("result", result)
        return result;
      }
      
    const sTramitesColumns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            render: (text, record) => {
                return record?.tramite_padre[0]?.id;
            },
        },
        {
            title: "Tramite padre",
            dataIndex: "tramite_padre",
            key: "id",
            render: (text, record) => {
                return record?.tramite_padre[0]?.nombre;
            },
        },
        // {
        //     title: "Trámite hijo",
        //     dataIndex: "catalogo_tramite_hijo_id",
        //     key: "catalogo_tramite_hijo_id",
        //     render: (text, record) => {
        //         const tramite = tramites.filter(
        //             (tramite) => tramite.id === record.catalogo_tramite_hijo_id
        //         );
        //         return tramite[0]?.nombre;
        //     },
        // },
        // {
        //     title: "Orden",
        //     dataIndex: "orden",
        //     key: "orden",
        // },
    ];

    const sTramitesFormFields = [
        {
            name: "id",
            label: "ID",
            value: "",
            type: "input",
            disabled: true,
            hidden: true,
            rules: [
                {
                    required: false,
                    message: "",
                },
            ],
        },
        {
            name: "catalogo_tramite_padre_id",
            label: "Tramite Padre",
            value: "",
            type: "select",
            disabled: false,
            options: [...tramites],
            rules: [
                {
                    required: true,
                    message: "Este campo es requerido!",
                },
            ],
        },
        {
            name: "catalogo_tramite_hijo_id",
            label: "Tramite Hijo",
            value: "",
            type: "select",
            disabled: false,
            options: [...tramites],
            rules: [
                {
                    required: true,
                    message: "Este campo es requerido!",
                },
            ],
        },
        {
            name: "orden",
            label: "Orden",
            value: "",
            type: "input",
            disabled: false,
            rules: [
                {
                    required: true,
                    message: "Este campo es requerido!",
                },
            ],
        },
    ];

    return (
        
        renderCrudView && (
            <CrudViewSubtramitesTable
                pageTitle="Subtrámites"
                modelo="subtramites"
                columns={sTramitesColumns}
                formFields={sTramitesFormFields}
                key="subtramite"
                isExpandedRow={true}
                tramites={tramitesAgrupados}
                loadItems={loadItems}
            />
        )
    );
}
