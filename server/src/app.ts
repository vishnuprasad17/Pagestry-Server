import express from 'express';
import cookieparser from 'cookie-parser';
import cors from 'cors';
import { fileURLToPath } from "url";
import path from 'path';
import routes from './interface-adapters/routes/routes.js';
import { globalErrorHandler } from './interface-adapters/middlewares/error.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

// middleware
app.use(express.json());
app.use(cookieparser());

app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}))

app.use('/api', routes);
app.use(globalErrorHandler);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname,'../../Client/index.html'));
});