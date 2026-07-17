require("dotenv").config();

const app = require("./app");
const serverless = require("serverless-http");

module.exports = serverless(app);


// require('dotenv').config();
// const app = require('./app');
// const connectDB = require('./config/db');
// const seedData = require('./seed');

// const PORT = process.env.PORT || 5000;

// async function initServer(){
//   try{
//     await connectDB()
//     await seedData()
//     await app.listen(PORT, () => {
//   console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
// });

//   }catch(err){
//     process.on('unhandledRejection', (err) => {
//   console.log(`Error: ${err.message}`);
//   server.close(() => process.exit(1));
// });
//   }
// }
// initServer()