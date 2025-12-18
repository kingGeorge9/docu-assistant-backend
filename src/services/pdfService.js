const { PDFDocument, rgb, degrees } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

class PDFService {
  
// Add text to PDF at specific position
async addTextToPDF(file, options) {
  const pdfBytes = await fs.readFile(file.tempFilePath);
  const pdf = await PDFDocument.load(pdfBytes);

  const {
    text,
    pageNumber = 0,
    x = 50,
    y = 50,
    fontSize = 12,
    color = '0,0,0'
  } = options;

  const pages = pdf.getPages();
  const page = pages[pageNumber];

  if (!page) {
    throw new Error(`Page ${pageNumber} does not exist`);
  }

  // Parse color
  const [r, g, b] = color.split(',').map(Number);

  page.drawText(text, {
    x,
    y,
    size: fontSize,
    color: rgb(r / 255, g / 255, b / 255),
  });

  const editedPdfBytes = await pdf.save();
  return Buffer.from(editedPdfBytes);
}

// Redact/blackout area
async redactPDF(file, options) {
  const pdfBytes = await fs.readFile(file.tempFilePath);
  const pdf = await PDFDocument.load(pdfBytes);

  const {
    pageNumber = 0,
    x = 0,
    y = 0,
    width = 100,
    height = 20
  } = options;

  const pages = pdf.getPages();
  const page = pages[pageNumber];

  if (!page) {
    throw new Error(`Page ${pageNumber} does not exist`);
  }

  // Draw black rectangle over the area
  page.drawRectangle({
    x,
    y,
    width,
    height,
    color: rgb(0, 0, 0),
  });

  const redactedPdfBytes = await pdf.save();
  return Buffer.from(redactedPdfBytes);
}


  // Merge PDFs
  async mergePDFs(files) {
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const pdfBytes = await fs.readFile(file.tempFilePath);
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    return Buffer.from(mergedPdfBytes);
  }

  // Split PDF
  async splitPDF(file, pageRanges) {
    const pdfBytes = await fs.readFile(file.tempFilePath);
    const pdf = await PDFDocument.load(pdfBytes);
    const results = [];

    for (const range of pageRanges) {
      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(pdf, range);
      pages.forEach((page) => newPdf.addPage(page));
      
      const pdfBytes = await newPdf.save();
      results.push(Buffer.from(pdfBytes));
    }

    return results;
  }

  // Remove pages
  async removePages(file, pagesToRemove) {
    const pdfBytes = await fs.readFile(file.tempFilePath);
    const pdf = await PDFDocument.load(pdfBytes);
    const newPdf = await PDFDocument.create();

    const totalPages = pdf.getPageCount();
    const pagesToKeep = [];
    
    for (let i = 0; i < totalPages; i++) {
      if (!pagesToRemove.includes(i)) {
        pagesToKeep.push(i);
      }
    }

    const copiedPages = await newPdf.copyPages(pdf, pagesToKeep);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const resultBytes = await newPdf.save();
    return Buffer.from(resultBytes);
  }

  // Extract pages
  async extractPages(file, pagesToExtract) {
    const pdfBytes = await fs.readFile(file.tempFilePath);
    const pdf = await PDFDocument.load(pdfBytes);
    const newPdf = await PDFDocument.create();

    const copiedPages = await newPdf.copyPages(pdf, pagesToExtract);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const resultBytes = await newPdf.save();
    return Buffer.from(resultBytes);
  }

  // Rotate PDF
  async rotatePDF(file, rotation) {
    const pdfBytes = await fs.readFile(file.tempFilePath);
    const pdf = await PDFDocument.load(pdfBytes);

    const pages = pdf.getPages();
    pages.forEach((page) => {
      page.setRotation(degrees(rotation));
    });

    const rotatedPdfBytes = await pdf.save();
    return Buffer.from(rotatedPdfBytes);
  }

  // Add watermark
  async addWatermark(file, watermarkText, options = {}) {
    const pdfBytes = await fs.readFile(file.tempFilePath);
    const pdf = await PDFDocument.load(pdfBytes);
    const pages = pdf.getPages();

    const {
      fontSize = 50,
      opacity = 0.3,
      color = { r: 0.5, g: 0.5, b: 0.5 },
      rotation = 45
    } = options;

    pages.forEach((page) => {
      const { width, height } = page.getSize();
      page.drawText(watermarkText, {
        x: width / 2 - (watermarkText.length * fontSize) / 4,
        y: height / 2,
        size: fontSize,
        color: rgb(color.r, color.g, color.b),
        opacity: opacity,
        rotate: degrees(rotation),
      });
    });

    const watermarkedPdfBytes = await pdf.save();
    return Buffer.from(watermarkedPdfBytes);
  }

  // Add page numbers
  async addPageNumbers(file, options = {}) {
    const pdfBytes = await fs.readFile(file.tempFilePath);
    const pdf = await PDFDocument.load(pdfBytes);
    const pages = pdf.getPages();

    const {
      position = 'bottom',
      alignment = 'center',
      fontSize = 12
    } = options;

    pages.forEach((page, index) => {
      const { width, height } = page.getSize();
      const pageNumber = `${index + 1}`;
      
      let x, y;
      
      // Calculate position
      if (alignment === 'center') {
        x = width / 2 - (pageNumber.length * fontSize) / 4;
      } else if (alignment === 'left') {
        x = 50;
      } else {
        x = width - 50;
      }

      y = position === 'bottom' ? 30 : height - 30;

      page.drawText(pageNumber, {
        x,
        y,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
    });

    const numberedPdfBytes = await pdf.save();
    return Buffer.from(numberedPdfBytes);
  }

  // Compress PDF (basic optimization)
  async compressPDF(file) {
    const pdfBytes = await fs.readFile(file.tempFilePath);
    const pdf = await PDFDocument.load(pdfBytes);

    // Save with compression
    const compressedPdfBytes = await pdf.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });

    return Buffer.from(compressedPdfBytes);
  }

  // Get PDF info
  async getPDFInfo(file) {
    const pdfBytes = await fs.readFile(file.tempFilePath);
    const pdf = await PDFDocument.load(pdfBytes);

    return {
      pageCount: pdf.getPageCount(),
      title: pdf.getTitle(),
      author: pdf.getAuthor(),
      subject: pdf.getSubject(),
      creator: pdf.getCreator(),
      producer: pdf.getProducer(),
      creationDate: pdf.getCreationDate(),
      modificationDate: pdf.getModificationDate(),
    };
  }
}

module.exports = new PDFService();