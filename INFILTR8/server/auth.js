import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import neo4j from 'neo4j-driver';
import bcrypt from 'bcrypt';
import session from 'express-session';

dotenv.config({ path: '../.env' });

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
}));

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Account Lock Check Endpoint
app.post('/check-lock', async (req, res) => {
    const { username } = req.body;
    console.log(`Checking lock status for user: ${username}`);
    const session = driver.session();
    try {
        const result = await session.run(
            'MATCH (u:User {username: $username}) RETURN u.locked AS locked',
            { username }
        );
        const locked = result.records[0]?.get('locked') || false;
        console.log(`Account lock status for ${username}: ${locked}`);
        res.json({ locked });
    } finally {
        await session.close();
    }
});

// Increment Attempts Endpoint
app.post('/increment-attempts', async (req, res) => {
    const { username } = req.body;
    console.log(`Incrementing login attempts for user: ${username}`);
    const session = driver.session();
    try {
        const result = await session.run(
            'MATCH (u:User {username: $username}) ' +
            'SET u.attempts = coalesce(u.attempts, 0) + 1 ' +
            'WITH u WHERE u.attempts >= 3 ' +
            'SET u.locked = true RETURN u.attempts AS attempts, u.locked AS locked',
            { username }
        );
        const attempts = result.records[0]?.get('attempts');
        const locked = result.records[0]?.get('locked');
        console.log(`User ${username} now has ${attempts} failed attempts. Locked: ${locked}`);
        res.json({ attempts, locked });
    } finally {
        await session.close();
    }
});

// Reset Attempts Endpoint
app.post('/reset-attempts', async (req, res) => {
    const { username } = req.body;
    console.log(`Resetting login attempts for user: ${username}`);
    const session = driver.session();
    try {
        await session.run(
            'MATCH (u:User {username: $username}) SET u.attempts = 0, u.locked = false RETURN u',
            { username }
        );
        res.sendStatus(200);
    } finally {
        await session.close();
    }
});

// User Registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const session = driver.session();
    try {
        const userResult = await session.run('MATCH (u:User {username: $username}) RETURN u', { username });

        if (userResult.records.length > 0) {
            console.log(`Registration failed: User ${username} already exists`);
            return res.status(400).send('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await session.run('CREATE (u:User {username: $username, password: $password, attempts: 0, locked: false}) RETURN u', { username, password: hashedPassword });

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
    console.log(`Login attempt for user: ${username}`);
    const session = driver.session();
    try {
        // Check if account is locked
        const lockResult = await session.run('MATCH (u:User {username: $username}) RETURN u.locked AS locked', { username });
        const isLocked = lockResult.records[0]?.get('locked') || false;
        if (isLocked) {
            console.log(`Login failed for ${username}: Account is locked`);
            return res.status(403).send('Account is locked due to multiple failed attempts.');
        }

        const userResult = await session.run('MATCH (u:User {username: $username}) RETURN u', { username });
        if (userResult.records.length === 0) {
            console.log(`Invalid username: ${username}`);
            // Increment failed attempts
            const incrementResult = await session.run(
                'MATCH (u:User {username: $username}) ' +
                'SET u.attempts = coalesce(u.attempts, 0) + 1 ' +
                'WITH u WHERE u.attempts >= 3 ' +
                'SET u.locked = true RETURN u.attempts AS attempts, u.locked AS locked',
                { username }
            );
            const attempts = incrementResult.records[0]?.get('attempts');
            const attemptsLeft = 3 - attempts;
            console.log(`Attempts left for ${username}: ${attemptsLeft}`);
            return res.status(400).send(`Invalid username or password. Attempts remaining: ${attemptsLeft}`);
        }

        const userNode = userResult.records[0].get('u').properties;
        const hashedPassword = userNode.password;

        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        if (!passwordMatch) {
            console.log(`Incorrect password for ${username}`);
            // Increment failed attempts
            const incrementResult = await session.run(
                'MATCH (u:User {username: $username}) ' +
                'SET u.attempts = coalesce(u.attempts, 0) + 1 ' +
                'WITH u WHERE u.attempts >= 3 ' +
                'SET u.locked = true RETURN u.attempts AS attempts, u.locked AS locked',
                { username }
            );
            const attempts = incrementResult.records[0]?.get('attempts');
            const attemptsLeft = 3 - attempts;
            console.log(`Attempts left for ${username}: ${attemptsLeft}`);
            return res.status(400).send(`Invalid username or password. Attempts remaining: ${attemptsLeft}`);
        }

        // Reset attempts and unlock account on successful login
        await session.run(
            'MATCH (u:User {username: $username}) SET u.attempts = 0, u.locked = false RETURN u',
            { username }
        );
        console.log(`Login successful for user: ${username}`);
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

export default app;
