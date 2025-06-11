# Earlyshh User Journey Map

## 🎯 Complete User Flow: From Discovery to Redemption

### Phase 1: Discovery & Onboarding
**Entry Point**: User opens Earlyshh app

1. **Landing on Home Page**
   - Purple gradient background with Earlyshh branding
   - Campaign cards displayed in grid view
   - Search bar and category filters visible
   - Bottom navigation: Home, Notifications, Profile

2. **Campaign Discovery**
   - User browses campaign cards showing:
     - Brand logo and name
     - Offer description (e.g., "Free SuperRoot Energy Drink")
     - Location distance
     - Available spots remaining
     - Brand Instagram handle
   - Filter by categories: All, Food & Drink, Fashion, etc.
   - Search functionality for specific brands/offers

### Phase 2: Partnership Engagement
**Trigger**: User taps on a campaign card

3. **Partnership Terms Modal Opens**
   - Brand logo displayed prominently
   - Offer details and redeemable amount
   - Brand Instagram handle with link
   - Location information
   - Terms and conditions
   - "Unlock Partnership" button (primary action)
   - "Cancel" option to return to discovery

4. **Partnership Claiming**
   - User clicks "Unlock Partnership"
   - System validates eligibility (not previously claimed)
   - API call creates coupon with unique QR code
   - Automatic navigation to QR code page

### Phase 3: Redemption Experience
**Outcome**: User receives digital coupon

5. **QR Code Display Page**
   - Earlyshh branded header with back navigation
   - Large QR code for scanning at location
   - Fetch code for manual entry (backup option)
   - Offer details: brand name, amount, product
   - Countdown timer showing expiration
   - Share button for social media
   - Terms button for legal disclaimers

6. **Physical Redemption**
   - User visits brand location
   - Shows QR code to staff OR provides fetch code
   - Staff scans/enters code to validate
   - User receives product/discount
   - Coupon marked as redeemed in system

### Phase 4: Ongoing Engagement

7. **Profile & Stats**
   - User can view profile page
   - Statistics: claimed partnerships, redeemed offers, shared content
   - Achievement tracking and progress

8. **Notifications**
   - New partnership alerts
   - Expiration reminders
   - Special offers from followed brands
   - Badge showing unread count

9. **Social Sharing**
   - Instagram story integration
   - Share partnership achievements
   - Tag brands and use hashtags
   - Drive organic discovery

## 🔄 User Flow Diagram

```
App Launch
    ↓
Home Page (Campaign Discovery)
    ↓
[User taps campaign card]
    ↓
Partnership Terms Modal
    ↓
[User clicks "Unlock Partnership"]
    ↓
QR Code Page
    ↓
[User visits location]
    ↓
Physical Redemption
    ↓
[Optional: Social Sharing]
```

## 📱 Navigation Structure

### Bottom Navigation (Always Visible)
- **Home**: Campaign discovery and filtering
- **Notifications**: Alerts and updates (with badge)
- **Profile**: User stats and achievements

### Page Hierarchy
```
Home
├── Campaign Grid View
├── Search & Filters
└── Partnership Terms Modal
    └── QR Code Page
        ├── Back to Home
        └── Share Options

Notifications
├── New Deal Alerts
├── Expiration Reminders
└── Social Mentions

Profile
├── User Statistics
├── Achievement Badges
└── Settings
```

## 🎨 Key Design Elements

### Visual Identity
- **Purple gradient backgrounds** matching Earlyshh brand
- **Glass morphism effects** for modern feel
- **High contrast cards** for accessibility
- **Mobile-first responsive design**

### User Experience Principles
- **Streamlined flow**: Removed redundant "My Coupons" page
- **Direct navigation**: Partnership claim → QR code (no intermediate steps)
- **Clear actions**: Prominent buttons and obvious next steps
- **Visual feedback**: Loading states, success confirmations

## 🔧 Technical User Flow

### Authentication
- **MVP Approach**: Hardcoded userId=1
- **Future**: Instagram OAuth integration

### Data Flow
1. **Campaign Discovery**: GET /api/campaigns
2. **Category Filtering**: GET /api/campaigns/categories
3. **Partnership Claim**: POST /api/coupons/claim/:campaignId
4. **QR Display**: GET /api/coupons/:id
5. **Notifications**: GET /api/notifications

### Error Handling
- **Network issues**: Retry mechanisms and offline indicators
- **Already claimed**: Clear messaging and alternative suggestions
- **Expired offers**: Automatic removal from discovery

## 📊 Success Metrics

### User Engagement
- Campaign card click-through rate
- Partnership claim conversion rate
- QR code redemption rate
- Social sharing frequency

### Business Value
- Brand partnership completion rate
- User retention after first redemption
- Geographic distribution of redemptions
- Popular brand categories

## 🚀 Future Enhancements

### Planned Features
- **Map view**: Location-based discovery
- **Favorites**: Save interesting partnerships
- **Social feed**: User-generated content
- **Loyalty rewards**: Gamification elements

### Advanced Flows
- **Group partnerships**: Friends claiming together
- **Recurring offers**: Subscription-style partnerships
- **Brand analytics**: Performance dashboards for partners

---

*This user journey reflects the current implementation with streamlined navigation and direct partnership-to-redemption flow.*