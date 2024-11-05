import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import neo4j from 'neo4j-driver';
import bcrypt from 'bcrypt';
import { exec } from 'child_process';
import fs from 'fs';
import csv from 'csv-parser';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';

// Define __dirname manually for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env
dotenv.config({ path: '../.env' });

// Create an Express application
const app = express();
app.use(express.json());

// Enable CORS for all routes with specific origin
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
}));

// Handle preflight requests
app.options('*', cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
}));

// Create a Neo4j driver instance using credentials from environment variables
const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Temporary upload folder

// Initialize express-session middleware using in-memory storage
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Endpoint to handle .nessus file upload and process CSV files
app.post('/upload-nessus', upload.single('nessusFile'), (req, res) => {
    const { projectName } = req.body;

    if (!projectName) {
        return res.status(400).send('Project name is required');
    }

    // Define the project directory path
    const projectDir = path.join(__dirname, 'data', projectName);

    // Ensure the project directory exists, create it if it doesn't
    if (!fs.existsSync(projectDir)) {
        fs.mkdirSync(projectDir, { recursive: true });
    }

    // Define the full path for the .nessus file in the target directory
    const nessusFilePath = path.join(projectDir, req.file.originalname || 'nessus_v_unknown.nessus');

    // Move the .nessus file from the temporary upload location to the target directory
    fs.rename(req.file.path, nessusFilePath, (err) => {
        if (err) {
            console.error('Error moving Nessus file:', err);
            return res.status(500).send('Failed to move Nessus file');
        }

        // Define the path to the Python script
        const scriptPath = path.resolve(__dirname, '../scripts/maing.py');

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

// Endpoint to upload CSV data to Neo4j
app.post('/upload-csv', async (req, res) => {
    const csvFiles = ['data_with_exploits.csv', 'entrypoint_most_info.csv', 'port_0_entries.csv', 'ranked_entry_points.csv'];
    const basePath = path.resolve(__dirname, 'CSV Files');

    try {
        const session = driver.session();
        for (const fileName of csvFiles) {
            const filePath = path.join(basePath, fileName);
            if (!fs.existsSync(filePath)) {
                console.error(`File not found: ${filePath}`);
                continue;
            }

            await new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', async (row) => {
                        try {
                            await session.run(
                                `CREATE (v:Vulnerability {name: $name, ip: $ip, port: $port, viable_exploit: $viable_exploit, archetype: $archetype}) RETURN v`,
                                {
                                    name: row.name || '',
                                    ip: row.ip || '',
                                    port: row.port || '',
                                    viable_exploit: row.viable_exploit || '',
                                    archetype: row.archetype || ''
                                }
                            );
                        } catch (err) {
                            console.error(`Error inserting row into Neo4j: ${err.message}`);
                        }
                    })
                    .on('end', resolve)
                    .on('error', reject);
            });
        }
        res.send('CSV data uploaded to Neo4j successfully');
        await session.close();
    } catch (err) {
        console.error(`Error processing CSV files: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
});

// User Registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const session = driver.session();
    try {
        const userResult = await session.run('MATCH (u:User {username: $username}) RETURN u', { username });

        if (userResult.records.length > 0) {
            return res.status(400).send('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await session.run('CREATE (u:User {username: $username, password: $password}) RETURN u', { username, password: hashedPassword });

        req.session.user = { username };
        res.json({ user: { username } });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).send('An error occurred during registration');
    } finally {
        await session.close();
    }
});

// User Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const session = driver.session();
    try {
        const userResult = await session.run('MATCH (u:User {username: $username}) RETURN u', { username });

        if (userResult.records.length === 0) {
            return res.status(400).send('Invalid username or password');
        }

        const userNode = userResult.records[0].get('u').properties;
        const hashedPassword = userNode.password;

        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        if (!passwordMatch) {
            return res.status(400).send('Invalid username or password');
        }

        req.session.user = { username };
        res.json({ user: { username } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).send('An error occurred during login');
    } finally {
        await session.close();
    }
});

// User Logout
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).send('Could not log out');
        }
        res.send('Logged out');
    });
});

// Get Current User
app.get('/current-user', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).send('Unauthorized');
    }
});

export default app;
