# VC Intelligence Interface

A premium, production-ready VC discovery platform with AI-powered live company enrichment.

## 🚀 Features

- **Dashboard**: High-level overview of your pipeline, recent market signals, stats, and quick actions.
- **Company Discovery**: Paginated table with advanced search, filtering (sector, stage), and column sorting.
- **Global Search**: Instant header search across all companies with live dropdown results.
- **Live AI Enrichment**: Real-time analysis powered by Google Gemini 2.0 Flash. Fetches summaries, bullet-point breakdowns, keywords, and derived signals directly from a company's website using URL context grounding.
- **Company Profiles**: Detailed views with funding metadata, a colour-coded signals timeline, private per-company notes, and tag management.
- **Lists Management**: Create and name custom lists, add companies individually or in bulk, and export to CSV/JSON.
- **Saved Searches**: Persist complex filter configurations (query, sector, stage) to re-run them instantly.
- **Bulk Actions**: Select multiple companies on the discovery page and add them all to a list in one click.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite 6, Tailwind CSS v4 |
| **Routing** | React Router DOM v7 |
| **Animations** | Motion (Framer Motion) v12 |
| **Icons** | Lucide React |
| **Utilities** | clsx, tailwind-merge, date-fns |
| **Backend** | Express.js (serves both API and the Vite SPA) |
| **AI** | Google Gemini 2.0 Flash via `@google/genai` with URL context grounding |
| **Persistence** | Browser `localStorage` (lists, notes, saved searches, enrichment cache) |

## 📁 Project Structure

```
VC-Intelligence-Interface/
├── server.ts              # Express server + Gemini enrichment API
├── vite.config.ts         # Vite configuration with Tailwind CSS plugin
├── index.html             # SPA entry point
├── src/
│   ├── main.tsx           # React app bootstrap
│   ├── App.tsx            # Root layout (Sidebar, Header, Router)
│   ├── types.ts           # TypeScript interfaces and mock company data
│   ├── index.css          # Global styles
│   └── views/
│       ├── DashboardView.tsx       # Pipeline overview & signals feed
│       ├── CompaniesView.tsx       # Filterable, sortable company table
│       ├── CompanyProfileView.tsx  # Detailed company page with AI enrichment
│       ├── ListsView.tsx           # Custom list creation and management
│       └── SavedSearchesView.tsx   # Saved filter configuration management
└── .env.example           # Environment variable reference
```

## 📦 Setup

### Prerequisites

- **Node.js** v18 or later
- A **Google Gemini API key** (get one at [aistudio.google.com](https://aistudio.google.com))

### 1. Environment Variables

Copy the example file and fill in your key:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Your Google Gemini API key |
| `APP_URL` | (Optional) The URL where the app is hosted |

### 2. Installation

```bash
npm install
```

### 3. Development

Starts the Express server with Vite middleware for hot-module replacement:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build

```bash
npm run build   # Compiles React app into dist/
npm start       # Serves dist/ via Express on PORT (default 3000)
```

### 5. Type Check

```bash
npm run lint    # Runs tsc --noEmit
```

## 🔌 API Reference

### `POST /api/enrich`

Enriches a company profile using Google Gemini AI with URL context grounding.

**Request body:**

```json
{
  "url": "https://example.com",
  "companyName": "Example Corp"
}
```

**Response:**

```json
{
  "summary": "One-to-two sentence company overview.",
  "whatTheyDo": ["Bullet point 1", "Bullet point 2"],
  "keywords": ["keyword1", "keyword2"],
  "derivedSignals": ["Careers page active", "Recent blog posts"],
  "sources": [{ "url": "https://example.com", "timestamp": "2024-01-01T00:00:00.000Z" }]
}
```

Enrichment results are cached in `localStorage` per company and can be refreshed via the **Re-enrich** button.

## 📊 Data Model

### Signal Types

Each company can have multiple signals, each with one of the following types:

| Type | Description | Colour |
|------|-------------|--------|
| `funding` | Investment rounds and funding news | Green |
| `hiring` | Recruitment activity | Indigo |
| `product` | Product launches and updates | Amber |
| `news` | General news and press coverage | Gray |

### Company Stages

`Seed` · `Series A` · `Series B` · `Series C` · `Growth`

## 🎨 Design Philosophy

- **Premium Aesthetic**: Clean serif headings (Playfair Display), generous spacing, soft shadows, and rounded surfaces.
- **Workflow-First**: Designed around the core VC workflow — Discover → Profile → Enrich → Act.
- **Fast Interactions**: Smooth page transitions and staggered list animations via Motion (Framer Motion).
- **Persistent State**: User data (lists, notes, saved searches) survives page refreshes via `localStorage` without requiring a backend database.

---
Built with ❤️ for the next generation of investors.
