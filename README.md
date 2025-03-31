# ExamAI - AI-Powered Exam Preparation Tool

A tool for scraping and analyzing AQA past papers, with AI-powered question generation and answer evaluation.

## Features

- Scrapes AQA past papers and mark schemes
- AI-powered question generation
- Answer evaluation with detailed feedback
- Local storage of papers for offline access
- Modern web interface

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/phoenicon/examai.git
cd examai
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=3000
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Project Structure

```
examai/
├── src/
│   ├── js/
│   │   ├── app.js
│   │   ├── services/
│   │   │   ├── scraper-service.js
│   │   │   └── paper-storage.js
│   │   └── components/
│   └── css/
├── dist/
├── server.js
├── package.json
├── webpack.config.js
└── .env
```

## Usage

1. Start the application
2. Navigate to the papers section
3. Use the AI features to generate questions and evaluate answers

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- AQA for providing past papers
- Claude and OpenAI for AI capabilities 