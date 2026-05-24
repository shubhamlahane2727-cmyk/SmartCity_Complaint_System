try {
    require('./server.js');
} catch (err) {
    require('fs').writeFileSync('startup_error.txt', err.stack);
}
