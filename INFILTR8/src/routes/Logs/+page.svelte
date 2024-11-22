<!-- The Frontend Logs Page provides an interactive interface for viewing,
  filtering, and managing application logs. It includes features for filtering 
  logs by type (e.g., Information, Warning, Error) and by date range, enabling 
  users to quickly find relevant log entries. Logs are displayed in a paginated 
  table, with customizable entries per page, and controls for navigating between pages. Users can dynamically adjust the number of logs displayed per page and view the total number of logs. The page integrates Skeleton UI's `Table` component for displaying logs, and a clean, responsive design ensures accessibility and ease of use for monitoring and analyzing application logs. -->
<script lang="ts">
  import { Table } from "@skeletonlabs/skeleton";
  import { fetchLogs } from './logservice';
  import type { TableSource } from '@skeletonlabs/skeleton';

  let logs: any[] = [];
  let filteredLogs: any[] = [];
  let defaultOption = "None";
  let logType = ["None", "Information", "Warning", "Error"];
  let startDate: string;
  let endDate: string;

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

    // Filter by date range
    if (startDate) {
        const start = new Date(startDate + 'T00:00:00Z');
        console.log("Start:", start.toISOString(), startDate);
        filteredLogs = filteredLogs.filter(log => parseLogDate(log.date) >= start);
    }
    if (endDate) {
        const end = new Date(endDate + 'T23:59:59Z');
        filteredLogs = filteredLogs.filter(log => parseLogDate(log.date) <= end);
    }

    totalPages = Math.max(1, Math.ceil(filteredLogs.length / logsPerPage)); // Recalculate total pages after filtering
    updateTableSource(); // Update the table content after filtering
  }

  function parseLogDate(dateString: { split: (arg0: string) => [any, any]; }) {
    const [datePart, timePart] = dateString.split(' ');
    const [month, day, year] = datePart.split('/').map((num: string) => parseInt(num, 10));
    const [hours, minutes, seconds] = timePart.split(':').map((num: string) => parseInt(num, 10));
    
    // Create a new Date object (year needs to be adjusted for 2-digit year)
    const fullYear = year < 100 ? 2000 + year : year; // Adjust for 2-digit year
    return new Date(fullYear, month - 1, day, hours, minutes, seconds); // Month is 0-indexed
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
  <select id="filter-by" class="filter-select" bind:value={defaultOption} on:change={filterLogsBy}>
    {#each logType as type}
      <option value={type}>{type}</option>
    {/each}
  </select>
</div>

<!-- Date filters -->
<div class="date-filter">
  <div class="date-input">
    <label for="start-date">Start Date:</label>
    <input id="start-date" type="date" class="filter-date" bind:value={startDate} on:change={filterLogsBy} />
  </div>
  
  <div class="date-input">
    <label for="end-date">End Date:</label>
    <input id="end-date" type="date" class="filter-date" bind:value={endDate} on:change={filterLogsBy} />
  </div>
</div>

<!-- Input to allow users to specify logs per page -->
<div class="pagination-controls">
  <label for="logs-per-page">Logs per page:</label>
  <input id="logs-per-page" type="number" min="1" class="logs-selection" bind:value={customLogsPerPage} on:input={updateLogsPerPage} />
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

  .filter-select {
    width: 130px;
  }

  .logs-selection {
    width: 75px;
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

  .date-filter {
  display: flex;
  align-items: center;
  }

  .date-input {
    margin-right: 20px;
  }

  .filter-date {
    width: 140px;
  }
</style>