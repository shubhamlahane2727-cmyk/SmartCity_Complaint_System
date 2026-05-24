const mysql = require('mysql2');
const db = mysql.createConnection({host: 'localhost', user: 'root', password: '12345', database: 'civicsync'});

db.connect(e => {
    if(e) {
        console.error('Connect error:', e);
        process.exit(1);
    }
    db.query("ALTER TABLE complaints ADD COLUMN department VARCHAR(100) DEFAULT 'General'", (err) => {
        console.log('Query err:', err);
        process.exit(0);
    });
});
