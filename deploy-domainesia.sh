#!/bin/bash

echo "🚀 Preparing for Domainesia deployment..."

# 1. Use production package.json
echo "📦 Using production dependencies..."
cp package.production.json package.json

# 2. Clean install
echo "🧹 Cleaning node_modules..."
rm -rf node_modules
rm -rf .next
rm -rf out

# 3. Install with npm (not pnpm)
echo "📥 Installing dependencies with npm..."
npm install --production --no-optional

# 4. Build project
echo "🏗️ Building project..."
npm run build

# 5. Create deployment package
echo "📦 Creating deployment package..."
zip -r markasai-domainesia-deploy.zip . -x "*.git*" "node_modules/.cache/*" "*.log" "*.md"

echo "✅ Deployment package ready: markasai-domainesia-deploy.zip"
echo ""
echo "📋 Next steps:"
echo "1. Upload markasai-domainesia-deploy.zip to Domainesia File Manager"
echo "2. Extract in public_html folder"
echo "3. Set Node.js app with startup file: server.js"
echo "4. Environment variables:"
echo "   - NODE_ENV=production"
echo "   - PORT=3000"
echo "   - NEXT_TELEMETRY_DISABLED=1"