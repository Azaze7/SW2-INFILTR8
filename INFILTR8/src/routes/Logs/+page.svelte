<script lang="ts">
  import { Table } from "@skeletonlabs/skeleton";
  import { fetchLogs } from './logservice';
  import type { TableSource } from '@skeletonlabs/skeleton';

  let logs: any[] = [];
  let filteredLogs: any[] = [];
  let defaultOption = "None";
  let logType = ["None", "Information", "Warning", "Error"];

  fetchUserLogs();

  // Pagination state
  let currentPage = 1;
  let logsPerPage = 10; // Number of logs to show per page
  let totalPages = 1; // Total pages calculated later
  let customLogsPerPage = logsPerPage; // User custom logs per page input

  let tableSource: TableSource = {
    head: ['Type', 'Date', 'Message'],
    body: [],
  };

  // Function to fetch logs for the user and trigger filtering
  async function fetchUserLogs() {
    const fetchedLogs = await fetchLogs();

    if (fetchedLogs !== undefined && fetchedLogs !== null) {
      logs = fetchedLogs;
    } else {
      logs = [];
    }

    // Sort logs by date, newest first
    logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    filteredLogs = logs;
    totalPages = Math.max(1, Math.ceil(filteredLogs.length / logsPerPage)); // Calculate total pages
    filterLogsBy(); // Apply filtering after fetching
    updateTableSource(); // Update the table content after fetching
  }

  // Function to filter logs based on the selected type
  function filterLogsBy() {
    // console.log("Filtering logs by:", defaultOption);
    filteredLogs = (defaultOption === "None") ? logs : logs.filter(log => log.type === defaultOption);
    totalPages = Math.max(1, Math.ceil(filteredLogs.length / logsPerPage)); // Recalculate total pages after filtering
    updateTableSource(); // Update the table content after filtering
  }

  // Function to handle pagination
  function updateTableSource() {
    const startIndex = (currentPage - 1) * logsPerPage;
    const paginatedLogs = filteredLogs.slice(startIndex, startIndex + logsPerPage);

    tableSource.body = paginatedLogs.map(log => [log.type, log.date, log.message]);
  }

  // Handle changes to logs per page
  function updateLogsPerPage() {
    if (customLogsPerPage < 1) {
      customLogsPerPage = 1;
    }
    logsPerPage = customLogsPerPage; // Set logsPerPage based on user input
    totalPages = Math.max(1, Math.ceil(filteredLogs.length / logsPerPage)); // Recalculate total pages
    currentPage = 1; // Reset to the first page
    updateTableSource(); // Update the table with new pagination
  }

  // Functions to handle page navigation
  function goToPreviousPage() {
    if (currentPage > 1) {
      currentPage--;
      updateTableSource();
    }
  }

  function goToNextPage() {
    if (currentPage < totalPages) {
      currentPage++;
      updateTableSource();
    }
  }
</script>

<div class="filter-section">
  <label for="filter-by">Filter logs by:</label>
  <select id="filter-by" bind:value={defaultOption} on:change={filterLogsBy}>
    {#each logType as type}
      <option value={type}>{type}</option>
    {/each}
  </select>
</div>

<!-- Input to allow users to specify logs per page -->
<div class="pagination-controls">
  <label for="logs-per-page">Logs per page:</label>
  <input id="logs-per-page" type="number" min="1" bind:value={customLogsPerPage} on:input={updateLogsPerPage} />
</div>

<div class="total-logs">
  <label for="total-logs">Total logs: {logs.length}</label>
</div>

<!-- Render the Table -->
<Table source={tableSource} />

<!-- Pagination controls -->
<div class="pagination-controls">
  <button on:click={goToPreviousPage} disabled={currentPage === 1}>Previous</button>
  <span>Page {currentPage} of {totalPages}</span>
  <button on:click={goToNextPage} disabled={currentPage === totalPages}>Next</button>
</div>

<style>
  :root {
    --bg: #1d1b28;
    --color-main: #4628e9;
    --color-main-dark: #191528;
    --color-second: #aaa7b9;
    --transition: all .3s ease-out;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .filter-section {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  label {
    font-weight: bold;
  }

  select, input {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: white;
    color: black;
    width: 130px;
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
  }

  button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: var(--color-main);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: var(--transition);
  }

  button:disabled {
    background-color: gray;
    cursor: not-allowed;
  }

  span {
    font-size: 18px;
    font-weight: bold;
  }
</style>