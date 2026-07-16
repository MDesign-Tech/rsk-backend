const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);


require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


// require("dotenv").config();

// const app = require("./app");
// const serverless = require("serverless-http");

// module.exports = serverless(app);
