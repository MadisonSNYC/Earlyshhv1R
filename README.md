# Earlyshh 🤫
**pronounced "early-ISH"**

A location-based social sampling platform that revolutionizes product discovery by connecting real people (not paid influencers) with brands they'll love, creating genuine local experiences that benefit everyone involved.

## 🎯 Vision & Mission

**Vision:** Revolutionize product discovery and customer engagement by turning everyday consumers into authentic brand advocates.

**Mission:** Connect real people with brands through genuine local experiences, cutting out the influencer drama and putting products directly in the hands of present, everyday people.

## ✨ Core Concept

A mobile-first Progressive Web App (PWA) where users:
- 📍 Discover partnerships within 500 feet of local stores
- 🎁 Claim free products with one tap
- 📱 Redeem using unique QR codes (15-minute window)
- 📸 Share authentic experiences on Instagram Stories
- 🏆 Build their Impact Score through quality participation

## 🚀 Features

### For Users ("Real People")
- **Location-Based Discovery**: Browse partnerships within proximity with toast notifications at 1000 feet
- **Partnership Claiming**: Unlock free products with streamlined "Partner Up" flow
- **QR Code Redemption**: Branded QR codes with 15-minute validity and backup fetch codes
- **Social Sharing**: In-app camera with auto-tagging (@brand + @earlyshh)
- **Gamification**: Impact Score tracking, achievements, and tier progression
- **Profile Analytics**: Track influence, rewards, and participation history

### For Brands
- **Campaign Management**: Launch and monitor partnerships in real-time
- **Hyper-Local Targeting**: Neighborhood-level precision within 500-foot radius
- **Real-Time Analytics**: Live redemption tracking with minute-by-minute updates
- **Content Library**: Access user-generated Instagram Stories
- **Survey Integration**: Collect product feedback post-redemption
- **CRM Integration**: Export data to existing systems

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom gradients and glassmorphism effects
- **Routing**: Wouter for SPA navigation
- **UI Components**: Radix UI with shadcn/ui
- **State Management**: Zustand + TanStack Query
- **Build Tool**: Vite
- **Icons**: Lucide React
- **QR Codes**: qrcode.react

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express Session with PostgreSQL store
- **Authentication**: Passport.js (local strategy)

### Infrastructure (Current → Target)
- **Hosting**: Replit → Firebase/Google Cloud
- **Database**: PostgreSQL → Google Cloud SQL
- **APIs**: Instagram Graph API, TCB 8112 (upcoming)
- **Real-time**: WebSocket support for live updates

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd EarlyshMobile
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   # Create .env file
   DATABASE_URL=your_postgresql_database_url
   SESSION_SECRET=your_session_secret
   INSTAGRAM_CLIENT_ID=your_instagram_client_id
   INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
   ```

3. **Initialize database**:
   ```bash
   npm run db:push
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
├── client/                 # Frontend React PWA
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/        # shadcn/ui components
│   │   │   └── ...        # Custom components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and configurations
│   │   └── types/         # TypeScript type definitions
├── server/                # Backend Express app
│   ├── business/          # Business logic layer
│   ├── middleware/        # Express middleware
│   ├── routes.ts          # API routes
│   └── index.ts           # Server entry point
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema and Zod types
├── docs/                  # Documentation
│   └── earlyshh-handbook.md
└── attached_assets/       # Static assets and media
```

## 🔧 Key Features Implemented

### 🎯 Partnership Discovery & Claiming
- Instagram-like grid interface for partnership browsing
- Location-aware filtering and notifications
- Partnership terms modal with brand details and Instagram integration
- "Partner Up" flow with proper validation and confirmation screens

### 📱 QR Code System
- Branded QR code display with Earlyshh styling and brand logos
- Real-time countdown timer for 15-minute expiration
- 16-digit fetch code backup for manual entry
- One-time use with serialized security

### 🧭 Streamlined User Experience
- Clean bottom navigation (Home, Notifications, Profile)
- Direct flow from partnership claim to QR code display
- Removed redundant pages for focused user journey
- Glass morphism effects and modern purple gradient branding

### 📊 Analytics & Gamification
- Impact Score calculation and display
- User statistics and participation tracking
- Achievement system with tier progression
- Real-time campaign performance monitoring

## 🌐 API Endpoints

### Campaigns
- `GET /api/campaigns` - Fetch all available campaigns
- `GET /api/campaigns/categories` - Get campaign categories
- `GET /api/campaigns/:id` - Get specific campaign details

### Coupons & Redemption
- `POST /api/coupons/claim/:campaignId` - Claim a partnership
- `GET /api/coupons/:id` - Get coupon details for QR display
- `POST /api/coupons/:id/redeem` - Process QR code redemption

### User Management
- `GET /api/user/profile` - User profile and statistics
- `GET /api/user/stats` - Detailed user analytics
- `POST /api/user/instagram` - Link Instagram account

### Notifications
- `GET /api/notifications` - User notifications
- `POST /api/notifications/mark-read` - Mark notifications as read

## 🗄 Database Schema

### Core Tables
- **users** - User profiles, authentication, and Instagram integration
- **campaigns** - Brand partnership campaigns with location data
- **coupons** - User-claimed partnerships with QR codes and redemption status
- **notifications** - User notifications and alerts
- **analytics** - Campaign performance and user engagement tracking
- **user_stats** - Impact scores and gamification data

### Key Relationships
- Users can claim multiple campaigns (one-to-many)
- Campaigns belong to brands and have location constraints
- Coupons track redemption status and social sharing compliance
- Analytics aggregate data for real-time dashboard updates

## 🚀 Deployment

### Current Environment
- **Development**: Replit with hot reload
- **Database**: PostgreSQL with connection pooling
- **Session Storage**: PostgreSQL-backed sessions

### Production Deployment (Planned)
- **Platform**: Firebase/Google Cloud
- **Database**: Google Cloud SQL (PostgreSQL)
- **CDN**: Google Cloud CDN for static assets
- **Monitoring**: Google Cloud Monitoring

### Environment Variables Required
```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Session Management
SESSION_SECRET=your-secure-session-secret

# Instagram Integration
INSTAGRAM_CLIENT_ID=your-instagram-app-id
INSTAGRAM_CLIENT_SECRET=your-instagram-app-secret
INSTAGRAM_REDIRECT_URI=your-redirect-uri

# TCB Integration (Future)
TCB_API_KEY=your-tcb-api-key
TCB_MERCHANT_ID=your-merchant-id
```

## 🎯 Current Status & Roadmap

### ✅ Completed Features
- Core PWA architecture with React + TypeScript
- Location-based partnership discovery
- QR code generation and display system
- User authentication and profile management
- Basic gamification with Impact Score
- Instagram handle integration
- Real-time notifications system

### 🚧 In Development
- Instagram Graph API integration for story monitoring
- TCB 8112 Universal Digital Coupon integration
- Enhanced analytics dashboard
- Camera feature for in-app social sharing
- Advanced fraud prevention

### 📅 Upcoming Milestones
- **August 2025**: Williamsburg, Brooklyn pilot launch
- **Q4 2025**: Multi-neighborhood NYC expansion
- **2026**: Miami, LA, Nashville market entry
- **Future**: National presence and international expansion

## 🧪 Pilot Program

### August 2025 Williamsburg Launch
- **Target**: 5-10 brand partnerships
- **Users**: 20-50 initial participants
- **Confirmed Partners**: Superroot
- **Potential Partners**: Vinny's Pizza (slice of the day program)
- **Success Metrics**: Technical functionality, brand satisfaction, user retention, redemption rates

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Install dependencies**: `npm install`
4. **Make your changes** following the existing code style
5. **Test thoroughly** with `npm run check`
6. **Commit your changes**: `git commit -m 'Add amazing feature'`
7. **Push to the branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use existing UI components from shadcn/ui
- Maintain mobile-first responsive design
- Write meaningful commit messages
- Test location-based features thoroughly

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

## 🙋‍♀️ Support & Contact

- **Documentation**: Check `/docs/earlyshh-handbook.md` for comprehensive project details
- **Issues**: Open a GitHub issue for bugs or feature requests
- **Questions**: Reach out through project channels

---

**Built with ❤️ by the Earlyshh team**

*Connecting real people with brands they'll love, one authentic experience at a time.*