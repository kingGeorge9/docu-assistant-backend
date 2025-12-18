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
  async analyzeDocument(file) {
    const text = await this.extractTextFromPDF(file);
    
    const message = await this.client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [{
        role: "user",
        content: `Analyze this document and provide insights including: main topics, sentiment, key findings, and recommendations:\n\n${text.slice(0, 100000)}`
      }]
    });

    return message.content[0].text;
  }

  // Chat with document
  async chatWithDocument(file, question) {
    const text = await this.extractTextFromPDF(file);
    
    const message = await this.client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: `Based on the following document, answer this question: ${question}\n\nDocument:\n${text.slice(0, 100000)}`
      }]
    });

    return message.content[0].text;
  }

  // Extract tasks
  async extractTasks(file) {
    const text = await this.extractTextFromPDF(file);
    
    const message = await this.client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: `Extract all action items, tasks, and to-dos from this document. Format as a numbered list:\n\n${text.slice(0, 100000)}`
      }]
    });

    return message.content[0].text;
  }

  // Generate content
  async generateContent(prompt, documentContext = null) {
    let content = prompt;
    
    if (documentContext) {
      const text = await this.extractTextFromPDF(documentContext);
      content = `Based on this document:\n${text.slice(0, 50000)}\n\n${prompt}`;
    }

    const message = await this.client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [{
        role: "user",
        content: content
      }]
    });

    return message.content[0].text;
  }
}

module.exports = new AIService();
