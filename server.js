const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

require("dotenv").config();
const serverless = require('serverless-http'); // Added this missing import
const app = require("./app");
const connectDB = require('./config/db');

// 1. Export for serverless environments (e.g., Vercel)
module.exports = serverless(app);

// 2. Run local server wrapper only if NOT running on a serverless platform
if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  
  async function initLocalServer() {
    try {
      await connectDB();
      app.listen(PORT, () => {
        console.log(`Server running locally in development mode on port ${PORT}`);
      });
    } catch (err) {
      console.error(`Database connection failed: ${err.message}`);
    }
  }
  
  initLocalServer();
}

// const dns = require('node:dns');
// dns.setServers(['8.8.8.8', '1.1.1.1']);


// require("dotenv").config();

// const app = require("./app");

// module.exports = serverless(app);
