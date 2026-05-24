process.on('uncaughtException', err => {
  require('fs').writeFileSync('err.txt', err.stack || err.message || toString(err));
});

try {
  require('./server.js');
} catch (e) {
  require('fs').writeFileSync('err.txt', 'SYNC: ' + (e.stack || e.message));
}
