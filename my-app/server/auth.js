import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import neo4j from 'neo4j-driver';
import bcrypt from 'bcrypt';
import logEndPoints from './logendpoints.js';

// Load environment variables from .env
dotenv.config({ path: '.env' });


const app = express();
app.use(express.json());

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:5173',  // Front-end URL
    credentials: true  // Allow credentials (cookies, authorization headers, etc.)
}));

// Log environment variables to verify they're loaded
console.log('NEO4J_URI:', process.env.NEO4J_URI);
console.log('NEO4J_USERNAME:', process.env.NEO4J_USERNAME);
console.log('NEO4J_PASSWORD:', process.env.NEO4J_PASSWORD);

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

// Create a session
const session = driver.session();

// Registration Endpoint
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await session.run(
      `CREATE (u:User {username: $username, password: $password}) RETURN u`,
      { username, password: hashedPassword }
    );
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login Endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await session.run(
      `MATCH (u:User {username: $username}) RETURN u.password AS password`,
      { username }
    );

    const user = result.records[0];
    if (user && await bcrypt.compare(password, user.get('password'))) {
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Use the user fetch router
app.use('/', logEndPoints);

// Start the server
app.listen(3000, () => console.log('Auth server running on http://localhost:3000')); 

