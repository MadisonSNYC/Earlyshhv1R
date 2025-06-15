# EARLYSHH INTERNAL COMPANY HANDBOOK

**pronounced "early-ISH" 🤫**

Version 2.0 | Last Updated: June 15, 2025 | Pre-Launch

---

## Table of Contents

1. [Company Overview](#1-company-overview)
2. [Product Overview](#2-product-overview)
3. [Technical Architecture](#3-technical-architecture)
4. [Business Model & Economics](#4-business-model--economics)
5. [User Experience & Journey](#5-user-experience--journey)
6. [Brand Guidelines & Messaging](#6-brand-guidelines--messaging)
7. [Pilot Program Details](#7-pilot-program-details)
8. [Data & Analytics Strategy](#8-data--analytics-strategy)
9. [Strategic Roadmap](#9-strategic-roadmap)
10. [Operational Procedures](#10-operational-procedures)
11. [Comprehensive To-Do List](#11-comprehensive-to-do-list)

---

## 1. Company Overview

### Vision & Mission

Earlyshh's vision is to revolutionize product discovery and customer engagement by turning everyday consumers into authentic brand advocates. Our mission is to connect real people (not paid influencers) with brands they'll love, creating genuine local experiences that benefit everyone involved.

**Core Concept:** A location-based social sampling platform where users claim free products from brands, redeem them in-store within 500 feet, and share authentic experiences on Instagram Stories.

### Founding Story

Madison founded Earlyshh after too many disappointing dates filled with influencer-talk and close calls with aggressive street-sampling marketers. She decided brands and communities deserved better—a simpler, more sustainable, genuinely local way to connect. Her approach? Cut the influencer, eliminate the drama, and put products directly in the hands of real, present, everyday people.

### Founders

#### Madison Sutton - Founder & CEO

Madison founded Earlyshh to revolutionize how brands connect with real people. She is a systems strategist, AI consultant, and former top-producing real estate professional known for blending emotional intelligence with technical precision. After building a widely recognized career in NYC luxury real estate—with over 100 press features in outlets like The Wall Street Journal, Bloomberg, Forbes, CNN, and TIME—she transitioned into a hybrid role at the intersection of automation, decision-making psychology, and digital identity.

Madison now helps founders, operators, and creative professionals architect smarter workflows, clarify their leadership voice, and integrate AI into their daily systems without losing the human side of their business. With 150,000+ followers across social media platforms, Madison brings deep expertise in social media strategy and community building. Known for her strategic clarity and grounded voice, she writes and speaks on topics like synthetic intimacy, decision fatigue, emotional resilience, and what it means to trust yourself in a hyper-automated world. She calls herself a Technical Perspective Architect—part translator, part builder, part coach.

#### Rob Onslow - Co-Founder

Rob's our fintech and payments guru from London, with a knack for making complex financial stuff feel refreshingly simple. Before Earlyshh, he founded Bread, a platform making sure creators get paid fast—like, next-day fast. Rob saw firsthand how tricky creator finances can get, so he's spent his career building easy solutions that give freelancers and creators some much-needed peace of mind. His extensive payment processing expertise and understanding of the influencer marketing payment ecosystem provides crucial infrastructure knowledge for Earlyshh's operations.

### Brand Values

- **Authenticity:** Real people, real experiences, real feedback
- **Community:** Local connections driving neighborhood discovery
- **Anti-Influencer:** No paid endorsements, just genuine enthusiasm
- **Sustainability:** Digital-first, reducing waste and supporting local businesses
- **Innovation:** Cutting-edge tech with a human touch

---

## 2. Product Overview

### Platform Architecture

Earlyshh is designed as a mobile-first Progressive Web App (PWA) with supporting web components for brand partners and internal teams.

**Tech Stack:**
- Frontend: React + TypeScript
- Styling: Tailwind CSS + Custom Gradients
- Backend: Node.js/Express (transitioning to Firebase)
- Database: PostgreSQL (migrating to Google Cloud)
- APIs: Instagram Graph API, TCB 8112 (upcoming)
- Hosting: Currently Vercel, moving to Firebase/Google Cloud

### Core Features

#### For Users ("Real People")
- **Location-Based Discovery:** Browse partnerships within proximity
- **Partnership Claiming:** Unlock free products with one tap
- **QR Code Redemption:** 15-minute window, unique codes
- **Social Sharing:** In-app camera with auto-tagging
- **Gamification:** Impact Score, achievements, tiers
- **Profile Analytics:** Track your influence and rewards

#### For Brands
- **Campaign Management:** Launch and monitor in real-time
- **Hyper-Local Targeting:** Neighborhood-level precision
- **Real-Time Analytics:** Live redemption tracking
- **Content Library:** Access user-generated stories
- **Survey Integration:** Collect product feedback
- **CRM Integration:** Export data to existing systems

**⚠️ Location Requirements:** Users must share location and can only activate partnerships within 500 feet of the store. Toast notifications appear at 1000 feet.

---

## 3. Technical Architecture

### Location-Based Mechanics

| Feature | Distance/Time | Behavior |
|---------|---------------|----------|
| Toast Notifications | 1000 feet | User notified of nearby partnerships |
| Partnership Activation | 500 feet | QR code generation enabled |
| Code Validity | 15 minutes | After activation, code expires |
| Restart Attempts | 3 maximum | Within 24 hours for same partnership |

### QR Code System

- **Format:** QR Code (NOT barcode) per TCB requirements
- **Display:** Both Earlyshh and Brand logos on template
- **Backup:** 16-digit fetch code for manual entry
- **Security:** One-time use, serialized codes

**TCB Integration:** Moving to 8112 Universal Digital Coupon standard. Timeline: 4-8 weeks for certification.

### Social Sharing Integration

Instagram Stories are the primary sharing mechanism with specific requirements:

- **Required Tags:** @brand + @earlyshh (both visible)
- **Timeline:** Must post within 24 hours of redemption
- **Verification:** Instagram Graph API monitors compliance
- **Lock Mechanism:** Cannot claim new partnership until current one completed

**⚠️ Technical Limitation:** Instagram doesn't support truly hidden tags. We'll use small/transparent text or explore sticker workarounds.

---

## 4. Business Model & Economics

### Revenue Structure [In Development]

Performance-based pricing model with multiple revenue streams:

| Revenue Stream | Description | Preliminary Thoughts |
|----------------|-------------|---------------------|
| Setup Fee | Per campaign setup and onboarding | $500-$2,000 depending on complexity |
| Per-Redemption Fee | Performance-based charge per successful redemption | $0.50-$2.00 per redemption |
| Analytics Package | Premium insights and reporting | $500/month for advanced analytics |
| White-Label Services | Custom branding for enterprise clients | $5,000+ setup + revenue share |

**Note:** These are preliminary pricing thoughts. Final pricing will be determined based on market research, competitor analysis, and pilot program results. We're comparing against traditional influencer campaigns ($1,000+ per post) and sampling programs to ensure competitive value.

### TCB Integration Economics

- **Certification Cost:** ~$30K for direct integration
- **Per-Coupon Fee:** < $0.005 at volume
- **Settlement:** Net 30-45 days standard
- **Handling Fee:** $0.08 per redemption (paid by brand to retailer)

### User Incentive Structure

Gamification tiers to encourage quality participation:

1. **Probation:** 7-day lockout for violations
2. **Average:** Completed partnerships but mediocre content
3. **Good Standing:** Consistent quality participation
4. **Premium Access:** Top performers with exclusive benefits [Benefits TBD]

---

## 5. User Experience & Journey

### Complete User Flow

#### Phase 1: Discovery & Browse
1. User opens app and sees partnership grid
2. Filters by category, location, or brand
3. Views "3 nearby" partnerships on map preview
4. Taps partnership card for details

#### Phase 2: Partnership Activation
1. Reviews partnership terms and requirements
2. Taps "Partner Up" button
3. **NEW:** Sees product confirmation screen ("Confirm you got the correct item")
4. Receives unique QR code with 15-minute timer

#### Phase 3: In-Store Redemption
1. Visits store within 500 feet
2. Shows QR code to staff
3. Staff scans code or enters fetch number
4. Receives free product

#### Phase 4: Social Sharing
1. App prompts to share experience
2. Uses in-app camera (auto-tags @brand and @earlyshh)
3. Posts Instagram Story within 24 hours
4. Completes product feedback survey

#### Phase 5: Rewards & Gamification
1. Receives partnership score
2. Updates Impact Score on profile
3. Unlocks achievements
4. Gains access to next partnership

**Target Metrics:** 80% redemption rate, 45-60% story completion rate, 10-minute lifecycle from notification to completion.

---

## 6. Brand Guidelines & Messaging

### Brand Voice
- **Confident** yet approachable
- **Authentic** and transparent
- **Community-centric** language
- **Anti-influencer** positioning
- **Playful** but professional

### Key Terminology

| Do Use | Don't Use |
|--------|-----------|
| Partnerships | Campaigns |
| Real people | Users/Creators |
| Partner Up | Sign up/Register |
| Authentic experiences | Influencer marketing |

### Visual Identity
- **Primary Gradient:** Pink (#ec4899) → Purple (#a855f7) → Cyan (#22d3ee)
- **Typography:** Inter font family
- **Design Principles:** Clean, modern, gradient-heavy, glassmorphism effects

---

## 7. Pilot Program Details

### August 2025 Williamsburg Launch

#### Scope
- **Location:** General Williamsburg area, Brooklyn
- **Target Brands:** 5-10 products
- **Confirmed:** Superroot
- **Potential:** Vinny's Pizza (slice of the day program)
- **User Target:** 20-50 initial (may scale with social promotion)

#### Success Metrics
1. Technical functionality performing appropriately
2. Brand satisfaction and ease of campaign management
3. User feedback and retention
4. Redemption and sharing rates

**Marketing Strategy:** Leverage Madison's 150K social following + brand partner promotion + traditional flyer campaign in Williamsburg

---

## 8. Data & Analytics Strategy

### Impact Score Components [Research Needed]

Basic framework for user scoring:
- Redemption speed
- Content quality (AI-analyzed)
- Survey completion
- Brief compliance
- Referral effectiveness

### Real-Time Dashboard Updates
- **Refresh Rate:** Every minute
- **Brand Reports:** PDF format, customizable
- **Data Retention:** Forever (internal)
- **Export Options:** CSV for raw data

### Comprehensive Data Collection

34 categories of data points including:
- Demographics (age, location, income)
- Shopping patterns and preferences
- Brand affinity and switching behavior
- Social engagement metrics
- Psychographic profiling

---

## 9. Strategic Roadmap

### Immediate (By June 16, 2025)
- [ ] Submit TCB initial inquiry form
- [ ] Set up Pennsylvania LLC
- [ ] Ensure earlyshh.com is live on Google Cloud/Firebase
- [ ] Create LinkedIn page
- [ ] Firebase migration (Madison)

### Short-term (Pre-Pilot)
- Complete TCB integration (4-8 weeks)
- Develop brand pitch deck
- Implement core app features
- Create user onboarding flow
- Set up support systems

### Medium-term (Post-Pilot)
- Expand to additional NYC neighborhoods
- Launch in Miami, LA, Nashville
- Implement vendor partnerships
- Add service offerings (pizza, coffee)
- Launch premium tier features

### Long-term Vision
- National presence in major metros
- Product incubator services
- International expansion
- Celebrity brand partnerships (brand owners, not influencers)

---

## 10. Operational Procedures

### Support Structure
- **Channels:** In-app, email, social media DMs
- **Hours:** 24/7 during pilot (Madison/Rob monitoring)
- **Escalation:** User issues → Madison (technical) / Rob (business)

### Brand Onboarding Process
1. Initial strategy call (collaborative brief creation)
2. Campaign setup and configuration
3. Product and location verification
4. Launch coordination and monitoring
5. Daily reporting and optimization

### Legal & Compliance
- **Age Verification:** Self-certification initially (18+)
- **Content Rights:** Users grant reposting rights in terms
- **Ad Disclosure:** Research FTC requirements [High Priority]
- **Data Privacy:** CCPA/GDPR compliance needed [Research]

---

## 11. Comprehensive To-Do List

### 🚨 IMMEDIATE ACTIONS (By Monday, June 16, 2025)

- [ ] Submit TCB inquiry form
- [ ] Set up Pennsylvania LLC
- [ ] Ensure earlyshh.com is live on Google Cloud/Firebase
- [ ] Create LinkedIn page
- [ ] Firebase migration (Madison)

### Research Tasks (15-30 min deep dives)

#### Instagram Graph API Capabilities
- [ ] Auto-tagging possibilities for Stories
- [ ] Story detection and monitoring
- [ ] Sticker integration options
- [ ] Copy-paste tag workflow feasibility
- [ ] Instagram API rate limits and restrictions

#### TCB Integration Requirements
- [ ] QR code regeneration rules per TCB guidelines
- [ ] Multiple attempt handling specifications
- [ ] POS system compatibility in NYC bodegas
- [ ] 8112 barcode format requirements
- [ ] Real-time validation webhook setup

#### Legal & Compliance
- [ ] FTC ad disclosure requirements (#ad usage)
- [ ] User-generated content rights for brands
- [ ] State-by-state privacy laws (CCPA, etc.)
- [ ] Age verification legal requirements
- [ ] Terms of service for content usage

#### Pricing & Economics Research
- [ ] Influencer rate comparisons ($1,000+ per post)
- [ ] CPG sampling program costs
- [ ] Volume-based discount models
- [ ] Competitor pricing analysis
- [ ] ROI calculations for brands

#### Additional Research Areas
- [ ] Impact Score best practices and AI scoring
- [ ] Fraud prevention beyond TCB
- [ ] Viral coefficient measurement methods
- [ ] Word-of-mouth tracking methodologies
- [ ] Support ticketing platforms comparison
- [ ] Trade show opportunities for CPG brands
- [ ] A/B testing frameworks
- [ ] Settlement processes through clearinghouses

### Development Tasks (Madison)

| Feature | Priority | Components |
|---------|----------|------------|
| Camera Feature | High | Placeholder exists, needs implementation |
| Instagram API Integration | Critical | OAuth, story detection, analytics pull |
| Notification System | High | 1hr, 6hr, 12hr, 23hr reminders |
| Map Improvements | Medium | Fix routing, add directions |
| AI Scoring System | Medium | Content quality analysis |
| Storage Setup | High | User data, images, analytics |
| Survey Customization | Medium | Per-campaign configuration |
| Analytics Dashboard | High | Minute-by-minute updates |

### Business Development (Rob/Madison)

#### Pricing Model Definition
- [ ] Base tier features and pricing
- [ ] Premium tier differentiators
- [ ] Volume discount structure
- [ ] Vendor partnership models
- [ ] Revenue share agreements

#### Brand Pitch Deck
- [ ] Value proposition refinement
- [ ] Case study development
- [ ] ROI calculations
- [ ] Competitive differentiation
- [ ] Visual design and branding

#### Pilot Program Planning
- [ ] Define pilot success metrics
- [ ] Create recruitment materials
- [ ] Design flyer campaign
- [ ] Social media strategy
- [ ] Brand outreach list (5-10 targets)

### User Experience Improvements

- [ ] Fix partnership card sizing on home screen
- [ ] Add product confirmation screen flow
- [ ] Implement save/notification features for deals
- [ ] Create achievement naming system (replace "Super Sampler")
- [ ] Design penalty/lockout system UI
- [ ] Add multi-location selection for brands
- [ ] Fix backward navigation restarting app
- [ ] Remove "Explore without account" button

### Content & Messaging

- [ ] Update website copy (fix "$25 your offer" typo)
- [ ] Create brand guidelines document
- [ ] Develop FAQ sections (user and brand)
- [ ] Write notification copy variations
- [ ] Design crisis communication protocols
- [ ] Create pronunciation guide implementation
- [ ] Standardize CTA language across platforms

### Things to Discuss (Madison)

- Show remaining offers count or countdown timer?
- Multiple items at same location - checkout flow?
- Preview campaigns - risk of cancellation disappointment?
- Celebrity brand partnerships messaging
- Vendor foot traffic tracking methods
- Premium logo removal for white-label?
- Support ticketing system platform (Zendesk, Intercom, custom?)

### Additional High-Priority To-Dos

#### Achievement Program Design [Complete Program]
- [ ] Define tier names (replace "Super Sampler")
- [ ] Design tier benefits
- [ ] Create advancement criteria
- [ ] Design visual badges/icons
- [ ] Define points system (if applicable)

#### Vinny's Pizza Program Structure
- [ ] Define slice of the day logistics
- [ ] Create partnership terms
- [ ] Design pilot testing approach
- [ ] Calculate economics (12 slices/day model)

#### Instagram Hidden Tag Workaround
- [ ] Research sticker API capabilities
- [ ] Design copy-paste flow
- [ ] Test manual tagging UX
- [ ] Create user instructions

#### Support System Setup
- [ ] Research ticketing platforms
- [ ] Compare pricing models
- [ ] Evaluate integration capabilities
- [ ] Set up workflow routing

### Legal & Compliance To-Dos

- [ ] Research user content rights for reposting
- [ ] Investigate #ad requirements and thresholds
- [ ] Study state-by-state privacy laws
- [ ] Create terms of service draft
- [ ] Design user agreement flow
- [ ] Research insurance requirements

### Vendor Partnership Development

- [ ] Create vendor value proposition
- [ ] Design foot traffic tracking method
- [ ] Develop partnership agreements
- [ ] Create training materials
- [ ] Design signage concepts

### Future Considerations

#### Product Incubator Concept
- [ ] Define service offerings
- [ ] Create pricing model
- [ ] Design consultation framework
- [ ] Plan distribution network integration

#### Multi-City Expansion Planning
- [ ] Research target markets (Miami, LA, Nashville)
- [ ] Analyze demographic differences
- [ ] Create localization requirements
- [ ] Design regional partnership strategies

#### Service Expansion Beyond CPG
- [ ] Define service partnership model
- [ ] Create pilot frameworks
- [ ] Design experience verification
- [ ] Calculate different economics

### Technical Infrastructure

- [ ] Complete Firebase migration
- [ ] Set up Google Cloud infrastructure
- [ ] Implement monitoring and alerting
- [ ] Design backup and recovery procedures
- [ ] Create API documentation
- [ ] Set up development environments

### Marketing & Growth

- [ ] Create social media content calendar
- [ ] Design waitlist capture system
- [ ] Develop influencer outreach strategy (for brand owners)
- [ ] Create press kit and materials
- [ ] Design referral program mechanics
- [ ] Plan launch event/activation

---

## Status: Pre-Launch Phase | Pilot: August 2025

This handbook is a living document. Last updated: June 15, 2025

For questions or updates, contact Madison or Rob directly.