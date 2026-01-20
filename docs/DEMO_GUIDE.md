# PredictorIQ - Demo Guide

This guide provides a step-by-step walkthrough of the PredictorIQ demo.

---

## Getting Started

The fastest way to start the demo is by using the provided startup script:

```bash
./start-demo.sh
```

This script automatically:
1. Verifies the environment configuration (creates .env.local if needed).
2. Installs dependencies if missing.
3. Launches the Next.js development server on port 3000 (or 3001 if 3000 is occupied).

Once the server is running, open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 1. Homepage & Navigation

The landing page introduces PredictorIQ as "The Morningstar for Prediction Markets."

**Key Observations:**
- **Navigation Bar**: Instant access to all product modules.
- **Demo Banner**: A clearly visible blue banner at the top indicates that you are in **Demo Mode**. This ensures transparency about the use of sample data for this presentation.
- **Design Aesthetic**: Professional, data-centric interface designed for institutional-grade reliability.

---

## 2. Daily Top10 (Core Feature)

Navigate to the **Top10** page via the header menu.

**What you'll see:**
- **Match Score**: Every market is assigned a "Match Score" (0-10). This represents a personalized rating based on the alignment between the market's requirements and your domain expertise.
- **Edge Rationale**: High-quality analytical summaries explaining *why* a particular market represents an opportunity.
- **Market Data**: Real-time metrics including price, 24h volume, and available liquidity across platforms like Kalshi and Polymarket.
- **Confidence Layer**: A transparency meter showing the AI's confidence in the provided rationale.

---

## 3. Cross-Platform Arbitrage

Navigate to the **Arbitrage** page.

PredictorIQ identifies price discrepancies for the same event across different platforms (Polymarket, Kalshi, Opinion, Limitless).

**Key Observations:**
- **Spread Percentage**: Instant calculation of the profit margin between platforms.
- **Mapping Confidence**: Indicates the reliability of the event matching algorithm used to identify identical events across platforms.
- **Execution Instructions**: Clear instructions on which side to buy and which to sell to lock in the spread.

---

## 4. Form Integration (Waitlist)

Navigate to the **Waitlist** page.

This form demonstrates full integration with **Formspree** for real-time email notifications. When a user joins the waitlist, an actual email can be sent to pre-configured destination addresses (e.g., for lead capture).

---

## Technical Appendix

- **Frontend**: Next.js 14, Tailwind CSS, TypeScript.
- **Architecture**: A clean separation of concerns using a proprietary TypeScript SDK for API communication.
- **Demo Mode**: Implemented via a robust mock data layer in `client/lib/mock-data.ts`, ensuring zero backend dependencies for this preview.

---

**Last Updated**: January 2026
**Contact**: nelson.jingusc@gmail.com
