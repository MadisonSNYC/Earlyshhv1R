# EARLYSHH Partnership Platform

## Overview
A social-first coupon platform PWA that revolutionizes digital deal discovery through an engaging, location-aware mobile experience. Transforms how users discover, share, and collect location-based coupon opportunities with intuitive interaction design.

**Target Audience:** iPhone users (375×812 pt screen size) - optimized for efficient coverage of most iPhone users
**Primary Goal:** Authentic brand partnerships with free products + content creation

## Project Architecture

### Frontend Stack
- React PWA with TypeScript
- Tailwind CSS with iPhone 375×812 pt optimization
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

### Production-Ready Design System Adherence (June 13, 2025)
**Implemented strict design system consistency and removed dev mode elements**

#### Production Updates:
- **Startup Page**: Removed dev mode elements and "Skip to Home" functionality
- **Design Consistency**: Enforced established color tokens, spacing patterns, and typography
- **Touch Optimization**: Maintained 44px minimum touch targets with proper visual hierarchy
- **User Flow**: Streamlined to Instagram auth and "Explore Without Account" options
- **Visual Cohesion**: Applied consistent gradient patterns and glass-morphism effects

### iPhone 375×812 pt Optimization (June 13, 2025)
**Major architectural change targeting efficient user coverage for most iPhone users**

#### Updates Made:
- **Global CSS System**: Enhanced iPhone-specific utility classes and containers
  - `.iphone-container`: 375px max-width with 812pt min-height
  - `.touch-button`: 44px minimum touch targets (Apple guidelines)
  - `.text-812-*`: Typography scale optimized for 375×812pt viewport
  - `.space-812-*`: Enhanced spacing system for taller screens
  - `.modal-812`: Modal sizing optimized for 812pt height

- **Core Components Updated**:
  - App.tsx: Added iphone-container and safe-area classes
  - Startup page: Optimized for taller screen with improved spacing
  - Home page: Enhanced header and layout for 812pt format
  - Onboarding: Touch-optimized buttons with better vertical spacing
  - Partnership modal: Improved sizing for taller screen format

- **Design Optimizations**:
  - Enhanced typography hierarchy for 812pt screens
  - Improved vertical spacing to utilize additional screen height
  - Optimized touch targets (minimum 44px) across all components
  - Better content organization for taller viewport
  - Enhanced user experience for modern iPhone form factor

#### Technical Implementation:
```css
/* Key CSS additions for iPhone 375×812pt optimization */
.iphone-container { max-width: 375px; min-height: 812px; margin: 0 auto; padding: 0 16px; }
.touch-button { min-height: 44px; min-width: 44px; padding: 12px 24px; font-size: 16px; }
.modal-812 { width: calc(100vw - 32px); max-width: 343px; max-height: calc(100vh - 120px); }
.text-812-hero { font-size: 2.5rem; line-height: 1.2; }
.space-812-xl { margin: 36px 0; }
```

#### Impact:
- Efficient coverage of most iPhone users (375×812 pt is optimal target)
- Better utilization of vertical screen space
- Improved content hierarchy and readability
- Enhanced user experience for modern iPhone form factors
- Scalable foundation for adapting to other screen sizes

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
- Always test on 375×812 pt viewport for optimal user coverage
- Use touch-optimized button sizing (44px minimum)
- Prioritize single-column mobile layouts with enhanced vertical spacing
- Maintain gradient design consistency across all components
- Ensure proper safe area handling for iOS devices
- Use authentic API data for all features
- Leverage additional vertical space for better content organization

## Current Status
- Fully functional 7-step user journey
- iPhone 375×812 pt optimized design system
- Real investor presentation materials
- Complete partnership discovery and redemption flow
- Enhanced spacing and typography for modern iPhone form factors
- Ready for efficient deployment targeting most iPhone users