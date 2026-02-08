import express from 'express';
import cookieparser from 'cookie-parser';
import cors from 'cors';
import routes from './interface-adapters/routes/routes.js';
import { globalErrorHandler } from './interface-adapters/middlewares/error.middleware.js';

export const app = express();

// middleware
app.use(express.json());
app.use(cookieparser());

app.use(cors({
    origin: ['https://pagestryonline.vercel.app', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use('/api', routes);

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(globalErrorHandler);