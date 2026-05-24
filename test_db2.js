const mysql = require('mysql2');
const db = mysql.createConnection({host: 'localhost', user: 'root', password: '12345', database: 'civicsync'});
db.query("ALTER TABLE complaints ADD COLUMN department VARCHAR(100) DEFAULT 'General'", err => {
  if (err) console.log("ERROR IS:", err.code, err.message);
  else console.log("SUCCESS");
  db.end();
});
