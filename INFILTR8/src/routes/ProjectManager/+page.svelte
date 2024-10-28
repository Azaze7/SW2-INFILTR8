<script lang="ts">
    import { writable, type Writable } from 'svelte/store';
    import { onMount } from 'svelte';
    import Papa from 'papaparse';
    /*
    import DataWithExploits from '$lib/components/DataWithExploits.svelte';
    import EntrypointMostInfo from '$lib/components/entrypoint_most_info.svelte';
    import RankedEntryPointTable from '$lib/components/RankedEntryPointTable.svelte';
    */
    import Datatable from '$lib/components/datatable/Datatable.svelte';
    import { fetchData } from '$lib/api';

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

    let exploits: Writable<ExploitData[]> = writable([]);
    let entryPoints: Writable<EntryPoint[]> = writable([]);
    let rankedEntries: Writable<RankedEntry[]> = writable([]);
    let portEntries: Writable<ExploitData[]> = writable([]);
    let projectFolders: Writable<string[]> = writable([]);
    let selectedProject: string = '';

    // New stores to hold Scope IPs and available analyses
    let scopeIPs: Writable<{ ip: string }[]> = writable([]);
    let availableAnalyses: Writable<{ analysis: string }[]> = writable([]);

    // Define col structures for each table
    const rankedEntryColumns = [
        { key: 'ip', label: 'IP Address' },
        { key: 'port', label: 'Port' },
        { key: 'severity_score', label: 'Severity Score' },
        { key: 'exploit_score', label: 'Exploit Score' },
        { key: 'distinct_vulnerabilities', label: 'Distinct Vulnerabilities' },
        { key: 'combined_score', label: 'Combined Score' }
    ];

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

    const portEntryColumns = [
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

    // Fetch and parse CSV data based on the selected project
    async function fetchProjectData(project: string) {
        try {
            const basePath = `/INFILTR8/server/data/${project}`;
            await Promise.all([
                fetchAndParse<ExploitData>(`${basePath}/data_with_exploits.csv`, exploits),
                fetchAndParse<EntryPoint>(`${basePath}/entrypoint_most_info.csv`, entryPoints),
                fetchAndParse<RankedEntry>(`${basePath}/ranked_entry_points.csv`, rankedEntries),
                fetchAndParse<ExploitData>(`${basePath}/port_0_entries.csv`, portEntries)
            ]);

            console.log("Exploits after fetch:", $exploits);
            console.log("Entry Points after fetch:", $entryPoints);
            console.log("Ranked Entries after fetch:", $rankedEntries);
            console.log("Port Entries after fetch:", $portEntries);
        } catch (error) {
            console.error('Error fetching project data:', error);
        }
    }

    async function fetchAndParse<T>(url: string, store: Writable<T[]>) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);
        const text = await response.text();
        Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => store.set(results.data as T[])
        });
    }

    async function fetchProjectFolders() {
        try {
            const folders = await fetchData<string[]>('http://localhost:3000/projects');
            projectFolders.set(folders);
        } catch (error) {
            console.error('Error fetching project folders:', error);
        }
    }

    function moveUp<T>(list: Writable<T[]>, index: number) {
        list.update(arr => {
            if (index > 0) [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
            return arr;
        });
    }

    function moveDown<T>(list: Writable<T[]>, index: number) {
        list.update(arr => {
            if (index < arr.length - 1) [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
            return arr;
        });
    }

    $: if (selectedProject) fetchProjectData(selectedProject);
    console.log("Exploits:", $exploits);
    console.log("Entry Points:", $entryPoints);
    console.log("Ranked Entries:", $rankedEntries);
    console.log("Port Entries:", $portEntries);
    onMount(fetchProjectFolders);
</script>

<div class="overflow-x-auto space-y-4 container mx-auto px-4">
    <!-- Header -->
    <header class="flex justify-between gap-4">
        <h2 class="text-2xl font-semibold">Configure Project and Analysis</h2>
    </header>
</div>

<div class="container h-full mx-auto flex flex-col space-y-4">
    <h2 class="h2">Configure Project and Analysis</h2>

    <!-- Project Selection -->
    <h3>Projects</h3>
    <div class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto px-4 py-2 rounded-md shadow-sm">
        {#each $projectFolders as folder}
            <button
                class="snap-start shrink-0 card py-4 px-6 w-40 md:w-60 text-center cursor-pointer hover:bg-primary-100 rounded-md shadow transition duration-300"
                on:click={() => (selectedProject = folder)}
            >
                {folder}
            </button>
        {/each}
    </div>

    <!-- Exploits Table -->
    <section>
        <h3>Data with Exploits</h3>
        <Datatable data={$exploits} columns={exploitColumns} />
    </section>

    <!-- Entry Points Table -->
    <section>
        <h3>Entry Points (Most Info)</h3>
        <Datatable data={$entryPoints} columns={entryPointColumns} />
    </section>

    <!-- Ranked Entry Points Table -->
    <section>
        <h3>Ranked Entry Points</h3>
        <Datatable data={$rankedEntries} columns={rankedEntryColumns} />
    </section>

    <!-- Port 0 Entries Table -->
    <section>
        <h3>Port 0 Entries</h3>
        <Datatable data={$portEntries} columns={portEntryColumns} />
    </section>
</div>

<style>
    .container {
        padding: 20px;
    }

    .snap-x {
        display: flex;
        gap: 16px;
        overflow-x: auto;
    }

    .card {
        background-color: #174972;
        color: white;
        border-radius: 8px;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .card:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
</style>
