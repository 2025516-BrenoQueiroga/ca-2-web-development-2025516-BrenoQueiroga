// This imports Express, which is used to create the server.
const express = require("express");

// This imports SQLite, which is used as the local database.
const sqlite3 = require("sqlite3").verbose();

// This creates the Express application.
const app = express();

// This defines the port where the server will run.
const PORT = 3000;

// This allows the server to read JSON data sent by the frontend.
app.use(express.json());

// This allows the server to use files inside the public folder.
app.use(express.static("public"));

// This creates or opens the local SQLite database file.
const db = new sqlite3.Database("irietech.db");

// This creates the products table if it does not already exist.
db.run(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        image TEXT NOT NULL
    )
`);

// This removes old product data to avoid duplicate products when restarting the server.
db.run("DELETE FROM products");

// This adds simple product data into the database.
const products = [
    ["Rasta Gaming Headset", "Comfortable headset with clear sound for gaming sessions.", 49.99, "https://images.unsplash.com/photo-1599669454699-248893623440"],
    ["Irie RGB Keyboard", "Mechanical style keyboard with colourful lights.", 59.99, "https://images.unsplash.com/photo-1587829741301-dc798b83add3"],
    ["Zion Gaming Mouse", "Fast and accurate mouse for casual and competitive gaming.", 29.99, "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7"],
    ["Green Vibes Mousepad", "Large mousepad with smooth surface and simple design.", 19.99, "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2"],
    ["Streamer Microphone", "Simple microphone for gaming, streaming, and online calls.", 39.99, "https://images.unsplash.com/photo-1590602847861-f357a9332bbc"]
];

// This prepares the SQL command used to insert products.
const insertProduct = db.prepare(`
    INSERT INTO products (name, description, price, image)
    VALUES (?, ?, ?, ?)
`);

// This inserts each product into the database.
products.forEach(product => {
    insertProduct.run(product);
});

// This closes the prepared insert command.
insertProduct.finalize();

// This route sends all products from the database to the frontend.
app.get("/api/products", (req, res) => {
    db.all("SELECT * FROM products", [], (error, rows) => {
        if (error) {
            res.status(500).json({ error: "Database error" });
        } else {
            res.json(rows);
        }
    });
});

// This starts the server.
app.listen(PORT, () => {
    console.log(`IrieTech server is running at http://localhost:${PORT}`);
});