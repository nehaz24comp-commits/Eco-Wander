# Eco-Wander 🌿

Eco-Wander is a production-ready, eco-friendly travel planning platform designed to help travelers discover sustainable destinations, plan green trips, and estimate their carbon footprint.

## 🚀 Features

- **Landing Page**: Engaging hero section and features overview.
- **Authentication**: Secure JWT-based auth with bcrypt password hashing.
- **Dashboard**: Personalized welcome, eco-travel tips, and trending destinations.
- **City Search**: Real-time search for cities with images (Unsplash), attractions (OpenTripMap), and eco-friendly hotels.
- **Trip Planner**: Interactive budget calculator and duration selector.
- **Carbon Estimator**: CO₂ emission estimation for flights and car travel.
- **Trip Management**: Save, view, and delete your sustainable itineraries.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Material-UI v5, Tailwind CSS, React Router, Axios, Framer Motion.
- **Backend**: Node.js, Express, SQLite (better-sqlite3), JWT, Bcrypt.
- **APIs**: Unsplash, OpenTripMap, Carbon Interface (with mock fallbacks).

## 🔌 API Setup (Optional)

To enable real external data, add these keys to your `.env` file:

- `UNSPLASH_ACCESS_KEY`: From Unsplash Developer Portal.
- `OTM_API_KEY`: From OpenTripMap.
- `CARBON_INTERFACE_API_KEY`: From Carbon Interface.

If keys are missing, the app will gracefully fallback to high-quality mock data.

## 🛠️ 1-Click Setup

1. **Clone the repository**:
   ```cmd
   git clone <repo-url> eco-wander
   cd eco-wander
   ```

2. **Install dependencies**:
   ```cmd
   npm install
   ```

3. **Run the application**:
   ```cmd
   npm run dev
   ```

- **Backend & Frontend**: http://localhost:3000 (Vite serves the frontend and proxies API calls to Express).
- **Database**: Automatically initialized in `eco_wander.db`.

## 📄 Deployment

- **Backend**: Deploy to Render or Railway (ensure `NODE_ENV=production`).
- **Frontend**: Deploy to Vercel or Netlify (build command: `npm run build`).
- **Database**: SQLite is file-based; for production, consider persistent volumes or migrating to PostgreSQL.

---
Built with ❤️ for a greener planet.
