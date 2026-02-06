const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

// Summarize document
router.post('/summarize', async (req, res) => {
  try {
    if (!req.files || !req.files.document) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const summary = await aiService.summarizeDocument(req.files.document);
    res.json({ summary });
  } catch (error) {
    console.error('Summarize error:', error);
    res.status(500).json({ error: 'Failed to summarize document' });
  }
});

// Translate document
router.post('/translate', async (req, res) => {
  try {
    if (!req.files || !req.files.document) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { targetLanguage } = req.body;
    const translatedText = await aiService.translateDocument(req.files.document, targetLanguage);
    res.json({ translatedText });
  } catch (error) {
    console.error('Translate error:', error);
    res.status(500).json({ error: 'Failed to translate document' });
  }
});

// Extract data
router.post('/extract-data', async (req, res) => {
  try {
    if (!req.files || !req.files.document) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { dataType } = req.body; // contact, dates, amounts, tasks, entities
    const extractedData = await aiService.extractData(req.files.document, dataType);
    res.json({ extractedData });
  } catch (error) {
    console.error('Extract data error:', error);
    res.status(500).json({ error: 'Failed to extract data' });
  }
});

// Generate content
router.post('/generate-content', async (req, res) => {
  try {
    const { prompt, contentType } = req.body;
    const documentContext = req.files ? req.files.document : null;

    const content = await aiService.generateContent(prompt, documentContext);
    res.json({ content });
  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

// Chat with document
router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    const documentFile = req.files ? req.files.document : null;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await aiService.chatWithDocument(documentFile, message, history);
    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to chat with document' });
  }
});

// Analyze document
router.post('/analyze', async (req, res) => {
  try {
    if (!req.files || !req.files.document) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { analysisType } = req.body;
    const analysis = await aiService.analyzeDocument(req.files.document, analysisType);
    res.json({ analysis });
  } catch (error) {
    console.error('Analyze error:', error);
    res.status(500).json({ error: 'Failed to analyze document' });
  }
});

// Extract tasks
router.post('/extract-tasks', async (req, res) => {
  try {
    if (!req.files || !req.files.document) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const tasks = await aiService.extractTasks(req.files.document);
    res.json({ tasks });
  } catch (error) {
    console.error('Extract tasks error:', error);
    res.status(500).json({ error: 'Failed to extract tasks' });
  }
});

// Fill form with AI
router.post('/fill-form', async (req, res) => {
  try {
    if (!req.files || !req.files.form) {
      return res.status(400).json({ error: 'No form uploaded' });
    }

    const dataSource = req.files.dataSource || null;
    const filledFormUrl = await aiService.fillForm(req.files.form, dataSource);
    res.json({ filledFormUrl });
  } catch (error) {
    console.error('Fill form error:', error);
    res.status(500).json({ error: 'Failed to fill form' });
  }
});

module.exports = router;