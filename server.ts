import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("viralstudio.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    plan TEXT DEFAULT 'free',
    usage_count INTEGER DEFAULT 0,
    last_reset TEXT
  );

  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    type TEXT,
    title TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Simple user session simulation (in a real app, this would be OAuth/JWT)
  const MOCK_USER_ID = "user_123";

  // Ensure mock user exists
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(MOCK_USER_ID);
  if (!user) {
    db.prepare("INSERT INTO users (id, plan, usage_count) VALUES (?, ?, ?)").run(MOCK_USER_ID, 'free', 0);
  }

  // API Routes
  app.get("/api/user", (req, res) => {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(MOCK_USER_ID);
    res.json(user);
  });

  app.get("/api/projects", (req, res) => {
    const projects = db.prepare("SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC").all(MOCK_USER_ID);
    res.json(projects);
  });

  app.post("/api/projects", (req, res) => {
    const { id, type, title, content } = req.body;
    
    // Check usage limits
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(MOCK_USER_ID);
    let canProceed = false;
    
    if (user.plan === 'free' && user.usage_count < 3) {
      canProceed = true;
    } else if (user.plan === 'pro' && user.usage_count < 3) { // Simplified daily limit for demo
      canProceed = true;
    } else if (user.plan === 'premium') {
      canProceed = true;
    }

    if (!canProceed) {
      return res.status(403).json({ error: "Limite de uso atingido para o seu plano." });
    }

    db.prepare("INSERT INTO projects (id, user_id, type, title, content) VALUES (?, ?, ?, ?, ?)")
      .run(id, MOCK_USER_ID, type, title, JSON.stringify(content));
    
    db.prepare("UPDATE users SET usage_count = usage_count + 1 WHERE id = ?").run(MOCK_USER_ID);
    
    res.json({ success: true });
  });

  app.post("/api/upgrade", (req, res) => {
    const { plan } = req.body;
    db.prepare("UPDATE users SET plan = ?, usage_count = 0 WHERE id = ?").run(plan, MOCK_USER_ID);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
