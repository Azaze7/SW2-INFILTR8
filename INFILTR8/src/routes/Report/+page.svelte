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
    interface RankedEntry {
        ip: string;
        port: number;
        severity_score: number;
        exploit_score: number;
        distinct_vulnerabilities: number;
        combined_score: number;
    }

    let exploits: Writable<ExploitData[]> = writable([]);
    let projectFolders: Writable<string[]> = writable([]);
    let selectedProject: Writable<string> = writable('');
    let rankedEntries: Writable<RankedEntry[]> = writable([]);
    let loading = writable(false);
    let error = writable<string | null>(null);

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

    const rankedEntryColumns = [
        { key: 'ip', label: 'IP Address' },
        { key: 'port', label: 'Port' },
        { key: 'severity_score', label: 'Severity Score' },
        { key: 'exploit_score', label: 'Exploit Score' },
        { key: 'distinct_vulnerabilities', label: 'Distinct Vulnerabilities' },
        { key: 'combined_score', label: 'Combined Score' }
    ];

    async function fetchProjectData(project: string) {
        loading.set(true);
        error.set(null);
        const basePath = `/server/data/${project}`;

        try {
            await Promise.all([
                fetchAndParse<ExploitData>(`${basePath}/data_with_exploits.csv`, exploits),
                fetchAndParse<RankedEntry>(`${basePath}/ranked_entry_points.csv`, rankedEntries)
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

    $: {
      if ($selectedProject) {
          fetchProjectData($selectedProject);
      }
    }

    let selectedFileType = ''; 

    function exportData() {
        if (!selectedFileType) {
            alert("No file type selected! Please select one from the drop down menu.");
            return;
        }
        alert(`Exporting report for ${selectedProject} to ${selectedFileType}`);
    }
</script>

<main class="p-8 overflow-y-auto">
    <h1 class="text-center text-3xl font-semibold mb-4">Reports</h1>
  
    <section>
        <h3>Projects</h3>
        <div class="flex gap-4 overflow-x-auto px-4 py-2">
            {#each $projectFolders as folder, index}
                <button
                    id={`project-${index}`}
                    name={`project-${index}`}
                    class="card p-4 text-1xl"
                    on:click={() => selectedProject.set(folder)}
                >
                    {folder}
                </button>
            {/each}
        </div>
    </section>
  
    <h2 class="text-xl font-semibold mb-4 text-blue-800">IP List</h2>
  
    <table class="min-w-full table-auto border-collapse border border-gray-700">
      <thead class="bg-gray-800 text-white">
        <tr>
          <th class="border border-gray-600 px-4 py-2">IP Address</th>
          <th class="border border-gray-600 px-4 py-2">Exploit Score</th>
        </tr>
      </thead>
      <tbody>
        {#each $rankedEntries as entry}
          <tr class="bg-gray-700 text-white">
            <td class="border border-gray-600 px-4 py-2">{entry.ip}</td>
            <td class="border border-gray-600 px-4 py-2">{entry.exploit_score}</td>
          </tr>
        {/each}
      </tbody>
    </table>

    <div class="flex items-center justify-between mt-6">
        <div class="flex flex-col w-1/3">
            <label for="fileType" class="text-gray-700 mb-2">Select file type:</label>
            <select id="fileType" class="bg-gray-900 text-white p-2 rounded-md border border-gray-600" bind:value="{selectedFileType}">
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