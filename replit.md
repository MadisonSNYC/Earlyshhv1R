# EARLYSHH Partnership Platform

## Overview
A social-first coupon platform PWA that revolutionizes digital deal discovery through an engaging, location-aware mobile experience. Transforms how users discover, share, and collect location-based coupon opportunities with intuitive interaction design.

**Target Audience:** iPhone users (375×667 pt screen size) - optimized for maximum compatibility across iPhone models
**Primary Goal:** Authentic brand partnerships with free products + content creation

## Project Architecture

### Frontend Stack
- React PWA with TypeScript
- Tailwind CSS with iPhone 375×667 pt optimization
- Gradient design system with glass-morphism effects
- Mobile-first responsive design
- Advanced UI/UX components
- Interactive user journey mapping

### Backend Stack
- Express.js server
- PostgreSQL database with Drizzle ORM
- RESTful API architecture
- Session-based authentication

### Key Features
- 7-step user journey (Discovery → Onboarding → Exploration → Commitment → Redemption)
- Instagram OAuth integration
- Location-based partnership discovery
- QR code generation for redemption
- Instagram story creation with hidden @earlyshh branding
- Survey feedback collection system
- Gamified achievement and profile system
- Real-time partnership availability tracking

## Recent Changes

### iPhone 375×667 pt Optimization (June 13, 2025)
**Major architectural change targeting wider iPhone audience compatibility**

#### Updates Made:
- **Global CSS System**: Added iPhone-specific utility classes and containers
  - `.iphone-container`: 375px max-width with proper margins
  - `.touch-button`: 44px minimum touch targets (Apple guidelines)
  - `.text-375-*`: Typography scale optimized for 375px viewport
  - `.space-375-*`: Spacing system for compact layouts
  - `.modal-375`: Modal sizing for small screens

- **Core Components Updated**:
  - App.tsx: Added iphone-container and safe-area classes
  - Startup page: Optimized logo sizing, button spacing, typography
  - Home page: Compressed header, optimized search bar, partnership cards
  - Onboarding: Reduced padding, touch-optimized buttons
  - Partnership modal: Mobile-first sizing, improved touch targets

- **Design Optimizations**:
  - Reduced font sizes for better readability on 375px width
  - Increased touch target sizes (minimum 44px)
  - Optimized spacing for compact layout
  - Improved button accessibility for touch interaction
  - Enhanced card layouts for single-column mobile view

#### Technical Implementation:
```css
/* Key CSS additions for iPhone optimization */
.iphone-container { max-width: 375px; margin: 0 auto; padding: 0 16px; }
.touch-button { min-height: 44px; min-width: 44px; padding: 12px 24px; font-size: 16px; }
.modal-375 { width: calc(100vw - 32px); max-width: 343px; }
```

#### Impact:
- Wider iPhone compatibility (375×667 pt is most popular screen size)
- Improved touch interaction and accessibility
- Better content density and readability
- Enhanced user experience across older iPhone models

### Previous Milestones
- Completed full survey system with star ratings and purchase intent tracking
- Enhanced profile & achievement system with partnership impact scores
- Created investor-ready presentation with embedded live app pages
- Fixed routing and display issues for QR Code and Profile pages
- Updated comprehensive user journey documentation with 5-stage flow structure

## User Preferences
- Focus on mobile-first iPhone optimization
- Bright, colorful gradient design system
- Authentic data integration (no mock/placeholder data)
- Touch-optimized interaction design
- Clean, modern aesthetic with glass-morphism effects

## Development Guidelines
- Always test on 375×667 pt viewport
- Use touch-optimized button sizing (44px minimum)
- Prioritize single-column mobile layouts
- Maintain gradient design consistency
- Ensure proper safe area handling for iOS devices
- Use authentic API data for all features

## Current Status
- Fully functional 7-step user journey
- iPhone 375×667 pt optimized design system
- Real investor presentation materials
- Complete partnership discovery and redemption flow
- Ready for broader iPhone audience deployment