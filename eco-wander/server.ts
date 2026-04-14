import express from "express";
import path from "path";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "eco-wander-secret-key";

// Database Setup
const db = new Database("eco_wander.db");
db.pragma("journal_mode = WAL");

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    city TEXT NOT NULL,
    hotelName TEXT,
    hotelPrice REAL,
    duration INTEGER,
    budget REAL,
    carbonFootprint REAL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS saved_trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    tripId INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (tripId) REFERENCES trips(id)
  );

  CREATE TABLE IF NOT EXISTS search_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    query TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`);

app.use(cors());
app.use(express.json());

// Middleware: Auth
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

// --- API ROUTES ---

// Auth
app.post("/api/auth/signup", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)");
    const info = stmt.run(email, hashedPassword, name);
    const token = jwt.sign({ id: info.lastInsertRowid, email, name }, JWT_SECRET);
    res.json({ token, user: { id: info.lastInsertRowid, email, name } });
  } catch (error: any) {
    res.status(400).json({ error: error.message.includes("UNIQUE") ? "Email already exists" : "Signup failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user: any = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET);
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

// Search & External APIs
app.get("/api/search/city", async (req, res) => {
  const { q, userId } = req.query;
  if (!q) return res.status(400).json({ error: "Query required" });

  // Log search history
  if (userId) {
    db.prepare("INSERT INTO search_history (userId, query) VALUES (?, ?)").run(userId, q);
  }

  try {
    // 1. Unsplash Images
    let images = [];
    try {
      const unsplashRes = await axios.get(`https://api.unsplash.com/search/photos`, {
        params: { query: `${q} eco nature`, client_id: process.env.UNSPLASH_ACCESS_KEY },
      });
      images = unsplashRes.data.results.map((img: any) => img.urls.regular);
    } catch (e) {
      images = [
        `https://picsum.photos/seed/${q}1/800/600`,
        `https://picsum.photos/seed/${q}2/800/600`,
        `https://picsum.photos/seed/${q}3/800/600`,
      ];
    }

    // 2. OpenTripMap Attractions
    let attractions = [];
    try {
      const otmRes = await axios.get(`https://api.opentripmap.com/0.1/en/places/geoname`, {
        params: { name: q, apikey: process.env.OTM_API_KEY || "5ae2e3f221c38a28845f05b6e4e5e8e9e8e9e8e9e8e9e8e9e8e9e8e9" },
      });
      const { lat, lon } = otmRes.data;
      const listRes = await axios.get(`https://api.opentripmap.com/0.1/en/places/radius`, {
        params: { radius: 5000, lon, lat, format: "json", limit: 5, apikey: process.env.OTM_API_KEY || "5ae2e3f221c38a28845f05b6e4e5e8e9e8e9e8e9e8e9e8e9e8e9e8e9" },
      });
      attractions = listRes.data.map((a: any) => ({ name: a.name, kinds: a.kinds }));
    } catch (e) {
      attractions = [
        { name: "Eco Park", kinds: "nature,park" },
        { name: "Green Museum", kinds: "culture,museum" },
        { name: "Sustainable Garden", kinds: "nature,garden" },
      ];
    }

    // 3. Mock Hotels (TripAdvisor fallback)
    const hotels = [
      { name: "Eco Lodge " + q, price: 120, rating: 4.5, ecoFriendly: true },
      { name: "Green Suites", price: 200, rating: 4.8, ecoFriendly: true },
      { name: "Nature Retreat", price: 80, rating: 4.2, ecoFriendly: true },
    ];

    res.json({ images, attractions, hotels });
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
});

// Carbon Estimation
app.post("/api/carbon/estimate", async (req, res) => {
  const { type, distance } = req.body; // type: flight, car, etc.
  try {
    // Mock calculation if API key missing
    if (!process.env.CARBON_INTERFACE_API_KEY) {
      const factor = type === "flight" ? 0.15 : 0.1;
      return res.json({ carbon_kg: (distance * factor).toFixed(2) });
    }
    // Real API call would go here
    res.json({ carbon_kg: (distance * 0.12).toFixed(2) });
  } catch (error) {
    res.json({ carbon_kg: 50.0 });
  }
});

// Trips
app.post("/api/trips", authenticateToken, (req: any, res) => {
  const { city, hotelName, hotelPrice, duration, budget, carbonFootprint } = req.body;
  const stmt = db.prepare(`
    INSERT INTO trips (userId, city, hotelName, hotelPrice, duration, budget, carbonFootprint)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(req.user.id, city, hotelName, hotelPrice, duration, budget, carbonFootprint);
  res.json({ id: info.lastInsertRowid });
});

app.get("/api/trips", authenticateToken, (req: any, res) => {
  const trips = db.prepare("SELECT * FROM trips WHERE userId = ? ORDER BY createdAt DESC").all(req.user.id);
  res.json(trips);
});

app.delete("/api/trips/:id", authenticateToken, (req: any, res) => {
  db.prepare("DELETE FROM trips WHERE id = ? AND userId = ?").run(req.params.id, req.user.id);
  res.json({ success: true });
});

// --- VITE MIDDLEWARE ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
