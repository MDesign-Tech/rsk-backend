require("dotenv").config();

const app = require("./app");
const serverless = require("serverless-http");

module.exports =     serverless(app);


// require('dotenv').config();
// const app = require('./app');
// const connectDB = require('./config/db');
// const seedData = require('./seed');
// const { verifyTransporter } = require('./src/utils/emailService');

// const PORT = process.env.PORT || 5000;

// async function initServer(){
//   try{
//     await connectDB()
//     await seedData()

//     // Verify SMTP connection at startup (non-blocking — logs warning on failure)
//     verifyTransporter()
//       .then(() => {
//         console.log('[server] Email service is ready');
//       })
//       .catch((err) => {
//         console.error('[server] WARNING: Email service is not available:', err.message);
//       });

//     await app.listen(PORT, () => {
//       console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
//     });

//   }catch(err){
//     process.on('unhandledRejection', (err) => {
//   console.log(`Error: ${err.message}`);
//   server.close(() => process.exit(1));
// });
//   }
// }
// initServer()