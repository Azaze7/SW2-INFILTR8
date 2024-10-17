// server/logendpoints.js

import dotenv from 'dotenv';
import express from 'express';
import neo4j from 'neo4j-driver';

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

// Create a log entry and link it to ther user
router.post('/createlog', async (req, res) => {
  const { id, username, type, message } = req.body;
  const session = driver.session();

  try {
    // Get the current date and time
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const year = String(now.getFullYear()).slice(2);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const date = `${month}/${day}/${year} ${hours}:${minutes}`;

    // Find the user and create the log with a relationship, including the provided ID
    const result = await session.run(
      `MATCH (u:User {username: $username})
       CREATE (l:Log {id: $id, type: $type, date: $date, message: $message})
       CREATE (u)-[:CREATED]->(l)
       RETURN l`,
      { id, username, type, date, message }
    );

    const logRecord = result.records[0];
    if (logRecord) {
      const log = logRecord.get('l').properties;
      res.json({ log });
    } else {
      res.status(404).json({ message: 'Log creation failed' });
    }
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: err.message });
  } finally {
    await session.close();
  }
});

// Fetch the logs from a user
router.post('/fetchlogs', async (req, res) => {
  const { username } = req.body;
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (u:User {username: $username})-[r:CREATED]->(l:Log)
       RETURN l`,
      { username }
    );

    const logs = result.records.map(record => record.get('l').properties);

    if (logs.length > 0) {
      res.json({ logs });
    } else {
      console.log('No logs found for the user');
      res.status(404).json({ message: 'No logs found for the user' });
    }
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: err.message });
  } finally {
    await session.close();
  }
});

export default router;