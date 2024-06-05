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

export async function createPreviewLicenciaFuncionamientoPDF(values) {
    Object.keys(values).forEach((valueKey) => {
        if (typeof values[valueKey] === "string") {
            values[valueKey] = values[valueKey].toUpperCase();
        }
    });
    const url = "/pdf/resolutivos/Licencia_Funcionamiento_v3.pdf";
    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    const textProps10 = {
        size: 8,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    };

    const currentDate = "Este documento no tiene validez oficial";

    pages.forEach((page) => {
        page.drawText(currentDate, {
            x: getPositionXPercentage(280, width),
            y: getPositionYPercentage(132, height),
            ...textProps10,
        });
    });

    if (
        values?.razon_social !== null &&
        values?.razon_social !== undefined &&
        values?.razon_social !== "" &&
        values?.razon_social !== "NA"
    ) {
        firstPage.drawText(
            `${values.razon_social}${values?.regimen_capital !== null &&
                values?.regimen_capital !== undefined &&
                values?.regimen_capital !== "" &&
                values?.regimen_capital !== "NA"
                ? " " + values?.regimen_capital
                : ""
            }`,
            {
                x: width * 0.226,
                y: height * 0.701,
                ...textProps10,
            }
        );
    } else {
        firstPage.drawText(values.nombre, {
            x: width * 0.226,
            y: height * 0.701,
            ...textProps10,
        });
    }
    firstPage.drawText(values.domicilio_notificaciones.slice(0, 55), {
        x: getPositionXPercentage(1116, width),
        y: getPositionYPercentage(1121, height),
        ...textProps10,
    });

    firstPage.drawText(values.domicilio_notificaciones.slice(55), {
        x: getPositionXPercentage(415, width),
        y: getPositionYPercentage(1186, height),
        ...textProps10,
    });

    firstPage.drawText(values.email, {
        x: getPositionXPercentage(520, width),
        y: getPositionYPercentage(1246, height),
        ...textProps10,
        ...textProps10,
    });
    // firstPage.drawText(values.organismo, {
    //     x: getPositionXPercentage(914, width),
    //     y: getPositionYPercentage(1246, height),
    //     ...textProps10,
    // });
    firstPage.drawText(values.nombre_comercial, {
        x: getPositionXPercentage(1083, width),
        y: getPositionYPercentage(1427, height),
        ...textProps10,
    });
    firstPage.drawText(values.clave_registro_municipal, {
        x: getPositionXPercentage(911, width),
        y: getPositionYPercentage(1491, height),
        ...textProps10,
    });
    firstPage.drawText(values.direccion.slice(0, 82), {
        x: getPositionXPercentage(585, width),
        y: getPositionYPercentage(1554, height),
        ...textProps10,
    });
    firstPage.drawText(values.direccion.slice(82), {
        x: getPositionXPercentage(425, width),
        y: getPositionYPercentage(1619, height),
        ...textProps10,
    });
    firstPage.drawText(values.clave_catastral, {
        x: getPositionXPercentage(690, width),
        y: getPositionYPercentage(1682, height),
        ...textProps10,
    });
    firstPage.drawText(values.tipo_predio, {
        x: getPositionXPercentage(1700, width),
        y: getPositionYPercentage(1682, height),
        ...textProps10,
    });
    firstPage.drawText(values.giros.slice(0, 69), {
        x: getPositionXPercentage(736, width),
        y: getPositionYPercentage(1747, height),
        ...{ ...textProps10 },
    });
    firstPage.drawText(values.giros.slice(69, 153), {
        x: getPositionXPercentage(415, width),
        y: getPositionYPercentage(1811, height),
        ...{ ...textProps10 },
    });
    firstPage.drawText(values.giros.slice(153, 231), {
        x: getPositionXPercentage(415, width),
        y: getPositionYPercentage(1874, height),
        ...{ ...textProps10 },
    });
    // firstPage.drawText(values.registro_federal_contribuyente, {
    //     x: getPositionXPercentage(1712, width),
    //     y: getPositionYPercentage(1491, height),
    //     ...textProps10,
    // });
    if (
        values?.registro_federal_pm !== null &&
        values?.registro_federal_pm !== undefined &&
        values?.registro_federal_pm !== "" &&
        values?.registro_federal_pm !== "NA"
    ) {
        firstPage.drawText(values.registro_federal_pm, {
            x: getPositionXPercentage(1080, width),
            y: getPositionYPercentage(1057, height),
            ...textProps10,
        });
    } else {
        firstPage.drawText(values.registro_federal_contribuyente, {
            x: getPositionXPercentage(1080, width),
            y: getPositionYPercentage(1057, height),
            ...textProps10,
        });
    }
    firstPage.drawText(values.telefono, {
        x: getPositionXPercentage(1599, width),
        y: getPositionYPercentage(1057, height),
        ...textProps10,
    });
    firstPage.drawText(values.horario_normal, {
        x: getPositionXPercentage(933, width),
        y: getPositionYPercentage(1939, height),
        ...textProps10,
    });
    if (
        values?.registro_federal_pm === null ||
        values?.registro_federal_pm === undefined ||
        values?.registro_federal_pm === "" ||
        values?.registro_federal_pm === "NA"
    ) {
        firstPage.drawText(values.curp, {
            x: getPositionXPercentage(548, width),
            y: getPositionYPercentage(1058, height),
            ...textProps10,
        });
    }
    firstPage.drawText(values.fecha_inicio_operaciones, {
        x: getPositionXPercentage(970, width),
        y: getPositionYPercentage(2002, height),
        ...textProps10,
    });

    const giros = values?.girosObjArray ?? [];
    let alcoholes = false;
    const girosAlcoholes = [
        "Comercio al por menor en tiendas de abarrotes, ultramarinos y misceláneas".toUpperCase(),
        "Comercio al por mayor de abarrotes".toUpperCase(),
        "Comercio al por mayor de vinos y licores".toUpperCase(),
        "Comercio al por mayor de cerveza".toUpperCase(),
        "Comercio al por menor de vinos y licores".toUpperCase(),
        "Comercio al por menor de cerveza".toUpperCase(),
        "Centros nocturnos, discotecas y similares".toUpperCase(),
        "Bares, cantinas y similares".toUpperCase(),
    ];
    giros.forEach((giro) => {
        if (values?.venta_alcohol === true) {
            alcoholes = true;
        }
    });
    if (alcoholes) {
        if (values?.clave_alcohol === "") {
            firstPage.drawText("X", {
                x: getPositionXPercentage(1426, width),
                y: getPositionYPercentage(2168, height),
                ...textProps10,
            });
        } else {
            if (values.tramite_alcohol_pagado === true) {
                firstPage.drawText("X", {
                    x: getPositionXPercentage(1877, width),
                    y: getPositionYPercentage(2168, height),
                    ...textProps10,
                });
                firstPage.drawText(values?.clave_alcohol, {
                    x: getPositionXPercentage(961, width),
                    y: getPositionYPercentage(2231, height),
                    ...textProps10,
                });
            } else {
                firstPage.drawText("X", {
                    x: getPositionXPercentage(1428, width),
                    y: getPositionYPercentage(2168, height),
                    ...textProps10,
                });
            }
        }
    } else {
        firstPage.drawText("X", {
            x: getPositionXPercentage(982, width),
            y: getPositionYPercentage(2168, height),
            ...textProps10,
        });
    }
    const pdfBytes = await pdfDoc.save();
    setPreviewPDF(pdfBytes);
}

export async function createLicenciaFuncionamientoPDF(
    values,
    downloadFlag = true
) {
    Object.keys(values).forEach((valueKey) => {
        if (typeof values[valueKey] === "string") {
            values[valueKey] = values[valueKey].toUpperCase();
        }
    });
    const qrImageBytes = await fetch(
        `https://api.qrserver.com/v1/create-qr-code/?size=100x100&margin=5&data=https://comercio.lapaz.gob.mx/resolutivo/${values?.folio}`
    ).then((res) => res.arrayBuffer());

    const url = "/pdf/resolutivos/Licencia_Funcionamiento_v3.pdf";
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
        size: 8,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    };

    let currentDate = `Expedido en La Paz, Baja California Sur, a ${String(
        new Date().getDate()
    ).padStart(2, "0")} de ${moment()
        .locale("es")
        .format("MMMM")} de ${moment().format("YYYY")}`;
    // if (values?.year_creacion_tramite === 2023) {
    //     const december31 = moment({
    //         year: values?.year_creacion_tramite, month: 11, date: 31
    //     })
    //     currentDate = `Expedido en La Paz, Baja California Sur, a ${String(
    //         new Date(values?.year_creacion_tramite, 11, 31).getDate()
    //     ).padStart(2, "0")} de ${december31.locale("es").format("MMMM")} de ${december31.format("YYYY")}`

    // }
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
            x: getPositionXPercentage(1070, width),
            y: getPositionYPercentage(746, height),
            ...textProps10,
        });

        page.drawText(`${values?.year_creacion_tramite}`, {
            x: getPositionXPercentage(1265, width),
            y: getPositionYPercentage(364, height),
            ...{ ...textProps10, font: helveticaBoldFont, size: 25 },
        });
        page.drawText(`N° ${values.folio}`, {
            x: getPositionXPercentage(1200, width),
            y: getPositionYPercentage(415, height),
            ...{ ...textProps10, size: 12 },
        });
    });
    if (
        values?.razon_social !== null &&
        values?.razon_social !== undefined &&
        values?.razon_social !== "" &&
        values?.razon_social !== "NA"
    ) {
        firstPage.drawText(
            `${values.razon_social}${values?.regimen_capital !== null &&
                values?.regimen_capital !== undefined &&
                values?.regimen_capital !== "" &&
                values?.regimen_capital !== "NA"
                ? " " + values?.regimen_capital
                : ""
            }`,
            {
                x: width * 0.226,
                y: height * 0.701,
                ...textProps10,
            }
        );
    } else {
        firstPage.drawText(values.nombre, {
            x: width * 0.226,
            y: height * 0.701,
            ...textProps10,
        });
    }

    firstPage.drawText(values.domicilio_notificaciones.slice(0, 55), {
        x: getPositionXPercentage(1116, width),
        y: getPositionYPercentage(1121, height),
        ...textProps10,
    });

    firstPage.drawText(values.domicilio_notificaciones.slice(55), {
        x: getPositionXPercentage(415, width),
        y: getPositionYPercentage(1186, height),
        ...textProps10,
    });

    firstPage.drawText(values.email, {
        x: getPositionXPercentage(520, width),
        y: getPositionYPercentage(1246, height),
        ...textProps10,
    });
    // firstPage.drawText(values.organismo, {
    //     x: getPositionXPercentage(914, width),
    //     y: getPositionYPercentage(1246, height),
    //     ...textProps10,
    // });
    firstPage.drawText(values.nombre_comercial, {
        x: getPositionXPercentage(1083, width),
        y: getPositionYPercentage(1427, height),
        ...textProps10,
    });
    firstPage.drawText(values.clave_registro_municipal, {
        x: getPositionXPercentage(911, width),
        y: getPositionYPercentage(1491, height),
        ...textProps10,
    });
    firstPage.drawText(values.direccion.slice(0, 82), {
        x: getPositionXPercentage(585, width),
        y: getPositionYPercentage(1554, height),
        ...textProps10,
    });
    firstPage.drawText(values.direccion.slice(82), {
        x: getPositionXPercentage(425, width),
        y: getPositionYPercentage(1619, height),
        ...textProps10,
    });
    firstPage.drawText(values.clave_catastral, {
        x: getPositionXPercentage(690, width),
        y: getPositionYPercentage(1682, height),
        ...textProps10,
    });
    firstPage.drawText(values.tipo_predio, {
        x: getPositionXPercentage(1700, width),
        y: getPositionYPercentage(1682, height),
        ...textProps10,
    });
    firstPage.drawText(values.giros.slice(0, 69), {
        x: getPositionXPercentage(736, width),
        y: getPositionYPercentage(1747, height),
        ...{ ...textProps10 },
    });
    firstPage.drawText(values.giros.slice(69, 153), {
        x: getPositionXPercentage(415, width),
        y: getPositionYPercentage(1811, height),
        ...{ ...textProps10 },
    });
    firstPage.drawText(values.giros.slice(153, 231), {
        x: getPositionXPercentage(415, width),
        y: getPositionYPercentage(1874, height),
        ...{ ...textProps10 },
    });
    // firstPage.drawText(values.registro_federal_contribuyente, {
    //     x: getPositionXPercentage(1712, width),
    //     y: getPositionYPercentage(1491, height),
    //     ...textProps10,
    // });
    if (
        values?.registro_federal_pm !== null &&
        values?.registro_federal_pm !== undefined &&
        values?.registro_federal_pm !== "" &&
        values?.registro_federal_pm !== "NA"
    ) {
        firstPage.drawText(values.registro_federal_pm, {
            x: getPositionXPercentage(1080, width),
            y: getPositionYPercentage(1057, height),
            ...textProps10,
        });
    } else {
        firstPage.drawText(values.registro_federal_contribuyente, {
            x: getPositionXPercentage(1080, width),
            y: getPositionYPercentage(1057, height),
            ...textProps10,
        });
    }
    firstPage.drawText(values.telefono, {
        x: getPositionXPercentage(1599, width),
        y: getPositionYPercentage(1057, height),
        ...textProps10,
    });

    firstPage.drawText(values.horario_normal, {
        x: getPositionXPercentage(933, width),
        y: getPositionYPercentage(1939, height),
        ...textProps10,
    });
    if (
        values?.registro_federal_pm === null ||
        values?.registro_federal_pm === undefined ||
        values?.registro_federal_pm === "" ||
        values?.registro_federal_pm === "NA"
    ) {
        firstPage.drawText(values.curp, {
            x: getPositionXPercentage(548, width),
            y: getPositionYPercentage(1058, height),
            ...textProps10,
        });
    }

    firstPage.drawText(values.fecha_inicio_operaciones, {
        x: getPositionXPercentage(970, width),
        y: getPositionYPercentage(2002, height),
        ...textProps10,
    });

    const giros = values?.girosObjArray ?? [];
    let alcoholes = false;
    const girosAlcoholes = [
        "Comercio al por menor en tiendas de abarrotes, ultramarinos y misceláneas".toUpperCase(),
        "Comercio al por mayor de abarrotes".toUpperCase(),
        "Comercio al por mayor de vinos y licores".toUpperCase(),
        "Comercio al por mayor de cerveza".toUpperCase(),
        "Comercio al por menor de vinos y licores".toUpperCase(),
        "Comercio al por menor de cerveza".toUpperCase(),
        "Centros nocturnos, discotecas y similares".toUpperCase(),
        "Bares, cantinas y similares".toUpperCase(),
    ];
    giros.forEach((giro) => {
        if (values?.venta_alcohol === true) {
            alcoholes = true;
        }
    });
    if (alcoholes) {
        if (values?.clave_alcohol === "") {
            firstPage.drawText("X", {
                x: getPositionXPercentage(1426, width),
                y: getPositionYPercentage(2168, height),
                ...textProps10,
            });
        } else {
            if (values.tramite_alcohol_pagado === true) {
                firstPage.drawText("X", {
                    x: getPositionXPercentage(1877, width),
                    y: getPositionYPercentage(2168, height),
                    ...textProps10,
                });
                firstPage.drawText(values?.clave_alcohol, {
                    x: getPositionXPercentage(961, width),
                    y: getPositionYPercentage(2231, height),
                    ...textProps10,
                });
            } else {
                firstPage.drawText("X", {
                    x: getPositionXPercentage(1428, width),
                    y: getPositionYPercentage(2168, height),
                    ...textProps10,
                });
            }
        }
    } else {
        firstPage.drawText("X", {
            x: getPositionXPercentage(982, width),
            y: getPositionYPercentage(2168, height),
            ...textProps10,
        });
    }
    const font = {
        size: 10,
        family: helveticaFont,
        color: rgb(0, 0, 0),
    };
    // printCenteredTextLeft(
    //     font,
    //     "TESORERA MUNICIPAL",
    //     3069,
    //     height,
    //     width,
    //     firstPage
    // );
    // printCenteredTextLeft(
    //     { ...font, family: helveticaBoldFont },
    //     "L.C. SARA MARÍA BELTRÁN NAVARRO",
    //     3020,
    //     height,
    //     width,
    //     firstPage
    // );
    // printCenteredTextRight(
    //     font,
    //     "DIRECTOR DE COMERCIO",
    //     3069,
    //     height,
    //     width,
    //     firstPage
    // );
    printCenteredText(
        { ...font, family: helveticaBoldFont },
        "M.D. ROSA VIRIDIANA ÁNGEL COTA",
        3020,
        height,
        width,
        firstPage
    );

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    if (downloadFlag === true) {
        // Trigger the browser to download the PDF document
        download(pdfBytes, "Licencia de funcionamiento.pdf", "application/pdf");
    }
    if (downloadFlag === false) {
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
const printCenteredText_old = (font, text, yPosition, height, width, page) => {
    const textWidtht = font.family.widthOfTextAtSize(text, font.size);
    const wt = (width + width * 0.26) / 2;
    const xt = (wt - textWidtht) / 2;
    const xt2 = xt / (wt / 100);
    const xt3 = xt2 / 100;
    const xt4 = wt * xt3;
    page.drawText(text, {
        x: xt4,
        y: getPositionYPercentage(yPosition, height),
        size: font.size,
        font: font.family,
        color: font.color,
    });
};
const printCenteredTextRight_ = (
    font,
    text,
    yPosition,
    height,
    width,
    page
) => {
    const textWidtht = font.family.widthOfTextAtSize(text, font.size);
    const wt = (width + width * 0.26) / 2;
    const xt = (wt - textWidtht) / 2;
    const xt2 = xt / (wt / 100);
    const xt3 = xt2 / 100;
    const xt4 = wt * xt3;
    page.drawText(text, {
        x: xt4 + getPositionXPercentage(1209, width),
        y: getPositionYPercentage(yPosition, height),
        size: font.size,
        font: font.family,
        color: font.color,
    });
};

const printCenteredTextRightt = (
    font,
    text,
    yPosition,
    height,
    width,
    page
) => {
    const textWidtht = font.family.widthOfTextAtSize(text, font.size);
    const wt = width / 2;
    const xt = wt;
    const xt2 = xt / (wt / 100);
    const xt3 = xt2 / 100;
    const xt4 = wt * xt3;
    page.drawText(text, {
        x: xt4 + getPositionXPercentage(255, width),
        y: getPositionYPercentage(yPosition, height),
        size: font.size,
        font: font.family,
        color: font.color,
    });
};
const printCenteredTextLeft_ = (font, text, yPosition, height, width, page) => {
    const textWidtht = font.family.widthOfTextAtSize(text, font.size);
    const wt = width / 2;
    const xt = wt - textWidtht;
    const xt2 = xt / (wt / 100);
    const xt3 = xt2 / 100;
    const xt4 = wt * xt3;
    page.drawText(text, {
        x: xt4 - getPositionXPercentage(255, width),
        y: getPositionYPercentage(yPosition, height),
        size: font.size,
        font: font.family,
        color: font.color,
    });
};
