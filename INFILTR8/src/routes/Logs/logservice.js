// src/lib/components/logsUI/logservice.js
import { user } from '../../lib/components/loginUI/userStore';

let username = '';
user.subscribe(currentUser => {
  if (currentUser) {
      username = currentUser.username;
      console.log(username);
  } else {
      console.log('No user is currently set.');
  }
});

/**
 * Generates a random ID for log entries
 * @returns {string} The generated random ID
 */
function generateRandomId() {
  const now = new Date();
  return `${now.getMonth()}${now.getDate()}${now.getFullYear()}_${Math.floor(Math.random() * 100000)}`;
}

// Example usage
// createLogEntry({
//   type: 'Information',
//   message: 'Information about the log'
// });
/**
 * Creates a log entry and link it to the user who made it
 * @param {Object} logData - The log data
 * @param {string} logData.type - The type of the log (e.g., 'Error', 'Info')
 * @param {string} logData.message - The log message
 * @returns {Promise<void>} A promise that resolves once the log entry is created
 */
export async function createLogEntry({ type, message }) {
  const logData = {
    id: generateRandomId(),
    username: username,
    type,
    message,
  };

  try {
    const response = await fetch('http://localhost:3000/createlog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Log created:', data.log);
    } else {
      console.log(`Failed to create log: ${response.statusText} (Status code: ${response.status})`);
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log('Error:', err.message);
    } else {
      console.log('An unknown error occurred');
    }
  }
}

// Example usage
// deleteLogsForUser(username);
/**
 * Deletes all logs related to the specified username.
 * @param {string} username - The username whose logs should be deleted
 * @returns {Promise<void>} A promise that resolves once logs are deleted
 */
export async function deleteLogsForUser(username) {
  try {
    const response = await fetch('http://localhost:3000/deletelogs', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Logs deleted:', data.message);
    } else {
      console.log(`Failed to delete logs: ${response.statusText} (Status code: ${response.status})`);
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log('Error:', err.message);
    } else {
      console.log('An unknown error occurred');
    }
  }
}

// Example usage
// fetchLogs();
/**
 * Fetches all logs related to the specified username.
 * @returns {Promise<void>} A promise that resolves with the logs for the user
 */
export async function fetchLogs() {
  try {
    const response = await fetch('http://localhost:3000/fetchlogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.logs;
    } else {
      console.log(`Failed to fetch logs: ${response.statusText} (Status code: ${response.status})`);
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log('Error:', err.message);
    } else {
      console.log('An unknown error occurred');
    }
  }
}