/**
 * The `auth.js` module provides the authentication and user management functionality for the INFILTR8 backend. 
 * Built with Express.js, it uses Neo4j to manage user data, bcrypt for password hashing, and express-session 
 * for handling user sessions securely. Key features of this module include:
 * 
 * - **User Registration**: Ensures unique usernames and securely stores passwords using bcrypt.
 * - **User Login**: Authenticates user credentials and resets failed login attempts after successful authentication.
 * - **Account Locking**: Protects accounts by locking them after three consecutive failed login attempts.
 * - **Password Reset**: Supports password reset functionality via secure tokens.
 * - **Session Management**: Manages user sessions for persistent logins and secure logout processes.
 * - **API Endpoints**:
 *   - `/register`: Registers new users with secure password storage.
 *   - `/login`: Verifies user credentials, tracks login attempts, and handles account locks.
 *   - `/logout`: Safely ends user sessions and logs out the user.
 *   - `/check-lock`: Verifies if a user account is locked.
 *   - `/increment-attempts`: Tracks failed login attempts and locks accounts when limits are exceeded.
 *   - `/reset-attempts`: Unlocks accounts and resets login attempt counters.
 *   - `/reset-password`: Enables password changes through secure token validation.
 * 
 * This module emphasizes security and reliability with features like password hashing, secure token generation, 
 * and account lockout policies. It integrates seamlessly with the INFILTR8 system, ensuring a dependable user authentication workflow.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import neo4j from 'neo4j-driver';
import bcrypt from 'bcrypt';
import session from 'express-session';
import crypto from 'crypto';

dotenv.config({ path: '../.env' });

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
}));

// Neo4j Driver Initialization
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

// Generate a secure token
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Account Lock Check Endpoint
app.post('/check-lock', async (req, res) => {
    const { username } = req.body;
    const session = driver.session();
    try {
        const result = await session.run(
            'MATCH (u:User {username: $username}) RETURN u.locked AS locked',
            { username }
        );
        const locked = result.records[0]?.get('locked') || false;
        res.json({ locked });
    } finally {
        await session.close();
    }
});

// Increment Attempts Endpoint
app.post('/increment-attempts', async (req, res) => {
    const { username } = req.body;
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
        res.json({ attempts, locked });
    } finally {
        await session.close();
    }
});

// Reset Attempts Endpoint
app.post('/reset-attempts', async (req, res) => {
    const { username } = req.body;
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
        const userResult = await session.run(
            'MATCH (u:User {username: $username}) RETURN u',
            { username }
        );

        if (userResult.records.length > 0) {
            return res.status(400).send('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const token = generateToken();

        // Ensure `token` is added when creating the user
        const result = await session.run(
            `
            CREATE (u:User {username: $username, password: $password, token: $token, attempts: 0, locked: false})
            RETURN u
            `,
            { username, password: hashedPassword, token }
        );

        // Debugging: Log the created user
        console.log('Created User:', result.records[0].get('u').properties);

        req.session.user = { username };
        res.json({ user: { username, token } });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).send('An error occurred during registration');
    } finally {
        await session.close();
    }
});


// Password Reset Endpoint
app.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    const session = driver.session();
    try {
        const userResult = await session.run(
            'MATCH (u:User {token: $token}) RETURN u',
            { token }
        );

        if (userResult.records.length === 0) {
            return res.status(400).send('Invalid or expired token');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const newToken = generateToken();
        await session.run(
            'MATCH (u:User {token: $token}) ' +
            'SET u.password = $password, u.token = $newToken RETURN u',
            { token, password: hashedPassword, newToken }
        );

        res.send('Password reset successful');
    } catch (err) {
        console.error('Password reset error:', err);
        res.status(500).send('An error occurred during password reset');
    } finally {
        await session.close();
    }
});

// User Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const session = driver.session();
    try {
        const lockResult = await session.run('MATCH (u:User {username: $username}) RETURN u.locked AS locked', { username });
        const isLocked = lockResult.records[0]?.get('locked') || false;
        if (isLocked) {
            return res.status(403).send('Account is locked due to multiple failed attempts.');
        }

        const userResult = await session.run('MATCH (u:User {username: $username}) RETURN u', { username });
        if (userResult.records.length === 0) {
            return res.status(400).send('Invalid username or password.');
        }

        const userNode = userResult.records[0].get('u').properties;
        const hashedPassword = userNode.password;
        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        if (!passwordMatch) {
            const incrementResult = await session.run(
                'MATCH (u:User {username: $username}) ' +
                'SET u.attempts = coalesce(u.attempts, 0) + 1 ' +
                'WITH u WHERE u.attempts >= 3 ' +
                'SET u.locked = true RETURN u.attempts AS attempts, u.locked AS locked',
                { username }
            );
            const attempts = incrementResult.records[0]?.get('attempts');
            const attemptsLeft = 3 - attempts;
            return res.status(400).send(`Invalid username or password. Attempts remaining: ${attemptsLeft}`);
        }

        await session.run(
            'MATCH (u:User {username: $username}) SET u.attempts = 0, u.locked = false RETURN u',
            { username }
        );

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
            return res.status(500).send('Could not log out');
        }
        res.send('Logged out');
    });
});

export default app;
