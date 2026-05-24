require("dotenv").config(); // 🔐 Load env FIRST

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const NodeGeocoder = require("node-geocoder");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET;

// 🌍 Geocoder
const geocoder = NodeGeocoder({ provider: "openstreetmap" });

// 🛢️ DB Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) console.error("DB Error:", err);
    else console.log("MySQL Connected ✅");
});

// 📧 Email Setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

let otpStore = {};

// ================= OTP =================

app.post("/send-otp", async (req, res) => {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[email] = {
        otp: otp.toString(),
        expires: Date.now() + 5 * 60 * 1000
    };

    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "CivicSync OTP Verification",
            html: `
                <h2>Your OTP: ${otp}</h2>
                <p>Do NOT share this OTP.</p>
                <p>Valid for 5 minutes.</p>
            `
        });

        res.json({ success: true });
    } catch (err) {
        console.error("Email error:", err);
        res.status(500).json({ success: false });
    }
});

app.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;

    const record = otpStore[email];

    if (record && record.otp === otp && record.expires > Date.now()) {
        res.json({ success: true });
    } else {
        res.status(400).json({ success: false });
    }
});

// ================= AUTH =================

app.post("/register", async (req, res) => {
    const { first_name, last_name, email, password, otp } = req.body;

    if (!otpStore[email] || otpStore[email].otp !== otp) {
        return res.send("OTP Invalid ❌");
    }

    const hashed = await bcrypt.hash(password, 10);

    db.query(
        "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)",
        [first_name, last_name, email, hashed],
        err => {
            if (err) {
                console.error(err);
                return res.send("Registration Error ❌");
            }

            delete otpStore[email];
            res.send("Registered Successfully ✅");
        }
    );
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email=?", [email], async (err, result) => {
        if (result.length === 0) return res.send("User not found ❌");

        const user = result[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) return res.send("Wrong password ❌");

        res.json({
            success: true,
            name: user.first_name,
            email: user.email
        });
    });
});

// ================= COMPLAINT =================

app.post("/submit-complaint", async (req, res) => {
    const { user_name, user_email, category, location, description } = req.body;

    const ticket_id = "CS-" + Date.now();

    let latitude = 19.8762;
    let longitude = 75.3433;

    try {
        const geo = await geocoder.geocode(location);
        if (geo.length > 0) {
            latitude = geo[0].latitude;
            longitude = geo[0].longitude;
        }
    } catch { }

    const sql = `
        INSERT INTO complaints 
        (ticket_id, user_name, user_email, category, location, description, status, latitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?, ?)
    `;

    db.query(sql, [ticket_id, user_name, user_email, category, location, description, latitude, longitude], err => {
        if (err) {
            console.error(err);
            return res.json({ success: false });
        }

        res.json({ success: true, ticket_id });
    });
});

// ================= USER DASHBOARD =================

app.get("/complaints", (req, res) => {
    const { email } = req.query;

    db.query(
        "SELECT * FROM complaints WHERE user_email=? ORDER BY created_at DESC",
        [email],
        (err, result) => {
            if (err) return res.json([]);
            res.json(result);
        }
    );
});

// ================= TRACK =================

app.get("/track/:ticket_id", (req, res) => {
    const { ticket_id } = req.params;

    db.query("SELECT * FROM complaints WHERE ticket_id=?", [ticket_id], (err, result) => {
        if (result.length === 0) return res.json({});
        res.json(result[0]);
    });
});

// ================= HEATMAP =================

app.get("/api/complaints/locations", (req, res) => {
    db.query(
        "SELECT latitude as lat, longitude as lng, location as locationName FROM complaints WHERE latitude IS NOT NULL",
        (err, result) => {
            if (err) return res.json([]);

            const data = result.map(r => ({
                ...r,
                intensity: 1
            }));

            res.json(data);
        }
    );
});

// ================= ADMIN =================

app.post("/api/admin/login", (req, res) => {
    const { email, password } = req.body;

    if (email === "admin@civicsync.com" && password === "Admin@2026") {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.get("/api/admin/stats", (req, res) => {
    const sql = `
        SELECT 
        COUNT(*) as total,
        SUM(status='Pending') as pending,
        SUM(status='Resolved') as resolved
        FROM complaints
    `;

    db.query(sql, (err, result) => {
        res.json(result[0]);
    });
});

app.get("/api/admin/complaints", (req, res) => {
    db.query("SELECT * FROM complaints", (err, result) => {
        res.json(result);
    });
});

app.post("/api/admin/update-status", (req, res) => {
    const { id, status } = req.body;

    db.query(
        "UPDATE complaints SET status=? WHERE id=?",
        [status, id],
        () => res.json({ success: true })
    );
});

// ================= START =================

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});