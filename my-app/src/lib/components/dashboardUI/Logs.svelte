<script>
  import Sidebar from "$lib/components/dashboardUI/Sidebar.svelte"; // Ensure the correct path to your Sidebar component

  let logs = [
    { level: "Warning",     time: "09/29/24 10:12", message: "Failed login attempt for user 'analyst1' - incorrect password"},
    { level: "Information", time: "09/29/24 10:13", message: "User 'analyst1' logged in successfully"},
    { level: "Information", time: "09/29/24 10:14", message: "User 'analyst1' accessed the reports page to view exploits"},
    { level: "Information", time: "09/29/24 10:20", message: "User 'analyst1' logged out"}
  ];

  let defaultOption = "None"; // Default option
  let logType = ["None", "Information", "Warning", "Error"];
  let filteredLogs = logs;

  function filterLogsBy() {
    console.log("Filtering logs by:", defaultOption);
    filteredLogs = (defaultOption === "None") ? logs : logs.filter(log => log.level === defaultOption);
  }
</script>

<!-- Layout with Sidebar and Report Screen -->
<div class="main-container">
  <!-- Sidebar -->
  <div class="sidebar-container">
    <Sidebar />
  </div>

  <!-- Logs UI -->
  <div class="logs-screen">
    <!-- Header Section -->
    <h1>Logs</h1>

    <!-- Filtering of logs -->
    <div class="filter-section">
      <label for="filter-by">Filter logs by</label>
      <select id="filter-by" bind:value={defaultOption}>
        {#each logType as type}
          <option>{type}</option>
        {/each}
      </select>
      <!-- <button on:click={filterLogsBy}>Filter Logs</button> -->
      <button class="filter-btn" on:click={filterLogsBy}>Filter</button>
    </div>

  <!-- Table Section: Logs -->
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Level</th>
          <th>Time</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        {#each filteredLogs as log}
          <tr>
            <td>{log.level}</td>
            <td>{log.time}</td>
            <td>{log.message}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  </div>
</div>

<!-- Styling -->
<style>
  .main-container {
    display: flex;
    min-height: 100vh; /* Ensures the layout stretches to full viewport height */
  }

  /* Sidebar-specific styles */
  .sidebar-container {
    width: 200px;
    position: sticky;
    top: 0;
    height: 100vh;
    background-color: #333;
    overflow-y: auto;
  }

  /* Report screen-specific styles */
  .logs-screen {
    flex-grow: 1;
    padding: 20px;
    font-family: Arial, sans-serif;
    background-color: #333;
  }

  h1 {
    margin-bottom: 20px;
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
