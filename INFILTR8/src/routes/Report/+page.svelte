<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
    import { onMount } from 'svelte';
    import Papa from 'papaparse';
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

    let exploits: Writable<ExploitData[]> = writable([]);
    let projectFolders: Writable<string[]> = writable([]);
    let selectedProject: Writable<string> = writable('');
    let ipList: Writable<{ ip: string; device: string; vulnerability: string; status: string }[]> = writable([]);

    onMount(fetchProjectFolders);

    async function fetchProjectFolders() {
        try {
            const folders = await fetchData<string[]>('http://localhost:3000/projects');
            projectFolders.set(folders);
        } catch (err) {
            error.set('Failed to fetch project folders.');
            console.error(err);
        }
    }

    let folder = {
        name: "Current Folder",
        items: 63,
        size: "621 MB"
    };

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

    $: if ($selectedProject) {
        fetchIpList($selectedProject);
    }

    async function fetchIpList(project: string) {
        try {
            const ipListData = await fetchData<{ ip: string; device: string; vulnerability: string; status: string }[]>(
                `http://localhost:3000/ip-list/${project}`
            );
            ipList.set(ipListData);
        } catch (err) {
            console.error('Error fetching IP list:', err);
        }
    }

    async function fetchProjectData(project: string) {
        loading.set(true);
        error.set(null);
        const basePath = `/server/data/${project}`;

        try {
            await Promise.all([
                fetchAndParse<ExploitData>(`${basePath}/data_with_exploits.csv`, exploits),
            ]);
        } catch (err) {
            error.set(`Failed to load data for project: ${project}`);
            console.error(err);
        } finally {
            loading.set(false);
        }
    }

    async function fetchAndParse<T>(url: string, store: Writable<T[]>) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch ${url}`);
            const text = await response.text();
            Papa.parse(text, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => store.set(results.data as T[])
            });
        } catch (err) {
            console.error(`Error fetching or parsing ${url}:`, err);
        }
    }

    let selectedFileType = ''; 

    function exportData() {
        if (!selectedFileType) {
            alert("Please select a file type to export.");
            return;
        }
        alert(`Exporting data as ${selectedFileType}`);
    }
</script>

<main class="p-8 overflow-y-auto">
    <h1 class="text-center text-3xl font-semibold mb-4">Reports</h1>

    <!-- Project Selection -->
    <div class="flex flex-col items-center bg-blue-900 text-white rounded-xl shadow-md p-4 mb-4 w-full max-w-xs mx-auto hover:scale-105 hover:shadow-lg transition-transform">
        <h2 class="text-lg font-semibold text-center">Select a Project</h2>
        <select
            class="bg-gray-900 text-white p-2 rounded-md border border-gray-600 w-full mt-4"
            on:change="{e => selectedProject.set(e.target.value)}"
            bind:value="{$selectedProject}"
        >
            {#each $projectFolders as folder}
                <option value="{folder}">{folder}</option>
            {/each}
        </select>
    </div>

    <!-- IP List Header -->
    <h2 class="text-xl font-semibold mb-4 text-blue-800">IP List</h2>

    <!-- Table Header -->
    <div class="grid grid-cols-[0.1fr_1fr_1fr_2fr_1fr] p-2 bg-gray-800 text-white rounded-md mb-4">
        <span>Select</span>
        <span>IP Address</span>
        <span>Device</span>
        <span>Vulnerability</span>
        <span>Status</span>
    </div>

    <!-- IP List Items -->
    <ul class="space-y-2">
        {#each $ipList as item}
            <li class="grid grid-cols-[0.1fr_1fr_1fr_2fr_1fr] p-2 bg-gray-900 text-white rounded-md items-center">
                <span><input type="checkbox" class="mr-2 scale-110"></span>
                <span>{item.ip}</span>
                <span>{item.device}</span>
                <span>{item.vulnerability}</span>
                <span>{item.status}</span>
            </li>
        {/each}
    </ul>

    <!-- Export Controls -->
    <div class="flex items-center justify-between mt-6">
        <div class="flex flex-col w-1/3">
            <label for="fileType" class="text-gray-700 mb-2">Select file type:</label>
            <select id="fileType" class="bg-gray-900 text-white p-2 rounded-md border border-gray-600" on:change="{e => selectedFileType = e.target.value}">
                <option value="">Select File Type</option>
                <option value="PDF">PDF</option>
                <option value="XML">XML</option>
            </select>
        </div>

        <button on:click="{exportData}" class="bg-gray-900 text-white px-6 py-2 rounded-md border border-gray-600 hover:bg-gray-700">
            Export
        </button>
    </div>
</main>