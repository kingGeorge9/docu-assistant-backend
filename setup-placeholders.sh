#!/bin/bash

# Quick Setup Script for Placeholder Endpoints
# This script helps you set up Office conversions, OCR, and Text-to-Speech

echo "=========================================="
echo "  Docu-Assistant Backend Setup"
echo "  Setting up placeholder endpoints"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo "Checking Node.js..."
if command -v node &> /dev/null; then
    echo -e "${GREEN}✓${NC} Node.js installed: $(node --version)"
else
    echo -e "${RED}✗${NC} Node.js not found. Please install Node.js 16+"
    exit 1
fi

echo ""
echo "=========================================="
echo "  1. Office Conversions Setup"
echo "=========================================="
echo ""

# Check for LibreOffice
echo "Checking for LibreOffice..."
if command -v libreoffice &> /dev/null || command -v soffice &> /dev/null; then
    echo -e "${GREEN}✓${NC} LibreOffice is installed"
    libreoffice --version 2>/dev/null || soffice --version 2>/dev/null
    OFFICE_METHOD="libreoffice"
else
    echo -e "${YELLOW}!${NC} LibreOffice not found"
    echo ""
    echo "Choose installation method:"
    echo "1) Install LibreOffice (Free, unlimited conversions)"
    echo "2) Use CloudConvert API (Paid, $9/month for 500 conversions)"
    echo "3) Skip for now"
    read -p "Your choice (1-3): " office_choice
    
    case $office_choice in
        1)
            echo ""
            echo "Installing LibreOffice..."
            if [[ "$OSTYPE" == "linux-gnu"* ]]; then
                sudo apt-get update
                sudo apt-get install -y libreoffice
            elif [[ "$OSTYPE" == "darwin"* ]]; then
                if command -v brew &> /dev/null; then
                    brew install --cask libreoffice
                else
                    echo -e "${YELLOW}Homebrew not found. Please install from: https://www.libreoffice.org/download/${NC}"
                fi
            else
                echo -e "${YELLOW}Please download from: https://www.libreoffice.org/download/${NC}"
            fi
            OFFICE_METHOD="libreoffice"
            ;;
        2)
            echo ""
            read -p "Enter your CloudConvert API key: " cloudconvert_key
            echo "CLOUDCONVERT_API_KEY=$cloudconvert_key" >> .env
            npm install cloudconvert
            echo -e "${GREEN}✓${NC} CloudConvert configured"
            OFFICE_METHOD="cloudconvert"
            ;;
        3)
            echo "Skipping Office conversions setup"
            OFFICE_METHOD="skip"
            ;;
    esac
fi

echo ""
echo "=========================================="
echo "  2. OCR (Text Extraction) Setup"
echo "=========================================="
echo ""

echo "Installing Tesseract.js (Free OCR)..."
npm install tesseract.js

echo ""
echo "Do you want to use Google Cloud Vision API for better OCR accuracy?"
echo "Google Vision offers 1,000 free requests/month"
read -p "Set up Google Cloud Vision? (y/n): " vision_choice

if [[ "$vision_choice" == "y" ]]; then
    echo ""
    echo "Follow these steps:"
    echo "1. Go to https://console.cloud.google.com/"
    echo "2. Create a new project"
    echo "3. Enable Vision API"
    echo "4. Create service account and download JSON key"
    echo ""
    read -p "Enter path to your Google Cloud credentials JSON: " google_creds
    echo "GOOGLE_APPLICATION_CREDENTIALS=$google_creds" >> .env
    npm install @google-cloud/vision
    echo -e "${GREEN}✓${NC} Google Cloud Vision configured"
fi

echo ""
echo "=========================================="
echo "  3. Text-to-Speech Setup"
echo "=========================================="
echo ""

echo "Choose Text-to-Speech provider:"
echo "1) Google Cloud TTS (Recommended - 1M free chars/month)"
echo "2) Azure Speech (500K free chars/month)"
echo "3) AWS Polly (5M free chars for 12 months)"
echo "4) Skip for now"
read -p "Your choice (1-4): " tts_choice

case $tts_choice in
    1)
        echo ""
        echo "Setting up Google Cloud Text-to-Speech..."
        npm install @google-cloud/text-to-speech
        if [[ -z "$google_creds" ]]; then
            echo "Follow these steps:"
            echo "1. Go to https://console.cloud.google.com/"
            echo "2. Enable Text-to-Speech API"
            echo "3. Use the same credentials from Vision API setup"
            echo ""
            read -p "Enter path to Google Cloud credentials JSON: " google_creds
            echo "GOOGLE_APPLICATION_CREDENTIALS=$google_creds" >> .env
        fi
        echo -e "${GREEN}✓${NC} Google Cloud TTS configured"
        ;;
    2)
        echo ""
        read -p "Enter your Azure Speech Key: " azure_key
        read -p "Enter your Azure Region (e.g., eastus): " azure_region
        echo "AZURE_SPEECH_KEY=$azure_key" >> .env
        echo "AZURE_SPEECH_REGION=$azure_region" >> .env
        npm install microsoft-cognitiveservices-speech-sdk
        echo -e "${GREEN}✓${NC} Azure Speech configured"
        ;;
    3)
        echo ""
        read -p "Enter your AWS Access Key ID: " aws_key
        read -p "Enter your AWS Secret Access Key: " aws_secret
        read -p "Enter AWS Region (e.g., us-east-1): " aws_region
        echo "AWS_ACCESS_KEY_ID=$aws_key" >> .env
        echo "AWS_SECRET_ACCESS_KEY=$aws_secret" >> .env
        echo "AWS_REGION=$aws_region" >> .env
        npm install aws-sdk
        echo -e "${GREEN}✓${NC} AWS Polly configured"
        ;;
    4)
        echo "Skipping Text-to-Speech setup"
        ;;
esac

echo ""
echo "=========================================="
echo "  4. Optional Python Dependencies"
echo "=========================================="
echo ""

echo "Install Python libraries for PDF → Office conversions?"
echo "(Requires Python 3.6+)"
read -p "Install Python dependencies? (y/n): " python_choice

if [[ "$python_choice" == "y" ]]; then
    if command -v python3 &> /dev/null; then
        echo "Installing Python packages..."
        pip3 install pdf2docx tabula-py pandas openpyxl
        echo -e "${GREEN}✓${NC} Python dependencies installed"
    else
        echo -e "${RED}✗${NC} Python 3 not found. Please install Python 3.6+"
    fi
fi

echo ""
echo "=========================================="
echo "  Setup Complete!"
echo "=========================================="
echo ""

echo -e "${GREEN}✓${NC} All dependencies installed"
echo ""
echo "Configured services:"
[ "$OFFICE_METHOD" != "skip" ] && echo -e "${GREEN}✓${NC} Office conversions: $OFFICE_METHOD"
echo -e "${GREEN}✓${NC} OCR: Tesseract.js (free)"
[ ! -z "$google_creds" ] && echo -e "${GREEN}✓${NC} Google Cloud Vision API"
case $tts_choice in
    1) echo -e "${GREEN}✓${NC} Text-to-Speech: Google Cloud TTS" ;;
    2) echo -e "${GREEN}✓${NC} Text-to-Speech: Azure Speech" ;;
    3) echo -e "${GREEN}✓${NC} Text-to-Speech: AWS Polly" ;;
esac

echo ""
echo "Next steps:"
echo "1. Start the server: npm start"
echo "2. Test the endpoints (see TESTING.md)"
echo "3. Review PLACEHOLDER_SOLUTIONS.md for detailed docs"
echo ""
echo "Test endpoints:"
echo "  curl http://localhost:3000/api/pdf/ocr -F 'pdf=@test.pdf'"
echo "  curl http://localhost:3000/api/pdf/read-aloud -F 'pdf=@test.pdf' --output audio.mp3"
echo "  curl http://localhost:3000/api/convert/word-to-pdf -F 'document=@test.docx' --output converted.pdf"
echo ""
echo "Happy coding! 🚀"
