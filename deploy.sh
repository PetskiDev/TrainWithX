#!/bin/bash

# Abort on error
set -e

echo "🔄 Pulling latest changes..."
git pull origin main

echo "🔨 Building project..."
npm install
npm run build

echo "🚀 Reloading PM2 process..."
pm2 reload trainwithx --update-env


echo "💾 Saving PM2 process list..."
pm2 save

echo "✅ Deployment complete."
