# Demo Mode Guide

## Overview

PredictorIQ Demo runs in **Demo Mode** by default, using realistic sample data to showcase the complete product interface without requiring a backend server.

## What is Demo Mode?

Demo Mode is a frontend-only mode that:
- ✅ Uses pre-defined mock data instead of API calls
- ✅ Shows all features with realistic examples
- ✅ Loads instantly without backend dependencies
- ✅ Provides a complete product demonstration

## Enabling/Disabling Demo Mode

### Default: Demo Mode Enabled

By default, the app runs in demo mode. You'll see:
- A blue banner at the top indicating "Demo Mode Active"
- All pages load with realistic sample data
- Full navigation and filtering functionality

### Configuration

Create or edit `client/.env.local`:

```bash
# Enable demo mode (default)
NEXT_PUBLIC_DEMO_MODE=true

# Disable demo mode (requires backend API)
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_API_URL=http://localhost:8000
```

After changing the configuration, restart the dev server:
```bash
npm run dev
```

## Mock Data Contents

### Top10 Markets
- 10 AI-ranked market opportunities
- Various categories: Economics, Crypto, Sports, Technology, Politics
- Multiple platforms: Kalshi, Polymarket
- Realistic AI scores, confidence levels, and edge rationales

### Arbitrage Opportunities
- 3 cross-platform arbitrage alerts
- Real price spreads and liquidity data
- Bitcoin, Fed rates, and unemployment markets

### Trading Strategies
- 5 different strategy templates
- Risk levels: Low, Medium, High
- Strategy types: Momentum, Arbitrage, Mean Reversion, Event-Driven, Hedge
- Entry/exit signals for each strategy

### Market Ideas
- 6 AI-generated market creation suggestions
- Categories: Technology, Climate, Gaming, Space, Healthcare, Sports
- Liquidity and time sensitivity indicators

### AI Agents Feed
- 8 messages from three AI agents:
  - 🎯 Alpha Scout (opportunities and insights)
  - 🛡️ Portfolio Guardian (risk alerts)
  - 📊 Research Autopilot (research reports)
- Filtering by agent works in demo mode
- Various priority levels and message types

## Technical Implementation

### Architecture

Demo mode uses a simple architecture:

1. **Environment Variable**: `NEXT_PUBLIC_DEMO_MODE=true`
2. **Utility Hook**: `useMockData()` in `lib/demo-mode.ts`
3. **Mock Data**: Centralized in `lib/mock-data.ts`
4. **UI Indicator**: `<DemoModeBanner>` component

### Code Example

```typescript
import { useMockData } from '@/lib/demo-mode';
import { mockTop10Data } from '@/lib/mock-data';

export default function Top10Page() {
  const { data, loading, error } = useMockData<Top10Response>(
    () => client.getDailyTop10(), // API call (used in live mode)
    mockTop10Data                  // Mock data (used in demo mode)
  );
  
  // Rest of component...
}
```

### How It Works

1. **Demo Mode Check**: The `useMockData` hook checks `process.env.NEXT_PUBLIC_DEMO_MODE`
2. **Data Selection**: 
   - If demo mode: Returns mock data after a brief simulated delay
   - If live mode: Makes actual API call
3. **Error Handling**: In demo mode, API errors are ignored and mock data is used
4. **Type Safety**: All mock data conforms to SDK TypeScript types

## Switching to Live Mode

To connect to a real backend:

1. **Set up backend API** (not included in this repo)
2. **Configure environment**:
   ```bash
   # client/.env.local
   NEXT_PUBLIC_DEMO_MODE=false
   NEXT_PUBLIC_API_URL=http://localhost:8000  # Your API URL
   ```
3. **Restart dev server**: `npm run dev`

Pages will now attempt real API calls. If the backend is not running, you'll see loading states or errors.

## For Reviewers

### Recommended Review Flow

1. **Start with Demo Mode** (default):
   - Run `npm install && npm run dev`
   - Explore all pages to see the complete UI
   - Test navigation and filtering features
   
2. **Review Mock Data**:
   - Check `client/lib/mock-data.ts` to see data quality
   - Verify it represents realistic use cases
   
3. **Review Code Quality**:
   - Check page implementations in `client/app/`
   - Review demo mode utilities in `client/lib/`
   - Examine SDK types in `client/packages/sdk/src/types.ts`

### What to Evaluate

- ✅ **UI/UX Design**: Is the interface intuitive and professional?
- ✅ **Feature Completeness**: Are all promised features visible?
- ✅ **Data Realism**: Does the mock data represent realistic scenarios?
- ✅ **Code Quality**: Is the code well-structured and maintainable?
- ✅ **Documentation**: Is it clear how to run and understand the demo?

## Frequently Asked Questions

### Why demo mode instead of a real backend?

This is a **public demo repository** focused on showcasing the frontend UI. The backend (with ML models, data ingestion, and AI agents) is in a private repository. Demo mode allows anyone to explore the complete product interface immediately.

### Does demo mode affect code quality?

No. The same production code paths are used; demo mode simply switches the data source. The implementation uses proper TypeScript types and clean architecture patterns.

### Can I add/modify mock data?

Yes! Edit `client/lib/mock-data.ts` to add or modify sample data. All data conforms to TypeScript types defined in the SDK.

### How do I hide the demo banner?

Click the "✕" button on the blue demo banner. It will be hidden for the current browser session.

### What happens if I disable demo mode without a backend?

Pages will show loading states indefinitely or error messages, as API calls will fail without a backend server.

## Support

For questions or issues:
- Check the [Quick Start Guide](QUICK_START.md)
- Review the [Architecture Overview](ARCHITECTURE_OVERVIEW.md)
- Contact: nelson.jingusc@gmail.com
