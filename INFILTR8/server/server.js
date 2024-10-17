import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import csv from 'csv-parser';  
import neo4j from 'neo4j-driver';  
import authRoutes from './auth.js';  

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

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

// Setup Neo4j connection
const neo4jDriver = neo4j.driver(
    process.env.NEO4J_URI,  
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

// Function to run a query with proper session management
async function runQuery(query, params = {}) {
    const session = neo4jDriver.session();
    try {
        const result = await session.run(query, params);
        return result.records.map(record => record.toObject());
    } catch (error) {
        console.error('Neo4j query error:', error);
        throw error;
    } finally {
        await session.close();
    }
}

// Define multer storage destination
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const projectName = req.body.projectName || 'uploads';
        const projectDir = path.join(__dirname, 'data', projectName);

        // Ensure the project directory exists
        if (!fs.existsSync(projectDir)) {
            console.log(`Creating project directory: ${projectDir}`);
            fs.mkdirSync(projectDir, { recursive: true });
        }

        console.log(`Saving file to directory: ${projectDir}`);
        cb(null, projectDir);  // Save the file to the project folder
    },
    filename: function (req, file, cb) {
        console.log(`Saving file with original name: ${file.originalname}`);
        cb(null, file.originalname);  // Keep the original file name
    }
});

const upload = multer({ storage: storage });

// Mount authentication routes
app.use(authRoutes);

// Route to handle project folder creation
app.post('/create-project', (req, res) => {
    const { projectName } = req.body;

    if (!projectName) {
        console.log('Project name is required');
        return res.status(400).send('Project name is required');
    }

    const projectDir = path.join(__dirname, 'data', projectName);

    // Create the folder if it doesn't exist
    fs.mkdir(projectDir, { recursive: true }, (err) => {
        if (err) {
            console.error('Error creating project folder:', err);
            return res.status(500).send('Failed to create project folder');
        }

        console.log(`Project folder ${projectDir} created successfully`);
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

        console.log('Project folders retrieved:', projectFolders);
        res.json(projectFolders);
    });
});

// Route to fetch project data (including IPs and analysis types) from Neo4j
app.get('/api/project-data', async (req, res) => {
    try {
        const projectFoldersQuery = `MATCH (p:Project) RETURN p.name AS projectName`;
        const ipListQuery = `MATCH (ip:IPAddress) RETURN ip.address AS ip`;
        const analysisTypesQuery = `MATCH (a:Analysis) RETURN a.type AS analysisType`;

        const projectFolders = await runQuery(projectFoldersQuery);
        const ipList = await runQuery(ipListQuery);
        const analysisTypes = await runQuery(analysisTypesQuery);

        res.json({ projectFolders, ipList, analysisTypes });
    } catch (error) {
        console.error('Error fetching project data from Neo4j:', error);
        res.status(500).send('Failed to fetch project data');
    }
});

// Route to handle CSV processing and uploading data to Neo4j AuraDB
app.post('/process-csv', (req, res) => {
    const projectName = req.body.projectName;
    const projectDir = path.join(__dirname, 'data', projectName);

    if (!projectName) {
        console.log('Project name is required');
        return res.status(400).send('Project name is required');
    }

    const csvFiles = [
        'data_with_exploits.csv',
        'ranked_entry_points.csv',
        'entrypoint_most_info.csv',
        'port_0_entries.csv'
    ];

    const processCSV = async (csvFilePath, query) => {
        return new Promise((resolve, reject) => {
            const fileStream = fs.createReadStream(csvFilePath);
            const csvData = [];

            fileStream
                .pipe(csv())
                .on('data', (row) => {
                    csvData.push(row);
                })
                .on('end', async () => {
                    for (const row of csvData) {
                        try {
                            await runQuery(query, row);
                            console.log(`Data inserted into Neo4j: ${JSON.stringify(row)}`);
                        } catch (err) {
                            console.error(`Error inserting row into Neo4j: ${err.message}`);
                            reject(err);
                        }
                    }
                    resolve();
                })
                .on('error', reject);
        });
    };

    const queries = {
        'data_with_exploits.csv': `
            CREATE (v:Vulnerability {name: $name, ip: $ip, port: $port, viable_exploit: $viable_exploit, archetype: $archetype}) RETURN v`,
        'ranked_entry_points.csv': `
            CREATE (r:RankedEntryPoint {ip: $ip, port: $port, combined_score: $combined_score}) RETURN r`,
        'entrypoint_most_info.csv': `
            CREATE (e:EntryPoint {ip: $ip, port: $port, vulnerability_count: $vulnerability_count}) RETURN e`,
        'port_0_entries.csv': `
            CREATE (p:Port0Entry {name: $name, ip: $ip}) RETURN p`
    };

    const processCSVs = async () => {
        try {
            for (const file of csvFiles) {
                const filePath = path.join(projectDir, file);
                const query = queries[file];

                if (fs.existsSync(filePath)) {
                    console.log(`Processing CSV file: ${filePath}`);
                    await processCSV(filePath, query);
                } else {
                    console.warn(`CSV file ${filePath} does not exist`);
                }
            }
            res.status(200).send('CSV data processed and uploaded to Neo4j successfully');
        } catch (err) {
            console.error('Error processing CSV data:', err);
            res.status(500).send('Error processing CSV data');
        }
    };

    processCSVs();
});

// Route to handle project folder deletion
app.delete('/delete-project', (req, res) => {
    const { projectName } = req.body;

    if (!projectName) {
        console.log('Project name is required for deletion');
        return res.status(400).send('Project name is required');
    }

    const projectDir = path.join(__dirname, 'data', projectName);

    // Check if the folder exists
    if (!fs.existsSync(projectDir)) {
        console.log(`Project folder ${projectDir} not found`);
        return res.status(404).send('Project folder not found');
    }

    // Recursively delete the project folder
    fs.rm(projectDir, { recursive: true, force: true }, (err) => {
        if (err) {
            console.error('Error deleting project folder:', err);
            return res.status(500).send('Failed to delete project folder');
        }

        console.log(`Project folder ${projectDir} deleted successfully`);
        res.status(200).send('Project folder deleted successfully');
    });
});

// Vulnerability Endpoint
app.get('/api/vulnerabilities', async (req, res) => {
    try {
        const vulnerabilities = await runQuery(`
            MATCH (v:Vulnerability)
            RETURN v
        `);
        res.json(vulnerabilities);
    } catch (error) {
        console.error('Error fetching vulnerabilities:', error);
        res.status(500).send('Failed to fetch vulnerabilities');
    }
});

// RankedEntryPoint Endpoint
app.get('/api/ranked-entry-points', async (req, res) => {
    try {
        const result = await runQuery(`
            MATCH (r:RankedEntryPoint)
            RETURN r LIMIT 100
        `);
        const rankedEntryPoints = result.map(record => record.r.properties);  
        res.json(rankedEntryPoints);
    } catch (err) {
        console.error('Error fetching RankedEntryPoints:', err);
        res.status(500).send('Failed to fetch ranked entry points');
    }
});

// Port0Entry Endpoint
app.get('/api/port0-entries', async (req, res) => {
    try {
        const result = await runQuery(`
            MATCH (p:Port0Entry)
            RETURN p LIMIT 100
        `);
        const port0Entries = result.map(record => record.p.properties);  // Extract properties
        res.json(port0Entries);
    } catch (err) {
        console.error('Error fetching Port0Entries:', err);
        res.status(500).send('Failed to fetch port 0 entries');
    }
});

// PortZeroEntry Endpoint
app.get('/api/port-zero-entries', async (req, res) => {
    try {
        const portZeroEntries = await runQuery(`
            MATCH (p:PortZeroEntry)
            RETURN p
        `);
        res.json(portZeroEntries);
    } catch (error) {
        console.error('Error fetching port zero entries:', error);
        res.status(500).send('Failed to fetch port zero entries');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
