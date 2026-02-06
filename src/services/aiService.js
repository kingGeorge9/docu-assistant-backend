const Anthropic = require('@anthropic-ai/sdk');
const pdfParse = require('pdf-parse');
const fs = require('fs').promises;

class AIService {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  // Extract text from PDF
  async extractTextFromPDF(file) {
    const dataBuffer = await fs.readFile(file.tempFilePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }

  // Summarize document
  async summarizeDocument(file) {
    const text = await this.extractTextFromPDF(file);
    
    const message = await this.client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: `Please provide a concise summary of the following document:\n\n${text.slice(0, 100000)}`
      }]
    });

    return message.content[0].text;
  }

  // Translate document
  async translateDocument(file, targetLanguage) {
    const text = await this.extractTextFromPDF(file);
    
    const message = await this.client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      messages: [{
        role: "user",
        content: `Translate the following text to ${targetLanguage}:\n\n${text.slice(0, 100000)}`
      }]
    });

    return message.content[0].text;
  }

  // Extract data
  async extractData(file, dataType) {
    const text = await this.extractTextFromPDF(file);
    
    const prompts = {
      'contact': 'Extract all contact information (names, emails, phone numbers, addresses)',
      'dates': 'Extract all dates and deadlines mentioned',
      'amounts': 'Extract all monetary amounts and financial figures',
      'tasks': 'Extract all action items and tasks mentioned',
      'entities': 'Extract all named entities (people, organizations, locations)',
    };

    const message = await this.client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [{
        role: "user",
        content: `${prompts[dataType] || 'Extract key information'} from the following document:\n\n${text.slice(0, 100000)}`
      }]
    });

    return message.content[0].text;
  }

  // Analyze document
  async analyzeDocument(file, analysisType) {
    const text = await this.extractTextFromPDF(file);
    
    let prompt = 'Analyze this document and provide insights including: main topics, sentiment, key findings, and recommendations:';
    
    if (analysisType) {
      prompt = `Analyze this document focusing on ${analysisType}:`;
    }

    const message = await this.client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [{
        role: "user",
        content: `${prompt}\n\n${text.slice(0, 100000)}`
      }]
    });

    return message.content[0].text;
  }

  // Chat with document
  async chatWithDocument(file, question, history) {
    let contextText = '';
    
    if (file) {
      contextText = await this.extractTextFromPDF(file);
    }

    let conversationContext = '';
    if (history && Array.isArray(history)) {
      conversationContext = history.map(h => `${h.role}: ${h.content}`).join('\n');
    }

    const message = await this.client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: file 
          ? `Based on the following document, answer this question: ${question}\n\nPrevious conversation:\n${conversationContext}\n\nDocument:\n${contextText.slice(0, 100000)}`
          : `${conversationContext}\n\nUser: ${question}`
      }]
    });

    return message.content[0].text;
  }

  // Fill form with AI
  async fillForm(formFile, dataSource) {
    const pdfParse = require('pdf-parse');
    const formBuffer = await fs.readFile(formFile.tempFilePath);
    const formData = await pdfParse(formBuffer);
    
    let sourceText = '';
    if (dataSource) {
      const sourceBuffer = await fs.readFile(dataSource.tempFilePath);
      const sourceData = await pdfParse(sourceBuffer);
      sourceText = sourceData.text;
    }

    const message = await this.client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [{
        role: "user",
        content: `Extract information to fill this form:\n\nForm fields:\n${formData.text.slice(0, 50000)}\n\nData source:\n${sourceText.slice(0, 50000)}\n\nProvide the extracted data in JSON format.`
      }]
    });

    // Return placeholder URL - in production, would save filled form and return actual URL
    return '/api/document/filled-form-' + Date.now();
  }
}

module.exports = new AIService();
