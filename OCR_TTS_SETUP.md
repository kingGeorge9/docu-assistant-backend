# OCR and Text-to-Speech Setup Guide

## OCR (Optical Character Recognition)

### Method 1: Tesseract.js (Free, Open Source)

**Best for:** Development, self-hosted, good accuracy

#### Installation

```bash
# Install Tesseract.js
npm install tesseract.js

# Already installed: pdf2pic (for converting PDF pages to images)
```

#### Usage

```javascript
const ocrService = require("./services/ocrService");

// Extract text from PDF
const result = await ocrService.extractTextFromPDF(pdfFile, "eng");

console.log(result.text); // Extracted text
console.log(result.pages); // Per-page results with confidence scores
```

#### Supported Languages

Download additional language files if needed:

```bash
# Tesseract.js automatically downloads language files on first use
# Available: eng, spa, fra, deu, ita, por, rus, chi_sim, jpn, kor, and more
```

#### Update PDF Routes

Add to `src/routes/pdfRoutes.js`:

```javascript
const ocrService = require("../services/ocrService");

// OCR endpoint
router.post("/ocr", async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { language = "eng" } = req.body;
    const result = await ocrService.extractTextFromPDF(req.files.pdf, language);

    res.json({
      text: result.text,
      pages: result.pages,
      totalPages: result.totalPages,
      language: result.language,
    });
  } catch (error) {
    console.error("OCR error:", error);
    res.status(500).json({ error: "Failed to perform OCR" });
  }
});
```

#### Test OCR

```bash
curl -X POST http://localhost:3000/api/pdf/ocr \
  -F "pdf=@scanned-document.pdf" \
  -F "language=eng"
```

---

### Method 2: Google Cloud Vision API (Commercial)

**Best for:** Production, highest accuracy, multi-language

#### Setup

```bash
npm install @google-cloud/vision
```

#### Get API Key

1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable Vision API
4. Create service account and download JSON key
5. Set environment variable:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/key.json"
```

#### Implementation

```javascript
const vision = require("@google-cloud/vision");
const client = new vision.ImageAnnotatorClient();

async function ocrWithGoogleVision(imageBuffer) {
  const [result] = await client.textDetection(imageBuffer);
  const detections = result.textAnnotations;
  return detections[0]?.description || "";
}
```

#### Pricing

- Free: 1,000 requests/month
- Paid: $1.50 per 1,000 requests

---

### Method 3: AWS Textract (Commercial)

**Best for:** Forms, tables, structured documents

#### Setup

```bash
npm install aws-sdk
```

#### Configure AWS Credentials

```bash
export AWS_ACCESS_KEY_ID="your_key"
export AWS_SECRET_ACCESS_KEY="your_secret"
export AWS_REGION="us-east-1"
```

#### Implementation

```javascript
const AWS = require("aws-sdk");
const textract = new AWS.Textract();

async function ocrWithTextract(documentBuffer) {
  const params = {
    Document: {
      Bytes: documentBuffer,
    },
  };

  const result = await textract.detectDocumentText(params).promise();
  return result.Blocks.filter((block) => block.BlockType === "LINE")
    .map((block) => block.Text)
    .join("\n");
}
```

#### Pricing

- First 1,000 pages/month: Free
- Additional: $1.50 per 1,000 pages

---

## Text-to-Speech (TTS)

### Method 1: Google Cloud Text-to-Speech (Recommended)

**Best for:** Natural voices, multiple languages, high quality

#### Setup

```bash
npm install @google-cloud/text-to-speech
```

#### Get API Key

1. Go to https://console.cloud.google.com/
2. Enable Text-to-Speech API
3. Create service account and download JSON key
4. Set environment variable:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/key.json"
```

Add to `.env`:

```env
GOOGLE_APPLICATION_CREDENTIALS=/path/to/google-cloud-key.json
```

#### Update PDF Routes

```javascript
const ttsService = require("../services/ttsService");

// Read aloud endpoint
router.post("/read-aloud", async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { language = "en-US", voiceName, speed = 1.0 } = req.body;

    const audioBuffer = await ttsService.pdfToSpeech(req.files.pdf, {
      language,
      voiceName,
      speed: parseFloat(speed),
    });

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", "attachment; filename=audio.mp3");
    res.send(audioBuffer);
  } catch (error) {
    console.error("TTS error:", error);
    res.status(500).json({ error: error.message });
  }
});
```

#### Test TTS

```bash
curl -X POST http://localhost:3000/api/pdf/read-aloud \
  -F "pdf=@document.pdf" \
  -F "language=en-US" \
  --output audio.mp3
```

#### Pricing

- Free: 1 million characters/month (WaveNet voices: 0-4M chars)
- Standard voices: $4 per 1M characters
- WaveNet voices: $16 per 1M characters

---

### Method 2: Azure Cognitive Services Speech

**Best for:** Neural voices, real-time synthesis

#### Setup

```bash
npm install microsoft-cognitiveservices-speech-sdk
```

#### Get API Key

1. Go to https://portal.azure.com/
2. Create Speech resource
3. Copy key and region

Add to `.env`:

```env
AZURE_SPEECH_KEY=your_key_here
AZURE_SPEECH_REGION=eastus
```

#### Pricing

- Free: 5 audio hours/month
- Standard: $1 per audio hour
- Neural: $15 per 1M characters

---

### Method 3: AWS Polly

**Best for:** AWS ecosystem integration

#### Setup

```bash
npm install aws-sdk
```

#### Configure

```bash
export AWS_ACCESS_KEY_ID="your_key"
export AWS_SECRET_ACCESS_KEY="your_secret"
export AWS_REGION="us-east-1"
```

#### Pricing

- Free: 5M characters/month (first 12 months)
- Standard: $4 per 1M characters
- Neural: $16 per 1M characters

---

## Quick Installation

### Install All Dependencies

```bash
# OCR
npm install tesseract.js @google-cloud/vision

# TTS
npm install @google-cloud/text-to-speech microsoft-cognitiveservices-speech-sdk aws-sdk

# Already installed: pdf2pic
```

### Python Requirements (for AWS Textract alternative)

```bash
pip install pytesseract pillow pdf2image
```

---

## Update Routes

Add to `src/routes/pdfRoutes.js`:

```javascript
const ocrService = require("../services/ocrService");
const ttsService = require("../services/ttsService");

// OCR endpoint
router.post("/ocr", async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { language = "eng" } = req.body;
    const result = await ocrService.extractTextFromPDF(req.files.pdf, language);

    res.json({
      text: result.text,
      pages: result.pages,
      totalPages: result.totalPages,
      language: result.language,
    });
  } catch (error) {
    console.error("OCR error:", error);
    res.status(500).json({ error: "Failed to perform OCR" });
  }
});

// Read aloud endpoint
router.post("/read-aloud", async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!ttsService.isConfigured()) {
      return res.status(501).json({
        error: "TTS not configured",
        message:
          "Please set up Google Cloud TTS, Azure Speech, or AWS Polly credentials",
      });
    }

    const { language = "en-US", voiceName, speed = 1.0 } = req.body;

    const audioBuffer = await ttsService.pdfToSpeech(req.files.pdf, {
      language,
      voiceName,
      speed: parseFloat(speed),
    });

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", "attachment; filename=audio.mp3");
    res.send(audioBuffer);
  } catch (error) {
    console.error("TTS error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get available TTS voices
router.get("/tts-voices", async (req, res) => {
  try {
    if (!ttsService.isConfigured()) {
      return res.json({
        configured: false,
        provider: "none",
        voices: [],
      });
    }

    const voices = await ttsService.getAvailableVoices();
    res.json({
      configured: true,
      provider: ttsService.getProvider(),
      voices,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get voices" });
  }
});

// Get supported OCR languages
router.get("/ocr-languages", (req, res) => {
  res.json({
    languages: ocrService.getSupportedLanguages(),
  });
});
```

---

## Testing

### Test OCR

```bash
# Basic OCR (English)
curl -X POST http://localhost:3000/api/pdf/ocr \
  -F "pdf=@scanned.pdf" \
  -F "language=eng"

# Spanish OCR
curl -X POST http://localhost:3000/api/pdf/ocr \
  -F "pdf=@documento.pdf" \
  -F "language=spa"
```

### Test TTS

```bash
# Generate audio from PDF
curl -X POST http://localhost:3000/api/pdf/read-aloud \
  -F "pdf=@document.pdf" \
  -F "language=en-US" \
  -F "speed=1.0" \
  --output audio.mp3

# Get available voices
curl http://localhost:3000/api/pdf/tts-voices
```

---

## Performance Tips

### OCR

1. **Reduce image size** for faster processing
2. **Process pages in parallel** for multi-page PDFs
3. **Use higher DPI** (300) for better accuracy
4. **Pre-process images** (contrast, brightness) for better results
5. **Cache results** to avoid reprocessing

### TTS

1. **Limit text length** (max 5000 chars per request)
2. **Cache audio files** for repeated requests
3. **Use streaming** for long documents
4. **Optimize voice settings** for file size vs quality
5. **Implement queue system** for background processing

---

## Cost Comparison

### OCR

| Provider              | Free Tier   | Paid Price  | Best For                  |
| --------------------- | ----------- | ----------- | ------------------------- |
| Tesseract.js          | Unlimited   | Free        | Development, Basic OCR    |
| Google Vision         | 1,000/month | $1.50/1,000 | Production, High accuracy |
| AWS Textract          | 1,000/month | $1.50/1,000 | Forms, Tables             |
| Azure Computer Vision | 5,000/month | $1/1,000    | Microsoft ecosystem       |

### TTS

| Provider         | Free Tier       | Standard | Neural | Best For           |
| ---------------- | --------------- | -------- | ------ | ------------------ |
| Google Cloud TTS | 4M chars        | $4/1M    | $16/1M | Quality, Languages |
| Azure Speech     | 0.5M chars      | $4/1M    | $16/1M | Real-time, Neural  |
| AWS Polly        | 5M chars (12mo) | $4/1M    | $16/1M | AWS integration    |

---

## Recommended Setup

### Development

- **OCR:** Tesseract.js (free, good accuracy)
- **TTS:** Google Cloud TTS (free tier sufficient)

### Production

- **OCR:** Google Cloud Vision (best accuracy)
- **TTS:** Google Cloud TTS or Azure Speech (neural voices)

---

## Troubleshooting

### Tesseract.js Issues

- **Slow processing:** Reduce image size or DPI
- **Poor accuracy:** Increase DPI to 300, pre-process images
- **Language not found:** Languages download automatically on first use

### TTS Issues

- **No audio generated:** Check API credentials
- **Poor quality:** Use neural voices, adjust speed/pitch
- **Text too long:** Split into chunks, process separately

### Google Cloud Issues

- **Authentication failed:** Check GOOGLE_APPLICATION_CREDENTIALS path
- **API not enabled:** Enable APIs in Google Cloud Console
- **Quota exceeded:** Check usage limits, upgrade plan

---

**Recommended:** Start with Tesseract.js for OCR and Google Cloud TTS for text-to-speech. Both offer excellent free tiers for development!
