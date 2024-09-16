<script>
  import Sidebar from "$lib/components/dashboardUI/Sidebar.svelte"; // Ensure the correct path to your Sidebar component

  let currentProject = "Example Project";
  let devices = [
    { ip: "192.168.1.11", device: "Device A", vulnerability: "CVE-2019-14899 [VPN Traffic Hijack]", status: "Exploited" },
    { ip: "192.168.1.5", device: "Device B", vulnerability: "CVE-2022-21907 [HTTP Protocol Stack]", status: "Not Exploited" },
    { ip: "192.168.1.20", device: "Device C", vulnerability: "CVE-2024-139 [VPN Traffic Hijack]", status: "Exploited" },
    { ip: "192.168.1.25", device: "Device D", vulnerability: "CVE-2019-14899 [VPN Traffic Hijack]", status: "Not Exploited" }
  ];

  let exportFormat = "PDF"; // Default export format
  let availableFormats = ["PDF", "CSV", "XML"];

  // Function to handle export action
  function exportReport() {
    console.log("Exporting report in format:", exportFormat);
  }
</script>

<!-- Layout with Sidebar and Report Screen -->
<div class="main-container">
  <!-- Sidebar -->
  <div class="sidebar-container">
    <Sidebar />
  </div>

  <!-- Report Screen UI -->
  <div class="report-screen">
    <!-- Header Section -->
    <h1>Report</h1>
    <button class="folder-btn" on:click={() => console.log("Opening project folder for:", currentProject)}>Open Current Project Folder</button>

    <!-- Table Section: Device Vulnerability Report -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>IP Address</th>
            <th>Device</th>
            <th>Vulnerability</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {#each devices as device}
            <tr>
              <td>{device.ip}</td>
              <td>{device.device}</td>
              <td>{device.vulnerability}</td>
              <td>{device.status}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Export Section -->
    <div class="export-section">
      <label for="export-format">Format to export</label>
      <select id="export-format" bind:value={exportFormat}>
        {#each availableFormats as format}
          <option value={format}>{format}</option>
        {/each}
      </select>
      <button class="export-btn" on:click={exportReport}>Export</button>
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
  .report-screen {
    flex-grow: 1;
    padding: 20px;
    font-family: Arial, sans-serif;
    background-color: #333;
  }

  h1 {
    margin-bottom: 20px;
  }

  .folder-btn {
    background-color: #1abc9c;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    margin-bottom: 20px;
    border-radius: 5px;
  }

  .folder-btn:hover {
    background-color: #16a085;
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

  .export-section {
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

  .export-btn {
    background-color: #1abc9c;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    border-radius: 5px;
  }

  .export-btn:hover {
    background-color: #16a085;
  }
</style>
