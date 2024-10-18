<script lang="ts">
    import { writable, type Writable } from 'svelte/store';
    import { onMount } from 'svelte';
    import Papa from 'papaparse';
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

    let scopeIPs: Writable<string[]> = writable([]);
    let availableAnalyses: Writable<string[]> = writable([]);

    let selectedFileType = '';
    const fileTypes = ['PDF', 'XML'];

    async function fetchCsvData(project: string) {
        try {
            const basePath = `/server/data/${project}`;

            await Promise.all([
                fetchAndParse<ExploitData>(`${basePath}/data_with_exploits.csv`, exploits),
                fetchAndParse<EntryPoint>(`${basePath}/entrypoint_most_info.csv`, entryPoints),
                fetchAndParse<RankedEntry>(`${basePath}/ranked_entry_points.csv`, rankedEntries)
            ]);

            scopeIPs.set($entryPoints.map((entry) => entry.ip));
            availableAnalyses.set($rankedEntries.map((entry) => `Port ${entry.port} - Score ${entry.combined_score}`));
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

    function exportData() {
        console.log(`Exporting as ${selectedFileType}`);
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

<div class="grid-container">
    <main class="main-content">
        <div class="logo"><a href="#"><span>Lo</span>gs</a></div>
        <h1>Reports</h1>

        <div class="snap-x scroll-smooth flex gap-4 overflow-x-auto px-4 py-2">
            {#each $projectFolders as folder}
                <div
                    class="folder-card"
                    on:click={() => (selectedProject = folder)}
                >
                    <div class="folder-icon">
                        <img src="https://img.icons8.com/ios-filled/50/000000/folder-invoices.png" alt="Folder Icon" />
                    </div>
                    <div class="folder-details">
                        <h2>{folder}</h2>
                        <p>Click to select project</p>
                    </div>
                    <div class="folder-options">
                        <span>⋮</span>
                    </div>
                </div>
            {/each}
        </div>

        <h2>IP List</h2>
        <div class="ip-list-container">
            <div class="ip-header">
                <span class="ip-header-item"></span>
                <span class="ip-header-item">IP Address</span>
                <span class="ip-header-item">Actions</span>
            </div>

            <ul class="ip-list">
                {#each $scopeIPs as ip, index}
                    <li class="ip-item">
                        <span>
                            <input type="checkbox">
                        </span>
                        <span class="ip-text">{ip}</span>
                        <span>
                            <button on:click={() => moveUp(scopeIPs, index)}>↑</button>
                            <button on:click={() => moveDown(scopeIPs, index)}>↓</button>
                        </span>
                    </li>
                {/each}
            </ul>
        </div>

        <h3>Entry Points Allowed</h3>
        <ul>
            {#each $availableAnalyses as analysis, index}
                <li>
                    {analysis}
                    <button on:click={() => moveUp(availableAnalyses, index)}>↑</button>
                    <button on:click={() => moveDown(availableAnalyses, index)}>↓</button>
                </li>
            {/each}
        </ul>

        <div class="action-container">
            <div class="file-type-selection">
                <label for="fileType">Select file type:</label>
                <select id="fileType" class="select-dropdown" bind:value={selectedFileType}>
                    <option value="" disabled>Select File Type</option>
                    {#each fileTypes as fileType}
                        <option value={fileType}>{fileType}</option>
                    {/each}
                </select>
            </div>

            <button on:click={exportData} class="export-button">Export</button>
        </div>
    </main>
</div>
<style>
    .grid-container {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
        height: 100vh;
    }

    .folder-card {
        background-color: #174972;
        border-radius: 16px;
        display: flex;
        align-items: center;
        padding: 10px 20px;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .folder-card:hover {
        transform: scale(1.02);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .folder-icon img {
        width: 50px;
    }

    .ip-item {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .export-button {
        background-color: #1d1b28;
        color: white;
        padding: 10px 20px;
        border: none;
        cursor: pointer;
    }
</style>
