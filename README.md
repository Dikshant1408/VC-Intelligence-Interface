# VC Intelligence Interface

A premium, production-ready VC discovery platform with AI-powered live company enrichment.

## 🚀 Features

- **Dashboard**: High-level overview of your pipeline, market signals, and quick actions.
- **Company Discovery**: Advanced search, filtering (sector, stage), and sorting of companies.
- **Global Search**: Instant search across the entire platform from the header.
- **Live AI Enrichment**: Real-time data scraping and analysis using Gemini AI. Pulls summaries, keywords, and derived signals directly from company websites.
- **Company Profiles**: Detailed views with signals timeline, private notes, and list management.
- **Lists Management**: Create custom lists, export to CSV/JSON, and manage companies within lists.
- **Saved Searches**: Save complex filter configurations to re-run them later.
- **Bulk Actions**: Select multiple companies to add them to lists in one click.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React, Framer Motion.
- **Backend**: Express.js (serving API and frontend).
- **AI**: Google Gemini Pro (via `@google/genai`).
- **Persistence**: LocalStorage (for user data like lists, notes, and saved searches).

## 📦 Setup

1. **Environment Variables**:
   - `GEMINI_API_KEY`: Your Google Gemini API key.
   
2. **Installation**:
   ```bash
   npm install
   ```

3. **Development**:
   ```bash
   npm run dev
   ```

4. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

## 🎨 Design Philosophy

- **Premium Aesthetic**: Clean typography (Inter, Playfair Display), generous spacing, and subtle animations.
- **Workflow-First**: Designed around the core VC workflow: Discover -> Profile -> Enrich -> Action.
- **Fast Interactions**: Optimistic UI updates and smooth transitions using Framer Motion.

---
Built with ❤️ for the next generation of investors.
