import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from './auth.js';  // Import authentication routes

const app = express();
const port = 3000;

// Get the current file and directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Enable CORS for requests from the frontend (localhost:5173)
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Mount authentication routes
app.use(authRoutes);  // Use auth routes from auth.js

// Route to handle project folder creation
app.post('/create-project', (req, res) => {
    const { projectName } = req.body;

    if (!projectName) {
        return res.status(400).send('Project name is required');
    }

    const projectDir = path.join(__dirname, 'data', projectName);

    // Create the folder if it doesn't exist
    fs.mkdir(projectDir, { recursive: true }, (err) => {
        if (err) {
            console.error('Error creating project folder:', err);
            return res.status(500).send('Failed to create project folder');
        }

        res.status(200).send('Project folder created successfully');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
