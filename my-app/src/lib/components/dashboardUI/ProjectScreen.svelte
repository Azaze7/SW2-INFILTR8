<script>
  import Sidebar from "$lib/components/dashboardUI/Sidebar.svelte"; // Adjust the path if necessary
  
  let currentProject = "Project Alpha";
  let ipList = ["192.168.1.10", "192.168.1.15", "192.168.1.20"];
  let analyses = ["Port Scan", "Vulnerability Scan", "Configuration Check"];
  let availableProjects = ["Project Alpha", "Project Beta", "Project Gamma"];

  // Move IP or Analysis up in the list
  function moveUp(index, list) {
    if (index > 0) {
      [list[index - 1], list[index]] = [list[index], list[index - 1]];
    }
  }

  // Move IP or Analysis down in the list
  function moveDown(index, list) {
    if (index < list.length - 1) {
      [list[index], list[index + 1]] = [list[index + 1], list[index]];
    }
  }

  // Start analysis function
  function startAnalysis() {
    console.log("Starting analysis for:", currentProject);
  }

  // Load a selected project
  function loadProject(project) {
    currentProject = project;
    console.log("Loaded project:", currentProject);
  }
</script>

<!-- Layout with Sidebar and ProjectScreen content -->
<div class="main-container">
  <!-- Sidebar -->
  <div class="sidebar-container">
    <Sidebar />
  </div>

  <!-- Main content of the Project Screen -->
  <div class="project-content">
    <div class="project-screen">
      <!-- Current Project Section -->
      <h1>Current project folder: {currentProject}</h1>
      <button on:click={() => console.log("Opening folder for:", currentProject)}>Open Current Project Folder</button>

      <!-- Scope IP List Section -->
      <section class="scope-ip-list">
        <h2>Scope IP List</h2>
        <ul>
          {#each ipList as ip, index}
            <li>
              {ip}
              <button on:click={() => moveUp(index, ipList)}>⬆️</button>
              <button on:click={() => moveDown(index, ipList)}>⬇️</button>
            </li>
          {/each}
        </ul>
      </section>

      <!-- Entry Points Allowed Section -->
      <section class="entry-points">
        <h2>Entry Points Allowed</h2>
        <ul>
          {#each analyses as analysis, index}
            <li>
              {analysis}
              <button on:click={() => moveUp(index, analyses)}>⬆️</button>
              <button on:click={() => moveDown(index, analyses)}>⬇️</button>
            </li>
          {/each}
        </ul>
      </section>

      <!-- Start Analysis Button -->
      <button class="start-analysis-btn" on:click={startAnalysis}>Start Analysis</button>

      <!-- Load Projects Section -->
      <section class="load-projects">
        <h2>Load Projects</h2>
        <ul>
          {#each availableProjects as project}
            <li>
              <button on:click={() => loadProject(project)}>{project}</button>
            </li>
          {/each}
        </ul>
      </section>
    </div>
  </div>
</div>

<!-- Styling for the Project Screen and Sidebar -->
<style>
  /* Main container for sidebar and content */
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

  /* Project screen content */
  .project-content {
    flex-grow: 1;
    padding: 20px;
    background-color: #2c3e50;
    color: white;
    font-family: Arial, sans-serif;
  }

  .project-screen {
    padding: 20px;
  }

  h1, h2 {
    margin-bottom: 10px;
  }

  button {
    background-color: #1abc9c;
    color: white;
    border: none;
    padding: 10px;
    margin: 5px;
    cursor: pointer;
  }

  button:hover {
    background-color: #16a085;
  }

  .start-analysis-btn {
    margin-top: 20px;
    background-color: #e74c3c;
  }

  .start-analysis-btn:hover {
    background-color: #c0392b;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    margin-bottom: 10px;
  }

  .scope-ip-list, .entry-points, .load-projects {
    margin-bottom: 30px;
  }
</style>
