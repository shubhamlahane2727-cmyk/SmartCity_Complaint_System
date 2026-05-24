const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345",
    database: "civicsync"
});

db.connect((err) => {
    if (err) {
        console.error("DB Connection Failed:", err);
        process.exit(1);
    }
    console.log("Connected to Database. Attempting to fix columns...");

    const alterSql = "ALTER TABLE complaints ADD latitude DECIMAL(10,8), ADD longitude DECIMAL(11,8);";
    db.query(alterSql, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_COLUMN_NAME') {
                console.log("Columns already exist! Skipping ALTER.");
            } else {
                console.error("Failed to add columns:", err.message);
            }
        } else {
            console.log("Successfully added latitude and longitude columns! ✅");
        }
        db.end();
    });
});
