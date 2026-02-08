import dotenv from 'dotenv';
dotenv.config();

import { initializeFirebase } from './infrastructure/config/firebase.config.js';
import { initializeDatabase } from './infrastructure/config/database.config.js';
import { createServer } from 'http';
import { app } from './app.js';

initializeFirebase();

const server = createServer(app);

const PORT = process.env.PORT;

(async () => {
  try {
    await initializeDatabase();

    server.listen(PORT, () => {
      console.log(`Server running on https://pagestry-server.onrender.com/`)
    })
  } catch (error) {
    console.error('Unexpected error during startup:', error);
  }
})();