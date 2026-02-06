# Quick Start Guide for Placeholder Endpoints

## 🎯 What Are These?

The 8 "placeholder" endpoints are features that require additional setup:

- **Office conversions** (Word/Excel/PowerPoint ↔ PDF)
- **OCR** (Extract text from scanned PDFs)
- **Text-to-Speech** (Convert PDF to audio)

## ⚡ Quick Setup (5 Minutes)

### Option 1: Automated Setup (Linux/macOS)

```bash
# Run the setup script
chmod +x setup-placeholders.sh
./setup-placeholders.sh
```

The script will guide you through:

1. Office conversion setup (LibreOffice or CloudConvert)
2. OCR setup (Tesseract.js + optional Google Vision)
3. Text-to-Speech setup (Google/Azure/AWS)

### Option 2: Manual Setup

#### Step 1: Office Conversions (Free)

```bash
# Install LibreOffice
# Ubuntu/Debian
sudo apt-get install libreoffice

# macOS
brew install --cask libreoffice

# Windows: Download from https://www.libreoffice.org/download/
```

#### Step 2: OCR (Free)

```bash
# Install Tesseract.js
npm install tesseract.js
```

#### Step 3: Text-to-Speech (Free Tier)

```bash
# Install Google Cloud TTS
npm install @google-cloud/text-to-speech

# Setup Google Cloud (one-time)
# 1. Go to https://console.cloud.google.com/
# 2. Create project
# 3. Enable Text-to-Speech API
# 4. Create service account → Download JSON key
# 5. Set environment variable:
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/key.json"
```

Add to `.env`:

```env
GOOGLE_APPLICATION_CREDENTIALS=/path/to/google-cloud-key.json
```

## 🧪 Test It Works

```bash
# Test OCR
curl -X POST http://localhost:3000/api/pdf/ocr \
  -F "pdf=@scanned-document.pdf" \
  -F "language=eng"

# Test Text-to-Speech
curl -X POST http://localhost:3000/api/pdf/read-aloud \
  -F "pdf=@document.pdf" \
  --output audio.mp3

# Test Office Conversion
curl -X POST http://localhost:3000/api/convert/word-to-pdf \
  -F "document=@test.docx" \
  --output converted.pdf
```

## 💰 Costs

### Development (Free)

- **Office:** LibreOffice (free)
- **OCR:** Tesseract.js (free)
- **TTS:** Google Cloud (1M chars/month free)
- **Total: $0/month**

### Production (Recommended)

- **Office:** CloudConvert ($9/month for 500 conversions)
- **OCR:** Tesseract.js (free) or Google Vision ($1.50/1000)
- **TTS:** Google Cloud (free tier usually sufficient)
- **Total: ~$9-15/month**

## 📚 Detailed Documentation

- **Office Conversions:** `OFFICE_CONVERSIONS_SETUP.md`
- **OCR & Text-to-Speech:** `OCR_TTS_SETUP.md`
- **Complete Solutions:** `PLACEHOLDER_SOLUTIONS.md`

## 🚀 Production Ready

All solutions are production-ready with proper error handling, caching, and optimization.

## ❓ FAQ

**Q: Do I need all three?**
A: No! Set up only what you need. Each feature is independent.

**Q: What if I don't want to pay?**
A: Use the free options:

- LibreOffice for Office conversions (unlimited)
- Tesseract.js for OCR (unlimited)
- Google Cloud TTS free tier (1M chars/month)

**Q: Which is fastest?**
A: Paid cloud APIs are faster (2-3x), but free options work great for most use cases.

**Q: Can I switch providers later?**
A: Yes! The backend is designed to support multiple providers. Just update environment variables.

## ✅ Quick Checklist

- [ ] Install LibreOffice (or set up CloudConvert)
- [ ] Install Tesseract.js: `npm install tesseract.js`
- [ ] Set up Google Cloud TTS (or Azure/AWS)
- [ ] Update `.env` with credentials
- [ ] Test endpoints
- [ ] Deploy to production

## 🎉 Done!

All 86 endpoints are now fully functional! 🚀

Need help? Check the detailed guides or create an issue on GitHub.
