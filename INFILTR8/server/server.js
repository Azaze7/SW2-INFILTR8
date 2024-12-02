/**
 * The `server.js` file serves as the central hub for the INFILTR8 backend server, managing core functionality 
 * such as file handling, project operations, and routing. It sets up the necessary middleware, routes, and 
 * configurations to enable seamless backend processes. Key features include:
 * 
 * - **Server Initialization**:
 *   - Configures Express.js to handle incoming requests, parse JSON payloads, and enable CORS for communication with the frontend.
 *   - Ensures essential directories (`data` and `uploads`) are created at startup to avoid runtime errors.
 *   - Establishes a connection to the Neo4j database using secure credentials from environment variables.
 * 
 * - **Middleware and Routing**:
 *   - Integrates middleware for file uploads using Multer.
 *   - Mounts external route handlers for authentication (`auth.js`) and logging functionality (`logendpoints.js`).
 * 
 * - **File Upload and Processing**:
 *   - Endpoint: `/upload-nessus`
 *   - Handles `.nessus` file uploads, processes them via an external Python script, and stores the results in project-specific directories.
 *   - Provides robust error handling for file operations and script execution issues.
 * 
 * - **Project Management**:
 *   - Endpoints:
 *     - `/create-project`: Creates new directories to organize project-specific data.
 *     - `/projects`: Lists all existing project folders for easy retrieval.
 *     - `/delete-project`: Removes project directories and their contents when no longer needed.
 *   - Ensures validation and error handling for project names and file operations.
 * 
 * - **Error and Exception Handling**:
 *   - Captures and logs uncaught exceptions and unhandled promise rejections to prevent server crashes.
 *   - Manages file system and database errors gracefully, delivering meaningful responses to the client.
 * 
 * This file acts as the backbone of the INFILTR8 backend, ensuring efficient and reliable management of data, 
 * projects, and user interactions while providing a stable infrastructure for the system’s workflows.
 */

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import { exec } from 'child_process';
import csv from 'csv-parser';  
import neo4j from 'neo4j-driver';  
import authRoutes from './auth.js';  
import logEndPoints from './logendpoints.js';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create necessary directories if they don't exist
const dataDir = path.join(__dirname, 'data');
const uploadsDir = path.join(__dirname, 'uploads');

[dataDir, uploadsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
});

// Middleware setup
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Disposition']
}));

// Setup Neo4j connection
const neo4jDriver = neo4j.driver(
    process.env.NEO4J_URI,  
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Mount routes
app.use(authRoutes);
app.use(logEndPoints);

// File upload and processing endpoint
app.post('/upload-nessus', upload.single('nessusFile'), (req, res) => {
    const { projectName } = req.body;

    if (!projectName) {
        return res.status(400).send('Project name is required');
    }

    const projectDir = path.join(__dirname, 'data', projectName);

    // Move the .nessus file into the project folder
    const nessusFilePath = path.join(projectDir, req.file.originalname);
    fs.rename(req.file.path, nessusFilePath, (err) => {
        if (err) {
            console.error('Error moving Nessus file:', err);
            return res.status(500).send('Failed to move Nessus file');
        }

        const scriptPath = path.resolve(__dirname, '../scripts/maing.py'); // Ensure the script path is correct

        // Execute the Python script to process the file and generate CSV inside the project folder
        exec(`python3 ${scriptPath} ${nessusFilePath} ${projectDir}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Execution error: ${error}`);
                return res.status(500).send('Error processing Nessus file');
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            res.send('Nessus file processed and CSV files saved in the project folder');
        });
    });
});

// Project management endpoints
app.post('/create-project', (req, res) => {
    const { projectName } = req.body;

    if (!projectName) {
        return res.status(400).send('Project name is required');
    }

    const projectDir = path.join(__dirname, 'data', projectName);

    fs.mkdir(projectDir, { recursive: true }, (err) => {
        if (err) {
            console.error('Error creating project folder:', err);
            return res.status(500).send('Failed to create project folder');
        }
        console.log(`Project folder created: ${projectDir}`);
        res.status(200).send('Project folder created successfully');
    });
});

app.get('/projects', (req, res) => {
    fs.readdir(dataDir, (err, files) => {
        if (err) {
            console.error('Error reading project folders:', err);
            return res.status(500).send('Failed to retrieve project folders');
        }

        const projectFolders = files.filter(file => 
            fs.statSync(path.join(dataDir, file)).isDirectory()
        );
        console.log('Project folders retrieved:', projectFolders);
        res.json(projectFolders);
    });
});

app.delete('/delete-project', (req, res) => {
    const { projectName } = req.body;

    if (!projectName) {
        return res.status(400).send('Project name is required');
    }

    const projectDir = path.join(__dirname, 'data', projectName);

    if (!fs.existsSync(projectDir)) {
        return res.status(404).send('Project folder not found');
    }

    fs.rm(projectDir, { recursive: true, force: true }, (err) => {
        if (err) {
            console.error('Error deleting project folder:', err);
            return res.status(500).send('Failed to delete project folder');
        }
        console.log(`Project folder deleted: ${projectDir}`);
        res.status(200).send('Project folder deleted successfully');
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});

export default app;
