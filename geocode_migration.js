const mysql = require("mysql2");
const NodeGeocoder = require('node-geocoder');

const geocoder = NodeGeocoder({ provider: 'openstreetmap' });

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345",
    database: "civicsync"
});

db.connect(async (err) => {
    if (err) {
        console.error("DB connection failed:", err);
        process.exit(1);
    }
    console.log("Connected to DB. Starting geocode migration with cleaning...");

    const findSql = "SELECT id, location FROM complaints WHERE latitude IS NULL OR longitude IS NULL";
    db.query(findSql, async (err, results) => {
        if (err || results.length === 0) {
            console.log("No pending geocode targets.");
            db.end();
            return;
        }

        console.log(`Found ${results.length} records. Working...`);

        for (let row of results) {
            try {
                // Cleaning location like "Shahganj / City Chowk" -> "Shahganj"
                const cleanLoc = row.location.split('/')[0].trim();
                const geoRes = await geocoder.geocode(`${cleanLoc}, Chhatrapati Sambhajinagar, Maharashtra, India`);
                
                if (geoRes && geoRes.length > 0) {
                    const updateSql = "UPDATE complaints SET latitude = ?, longitude = ? WHERE id = ?";
                    db.query(updateSql, [geoRes[0].latitude, geoRes[0].longitude, row.id]);
                    console.log(`✅ Geocoded ID ${row.id}: [${cleanLoc}]`);
                } else {
                    console.warn(`❌ No results for ID ${row.id}: [${cleanLoc}]`);
                    // If still no results, fallback to midpoint of the city so it shows on map
                    const fallbackSql = "UPDATE complaints SET latitude = 19.8762, longitude = 75.3433 WHERE id = ?";
                    db.query(fallbackSql, [row.id]);
                }
            } catch (e) {
                console.error(`⚠️ Failed geocode for ID ${row.id}:`, e.message);
            }
            await new Promise(res => setTimeout(res, 1000));
        }

        console.log("Migration complete!");
        db.end();
    });
});
