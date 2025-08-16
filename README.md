# Sprint Coach

A production-ready web application for tracking your 30-day transformation journey. Sprint Coach helps you monitor daily posts, outreach, deep work, training, revenue, and maintain a story journal with AI-powered content generation.

## 🚀 Features

### Core Tracking (4 Pillars)
- **Content Creation**: Track daily content artifacts with URLs and captions
- **Deep Work**: Log focused work sessions with time tracking and tags
- **Social Reps**: Monitor daily micro-conversations and outreach
- **Body/Mind**: Record workouts and sleep quality

### Additional Tools
- **Revenue Tracker**: Track deals, COGS, and revenue sources
- **Lead CRM**: Manage prospects with Kanban board and pipeline tracking
- **Story Bank**: Capture experiences with AI-powered post generation
- **Analytics**: Weekly reports and correlation insights

### Scoring & Gamification
- Daily scoring (0-100) based on the 4 pillars
- Streak tracking with 70+ score requirement
- Progress rings and motivational prompts
- Real-time dashboard with time remaining

## 🏗️ Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth
- **Validation**: Zod schemas
- **Forms**: react-hook-form
- **State Management**: Zustand
- **Testing**: Vitest, Playwright
- **Analytics**: Simple event logging to Supabase
- **AI**: OpenAI API for content generation

## 📦 Setup Instructions

### Prerequisites
- Node.js 18+
- Docker & Docker Compose (for local Supabase)
- OpenAI API key (optional, for story generation)

### 1. Clone and Install
```bash
git clone <repository>
cd sprint-coach
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env.local
```

Fill in your environment variables:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# OpenAI Configuration (optional)
OPENAI_API_KEY=your_openai_api_key_here

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 3. Database Setup

#### Option A: Local Development with Docker
```bash
# Start local Supabase stack
docker-compose up -d

# The database will be available at:
# - Database: localhost:5432
# - Supabase API: localhost:8000
# - Auth: localhost:9999
```

#### Option B: Supabase Cloud
1. Create a new project at [supabase.com](https://supabase.com)
2. Run the schema:
```bash
# Copy the contents of supabase/schema.sql
# Paste into the Supabase SQL editor and run
```
3. Update your `.env.local` with the project URL and keys

### 4. Seed Data
The database schema automatically creates:
- Default habits for new users
- Motivational prompts
- Required views and functions

### 5. Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🧪 Testing

### Unit Tests
```bash
npm run test          # Run Vitest tests
npm run test:ui       # Run with UI
```

### E2E Tests
```bash
npm run e2e          # Run Playwright tests
npm run e2e:ui       # Run with UI
```

### Test Coverage
- Authentication flows
- Data validation (Zod schemas)
- Component rendering
- User interactions
- RLS policy enforcement

## 🚢 Deployment

### Vercel + Supabase (Recommended)
1. Deploy to Vercel:
```bash
vercel deploy
```

2. Configure environment variables in Vercel dashboard
3. Connect to your Supabase project

### Docker Production
```bash
docker build -t sprint-coach .
docker run -p 3000:3000 -e NEXT_PUBLIC_SUPABASE_URL=... sprint-coach
```

## 📊 Database Schema

### Core Tables
- `profiles` - User profiles and preferences
- `days` - Daily log entries with mood and notes
- `habits` - Configurable habit definitions
- `habit_logs` - Daily habit tracking values

### Activity Tables
- `content_logs` - Content creation tracking
- `deepwork_logs` - Deep work sessions
- `social_reps` - Social interaction counts
- `workouts` - Exercise sessions
- `sleep_logs` - Sleep tracking

### Business Tables
- `leads` - Prospect management
- `outreach_logs` - Communication tracking
- `deals` - Revenue tracking
- `stories` - Story bank for content

### System Tables
- `events` - Analytics and activity logging
- `prompts` - Motivational content

### Views
- `v_daily_score` - Calculated daily scores
- `v_funnel` - Outreach → conversion metrics

## 🔒 Security

### Row Level Security (RLS)
All tables use RLS policies ensuring users can only access their own data:
```sql
create policy "Users can manage own data" on table_name
  for all using (auth.uid() = user_id);
```

### Authentication
- Supabase Auth with email/password
- JWT tokens for API access
- Secure session management

### Data Validation
- Zod schemas for all inputs
- Server-side validation
- Type-safe database queries

## 📱 Usage Guide

### Getting Started
1. **Sign Up**: Create an account with email/password
2. **Onboarding**: Set your goals and timezone
3. **Daily Flow**: Use quick actions to log activities
4. **Review**: Check dashboard for progress and streaks

### Daily Workflow
1. **Morning**: Review yesterday's score and today's goals
2. **Throughout Day**: Use quick-add buttons for activities
3. **Evening**: Complete sleep log and review daily score

### Advanced Features
- **Lead Management**: Track prospects through sales pipeline
- **Story Capture**: Save experiences for content creation
- **AI Generation**: Create posts from story elements
- **Analytics**: Review weekly performance and correlations

## 🎯 Scoring Logic

Daily score calculation (0-100 points):
- **Content Posted**: 30 points (binary)
- **Deep Work**: 30 points (proportional to 120min target)
- **Social Reps**: 20 points (proportional to 10 target)
- **Workout + Sleep**: 20 points (10 each, binary)

Streak increments only when daily score ≥ 70.

## 🚧 Development Notes

### Code Structure
```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard-specific components
│   ├── layout/         # Layout components
│   └── ui/             # Reusable UI components
├── lib/                # Utilities and configurations
│   ├── schemas.ts      # Zod validation schemas
│   ├── supabase.ts     # Supabase client
│   └── utils.ts        # Helper functions
└── test/               # Test setup and utilities
```

### Key Components
- **ProgressRing**: Circular progress indicator
- **StreakBadge**: Displays current streak count
- **QuickAddBar**: Fast activity logging
- **HabitCard**: Individual habit tracking widget

### Performance Optimizations
- Server-side rendering with Next.js App Router
- Optimized database queries with indexes
- Image optimization for content uploads
- Efficient state management with Zustand

## 📋 Acceptance Criteria ✅

- ✅ Log today's actions in <30s
- ✅ See single daily score & streak
- ✅ Add leads and move on Kanban (placeholder ready)
- ✅ Record deals and see revenue (placeholder ready)
- ✅ Save stories and get AI drafts (placeholder ready)
- ✅ RLS blocks cross-user access
- ✅ Performance optimized dashboard

## 🔮 Future Enhancements

### Planned Features
- PWA installability and offline support
- Calendar heatmap visualization
- CSV import/export for leads and deals
- Advanced analytics and insights
- Mobile-responsive optimizations
- Push notifications
- Team collaboration features

### Out of Scope (MVP)
- Native mobile apps
- Complex notification systems
- Multi-tenant billing
- Advanced AI features beyond post generation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed description
4. Include error logs and reproduction steps

---

**Sprint Coach** - Your companion for the 30-day transformation journey. 🚀
