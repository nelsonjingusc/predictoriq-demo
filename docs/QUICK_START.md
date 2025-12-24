# Quick Start

**Time**: 5 minutes to get started, 15 minutes for full review

---

## Step 1: Clone and Navigate (30 seconds)

```bash
git clone <repository-url>
cd predictoriq-demo
```

---

## Step 2: Install and Run (2 minutes)

```bash
cd client
npm install
npm run dev
```

**Expected output**: 
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

---

## Step 3: Open in Browser (10 seconds)

Open `http://localhost:3000` in your browser.

**What you should see**:
- ✅ Homepage loads successfully
- ✅ "The Morningstar for Prediction Markets" tagline
- ✅ Navigation menu
- ✅ "View Top10" and "Join Waitlist" buttons

---

## Step 4: Explore the UI (5-10 minutes)

### Pages to Visit:

1. **Homepage** (`/`)
   - Overview of features
   - Feature cards

2. **Top10** (`/top10`)
   - ⚠️ Will show error/loading (expected - no backend)
   - But you can see the page structure and design

3. **Arbitrage** (`/arbitrage`)
   - ⚠️ Will show error/loading (expected)
   - UI layout is visible

4. **Other Pages**:
   - `/strategies` - Trading strategies
   - `/ideas` - Market ideas
   - `/agents` - AI agents feed
   - `/pricing` - Pricing page
   - `/api` - API documentation
   - `/waitlist` - Waitlist signup

**Note**: All pages that call APIs will show error/loading states. This is **normal** - the backend is not included in this demo.

---

## Step 5: Review Code Structure (Optional, 5 minutes)

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
- This is **expected** - API calls fail without backend
- The UI structure is still visible
- Check browser console for details (errors are normal)

### Port 3000 already in use
- Change port: `npm run dev -- -p 3001`
- Or stop the other process using port 3000

---

## Questions?

- Check the [FAQ in Demo Guide](DEMO_GUIDE.md#faq)
- Review [Architecture Overview](ARCHITECTURE_OVERVIEW.md)
- Contact the development team

