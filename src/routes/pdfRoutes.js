const express = require('express');
const router = express.Router();
const pdfService = require('../services/pdfService');
const ocrService = require('../services/ocrService');




// Add text to PDF at specific position
router.post('/add-text', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { 
      text, 
      pageNumber = 0, 
      x = 50, 
      y = 50, 
      fontSize = 12,
      color = '0,0,0' // RGB format: "255,0,0" for red
    } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const resultPdf = await pdfService.addTextToPDF(req.files.pdf, {
      text,
      pageNumber: parseInt(pageNumber),
      x: parseInt(x),
      y: parseInt(y),
      fontSize: parseInt(fontSize),
      color
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=edited.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Add text error:', error);
    res.status(500).json({ error: 'Failed to add text to PDF' });
  }
});

// Redact/Remove text (blackout sensitive information)
router.post('/redact', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { 
      pageNumber = 0,
      x = 0,
      y = 0,
      width = 100,
      height = 20
    } = req.body;

    const resultPdf = await pdfService.redactPDF(req.files.pdf, {
      pageNumber: parseInt(pageNumber),
      x: parseInt(x),
      y: parseInt(y),
      width: parseInt(width),
      height: parseInt(height)
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=redacted.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Redact error:', error);
    res.status(500).json({ error: 'Failed to redact PDF' });
  }
});


// Merge PDFs
router.post('/merge', async (req, res) => {
  try {
    if (!req.files || !req.files.pdfs) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const files = Array.isArray(req.files.pdfs) ? req.files.pdfs : [req.files.pdfs];
    const mergedPdf = await pdfService.mergePDFs(files);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=merged.pdf');
    res.send(mergedPdf);
  } catch (error) {
    console.error('Merge error:', error);
    res.status(500).json({ error: 'Failed to merge PDFs' });
  }
});

// Split PDF
router.post('/split', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { pageRanges } = req.body; // e.g., [[0,1,2], [3,4,5]]
    const ranges = JSON.parse(pageRanges);
    
    const splitPdfs = await pdfService.splitPDF(req.files.pdf, ranges);

    // For simplicity, return first split (in production, zip them)
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=split-1.pdf');
    res.send(splitPdfs[0]);
  } catch (error) {
    console.error('Split error:', error);
    res.status(500).json({ error: 'Failed to split PDF' });
  }
});

// Remove pages
router.post('/remove-pages', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { pages } = req.body; // e.g., [0, 2, 4]
    const pagesToRemove = JSON.parse(pages);
    
    const resultPdf = await pdfService.removePages(req.files.pdf, pagesToRemove);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=removed-pages.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Remove pages error:', error);
    res.status(500).json({ error: 'Failed to remove pages' });
  }
});

// Extract pages
router.post('/extract-pages', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { pages } = req.body; // e.g., [0, 1, 3]
    const pagesToExtract = JSON.parse(pages);
    
    const resultPdf = await pdfService.extractPages(req.files.pdf, pagesToExtract);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=extracted-pages.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Extract pages error:', error);
    res.status(500).json({ error: 'Failed to extract pages' });
  }
});

// Rotate PDF
router.post('/rotate', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { rotation } = req.body; // 90, 180, or 270
    const resultPdf = await pdfService.rotatePDF(req.files.pdf, parseInt(rotation));

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=rotated.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Rotate error:', error);
    res.status(500).json({ error: 'Failed to rotate PDF' });
  }
});

// Add watermark
router.post('/watermark', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { text, fontSize, opacity } = req.body;
    const options = {
      fontSize: parseInt(fontSize) || 50,
      opacity: parseFloat(opacity) || 0.3,
    };

    const resultPdf = await pdfService.addWatermark(req.files.pdf, text, options);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=watermarked.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Watermark error:', error);
    res.status(500).json({ error: 'Failed to add watermark' });
  }
});

// Add page numbers
router.post('/page-numbers', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { position, alignment } = req.body;
    const options = {
      position: position || 'bottom',
      alignment: alignment || 'center',
    };

    const resultPdf = await pdfService.addPageNumbers(req.files.pdf, options);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=numbered.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Page numbers error:', error);
    res.status(500).json({ error: 'Failed to add page numbers' });
  }
});

// Compress PDF
router.post('/compress', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { quality } = req.body; // 'low', 'medium', 'high'
    const resultPdf = await pdfService.compressPDF(req.files.pdf, quality || 'medium');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=compressed.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Compress error:', error);
    res.status(500).json({ error: 'Failed to compress PDF' });
  }
});

// Get PDF info
router.post('/info', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const info = await pdfService.getPDFInfo(req.files.pdf);
    res.json(info);
  } catch (error) {
    console.error('PDF info error:', error);
    res.status(500).json({ error: 'Failed to get PDF info' });
  }
});

// Organize pages
router.post('/organize', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { pageOrder } = req.body;
    const order = JSON.parse(pageOrder);
    const resultPdf = await pdfService.organizePDF(req.files.pdf, order);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=organized.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Organize error:', error);
    res.status(500).json({ error: 'Failed to organize PDF' });
  }
});

// Reverse pages
router.post('/reverse', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const resultPdf = await pdfService.reversePDF(req.files.pdf);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=reversed.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Reverse error:', error);
    res.status(500).json({ error: 'Failed to reverse PDF' });
  }
});

// Duplicate pages
router.post('/duplicate', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { pages } = req.body;
    const pagesToDuplicate = JSON.parse(pages);
    const resultPdf = await pdfService.duplicatePDF(req.files.pdf, pagesToDuplicate);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=duplicated.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Duplicate error:', error);
    res.status(500).json({ error: 'Failed to duplicate pages' });
  }
});

// Repair PDF
router.post('/repair', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const resultPdf = await pdfService.repairPDF(req.files.pdf);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=repaired.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Repair error:', error);
    res.status(500).json({ error: 'Failed to repair PDF' });
  }
});

// Optimize images
router.post('/optimize-images', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { quality } = req.body;
    const resultPdf = await pdfService.optimizeImagesPDF(req.files.pdf, parseInt(quality) || 80);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=optimized.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Optimize images error:', error);
    res.status(500).json({ error: 'Failed to optimize images' });
  }
});

// Remove duplicates
router.post('/remove-duplicates', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const resultPdf = await pdfService.removeDuplicatesPDF(req.files.pdf);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=no-duplicates.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Remove duplicates error:', error);
    res.status(500).json({ error: 'Failed to remove duplicates' });
  }
});

// Protect PDF
router.post('/protect', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { password, permissions } = req.body;
    const resultPdf = await pdfService.protectPDF(req.files.pdf, password, permissions ? JSON.parse(permissions) : {});

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=protected.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Protect error:', error);
    res.status(500).json({ error: 'Failed to protect PDF' });
  }
});

// Unlock PDF
router.post('/unlock', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { password } = req.body;
    const resultPdf = await pdfService.unlockPDF(req.files.pdf, password);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=unlocked.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Unlock error:', error);
    res.status(500).json({ error: 'Failed to unlock PDF' });
  }
});

// Encrypt PDF
router.post('/encrypt', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { encryptionType } = req.body;
    const resultPdf = await pdfService.encryptPDF(req.files.pdf, encryptionType);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=encrypted.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Encrypt error:', error);
    res.status(500).json({ error: 'Failed to encrypt PDF' });
  }
});

// Sign PDF
router.post('/sign', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { signature } = req.body;
    const resultPdf = await pdfService.signPDF(req.files.pdf, signature);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=signed.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Sign error:', error);
    res.status(500).json({ error: 'Failed to sign PDF' });
  }
});

// Add header/footer
router.post('/header-footer', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { header, footer } = req.body;
    const resultPdf = await pdfService.addHeaderFooterPDF(req.files.pdf, header, footer);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=header-footer.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Header/Footer error:', error);
    res.status(500).json({ error: 'Failed to add header/footer' });
  }
});

// Crop PDF
router.post('/crop', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { cropBox } = req.body;
    const resultPdf = await pdfService.cropPDF(req.files.pdf, JSON.parse(cropBox));

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=cropped.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Crop error:', error);
    res.status(500).json({ error: 'Failed to crop PDF' });
  }
});

// Resize PDF
router.post('/resize', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { width, height } = req.body;
    const resultPdf = await pdfService.resizePDF(req.files.pdf, parseInt(width), parseInt(height));

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=resized.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Resize error:', error);
    res.status(500).json({ error: 'Failed to resize PDF' });
  }
});

// Edit text
router.post('/edit-text', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { edits } = req.body;
    const resultPdf = await pdfService.editTextPDF(req.files.pdf, JSON.parse(edits));

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=edited-text.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Edit text error:', error);
    res.status(500).json({ error: 'Failed to edit text' });
  }
});

// Highlight
router.post('/highlight', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { highlights } = req.body;
    const resultPdf = await pdfService.highlightPDF(req.files.pdf, JSON.parse(highlights));

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=highlighted.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Highlight error:', error);
    res.status(500).json({ error: 'Failed to highlight' });
  }
});

// Annotate
router.post('/annotate', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { annotations } = req.body;
    const resultPdf = await pdfService.annotatePDF(req.files.pdf, JSON.parse(annotations));

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=annotated.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Annotate error:', error);
    res.status(500).json({ error: 'Failed to annotate' });
  }
});

// Draw on PDF - Freehand drawing with paths
router.post('/draw', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { drawings } = req.body;
    // drawings format: [{ pageNumber, paths: [{ points: [{x, y}], color, strokeWidth }] }]
    const resultPdf = await pdfService.drawOnPDF(req.files.pdf, JSON.parse(drawings));

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=drawn.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Draw error:', error);
    res.status(500).json({ error: 'Failed to draw on PDF' });
  }
});

// Stamp
router.post('/stamp', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { stamp } = req.body;
    const resultPdf = await pdfService.stampPDF(req.files.pdf, stamp);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=stamped.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Stamp error:', error);
    res.status(500).json({ error: 'Failed to stamp PDF' });
  }
});

// Set metadata
router.post('/metadata', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { metadata } = req.body;
    const resultPdf = await pdfService.setMetadataPDF(req.files.pdf, JSON.parse(metadata));

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=metadata.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Metadata error:', error);
    res.status(500).json({ error: 'Failed to set metadata' });
  }
});

// Search in PDF
router.post('/search', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { query } = req.body;
    const results = await pdfService.searchPDF(req.files.pdf, query);

    res.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search PDF' });
  }
});

// Validate PDF
router.post('/validate', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const validation = await pdfService.validatePDF(req.files.pdf);
    res.json(validation);
  } catch (error) {
    console.error('Validate error:', error);
    res.status(500).json({ error: 'Failed to validate PDF' });
  }
});

// Create form
router.post('/create-form', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { fields } = req.body;
    const resultPdf = await pdfService.createFormPDF(req.files.pdf, JSON.parse(fields));

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=form.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Create form error:', error);
    res.status(500).json({ error: 'Failed to create form' });
  }
});

// Fill form
router.post('/fill-form', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { data } = req.body;
    const resultPdf = await pdfService.fillFormPDF(req.files.pdf, JSON.parse(data));

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=filled-form.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Fill form error:', error);
    res.status(500).json({ error: 'Failed to fill form' });
  }
});

// Flatten form
router.post('/flatten', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const resultPdf = await pdfService.flattenFormPDF(req.files.pdf);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=flattened.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Flatten error:', error);
    res.status(500).json({ error: 'Failed to flatten form' });
  }
});

// Extract form data
router.post('/extract-data', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const formData = await pdfService.extractFormDataPDF(req.files.pdf);
    res.json({ formData });
  } catch (error) {
    console.error('Extract form data error:', error);
    res.status(500).json({ error: 'Failed to extract form data' });
  }
});

// Compare PDFs
router.post('/compare', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf1 || !req.files.pdf2) {
      return res.status(400).json({ error: 'Two PDF files required' });
    }

    const resultPdf = await pdfService.comparePDFs(req.files.pdf1, req.files.pdf2);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=comparison.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Compare error:', error);
    res.status(500).json({ error: 'Failed to compare PDFs' });
  }
});

// Diff PDFs
router.post('/diff', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf1 || !req.files.pdf2) {
      return res.status(400).json({ error: 'Two PDF files required' });
    }

    const differences = await pdfService.diffPDFs(req.files.pdf1, req.files.pdf2);
    res.json(differences);
  } catch (error) {
    console.error('Diff error:', error);
    res.status(500).json({ error: 'Failed to diff PDFs' });
  }
});

// Merge with review
router.post('/merge-review', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf1 || !req.files.pdf2) {
      return res.status(400).json({ error: 'Two PDF files required' });
    }

    const resultPdf = await pdfService.mergeReviewPDFs(req.files.pdf1, req.files.pdf2);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=merged-review.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Merge review error:', error);
    res.status(500).json({ error: 'Failed to merge with review' });
  }
});

// OCR - Extract text from scanned PDFs
router.post('/ocr', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { language, autoDetect } = req.body;
    let result;

    if (autoDetect === 'true' || autoDetect === true) {
      result = await ocrService.extractTextWithAutoDetect(req.files.pdf);
    } else {
      result = await ocrService.extractTextFromPDF(req.files.pdf, language || 'eng');
    }

    res.json(result);
  } catch (error) {
    console.error('OCR error:', error);
    res.status(500).json({ 
      error: 'Failed to perform OCR',
      details: error.message,
      hint: 'Ensure Tesseract.js is installed: npm install tesseract.js'
    });
  }
});

// Get supported OCR languages
router.get('/ocr/languages', (req, res) => {
  res.json({ 
    languages: ocrService.getSupportedLanguages(),
    defaultLanguage: 'eng'
  });
});

// Black and white
router.post('/black-white', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const resultPdf = await pdfService.blackWhitePDF(req.files.pdf);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=black-white.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Black/white error:', error);
    res.status(500).json({ error: 'Failed to convert to black and white' });
  }
});

// Fix orientation
router.post('/fix-orientation', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const resultPdf = await pdfService.fixOrientationPDF(req.files.pdf);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=fixed-orientation.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Fix orientation error:', error);
    res.status(500).json({ error: 'Failed to fix orientation' });
  }
});

// Remove blank pages
router.post('/remove-blank', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const resultPdf = await pdfService.removeBlankPagesPDF(req.files.pdf);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=no-blanks.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Remove blank error:', error);
    res.status(500).json({ error: 'Failed to remove blank pages' });
  }
});

// Add bookmarks
router.post('/bookmarks', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { bookmarks } = req.body;
    const resultPdf = await pdfService.addBookmarksPDF(req.files.pdf, JSON.parse(bookmarks));

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=bookmarked.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Bookmarks error:', error);
    res.status(500).json({ error: 'Failed to add bookmarks' });
  }
});

// Add hyperlinks
router.post('/hyperlinks', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { links } = req.body;
    const resultPdf = await pdfService.addHyperlinksPDF(req.files.pdf, JSON.parse(links));

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=hyperlinked.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Hyperlinks error:', error);
    res.status(500).json({ error: 'Failed to add hyperlinks' });
  }
});

// Manage attachments
router.post('/attachments', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const attachments = req.files.files || [];
    const resultPdf = await pdfService.addAttachmentsPDF(req.files.pdf, attachments);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=with-attachments.pdf');
    res.send(resultPdf);
  } catch (error) {
    console.error('Attachments error:', error);
    res.status(500).json({ error: 'Failed to manage attachments' });
  }
});

module.exports = router;