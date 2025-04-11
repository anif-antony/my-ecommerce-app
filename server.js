const app = require('./app');
const dotenv = require('dotenv');
const path = require('path');
const connectDatabase = require('./config/database');

// ✅ Load environment variables
dotenv.config({ path: path.join(__dirname, 'config/config.env') });

// ✅ Connect to database
connectDatabase();

// ✅ Start server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// ✅ Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

// ✅ Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});
