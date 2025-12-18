const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

// Summarize document
router.post('/summarize', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const summary = await aiService.summarizeDocument(req.files.pdf);
    res.json({ summary });
  } catch (error) {
    console.error('Summarize error:', error);
    res.status(500).json({ error: 'Failed to summarize document' });
  }
});

// Translate document
router.post('/translate', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { language } = req.body;
    const translation = await aiService.translateDocument(req.files.pdf, language);
    res.json({ translation });
  } catch (error) {
    console.error('Translate error:', error);
    res.status(500).json({ error: 'Failed to translate document' });
  }
});

// Extract data
router.post('/extract-data', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { dataType } = req.body; // contact, dates, amounts, tasks, entities
    const data = await aiService.extractData(req.files.pdf, dataType);
    res.json({ data });
  } catch (error) {
    console.error('Extract data error:', error);
    res.status(500).json({ error: 'Failed to extract data' });
  }
});

// Analyze document
router.post('/analyze', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const analysis = await aiService.analyzeDocument(req.files.pdf);
    res.json({ analysis });
  } catch (error) {
    console.error('Analyze error:', error);
    res.status(500).json({ error: 'Failed to analyze document' });
  }
});

// Chat with document
router.post('/chat', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { question } = req.body;
    const answer = await aiService.chatWithDocument(req.files.pdf, question);
    res.json({ answer });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to chat with document' });
  }
});

// Extract tasks
router.post('/extract-tasks', async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const tasks = await aiService.extractTasks(req.files.pdf);
    res.json({ tasks });
  } catch (error) {
    console.error('Extract tasks error:', error);
    res.status(500).json({ error: 'Failed to extract tasks' });
  }
});

// Generate content
router.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    const documentContext = req.files ? req.files.pdf : null;

    const content = await aiService.generateContent(prompt, documentContext);
    res.json({ content });
  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

module.exports = router;