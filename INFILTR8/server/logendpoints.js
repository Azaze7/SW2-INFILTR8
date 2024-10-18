// server/logendpoints.js

import dotenv from 'dotenv';
import express from 'express';
import neo4j from 'neo4j-driver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFilePath = path.join(__dirname, '..', 'logs', 'INFILTR8.log');

const router = express.Router();

dotenv.config({ path: '../.env' });

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

// Delete all logs from a user
router.delete('/deletelogs', async (req, res) => {
  const { username } = req.body;
  const session = driver.session();
  
  try {
    // Delete logs created by the user
    const result = await session.run(
      `MATCH (u:User {username: $username})-[r:CREATED]->(l:Log)
       DELETE r, l`,
      { username }
    );

    // Check if any logs were deleted
    if (result.summary.counters.updates().nodesDeleted === 0) {
      return res.status(404).json({ message: 'No logs found for the user' });
    }

    res.json({ message: 'Logs deleted successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: err.message });
  } finally {
    try {
      await session.close();
    } catch (closeError) {
      console.error('Error closing session:', closeError);
    }
  }
});

// Create a log entry and link it to the user
router.post('/createlog', async (req, res) => {
  const { id, username, type, message } = req.body;

  try {
    // Get the current date and time
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const year = String(now.getFullYear()).slice(2);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const date = `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;

    // Create the log entry
    const logEntry = `[${date}] [${type}] [User: ${username}] [Log ID: ${id}] [${message}]\n`;

    // Ensure the logs directory exists (this will create it if it doesn't exist)
    const logsDir = path.join(__dirname, '..', 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    // Append the log entry to the log file
    fs.appendFile(logFilePath, logEntry, (err) => {
      if (err) {
        console.error('Error writing to log file:', err);
        return res.status(500).json({ error: 'Failed to write log to file' });
      }

      console.log('Log written to file:', logEntry);
      res.json({ message: 'Log created successfully', log: logEntry });
    });
  } catch (err) {
    console.error('Error creating log:', err);
    res.status(500).json({ error: err.message });
  }
});

// Fetch the logs from a user
router.post('/fetchlogs', async (req, res) => {
  const { username } = req.body;

  try {
    // Check if the log file exists
    if (!fs.existsSync(logFilePath)) {
      return res.status(404).json({ message: 'Log file not found' });
    }

    // Read the log file
    const logData = fs.readFileSync(logFilePath, 'utf-8');

    // Split log data into individual lines
    const logEntries = logData.trim().split('\n');

    // Filter logs by username
    const userLogs = logEntries
      .filter(log => log.includes(`[User: ${username}]`))  // Filter logs that contain the username
      .map(log => {
        // Parse each log entry to extract its parts
        const logParts = log.match(/\[(.*?)\]/g).map(part => part.replace(/\[|\]/g, ''));
        return {
          date: logParts[0],     // e.g. "10/18/24 10:18:54"
          type: logParts[1],     // e.g. "Information"
          username: logParts[2].replace('User: ', ''), // Extract username, e.g. "username"
          id: logParts[3].replace('Log ID: ', ''),     // Extract log ID, e.g. "9182024_79956"
          message: logParts[4]   // Extract message, e.g. "username logged in"
        };
      });

    if (userLogs.length > 0) {
      res.json({ logs: userLogs });
    } else {
      res.status(404).json({ message: 'No logs found for the user' });
    }
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;