import mongoose from 'mongoose';
import dotenv from 'dotenv';
import client from 'prom-client';

dotenv.config();

// Create a Prometheus gauge to track MongoDB connection status:
// 1 means connected, 0 means disconnected.
const mongoConnectionGauge = new client.Gauge({
  name: 'mongo_connection_status',
  help: 'Indicates MongoDB connection status: 1 for connected, 0 for disconnected',
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI!, {
    });
    console.log('MongoDB connected');
    mongoConnectionGauge.set(1); // Set gauge to 1 on successful connection
  } catch (error) {
    console.error('MongoDB connection error:', error);
    mongoConnectionGauge.set(0); // Set gauge to 0 if connection fails
    process.exit(1);
  }
};

// Listen for disconnection and reconnection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  mongoConnectionGauge.set(0);
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
  mongoConnectionGauge.set(1);
});

export default connectDB;