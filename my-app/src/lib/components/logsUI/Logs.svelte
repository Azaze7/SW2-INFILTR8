<script>
  import TestSidebar from "$lib/components/dashboardUI/TestSidebar.svelte"
  import TestTopRight from "$lib/components/dashboardUI/TestTopRight.svelte"
  import { createLogEntry, deleteLogsForUser, fetchLogsForUser } from './logservice';

  // Change username when we find a way to store the username when the user logs in

  // Change this to your username
  const username = 'username';
  
  // Uncomment this to delete all logs that are linked to you
  // deleteLogsForUser(username);

  createLogEntry({
    username: username,
    type: 'Information',
    message: 'testing log creation'
  });
  
  let logs = [];
  fetchLogsForUser(username).then(fetchedLogs => {
    if (fetchedLogs) {
      logs = fetchedLogs.map(log => ({
        type: log.type,
        time: log.date,
        message: log.message
      }));

      console.log(logs);
    } else {
      console.log('No logs found for this user.');
    }
  });
  
  // logs = [
    // { type: "Warning",     time: "09/29/24 10:12", message: "Failed login attempt for user 'analyst1' - incorrect password"},
    // { type: "Information", time: "09/29/24 10:13", message: "User 'analyst1' logged in successfully"},
    // { type: "Information", time: "09/29/24 10:14", message: "User 'analyst1' accessed the reports page to view exploits"},
    // { type: "Information", time: "09/29/24 10:20", message: "User 'analyst1' logged out"}
  // ];

  let defaultOption = "None"; // Default option
  let logType = ["None", "Information", "Warning", "Error"];
  let filteredLogs = logs;

  function filterLogsBy() {
    console.log("Filtering logs by:", defaultOption);
    filteredLogs = (defaultOption === "None") ? logs : logs.filter(log => log.type === defaultOption);
  }

  filterLogsBy();
</script>

<div class="grid-container">
    <aside class="sidebar">
        <TestSidebar />
    </aside>
    <main class="main-content">
        <!-- svelte-ignore a11y-invalid-attribute -->
        <div class="logo"><a href="#"><span>Lo</span>gs</a></div>

        <!-- Filtering of logs -->
        <div class="filter-section">
            <label for="filter-by">Filter logs by</label>
            <select id="filter-by" bind:value={defaultOption}>
              {#each logType as type}
                <option>{type}</option>
              {/each}
            </select>
            <button class="filter-btn" on:click={filterLogsBy}>Filter</button>
        </div>

        <!-- Table Section: Logs -->
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Time</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {#each filteredLogs as log}
                <tr>
                  <td>{log.type}</td>
                  <td>{log.time}</td>
                  <td>{log.message}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
    </main>

    <section class="right-side">
        <!-- Right side content -->
        <!-- svelte-ignore a11y-invalid-attribute -->
        <div class="logo"><a href="#"><span>INFI</span>LTR8</a></div>
        <TestTopRight/>
    </section>
</div>

<style>
        :root {
        --bg: #1d1b28;
        --color-main: #4628e9;
        --color-main-dark: #191528;
        --color-second: #aaa7b9;
        --transition: all .3s ease-out;
    }

    /* Reset some default styles for consistency */
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    /* Grid Container Setup */
    .grid-container {
        display: grid;
        grid-template-areas:
            "sidebar main right";
        grid-template-columns: 250px 1fr 350px; /* Sidebar, main content, right-side width */
        height: 100vh;
        font-family: Arial, sans-serif;
    }

    /* Sidebar Styling */
    .sidebar {
        grid-area: sidebar;
        background-color: f1f1f1;
        color: white;
        padding: 20px;
        display: flex;
        flex-direction: column;
    }

    /* Main Content Styling */
    .main-content {
        grid-area: main;
        padding: 30px;
        overflow-y: auto;
        /*background-color: #f1f1f1;*/
        background-color: var(--bg);
    }

    /* Right Side Section Styling */
    .right-side {
        grid-area: right;
        /*background-color: #f8f9fa;*/
        background-color: var(--bg);
        padding: 20px;
        box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
    }

    /* Responsive Adjustments */
    @media (max-width: 1024px) {
        .grid-container {
            grid-template-areas:
                "sidebar main";
            grid-template-columns: 250px 1fr;
        }

        .right-side {
            display: none; /* Hide right side on small screens */
        }
    }

    @media (max-width: 768px) {
        .grid-container {
            grid-template-areas:
                "main";
            grid-template-columns: 1fr;
        }

        .sidebar {
            display: none; /* Hide sidebar on smaller screens */
        }
    }

  .table-container {
    margin-bottom: 20px;
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background-color: rgb(56, 49, 49);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }

  table th, table td {
    text-align: left;
    padding: 12px;
    border-bottom: 1px solid #220606;
  }

  table thead {
    background-color: #333;
    font-weight: bold;
  }

  table tr:nth-child(even) {
    background-color: #333;
  }

  .filter-section {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  label {
    font-weight: bold;
  }

  select {
    padding: 10px;
    font-size: 16px;
  }

  .filter-btn {
    background-color: #1abc9c;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    border-radius: 5px;
  }

  .filter-btn:hover {
    background-color: #16a085;
  }
</style>