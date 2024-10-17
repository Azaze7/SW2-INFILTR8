<script lang="ts">
    import Papa, { ParseResult } from 'papaparse';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
  
    import VulnerabilityTable from '$lib/components/VulnerabilityTable.svelte';
    import RankedEntryPointTable from '$lib/components/RankedEntryPointTable.svelte';
    import Port0EntryTable from '$lib/components/Port0EntryTable.svelte';
    import PortZeroEntryTable from '$lib/components/PortZeroEntryTable.svelte';
	import { fetchPort0Entries, fetchVulnerabilities } from '$lib/api';
	import type { Vulnerability, PortZeroEntryRow } from '$lib/types';
  
    let vulnerabilities = writable<Vulnerability[]>([]);
    let port0Entries = writable<PortZeroEntryRow[]>([]);
    let portZeroEntries = writable<PortZeroEntryRow[]>([]);

    let selectedProject = ''; // Selected project folder
    let ipList = writable<string[]>([]); // List of IP addresses from Neo4j
    let selectedIps = writable<string[]>([]); // List of selected scope IPs
    let analysisTypes = writable<string[]>([]); // Available analysis types
    let selectedAnalysisTypes = writable<string[]>([]); // Selected analyses
    let projectFolders = writable<string[]>([]); // List of project folders fetched from the server

    //Fetch csv files and parse them
    async function fetchCsvData(){
        try{
            //fetch vulnerability CSV
            const vulnerabilityRes = await fetch('/server/data/z/data_with_exploits.csv');
            const vulnerabilityText = await vulnerabilityRes.text();
            Papa.parse<Vulnerability>(vulnerabilityText, {
                header: true,
                complete: function(results: ParseResult<Vulnerability>){
                    vulnerabilities.set(results.data); //setting vulnerability data
                }
            });

            //fetch port 0 entries csv
            const port0Res = await fetch('/server/data/z/port_0_entries.csv');
            const port0Text = await port0Res.text();
            Papa.parse<PortZeroEntryRow>(port0Text,{
                header: true,
                complete: function(results: ParseResult<PortZeroEntryRow>){
                    port0Entries.set(results.data);
                }
            })

            //fetch port 0 entries csv
            const portZeroRes = await fetch('/server/data/z/entrypoint_most_info.csv');
            const portZeroText = await portZeroRes.text();
            Papa.parse<PortZeroEntryRow>(portZeroText, {
                header: true,
                complete: function(results: ParseResult<PortZeroEntryRow>) {
                    portZeroEntries.set(results.data); //set port zero entries data
                }
            });
        }catch(error){
            console.error('Error fetching or pasing CSV:', error);
        }
    }
    onMount(() => {
    fetchCsvData(); //Fetch CSV data on mount
    fetchProjectFolders(); //Fetch project folders on mount
    fetchProjectData();    //Fetch other project-related data on mount
    }); 
    //Fetch project folders from the backend
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
                if (data.ipList) ipList.set(data.ipList); // Fetch IP list
                if (data.analysisTypes) analysisTypes.set(data.analysisTypes); // Fetch analysis types
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
    function moveUp(list: string[], index: number) {
        if (index > 0) {
            const temp = list[index];
            list[index] = list[index - 1];
            list[index - 1] = temp;
        }
    }
  
    // Move an item down in the list
    function moveDown(list: string[], index: number) {
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
        <label for="project-folder">Current Project Folder</label>
        <select class="text-gray-700" id="project-folder" bind:value={selectedProject}>
            <option value="" disabled>Select Project Folder</option>
            {#each $projectFolders as folder}
                <option value={folder}>{folder}</option>
            {/each}
        </select>
    </div>
  
    <div class="flex justify-center gap-5">
      <button class="btn btn-sm variant-ghost-surface" >Port0</button>
      <button class="btn btn-sm variant-ghost-surface" >Exploits</button>
      <button class="btn btn-sm variant-ghost-surface" >Ranked Entry</button>
      <button class="btn btn-sm variant-ghost-surface" >Info</button>
    </div>
  
    <!-- Scope IP List -->
    <div>
        <label for="ip-list">Scope IP List</label>
        <ul id="ip-list">
          {#each $ipList as ip, index (ip)}
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
        <label for="analysis-types">Entry Points Allowed</label>
        <ul id="analysis-types">
          {#each $analysisTypes as analysis, index (analysis)}
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
  
  <style>
    .container {
      padding: 20px;
    }
  </style>
  