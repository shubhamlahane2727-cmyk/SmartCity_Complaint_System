const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345",
    database: "civicsync"
});

db.connect((err) => {
    if (err) {
        console.error("DB Connection Failed:", err.message);
        process.exit(1);
    }
    console.log("Connected to database.");

    // Add user_email to complaints
    db.query("SHOW COLUMNS FROM complaints LIKE 'user_email'", (err, results) => {
        if (err) {
            console.error(err);
            db.end();
            return;
        }
        
        if (results.length === 0) {
            db.query("ALTER TABLE complaints ADD COLUMN user_email VARCHAR(100) DEFAULT NULL", (err) => {
                if (err) console.error("Error adding user_email col:", err.message);
                else console.log("Added user_email column.");
                db.end();
            });
        } else {
            console.log("Column 'user_email' already exists.");
            db.end();
        }
    });
});
