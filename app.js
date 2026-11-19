const http = require("http");
const fs = require("fs");
const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "smartcity",
    waitForConnections: true,
    connectionLimit: 10
});

const server = http.createServer(async (req, res) => {

    res.setHeader("Content-Type", "application/json");

    if (req.url === "/api/logs") {
        try {
            const [rows] = await db.query(
                "SELECT * FROM log_sensor ORDER BY id DESC"
            );

            res.writeHead(200);
            res.end(JSON.stringify(rows));

        } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({
                message: "Gagal mengambil data database"
            }));
        }

    } else if (req.url === "/") {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(fs.readFileSync("index.html"));

    } else {
        res.writeHead(404);
        res.end(JSON.stringify({
            message: "Halaman tidak ditemukan"
        }));
    }
});

server.listen(3000, "0.0.0.0", () => {
    console.log("Smart City berjalan di http://localhost:3000");
});