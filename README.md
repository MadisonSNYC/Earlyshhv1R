# Earlyshh - Social Partnership Platform

A social-first coupon platform PWA that revolutionizes digital deal discovery through an engaging, location-aware mobile experience.

## Features

- **Partnership Discovery**: Instagram-like interface for discovering brand partnerships
- **QR Code Redemption**: Streamlined redemption flow with branded QR codes
- **Social Integration**: Instagram handle integration and social sharing
- **Location Awareness**: Location-based deal discovery
- **Real-time Notifications**: Push notifications for new deals and updates
- **Mobile-First Design**: Responsive PWA optimized for mobile devices

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Wouter
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Build Tool**: Vite
- **UI Components**: Radix UI with shadcn/ui
- **Icons**: Lucide React
- **QR Codes**: qrcode.react

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- PostgreSQL 14.x or higher
- Git

## Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MadisonSNYC/earlyshhrepl.git
   cd earlyshhrepl
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   # Create .env file with the following variables
   DATABASE_URL=your_postgresql_database_url
   NODE_ENV=development
   PORT=3000
   SESSION_SECRET=your_session_secret
   ```

4. **Push database schema**:
   ```bash
   npm run db:push
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

## Project Structure

```
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   └── lib/           # Utilities and configurations
├── server/                # Backend Express app
│   ├── business/          # Business logic layer
│   ├── middleware/        # Express middleware
│   └── routes.ts          # API routes
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema and types
└── package.json
```

## Key Features Implemented

### 🎯 Partnership Terms Modal
- Brand details with logo and Instagram integration
- Location information and offer details
- "Unlock Partnership" flow with proper validation

### 📱 QR Code Redemption
- Branded QR code display with Earlyshh styling
- Real-time countdown timer for offer expiration
- Fetch code for easy manual entry

### 🧭 Streamlined Navigation
- Removed redundant "My Coupons" page from navigation
- Direct flow from partnership claim to QR code display
- Clean bottom navigation with Home, Notifications, Profile

### 🎨 Brand Design
- Purple gradient background matching Earlyshh brand
- Glass morphism effects and modern UI
- High contrast campaign cards for better readability

## API Endpoints

- `GET /api/campaigns` - Fetch all campaigns
- `GET /api/campaigns/categories` - Get campaign categories
- `POST /api/coupons/claim/:campaignId` - Claim a coupon
- `GET /api/coupons/:id` - Get coupon details for QR display
- `GET /api/notifications` - User notifications
- `GET /api/user/stats` - User statistics

## Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User profiles and authentication
- `campaigns` - Brand partnership campaigns
- `coupons` - User-claimed coupons with QR data
- `notifications` - User notifications
- `analytics` - Campaign performance tracking

## Deployment

### Vercel Deployment

1. **Fork the repository** on GitHub

2. **Connect to Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Create a new project
   - Import your forked repository
   - Configure build settings:
     ```
     Build Command: npm run build
     Output Directory: dist
     Install Command: npm install
     ```

3. **Configure environment variables** in Vercel:
   - Add all required environment variables from `.env`
   - Ensure `NODE_ENV` is set to `production`

4. **Deploy**:
   - Vercel will automatically deploy your application
   - Any new commits to the main branch will trigger automatic deployments

### Manual Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

### Environment Variables Required:
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)
- `SESSION_SECRET` - Session encryption key

## Development Notes

- Uses hardcoded `userId=1` for MVP authentication
- In-memory storage available for development/testing
- All routing uses wouter for proper SPA navigation
- Form validation with react-hook-form and Zod schemas
- Development requires Node.js 18+ and npm 9+

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Ensure all dependencies are installed: `npm install`
   - Clear npm cache: `npm cache clean --force`
   - Install terser: `npm install --save-dev terser`

2. **Database Connection**:
   - Verify PostgreSQL is running
   - Check DATABASE_URL format
   - Ensure database exists

3. **Development Server**:
   - Port conflicts: Change PORT in .env
   - Hot reload issues: Restart dev server

## Contributing

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a feature branch
4. Make your changes
5. Test thoroughly
6. Submit a pull request

## License

MIT License - See LICENSE file for details