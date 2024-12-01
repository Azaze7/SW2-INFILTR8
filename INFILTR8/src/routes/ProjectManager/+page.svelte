<!-- The Frontend Project Manager Page provides a dynamic interface for 
 managing and analyzing project data. It enables users to select a project 
 folder and fetch associated data, including exploit data, entry points, ranked 
 entry points, and port-specific entries. The data is displayed in interactive 
 tables using the `Datatable` component, with support for dynamic updates based 
 on the selected project. The page includes a responsive layout, intuitive project 
 selection, and real-time loading indicators or error messages to enhance user 
 experience. Its clean design and smooth transitions ensure ease of use for 
 configuring and analyzing projects effectively. -->
<script lang="ts">
    //Import writable stores from Svelte and other required libraries and components
    import { writable, type Writable } from 'svelte/store';
    import { onMount } from 'svelte';
    import Papa from 'papaparse';
    import Datatable from '$lib/components/datatable/Datatable.svelte';
    import { fetchData } from '$lib/api';
    //Define the structure for exploit data, entry points, and ranked entries
    interface ExploitData {
        file: string;
        name: string;
        ip: string;
        port: number;
        viable_exploit: string;
        archetype: string;
        svc_name: string;
        protocol: string;
        severity: number;
        pluginID: number;
        pluginName: string;
        pluginFamily: string;
    }

    interface EntryPoint {
        ip: string;
        port: number;
        vulnerability_count: number;
    }

    interface RankedEntry {
        ip: string;
        port: number;
        severity_score: number;
        exploit_score: number;
        distinct_vulnerabilities: number;
        combined_score: number;
    }
    //Declare writable stores for data and UI states
    let exploits: Writable<ExploitData[]> = writable([]);
    let entryPoints: Writable<EntryPoint[]> = writable([]);
    let rankedEntries: Writable<RankedEntry[]> = writable([]);
    let portEntries: Writable<ExploitData[]> = writable([]);
    let projectFolders: Writable<string[]> = writable([]);
    let selectedProject: string = '';

    let loading = writable(false); //tracks loading state
    let error = writable<string | null>(null); //hold error messages, if any

    // Column Definitions
    const exploitColumns = [
        { key: 'file', label: 'File' },
        { key: 'name', label: 'Name' },
        { key: 'ip', label: 'IP Address' },
        { key: 'port', label: 'Port' },
        { key: 'viable_exploit', label: 'Viable Exploit' },
        { key: 'archetype', label: 'Archetype' },
        { key: 'svc_name', label: 'Service Name' },
        { key: 'protocol', label: 'Protocol' },
        { key: 'severity', label: 'Severity' },
        { key: 'pluginID', label: 'Plugin ID' },
        { key: 'pluginName', label: 'Plugin Name' },
        { key: 'pluginFamily', label: 'Plugin Family' }
    ];

    const entryPointColumns = [
        { key: 'ip', label: 'IP Address' },
        { key: 'port', label: 'Port' },
        { key: 'vulnerability_count', label: 'Vulnerability Count' }
    ];

    const rankedEntryColumns = [
        { key: 'ip', label: 'IP Address' },
        { key: 'port', label: 'Port' },
        { key: 'severity_score', label: 'Severity Score' },
        { key: 'exploit_score', label: 'Exploit Score' },
        { key: 'distinct_vulnerabilities', label: 'Distinct Vulnerabilities' },
        { key: 'combined_score', label: 'Combined Score' }
    ];


    let activeTable: Writable<string> = writable(''); // Track the active table view
    let activeProject: Writable<string> = writable('');// Track the active project view


    // Function to set the active table
    function showTable(table: string) {
        activeTable.set(table);
    }

    //Fetch project folders on mount
    onMount(fetchProjectFolders);
    //Fetches list of project folders from an API and updates the store
    async function fetchProjectFolders() {
        try {
            const folders = await fetchData<string[]>('http://localhost:3000/projects');
            projectFolders.set(folders);
        } catch (err) {
            error.set('Failed to fetch project folders.');
            console.error(err);
        }
    }
    //Automatically fetch project data when a project is selected
    $: if (selectedProject && selectedProject !== $activeProject) {
        console.log('Switching project to:', selectedProject);

        // Clear data and reset the table
        exploits.set([]);
        entryPoints.set([]);
        rankedEntries.set([]);
        portEntries.set([]);
        activeTable.set('');

        // Update active project
        activeProject.set(selectedProject);
        console.log('Fetching data for:', selectedProject);

        // Fetch new data
        fetchProjectData(selectedProject);
    }


    //Fetches and parses various CSV files related to a specific project
    async function fetchProjectData(project: string) {
    loading.set(true); // Start loading
    error.set(null); // Clear error state
    
    // Clear existing data before loading
    exploits.set([]);
    entryPoints.set([]);
    rankedEntries.set([]);
    portEntries.set([]);

    try {
        const basePath = `/server/data/${project}`;
        await Promise.all([
            fetchAndParse<ExploitData>(`${basePath}/data_with_exploits.csv`, exploits),
            fetchAndParse<EntryPoint>(`${basePath}/entrypoint_most_info.csv`, entryPoints),
            fetchAndParse<RankedEntry>(`${basePath}/ranked_entry_points.csv`, rankedEntries),
            fetchAndParse<ExploitData>(`${basePath}/port_0_entries.csv`, portEntries),
        ]);
    } catch (err) {
        error.set(`Failed to load data for project: ${project}`);
        console.error(err);
    } finally {
        loading.set(false); // End loading
    }
}

    //Helper function to fetch CSV files and parse them into Svelte stores
    async function fetchAndParse<T>(url: string, store: Writable<T[]>) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch ${url}`);
            const text = await response.text();
            Papa.parse(text, {
                header: true, //uses the first row as column headers
                skipEmptyLines: true, //ingornes empty rows
                complete: (results) => store.set(results.data as T[])
            });
        } catch (err) {
            console.error(`Error fetching or parsing ${url}:`, err);
        }
    }
</script>

<!-- HTML Layout -->
<div class="container mx-auto px-4 space-y-4">
    <header class="flex justify-between gap-4">
        <h2 class="text-2xl font-semibold">Configure Project and Analysis</h2>
    </header>

    <section class="flex gap-4 overflow-x-auto px-4 py-2">
        <h3>Projects</h3>
        <div class="flex gap-4 overflow-x-auto px-4 py-2">

            


            {#each $projectFolders as folder, index}
                <button
                    id={`project-${index}`}
                    name={`project-${index}`}
                    class="card"
                    on:click={() => {
                        selectedProject = folder;
                        activeProject.set(''); // Clear activeProject before loading the new one
                        exploits.set([]);
                        entryPoints.set([]);
                        rankedEntries.set([]);
                        portEntries.set([]);
                        activeTable.set(''); // Clear activeTable
                    }}
                >
                    {folder}
                </button>
            {/each}
        </div>

        
        <div class="flex gap-4 overflow-x-auto px-4 py-2">
            <h3>Tables</h3>
            <button class="card" on:click={() => showTable('DataExplot')}>DataExplots</button>
            <button class="card" on:click={() => showTable('EntryPoint')}>EntryPoint</button>
            <button class="card" on:click={() => showTable('RankedEntry')}>RankedEntry</button>
            <button class="card" on:click={() => showTable('Port0')}>Port0</button>
        </div>

    </section>
    <!-- Show loading, error messages, or data tables based on current state -->
    {#if $loading}
    <p>Loading data...</p>
{:else if $error}
    <p class="text-red-500">{$error}</p>
    {:else}
    {#if $activeProject === selectedProject && $activeTable === 'DataExplot'}
        <section>
            <h3>Data with Exploits</h3>
            <Datatable data={$exploits} columns={exploitColumns} />
        </section>
    {/if}

    {#if $activeProject === selectedProject && $activeTable === 'EntryPoint'}
        <section>
            <h3>Entry Points (Most Info)</h3>
            <Datatable data={$entryPoints} columns={entryPointColumns} />
        </section>
    {/if}

    {#if $activeProject === selectedProject && $activeTable === 'RankedEntry'}
        <section>
            <h3>Ranked Entry Points</h3>
            <Datatable data={$rankedEntries} columns={rankedEntryColumns} />
        </section>
    {/if}

    {#if $activeProject === selectedProject && $activeTable === 'Port0'}
        <section>
            <h3>Port 0 Entries</h3>
            <Datatable data={$portEntries} columns={exploitColumns} />
        </section>
    {/if}

{/if}
</div>

<!-- Styles -->
<style>
    .container {
        padding: 20px;
    }

    .card {
        background-color: #174972;
        color: white;
        border-radius: 8px;
        padding: 16px;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .card:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
</style>
