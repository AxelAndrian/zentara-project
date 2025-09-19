# Zentara - Global Cyber Threat Monitor

A comprehensive cybersecurity threat intelligence dashboard built with Next.js 15, featuring real-time threat monitoring, AI-powered analysis, and interactive data visualization.

## 🚀 Features

### Core Functionality

- **Country Selection**: Searchable dropdown with multi-select support (up to 5 countries)
- **Real-time Threat Simulation**: Mock threat data generation with different severity levels
- **Interactive Data Visualization**: Charts and graphs for threat analysis
- **AI-Powered Analysis**: Integration with NVIDIA NIM for intelligent threat assessment
- **Streaming Interface**: Real-time AI response streaming
- **Interactive Chat**: Follow-up questions and conversation with AI
- **Export Functionality**: Download analysis reports

### Technical Features

- **GraphQL Integration**: Countries API for country data
- **State Management**: React Query for data fetching and caching
- **Modern UI**: ShadCN/UI components with Tailwind CSS
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Simulated live threat monitoring

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: ShadCN/UI with Radix UI primitives
- **Styling**: Tailwind CSS
- **State Management**: TanStack React Query + Apollo Client
- **GraphQL**: Apollo Client for Countries API
- **Charts**: Recharts for data visualization
- **AI Integration**: NVIDIA NIM API
- **TypeScript**: Full type safety
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd zentara
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Add your NVIDIA NIM API key:

   ```env
   NEXT_PUBLIC_NIM_API_KEY=your_nim_api_key_here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/
│   ├── (protected)/
│   │   └── dashboard/           # Main dashboard route
│   │       ├── _components/     # Dashboard-specific components
│   │       └── page.tsx
│   ├── _components/
│   │   └── ui/                  # Reusable UI components
│   ├── _hooks/                  # Custom React hooks
│   ├── _entities/               # TypeScript types and schemas
│   ├── _config/                 # Configuration files
│   └── _libs/                   # Utility libraries
├── api/                         # API integrations
│   ├── graphql.ts              # GraphQL client setup
│   └── nim.ts                  # NVIDIA NIM integration
└── libs/                       # Global utilities
    └── utils.ts                # Utility functions
```

## 🔧 Configuration

### NVIDIA NIM Setup

1. Sign up for NVIDIA NIM API access
2. Get your API key from the NVIDIA console
3. Set the `NEXT_PUBLIC_NIM_API_KEY` environment variable
4. The app will use the default model: `meta/llama-3.1-8b-instruct`

### GraphQL API

The app uses the Countries GraphQL API at `https://countries.trevorblades.com/graphql` for country data.

## 🎯 Usage

1. **Select Countries**: Use the searchable dropdown to select up to 5 countries
2. **Monitor Threats**: View real-time threat data with different severity levels
3. **Analyze Data**: Use interactive charts to understand threat patterns
4. **AI Analysis**: Get AI-powered insights and recommendations
5. **Chat with AI**: Ask follow-up questions about threats and security
6. **Export Reports**: Download analysis results for offline review

## 📊 Data Visualization

- **Threat Level Distribution**: Bar chart showing threat severity breakdown
- **Threat Type Distribution**: Pie chart of threat categories
- **Country Comparison**: Stacked bar chart comparing countries
- **Threat Timeline**: Line chart showing threat activity over time

## 🤖 AI Features

- **Threat Analysis**: AI-powered assessment of cybersecurity landscape
- **Risk Assessment**: Automated risk evaluation and scoring
- **Recommendations**: Actionable security recommendations
- **Interactive Chat**: Natural language conversation about threats
- **Streaming Responses**: Real-time AI response streaming

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Component-based architecture

## 📝 API Documentation

### Countries GraphQL API

- **Endpoint**: `https://countries.trevorblades.com/graphql`
- **Query**: `GetCountries`
- **Fields**: code, name, capital, continent, emoji, currency, languages

### NVIDIA NIM API

- **Endpoint**: `https://integrate.api.nvidia.com/v1/chat/completions`
- **Model**: `meta/llama-3.1-8b-instruct`
- **Features**: Streaming responses, chat completions

## 🔒 Security Considerations

- API keys are stored in environment variables
- Input validation on all user inputs
- Secure data handling and sanitization
- No sensitive data stored in localStorage

## 🐛 Troubleshooting

### Common Issues

1. **GraphQL Errors**: Check network connection and API availability
2. **AI Analysis Not Working**: Verify NVIDIA NIM API key is set
3. **Charts Not Rendering**: Ensure all dependencies are installed
4. **Build Errors**: Check TypeScript types and imports

### Debug Mode

Set `NODE_ENV=development` for additional logging and error details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [ShadCN/UI](https://ui.shadcn.com/) - UI components
- [Countries GraphQL API](https://countries.trevorblades.com/) - Country data
- [NVIDIA NIM](https://www.nvidia.com/en-us/ai-data-science/generative-ai/nim/) - AI inference
- [Recharts](https://recharts.org/) - Data visualization

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

**Built with ❤️ for cybersecurity professionals**
