const express = require('express');
const router = express.Router();
const documentService = require('../services/documentService');

// Create a new document
router.post('/create', async (req, res) => {
  try {
    const { type, template, title, content } = req.body;

    if (!type) {
      return res.status(400).json({ error: 'Document type is required' });
    }

    const document = await documentService.createDocument(
      type,
      template || 'blank',
      title || 'Untitled Document',
      content || ''
    );

    res.json(document);
  } catch (error) {
    console.error('Create document error:', error);
    res.status(500).json({ error: error.message || 'Failed to create document' });
  }
});

// List all documents
router.get('/list', async (req, res) => {
  try {
    const documents = await documentService.listDocuments();
    res.json({ documents });
  } catch (error) {
    console.error('List documents error:', error);
    res.status(500).json({ error: 'Failed to list documents' });
  }
});

// Get a specific document (metadata)
router.get('/get/:id', async (req, res) => {
  try {
    const document = await documentService.getDocument(req.params.id);
    res.json(document);
  } catch (error) {
    console.error('Get document error:', error);
    res.status(404).json({ error: 'Document not found' });
  }
});

// Get document file (download)
router.get('/file/:id', async (req, res) => {
  try {
    const { buffer, metadata } = await documentService.getDocumentFile(req.params.id);
    
    res.setHeader('Content-Type', metadata.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename=${metadata.fileName}`);
    res.send(buffer);
  } catch (error) {
    console.error('Get document file error:', error);
    res.status(404).json({ error: 'Document not found' });
  }
});

// Update document metadata
router.put('/update/:id', async (req, res) => {
  try {
    const updates = req.body;
    const document = await documentService.updateDocument(req.params.id, updates);
    res.json(document);
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ error: 'Failed to update document' });
  }
});

// Delete a document
router.delete('/delete/:id', async (req, res) => {
  try {
    const result = await documentService.deleteDocument(req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

module.exports = router;
