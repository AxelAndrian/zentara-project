# API Documentation

## Overview

Zentara Global Cyber Threat Monitor integrates with multiple APIs to provide comprehensive threat intelligence and AI-powered analysis.

## External APIs

### Countries API

**Base URL**: `https://countries.trevorblades.com/graphql`

**Purpose**: Provides geographic data including country names, capitals, continents, and flag information.

**Authentication**: None required

**GraphQL Schema**:
```graphql
type Country {
  code: String!
  name: String!
  capital: String
  continent: Continent!
  emoji: String!
  currency: String
  languages: [Language!]!
}

type Continent {
  name: String!
}

type Language {
  name: String!
}
```

**Example Query**:
```graphql
query GetCountries($filter: CountryFilterInput) {
  countries(filter: $filter) {
    code
    name
    capital
    continent {
      name
    }
    emoji
    currency
    languages {
      name
    }
  }
}
```

**Usage in Application**:
- Hook: `useCountries`
- File: `src/app/_hooks/useCountries.ts`
- Caching: 5 minutes with React Query

### NVIDIA NIM API

**Base URL**: `https://integrate.api.nvidia.com/v1/chat/completions`

**Purpose**: Provides AI-powered threat analysis and interactive chat functionality.

**Authentication**: Bearer token (API key)

**Request Format**:
```json
{
  "model": "meta/llama-3.1-8b-instruct",
  "messages": [
    {
      "role": "system",
      "content": "You are a cybersecurity expert..."
    },
    {
      "role": "user",
      "content": "Analyze threats for..."
    }
  ],
  "stream": true,
  "temperature": 0.7,
  "max_tokens": 2000
}
```

**Response Format** (Streaming):
```
data: {"choices":[{"delta":{"content":"Analysis content..."}}]}

data: {"choices":[{"delta":{"content":" continues..."}}]}

data: [DONE]
```

**Usage in Application**:
- Proxy endpoint: `/api/nim/v1/chat/completions`
- Hook: `useNIM`
- File: `src/app/_hooks/useNIM.ts`

## Internal APIs

### Threat Data API

**Purpose**: Generates and manages mock threat data for demonstration purposes.

**Data Structure**:
```typescript
interface Threat {
  id: string;
  countryCode: string;
  countryName: string;
  type: ThreatType;
  level: ThreatLevel;
  description: string;
  timestamp: Date;
}

type ThreatType = "Malware" | "Phishing" | "DDoS" | "Data Breach";
type ThreatLevel = "Low" | "Medium" | "High" | "Critical";
```

**Features**:
- Real-time generation every 15 seconds
- 40% probability of new threats
- Maximum 50 threats per session
- Automatic cleanup of old threats

**Usage in Application**:
- Hook: `useThreats`
- File: `src/app/_hooks/useThreats.ts`

## API Endpoints

### GET /api/nim/v1/chat/completions

**Purpose**: Proxy endpoint for NVIDIA NIM API to handle CORS and API key security.

**Method**: POST

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "model": "string",
  "messages": [
    {
      "role": "system" | "user" | "assistant",
      "content": "string"
    }
  ],
  "stream": boolean,
  "temperature": number,
  "max_tokens": number
}
```

**Response**:
- **200**: Streaming response from NVIDIA NIM
- **500**: Server error (API key not configured)

**Environment Variables**:
- `NIM_API_KEY`: Required for authentication

## Error Handling

### Common Error Types

1. **Network Errors**
   - CORS issues (handled by proxy)
   - Connection timeouts
   - Rate limiting

2. **Authentication Errors**
   - Missing API key
   - Invalid API key
   - Expired credentials

3. **Data Errors**
   - Invalid request format
   - Missing required fields
   - Malformed responses

### Error Response Format

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-12-19T10:30:00Z"
}
```

## Rate Limiting

### Countries API
- No official rate limits documented
- Application implements 5-minute caching

### NVIDIA NIM API
- Rate limits depend on your API plan
- Application implements request queuing
- Streaming responses reduce API calls

## Security Considerations

### API Key Management
- API keys stored server-side only
- Environment variables for configuration
- No client-side exposure

### Data Privacy
- No sensitive data stored locally
- Threat data is mock/demonstration only
- No user data collection

### CORS Handling
- Server-side proxy for external APIs
- No direct client-side API calls
- Proper headers and authentication

## Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:integration
```

### API Testing
```bash
# Test Countries API
curl -X POST https://countries.trevorblades.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { countries { name } }"}'

# Test NVIDIA NIM API (requires API key)
curl -X POST /api/nim/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "meta/llama-3.1-8b-instruct", "messages": [{"role": "user", "content": "Hello"}]}'
```

## Monitoring and Logging

### Application Logs
- API request/response logging
- Error tracking and reporting
- Performance metrics

### Health Checks
- API endpoint availability
- Response time monitoring
- Error rate tracking

## Troubleshooting

### Common Issues

1. **Countries API not loading**
   - Check network connectivity
   - Verify GraphQL query format
   - Check browser console for errors

2. **NVIDIA NIM API errors**
   - Verify API key configuration
   - Check server logs for authentication errors
   - Ensure proper environment variables

3. **Threat data not updating**
   - Check browser console for JavaScript errors
   - Verify React Query configuration
   - Check component state management

### Debug Mode

Enable debug logging by setting:
```env
NEXT_PUBLIC_DEBUG=true
```

This will provide detailed console output for API calls and data flow.
