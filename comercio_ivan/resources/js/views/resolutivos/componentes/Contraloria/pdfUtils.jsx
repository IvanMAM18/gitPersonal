import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import download from "downloadjs";
import moment from "moment";
import {
    tiposIdentificacion,
    indentificadores,
    entidadesExpiden,
} from "./constants";

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

export async function createConstanciaInhabilitacionPdf(
    values,
    preview = false,
    pdfName
) {
    console.log({ values });
    values = getStringValues(values);
    const url = `/pdf/resolutivos/contraloria/${pdfName}.pdf`;

    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(
        StandardFonts.HelveticaBold
    );
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const { width, height } = firstPage.getSize();
    if (preview === false) {
        const qrImageBytes = await fetch(
            `https://chart.apis.google.com/chart?cht=qr&chl=https://comercio.lapaz.gob.mx/resolutivo/${values?.folio ?? "NA"
            }&chs=100`
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
        printCenteredText(
            { color: rgb(0, 0, 0), family: helveticaBoldFont, size: 25 },
            "2023",
            364,
            height,
            width,
            firstPage
        );
        printCenteredText(
            { color: rgb(0, 0, 0), family: helveticaBoldFont, size: 18 },
            values.folio,
            425,
            height,
            width,
            firstPage
        );
        // const firma = firmas.find((firma) => firma.entidad_code === "ecologia");
        // const firmaBytes = await fetch(firma?.firma_path ?? "").then((res) =>
        //     res.arrayBuffer()
        // );
        // const firmaImage = await pdfDoc.embedPng(firmaBytes);
        // const firmaDims = firmaImage.scale(0.2);
        // pages[pages.length - 1].drawImage(firmaImage, {
        //     x: pages[pages.length - 1].getWidth() / 2 - firmaDims.width / 2,
        //     y: getPositionYPercentage(2970, height),
        //     width: firmaDims.width,
        //     height: firmaDims.height,
        // });
    }
    const fecha = values?.fecha ?? moment();
    const fechaString = `${String(fecha?.format("D")).padStart(
        2,
        "0"
    )} de ${fecha?.locale("es")?.format("MMMM")} de ${fecha?.format("YYYY")}`;
    const identificacion =
        tiposIdentificacion.find((value) => value.id === values.identificacion)
            ?.name ?? "";
    const identificador =
        indentificadores.find((value) => value.id === values.identificador)
            ?.name ?? "";
    const entidad_expide =
        entidadesExpiden.find((value) => value.id === values.entidad_expide)
            ?.name ?? "";

    firstPage.drawText(values?.solicitante ?? "", {
        x: getPositionXPercentage(328, width),
        y: getPositionYPercentage(1849, height),
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });
    firstPage.drawText(values?.curp ?? "", {
        x: getPositionXPercentage(1221, width),
        y: getPositionYPercentage(1909, height),
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });
    firstPage.drawText(identificacion ?? "", {
        x: getPositionXPercentage(356, width),
        y: getPositionYPercentage(1969, height),
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    firstPage.drawText(identificador ?? "", {
        x: getPositionXPercentage(219, width),
        y: getPositionYPercentage(2030, height),
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    firstPage.drawText(values?.num_identifiacion ?? "", {
        x: getPositionXPercentage(1118, width),
        y: getPositionYPercentage(2030, height),
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    firstPage.drawText(entidad_expide ?? "", {
        x: getPositionXPercentage(219, width),
        y: getPositionYPercentage(2092, height),
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    firstPage.drawText(fechaString?.toUpperCase() ?? "", {
        x: getPositionXPercentage(1447, width),
        y: getPositionYPercentage(2332, height),
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    firstPage.drawText(values?.dias_vigencia.toString() ?? "", {
        x: getPositionXPercentage(1446, width),
        y: getPositionYPercentage(2392, height),
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    if (preview === true) {
        setPreviewPDF(pdfBytes, "pdf-preview-ci");
    }
    if (preview === false) {
        download(
            pdfBytes,
            "CONSTANCIA DE NO INHABILITACIÓN.pdf",
            "application/pdf"
        );
    }
}
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
