<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  import VulnerabilityTable from '$lib/components/VulnerabilityTable.svelte';
  import RankedEntryPointTable from '$lib/components/RankedEntryPointTable.svelte';
  import Port0EntryTable from '$lib/components/Port0EntryTable.svelte';
  import PortZeroEntryTable from '$lib/components/PortZeroEntryTable.svelte';

  let selectedProject = ''; // Selected project folder
  let ipList = writable<string[]>([]); // List of IP addresses from Neo4j
  let selectedIps = writable<string[]>([]); // List of selected scope IPs
  let analysisTypes = writable<string[]>([]); // Available analysis types
  let selectedAnalysisTypes = writable<string[]>([]); // Selected analyses

  let projectFolders = writable<string[]>([]); // List of project folders fetched from the server

  // Fetch project folders from the backend
  async function fetchProjectFolders() {
      try {
          const response = await fetch('http://localhost:3000/projects');
          if (response.ok) {
              const folders = await response.json();
              projectFolders.set(folders); // Set project folders in the store
          } else {
              console.error('Failed to fetch project folders');
          }
      } catch (error) {
          console.error('Error fetching project folders:', error);
      }
  }

  // Fetch other project data (IPs, analysis types) from the backend
  async function fetchProjectData() {
      try {
          const response = await fetch('http://localhost:3000/api/project-data');
          if (response.ok) {
              const data = await response.json();
              ipList.set(data.ipList); // Fetch IP list
              analysisTypes.set(data.analysisTypes); // Fetch analysis types
          } else {
              console.error('Failed to fetch project data');
          }
      } catch (error) {
          console.error('Error fetching project data:', error);
      }
  }

  onMount(() => {
      fetchProjectFolders(); // Fetch project folders on mount
      fetchProjectData();    // Fetch other project-related data on mount
  });

  // Move an item up in the list
  function moveUp(list, index) {
      if (index > 0) {
          const temp = list[index];
          list[index] = list[index - 1];
          list[index - 1] = temp;
      }
  }

  // Move an item down in the list
  function moveDown(list, index) {
      if (index < list.length - 1) {
          const temp = list[index];
          list[index] = list[index + 1];
          list[index + 1] = temp;
      }
  }

  // Start the analysis
  async function startAnalysis() {
      try {
          const selectedIpsVal = $selectedIps;
          const selectedAnalysisTypesVal = $selectedAnalysisTypes;

          const response = await fetch('http://localhost:3000/api/start-analysis', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  projectName: selectedProject,
                  ipList: selectedIpsVal,
                  analysisTypes: selectedAnalysisTypesVal,
              }),
          });
          if (response.ok) {
              console.log('Analysis started successfully');
          } else {
              console.error('Failed to start analysis');
          }
      } catch (error) {
          console.error('Error starting analysis:', error);
      }
  }
</script>
<div class="container h-full mx-auto flex flex-col space-y-4">
  <h2 class="h2">Configure Project and Analysis</h2>

  <!-- Current Project Folder -->
  <div>
      <label>Current Project Folder</label>
      <select bind:value={selectedProject}>
          <option value="" disabled>Select Project Folder</option>
          {#each $projectFolders as folder}
              <option value={folder}>{folder}</option>
          {/each}
      </select>
  </div>

  <!-- Scope IP List -->
  <div>
      <label>Scope IP List</label>
      <ul>
          {#each $ipList as ip, index}
              <li class="flex items-center">
                  <input type="checkbox" value={ip} bind:group={$selectedIps} /> {ip}
                  <button on:click={() => moveUp($ipList, index)}>⬆️</button>
                  <button on:click={() => moveDown($ipList, index)}>⬇️</button>
              </li>
          {/each}
      </ul>
  </div>

  <!-- Entry Points Allowed -->
  <div>
      <label>Entry Points Allowed</label>
      <ul>
          {#each $analysisTypes as analysis, index}
              <li class="flex items-center">
                  <input type="checkbox" value={analysis} bind:group={$selectedAnalysisTypes} /> {analysis}
                  <button on:click={() => moveUp($analysisTypes, index)}>⬆️</button>
                  <button on:click={() => moveDown($analysisTypes, index)}>⬇️</button>
              </li>
          {/each}
      </ul>
  </div>

  <!-- Data Tables -->
  <div class="data-tables-section">
    <h3>Vulnerabilities</h3>
    <VulnerabilityTable />

    <h3>Ranked Entry Points</h3>
    <RankedEntryPointTable />

    <h3>Port0 Entries</h3>
    <Port0EntryTable />

    <h3>PortZero Entries</h3>
    <PortZeroEntryTable />
  </div>

  <!-- Start Analysis Button -->
  <button class="btn variant-filled" on:click={startAnalysis}>Start Analysis</button>
</div>
