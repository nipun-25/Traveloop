# Traveloop ✈️

**Traveloop** is a premium, all-in-one travel planning platform designed to transform the way you organize your journeys. From detailed itinerary building to smart budget tracking and packing checklists, Traveloop provides a seamless, luxe experience for modern travelers.

## ✨ Features

- 🗺️ **Itinerary Builder**: Create day-wise plans with activities and location tracking.
- 💰 **Budget Management**: Track your spending with dynamic category breakdowns.
- 🎒 **Smart Packing Checklist**: Interactive lists to ensure you never leave anything behind.
- 📝 **Integrated Notes**: Keep your travel journals and important reminders in one place.
- 🔗 **Public Sharing**: Generate secure, read-only links to share your itineraries with friends.
- 📊 **Admin Analytics**: Real-time insights into user engagement and popular destinations.

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Framer Motion
- **Styling**: Vanilla CSS (Custom Luxe Theme), Lucide Icons
- **Backend**: Supabase (Authentication & PostgreSQL)
- **Database**: PostgreSQL with Row-Level Security (RLS)
- **Deployment**: [Vercel (Live Preview)](https://traveloop-black.vercel.app)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- A Supabase account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nipun-25/Traveloop.git
   cd Traveloop
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```text
Traveloop/
├── src/
│   ├── app/           # Next.js App Router (Pages & Layouts)
│   ├── components/    # Reusable UI Components
│   ├── lib/           # Supabase client & utility functions
│   ├── types/         # TypeScript definitions
│   └── styles/        # Global CSS & theme tokens
├── public/            # Static assets
├── docs/              # Project documentation & reviews
└── next.config.ts     # Project configurations
```

## 📸 Screenshots
*(Add high-quality screenshots here to showcase the premium UI)*

## 🔮 Future Scope

- 🌍 **Multi-currency Support**: Automatic currency conversion for budget tracking.
- 🤝 **Collaborative Planning**: Real-time co-editing for group trips.
- 📱 **PWA Support**: Offline access for travelers on the go.
- 🤖 **AI Suggestions**: Smart itinerary generation based on user preferences.

---
*Developed as a professional travel management solution.*
