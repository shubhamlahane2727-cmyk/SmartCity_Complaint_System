const mysql = require('mysql2');
try {
  const db = mysql.createConnection({host: 'localhost', user: 'root', password: '12345', database: 'civicsync'});
  
  db.on('error', err => {
    console.error('DB_ERROR_EVENT:', err.message);
  });

  db.connect(err => {
    if (err) {
      console.error('CONNECT_ERROR:', err.message);
      return;
    }
    db.query("ALTER TABLE complaints ADD COLUMN department VARCHAR(100) DEFAULT 'General'", (err) => {
      console.log('QUERY_RESULT:', err ? err.message : 'SUCCESS');
      db.end();
    });
  });
} catch(e) {
  console.error("CATCH_ERROR:", e.message);
}
