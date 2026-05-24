const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:8080';

const filesToFix = ['report.js', 'register.html', 'login.html', 'dashboard.html', 'admin.html', 'check_complaints.js'];

filesToFix.forEach(file => {
    let filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // Fix fetches
    content = content.replace(/fetch\(['"`]\/(?![\/])/g, `fetch('${API_BASE}/`);
    content = content.replace(/fetch\(\`\/(?![\/])/g, `fetch(\`${API_BASE}/`);
    
    // Fix forms (login.html and register.html) but the forms shouldn't just be action=, they need JS.
    // Let's just fix the fetch URLs first.
    fs.writeFileSync(filePath, content);
});
console.log("Replaced fetch commands.");
