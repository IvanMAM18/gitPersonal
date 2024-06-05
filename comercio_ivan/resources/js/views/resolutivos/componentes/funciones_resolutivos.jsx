import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import download from "downloadjs";
import moment from "moment";
import axios from "axios";
import { ListaInspectores } from "../../../utils/ListaInspectores";
import { firmas } from "../firmasData";
import { inspectorePI, inspectorePIEx } from "../utils";

const PAGE_CHUNK_SIZE = 1700;

// Function Helpers
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
const printLargeTexts = (text, page, xPos, yPos, textProps, length = 85) => {
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
function getTextToInsert(originalText, skippFirstPage = false) {
    const rowLength = 85;

    const paragraphs = originalText.split(/\.\n/);
    paragraphs?.forEach((paragraph, i) => {
        let cleanedParagraph = paragraph.replace(/\-\n/, "")//.split('\n').join(" ");
        // console.log(cleanedParagraph);
        let paragraphLines = cleanedParagraph.split('\n').filter(pl => pl !== "");
        // console.log(paragraphLines);

        let newParagraphLines = [];

        paragraphLines.forEach((paragraphLine, i) => {
            const couldBeTitle = paragraphLine?.length < (Math.floor(85 * .75));
            if (i === 0 && couldBeTitle) {
                newParagraphLines.push(paragraphLine);
            }
        })

        paragraphLines = paragraphLines.filter(pl => newParagraphLines.includes(pl) === false);
        paragraphLines = paragraphLines.map(pl => {
            const lastChar = pl.charAt(pl.length - 1);
            if (lastChar.replace(/\u2010/, "") === "" || lastChar === "-") {
                const newLine = pl.slice(0, -1)
                return newLine + "~";
            }
            return pl;
        })
        //console.log("paragraphLines", paragraphLines);
        cleanedParagraph = paragraphLines.join(" ").replace(/\~\s/, "");
        const linesPerParagraph = Math.ceil(cleanedParagraph.length / 85);
        let lines = newParagraphLines;

        //console.log("cleanedParagraph", cleanedParagraph);
        //console.log("lines", lines);
        for (let j = 0; j < linesPerParagraph; j++) {
            lines.push(cleanedParagraph.slice(j * rowLength, (j + 1) * rowLength));
        }
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lastChar = line.charAt(line.length - 1);
            const secondLastChar = line.charAt(line.length - 2);

            // Check if last two characters are space followed by a character
            if (secondLastChar === ' ' && lastChar !== ' ') {
                lines[i + 1] = lastChar + lines[i + 1];
                lines[i] = lines[i].slice(0, -1)
            }

            // Check if the first character is a comma or a period
            if (i > 0 && (line.charAt(0) === ',' || line.charAt(0) === '.')) {
                lines[i - 1] += line.charAt(0);
                lines[i] = line.slice(1);

            }
            if (i > 0 && (lines[i].charAt(0) === ' ')) {
                const line = lines[i];
                lines[i] = line.slice(1);
            }
        }
        paragraphs[i] = lines;
    });

    let textToInsertPerPage = []
    let pageIndex = 0;
    let linesCount = 0;
    const newP = paragraphs.map(p => { return [...p, "\n"] })
    //console.log({ newP });
    newP.forEach(paragraph => {
        paragraph.forEach(line => {
            let maxRowsCount = pageIndex === 0 ? 40 : 55;
            if (skippFirstPage) {
                maxRowsCount = 55;
            }
            if (linesCount < maxRowsCount) {
                linesCount++;
                textToInsertPerPage[pageIndex] = [...textToInsertPerPage?.[pageIndex] ?? [], line]
            } else {
                linesCount = 0;
                pageIndex++;
                textToInsertPerPage[pageIndex] = [...textToInsertPerPage?.[pageIndex] ?? [], line]
            }
        });

    })

    return textToInsertPerPage;
};
const printLargeTexts2 = (sections, page, xPos, yPos, textProps) => {
    console.log({ sections }, { page });
    sections?.forEach((section, i) => {
        const yPosCount = (i + 1) * 38;
        page.drawText(section, {
            x: getPositionXPercentage(xPos, textProps.width),
            y: getPositionYPercentage(yPos + yPosCount, textProps.height),
            size: textProps.size,
            font: textProps.font,
            color: textProps.color,
        });
    });
};
const setPreviewPDF = (pdfBytes, idContenedor = "pdf-preview") => {
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(blob);
    const pdfFrame = document.createElement("iframe");
    pdfFrame.src = pdfUrl;
    pdfFrame.style.width = "100%";
    pdfFrame.style.height = "75vh";
    document.getElementById(idContenedor).innerHTML = "";
    document.getElementById(idContenedor).appendChild(pdfFrame);
};
const setImageFiles = async (image, format, embedImages, posX, posY, page, w, h, pdfDoc) => {
    if (format === "jpg") {
        embedImages.push({
            image: await pdfDoc.embedJpg(image?.imageBytes),
            x: posX,
            y: posY,
            page: page,
            w: w,
            h: h,
        });
    } else {
        embedImages.push({
            image: await pdfDoc.embedPng(image?.imageBytes),
            x: posX,
            y: posY,
            page: page,
            w: w,
            h: h,
        });
    }
};
const setImageFilesFromFileObject = (image, format, embedImages, posX, posY, page, w, h, pdfDoc) => {
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
const getStringValues = (values) => {
    Object.keys(values).forEach((valueKey) => {
        if (typeof values[valueKey] === "string") {
            values[valueKey] = values[valueKey].toUpperCase();
        } else if (
            values[valueKey] === null ||
            values[valueKey] === undefined
        ) {
            values[valueKey] = "";
        }
    });
    return values;
};

export async function createPreviewTramiteUsoDeSueloPDF(values) {
    Object.keys(values).forEach((valueKey) => {
        if (typeof values[valueKey] === "string") {
            let cleanedText = values[valueKey].replace(/[•]/g, '');
            cleanedText = cleanedText.replace(/\u2010/g, "-");
            values[valueKey] = cleanedText.toUpperCase();
        }
    });

    const url =
        values?.ubicacion_predio !== "otros"
            ? "/pdf/resolutivos/Uso_de_Suelo.pdf"
            : "/pdf/resolutivos/Uso_de_Suelo_otros.pdf";
    const urlPaginaExtra = "/pdf/resolutivos/Uso_Suelo_Pagina_Extra.pdf";

    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
    const existingPdfBytesPagExt = await fetch(urlPaginaExtra).then((res) => res.arrayBuffer());

    const pdfDoc_ = await PDFDocument.load(existingPdfBytes);
    const pdfPagExt_ = await PDFDocument.load(existingPdfBytesPagExt);

    const pdfDoc = await PDFDocument.create();


    let pages = pdfDoc_.getPages();

    const { width, height } = pages[0].getSize();

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const descNormatividadLineamientosResolutivoTextPerPage = getTextToInsert(values?.desc_normatividad_lineamientos, true);
    const condicionResolutivoTextPerPage = getTextToInsert(values?.condicion_resolutivo, false);
    const fontPropsExtraPage = {
        size: 8,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        height: height,
        width: width,
    };
    for (let i = 0; i < pdfDoc_.getPages()?.length; i++) {
        const PDFPage = await pdfDoc.copyPages(pdfDoc_, [i]);
        if (values.ubicacion_predio !== "otros" && i === 2) {
            for (let h = 0; h < descNormatividadLineamientosResolutivoTextPerPage.length; h++) {
                const pageCopy = await pdfDoc.copyPages(pdfDoc_, [i]);
                printLargeTexts2(
                    descNormatividadLineamientosResolutivoTextPerPage[h],
                    pageCopy[0],
                    385,
                    825,
                    fontPropsExtraPage
                );
                pdfDoc.addPage(pageCopy[0]);
            }
        } else {
            pdfDoc.addPage(PDFPage[0]);
        }
        if (values?.ubicacion_predio !== "otros") {
            if (i === 4) {
                for (let j = 0; j < condicionResolutivoTextPerPage?.length; j++) {
                    const PDFExtPage = await pdfDoc.copyPages(pdfPagExt_, [0]);
                    printLargeTexts2(
                        condicionResolutivoTextPerPage[j],
                        j === 0 ? PDFPage[0] : PDFExtPage[0],
                        385,
                        j === 0 ? 1455 : 825,
                        fontPropsExtraPage
                    );

                    j > 0 && pdfDoc.addPage(PDFExtPage[0]);
                }
            }
        } else {
            if (i === 2) {
                for (let j = 0; j < condicionResolutivoTextPerPage?.length; j++) {
                    const PDFExtPage = await pdfDoc.copyPages(pdfPagExt_, [0]);
                    printLargeTexts2(
                        condicionResolutivoTextPerPage[j],
                        j === 0 ? PDFPage[0] : PDFExtPage[0],
                        385,
                        j === 0 ? 1455 : 825,
                        fontPropsExtraPage
                    );

                    j > 0 && pdfDoc.addPage(PDFExtPage[0]);
                }
            }
        }
    }
    pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const textProps12 = {
        size: 8,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    };

    const textProps10 = {
        size: 8,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    };

    const currentDate = "Este documento no tiene validez oficial";

    pages.forEach((page) => {
        page?.drawText(currentDate, {
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

    printLargeTexts(
        values?.descripcion_resolutivo,
        pages[values?.ubicacion_predio !== "otros" ? 4 + descNormatividadLineamientosResolutivoTextPerPage.length - 1 : 2 + descNormatividadLineamientosResolutivoTextPerPage.length - 1],
        385,
        825,
        largeTextProps
    );

    if (values?.ubicacion_predio !== "otros") {
        printLargeTexts(
            values?.ubicacion_predio,
            pages[1],
            380,
            804,
            { ...largeTextProps, size: 8, },
            100
        );
    }
    printLargeTexts(
        values?.comentarios,
        pages[pages.length - 1],
        385,
        735,
        largeTextProps
    );

    const embedImages = [];
    if (typeof values?.plano_macrolocalizacion === "string") {
        await axios
            .get(
                `/app/get_resolutivo_image/?url=${values?.plano_macrolocalizacion}`,
                {
                    responseType: "blob",
                    as: "blob",
                }
            )
            .then((response) => {
                response.data
                    .arrayBuffer()
                    .then((res) =>
                        setImageFiles(
                            { imageBytes: res },
                            values?.plano_macrolocalizacion.split(".")[1] ?? "",
                            embedImages,
                            372,
                            2850,
                            pages[1],
                            435,
                            435,
                            pdfDoc
                        )
                    );
            })
            .catch((error) => {
                console.log(error);
            });
    } else {
        const plano_macrolocalizacion = values?.plano_macrolocalizacion ?? [];
        plano_macrolocalizacion.map(async (image, index) => {
            setImageFilesFromFileObject(
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
    }
    if (values?.ubicacion_predio !== "otros") {
        if (typeof values?.intensidad_uso_suelo === "string") {
            await axios
                .get(
                    `/app/get_resolutivo_image/?url=${values?.intensidad_uso_suelo}`,
                    {
                        responseType: "blob",
                        as: "blob",
                    }
                )
                .then((response) => {
                    response.data
                        .arrayBuffer()
                        .then((res) =>
                            setImageFiles(
                                { imageBytes: res },
                                values?.intensidad_uso_suelo.split(".")[1] ??
                                "",
                                embedImages,
                                372,
                                1652,
                                pages[descNormatividadLineamientosResolutivoTextPerPage.length + 3 - 1],
                                435,
                                200,
                                pdfDoc
                            )
                        );
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            const intensidad_uso_suelo = values?.intensidad_uso_suelo ?? [];
            intensidad_uso_suelo.map(async (image, index) => {
                setImageFilesFromFileObject(
                    image,
                    image?.type ?? "",
                    embedImages,
                    372,
                    1652,
                    pages[descNormatividadLineamientosResolutivoTextPerPage.length + 3 + index - 1],
                    435,
                    200,
                    pdfDoc
                );
            });
        }

        if (typeof values?.compatibilidad === "string") {
            await axios
                .get(
                    `/app/get_resolutivo_image/?url=${values?.compatibilidad}`,
                    {
                        responseType: "blob",
                        as: "blob",
                    }
                )
                .then((response) => {
                    response.data
                        .arrayBuffer()
                        .then((res) =>
                            setImageFiles(
                                { imageBytes: res },
                                values?.compatibilidad.split(".")[1] ?? "",
                                embedImages,
                                372,
                                2856,
                                pages[descNormatividadLineamientosResolutivoTextPerPage.length + 3 - 1],
                                435,
                                200,
                                pdfDoc
                            )
                        );
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            const compatibilidad = values?.compatibilidad ?? [];
            compatibilidad.map(async (image, index) => {
                setImageFilesFromFileObject(
                    image,
                    image?.type ?? "",
                    embedImages,
                    372,
                    2856,
                    pages[descNormatividadLineamientosResolutivoTextPerPage.length + 3 + index - 1],
                    435,
                    200,
                    pdfDoc
                );
            });
        }
    }

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

export async function createTramiteUsoDeSueloPDF(values, downloadFlag = true) {
    const imagesUrls = [
        "compatibilidad",
        "intensidad_uso_suelo",
        "plano_macrolocalizacion",
    ];
    Object.keys(values).forEach((valueKey) => {
        if (
            typeof values[valueKey] === "string" &&
            imagesUrls.includes(valueKey) === false
        ) {
            let cleanedText = values[valueKey].replace(/[•]/g, '');
            cleanedText = cleanedText.replace(/\u2010/g, "-");
            values[valueKey] = cleanedText.toUpperCase();

        }
    });
    const qrImageBytes = await fetch(
        `https://api.qrserver.com/v1/create-qr-code/?size=100x100&margin=5&data=https://comercio.lapaz.gob.mx/resolutivo/${values.folio}`
    ).then((res) => res.arrayBuffer());

    const user = window.user;
    const director_name = `${user.nombre} ${user.apellido_paterno} ${user.apellido_materno}`;
    const url =
        values?.ubicacion_predio !== "otros"
            ? "/pdf/resolutivos/Uso_de_Suelo.pdf"
            : "/pdf/resolutivos/Uso_de_Suelo_otros.pdf";
    const urlPaginaExtra = "/pdf/resolutivos/Uso_Suelo_Pagina_Extra.pdf";

    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
    const existingPdfBytesPagExt = await fetch(urlPaginaExtra).then((res) => res.arrayBuffer());

    const pdfDoc_ = await PDFDocument.load(existingPdfBytes);
    const pdfPagExt_ = await PDFDocument.load(existingPdfBytesPagExt);

    const pdfDoc = await PDFDocument.create();

    let pages = pdfDoc_.getPages();


    const { width, height } = pages[0].getSize();

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const descNormatividadLineamientosResolutivoTextPerPage = getTextToInsert(values?.desc_normatividad_lineamientos, true);
    const condicionResolutivoTextPerPage = getTextToInsert(values?.condicion_resolutivo, false);
    const fontPropsExtraPage = {
        size: 8,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        height: height,
        width: width,
    };
    for (let i = 0; i < pdfDoc_.getPages()?.length; i++) {
        const PDFPage = await pdfDoc.copyPages(pdfDoc_, [i]);
        if (values.ubicacion_predio !== "otros" && i === 2) {
            for (let h = 0; h < descNormatividadLineamientosResolutivoTextPerPage.length; h++) {
                const pageCopy = await pdfDoc.copyPages(pdfDoc_, [i]);
                printLargeTexts2(
                    descNormatividadLineamientosResolutivoTextPerPage[h],
                    pageCopy[0],
                    385,
                    825,
                    fontPropsExtraPage
                );
                pdfDoc.addPage(pageCopy[0]);
            }
        } else {
            pdfDoc.addPage(PDFPage[0]);
        }
        if (values?.ubicacion_predio !== "otros") {
            if (i === 4) {
                for (let j = 0; j < condicionResolutivoTextPerPage?.length; j++) {
                    const PDFExtPage = await pdfDoc.copyPages(pdfPagExt_, [0]);
                    printLargeTexts2(
                        condicionResolutivoTextPerPage[j],
                        j === 0 ? PDFPage[0] : PDFExtPage[0],
                        385,
                        j === 0 ? 1455 : 825,
                        fontPropsExtraPage
                    );

                    j > 0 && pdfDoc.addPage(PDFExtPage[0]);
                }
            }
        } else {
            if (i === 2) {
                for (let j = 0; j < condicionResolutivoTextPerPage?.length; j++) {
                    const PDFExtPage = await pdfDoc.copyPages(pdfPagExt_, [0]);
                    printLargeTexts2(
                        condicionResolutivoTextPerPage[j],
                        j === 0 ? PDFPage[0] : PDFExtPage[0],
                        385,
                        j === 0 ? 1455 : 825,
                        fontPropsExtraPage
                    );

                    j > 0 && pdfDoc.addPage(PDFExtPage[0]);
                }
            }
        }
    }

    pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const textProps12 = {
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    };

    const textProps10 = {
        size: 8,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    };

    const textWidth = helveticaFont.widthOfTextAtSize(director_name, 12);

    const x = (width - textWidth) / 2;
    const x2 = x / (width / 100);
    const x3 = x2 / 100;

    pages[pages?.length - 1]?.drawText(
        director_name?.trim(),
        {
            x: width * x3,
            y: getPositionYPercentage(2970, height),
            ...{ ...textProps12 },
        }
    );
    const helveticaBoldFont = await pdfDoc.embedFont(
        StandardFonts.HelveticaBold
    );
    const qrImage = await pdfDoc.embedPng(qrImageBytes);
    const qrDims = qrImage.scale(1);

    pages.forEach((page) => {
        page.drawText(moment(values?.fecha_creacion_tramite).format("YYYY"), {
            x: getPositionXPercentage(1265, width),
            y: getPositionYPercentage(364, height),
            ...{ ...textProps10, font: helveticaBoldFont, size: 25 },
        });
        page.drawText(`N° ${values.folio}`, {
            x: getPositionXPercentage(1200, width),
            y: getPositionYPercentage(415, height),
            ...{ ...textProps10, size: 12 },
        });
        page.drawImage(qrImage, {
            x: getPositionXPercentage(2026, width),
            y: getPositionYPercentage(500, height),
            width: qrDims.width,
            height: qrDims.height,
        });

        if (+moment(values?.fecha_creacion_tramite).format("YYYY") === 2023) {
            const december31 = moment({
                year: +moment(values?.fecha_creacion_tramite).format("YYYY"), month: 11, date: 31
            });
            page.drawText(
                `La Paz, Baja California Sur, a ${String(
                    new Date(+moment(values?.fecha_creacion_tramite).format("YYYY"), 11, 31).getDate()
                ).padStart(2, "0")} de ${december31.format("MMMM").format('LLLL')} de ${december31.format("YYYY")}`.toUpperCase(),
                {
                    x: getPositionXPercentage(390, width),
                    y: getPositionYPercentage(635, height),
                    ...textProps10,
                }
            );
        } else {
            page.drawText(
                `La Paz, Baja California Sur, a ${String(
                    new Date().getDate()
                ).padStart(2, "0")} de ${moment().format("MMMM")} de ${moment().format("YYYY")}`.toUpperCase(),
                {
                    x: getPositionXPercentage(390, width),
                    y: getPositionYPercentage(635, height),
                    ...textProps10,
                }
            );
        }
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


    printLargeTexts(
        values?.descripcion_resolutivo,
        pages[values?.ubicacion_predio !== "otros" ? 4 + descNormatividadLineamientosResolutivoTextPerPage.length - 1 : 2 + descNormatividadLineamientosResolutivoTextPerPage.length - 1],
        385,
        825,
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
                size: 6,
            },
            120
        );
    }
    printLargeTexts(
        values?.comentarios,
        pages[pages.length - 1],
        385,
        735,
        largeTextProps
    );

    let embedImages = [];
    if (downloadFlag === true) {
        const plano_macrolocalizacion = values?.plano_macrolocalizacion ?? [];

        if (values?.ubicacion_predio !== "otros") {
            const intensidad_uso_suelo = values?.intensidad_uso_suelo ?? [];
            const compatibilidad = values?.compatibilidad ?? [];

            setImageFiles(
                compatibilidad,
                compatibilidad?.type ?? "",
                embedImages,
                372,
                2856,
                pages[3 + descNormatividadLineamientosResolutivoTextPerPage.length - 1],
                435,
                200,
                pdfDoc
            );

            setImageFiles(
                intensidad_uso_suelo,
                intensidad_uso_suelo?.type ?? "",
                embedImages,
                372,
                1652,
                pages[3 + descNormatividadLineamientosResolutivoTextPerPage.length - 1],
                435,
                200,
                pdfDoc
            );
        }
        setImageFiles(
            plano_macrolocalizacion,
            plano_macrolocalizacion?.type ?? "",
            embedImages,
            372,
            2850,
            pages[1],
            435,
            435,
            pdfDoc
        );
    } else {
        if (typeof values?.plano_macrolocalizacion === "string") {
            await axios
                .get(
                    `/app/get_resolutivo_image/?url=${values?.plano_macrolocalizacion}`,
                    {
                        responseType: "blob",
                        as: "blob",
                    }
                )
                .then((response) => {
                    response.data
                        .arrayBuffer()
                        .then((res) =>
                            setImageFiles(
                                { imageBytes: res },
                                values?.plano_macrolocalizacion.split(".")[1] ??
                                "",
                                embedImages,
                                372,
                                2850,
                                pages[1],
                                435,
                                435,
                                pdfDoc
                            )
                        );
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            const plano_macrolocalizacion =
                values?.plano_macrolocalizacion ?? [];
            plano_macrolocalizacion.map(async (image, index) => {
                setImageFilesFromFileObject(
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
        }
        if (values?.ubicacion_predio !== "otros") {
            if (typeof values?.intensidad_uso_suelo === "string") {
                await axios
                    .get(
                        `/app/get_resolutivo_image/?url=${values?.intensidad_uso_suelo}`,
                        {
                            responseType: "blob",
                            as: "blob",
                        }
                    )
                    .then((response) => {
                        response.data
                            .arrayBuffer()
                            .then((res) =>
                                setImageFiles(
                                    { imageBytes: res },
                                    values?.intensidad_uso_suelo.split(
                                        "."
                                    )[1] ?? "",
                                    embedImages,
                                    372,
                                    1652,
                                    pages[3],
                                    435,
                                    200,
                                    pdfDoc
                                )
                            );
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                const intensidad_uso_suelo = values?.intensidad_uso_suelo ?? [];
                intensidad_uso_suelo.map(async (image, index) => {
                    setImageFilesFromFileObject(
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

            if (typeof values?.compatibilidad === "string") {
                await axios
                    .get(
                        `/app/get_resolutivo_image/?url=${values?.compatibilidad}`,
                        {
                            responseType: "blob",
                            as: "blob",
                        }
                    )
                    .then((response) => {
                        response.data
                            .arrayBuffer()
                            .then((res) =>
                                setImageFiles(
                                    { imageBytes: res },
                                    values?.compatibilidad.split(".")[1] ?? "",
                                    embedImages,
                                    372,
                                    2856,
                                    pages[3],
                                    435,
                                    200,
                                    pdfDoc
                                )
                            );
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                const compatibilidad = values?.compatibilidad ?? [];
                compatibilidad.map(async (image, index) => {
                    setImageFilesFromFileObject(
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
            }
        }
    }

    setTimeout(async () => {
        embedImages.forEach((eImage, index) => {
            eImage.page.drawImage(eImage.image, {
                x: getPositionXPercentage(eImage.x, width),
                y: getPositionYPercentage(eImage.y, height),
                width: eImage.w,
                height: eImage.h,
            });
        });

        /*const firmaBytes = await fetch(
            `/firmas_resolutivos_21L-LMNP/dir_usuelo.png`
        ).then((res) => res.arrayBuffer());

        const firmaImage = await pdfDoc.embedPng(firmaBytes);
        const firmaDims = firmaImage.scale(0.28);
        pages[pages.length - 1].drawImage(firmaImage, {
            x: pages[pages.length - 1].getWidth() / 2 - firmaDims.width / 2,
            y: getPositionYPercentage(2950, height),
            width: firmaDims.width,
            height: firmaDims.height,
        });*/

        const pdfBytes = await pdfDoc.save();
        if (downloadFlag === true) {
            // Trigger the browser to download the PDF document
            download(pdfBytes, "Uso de suelo.pdf", "application/pdf");
        } else {
            setPreviewPDF(pdfBytes);
        }
    }, 2000);
}

export async function createDictamenEcologiaPdf(values, preview = false, downloadFlag = true) {
    values = getStringValues(values);
    const url = "/pdf/resolutivos/Dictamen-Ecologia_v2_titulo.pdf";
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

    if (preview === false || downloadFlag === false) {
        const qrImageBytes = await fetch(
            `https://api.qrserver.com/v1/create-qr-code/?size=100x100&margin=5&data=https://comercio.lapaz.gob.mx/resolutivo/${values?.folio ?? "NA"
            }`
        ).then((res) => res.arrayBuffer());
        const qrImage = await pdfDoc.embedPng(qrImageBytes);
        const qrDims = qrImage.scale(1);
        pages.forEach((page) => {
            page.drawImage(qrImage, {
                x: getPositionXPercentage(2026, width),
                y: getPositionYPercentage(500, height),
                width: qrDims.width,
                height: qrDims.height,
            });
        });

        const user = window.user;
        const director_name = `${user?.nombre} ${user?.apellido_paterno} ${user?.apellido_materno}`;
        const textWidth = helveticaFont.widthOfTextAtSize(director_name, 12);
        const x = (width - textWidth) / 2;
        const x2 = x / (width / 100);
        const x3 = x2 / 100;
        firstPage.drawText(director_name, {
            x: width * x3,
            y: height * 0.095,
            size: 12,
            font: helveticaFont,
            color: rgb(0, 0, 0),
        });

        const firma = firmas.find((firma) => firma.entidad_code === "ecologia");
        const firmaBytes = await fetch(firma?.firma_path ?? "").then((res) =>
            res.arrayBuffer()
        );
        const firmaImage = await pdfDoc.embedPng(firmaBytes);
        const firmaDims = firmaImage.scale(0.2);
        pages[pages.length - 1].drawImage(firmaImage, {
            x: pages[pages.length - 1].getWidth() / 2 - firmaDims.width / 2,
            y: getPositionYPercentage(2970, height),
            width: firmaDims.width,
            height: firmaDims.height,
        });

        pages[pages.length - 1].drawText(`${values?.fecha_valido}`, {
            x: getPositionXPercentage(1265, width),
            y: getPositionYPercentage(364, height),
            ...{ ...textProps10, font: helveticaBoldFont, size: 25 },
        });
        pages[pages.length - 1].drawText(`N° ${values.folio}`, {
            x: getPositionXPercentage(1200, width),
            y: getPositionYPercentage(415, height),
            ...{ ...textProps10, size: 12 },
        });
    }

    firstPage.drawText(values.encabezado_1, {
        x: getPositionXPercentage(356, width),
        y: getPositionYPercentage(734, height),
        size: 8,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    firstPage.drawText(values.negocio, {
        x: getPositionXPercentage(1357, width),
        y: getPositionYPercentage(851, height),
        size: 8,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });
    firstPage.drawText(values.direccion.slice(0, 90), {
        x: getPositionXPercentage(603, width),
        y: getPositionYPercentage(913, height),
        size: 8,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });
    firstPage.drawText(values.direccion.slice(90), {
        x: getPositionXPercentage(356, width),
        y: getPositionYPercentage(971, height),
        size: 8,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    firstPage.drawText(values.giro.slice(0, 70), {
        x: getPositionXPercentage(866, width),
        y: getPositionYPercentage(1029, height),
        size: 8,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    firstPage.drawText(values.giro.slice(70, 150), {
        x: getPositionXPercentage(356, width),
        y: getPositionYPercentage(1086, height),
        size: 8,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });
    firstPage.drawText(values.giro.slice(150), {
        x: getPositionXPercentage(356, width),
        y: getPositionYPercentage(1146, height),
        size: 8,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    if ((values?.generador_de ?? "") !== "") {
        const generador_deText = values?.generador_de?.reduce(myFunc) ?? "";
        function myFunc(total, num) {
            return total.toUpperCase() + "," + " " + num.toUpperCase();
        }
        firstPage.drawText(generador_deText.slice(0, 95), {
            x: getPositionXPercentage(356, width),
            y: getPositionYPercentage(1256, height),
            size: 8,
            font: helveticaFont,
            color: rgb(0, 0, 0),
        });
        firstPage.drawText(generador_deText.slice(95, 190), {
            x: getPositionXPercentage(356, width),
            y: getPositionYPercentage(1306, height),
            size: 8,
            font: helveticaFont,
            color: rgb(0, 0, 0),
        });
        firstPage.drawText(values.giro.slice(190), {
            x: getPositionXPercentage(356, width),
            y: getPositionYPercentage(1355, height),
            size: 8,
            font: helveticaFont,
            color: rgb(0, 0, 0),
        });
    }

    printLargeTexts(
        values.observaciones,
        firstPage,
        356,
        1685,
        {
            size: 8,
            font: helveticaFont,
            color: rgb(0, 0, 0),
            height: height,
            width: width,
        },
        90
    );

    firstPage.drawText(values.numero_expediente, {
        x: getPositionXPercentage(1014, width),
        y: getPositionYPercentage(1470, height),
        size: 8,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });
    firstPage.drawText(values.otorga, {
        x: getPositionXPercentage(1511, width),
        y: getPositionYPercentage(1529, height),
        size: 8,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });
    firstPage.drawText(`${values?.fecha_valido}`, {
        x: getPositionXPercentage(1647, width),
        y: getPositionYPercentage(2545, height),
        size: 8,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    if (preview === true || downloadFlag === false) {
        setPreviewPDF(pdfBytes, "pdf-preview-ec");
    }
    if (preview === false && downloadFlag === true) {
        download(pdfBytes, "Dictamen Ecología.pdf", "application/pdf");
    }
}

export async function createCertificacionPdf_BI(certificacion_values, preview = false, downloadFlag = true) {
    console.log({ certificacion_values });
    const url = "/pdf/resolutivos/Certificacion_Proteccion Civil_BI.pdf";
    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();

    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(
        StandardFonts.HelveticaBold
    );
    const font = {
        size: 10,
        family: helveticaFont,
        color: rgb(0, 0, 0),
    };
    const textProps10 = {
        size: 8,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    };
    certificacion_values = getStringValues(certificacion_values);
    if (preview === false) {
        const qrImageBytes = await fetch(
            `https://api.qrserver.com/v1/create-qr-code/?size=100x100&margin=5&data=https://comercio.lapaz.gob.mx/resolutivo/${certificacion_values?.folio ?? "NA"
            }`
        ).then((res) => res.arrayBuffer());
        const qrImage = await pdfDoc.embedPng(qrImageBytes);
        const qrDims = qrImage.scale(1);
        pages.forEach((page) => {
            page.drawImage(qrImage, {
                x: getPositionXPercentage(2026, width),
                y: getPositionYPercentage(500, height),
                width: qrDims.width,
                height: qrDims.height,
            });

            if (certificacion_values?.year_creacion_tramite === 2023) {
                const december31 = moment({
                    year: certificacion_values?.year_creacion_tramite, month: 11, date: 31
                })
                page.drawText(
                    `La Paz, Baja California Sur, a ${String(
                        new Date(certificacion_values?.year_creacion_tramite, 11, 31).getDate()
                    ).padStart(2, "0")} de ${december31.format("MMMM")} de ${december31.format("YYYY")}`.toUpperCase(),
                    {
                        x: getPositionXPercentage(388, width),
                        y: getPositionYPercentage(730, height),
                        ...textProps10,
                    }
                );
            } else {
                page.drawText(
                    `La Paz, Baja California Sur, a ${String(
                        new Date().getDate()
                    ).padStart(2, "0")} de ${moment()
                        .format("MMMM")} de ${moment().format(
                            "YYYY"
                        )}`.toUpperCase(),
                    {
                        x: getPositionXPercentage(388, width),
                        y: getPositionYPercentage(730, height),
                        ...textProps10,
                    }
                );
            }

            printCenteredText(
                { ...font, family: helveticaBoldFont, size: 25 },
                certificacion_values?.año_fiscal,
                364,
                height,
                width,
                firstPage
            );
            printCenteredText(
                { ...font, family: helveticaBoldFont, size: 14 },
                `No. ${certificacion_values?.folio}`,
                425,
                height,
                width,
                firstPage
            );
        });

        const user = window.user;
        const apellido_paterno =
            user?.apellido_paterno ?? "" !== ""
                ? ` ${user?.apellido_paterno}`
                : "";
        const apellido_materno =
            user?.apellido_materno ?? "" !== ""
                ? ` ${user?.apellido_materno}`
                : "";
        const director_name = `${user?.nombre}${apellido_paterno}${apellido_materno}`;

        const textWidth = helveticaFont.widthOfTextAtSize(director_name, 12);

        const x = (width - textWidth) / 2;
        const x2 = x / (width / 100);
        const x3 = x2 / 100;
        firstPage.drawText(director_name, {
            x: width * x3,
            y: height * 0.11,
            size: 12,
            font: helveticaFont,
            color: rgb(0, 0, 0),
        });

        const firma = firmas.find(
            (firma) => firma.entidad_code === "proteccion_civil"
        );
        const firmaBytes = await fetch(firma?.firma_path ?? "").then((res) =>
            res.arrayBuffer()
        );
        const firmaImage = await pdfDoc.embedPng(firmaBytes);
        const firmaDims = firmaImage.scale(0.35);
        pages[pages.length - 1].drawImage(firmaImage, {
            x: pages[pages.length - 1].getWidth() / 2 - firmaDims.width / 2,
            y: getPositionYPercentage(2985, height),
            width: firmaDims.width,
            height: firmaDims.height,
        });
    }

    firstPage.drawText(certificacion_values?.nombre ?? "", {
        x: getPositionXPercentage(388, width),
        y: getPositionYPercentage(919, height),
        size: 9,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });
    firstPage.drawText(certificacion_values.negocio, {
        x: getPositionXPercentage(1363, width),
        y: getPositionYPercentage(1077, height),
        size: 9,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    // LINEA 1 DE GIROS
    firstPage.drawText(certificacion_values.giro.slice(0, 55), {
        x: getPositionXPercentage(904, width),
        y: getPositionYPercentage(1135, height),
        size: 9,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });
    // LINEA 2 DE GIROS
    firstPage.drawText(certificacion_values.giro.slice(55, 136), {
        x: getPositionXPercentage(388, width),
        y: getPositionYPercentage(1195, height),
        size: 9,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });
    // LINEA 3 DE GIROS
    firstPage.drawText(certificacion_values.giro.slice(136), {
        x: getPositionXPercentage(388, width),
        y: getPositionYPercentage(1254, height),
        size: 9,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    firstPage.drawText(certificacion_values.direccion.slice(0, 70), {
        x: getPositionXPercentage(636, width),
        y: getPositionYPercentage(1310, height),
        size: 9,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });
    firstPage.drawText(certificacion_values.direccion.slice(70), {
        x: getPositionXPercentage(388, width),
        y: getPositionYPercentage(1371, height),
        size: 9,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    firstPage.drawText(certificacion_values?.año_fiscal, {
        x: getPositionXPercentage(1617, width),
        y: getPositionYPercentage(2244, height),
        size: 9,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    const inspector = ListaInspectores?.find(
        (inspector) => inspector?.id === certificacion_values?.inspector
    );
    const inspector2 = ListaInspectores?.find(
        (inspector) => inspector?.id === certificacion_values?.inspector_2
    );
    const inspectores = `${inspector?.name} ${inspector2 !== null && inspector2 !== undefined
        ? ` Y ${inspector2?.name}`
        : ""
        }`;
    firstPage.drawText(inspectores?.slice(0, 55) ?? "", {
        x: getPositionXPercentage(894, width),
        y: getPositionYPercentage(1427, height),
        size: 9,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    firstPage.drawText(inspectores?.slice(55) ?? "", {
        x: getPositionXPercentage(388, width),
        y: getPositionYPercentage(1487, height),
        size: 9,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });
    // firstPage.drawText(inspector2?.name ?? "", {
    //     x: getPositionXPercentage(663, width),
    //     y: getPositionYPercentage(1835, height),
    //     size: 9,
    //     font: helveticaFont,
    //     color: rgb(0, 0, 0),
    // });
    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();
    if (preview === true || downloadFlag === false) {
        setPreviewPDF(pdfBytes, "pdf-preview-pc");
    }
    if (preview === false && downloadFlag === true) {
        download(
            pdfBytes,
            "Certificación de medidas de seguridad.pdf",
            "application/pdf"
        );
    }
}

export async function createCertificacionPdf_AI(certificacion_values, preview = false, downloadFlag = true) {
    console.log({ certificacion_values });
    const url =
        "/pdf/resolutivos/Certificacion_Proteccion_Civil_PIPC_AI_v2.pdf";
    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();

    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(
        StandardFonts.HelveticaBold
    );
    const textProps10 = {
        size: 8,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    };
    const font = {
        size: 10,
        family: helveticaFont,
        color: rgb(0, 0, 0),
    };
    certificacion_values = getStringValues(certificacion_values);
    if (preview === false) {
        const qrImageBytes = await fetch(
            `https://api.qrserver.com/v1/create-qr-code/?size=100x100&margin=5&data=https://comercio.lapaz.gob.mx/resolutivo/${certificacion_values?.folio ?? "NA"
            }`
        ).then((res) => res.arrayBuffer());
        const qrImage = await pdfDoc.embedPng(qrImageBytes);
        const qrDims = qrImage.scale(0.9);
        pages.forEach((page) => {
            page.drawImage(qrImage, {
                x: getPositionXPercentage(2026, width),
                y: getPositionYPercentage(450, height),
                width: qrDims.width,
                height: qrDims.height,
            });
            if (certificacion_values?.year_creacion_tramite === 2023) {
                const december31 = moment({
                    year: certificacion_values?.year_creacion_tramite, month: 11, date: 31
                })
                page.drawText(
                    `La Paz, Baja California Sur, a ${String(
                        new Date(certificacion_values?.year_creacion_tramite, 11, 31).getDate()
                    ).padStart(2, "0")} de ${december31.format("MMMM")} de ${december31.format("YYYY")}`.toUpperCase(),
                    {
                        x: getPositionXPercentage(388, width),
                        y: getPositionYPercentage(730, height),
                        ...textProps10,
                    }
                );
            } else {
                page.drawText(
                    `La Paz, Baja California Sur, a ${String(
                        new Date().getDate()
                    ).padStart(2, "0")} de ${moment().format("MMMM")} de ${moment().format("YYYY")}`.toUpperCase(),
                    {
                        x: getPositionXPercentage(388, width),
                        y: getPositionYPercentage(730, height),
                        ...textProps10,
                    }
                );
            }

            printCenteredText(
                { ...font, family: helveticaBoldFont, size: 25 },
                certificacion_values?.año_fiscal,
                364,
                height,
                width,
                firstPage
            );
            printCenteredText(
                { ...font, family: helveticaBoldFont, size: 14 },
                `No. ${certificacion_values?.folio}`,
                425,
                height,
                width,
                firstPage
            );
        });

        const user = window.user;
        const apellido_paterno =
            user?.apellido_paterno ?? "" !== ""
                ? ` ${user?.apellido_paterno}`
                : "";
        const apellido_materno =
            user?.apellido_materno ?? "" !== ""
                ? ` ${user?.apellido_materno}`
                : "";
        const director_name = `${user?.nombre}${apellido_paterno}${apellido_materno}`;

        const textWidth = helveticaFont.widthOfTextAtSize(director_name, 12);

        const x = (width - textWidth) / 2;
        const x2 = x / (width / 100);
        const x3 = x2 / 100;
        firstPage.drawText(director_name, {
            x: width * x3,
            y: height * 0.11,
            size: 12,
            font: helveticaFont,
            color: rgb(0, 0, 0),
        });

        const firma = firmas.find(
            (firma) => firma.entidad_code === "proteccion_civil"
        );
        const firmaBytes = await fetch(firma?.firma_path ?? "").then((res) =>
            res.arrayBuffer()
        );
        const firmaImage = await pdfDoc.embedPng(firmaBytes);
        const firmaDims = firmaImage.scale(0.35);
        pages[pages.length - 1].drawImage(firmaImage, {
            x: pages[pages.length - 1].getWidth() / 2 - firmaDims.width / 2,
            y: getPositionYPercentage(2985, height),
            width: firmaDims.width,
            height: firmaDims.height,
        });
    }

    firstPage.drawText(certificacion_values?.nombre ?? "", {
        x: getPositionXPercentage(388, width),
        y: getPositionYPercentage(829, height),
        size: 9,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });
    firstPage.drawText(certificacion_values.negocio, {
        x: getPositionXPercentage(1339, width),
        y: getPositionYPercentage(902, height),
        size: 9,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    // LINEA 1 DE GIROS
    firstPage.drawText(certificacion_values.giro.slice(0, 55), {
        x: getPositionXPercentage(891, width),
        y: getPositionYPercentage(955, height),
        size: 9,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });
    // LINEA 2 DE GIROS
    firstPage.drawText(certificacion_values.giro.slice(55, 136), {
        x: getPositionXPercentage(388, width),
        y: getPositionYPercentage(1013, height),
        size: 9,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });
    // LINEA 3 DE GIROS
    firstPage.drawText(certificacion_values.giro.slice(136), {
        x: getPositionXPercentage(388, width),
        y: getPositionYPercentage(1067, height),
        size: 9,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });
    firstPage.drawText(certificacion_values.direccion.slice(0, 74), {
        x: getPositionXPercentage(676, width),
        y: getPositionYPercentage(1117, height),
        size: 9,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    firstPage.drawText(certificacion_values.direccion.slice(74), {
        x: getPositionXPercentage(388, width),
        y: getPositionYPercentage(1175, height),
        size: 9,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    firstPage.drawText(certificacion_values?.año_fiscal, {
        x: getPositionXPercentage(1448, width),
        y: getPositionYPercentage(2492, height),
        size: 9,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    const inspector = ListaInspectores?.find(
        (inspector) => inspector?.id === certificacion_values?.inspector
    );
    const inspector2 = ListaInspectores?.find(
        (inspector) => inspector?.id === certificacion_values?.inspector_2
    );
    let inspectorPI;
   
    if(certificacion_values.año_fiscal<2024)
    {
          inspectorPI = inspectorePI?.find(
            (inspector) => inspector?.id === certificacion_values?.inspector_pi
        );
    }
    else
    {
          inspectorPI = inspectorePIEx?.find(
            (inspector) => inspector?.id === certificacion_values?.inspector_pi
        );
    }
    const inspectores = `${inspector?.name} ${inspector2 !== null && inspector2 !== undefined
        ? ` Y ${inspector2?.name}`
        : ""
        }`;

    firstPage.drawText(inspectores?.slice(0, 55) ?? "", {
        x: getPositionXPercentage(928, width),
        y: getPositionYPercentage(1226, height),
        size: 9,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    firstPage.drawText(inspectores?.slice(55) ?? "", {
        x: getPositionXPercentage(388, width),
        y: getPositionYPercentage(1284, height),
        size: 9,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    firstPage.drawText(inspectorPI?.name.toUpperCase()  ?? "", {
        x: getPositionXPercentage(436, width),
        y: getPositionYPercentage(1599, height),
        size: 9,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });
    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();
    if (preview === true || downloadFlag === false) {
        setPreviewPDF(pdfBytes, "pdf-preview-pc");
    }
    if (preview === false && downloadFlag === true) {
        download(
            pdfBytes,
            "Certificación de medidas de seguridad.pdf",
            "application/pdf"
        );
    }
}
