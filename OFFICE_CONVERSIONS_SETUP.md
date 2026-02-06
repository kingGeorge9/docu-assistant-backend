# Office Document Conversions Setup Guide

## Method 1: LibreOffice (Free, Recommended)

### Installation

#### Ubuntu/Debian

```bash
sudo apt-get update
sudo apt-get install libreoffice -y
```

#### macOS

```bash
brew install --cask libreoffice
```

#### Windows

1. Download from https://www.libreoffice.org/download/
2. Install to default location
3. Add to PATH or update `officeConversionService.js` with full path

### Verify Installation

```bash
libreoffice --version
```

### Usage in Backend

The service will automatically detect LibreOffice and use it for:

- Word → PDF
- Excel → PDF
- PowerPoint → PDF

---

## Method 2: Python Libraries for PDF → Office

### Installation

#### Install Python Dependencies

```bash
# PDF to Word
pip install pdf2docx

# PDF to Excel
pip install tabula-py pandas openpyxl java-runtime

# Note: tabula-py requires Java
```

#### Verify Python

```bash
python3 --version
python3 -c "from pdf2docx import Converter; print('pdf2docx OK')"
```

### Usage in Backend

Automatically used for:

- PDF → Word
- PDF → Excel

---

## Method 3: Commercial APIs (Most Reliable)

### Option A: CloudConvert API

**Website:** https://cloudconvert.com/api/v2

**Pricing:** Free tier: 25 conversions/day, Paid: $9/month for 500 conversions

**Setup:**

```bash
npm install cloudconvert
```

**Implementation:**

```javascript
const CloudConvert = require("cloudconvert");
const cloudConvert = new CloudConvert(process.env.CLOUDCONVERT_API_KEY);

async function wordToPDF(wordFile) {
  let job = await cloudConvert.jobs.create({
    tasks: {
      "import-file": {
        operation: "import/upload",
      },
      "convert-file": {
        operation: "convert",
        input: "import-file",
        output_format: "pdf",
      },
      "export-file": {
        operation: "export/url",
        input: "convert-file",
      },
    },
  });

  const uploadTask = job.tasks.filter((task) => task.name === "import-file")[0];
  await cloudConvert.tasks.upload(uploadTask, wordFile.data, wordFile.name);

  job = await cloudConvert.jobs.wait(job.id);

  const exportTask = job.tasks.filter((task) => task.name === "export-file")[0];
  const file = cloudConvert.tasks.getResult(exportTask);

  return file;
}
```

Add to `.env`:

```env
CLOUDCONVERT_API_KEY=your_api_key_here
```

---

### Option B: Adobe PDF Services API

**Website:** https://developer.adobe.com/document-services/apis/pdf-services/

**Pricing:** Free tier: 500 transactions/month, Paid: starting at $0.05 per transaction

**Setup:**

```bash
npm install @adobe/pdfservices-node-sdk
```

**Implementation:**

```javascript
const PDFServicesSdk = require("@adobe/pdfservices-node-sdk");

async function wordToPDF(wordFile) {
  const credentials =
    PDFServicesSdk.Credentials.servicePrincipalCredentialsBuilder()
      .withClientId(process.env.ADOBE_CLIENT_ID)
      .withClientSecret(process.env.ADOBE_CLIENT_SECRET)
      .build();

  const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);
  const createPdfOperation = PDFServicesSdk.CreatePDF.Operation.createNew();

  const input = PDFServicesSdk.FileRef.createFromStream(
    wordFile.data,
    PDFServicesSdk.CreatePDF.SupportedSourceFormat.docx
  );

  createPdfOperation.setInput(input);

  const result = await createPdfOperation.execute(executionContext);
  return await result.saveAsFile();
}
```

Add to `.env`:

```env
ADOBE_CLIENT_ID=your_client_id
ADOBE_CLIENT_SECRET=your_client_secret
```

---

### Option C: Zamzar API

**Website:** https://developers.zamzar.com/

**Pricing:** Free tier: 5 conversions/month, Paid: $10/month for 100 conversions

**Setup:**

```bash
npm install zamzar
```

**Implementation:**

```javascript
const Zamzar = require("zamzar");
const zamzar = new Zamzar(process.env.ZAMZAR_API_KEY);

async function wordToPDF(wordFile) {
  const job = await zamzar.convert({
    source_file: wordFile.data,
    target_format: "pdf",
  });

  // Wait for conversion
  await zamzar.waitForJobCompletion(job.id);

  // Download result
  const file = await zamzar.downloadFile(job.target_files[0].id);
  return file;
}
```

Add to `.env`:

```env
ZAMZAR_API_KEY=your_api_key_here
```

---

## Recommended Setup

### For Development (Free)

Use **LibreOffice** for Office → PDF conversions.

### For Production (Paid)

Use **CloudConvert** or **Adobe PDF Services** for best reliability and quality.

---

## Update Conversion Routes

Update `src/routes/convertRoutes.js`:

```javascript
const officeService = require("../services/officeConversionService");

// Word to PDF
router.post("/word-to-pdf", async (req, res) => {
  try {
    if (!req.files || !req.files.document) {
      return res.status(400).json({ error: "No document uploaded" });
    }

    const resultPdf = await officeService.wordToPDF(req.files.document);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=converted.pdf");
    res.send(resultPdf);
  } catch (error) {
    console.error("Word to PDF error:", error);
    res.status(500).json({ error: error.message });
  }
});

// PDF to Word
router.post("/pdf-to-word", async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: "No PDF uploaded" });
    }

    const resultDocx = await officeService.pdfToWord(req.files.pdf);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader("Content-Disposition", "attachment; filename=converted.docx");
    res.send(resultDocx);
  } catch (error) {
    console.error("PDF to Word error:", error);
    res.status(500).json({ error: error.message });
  }
});
```

---

## Testing

### Test LibreOffice Conversion

```bash
curl -X POST http://localhost:3000/api/convert/word-to-pdf \
  -F "document=@test.docx" \
  --output converted.pdf
```

### Check if LibreOffice is Available

```bash
# Add this endpoint to convertRoutes.js
router.get('/office-available', async (req, res) => {
  const available = await officeService.isLibreOfficeAvailable();
  res.json({
    libreOffice: available,
    message: available ? 'Office conversions ready' : 'Please install LibreOffice'
  });
});
```

---

## Troubleshooting

### LibreOffice not found

- Check installation: `which libreoffice` or `where soffice`
- Update path in `officeConversionService.js`
- On Windows, use full path: `C:\\Program Files\\LibreOffice\\program\\soffice.exe`

### Python conversions failing

- Verify Python: `python3 --version`
- Install dependencies: `pip install pdf2docx tabula-py pandas openpyxl`
- For tabula-py, install Java: `sudo apt-get install default-jre`

### Conversion timeout

- Increase timeout in service (default: 30s)
- For large files, use background jobs (Bull, Agenda)

---

## Performance Tips

1. **Use background jobs** for large files
2. **Cache converted files** temporarily
3. **Set conversion limits** (max file size)
4. **Use commercial APIs** for production reliability
5. **Implement retry logic** for failed conversions

---

## Cost Comparison

| Service            | Free Tier | Paid (Monthly)        | Best For                 |
| ------------------ | --------- | --------------------- | ------------------------ |
| LibreOffice        | Unlimited | Free                  | Development, Self-hosted |
| CloudConvert       | 25/day    | $9 (500 conversions)  | Small to medium apps     |
| Adobe PDF Services | 500/month | $0.05/transaction     | Enterprise, High quality |
| Zamzar             | 5/month   | $10 (100 conversions) | Small apps               |

---

**Recommended:** Start with LibreOffice for development, upgrade to CloudConvert or Adobe for production.
