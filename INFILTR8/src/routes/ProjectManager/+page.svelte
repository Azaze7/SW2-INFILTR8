<script lang="ts">
    import { writable, type Writable } from 'svelte/store';
    import { onMount } from 'svelte';
    import Papa from 'papaparse';

    import Datatable from '$lib/components/datatable/Datatable.svelte';
    import DataWithExploits from '$lib/components/DataWithExploits.svelte';
    import EntrypointMostInfo from '$lib/components/entrypoint_most_info.svelte';
    import RankedEntryPointTable from '$lib/components/RankedEntryPointTable.svelte';
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
    let projectFolders: Writable<string[]> = writable([]);
    let selectedProject: string = '';

    // New stores to hold Scope IPs and available analyses
    let scopeIPs: Writable<{ ip: string }[]> = writable([]);
    let availableAnalyses: Writable<{ analysis: string }[]> = writable([]);

    //Define col structures for each table
    const scopeIPColumns = [
        { key: 'ip', label: 'IP Address' }
    ];

    const analysesColumns = [
        { key: 'analysis', label: 'Entry Points Allowed' }
    ];

    async function fetchCsvData(project: string) {
        try {
            const basePath = `/server/data/${project}`;

            await Promise.all([
                fetchAndParse<ExploitData>(`${basePath}/data_with_exploits.csv`, exploits),
                fetchAndParse<EntryPoint>(`${basePath}/entrypoint_most_info.csv`, entryPoints),
                fetchAndParse<RankedEntry>(`${basePath}/ranked_entry_points.csv`, rankedEntries)
            ]);

            // Populate `scopeIPs` as an array of objects
            scopeIPs.set($entryPoints.map((entry) => ({ ip: entry.ip })));
            availableAnalyses.set($rankedEntries.map((entry) => ({ analysis: `Port ${entry.port} - Score ${entry.combined_score}` })));
        } catch (error) {
            console.error('Error fetching or parsing CSV:', error);
        }
    }

    async function fetchAndParse<T>(url: string, store: Writable<T[]>) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);
        const text = await response.text();
        Papa.parse(text, {
            header: true,
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

    $: if (selectedProject) fetchCsvData(selectedProject);
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

    <!-- Scope IP List Section using Datatable component -->
    <section class="mt-8">
        <h3>Scope IP List</h3>
        <Datatable data={$scopeIPs} columns={scopeIPColumns} />
    </section>

    <!-- Entry Points Allowed Section using Datatable component -->
    <section class="mt-8">
        <h3>Entry Points Allowed</h3>
        <Datatable data={$availableAnalyses} columns={analysesColumns} />
    </section>


    <!-- Data Tables Section -->
    <div class="data-tables-section space-y-4">
        <h3>Data with Exploits</h3>
        <DataWithExploits exploits={$exploits} />

        <h3>Ranked Entry Points</h3>
        <RankedEntryPointTable rankedEntries={$rankedEntries} />

        <h3>Entry Points (Most Info)</h3>
        <EntrypointMostInfo entries={$entryPoints} />
    </div>
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
