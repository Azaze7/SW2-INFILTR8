import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';  // Import multer for file uploads
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

// Define multer storage destination
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const projectName = req.body.projectName || 'uploads';  // Default to 'uploads' if no project name
        const projectDir = path.join(__dirname, 'data', projectName);

        // Ensure the project directory exists
        if (!fs.existsSync(projectDir)) {
            fs.mkdirSync(projectDir, { recursive: true });
        }

        cb(null, projectDir);  // Save the file to the project folder
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);  // Keep the original file name
    }
});

const upload = multer({ storage: storage });  // Define multer middleware with storage options

// Mount authentication routes
app.use(authRoutes);

// Route to handle project folder creation
app.post('/create-project', (req, res) => {
    const { projectName } = req.body;

    if (!projectName) {
        return res.status(400).send('Project name is required');
    }

    const projectDir = path.join(__dirname, 'data', projectName);  // Ensure correct folder structure

    // Create the folder if it doesn't exist
    fs.mkdir(projectDir, { recursive: true }, (err) => {
        if (err) {
            console.error('Error creating project folder:', err);
            return res.status(500).send('Failed to create project folder');
        }

        res.status(200).send('Project folder created successfully');
    });
});

// Route to get all project folders (returns the list of folders in the 'data' directory)
app.get('/projects', (req, res) => {
    const dataDir = path.join(__dirname, 'data');

    fs.readdir(dataDir, (err, files) => {
        if (err) {
            console.error('Error reading project folders:', err);
            return res.status(500).send('Failed to retrieve project folders');
        }

        // Filter to return only directories (i.e., project folders)
        const projectFolders = files.filter(file => fs.statSync(path.join(dataDir, file)).isDirectory());

        res.json(projectFolders);
    });
});

// Route to handle .nessus file upload and processing
app.post('/upload-nessus', upload.single('nessusFile'), (req, res) => {
    const nessusFilePath = req.file.path;  // File path of the uploaded Nessus file
    const projectName = req.body.projectName;
    const projectDir = path.join(__dirname, 'data', projectName);

    if (!projectName) {
        return res.status(400).send('Project name is required');
    }

    const scriptPath = path.resolve(__dirname, '../scripts/maing.py');  // Correct script path

    // Execute the Python script to process the file and generate CSVs
    const { exec } = require('child_process');
    exec(`python ${scriptPath} ${nessusFilePath} ${projectDir}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Execution error: ${error}`);
            return res.status(500).send('Error processing Nessus file');
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        res.send('Nessus file processed successfully');
    });
});

// Route to handle project folder deletion
app.delete('/delete-project', (req, res) => {
    const { projectName } = req.body;

    if (!projectName) {
        return res.status(400).send('Project name is required');
    }

    const projectDir = path.join(__dirname, 'data', projectName);

    // Check if the folder exists
    if (!fs.existsSync(projectDir)) {
        return res.status(404).send('Project folder not found');
    }

    // Recursively delete the project folder
    fs.rm(projectDir, { recursive: true, force: true }, (err) => {
        if (err) {
            console.error('Error deleting project folder:', err);
            return res.status(500).send('Failed to delete project folder');
        }

        res.status(200).send('Project folder deleted successfully');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
