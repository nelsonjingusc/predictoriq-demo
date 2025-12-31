# Quick Start

---

## Step 1: Clone and Navigate

```bash
git clone <repository-url>
cd predictoriq-demo
```

---

## Step 2: Install and Run

```bash
# RECOMMENDED: One-click start
./start-demo.sh

# OR Manual:
cd client && npm install && npm run dev
```

**Expected output**:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

---

## Step 3: Open in Browser

Open `http://localhost:3000` in your browser.

**What you should see**:
- ✅ Homepage loads with a professional design
- ✅ **Demo Mode Active** banner appears at the top
- ✅ Navigation menu for all features
- ✅ Instant access to all pages

---

## Step 4: Explore the UI (Demo Mode Ready)

Unlike a standard POC, this demo includes **realistic mock data** for all features. You can explore:

1. **Top10** (`/top10`): AI-ranked market opportunities with **Match Scores**.
2. **Arbitrage** (`/arbitrage`): Cross-platform price spreads.
3. **Strategies** (`/strategies`): Sample trading strategy templates.
4. **Ideas** (`/ideas`): Market creation suggestions.
5. **Agents** (`/agents`): Verified AI agent message feed.

**Note**: All pages will load instantly with sample data. No backend connection is required.

---

## Step 5: Review Code Structure (Optional)

```bash
# Explore the codebase
cd client

# Key directories:
# - app/          # Next.js pages
# - components/   # React components
# - packages/sdk/ # TypeScript SDK
```

---

## What to Evaluate

### ✅ What Works (Frontend POC)
- UI/UX design and layout
- Page navigation and routing
- Component structure
- Code organization
- TypeScript SDK design

### ⚠️ What Doesn't Work (Expected)
- API calls (backend not included)
- Data display (no backend data)
- Real-time features (no backend)

---

## Understanding the POC

This is a **frontend-only proof of concept** that demonstrates:

1. **Product Vision**: Complete UI showing all planned features
2. **User Experience**: How users would interact with the product
3. **Technical Architecture**: Frontend code structure and patterns
4. **SDK Design**: How external developers would integrate

The backend (data processing, ML models, AI agents) is in a separate private repository.

---

## Next Steps

- Read **[Product Overview](PRODUCT_OVERVIEW.md)** to understand the vision
- Read **[Architecture Overview](ARCHITECTURE_OVERVIEW.md)** to understand the system design
- Read **[Demo Guide](DEMO_GUIDE.md)** for detailed feature walkthrough

---

## Troubleshooting

### npm install fails
- Make sure you have Node.js 18+ installed
- Try `npm install --legacy-peer-deps` if there are dependency conflicts

### Pages show errors
- Ensure you are in **Demo Mode** (`NEXT_PUBLIC_DEMO_MODE=true` in `.env.local`).
- If demo mode is off, errors are expected as the backend is not running.
- In Demo Mode, all pages should load instantly with mock data.

### Port 3000 already in use
- Change port: `npm run dev -- -p 3001`
- Or stop the other process using port 3000

---

## Questions?

- Check the [FAQ in Demo Guide](DEMO_GUIDE.md#faq)
- Review [Architecture Overview](ARCHITECTURE_OVERVIEW.md)
- Contact the development team: [nelson.jingusc@gmail.com](mailto:nelson.jingusc@gmail.com)

