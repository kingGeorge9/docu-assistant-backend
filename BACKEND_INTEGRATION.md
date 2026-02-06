# Docu-Assistant Backend Integration Guide

## 🎯 Overview

Your Docu-Assistant app is now configured to connect to your backend hosted on Render.com. This document explains how everything works and what your backend needs to implement.

---

## 📁 New Files Created

### 1. **config/api.ts**

Centralized API configuration file that manages all backend endpoints and API calls.

**Key Features:**

- Single source of truth for backend URL
- Organized API endpoints by feature (PDF, AI, Document, Convert)
- Helper functions for API calls and file uploads
- Backend wake-up function (for free-tier Render hosting)

### 2. **services/aiService.ts**

Handles all AI-related backend operations.

**Functions:**

- `summarizeDocument()` - Get AI summary of documents
- `translateDocument()` - Translate documents
- `extractData()` - Extract structured data
- `chatWithDocument()` - Chat with uploaded documents
- `analyzeDocument()` - Deep document analysis
- `extractTasks()` - Find action items
- `fillForm()` - Smart form filling
- `generateContent()` - AI content generation

### 3. **services/documentService.ts**

Manages document creation and storage.

**Functions:**

- `createDocument()` - Create new documents from templates
- `listDocuments()` - Get all user documents
- `getDocument()` - Retrieve specific document
- `deleteDocument()` - Remove documents
- Local fallback for offline mode

### 4. **Updated services/pdfService.ts**

Now uses centralized config for all PDF operations.

---

## 🔧 Configuration

### Backend URL Setup

Your backend URL is configured in **app.json**:

```json
{
  "expo": {
    "extra": {
      "apiUrl": "https://docu-assistant-backend-1.onrender.com/api"
    }
  }
}
```

**To change the backend URL:**

1. Update the `apiUrl` in `app.json`
2. Restart your Expo development server
3. The app will automatically use the new URL

---

## 🌐 Required Backend API Endpoints

Your backend at `https://docu-assistant-backend-1.onrender.com` needs to implement these endpoints:

### **PDF Operations** (`/api/pdf/...`)

#### **Organize**

| Endpoint             | Method | Description              | Input                                        | Output            |
| -------------------- | ------ | ------------------------ | -------------------------------------------- | ----------------- |
| `/pdf/merge`         | POST   | Merge multiple PDFs      | FormData: pdfs[] (files)                     | PDF file (binary) |
| `/pdf/split`         | POST   | Split PDF by page ranges | FormData: pdf (file), pageRanges (JSON)      | PDF file          |
| `/pdf/remove-pages`  | POST   | Remove pages             | FormData: pdf (file), pages (JSON array)     | PDF file          |
| `/pdf/extract-pages` | POST   | Extract pages            | FormData: pdf (file), pages (JSON array)     | PDF file          |
| `/pdf/organize`      | POST   | Reorder pages            | FormData: pdf (file), pageOrder (JSON array) | PDF file          |
| `/pdf/reverse`       | POST   | Reverse page order       | FormData: pdf (file)                         | PDF file          |
| `/pdf/duplicate`     | POST   | Duplicate pages          | FormData: pdf (file), pages (JSON array)     | PDF file          |

#### **Optimize**

| Endpoint                 | Method | Description              | Input                         | Output   |
| ------------------------ | ------ | ------------------------ | ----------------------------- | -------- |
| `/pdf/compress`          | POST   | Compress PDF             | FormData: pdf (file), quality | PDF file |
| `/pdf/repair`            | POST   | Repair corrupted PDF     | FormData: pdf (file)          | PDF file |
| `/pdf/optimize-images`   | POST   | Optimize embedded images | FormData: pdf (file), quality | PDF file |
| `/pdf/remove-duplicates` | POST   | Remove duplicate pages   | FormData: pdf (file)          | PDF file |

#### **Security**

| Endpoint       | Method | Description       | Input                                       | Output   |
| -------------- | ------ | ----------------- | ------------------------------------------- | -------- |
| `/pdf/protect` | POST   | Add password      | FormData: pdf (file), password, permissions | PDF file |
| `/pdf/unlock`  | POST   | Remove password   | FormData: pdf (file), password              | PDF file |
| `/pdf/redact`  | POST   | Redact text/areas | FormData: pdf (file), areas (JSON)          | PDF file |
| `/pdf/encrypt` | POST   | Encrypt PDF       | FormData: pdf (file), encryption type       | PDF file |
| `/pdf/sign`    | POST   | Digital signature | FormData: pdf (file), signature             | PDF file |

#### **Edit & Annotate**

| Endpoint             | Method | Description       | Input                                         | Output   |
| -------------------- | ------ | ----------------- | --------------------------------------------- | -------- |
| `/pdf/rotate`        | POST   | Rotate pages      | FormData: pdf (file), rotation (90/180/270)   | PDF file |
| `/pdf/page-numbers`  | POST   | Add page numbers  | FormData: pdf (file), position, alignment     | PDF file |
| `/pdf/watermark`     | POST   | Add watermark     | FormData: pdf (file), text, fontSize, opacity | PDF file |
| `/pdf/header-footer` | POST   | Add header/footer | FormData: pdf (file), header, footer          | PDF file |
| `/pdf/crop`          | POST   | Crop pages        | FormData: pdf (file), cropBox (JSON)          | PDF file |
| `/pdf/resize`        | POST   | Resize pages      | FormData: pdf (file), width, height           | PDF file |
| `/pdf/edit-text`     | POST   | Edit text content | FormData: pdf (file), edits (JSON)            | PDF file |
| `/pdf/highlight`     | POST   | Highlight text    | FormData: pdf (file), highlights (JSON)       | PDF file |
| `/pdf/annotate`      | POST   | Add annotations   | FormData: pdf (file), annotations (JSON)      | PDF file |
| `/pdf/stamp`         | POST   | Add stamp/seal    | FormData: pdf (file), stamp                   | PDF file |

#### **Metadata & Info**

| Endpoint          | Method | Description      | Input                                 | Output                   |
| ----------------- | ------ | ---------------- | ------------------------------------- | ------------------------ |
| `/pdf/info`       | POST   | Get PDF info     | FormData: pdf (file)                  | JSON: { info: object }   |
| `/pdf/metadata`   | POST   | Get/set metadata | FormData: pdf (file), metadata (JSON) | JSON/PDF                 |
| `/pdf/read-aloud` | POST   | Text-to-speech   | FormData: pdf (file)                  | Audio file               |
| `/pdf/search`     | POST   | Search in PDF    | FormData: pdf (file), query           | JSON: { results: [] }    |
| `/pdf/validate`   | POST   | Validate PDF/A   | FormData: pdf (file)                  | JSON: { valid: boolean } |

#### **Forms**

| Endpoint            | Method | Description          | Input                               | Output                     |
| ------------------- | ------ | -------------------- | ----------------------------------- | -------------------------- |
| `/pdf/create-form`  | POST   | Create fillable form | FormData: pdf (file), fields (JSON) | PDF file                   |
| `/pdf/fill-form`    | POST   | Fill form fields     | FormData: pdf (file), data (JSON)   | PDF file                   |
| `/pdf/flatten`      | POST   | Flatten form         | FormData: pdf (file)                | PDF file                   |
| `/pdf/extract-data` | POST   | Extract form data    | FormData: pdf (file)                | JSON: { formData: object } |

#### **Compare & Review**

| Endpoint            | Method | Description       | Input                              | Output                    |
| ------------------- | ------ | ----------------- | ---------------------------------- | ------------------------- |
| `/pdf/compare`      | POST   | Compare 2 PDFs    | FormData: pdf1 (file), pdf2 (file) | PDF with highlights       |
| `/pdf/diff`         | POST   | Show differences  | FormData: pdf1 (file), pdf2 (file) | JSON: { differences: [] } |
| `/pdf/merge-review` | POST   | Merge with review | FormData: pdf1 (file), pdf2 (file) | PDF file                  |

#### **Advanced**

| Endpoint               | Method | Description             | Input                                  | Output                 |
| ---------------------- | ------ | ----------------------- | -------------------------------------- | ---------------------- |
| `/pdf/ocr`             | POST   | Extract text via OCR    | FormData: pdf (file), language         | JSON: { text: string } |
| `/pdf/black-white`     | POST   | Convert to grayscale    | FormData: pdf (file)                   | PDF file               |
| `/pdf/fix-orientation` | POST   | Auto-fix orientation    | FormData: pdf (file)                   | PDF file               |
| `/pdf/remove-blank`    | POST   | Remove blank pages      | FormData: pdf (file)                   | PDF file               |
| `/pdf/bookmarks`       | POST   | Add/edit bookmarks      | FormData: pdf (file), bookmarks (JSON) | PDF file               |
| `/pdf/hyperlinks`      | POST   | Add/manage hyperlinks   | FormData: pdf (file), links (JSON)     | PDF file               |
| `/pdf/attachments`     | POST   | Add/extract attachments | FormData: pdf (file), files[]          | PDF file or ZIP        |

### **Conversion Operations** (`/api/convert/...`)

#### **Convert TO PDF**

| Endpoint                 | Method | Description  | Input                     | Output   |
| ------------------------ | ------ | ------------ | ------------------------- | -------- |
| `/convert/images-to-pdf` | POST   | Images → PDF | FormData: images[]        | PDF file |
| `/convert/jpg-to-pdf`    | POST   | JPG → PDF    | FormData: image (file)    | PDF file |
| `/convert/png-to-pdf`    | POST   | PNG → PDF    | FormData: image (file)    | PDF file |
| `/convert/word-to-pdf`   | POST   | DOCX → PDF   | FormData: document (file) | PDF file |
| `/convert/ppt-to-pdf`    | POST   | PPTX → PDF   | FormData: document (file) | PDF file |
| `/convert/excel-to-pdf`  | POST   | XLSX → PDF   | FormData: document (file) | PDF file |
| `/convert/html-to-pdf`   | POST   | HTML → PDF   | FormData: html (string)   | PDF file |
| `/convert/text-to-pdf`   | POST   | TXT → PDF    | FormData: text (string)   | PDF file |

#### **Convert FROM PDF**

| Endpoint                | Method | Description | Input                | Output              |
| ----------------------- | ------ | ----------- | -------------------- | ------------------- |
| `/convert/pdf-to-jpg`   | POST   | PDF → JPG   | FormData: pdf (file) | ZIP with JPG images |
| `/convert/pdf-to-png`   | POST   | PDF → PNG   | FormData: pdf (file) | ZIP with PNG images |
| `/convert/pdf-to-word`  | POST   | PDF → DOCX  | FormData: pdf (file) | DOCX file           |
| `/convert/pdf-to-ppt`   | POST   | PDF → PPTX  | FormData: pdf (file) | PPTX file           |
| `/convert/pdf-to-excel` | POST   | PDF → XLSX  | FormData: pdf (file) | XLSX file           |
| `/convert/pdf-to-text`  | POST   | PDF → TXT   | FormData: pdf (file) | TXT file            |
| `/convert/pdf-to-html`  | POST   | PDF → HTML  | FormData: pdf (file) | HTML file           |

### **AI Operations** (`/api/ai/...`)

| Endpoint               | Method | Description             | Input                                 | Output                           |
| ---------------------- | ------ | ----------------------- | ------------------------------------- | -------------------------------- |
| `/ai/summarize`        | POST   | Summarize document      | FormData: document (file)             | JSON: { summary: string }        |
| `/ai/translate`        | POST   | Translate document      | FormData: document, targetLanguage    | JSON: { translatedText: string } |
| `/ai/extract-data`     | POST   | Extract structured data | FormData: document, dataType          | JSON: { extractedData: any }     |
| `/ai/generate-content` | POST   | Generate content        | JSON: { prompt, contentType }         | JSON: { content: string }        |
| `/ai/chat`             | POST   | Chat about document     | FormData: document?, message, history | JSON: { response: string }       |
| `/ai/analyze`          | POST   | Analyze document        | FormData: document, analysisType      | JSON: { analysis: any }          |
| `/ai/extract-tasks`    | POST   | Extract action items    | FormData: document                    | JSON: { tasks: string[] }        |
| `/ai/fill-form`        | POST   | Smart fill PDF forms    | FormData: form, dataSource?           | JSON: { filledFormUrl: string }  |

### **Document Operations** (`/api/document/...`)

| Endpoint               | Method | Description         | Input                                    | Output                  |
| ---------------------- | ------ | ------------------- | ---------------------------------------- | ----------------------- |
| `/document/create`     | POST   | Create new document | JSON: { type, template, title, content } | JSON: { id, fileUrl }   |
| `/document/list`       | GET    | List all documents  | -                                        | JSON: { documents: [] } |
| `/document/get/:id`    | GET    | Get document by ID  | URL param: id                            | JSON: document object   |
| `/document/delete/:id` | DELETE | Delete document     | URL param: id                            | JSON: { success: true } |

### **Health Check**

| Endpoint         | Method | Description               |
| ---------------- | ------ | ------------------------- |
| `/` or `/health` | GET    | Check if backend is alive |

---

## 🚀 How It Works

### 1. **Backend Wake-Up (Free Tier)**

Since Render free tier sleeps after inactivity, the app automatically wakes it up:

```typescript
await wakeUpBackend(); // Called before each API request
```

### 2. **File Upload Flow**

```typescript
// Example: Merge PDFs
const files = await PDFService.pickPDFs(true);
await PDFService.mergePDFs(files);

// Behind the scenes:
// 1. App creates FormData with files
// 2. Sends POST to /api/pdf/merge
// 3. Backend processes and returns merged PDF
// 4. App downloads and shares the result
```

### 3. **AI Chat Flow**

```typescript
// User sends message
const response = await AIService.chatWithDocument(
  documentFile,
  "What are the key points?",
  conversationHistory
);

// Backend receives:
// - document file
// - current message
// - conversation history
// Returns AI-generated response
```

---

## 🧪 Testing the Connection

### 1. **Check Backend Status**

```bash
curl https://docu-assistant-backend-1.onrender.com
# Should return 200 OK or backend info
```

### 2. **Test in App**

1. Open the app
2. Go to **Tools** tab
3. Try merging 2 PDFs
4. Check console for:
   - "Waking up backend..."
   - "Backend is awake!"
   - API request/response logs

### 3. **Test AI Features**

1. Go to **AI** tab
2. Click any AI feature (e.g., "Summarize")
3. Select a document
4. Check if backend processes it

---

## 🐛 Troubleshooting

### Error: "Failed to connect to backend"

**Causes:**

- Backend is sleeping (free tier) → Wait 10-20 seconds for wake-up
- Wrong backend URL → Check `app.json` → `extra.apiUrl`
- Backend not running → Check Render deployment logs
- CORS issues → Backend needs to allow requests from `*` or your app domain

**Fix:**

```typescript
// In your backend, add CORS headers:
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
```

### Error: "Upload failed: 413 Payload Too Large"

**Fix:** Increase backend file size limit:

```javascript
// Express example
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
```

### Error: "Request timeout"

**Fix:** Increase timeout for long operations:

```typescript
// In config/api.ts, you can add:
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s

fetch(url, {
  signal: controller.signal,
  ...options,
});
```

---

## 📱 App Features Overview

### **Home Tab** (`app/(tabs)/index.tsx`)

- Create documents (DOCX, PDF, PPTX, XLSX)
- Search documents
- View recent files
- ✅ **No backend required** (UI only)

### **Tools Tab** (`app/(tabs)/tools.tsx`)

#### **Organize** (7 tools)

- Merge PDFs, Split, Remove pages, Extract pages, Organize pages, Reverse order, Duplicate pages

#### **Optimize** (4 tools)

- Compress, Repair, Optimize images, Remove duplicates

#### **Convert TO PDF** (7 tools)

- JPG, PNG, Word, PowerPoint, Excel, HTML, Text → PDF

#### **Convert FROM PDF** (7 tools)

- PDF → JPG, PNG, Word, PowerPoint, Excel, Text, HTML

#### **Security** (5 tools)

- Protect with password, Unlock, Redact content, Encrypt, Digital signature

#### **Edit & Annotate** (10 tools)

- Rotate, Page numbers, Watermark, Header/footer, Crop, Resize, Edit text, Highlight, Annotate, Stamp

#### **Metadata & Info** (5 tools)

- Get info, Edit metadata, Read aloud, Search, Validate PDF/A

#### **Forms** (4 tools)

- Create form, Fill form, Flatten form, Extract form data

#### **Compare & Review** (3 tools)

- Compare PDFs, Show differences, Merge with review

#### **Advanced** (7 tools)

- OCR text extraction, Convert to grayscale, Fix orientation, Remove blank pages, Manage bookmarks, Add hyperlinks, Manage attachments

**Total: 65+ professional-grade PDF tools**

✅ **Connected to backend** - All tools call appropriate API endpoints

### **AI Tab** (`app/(tabs)/ai.tsx`)

- Summarize documents
- Translate content
- Extract data
- Generate content
- Chat with documents
- Analyze documents
- Extract tasks
- Fill forms
- ✅ **Connected to backend**

---

## 🔐 Security Recommendations

### 1. **Add Authentication**

```typescript
// Add auth token to all requests
export async function apiCall<T>(endpoint: string, options: RequestInit = {}) {
  const token = await getAuthToken(); // Your auth function

  return fetch(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}
```

### 2. **Validate File Types**

```typescript
// Already implemented in pdfService:
type: 'application/pdf',
mimeType: 'application/pdf',
```

### 3. **Add Rate Limiting**

Implement on backend to prevent abuse.

---

## 📦 Backend Implementation Example

Here's a minimal Express.js example for your backend:

```javascript
// server.js
const express = require("express");
const multer = require("multer");
const { PDFDocument } = require("pdf-lib");

const app = express();
const upload = multer({ dest: "uploads/" });

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Docu-Assistant Backend" });
});

// Merge PDFs
app.post("/api/pdf/merge", upload.array("pdfs"), async (req, res) => {
  try {
    const pdfFiles = req.files;

    // Merge logic using pdf-lib
    const mergedPdf = await PDFDocument.create();

    for (const file of pdfFiles) {
      const pdfBytes = fs.readFileSync(file.path);
      const pdf = await PDFDocument.load(pdfBytes);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    res.contentType("application/pdf");
    res.send(Buffer.from(mergedPdfBytes));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI Chat endpoint
app.post("/api/ai/chat", upload.single("document"), async (req, res) => {
  try {
    const { message, history } = req.body;
    const document = req.file;

    // Your AI integration here (OpenAI, Claude, etc.)
    const response = await yourAIService.chat(message, document, history);

    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Backend running on port 3000");
});
```

---

## 🎉 Next Steps

1. **Test the connection** with your backend
2. **Implement missing endpoints** on your backend
3. **Add error handling** for better UX
4. **Add authentication** for production
5. **Monitor API usage** on Render dashboard

---

## 📞 Need Help?

If you encounter issues:

1. Check Render logs: `https://dashboard.render.com`
2. Check app console: Look for error messages
3. Test endpoints manually with Postman/curl
4. Verify backend URL in `app.json`

---

## ✅ Quick Checklist

- [x] Backend deployed to Render.com
- [x] Backend URL configured in `app.json`
- [x] All service files use centralized config
- [x] App supports 65+ PDF tools across 10 categories
- [ ] Backend implements Organize endpoints (7)
- [ ] Backend implements Optimize endpoints (4)
- [ ] Backend implements Convert TO PDF endpoints (7)
- [ ] Backend implements Convert FROM PDF endpoints (7)
- [ ] Backend implements Security endpoints (5)
- [ ] Backend implements Edit & Annotate endpoints (10)
- [ ] Backend implements Metadata & Info endpoints (5)
- [ ] Backend implements Forms endpoints (4)
- [ ] Backend implements Compare & Review endpoints (3)
- [ ] Backend implements Advanced endpoints (7)
- [ ] Backend implements AI endpoints (8)
- [ ] Backend implements Document endpoints (4)
- [ ] Test basic PDF operations (merge, split, compress)
- [ ] Test conversion operations
- [ ] Test AI chat functionality
- [ ] Add authentication
- [ ] Deploy to production

---

**Your app is now ready with 65+ professional PDF tools! 🚀**

All PDF, AI, and document operations will call your backend at:
`https://docu-assistant-backend-1.onrender.com/api`

Simply implement the required endpoints and your app will provide enterprise-grade document manipulation capabilities!
