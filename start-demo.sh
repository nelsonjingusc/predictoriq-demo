#!/bin/bash

# PredictorIQ Demo Startup Script
# Usage: ./start-demo.sh

set -e  # Exit immediately if a command exits with a non-zero status

echo "🚀 Starting PredictorIQ Demo..."
echo ""

# Ensure we are in the root directory of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Navigate to client directory
cd client

# Check and initialize .env.local if needed
if [ ! -f .env.local ]; then
    echo "📝 Initializing environment configuration..."
    echo "NEXT_PUBLIC_DEMO_MODE=false" > .env.local
    echo "✅ Demo mode configuration initialized"
else
    echo "✅ Environment configuration found"
fi

echo ""

# Verify and install dependencies if missing
if [ ! -d node_modules ]; then
    echo "📦 Installing project dependencies..."
    npm install
    echo "✅ Dependency installation complete"
else
    echo "✅ Dependencies already up to date"
fi

echo ""
echo "🎬 Launching development server..."
echo "   Access the dashboard at: http://localhost:3000"
echo "   (or http://localhost:3001 if port 3000 is occupied)"
echo ""
echo "📊 Status: Demo Mode Active (Mock Data Enabled)"
echo "   Note: Press Ctrl+C to terminate the process"
echo ""
echo "---"

# Start the Next.js development server
npm run dev
