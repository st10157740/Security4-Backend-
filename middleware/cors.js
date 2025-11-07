const cors = require('cors');

module.exports = function(app) {
  app.use(cors({
    origin: 'https://localhost:5173', // frontend URL
    credentials: true
  }));
};
