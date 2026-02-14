#!/bin/sh
# PredictorIQ × ChainGPT PoC - One-Click Startup Script
# POSIX-compatible (works on macOS/Linux)

set -e

# Ensure we're in the repo root
if [ ! -f "package.json" ] && [ ! -d "client" ]; then
  echo "Error: This script must be run from the repo root."
  exit 1
fi

# Navigate to client directory
cd client

echo "========================================="
echo "PredictorIQ × ChainGPT PoC"
echo "========================================="
echo ""

# Step 1: Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
  echo "Creating .env.local with demo mode enabled..."
  cat > .env.local <<'EOF'
NEXT_PUBLIC_DEMO_MODE=1
# CHAINGPT_API_KEY=your_api_key_here
# CHAINGPT_BASE_URL=https://api.chaingpt.org
EOF
  echo "✓ .env.local created"
  echo ""
fi

# Step 2: Install dependencies if node_modules is missing
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  if [ -f "pnpm-lock.yaml" ]; then
    pnpm install
  else
    npm install
  fi
  echo "✓ Dependencies installed"
  echo ""
fi

# Step 3: Start the dev server
echo "Starting development server..."
echo ""
echo "========================================="
echo "PoC is running at: http://localhost:3000"
echo "========================================="
echo ""
echo "Demo mode: ENABLED (uses canned responses)"
echo ""
echo "To enable live ChainGPT calls:"
echo "  1. Get API key from https://app.chaingpt.org/apidashboard"
echo "  2. Add to client/.env.local: CHAINGPT_API_KEY=your_key"
echo "  3. Restart this script"
echo ""
echo "Pages to visit:"
echo "  • /top10    - Market explanation + copilot"
echo "  • /chaingpt - Wallet summary + content generation"
echo ""
echo "Press Ctrl+C to stop the server."
echo ""

# Start dev server
if [ -f "pnpm-lock.yaml" ]; then
  pnpm run dev
else
  npm run dev
fi
