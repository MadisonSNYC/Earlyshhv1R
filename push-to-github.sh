#!/bin/bash

# Script to push Earlyshh project to GitHub
# Run this script after downloading project files locally

echo "Setting up Earlyshh project for GitHub..."

# Initialize git repository
git init

# Add remote repository
git remote add origin https://github.com/MadisonSNYC/Earlyshhv1R.git

# Create .gitignore if it doesn't exist
cat > .gitignore << EOF
node_modules/
.env
.env.local
.env.production.local
.env.development.local
dist/
build/
.cache/
.DS_Store
*.log
.replit
replit.nix
.upm/
.config/
.local/
EOF

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Earlyshh partnership platform

Features:
- Partnership terms modal with Instagram integration
- QR code redemption with Earlyshh branding
- Streamlined navigation (removed My Coupons page)
- Campaign discovery with purple gradient design
- Working API endpoints and database schema
- Mobile-first PWA design"

# Push to GitHub
git branch -M main
git push -u origin main

echo "Project successfully pushed to GitHub!"
echo "Repository: https://github.com/MadisonSNYC/Earlyshhv1R.git"