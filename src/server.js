const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
}));

// Routes
app.use('/api/pdf', require('./routes/pdfRoutes'));
app.use('/api/convert', require('./routes/convertRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/document', require('./routes/documentRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Docu-Assistant Backend API is running!',
    version: '1.0.0',
    endpoints: {
      pdf: '/api/pdf/*',
      convert: '/api/convert/*',
      ai: '/api/ai/*',
      document: '/api/document/*'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});