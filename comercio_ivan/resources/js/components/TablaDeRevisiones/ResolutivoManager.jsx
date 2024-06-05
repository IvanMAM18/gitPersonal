import React from "react";
import { message } from "antd";
import { createTramiteUsoDeSueloPDF } from "../../views/resolutivos/componentes/funciones_resolutivos";
import { getDescripcionUbicacion } from "../../views/resolutivos/utils";
import { checkGirosEnProgramaInterno } from "../../views/resolutivos/utils";
import {
    createCertificacionPdf_AI,
    createCertificacionPdf_BI,
} from "../../views/resolutivos/componentes/funciones_resolutivos";
import { createDictamenEcologiaPdf } from "../../views/resolutivos/componentes/funciones_resolutivos";
import { createLicenciaFuncionamientoPDF } from "../../views/resolutivos/componentes/licenciaFuncionamientoPDF_Functions";

export default function ResolutivoManager({ resolutivo }) {
    console.log({ resolutivo });

    const cargarUsoDeSuelo = async () => {
        await createTramiteUsoDeSueloPDF(
            {
                ...resolutivo,
                ubicacion_predio: getDescripcionUbicacion(
                    resolutivo?.clave_plano,
                    resolutivo?.ubicacion_predio
                ),
            },
            false
        ).catch((error) => {
            console.log({ error });
            message.error("Hubo un problema al generar el documento");
        });
    };

    const cargaProteccionCivil = () => {
        switch (
            checkGirosEnProgramaInterno(
                resolutivo.giro_comercial,
                resolutivo.num_empleados_h + resolutivo.num_empleados_m
            )
        ) {
            case true:
                createCertificacionPdf_AI(resolutivo, false, false);
                break;
            default:
                createCertificacionPdf_BI(resolutivo, false, false);
                break;
        }
    };

    const getPdfTemplate = async () => {
        switch (resolutivo?.entidadRevisoraId) {
            case 1: //uso de suelo
                cargarUsoDeSuelo();
                break;
            case 2: // protección civil
                cargaProteccionCivil();
                break;
            case 3: //medio ambiente / ecologia
                createDictamenEcologiaPdf(resolutivo, false, true);
                break;
            case 4:
                break;
            case 5: //licencia de funcionamiento
                console.log({ resolutivo });
                createLicenciaFuncionamientoPDF(resolutivo, false);
                break;
            case 6: //alcoholes
                break;
            default:
                break;
        }
    };
    getPdfTemplate();
    return (
        <div>
            {resolutivo?.folio === null ? (
                <h3 style={{ textAlign: "center" }}>Resolutivo no firmado</h3>
            ) : (
                <>
                    <div id="pdf-preview" style={{ height: "90%" }}></div>
                    <div id="pdf-preview-pc" style={{ height: "90%" }}></div>
                    <div id="pdf-preview-ec" style={{ height: "90%" }}></div>
                </>
            )}
        </div>
    );
}
