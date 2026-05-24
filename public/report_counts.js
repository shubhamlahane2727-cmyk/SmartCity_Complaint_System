const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345",
    database: "civicsync"
});

db.connect((err) => {
    if (err) {
        process.exit(1);
    }
    const sql = "SELECT COUNT(*) as total, SUM(CASE WHEN latitude IS NOT NULL THEN 1 ELSE 0 END) as geocoded FROM complaints;";
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
        } else {
            console.log(results[0]);
        }
        db.end();
    });
});
