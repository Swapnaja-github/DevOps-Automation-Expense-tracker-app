import express from 'express';
import bodyParser from 'body-parser';
import expenseRoutes from './routes/expense.route';
import connectDB from './config/db.config';
import cors from 'cors';
import client from 'prom-client';
import { httpMetricsMiddleware } from './metrics';
import './metrics';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(httpMetricsMiddleware);
app.use('/api', expenseRoutes);

client.collectDefaultMetrics();

// /metrics endpoint for Prometheus to scrape
app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', client.register.contentType);
        const metrics = await client.register.metrics();
        res.end(metrics);
    } catch (ex) {
        const errorMessage = ex instanceof Error ? ex.message : 'An unknown error occurred';
        res.status(500).end(errorMessage);
    }
});

connectDB();

export default app;