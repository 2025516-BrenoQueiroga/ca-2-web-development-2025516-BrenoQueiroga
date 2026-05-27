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
    ["HYPERX Cloud III S Wireless Gaming Headset", "Comfortable headset with clear sound for gaming sessions.", 149.99, "https://media.currys.biz/i/currysprod/M10286101_black?$l-large$&fmt=auto"],
    ["Ajazz AK680 MAX Magnetic Mechanical Keyboard", "Mechanical style keyboard with colourful lights.", 49.99, "https://mobspares.com/cdn/shop/files/TBD0606342706.jpg?v=1773668755&width=700"],
    ["Steel Series Prime Wireless Gaming Mouse", "Fast and accurate mouse for casual and competitive gaming.", 49.99, "https://images.ctfassets.net/hmm5mo4qf4mf/3efDB6CHu0PycWNEvJ4eGT/eeb038610a169522f367f1ab6d040041/buyimg_prime_wl_005.png__1920x1080_crop-fit_optimize_subsampling-2-781.png?fm=webp&q=90&fit=scale&w=1200"],
    ["Neon Vibes Mousepad", "Large mousepad with smooth surface and simple design.", 19.99, "https://m.media-amazon.com/images/I/71svGf+rhGL._AC_SL1500_.jpg"],
    ["HyperX QuadCast 2 S", "Simple microphone for gaming, streaming, and online calls.", 139.99, "https://m.media-amazon.com/images/I/71yLcw8yj6L._AC_SL1500_.jpg"]
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