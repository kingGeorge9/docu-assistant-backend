const { exec } = require('child_process');
const util = require('util');
const fs = require('fs').promises;
const path = require('path');

const execPromise = util.promisify(exec);

class OfficeConversionService {
  constructor() {
    // Check if LibreOffice is installed
    this.libreOfficePath = this.detectLibreOffice();
  }

  detectLibreOffice() {
    // Common LibreOffice paths
    const paths = [
      'libreoffice',  // Linux/Mac with PATH
      '/usr/bin/libreoffice',  // Linux
      '/Applications/LibreOffice.app/Contents/MacOS/soffice',  // macOS
      'C:\\Program Files\\LibreOffice\\program\\soffice.exe',  // Windows
      'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe'  // Windows 32-bit
    ];

    // Return first available path (in production, check which exists)
    return paths[0];
  }

  async wordToPDF(wordFile) {
    try {
      const inputPath = wordFile.tempFilePath;
      const outputDir = path.dirname(inputPath);
      const outputName = path.basename(inputPath, path.extname(inputPath));
      const outputPath = path.join(outputDir, `${outputName}.pdf`);

      // Convert using LibreOffice
      const command = `"${this.libreOfficePath}" --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`;
      
      await execPromise(command, { timeout: 30000 });

      // Read the converted PDF
      const pdfBuffer = await fs.readFile(outputPath);
      
      // Clean up
      await fs.unlink(outputPath).catch(() => {});

      return pdfBuffer;
    } catch (error) {
      console.error('Word to PDF conversion error:', error);
      throw new Error('Failed to convert Word to PDF. Ensure LibreOffice is installed.');
    }
  }

  async excelToPDF(excelFile) {
    return this.wordToPDF(excelFile); // Same process
  }

  async pptToPDF(pptFile) {
    return this.wordToPDF(pptFile); // Same process
  }

  // For PDF to Office conversions, use pdf2docx library
  async pdfToWord(pdfFile) {
    try {
      // Using pdf2docx Python library via child_process
      const inputPath = pdfFile.tempFilePath;
      const outputPath = inputPath.replace('.pdf', '.docx');

      // This requires pdf2docx Python package installed
      const command = `python3 -c "from pdf2docx import Converter; cv = Converter('${inputPath}'); cv.convert('${outputPath}'); cv.close()"`;
      
      await execPromise(command, { timeout: 60000 });

      const docxBuffer = await fs.readFile(outputPath);
      await fs.unlink(outputPath).catch(() => {});

      return docxBuffer;
    } catch (error) {
      console.error('PDF to Word error:', error);
      throw new Error('Failed to convert PDF to Word. Install: pip install pdf2docx');
    }
  }

  async pdfToExcel(pdfFile) {
    try {
      // Using tabula-py for PDF tables to Excel
      const inputPath = pdfFile.tempFilePath;
      const outputPath = inputPath.replace('.pdf', '.xlsx');

      const command = `python3 -c "import tabula; df = tabula.read_pdf('${inputPath}', pages='all'); import pandas as pd; with pd.ExcelWriter('${outputPath}') as writer: [df[i].to_excel(writer, sheet_name=f'Sheet{i+1}') for i in range(len(df))]; print('Done')"`;
      
      await execPromise(command, { timeout: 60000 });

      const xlsxBuffer = await fs.readFile(outputPath);
      await fs.unlink(outputPath).catch(() => {});

      return xlsxBuffer;
    } catch (error) {
      console.error('PDF to Excel error:', error);
      throw new Error('Failed to convert PDF to Excel. Install: pip install tabula-py pandas openpyxl');
    }
  }

  async pdfToPPT(pdfFile) {
    try {
      // Convert PDF pages to images, then create PowerPoint with those images
      const inputPath = pdfFile.tempFilePath;
      const outputPath = inputPath.replace('.pdf', '.pptx');

      // Use Python with pdf2image and python-pptx
      const command = `python3 -c "
from pdf2image import convert_from_path
from pptx import Presentation
from pptx.util import Inches
import os
import tempfile

images = convert_from_path('${inputPath}', dpi=150)
prs = Presentation()
prs.slide_width = Inches(10)
prs.slide_height = Inches(7.5)

for i, image in enumerate(images):
    slide = prs.slides.add_slide(prs.slide_layouts[6])  # blank layout
    temp_img = tempfile.mktemp(suffix='.png')
    image.save(temp_img, 'PNG')
    slide.shapes.add_picture(temp_img, Inches(0), Inches(0), width=Inches(10), height=Inches(7.5))
    os.remove(temp_img)

prs.save('${outputPath}')
print('Done')
"`;

      await execPromise(command, { timeout: 120000 });

      const pptxBuffer = await fs.readFile(outputPath);
      await fs.unlink(outputPath).catch(() => {});

      return pptxBuffer;
    } catch (error) {
      console.error('PDF to PPT error:', error);
      throw new Error('Failed to convert PDF to PowerPoint. Install: pip install pdf2image python-pptx');
    }
  }

  // Check if LibreOffice is available
  async isLibreOfficeAvailable() {
    try {
      await execPromise(`"${this.libreOfficePath}" --version`);
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = new OfficeConversionService();
