# AlgoChat Chrome Extension

> A Chrome extension that enhances your Algochurn experience with AI-powered assistance and LoFi music for focused coding.

[![Watch Demo Video](https://img.shields.io/badge/Watch-Demo-blue)](https://www.loom.com/share/326edde2e3be4057a6cd4988565046b1?sid=5575a734-5456-4f51-8b5f-c0c34b9895ca)

## Overview

AlgoChat is designed exclusively for [Algochurn](https://www.algochurn.com), providing an intelligent coding companion for technical interview preparation.

## Features

- 🤖 **AI Assistant** - Context-aware coding help
- 🎵 **LoFi Player** - Built-in music for focused coding
- 💡 **Smart Prompts** - Quick access to common questions
- 🎨 **Modern UI** - Clean, minimalist interface

## Installation

### Option 1: Quick Install (Pre-built)

For those who want to skip the build process, you can download the pre-built extension files:

1. Download the pre-built dist folder from [Google Drive](https://drive.google.com/drive/folders/1HpKknb4UXX-bhpVnFT3G-g6oBeN2Icii?usp=drive_link)
2. Load in Chrome:
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the downloaded folder

### Prerequisites

- Node.js (v14+)
- npm/yarn
- Chrome browser
- Gemini API key

### Quick Start

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Load in Chrome:
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

## Usage Guide

### Initial Setup

1. Click the extension icon in Chrome
2. Configure your Gemini API key
3. Visit [algochurn.com](https://www.algochurn.com)

### Key Features

#### AI Chat Assistant
- Automatic activation on algochurn.com
- Context-aware coding assistance
- Expandable/collapsible interface

#### LoFi Music Player
- Toggle with music note icon
- Random LoFi track selection
- Hover for track information
- Simple play/pause controls

#### Quick Prompts
| Prompt | Purpose |
|--------|---------|
| "Help me solve this" | Get solution guidance |
| "What concepts should I know?" | Review prerequisites |
| "Give me a hint" | Receive subtle hints |
| "Explain the question" | Clarify problem statement |

## Technical Stack

- ⚛️ React
- 📘 TypeScript
- 🎨 Tailwind CSS
- 🤖 Google Gemini AI
- 🔌 Chrome Extensions API

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Built with ❤️ by [Vivek](https://x.com/devloperVivek)

---

<p align="center">
  Made for the Algochurn community
</p>