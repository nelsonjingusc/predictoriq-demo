# Demo Mode - Technical Deep Dive

PredictorIQ Demo includes a robust **Demo Mode** that allows reviewers to explore the complete product interface without a backend server.

---

## Implementation Details

### 1. The `useMockData` Hook
The core of Demo Mode is a custom React hook that seamlessly switches between live API calls and mock data.

```typescript
// client/lib/demo-mode.ts
export function useMockData<T>(apiCall: () => Promise<T>, mockData: T) {
  // Logic to return mockData when NEXT_PUBLIC_DEMO_MODE=true
}
```

### 2. Centralized Mock Data
All sample data is maintained in `client/lib/mock-data.ts`. This data is strictly typed to match the PredictorIQ SDK interfaces, ensuring that the frontend code remains production-ready.

### 3. User Experience
- **Realistic Delays**: The hook simulates brief network latency to provide a more authentic user experience.
- **Persistence**: Banner dismissal is stored in the browser's session storage.

---

## Configuration

To enable Demo Mode (enabled by default in this repo), ensure your `.env.local` contains:

```bash
NEXT_PUBLIC_DEMO_MODE=true
```

To connect to a live backend:

```bash
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## Benefits for Reviewers

- **Zero-Config Setup**: Run one command and see the full product.
- **High-Fidelity Examples**: The mock data reflects realistic trading scenarios and AI analytical output.
- **Pure Frontend Review**: Evaluate UI/UX and frontend architecture without infrastructure overhead.

---

**Last Updated**: December 2024
