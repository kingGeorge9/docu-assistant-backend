# Quick API Reference Card

Fast reference for the most commonly used endpoints.

## 🔥 Most Popular Endpoints

### PDF Operations

```bash
# Merge PDFs
POST /api/pdf/merge
Form-data: pdfs[] (multiple files)

# Split PDF
POST /api/pdf/split
Form-data: pdf (file), pageRanges (JSON: [[0,1],[2,3]])

# Compress PDF
POST /api/pdf/compress
Form-data: pdf (file)

# Rotate PDF
POST /api/pdf/rotate
Form-data: pdf (file), rotation (90/180/270)

# Add Watermark
POST /api/pdf/watermark
Form-data: pdf (file), text (string), fontSize (12), opacity (0.3)

# Get PDF Info
POST /api/pdf/info
Form-data: pdf (file)
```

### Conversions

```bash
# Image to PDF
POST /api/convert/jpg-to-pdf
Form-data: image (file)

# PDF to Images
POST /api/convert/pdf-to-png
Form-data: pdf (file)

# Text to PDF
POST /api/convert/text-to-pdf
Body JSON: { "text": "Your content" }

# PDF to Text
POST /api/convert/pdf-to-text
Form-data: pdf (file)
```

### AI Features

```bash
# Summarize Document
POST /api/ai/summarize
Form-data: document (file)
Response: { "summary": "..." }

# Chat with Document
POST /api/ai/chat
Form-data: document (file)
Body JSON: { "message": "What is this about?" }
Response: { "response": "..." }

# Extract Data
POST /api/ai/extract-data
Form-data: document (file), dataType (contact/dates/amounts)
Response: { "extractedData": {...} }

# Translate
POST /api/ai/translate
Form-data: document (file), targetLanguage ("Spanish")
Response: { "translatedText": "..." }
```

### Document Management

```bash
# Create Document
POST /api/document/create
Body JSON: {
  "type": "pdf",
  "template": "letter",
  "title": "My Document",
  "content": "Content here"
}

# List Documents
GET /api/document/list
Response: { "documents": [...] }

# Get Document
GET /api/document/get/:id

# Download Document
GET /api/document/file/:id

# Delete Document
DELETE /api/document/delete/:id
```

## 📝 Request Examples

### Using cURL

```bash
# Merge PDFs
curl -X POST http://localhost:3000/api/pdf/merge \
  -F "pdfs=@file1.pdf" \
  -F "pdfs=@file2.pdf" \
  --output merged.pdf

# Summarize
curl -X POST http://localhost:3000/api/ai/summarize \
  -F "document=@mydoc.pdf"

# Create Document
curl -X POST http://localhost:3000/api/document/create \
  -H "Content-Type: application/json" \
  -d '{
    "type": "pdf",
    "title": "My Letter",
    "template": "letter"
  }'
```

### Using JavaScript (Fetch)

```javascript
// Merge PDFs
const formData = new FormData();
formData.append("pdfs", file1);
formData.append("pdfs", file2);

const response = await fetch("http://localhost:3000/api/pdf/merge", {
  method: "POST",
  body: formData,
});

const blob = await response.blob();

// Summarize Document
const formData2 = new FormData();
formData2.append("document", pdfFile);

const response2 = await fetch("http://localhost:3000/api/ai/summarize", {
  method: "POST",
  body: formData2,
});

const { summary } = await response2.json();

// Create Document
const response3 = await fetch("http://localhost:3000/api/document/create", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    type: "pdf",
    title: "My Document",
    template: "letter",
    content: "Document content",
  }),
});

const doc = await response3.json();
```

### Using Python (requests)

```python
import requests

# Merge PDFs
files = {
    'pdfs': [
        open('file1.pdf', 'rb'),
        open('file2.pdf', 'rb')
    ]
}
response = requests.post('http://localhost:3000/api/pdf/merge', files=files)
with open('merged.pdf', 'wb') as f:
    f.write(response.content)

# Summarize
files = {'document': open('mydoc.pdf', 'rb')}
response = requests.post('http://localhost:3000/api/ai/summarize', files=files)
print(response.json()['summary'])

# Create Document
data = {
    'type': 'pdf',
    'title': 'My Document',
    'template': 'letter',
    'content': 'Content here'
}
response = requests.post('http://localhost:3000/api/document/create', json=data)
print(response.json())
```

## 🎯 Common Workflows

### Workflow 1: Process and Analyze PDF

```bash
# 1. Compress PDF first
curl -X POST http://localhost:3000/api/pdf/compress \
  -F "pdf=@large.pdf" --output compressed.pdf

# 2. Extract text
curl -X POST http://localhost:3000/api/convert/pdf-to-text \
  -F "pdf=@compressed.pdf" --output text.txt

# 3. Summarize
curl -X POST http://localhost:3000/api/ai/summarize \
  -F "document=@compressed.pdf"
```

### Workflow 2: Create Professional Document

```bash
# 1. Create base document
curl -X POST http://localhost:3000/api/document/create \
  -H "Content-Type: application/json" \
  -d '{
    "type": "pdf",
    "template": "letter",
    "title": "Business Letter"
  }' > doc.json

# 2. Get document ID
DOC_ID=$(cat doc.json | grep -o '"id":"[^"]*' | cut -d'"' -f4)

# 3. Download and enhance
curl http://localhost:3000/api/document/file/$DOC_ID --output base.pdf

# 4. Add watermark
curl -X POST http://localhost:3000/api/pdf/watermark \
  -F "pdf=@base.pdf" \
  -F "text=CONFIDENTIAL" \
  -F "opacity=0.3" --output final.pdf
```

### Workflow 3: Batch Image to PDF

```bash
# Convert multiple images to single PDF
curl -X POST http://localhost:3000/api/convert/images-to-pdf \
  -F "images=@img1.jpg" \
  -F "images=@img2.jpg" \
  -F "images=@img3.jpg" \
  --output album.pdf

# Compress result
curl -X POST http://localhost:3000/api/pdf/compress \
  -F "pdf=@album.pdf" --output album-compressed.pdf
```

## 🔧 Configuration

### Base URL

```bash
# Local Development
export API_URL="http://localhost:3000/api"

# Production
export API_URL="https://your-backend.onrender.com/api"
```

### Environment Variables

```env
PORT=3000
ANTHROPIC_API_KEY=sk-ant-xxx
NODE_ENV=development
```

## ⚡ Response Formats

### Success (File Response)

```
Content-Type: application/pdf
Content-Disposition: attachment; filename=result.pdf
Body: [Binary PDF Data]
```

### Success (JSON Response)

```json
{
  "summary": "Document summary...",
  "status": "success"
}
```

### Error Response

```json
{
  "error": "Error message here"
}
```

## 📊 Status Codes

- `200` - Success
- `400` - Bad Request (missing parameters)
- `404` - Not Found
- `500` - Server Error

## 💡 Pro Tips

1. **Always compress large PDFs first** before other operations
2. **Use batch endpoints** when processing multiple files
3. **Check file sizes** - keep under 50MB
4. **Handle errors gracefully** - implement retry logic
5. **Cache AI responses** - same document = same summary
6. **Use streaming** for large file downloads

## 🚀 Performance

### Endpoint Speed (Approximate)

- Compress: 1-2s (1MB PDF)
- Merge: 0.5-1s (2-3 PDFs)
- Convert Image: 0.5-1s
- AI Summarize: 3-10s (depends on length)
- Create Document: 0.2-0.5s

### Optimization Tips

```javascript
// Use Promise.all for parallel requests
const [compressed, info] = await Promise.all([
  fetch(`${API_URL}/pdf/compress`, {...}),
  fetch(`${API_URL}/pdf/info`, {...})
]);
```

## 🔍 Debugging

### Check Server Status

```bash
curl http://localhost:3000/health
```

### View Server Logs

```bash
# If running in terminal
# Logs appear in console

# If running as service
tail -f logs/server.log
```

### Test with Sample Files

```bash
# Create test PDF
echo "Test" | curl -X POST http://localhost:3000/api/convert/text-to-pdf \
  -d "text=Test content" --output test.pdf
```

---

**For full documentation, see README.md**

**Quick Reference v1.0** | Updated: 2025-01-01
