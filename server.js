// ============================================================
// Threadline Platform - Server Entry Point
// Connects to MongoDB first, then starts the Express server.
// This is the main file that Railway will run via `npm start`.
// ============================================================

const app = require('./src/app');
const { port } = require('./src/config');
const connectDB = require('./src/db/mongoose');

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`🚀 Threadline API running on http://localhost:${port}`);
    console.log(`📄 Swagger docs at http://localhost:${port}/api/docs`);
  });
};

startServer();