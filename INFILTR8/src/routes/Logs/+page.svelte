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

<div class="flex items-center space-x-4 mb-4">
  <label for="filter-by" class="font-bold">Filter logs by:</label>
  <select id="filter-by" class="p-2 text-base border border-gray-300 rounded-md bg-white" bind:value={defaultOption} on:change={filterLogsBy}>
    {#each logType as type}
      <option value={type}>{type}</option>
    {/each}
  </select>
</div>

<!-- Date filters -->
<div class="flex items-center space-x-4 mb-4">
  <div>
    <label for="start-date" class="font-bold">Start Date:</label>
    <input id="start-date" type="date" class="p-2 text-base border border-gray-300 rounded-md w-36" bind:value={startDate} on:change={filterLogsBy} />
  </div>
  
  <div class="date-input">
    <label for="end-date">End Date:</label>
    <input id="end-date" type="date" class="filter-date" bind:value={endDate} on:change={filterLogsBy} />
  </div>
</div>

<!-- Input to allow users to specify logs per page -->
<div class="flex items-center space-x-4 mb-4">
  <label for="logs-per-page" class="font-bold">Logs per page:</label>
  <input id="logs-per-page" type="number" min="1" class="p-2 text-base border border-gray-300 rounded-md w-20" bind:value={customLogsPerPage} on:input={updateLogsPerPage} />
</div>

<div class="total-logs">
  <label for="total-logs">Total logs: {logs.length}</label>
</div>

<!-- Render the Table -->
<Table source={tableSource} />

<!-- Pagination controls -->
<div class="flex items-center space-x-4 mt-4">
  <button on:click={goToPreviousPage} disabled={currentPage === 1} class="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
    Previous
  </button>
  <span class="font-bold text-lg">Page {currentPage} of {totalPages}</span>
  <button on:click={goToNextPage} disabled={currentPage === totalPages} class="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
    Next
  </button>
</div>