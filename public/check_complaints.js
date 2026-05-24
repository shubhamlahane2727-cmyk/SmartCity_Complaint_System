const mysql = require("mysql2");
const db = mysql.createConnection({
    host: "localhost", user: "root", password: "12345", database: "civicsync"
});
db.connect((err) => {
    if (err) { console.log("ERR:", err.message); process.exit(1); }
    db.query("SELECT ticket_id, user_name, user_email, category, status FROM complaints", (err, rows) => {
        if (err) console.log("Query Error:", err.message);
        else {
            console.log("COMPLAINTS COUNT:", rows.length);
            rows.forEach(r => console.log(`  ${r.ticket_id} | ${r.user_name} | ${r.user_email} | ${r.category} | ${r.status}`));
        }
        db.end(() => process.exit(0));
    });
});
