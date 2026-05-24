const fs = require('fs');
process.on('uncaughtException', err => {
    fs.writeFileSync('debug_err.txt', err.stack);
});
process.on('unhandledRejection', err => {
    fs.writeFileSync('debug_err.txt', err.stack || err.toString());
});
try {
    require('./server.js');
} catch(e) {
    fs.writeFileSync('debug_err.txt', e.stack);
}
