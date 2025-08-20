const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // your MySQL user
  password: "rit@43", // your MySQL password
  database: "admin_panel"
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL database");
});

// -------------------- Root Route --------------------
app.get("/", (req, res) => {
  res.send("🚀 Backend is running! Use /api/* routes");
});

// -------------------- Add Store --------------------
app.post("/api/stores", (req, res) => {
  const { name, email, address, rating } = req.body;
  if (!name || !email || !address || rating == null)
    return res.status(400).json({ error: "All fields are required" });

  db.query(
    "INSERT INTO stores (name,email,address,rating) VALUES (?,?,?,?)",
    [name, email, address, rating],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Store added successfully", id: result.insertId });
    }
  );
});

// -------------------- Get All Stores --------------------
app.get("/api/stores", (req, res) => {
  db.query("SELECT * FROM stores", (err, stores) => {
    if (err) return res.status(500).json({ error: err.message });

    const storeIds = stores.map(s => s.id);
    if (storeIds.length === 0) return res.json(stores);

    // Fetch user ratings for all stores
    db.query(
      "SELECT * FROM store_ratings",
      (err, ratings) => {
        if (err) return res.status(500).json({ error: err.message });

        const enrichedStores = stores.map(store => {
          const storeRatings = ratings.filter(r => r.storeId === store.id);
          const avgRating = storeRatings.length
            ? storeRatings.reduce((sum, r) => sum + r.rating, 0) / storeRatings.length
            : 0;

          return {
            ...store,
            rating: avgRating,
            userRatings: storeRatings // array of {userId, rating}
          };
        });

        res.json(enrichedStores);
      }
    );
  });
});

// -------------------- Submit / Update Rating --------------------
app.post("/api/stores/:storeId/rate", (req, res) => {
  const { storeId } = req.params;
  const { userId, rating } = req.body;

  if (!userId) return res.status(400).json({ error: "User not logged in" });
  if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: "Invalid rating" });

  // Insert or update rating
  db.query(
    `INSERT INTO store_ratings (storeId, userId, rating)
     VALUES (?,?,?)
     ON DUPLICATE KEY UPDATE rating=?`,
    [storeId, userId, rating, rating],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Rating saved successfully" });
    }
  );
});

// -------------------- 404 Handler --------------------
app.use((req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// -------------------- Start Server --------------------
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
