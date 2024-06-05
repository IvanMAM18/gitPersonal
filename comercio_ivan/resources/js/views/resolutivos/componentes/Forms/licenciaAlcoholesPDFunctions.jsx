import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import download from "downloadjs";
import moment from "moment";

const getPositionXPercentage = (positionInPDf, width, onePercentW = 25.5) => {
    const tempPercetage = positionInPDf / onePercentW;
    const temp2 = tempPercetage / 100;
    return width * temp2;
};

const getPositionYPercentage = (positionInPDf, height) => {
    const onePercentH = 33;
    const tempPercetage = positionInPDf / onePercentH;
    const tempPercetage2 = 100 - tempPercetage;
    const tempPercetage3 = tempPercetage2 / 100;
    return height * tempPercetage3;
};

function splitString(str, len) {
    var sections = [];
    for (var i = 0; i < str.length; i += len) {
        sections.push(str.slice(i, i + len));
    }
    return sections;
}

const printLargeTexts = (text, page, xPos, yPos, textProps, length = 90) => {
    const parrafos =
        text?.split("\n")?.filter((parrafo) => parrafo !== "") ?? [];

    let count = 0;
    parrafos.forEach((parrafo) => {
        const sections = splitString(parrafo, length);
        sections.forEach((section) => {
            const yPosCount = count * 38;
            page.drawText(section, {
                x: getPositionXPercentage(xPos, textProps.width),
                y: getPositionYPercentage(yPos + yPosCount, textProps.height),
                size: textProps.size,
                font: textProps.font,
                color: textProps.color,
            });
            count++;
        });
        count++;
    });
};

const setPreviewPDF = (pdfBytes) => {
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(blob);
    const pdfFrame = document.createElement("iframe");
    pdfFrame.src = pdfUrl;
    pdfFrame.style.width = "100%";
    pdfFrame.style.height = "75vh";
    document.getElementById("pdf-preview").innerHTML = "";
    document.getElementById("pdf-preview").appendChild(pdfFrame);
};

export async function createLicenciaAlcoholesPDF(values, isPreview) {
    console.log({ values });
    Object.keys(values).forEach((valueKey) => {
        if (typeof values[valueKey] === "string") {
            values[valueKey] = values[valueKey].toUpperCase();
        }
    });

    const url = "/pdf/resolutivos/LicenciaAlcoholesConFirmasNombres.pdf";
    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(
        StandardFonts.HelveticaBold
    );
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    const textProps10 = {
        size: 7,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    };

    if (isPreview === false) {
        const qrImageBytes = await fetch(
            `https://api.qrserver.com/v1/create-qr-code/?size=100x100&margin=5&data=https://comercio.lapaz.gob.mx/resolutivo/${values?.folio}`
        ).then((res) => res.arrayBuffer());
        const currentDate = `Expedido en La Paz, Baja California Sur, a ${String(
            new Date().getDate()
        ).padStart(2, "0")} de ${moment()
            .locale("es")
            .format("MMMM")} de ${moment().format("YYYY")}`;
        const qrImage = await pdfDoc.embedPng(qrImageBytes);
        const qrDims = qrImage.scale(1);

        pages.forEach((page) => {
            page.drawImage(qrImage, {
                x: getPositionXPercentage(2026, width),
                y: getPositionYPercentage(500, height),
                width: qrDims.width,
                height: qrDims.height,
            });
            page.drawText(currentDate, {
                x: getPositionXPercentage(283, width),
                y: getPositionYPercentage(695, height),
                ...textProps10,
            });

            // page.drawText("2023", {
            //     x: getPositionXPercentage(1065, width),
            //     y: getPositionYPercentage(364, height),
            //     ...{ ...textProps10, font: helveticaBoldFont, size: 25 },
            // });
            // firstPage.drawText(values.no_licencia_operador, {
            //     x: getPositionXPercentage(1000, width),
            //     y: getPositionYPercentage(415, height),
            //     ...textProps10,
            //     size: 16,
            // });
            printCenteredText(
                { ...font, family: helveticaBoldFont, size: 25 },
                "2023",
                364,
                height,
                width,
                firstPage
            );
            printCenteredText(
                { ...font, family: helveticaBoldFont, size: 18 },
                values.no_licencia_operador,
                425,
                height,
                width,
                firstPage
            );
        });
    }

    if (
        values?.razon_social_propietario !== null &&
        values?.razon_social_propietario !== undefined &&
        values?.razon_social_propietario !== "" &&
        values?.razon_social_propietario !== "NA"
    ) {
        firstPage.drawText(
            `${values?.razon_social_propietario}${
                values?.regimen_capital_propietario !== null &&
                values?.regimen_capital_propietario !== undefined &&
                values?.regimen_capital_propietario !== "" &&
                values?.regimen_capital_propietario !== "NA"
                    ? " " + values?.regimen_capital_propietario
                    : ""
            }`,
            {
                x: getPositionXPercentage(503, width),
                y: getPositionYPercentage(960, height),
                ...textProps10,
            }
        );
    } else {
        firstPage.drawText(values.nombre_propietario, {
            x: getPositionXPercentage(503, width),
            y: getPositionYPercentage(960, height),
            ...textProps10,
        });
    }

    //area central //
    const info = values?.alcohol_tipo ?? null;
    if (info !== null) {
        firstPage.drawText(info.clasificacion.toUpperCase(), {
            x: getPositionXPercentage(440, width),
            y: getPositionYPercentage(1409, height),
            ...textProps10,
        });

        firstPage.drawText(info.dias.toUpperCase(), {
            x: getPositionXPercentage(1173, width),
            y: getPositionYPercentage(1409, height),
            ...textProps10,
        });

        firstPage.drawText(
            `${info.horario.abre.toUpperCase()} - ${info.horario.cierra.toUpperCase()}`,
            {
                x: getPositionXPercentage(1845, width),
                y: getPositionYPercentage(1409, height),
                ...textProps10,
            }
        );
        firstPage.drawText(info.descripcion.slice(0, 95).toUpperCase(), {
            x: getPositionXPercentage(566, width),
            y: getPositionYPercentage(1463, height),
            ...textProps10,
        });
        firstPage.drawText(info.descripcion.slice(95, 200).toUpperCase(), {
            x: getPositionXPercentage(346, width),
            y: getPositionYPercentage(1534, height),
            ...textProps10,
        });
        firstPage.drawText(info.descripcion.slice(200).toUpperCase(), {
            x: getPositionXPercentage(346, width),
            y: getPositionYPercentage(1593, height),
            ...textProps10,
        });

        firstPage.drawText(info.condicion.slice(0, 94).toUpperCase(), {
            x: getPositionXPercentage(566, width),
            y: getPositionYPercentage(1651, height),
            ...textProps10,
        });
        firstPage.drawText(info.condicion.slice(94, 200).toUpperCase(), {
            x: getPositionXPercentage(346, width),
            y: getPositionYPercentage(1712, height),
            ...textProps10,
        });
        firstPage.drawText(info.condicion.slice(200).toUpperCase(), {
            x: getPositionXPercentage(346, width),
            y: getPositionYPercentage(1771, height),
            ...textProps10,
        });
    }

    firstPage.drawText(values.antecedentes.slice(0, 95).toUpperCase(), {
        x: getPositionXPercentage(598, width),
        y: getPositionYPercentage(1828, height),
        ...textProps10,
    });
    firstPage.drawText(values.antecedentes.slice(95).toUpperCase(), {
        x: getPositionXPercentage(346, width),
        y: getPositionYPercentage(1890, height),
        ...textProps10,
    });
    /////////////////

    firstPage.drawText(values.curp_propietario, {
        x: getPositionXPercentage(461, width),
        y: getPositionYPercentage(1023, height),
        ...textProps10,
    });
    firstPage.drawText(values.rfc_propietario, {
        x: getPositionXPercentage(1072, width),
        y: getPositionYPercentage(1023, height),
        ...textProps10,
    });
    firstPage.drawText(values.telefono_propietario, {
        x: getPositionXPercentage(1665, width),
        y: getPositionYPercentage(1023, height),
        ...textProps10,
    });

    firstPage.drawText(
        values.domicilio_notificaciones_propietario.slice(0, 70),
        {
            x: getPositionXPercentage(1045, width),
            y: getPositionYPercentage(1087, height),
            ...textProps10,
        }
    );
    firstPage.drawText(values.domicilio_notificaciones_propietario.slice(70), {
        x: getPositionXPercentage(346, width),
        y: getPositionYPercentage(1153, height),
        ...textProps10,
    });
    firstPage.drawText(values.email_propietario, {
        x: getPositionXPercentage(459, width),
        y: getPositionYPercentage(1214, height),
        ...textProps10,
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    firstPage.drawText(values.no_licencia_2, {
        x: getPositionXPercentage(873, width),
        y: getPositionYPercentage(2266, height),
        ...textProps10,
    });
    firstPage.drawText(info.clasificacion.toUpperCase(), {
        x: getPositionXPercentage(1271, width),
        y: getPositionYPercentage(1345, height),
        ...textProps10,
    });
    /////////
    /////////OPERADOR//////////////////////////
    firstPage.drawText(values.nombre_comercial_operador, {
        x: getPositionXPercentage(664, width),
        y: getPositionYPercentage(2076, height),
        ...textProps10,
    });
    firstPage.drawText(values.direccion_operador.slice(0, 82), {
        x: getPositionXPercentage(522, width),
        y: getPositionYPercentage(2139, height),
        ...textProps10,
    });
    firstPage.drawText(values.direccion_operador.slice(82), {
        x: getPositionXPercentage(346, width),
        y: getPositionYPercentage(2204, height),
        ...textProps10,
    });
    firstPage.drawText(values.no_licencia_operador, {
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        x: getPositionXPercentage(633, width),
        y: getPositionYPercentage(1345, height),
        ...textProps10,
    });
    firstPage.drawText(values.clave_registro_municipal_operador, {
        x: getPositionXPercentage(1899, width),
        y: getPositionYPercentage(2266, height),
        ...textProps10,
    });

    const font = {
        size: 10,
        family: helveticaFont,
        color: rgb(0, 0, 0),
    };
    // if (isPreview === false) {
    //     printCenteredTextLeft(
    //         { ...font, family: helveticaBoldFont },
    //         "L.C. SARA MARÍA BELTRÁN NAVARRO",
    //         3045,
    //         height,
    //         width,
    //         firstPage
    //     );
    //     printCenteredTextRight(
    //         { ...font, family: helveticaBoldFont },
    //         "LIC. CYNTHIA ARABEL GARCÍA ROJAS",
    //         3045,
    //         height,
    //         width,
    //         firstPage
    //     );

    //     printCenteredText(
    //         { ...font, family: helveticaBoldFont },
    //         "MILENA PAOLA QUIROGA ROMERO",
    //         2719,
    //         height,
    //         width,
    //         firstPage
    //     );
    // }

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();
    if (isPreview === false) {
        // Trigger the browser to download the PDF document
        download(pdfBytes, "Licencia de alcoholes.pdf", "application/pdf");
    } else {
        setPreviewPDF(pdfBytes);
    }
}

const printCenteredTextLeft = (font, text, yPosition, height, width, page) => {
    const textWidtht = font.family.widthOfTextAtSize(text, font.size);
    const sidePadding = getPositionXPercentage(336, width);
    const sidePaddingPercentage = sidePadding / (width / 100);

    const w1Percentage = (100 - sidePaddingPercentage * 2) / 100;
    const w1 = width * w1Percentage;
    const w2 = w1 / 2;
    const w3 = w2 / 2;
    const wt = sidePadding + w3;
    page.drawText(text, {
        x: wt - textWidtht / 2,
        y: getPositionYPercentage(yPosition, height),
        size: font.size,
        font: font.family,
        color: font.color,
    });
};

const printCenteredTextRight = (font, text, yPosition, height, width, page) => {
    const textWidtht = font.family.widthOfTextAtSize(text, font.size);
    const sidePadding = getPositionXPercentage(336, width);
    const sidePaddingPercentage = sidePadding / (width / 100);

    const w1Percentage = (100 - sidePaddingPercentage * 2) / 100;
    const w1 = width * w1Percentage;
    const w2 = w1 / 2;
    const w3 = w2 / 2;
    const wt = sidePadding + w2 + w3;
    page.drawText(text, {
        x: wt - textWidtht / 2,
        y: getPositionYPercentage(yPosition, height),
        size: font.size,
        font: font.family,
        color: font.color,
    });
};
const printCenteredText = (font, text, yPosition, height, width, page) => {
    const textWidth = font.family.widthOfTextAtSize(text, font.size);
    const pageWidth = width;
    const centerX = (pageWidth - textWidth) / 2;

    page.drawText(text, {
        x: centerX,
        y: getPositionYPercentage(yPosition, height),
        size: font.size,
        font: font.family,
        color: font.color,
    });
};
