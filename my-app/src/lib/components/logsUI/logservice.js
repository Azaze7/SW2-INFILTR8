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
  //   username: 'test@test.com',
  //   type: 'Information',
  //   message: 'Information about the log'
  // });
  /**
   * Creates a log entry and link it to the user who made it
   * @param {Object} logData - The log data
   * @param {string} logData.username - The username associated with the log
   * @param {string} logData.type - The type of the log (e.g., 'Error', 'Info')
   * @param {string} logData.message - The log message
   * @returns {Promise<void>} A promise that resolves once the log entry is created
   */
  export async function createLogEntry({ username, type, message }) {
    const logData = {
      id: generateRandomId(),
      username,
      type,
      message,
    };
  
    console.log("Log created:", logData);
  
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
  // deleteLogsForUser('test@test.com');
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
        console.log('Logs deleted:', data.message); // Change to access message
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
  // fetchLogsForUser('test@test.com')
  /**
   * Fetches all logs related to the specified username.
   * @param {string} username - The username whose logs should be fetched
   * @returns {Promise<void>} A promise that resolves with the logs for the user
   */
  export async function fetchLogsForUser(username) {
    try {
      const response = await fetch('http://localhost:3000/fetchlogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
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