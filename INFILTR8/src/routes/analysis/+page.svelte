<script lang="ts"> 
    import { writable, type Writable } from 'svelte/store'; 
    import { onMount } from 'svelte'; 
    import Papa from 'papaparse'; 
    import { fetchData } from '$lib/api'; 
    import jsPDF from 'jspdf'; 
    import { createLogEntry } from '../../routes/Logs/logservice';

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
    const attackTypes = ['*All','Unauthenticated Port Bypass', 'Default Credentials', 'Unpatched Software Exploits', 'Missing Encryption Protocols', 'Weak Passwords (Brute Force)']
    let progress: Writable<number> = writable(0);
    let selectedTime = '';
    let selectedAMPM = '';
    let fullTime = '';
    let attackType = '';
    const timeOptions: string[] = [];
    const ampmOptions: string[] = ['AM', 'PM'];

    //Dropdown for time.
    for (let hour = 1; hour <= 12; hour++) {
        ['00', '15', '30', '45'].forEach((minute) => {
            timeOptions.push(`${hour}:${minute}`);
        });
    }
    
    async function fetchCsvData(project: string) {
        try {
            const basePath = `/server/data/${project}`;
            progress.set(10);
            await Promise.all([
                fetchAndParse<ExploitData>(`${basePath}/data_with_exploits.csv`, exploits),
                fetchAndParse<EntryPoint>(`${basePath}/entrypoint_most_info.csv`, entryPoints),
                fetchAndParse<RankedEntry>(`${basePath}/ranked_entry_points.csv`, rankedEntries)
            ]);
            scopeIPs.set($entryPoints.map((entry) => entry.ip));
            availableAnalyses.set($rankedEntries.map((entry) => `Port ${entry.port} - Score ${entry.combined_score}`));
            progress.set(40);
            progress.set(100);
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
        if (!selectedFileType) {
            console.log('No file type selected');
            return;
        }
        console.log(`Exporting as ${selectedFileType}`);
        const data = {
            selectedProject,
            exploits: $exploits,
            entryPoints: $entryPoints,
            rankedEntries: $rankedEntries
        };
        if (selectedFileType === 'PDF') {
            exportToPDF(data);
        } else if (selectedFileType === 'XML') {
            exportToXML(data);
        }
    }

    //To DO. (ADD THIS!)
    function confirmAnalysis(){
        fullTime = selectedTime + selectedAMPM;
        console.log('Analysis Appointment Confirmed:', fullTime);
        createLogEntry({
        type: 'Information',
        message: `${fullTime} is confirmed as Appointment Time!`
    });
    }

    function exportToPDF(data: any) {
    console.log('Exporting Project Folder to PDF:', selectedProject);
    createLogEntry({
        type: 'Information',
        message: `Project ${selectedProject} was exported as a PDF!`
    });
    const doc = new jsPDF();
    doc.text(`INFILTR8 REPORT`, 10, 10);
    const now = new Date();
    const formattedDateTime = now.toLocaleString();

    doc.text(`GENERATED: ${formattedDateTime}`, 10, 20);
    doc.text(`Team: TEAM #6 - The Nine Bytes`, 10, 30);
    if(selectedProject == null){
        doc.text(`Project: null`, 10, 10);
        doc.text(`Exoloits: null`, 10, 10);
        doc.text(`Entry Points: null`, 10, 10);
        doc.text(`Ranked Entries: null`, 10, 10);
        return;
    }

    doc.text(`Project: ${data.selectedProject}`, 10, 40);
    
    let yOffset = 20;
    const maxEntriesPerPage = 40;

    //Ensure font size for pdf is small to not cut off anything.
    doc.setFontSize(10);

    const addEntriesToPage = (title: string, entries: string[]) => {
        let pageCount = 1;
        let entryCount = 0;
        doc.addPage();
        yOffset = 20;
        doc.text(`${title}:`, 10, yOffset);
        yOffset += 10;

        entries.forEach((entry, index) => {
            if (index % maxEntriesPerPage === 0 && index !== 0) {
                doc.addPage();
                pageCount++;
                yOffset = 20;
                doc.text(`${title} (continued): Page ${pageCount}`, 10, yOffset);
                yOffset += 10;
            }
            doc.text(entry, 10, yOffset);
            yOffset += 10;
            entryCount++;
        });
    };

    //Write exploits to pdf
    const exploitEntries = data.exploits.map((exploit: ExploitData, index: number) => `${index + 1}. ${exploit.name} - ${exploit.viable_exploit}`);
    addEntriesToPage("Exploits", exploitEntries);

    //Write entrypoints to pdf
    const entryPointEntries = data.entryPoints.map((entry: EntryPoint, index: number) => `${index + 1}. ${entry.ip}:${entry.port} - Vulnerabilities: ${entry.vulnerability_count}`);
    addEntriesToPage("Entry Points", entryPointEntries);

    //Write rankedEntries to pdf
    const rankedEntries = data.rankedEntries.map((entry: RankedEntry, index: number) => `${index + 1}. ${entry.ip}:${entry.port} - Score: ${entry.combined_score}`);
    addEntriesToPage("Ranked Entries", rankedEntries);

    const fileName = `${data.selectedProject}.pdf`;
    doc.save(fileName);
}


    function exportToXML(data: any) {
        console.log('Exporting Project Folder to XML:', selectedProject);
        createLogEntry({
        type: 'Information',
        message: `Project ${selectedProject} was exported as an XML!`
        });
        const xmlContent = jsonToXML(data);
        const blob = new Blob([xmlContent], { type: 'application/xml' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${data.selectedProject}.xml`;
        link.click();
    }

    function jsonToXML(json: any, root = true) {
        let xml = '';
        for (const key in json) {
            if (json.hasOwnProperty(key)) {
                const value = json[key];
                if (Array.isArray(value)) {
                    value.forEach((item) => {
                        xml += `<${key}>${jsonToXML(item, false)}</${key}>`;
                    });
                } else if (typeof value === 'object' && value !== null) {
                    xml += `<${key}>${jsonToXML(value, false)}</${key}>`;
                } else {
                    xml += `<${key}>${value}</${key}>`;
                }
            }
        }
        return root ? `<root>${xml}</root>` : xml;
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
    let showReport = false;

    function toggleReport(folder: string) {
        if (selectedProject === folder && showReport) {
            showReport = false;
            selectedProject = null as unknown as string;
            progress.set(0);
        } else {
            selectedProject = folder;
            showReport = true;
            progress.set(10);
        }
    }
</script>

<div class="grid-container"> 
    <main class="main-content"> 
        <h1>Available Project Folders:</h1> 
        <div class="snap-x scroll-smooth flex gap-4 overflow-x-auto px-4 py-2"> 
            {#each $projectFolders as folder} 
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class="folder-card" on:click={() => toggleReport(folder)}> 
                    <div class="folder-icon"> 
                        <img src="https://img.icons8.com/ios-filled/50/000000/folder-invoices.png" alt="Folder Icon" /> 
                    </div> 
                    <div class="folder-details"> 
                        <h2>{folder}</h2> 
                        <p>Click To See Project</p> 
                    </div> 
                    <div class="folder-options"> 
                        <span>⋮</span> 
                    </div> 
                </div> 
            {/each} 
        </div> 
        {#if showReport && selectedProject} 
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg progress-bar-container"> 
            <div class="progress-bar" style="width: {$progress}%"></div> 
            <div class="progress-details" style="text-align: right;">
                <p>Project Name: {selectedProject}</p> 
                <p>Overall Project Progress: {$progress}/100</p> 
            </div> 
        </div> 
        <div class="report"> 
            <h2>Report for {selectedProject}</h2> 
            <div class="scrollable-column"> 
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
                <h3>Exploit Data</h3> 
                <ul> 
                    {#each $exploits as exploit} 
                        <li>{exploit.name} - {exploit.viable_exploit}</li> 
                    {/each} 
                </ul> 
                <h3>Ranked Entries</h3> 
                <ul> 
                    {#each $rankedEntries as entry} 
                        <li>{entry.ip}:{entry.port} - Score: {entry.combined_score}</li> 
                    {/each} 
                </ul> 
            </div> 
        </div> 
        {/if} 
        <div class="space-y-10 text-center flex flex-col items-center"> 
            
    <div class="spacer" style="height: 20px;"></div>
            <h2 class="text-3xl font-bold">Schedule Analysis & Quick Report Export</h2> 
            <figure> 
                <div class="container h-full mx-auto flex justify-center items-center"> 
                    <div class="container h-full mx-auto flex justify-center items-center"> 
                    <figure>
                    </figure> 
                </div> 
            </figure> 
        </div> 
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg"> 
            <style> 
                .breathing {
                    width: 250px;
                    height: 168px;
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    animation: breathe 5s ease-in-out infinite, move 10s linear infinite;
                }

                @keyframes breathe {
                    0%, 100% {
                        transform: scale(0.7);
                    }
                    50% {
                        transform: scale(0.95);
                    }
                }

                @keyframes move {
                    0% {
                        top: 8px;
                        right: 8px;
                    }
                    50% {
                        top: 9px;
                        right: 9px;
                    }
                    100% {
                        top: 8px;
                        right: 8px;
                    }
                }
            </style>

            <img src="src/Brain.png" alt="Wireframe Brain" class="w-80 h-80 absolute top-2 right-2 breathing"> 
            <div class="mt-4 flex items-center gap-4"> 
                <span class="text-gray-400">Select Analysis Type:</span> 
                <select id="fileType" class="bg-indigo-500 text-white px-4 py-2 roundedselect-dropdown" bind:value={selectedFileType}> 
                    <option value="" disabled>Attack Type</option> 
                    {#each attackTypes as attackType} 
                        <option value={attackType}>{attackType}</option> 
                    {/each}
                </select> 
            </div> 
            <div class="mt-4 flex items-center gap-4"> 
                <span class="text-gray-400">Schedule A Analysis:</span> 
                <div class="time-dropdown">
                    <select id="time" class="bg-indigo-500 text-white px-4 py-2 rounded select-dropdown" bind:value={selectedTime}>
                        <option value="" disabled>Select Time</option>
                        {#each timeOptions as timeOption}
                            <option value={timeOption}>{timeOption}</option>
                        {/each}
                    </select>
                </div>
                
                <div class="ampm-dropdown">
                    <select id="ampm" class="bg-indigo-500 text-white px-4 py-2 rounded select-dropdown" bind:value={selectedAMPM}>
                        <option value="" disabled>AM/PM</option>
                        {#each ampmOptions as ampmOption}
                            <option value={ampmOption}>{ampmOption}</option>
                        {/each}
                    </select>
                </div>
            </div> 

            <div class="mt-4 flex items-center gap-4"> 
                <span class="text-gray-400">Confirm Analysis Appointment: </span> 
            <button class="bg-indigo-500 text-white px-4 py-2 rounded" on:click={confirmAnalysis}>Confirm Time</button> 
            </div> 

            <div class="mt-4 flex items-center gap-2 justify-center"> 
                <span class="mr-2 text-gray-400 underline">View/Export Analysis Report</span> 
            </div> 

            <div class="action-container"> 
                <div class="file-type-selection"> 
                    <div class="mt-4 flex items-center gap-2 "> 
                        <span class="mr-2 text-gray-400">Select File Type:</span> 
                        <select id="fileType" class="select-dropdown" bind:value={selectedFileType}> 
                            <option value="" disabled>Select File Type</option> 
                            {#each fileTypes as fileType} 
                                <option value={fileType}>{fileType}</option> 
                            {/each} 
                        </select> 
                    </div> 
                    <div class="flex justify-center mt-4"> 
                        <button class="bg-indigo-500 text-white px-4 py-2 rounded" on:click={exportData}>Export</button> 
                    </div> 
                </div> 
            </div> 
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

    .progress-bar-container {
        background-color: #3f344770;
        border-radius: 5px;
        overflow: hidden;
    }
    .progress-bar {
        background-color: #4caf50;
        height: 24px;
        transition: width 0.3s;
    }
    .progress-details {
        color: black; 
        margin-top: 10px; 
    }
    .scrollable-column {
        background-color: white;
        height: 300px;
        overflow-y: scroll;
        padding: 10px;
        border-radius: 5px;
    }
    
    .scrollable-column h2, .scrollable-column h3, .scrollable-column span, .scrollable-column li, .scrollable-column ul {
        color: purple;
    }

</style>