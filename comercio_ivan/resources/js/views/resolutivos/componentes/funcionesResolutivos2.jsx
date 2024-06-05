import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import download from "downloadjs";
import moment from "moment";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
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
const setImageFiles = (
    image,
    format,
    embedImages,
    posX,
    posY,
    page,
    w,
    h,
    pdfDoc
) => {
    const reader = new FileReader();
    reader.onload = async function () {
        var arrayBuffer = new Uint8Array(reader.result);
        if (format === "image/jpeg") {
            embedImages.push({
                image: await pdfDoc.embedJpg(arrayBuffer),
                x: posX,
                y: posY,
                page: page,
                w: w,
                h: h,
            });
        } else {
            embedImages.push({
                image: await pdfDoc.embedPng(arrayBuffer),
                x: posX,
                y: posY,
                page: page,
                w: w,
                h: h,
            });
        }
    };
    reader.readAsArrayBuffer(image?.originFileObj);
};

export async function createPreviewTramiteUsoDeSueloPDF(values) {
    const user = window.user;

    const url =
        values?.ubicacion_predio !== "otros"
            ? "/pdf/resolutivos/Uso_de_Suelo.pdf"
            : "/pdf/resolutivos/Uso_de_Suelo_otros.pdf";
    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    const textProps12 = {
        size: 8,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    };

    const textProps10 = {
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    };

    const currentDate = "Este documento no tiene validez oficial";

    pages.forEach((page) => {
        page.drawText(currentDate, {
            x: getPositionXPercentage(390, width),
            y: getPositionYPercentage(635, height),
            ...textProps12,
        });
    });

    firstPage.drawText(values.quien_solicita, {
        x: getPositionXPercentage(460, width),
        y: getPositionYPercentage(1008, height),
        ...textProps12,
    });

    firstPage.drawText(values.fecha_inicio_tramite, {
        x: getPositionXPercentage(1396, width),
        y: getPositionYPercentage(1464, height),
        ...textProps10,
    });

    firstPage.drawText(values.autorizacion_uso_suelo, {
        x: getPositionXPercentage(1219, width),
        y: getPositionYPercentage(1505, height),
        ...textProps10,
    });

    firstPage.drawText(values.negocio, {
        x: getPositionXPercentage(495, width),
        y: getPositionYPercentage(1544, height),
        ...textProps10,
    });

    firstPage.drawText(values.clave_catastral, {
        x: getPositionXPercentage(704, width),
        y: getPositionYPercentage(1580, height),
        ...textProps10,
    });

    firstPage.drawText(values.tipo_predio, {
        x: getPositionXPercentage(1831, width),
        y: getPositionYPercentage(1578, height),
        ...textProps10,
    });

    firstPage.drawText(values.superficie.toString(), {
        x: getPositionXPercentage(824, width),
        y: getPositionYPercentage(1615, height),
        ...textProps10,
    });

    firstPage.drawText(values.direccion.slice(0, 45), {
        x: getPositionXPercentage(1341, width),
        y: getPositionYPercentage(1618, height),
        ...textProps10,
    });

    firstPage.drawText(values.direccion.slice(31), {
        x: getPositionXPercentage(390, width),
        y: getPositionYPercentage(1658, height),
        ...textProps10,
    });
    const largeTextProps = {
        ...textProps10,
        height: height,
        width: width,
    };

    printLargeTexts(values?.antecedentes, firstPage, 385, 1910, largeTextProps);
    if (values.ubicacion_predio !== "otros") {
        printLargeTexts(
            values?.desc_normatividad_lineamientos,
            pages[2],
            385,
            832,
            largeTextProps
        );
    }

    printLargeTexts(
        values?.descripcion_resolutivo,
        pages[values?.ubicacion_predio !== "otros" ? 4 : 2],
        385,
        825,
        largeTextProps
    );

    printLargeTexts(
        values?.condicion_resolutivo,
        pages[values?.ubicacion_predio !== "otros" ? 4 : 2],
        385,
        1455,
        largeTextProps
    );
    if (values?.ubicacion_predio !== "otros") {
        printLargeTexts(
            values?.ubicacion_predio,
            pages[1],
            380,
            804,
            {
                ...largeTextProps,
                size: 8,
            },
            120
        );
    }
    printLargeTexts(
        values?.comentarios,
        pages[values?.ubicacion_predio !== "otros" ? 5 : 3],
        385,
        735,
        largeTextProps
    );

    const embedImages = [];
    const plano_macrolocalizacion = values?.plano_macrolocalizacion ?? [];

    if (values?.ubicacion_predio !== "otros") {
        const intensidad_uso_suelo = values?.intensidad_uso_suelo ?? [];
        const compatibilidad = values?.compatibilidad ?? [];

        compatibilidad.map(async (image, index) => {
            setImageFiles(
                image,
                image?.type ?? "",
                embedImages,
                372,
                2856,
                pages[3 + index],
                435,
                200,
                pdfDoc
            );
        });

        intensidad_uso_suelo.map(async (image, index) => {
            setImageFiles(
                image,
                image?.type ?? "",
                embedImages,
                372,
                1652,
                pages[3 + index],
                435,
                235,
                pdfDoc
            );
        });
    }

    plano_macrolocalizacion.map(async (image, index) => {
        setImageFiles(
            image,
            image?.type ?? "",
            embedImages,
            372,
            2850,
            pages[1 + index],
            435,
            435,
            pdfDoc
        );
    });
    setTimeout(async () => {
        embedImages.forEach((eImage, index) => {
            eImage.page.drawImage(eImage.image, {
                x: getPositionXPercentage(eImage.x, width),
                y: getPositionYPercentage(eImage.y, height),
                width: eImage.w,
                height: eImage.h,
            });
        });
        const pdfBytes = await pdfDoc.save();
        setPreviewPDF(pdfBytes);
    }, 2000);
}

export async function createTramiteUsoDeSueloPDFFromResolutivo(values) {
    const user = window.user;
    const director_name = `${user.nombre} ${user.apellido_paterno} ${user.apellido_materno}`;
    // Fetch an existing PDF document
    const url =
        values?.ubicacion_predio !== "otros"
            ? "/pdf/resolutivos/Uso_de_Suelo.pdf"
            : "/pdf/resolutivos/Uso_de_Suelo_otros.pdf";
    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Get the first page of the document
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    // Get the width and height of the first page
    const { width, height } = firstPage.getSize();

    const textProps12 = {
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    };

    const textProps10 = {
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    };

    const textWidth = helveticaFont.widthOfTextAtSize(director_name, 12);

    const x = (width - textWidth) / 2;
    const x2 = x / (width / 100);
    const x3 = x2 / 100;

    pages[values?.ubicacion_predio !== "otros" ? 5 : 3]?.drawText(
        director_name,
        {
            x: width * x3,
            y: getPositionYPercentage(2836, height),
            ...{ ...textProps12 },
        }
    );

    pages.forEach((page) => {
        page.drawText(
            `La Paz, Baja California Sur, a ${String(
                new Date().getDate()
            ).padStart(2, "0")} de ${moment()
                .format("MMMM")} de ${moment().format("YYYY")}`,
            {
                x: getPositionXPercentage(390, width),
                y: getPositionYPercentage(635, height),
                ...textProps10,
            }
        );
    });

    firstPage.drawText(values.quien_solicita, {
        x: getPositionXPercentage(460, width),
        y: getPositionYPercentage(1008, height),
        ...textProps12,
    });

    firstPage.drawText(values.fecha_inicio_tramite, {
        x: getPositionXPercentage(1396, width),
        y: getPositionYPercentage(1464, height),
        ...{ ...textProps10, size: 8 },
    });

    firstPage.drawText(values.autorizacion_uso_suelo, {
        x: getPositionXPercentage(1219, width),
        y: getPositionYPercentage(1505, height),
        ...{ ...textProps10, size: 8 },
    });

    firstPage.drawText(values.negocio, {
        x: getPositionXPercentage(495, width),
        y: getPositionYPercentage(1544, height),
        ...{ ...textProps10, size: 8 },
    });

    firstPage.drawText(values.clave_catastral, {
        x: getPositionXPercentage(704, width),
        y: getPositionYPercentage(1580, height),
        ...{ ...textProps10, size: 8 },
    });

    firstPage.drawText(values.tipo_predio, {
        x: getPositionXPercentage(1831, width),
        y: getPositionYPercentage(1578, height),
        ...{ ...textProps10, size: 8 },
    });

    firstPage.drawText(values.superficie.toString(), {
        x: getPositionXPercentage(824, width),
        y: getPositionYPercentage(1615, height),
        ...{ ...textProps10, size: 8 },
    });

    firstPage.drawText(values.direccion.slice(0, 45), {
        x: getPositionXPercentage(1341, width),
        y: getPositionYPercentage(1618, height),
        ...{ ...textProps10, size: 8 },
    });

    firstPage.drawText(values.direccion.slice(31), {
        x: getPositionXPercentage(390, width),
        y: getPositionYPercentage(1658, height),
        ...{ ...textProps10, size: 8 },
    });
    const largeTextProps = {
        ...textProps10,
        height: height,
        width: width,
    };

    printLargeTexts(values?.antecedentes, firstPage, 385, 1910, largeTextProps);
    if (values.ubicacion_predio !== "otros") {
        printLargeTexts(
            values?.desc_normatividad_lineamientos,
            pages[2],
            385,
            832,
            largeTextProps
        );
    }

    printLargeTexts(
        values?.descripcion_resolutivo,
        pages[values?.ubicacion_predio !== "otros" ? 4 : 2],
        385,
        825,
        largeTextProps
    );

    printLargeTexts(
        values?.condicion_resolutivo,
        pages[values?.ubicacion_predio !== "otros" ? 4 : 2],
        385,
        1455,
        largeTextProps
    );
    if (values?.ubicacion_predio !== "otros") {
        printLargeTexts(
            values?.ubicacion_predio,
            pages[1],
            380,
            804,
            {
                ...largeTextProps,
                size: 8,
            },
            120
        );
    }
    printLargeTexts(
        values?.comentarios,
        pages[values?.ubicacion_predio !== "otros" ? 5 : 3],
        385,
        735,
        largeTextProps
    );

    const embedImages = [];
    const plano_macrolocalizacion = values?.plano_macrolocalizacion ?? [];

    if (values?.ubicacion_predio !== "otros") {
        const intensidad_uso_suelo = values?.intensidad_uso_suelo ?? [];
        const compatibilidad = values?.compatibilidad ?? [];

        compatibilidad.map(async (image, index) => {
            setImageFiles(
                image,
                image?.type ?? "",
                embedImages,
                372,
                2856,
                pages[3 + index],
                435,
                200,
                pdfDoc
            );
        });

        intensidad_uso_suelo.map(async (image, index) => {
            setImageFiles(
                image,
                image?.type ?? "",
                embedImages,
                372,
                1652,
                pages[3 + index],
                435,
                235,
                pdfDoc
            );
        });
    }

    plano_macrolocalizacion.map(async (image, index) => {
        setImageFiles(
            image,
            image?.type ?? "",
            embedImages,
            372,
            2850,
            pages[1 + index],
            435,
            435,
            pdfDoc
        );
    });

    setTimeout(async () => {
        embedImages.forEach((eImage, index) => {
            eImage.page.drawImage(eImage.image, {
                x: getPositionXPercentage(eImage.x, width),
                y: getPositionYPercentage(eImage.y, height),
                width: eImage.w,
                height: eImage.h,
            });
        });
        const pdfBytes = await pdfDoc.save();
        // Trigger the browser to download the PDF document
        download(pdfBytes, "Uso de suelo.pdf", "application/pdf");
    }, 2000);
}
