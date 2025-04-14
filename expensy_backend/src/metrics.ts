// metrics.ts
import client from 'prom-client';
import Expense from './models/expense.model';
import { Request, Response, NextFunction } from 'express';

// Create a gauge metric to track the total number of expenses.
const expensesCountGauge = new client.Gauge({
    name: 'expenses_total',
    help: 'Total number of expenses recorded',
});

// Function to query and update the expenses count.
export async function updateExpensesCount(): Promise<void> {
    try {
        // Assumes Expense is a Mongoose model with a countDocuments() method.
        const count = await Expense.countDocuments();
        expensesCountGauge.set(count);
    } catch (error) {
        console.error('Error updating expenses count:', error);
    }
}

// Define the update interval in milliseconds (e.g., 60000 ms for one minute).
const UPDATE_INTERVAL_MS: number = 60000;

// Start periodic updates for the expenses count metric.
setInterval(updateExpensesCount, UPDATE_INTERVAL_MS);

updateExpensesCount();

// Overall HTTP requests counter without labels.
const totalHttpRequestsCounter = new client.Counter({
    name: 'http_requests_overall_total',
    help: 'Overall total number of HTTP requests',
});

// Counter with labels for detailed HTTP request tracking.
const httpRequestsCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests with labels',
    labelNames: ['method', 'route', 'statusCode'],
});

// Express middleware to update the HTTP requests counter.
export function httpMetricsMiddleware(req: Request, res: Response, next: NextFunction): void {
    // After the response is sent, update the counter.
    res.on('finish', () => {
        // Use the HTTP method.
        const method = req.method;
        // Use originalUrl if available; otherwise, fallback to req.url.
        const route = req.originalUrl || req.url;
        // Convert the status code to a string (for labeling).
        const statusCode = res.statusCode.toString();

        // Increment the labeled counter.
        httpRequestsCounter.labels(method, route, statusCode).inc();

        // Increment the overall counter.
        totalHttpRequestsCounter.inc();
    });
    next();
}