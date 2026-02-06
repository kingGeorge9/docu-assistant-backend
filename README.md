# Docu-Assistant Backend API

A comprehensive document processing backend with 65+ PDF tools, AI-powered features, and conversion capabilities.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd docu-assistant-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your Anthropic API key to .env
ANTHROPIC_API_KEY=your_api_key_here

# Start the server
npm start

# For development with auto-reload
npm run dev
```

The server will start on `http://localhost:3000`

## 📁 Project Structure

```
docu-assistant-backend/
├── src/
│   ├── server.js              # Main server file
│   ├── routes/
│   │   ├── pdfRoutes.js       # PDF manipulation endpoints
│   │   ├── convertRoutes.js   # Conversion endpoints
│   │   ├── aiRoutes.js        # AI-powered endpoints
│   │   └── documentRoutes.js  # Document management endpoints
│   ├── services/
│   │   ├── pdfService.js      # PDF processing logic
│   │   ├── convertService.js  # Conversion logic
│   │   ├── aiService.js       # AI integration
│   │   └── documentService.js # Document management logic
│   ├── controllers/           # (Future use)
│   └── middleware/            # (Future use)
├── uploads/                   # Temporary file storage
├── package.json
├── .env                       # Environment variables (create this)
└── README.md
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
ANTHROPIC_API_KEY=your_anthropic_api_key_here
NODE_ENV=development
```

## 📡 API Endpoints

### Health Check

#### `GET /`

Returns API status and available endpoints.

**Response:**

```json
{
  "status": "ok",
  "message": "Docu-Assistant Backend API is running!",
  "version": "1.0.0",
  "endpoints": {
    "pdf": "/api/pdf/*",
    "convert": "/api/convert/*",
    "ai": "/api/ai/*",
    "document": "/api/document/*"
  }
}
```

#### `GET /health`

Simple health check endpoint.

---

## 📄 PDF Operations (`/api/pdf/...`)

All PDF endpoints accept `multipart/form-data` with file uploads.

### Organize (7 endpoints)

#### `POST /api/pdf/merge`

Merge multiple PDFs into one.

- **Input:** `pdfs[]` (multiple PDF files)
- **Output:** Merged PDF file

#### `POST /api/pdf/split`

Split PDF by page ranges.

- **Input:** `pdf` (file), `pageRanges` (JSON array of arrays)
- **Example:** `pageRanges: [[0,1,2], [3,4,5]]`
- **Output:** Split PDF file

#### `POST /api/pdf/remove-pages`

Remove specific pages from PDF.

- **Input:** `pdf` (file), `pages` (JSON array of page indices)
- **Output:** PDF with pages removed

#### `POST /api/pdf/extract-pages`

Extract specific pages from PDF.

- **Input:** `pdf` (file), `pages` (JSON array of page indices)
- **Output:** PDF with extracted pages only

#### `POST /api/pdf/organize`

Reorder pages in PDF.

- **Input:** `pdf` (file), `pageOrder` (JSON array of page indices in desired order)
- **Output:** Reorganized PDF

#### `POST /api/pdf/reverse`

Reverse page order.

- **Input:** `pdf` (file)
- **Output:** PDF with reversed pages

#### `POST /api/pdf/duplicate`

Duplicate specific pages.

- **Input:** `pdf` (file), `pages` (JSON array of pages to duplicate)
- **Output:** PDF with duplicated pages

### Optimize (4 endpoints)

#### `POST /api/pdf/compress`

Compress PDF file size.

- **Input:** `pdf` (file)
- **Output:** Compressed PDF

#### `POST /api/pdf/repair`

Repair corrupted PDF.

- **Input:** `pdf` (file)
- **Output:** Repaired PDF

#### `POST /api/pdf/optimize-images`

Optimize embedded images.

- **Input:** `pdf` (file), `quality` (optional, 1-100)
- **Output:** Optimized PDF

#### `POST /api/pdf/remove-duplicates`

Remove duplicate pages.

- **Input:** `pdf` (file)
- **Output:** PDF without duplicates

### Security (5 endpoints)

#### `POST /api/pdf/protect`

Add password protection.

- **Input:** `pdf` (file), `password` (string), `permissions` (optional JSON)
- **Output:** Protected PDF

#### `POST /api/pdf/unlock`

Remove password protection.

- **Input:** `pdf` (file), `password` (string)
- **Output:** Unlocked PDF

#### `POST /api/pdf/redact`

Redact sensitive content.

- **Input:** `pdf` (file), `areas` (JSON array with {pageNumber, x, y, width, height})
- **Output:** Redacted PDF

#### `POST /api/pdf/encrypt`

Encrypt PDF.

- **Input:** `pdf` (file), `encryptionType` (string)
- **Output:** Encrypted PDF

#### `POST /api/pdf/sign`

Add digital signature.

- **Input:** `pdf` (file), `signature` (string)
- **Output:** Signed PDF

### Edit & Annotate (10 endpoints)

#### `POST /api/pdf/rotate`

Rotate all pages.

- **Input:** `pdf` (file), `rotation` (90, 180, or 270)
- **Output:** Rotated PDF

#### `POST /api/pdf/page-numbers`

Add page numbers.

- **Input:** `pdf` (file), `position` (top/bottom), `alignment` (left/center/right)
- **Output:** PDF with page numbers

#### `POST /api/pdf/watermark`

Add watermark text.

- **Input:** `pdf` (file), `text` (string), `fontSize` (number), `opacity` (0-1)
- **Output:** Watermarked PDF

#### `POST /api/pdf/header-footer`

Add header and footer.

- **Input:** `pdf` (file), `header` (string), `footer` (string)
- **Output:** PDF with header/footer

#### `POST /api/pdf/crop`

Crop pages.

- **Input:** `pdf` (file), `cropBox` (JSON: {x, y, width, height})
- **Output:** Cropped PDF

#### `POST /api/pdf/resize`

Resize pages.

- **Input:** `pdf` (file), `width` (number), `height` (number)
- **Output:** Resized PDF

#### `POST /api/pdf/edit-text`

Edit/add text to PDF.

- **Input:** `pdf` (file), `edits` (JSON array of {text, pageNumber, x, y, fontSize})
- **Output:** Edited PDF

#### `POST /api/pdf/highlight`

Highlight areas.

- **Input:** `pdf` (file), `highlights` (JSON array of {pageNumber, x, y, width, height})
- **Output:** Highlighted PDF

#### `POST /api/pdf/annotate`

Add annotations.

- **Input:** `pdf` (file), `annotations` (JSON array of {text, pageNumber, x, y})
- **Output:** Annotated PDF

#### `POST /api/pdf/stamp`

Add stamp/seal.

- **Input:** `pdf` (file), `stamp` (string)
- **Output:** Stamped PDF

### Metadata & Info (5 endpoints)

#### `POST /api/pdf/info`

Get PDF information.

- **Input:** `pdf` (file)
- **Output:** JSON with page count, title, author, etc.

#### `POST /api/pdf/metadata`

Set PDF metadata.

- **Input:** `pdf` (file), `metadata` (JSON: {title, author, subject, keywords, etc.})
- **Output:** PDF with updated metadata

#### `POST /api/pdf/read-aloud`

Convert PDF to speech (placeholder).

- **Input:** `pdf` (file)
- **Output:** Audio file (coming soon)

#### `POST /api/pdf/search`

Search text in PDF.

- **Input:** `pdf` (file), `query` (string)
- **Output:** JSON with search results

#### `POST /api/pdf/validate`

Validate PDF structure.

- **Input:** `pdf` (file)
- **Output:** JSON with validation status

### Forms (4 endpoints)

#### `POST /api/pdf/create-form`

Create fillable form.

- **Input:** `pdf` (file), `fields` (JSON array of {name, type})
- **Output:** PDF with form fields

#### `POST /api/pdf/fill-form`

Fill form fields.

- **Input:** `pdf` (file), `data` (JSON object with field values)
- **Output:** Filled PDF

#### `POST /api/pdf/flatten`

Flatten form (make non-editable).

- **Input:** `pdf` (file)
- **Output:** Flattened PDF

#### `POST /api/pdf/extract-data`

Extract form field data.

- **Input:** `pdf` (file)
- **Output:** JSON with form data

### Compare & Review (3 endpoints)

#### `POST /api/pdf/compare`

Compare two PDFs.

- **Input:** `pdf1` (file), `pdf2` (file)
- **Output:** PDF with comparison

#### `POST /api/pdf/diff`

Show differences between PDFs.

- **Input:** `pdf1` (file), `pdf2` (file)
- **Output:** JSON with differences

#### `POST /api/pdf/merge-review`

Merge PDFs with review.

- **Input:** `pdf1` (file), `pdf2` (file)
- **Output:** Merged PDF

### Advanced (7 endpoints)

#### `POST /api/pdf/ocr`

Extract text via OCR (placeholder).

- **Input:** `pdf` (file), `language` (string)
- **Output:** JSON with extracted text (coming soon)

#### `POST /api/pdf/black-white`

Convert to grayscale.

- **Input:** `pdf` (file)
- **Output:** Grayscale PDF

#### `POST /api/pdf/fix-orientation`

Auto-fix page orientation.

- **Input:** `pdf` (file)
- **Output:** PDF with fixed orientation

#### `POST /api/pdf/remove-blank`

Remove blank pages.

- **Input:** `pdf` (file)
- **Output:** PDF without blank pages

#### `POST /api/pdf/bookmarks`

Add/manage bookmarks.

- **Input:** `pdf` (file), `bookmarks` (JSON array)
- **Output:** PDF with bookmarks

#### `POST /api/pdf/hyperlinks`

Add hyperlinks.

- **Input:** `pdf` (file), `links` (JSON array of {text, url, pageNumber, x, y})
- **Output:** PDF with hyperlinks

#### `POST /api/pdf/attachments`

Manage file attachments.

- **Input:** `pdf` (file), `files[]` (optional files to attach)
- **Output:** PDF with attachments

---

## 🔄 Conversion Operations (`/api/convert/...`)

### Convert TO PDF

#### `POST /api/convert/images-to-pdf`

Convert multiple images to PDF.

- **Input:** `images[]` (multiple image files)
- **Output:** PDF file

#### `POST /api/convert/jpg-to-pdf`

Convert JPG to PDF.

- **Input:** `image` (JPG file)
- **Output:** PDF file

#### `POST /api/convert/png-to-pdf`

Convert PNG to PDF.

- **Input:** `image` (PNG file)
- **Output:** PDF file

#### `POST /api/convert/text-to-pdf`

Convert text to PDF.

- **Input:** `text` (string in body)
- **Output:** PDF file

#### `POST /api/convert/html-to-pdf`

Convert HTML to PDF.

- **Input:** `html` (string in body)
- **Output:** PDF file

#### `POST /api/convert/word-to-pdf`

Convert DOCX to PDF (placeholder).

- **Input:** `document` (DOCX file)
- **Output:** Coming soon

#### `POST /api/convert/ppt-to-pdf`

Convert PPTX to PDF (placeholder).

- **Input:** `document` (PPTX file)
- **Output:** Coming soon

#### `POST /api/convert/excel-to-pdf`

Convert XLSX to PDF (placeholder).

- **Input:** `document` (XLSX file)
- **Output:** Coming soon

### Convert FROM PDF

#### `POST /api/convert/pdf-to-jpg`

Convert PDF to JPG images.

- **Input:** `pdf` (file)
- **Output:** JPG file or ZIP with multiple images

#### `POST /api/convert/pdf-to-png`

Convert PDF to PNG images.

- **Input:** `pdf` (file)
- **Output:** PNG file or ZIP with multiple images

#### `POST /api/convert/pdf-to-text`

Convert PDF to text.

- **Input:** `pdf` (file)
- **Output:** TXT file

#### `POST /api/convert/pdf-to-html`

Convert PDF to HTML.

- **Input:** `pdf` (file)
- **Output:** HTML file

#### `POST /api/convert/pdf-to-word`

Convert PDF to DOCX (placeholder).

- **Input:** `pdf` (file)
- **Output:** Coming soon

#### `POST /api/convert/pdf-to-ppt`

Convert PDF to PPTX (placeholder).

- **Input:** `pdf` (file)
- **Output:** Coming soon

#### `POST /api/convert/pdf-to-excel`

Convert PDF to XLSX (placeholder).

- **Input:** `pdf` (file)
- **Output:** Coming soon

---

## 🤖 AI Operations (`/api/ai/...`)

All AI endpoints require `ANTHROPIC_API_KEY` in `.env`.

#### `POST /api/ai/summarize`

Summarize document content.

- **Input:** `document` (PDF file)
- **Output:** JSON: `{ summary: string }`

#### `POST /api/ai/translate`

Translate document.

- **Input:** `document` (PDF file), `targetLanguage` (string)
- **Output:** JSON: `{ translatedText: string }`

#### `POST /api/ai/extract-data`

Extract structured data.

- **Input:** `document` (PDF file), `dataType` (contact/dates/amounts/tasks/entities)
- **Output:** JSON: `{ extractedData: any }`

#### `POST /api/ai/generate-content`

Generate AI content.

- **Input:** `prompt` (string), `contentType` (optional), `document` (optional PDF file)
- **Output:** JSON: `{ content: string }`

#### `POST /api/ai/chat`

Chat with document context.

- **Input:** `message` (string), `history` (optional array), `document` (optional PDF file)
- **Output:** JSON: `{ response: string }`

#### `POST /api/ai/analyze`

Analyze document deeply.

- **Input:** `document` (PDF file), `analysisType` (optional string)
- **Output:** JSON: `{ analysis: string }`

#### `POST /api/ai/extract-tasks`

Extract action items and tasks.

- **Input:** `document` (PDF file)
- **Output:** JSON: `{ tasks: string }`

#### `POST /api/ai/fill-form`

AI-powered form filling.

- **Input:** `form` (PDF file), `dataSource` (optional PDF file)
- **Output:** JSON: `{ filledFormUrl: string }`

---

## 📝 Document Management (`/api/document/...`)

#### `POST /api/document/create`

Create new document from template.

- **Input:** JSON: `{ type, template, title, content }`
- **Output:** JSON with document metadata and file URL

#### `GET /api/document/list`

List all documents.

- **Output:** JSON: `{ documents: [] }`

#### `GET /api/document/get/:id`

Get document metadata by ID.

- **Output:** JSON with document details

#### `GET /api/document/file/:id`

Download document file.

- **Output:** Document file (PDF/DOCX/etc.)

#### `PUT /api/document/update/:id`

Update document metadata.

- **Input:** JSON with fields to update
- **Output:** Updated document metadata

#### `DELETE /api/document/delete/:id`

Delete document.

- **Output:** JSON: `{ success: true }`

---

## 📦 Dependencies

```json
{
  "express": "^5.2.1",
  "cors": "^2.8.5",
  "dotenv": "^17.2.3",
  "express-fileupload": "^1.5.2",
  "multer": "^2.0.2",
  "pdf-lib": "^1.17.1",
  "pdf-parse": "^2.4.5",
  "pdfkit": "^0.15.0",
  "sharp": "^0.33.0",
  "archiver": "^7.0.0",
  "pdf2pic": "^3.1.0",
  "@anthropic-ai/sdk": "^0.71.2",
  "uuid": "^13.0.0"
}
```

## 🚀 Deployment

### Deploy to Render.com

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your repository
4. Set environment variables:
   - `ANTHROPIC_API_KEY`
5. Deploy!

### Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create docu-assistant-backend

# Set environment variables
heroku config:set ANTHROPIC_API_KEY=your_key_here

# Deploy
git push heroku main
```

## 🧪 Testing

```bash
# Test health endpoint
curl http://localhost:3000/

# Test PDF merge (example)
curl -X POST http://localhost:3000/api/pdf/merge \
  -F "pdfs=@file1.pdf" \
  -F "pdfs=@file2.pdf" \
  --output merged.pdf

# Test AI summarize
curl -X POST http://localhost:3000/api/ai/summarize \
  -F "document=@mydoc.pdf"
```

## 📝 Notes

### Limitations

- Some endpoints are placeholders and require additional commercial APIs:

  - Word/Excel/PowerPoint conversions (both directions)
  - OCR functionality
  - Text-to-speech
  - PDF password protection (full implementation)

- For production use, consider:
  - Adding authentication/authorization
  - Implementing rate limiting
  - Using cloud storage for files
  - Adding request validation middleware
  - Implementing proper error logging

### Future Enhancements

- [ ] Add LibreOffice integration for Office conversions
- [ ] Implement Tesseract.js for OCR
- [ ] Add text-to-speech API integration
- [ ] Implement proper PDF encryption with qpdf
- [ ] Add authentication and user management
- [ ] Implement file storage with AWS S3/Azure Blob
- [ ] Add WebSocket support for real-time progress
- [ ] Create API rate limiting
- [ ] Add comprehensive test suite

## 📄 License

ISC

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📧 Support

For issues and questions, please open a GitHub issue.

---

**Built with ❤️ using Node.js, Express, pdf-lib, and Claude AI**
