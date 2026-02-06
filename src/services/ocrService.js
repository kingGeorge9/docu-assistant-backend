const Tesseract = require('tesseract.js');
const fs = require('fs').promises;
const { fromPath } = require('pdf2pic');
const path = require('path');

class OCRService {
  constructor() {
    this.supportedLanguages = [
      'eng', 'spa', 'fra', 'deu', 'ita', 'por', 'rus', 'chi_sim', 'jpn', 'kor'
    ];
  }

  /**
   * Extract text from image using Tesseract.js
   */
  async extractTextFromImage(imageBuffer, language = 'eng') {
    try {
      const result = await Tesseract.recognize(imageBuffer, language, {
        logger: m => console.log(m) // Progress logging
      });

      return {
        text: result.data.text,
        confidence: result.data.confidence,
        words: result.data.words.length,
        lines: result.data.lines.length
      };
    } catch (error) {
      console.error('OCR error:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  /**
   * Extract text from PDF by converting to images first
   */
  async extractTextFromPDF(pdfFile, language = 'eng') {
    try {
      // Convert PDF pages to images
      const options = {
        density: 300, // Higher density = better quality
        saveFilename: `ocr_${Date.now()}`,
        savePath: path.dirname(pdfFile.tempFilePath),
        format: 'png',
        width: 2000,
        height: 2000
      };

      const convert = fromPath(pdfFile.tempFilePath, options);
      
      // Get PDF page count
      const pdfParse = require('pdf-parse');
      const dataBuffer = await fs.readFile(pdfFile.tempFilePath);
      const data = await pdfParse(dataBuffer);
      const pageCount = data.numpages;

      let fullText = '';
      const pageResults = [];

      // Process each page
      for (let i = 1; i <= pageCount; i++) {
        try {
          // Convert page to image
          const pageImage = await convert(i, { responseType: 'buffer' });
          const imageBuffer = pageImage.buffer || pageImage;

          // Extract text from image
          const result = await this.extractTextFromImage(imageBuffer, language);
          
          fullText += `\n--- Page ${i} ---\n${result.text}\n`;
          
          pageResults.push({
            page: i,
            text: result.text,
            confidence: result.confidence,
            words: result.words,
            lines: result.lines
          });
        } catch (error) {
          console.error(`Error processing page ${i}:`, error);
          pageResults.push({
            page: i,
            error: 'Failed to process page'
          });
        }
      }

      return {
        text: fullText.trim(),
        pages: pageResults,
        totalPages: pageCount,
        language: language
      };
    } catch (error) {
      console.error('PDF OCR error:', error);
      throw new Error('Failed to perform OCR on PDF');
    }
  }

  /**
   * Extract text with automatic language detection
   */
  async extractTextWithAutoDetect(pdfFile) {
    // Try multiple languages and use the one with highest confidence
    const languages = ['eng', 'spa', 'fra', 'deu'];
    let bestResult = null;
    let highestConfidence = 0;

    for (const lang of languages) {
      try {
        const result = await this.extractTextFromPDF(pdfFile, lang);
        const avgConfidence = result.pages.reduce((acc, p) => acc + (p.confidence || 0), 0) / result.pages.length;
        
        if (avgConfidence > highestConfidence) {
          highestConfidence = avgConfidence;
          bestResult = result;
          bestResult.detectedLanguage = lang;
        }
      } catch (error) {
        console.log(`Failed with language ${lang}`);
      }
    }

    return bestResult;
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages() {
    return this.supportedLanguages;
  }
}

module.exports = new OCRService();
