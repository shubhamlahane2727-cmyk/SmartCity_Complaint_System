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

    // Check columns
    db.query("SHOW COLUMNS FROM complaints LIKE 'estimated_resolution'", (err, results) => {
        if (err) {
            console.error(err);
            db.end();
            return;
        }
        
        if (results.length === 0) {
            db.query("ALTER TABLE complaints ADD COLUMN estimated_resolution VARCHAR(50) DEFAULT NULL", (err) => {
                if (err) console.error("Error adding column:", err.message);
                else console.log("Added estimated_resolution column.");
                nextSteps();
            });
        } else {
            console.log("Column 'estimated_resolution' already exists.");
            nextSteps();
        }
    });

    function nextSteps() {
        // Also add complaint_updates table if not exists
        const sqlCreateTable = `
        CREATE TABLE IF NOT EXISTS complaint_updates (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ticket_id VARCHAR(50) NOT NULL,
            status VARCHAR(50) NOT NULL,
            update_text TEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;
        
        db.query(sqlCreateTable, (err, result) => {
            if (err) {
                console.error("Error creating complaint_updates table:", err.message);
            } else {
                console.log("complaint_updates table ready.");
            }
            db.end();
        });
    }
});
