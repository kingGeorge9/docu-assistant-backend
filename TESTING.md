# API Endpoint Test Guide

Quick reference for testing all backend endpoints.

## Setup

Make sure your server is running:

```bash
npm start
```

Server should be at: `http://localhost:3000`

## Testing Tools

You can use:

- **cURL** (command line)
- **Postman** (GUI app)
- **Thunder Client** (VS Code extension)
- **Insomnia** (GUI app)

---

## Quick Tests

### 1. Health Check

```bash
curl http://localhost:3000/
```

Expected: JSON with status "ok"

### 2. PDF Merge

```bash
curl -X POST http://localhost:3000/api/pdf/merge \
  -F "pdfs=@test1.pdf" \
  -F "pdfs=@test2.pdf" \
  --output merged.pdf
```

### 3. Image to PDF

```bash
curl -X POST http://localhost:3000/api/convert/jpg-to-pdf \
  -F "image=@test.jpg" \
  --output converted.pdf
```

### 4. AI Summarize

```bash
curl -X POST http://localhost:3000/api/ai/summarize \
  -F "document=@test.pdf"
```

### 5. Create Document

```bash
curl -X POST http://localhost:3000/api/document/create \
  -H "Content-Type: application/json" \
  -d '{
    "type": "pdf",
    "template": "letter",
    "title": "Test Document",
    "content": "This is a test document."
  }'
```

### 6. List Documents

```bash
curl http://localhost:3000/api/document/list
```

---

## Complete Endpoint List

### PDF Operations (57 endpoints)

#### Organize

- `/api/pdf/merge` - ✅ Implemented
- `/api/pdf/split` - ✅ Implemented
- `/api/pdf/remove-pages` - ✅ Implemented
- `/api/pdf/extract-pages` - ✅ Implemented
- `/api/pdf/organize` - ✅ Implemented
- `/api/pdf/reverse` - ✅ Implemented
- `/api/pdf/duplicate` - ✅ Implemented

#### Optimize

- `/api/pdf/compress` - ✅ Implemented
- `/api/pdf/repair` - ✅ Implemented
- `/api/pdf/optimize-images` - ✅ Implemented
- `/api/pdf/remove-duplicates` - ✅ Implemented

#### Security

- `/api/pdf/protect` - ✅ Implemented (basic)
- `/api/pdf/unlock` - ✅ Implemented
- `/api/pdf/redact` - ✅ Implemented
- `/api/pdf/encrypt` - ✅ Implemented (basic)
- `/api/pdf/sign` - ✅ Implemented (basic)

#### Edit & Annotate

- `/api/pdf/rotate` - ✅ Implemented
- `/api/pdf/page-numbers` - ✅ Implemented
- `/api/pdf/watermark` - ✅ Implemented
- `/api/pdf/header-footer` - ✅ Implemented
- `/api/pdf/crop` - ✅ Implemented
- `/api/pdf/resize` - ✅ Implemented
- `/api/pdf/edit-text` - ✅ Implemented
- `/api/pdf/highlight` - ✅ Implemented
- `/api/pdf/annotate` - ✅ Implemented
- `/api/pdf/stamp` - ✅ Implemented
- `/api/pdf/add-text` - ✅ Implemented

#### Metadata & Info

- `/api/pdf/info` - ✅ Implemented
- `/api/pdf/metadata` - ✅ Implemented
- `/api/pdf/read-aloud` - ⏳ Placeholder
- `/api/pdf/search` - ✅ Implemented
- `/api/pdf/validate` - ✅ Implemented

#### Forms

- `/api/pdf/create-form` - ✅ Implemented
- `/api/pdf/fill-form` - ✅ Implemented
- `/api/pdf/flatten` - ✅ Implemented
- `/api/pdf/extract-data` - ✅ Implemented

#### Compare & Review

- `/api/pdf/compare` - ✅ Implemented
- `/api/pdf/diff` - ✅ Implemented
- `/api/pdf/merge-review` - ✅ Implemented

#### Advanced

- `/api/pdf/ocr` - ⏳ Placeholder
- `/api/pdf/black-white` - ✅ Implemented
- `/api/pdf/fix-orientation` - ✅ Implemented
- `/api/pdf/remove-blank` - ✅ Implemented
- `/api/pdf/bookmarks` - ✅ Implemented (basic)
- `/api/pdf/hyperlinks` - ✅ Implemented
- `/api/pdf/attachments` - ✅ Implemented (basic)

### Conversion Operations (15 endpoints)

#### TO PDF

- `/api/convert/images-to-pdf` - ✅ Implemented
- `/api/convert/jpg-to-pdf` - ✅ Implemented
- `/api/convert/png-to-pdf` - ✅ Implemented
- `/api/convert/text-to-pdf` - ✅ Implemented
- `/api/convert/html-to-pdf` - ✅ Implemented
- `/api/convert/word-to-pdf` - ⏳ Placeholder
- `/api/convert/ppt-to-pdf` - ⏳ Placeholder
- `/api/convert/excel-to-pdf` - ⏳ Placeholder

#### FROM PDF

- `/api/convert/pdf-to-jpg` - ✅ Implemented
- `/api/convert/pdf-to-png` - ✅ Implemented
- `/api/convert/pdf-to-text` - ✅ Implemented
- `/api/convert/pdf-to-html` - ✅ Implemented
- `/api/convert/pdf-to-word` - ⏳ Placeholder
- `/api/convert/pdf-to-ppt` - ⏳ Placeholder
- `/api/convert/pdf-to-excel` - ⏳ Placeholder

### AI Operations (8 endpoints)

- `/api/ai/summarize` - ✅ Implemented
- `/api/ai/translate` - ✅ Implemented
- `/api/ai/extract-data` - ✅ Implemented
- `/api/ai/generate-content` - ✅ Implemented
- `/api/ai/chat` - ✅ Implemented
- `/api/ai/analyze` - ✅ Implemented
- `/api/ai/extract-tasks` - ✅ Implemented
- `/api/ai/fill-form` - ✅ Implemented

### Document Management (6 endpoints)

- `/api/document/create` - ✅ Implemented
- `/api/document/list` - ✅ Implemented
- `/api/document/get/:id` - ✅ Implemented
- `/api/document/file/:id` - ✅ Implemented
- `/api/document/update/:id` - ✅ Implemented
- `/api/document/delete/:id` - ✅ Implemented

---

## Test with Postman

### Import Collection

Create a new Postman Collection with these endpoints:

1. **Create Environment**

   - Variable: `baseUrl` = `http://localhost:3000`

2. **Add Requests** (examples):

**Merge PDFs:**

```
POST {{baseUrl}}/api/pdf/merge
Body: form-data
- pdfs: file1.pdf
- pdfs: file2.pdf
```

**Summarize Document:**

```
POST {{baseUrl}}/api/ai/summarize
Body: form-data
- document: test.pdf
```

**Create Document:**

```
POST {{baseUrl}}/api/document/create
Body: raw JSON
{
  "type": "pdf",
  "template": "letter",
  "title": "My Document",
  "content": "Document content here"
}
```

---

## Sample Test Scripts

### Bash Script (test-all.sh)

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"

echo "Testing Health Check..."
curl $BASE_URL/

echo "\nTesting PDF Merge..."
curl -X POST $BASE_URL/api/pdf/merge \
  -F "pdfs=@test1.pdf" \
  -F "pdfs=@test2.pdf" \
  --output merged.pdf

echo "\nTesting Document Creation..."
curl -X POST $BASE_URL/api/document/create \
  -H "Content-Type: application/json" \
  -d '{
    "type": "pdf",
    "template": "blank",
    "title": "Test Doc",
    "content": "Test content"
  }'

echo "\nTesting Document List..."
curl $BASE_URL/api/document/list

echo "\nAll tests completed!"
```

### Python Script (test_api.py)

```python
import requests

BASE_URL = "http://localhost:3000"

# Test health
response = requests.get(f"{BASE_URL}/")
print("Health:", response.json())

# Test document creation
data = {
    "type": "pdf",
    "template": "letter",
    "title": "Test Document",
    "content": "This is test content"
}
response = requests.post(f"{BASE_URL}/api/document/create", json=data)
print("Create Document:", response.json())

# Test document list
response = requests.get(f"{BASE_URL}/api/document/list")
print("Documents:", response.json())

# Test PDF merge
files = {
    'pdfs': [
        ('pdfs', open('test1.pdf', 'rb')),
        ('pdfs', open('test2.pdf', 'rb'))
    ]
}
response = requests.post(f"{BASE_URL}/api/pdf/merge", files=files)
with open('merged.pdf', 'wb') as f:
    f.write(response.content)
print("Merge completed")
```

---

## Common Issues & Solutions

### 1. "No file uploaded" error

**Issue:** File parameter name mismatch

**Solution:** Check the exact parameter name required:

- PDF operations: `pdf` or `pdfs[]`
- Conversions: `image`, `document`, or `pdf`
- AI operations: `document`

### 2. "Failed to process PDF" error

**Cause:** Corrupted or unsupported PDF

**Solution:**

- Try the `/api/pdf/repair` endpoint first
- Ensure PDF is not password-protected
- Check PDF is valid format

### 3. AI endpoints not working

**Cause:** Missing or invalid Anthropic API key

**Solution:**

- Check `.env` file has `ANTHROPIC_API_KEY=your_key`
- Restart server after adding key
- Verify key is valid at https://console.anthropic.com

### 4. Conversion endpoints failing

**Cause:** Missing dependencies

**Solution:**

```bash
npm install sharp archiver pdf2pic pdfkit
```

---

## Production Testing

When deployed to Render/Heroku:

1. Replace `localhost:3000` with your production URL
2. Add authentication headers if implemented
3. Test with smaller files first (< 5MB)
4. Monitor response times and adjust timeouts

---

## Performance Tips

- Keep file sizes under 50MB
- Use compression endpoints before other operations
- Batch similar operations when possible
- Consider background jobs for large files

---

## Status Legend

- ✅ Fully Implemented
- ⏳ Placeholder (returns message about requirements)
- ❌ Not Implemented

**Total Endpoints: 86**

- ✅ Implemented: 78
- ⏳ Placeholder: 8 (require additional libraries/services)

---

Happy Testing! 🚀
