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

// Define __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env
dotenv.config({ path: '../.env' });

const app = express();
app.use(express.json());

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:5173',  // Front-end URL
    credentials: true  // Allow credentials (cookies, authorization headers, etc.)
}));

console.log('Modules imported successfully');

// Create a Neo4j driver instance using credentials from environment variables
const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

const session = driver.session();

// Set up multer for file uploads
const upload = multer({ dest: 'data/' }); // Save uploaded files to 'my-app/data'

// Endpoint to handle .nessus file upload
app.post('/upload-nessus', upload.single('nessusFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    const filePath = path.resolve(req.file.path);
    const scriptPath = path.resolve(__dirname, '../scripts/maing.py'); // Corrected script path

    // Execute the Python script to process the file and generate CSV
    exec(`python ${scriptPath} ${filePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Execution error: ${error}`);
            return res.status(500).send('Error processing Nessus file');
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        res.send('Nessus file processed successfully');
    });
});

// Endpoint to upload CSV data to Neo4j
app.post('/upload-csv', async (req, res) => {
    const csvFiles = [
        'data_with_exploits.csv',
        'entrypoint_most_info.csv',
        'port_0_entries.csv',
        'ranked_entry_points.csv'
    ];
    const basePath = path.resolve(__dirname, 'CSV Files');

    try {
        for (const fileName of csvFiles) {
            const filePath = path.join(basePath, fileName);
            if (!fs.existsSync(filePath)) {
                console.error(`File not found: ${filePath}`);
                continue; // Skip if the file doesn't exist
            }

            await new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', async (row) => {
                        // Insert row into Neo4j
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
    } catch (err) {
        console.error(`Error processing CSV files: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
});

// Endpoint to fetch vulnerabilities from Neo4j
app.get('/vulnerabilities', async (req, res) => {
    try {
        const result = await session.run(`MATCH (v:Vulnerability) RETURN v`);
        const vulnerabilities = result.records.map(record => record.get('v').properties);
        res.json(vulnerabilities);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Start the server
app.listen(3000, () => console.log('Auth server running on http://localhost:3000'));