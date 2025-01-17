import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connectDB from './database/db';

// Dotenv configuration
dotenv.config();

// Database connection
connectDB();

// Express app and server
const app = express();
const server = createServer(app);

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(bodyParser.json());

// Port definition
const PORT = process.env.PORT || 3000;

// Start the server
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

server.on('error', (error: Error) => {
    console.error('An error occurred:', error.message);
});