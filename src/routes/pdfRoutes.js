const express = require('express');
const router = express.Router();
const pdfService = require('../services/pdfService');




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

    const resultPdf = await pdfService.compressPDF(req.files.pdf);

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

module.exports = router;