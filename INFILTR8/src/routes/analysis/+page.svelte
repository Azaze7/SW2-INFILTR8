<!--Analysis Frontend Layout Page Code -- Gilbert Guzman & Christian Garcia -->
<script lang="ts"> 
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        //Imports List. 
        //[Order is svelte, svelte/store, $lib Components, logservice, papaparse, jsdpf.]
        //Import onMount so we have ability to use code when we click buttons.
        import { onMount } from 'svelte'; 
        //Import writable from svelte/store so we can write its store.
        import { writable, type Writable } from 'svelte/store';
        //Import a fetchdata function from $lib/api library.
        import { fetchData } from '$lib/api';
        //Import createLogEntry from logservice function from our custom log service. 
        import { createLogEntry } from '../../routes/Logs/logservice';
        //Import Papaparse library so we can CSV/PDF files.
        import Papa from 'papaparse'; 
        //Import jsPDF so we can make pdf of the report.
        import jsPDF from 'jspdf'; 
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        //Interface for the ExploitData in the CSV files.
        interface ExploitData {
            //Filename.
            file: string;
            //Name of exploit.
            name: string;
            //IP address.
            ip: string;
            //Port Number.
            port: number;
            //If exploit can currently be used.
            viable_exploit: string;
            //Type of Exploit.
            archetype: string;
            //Service name related to the exploit.
            svc_name: string;
            //Protocol used by exploit.
            protocol: string;
            //How severe exploit is.
            severity: number;
            //Unique Id for plugin.
            pluginID: number;
            //Name of plugin.
            pluginName: string;
            //Category of plugin.
            pluginFamily: string;
        }
    
        //Interface for the EntryPoint to structure entry point information.
        interface EntryPoint {
            //IP address of entrypoint.
            ip: string;
            //Port Number of entrypoint.
            port: number;
            //The count of vulnerablities associated.
            vulnerability_count: number;
        }
    
        //Interface for the RankedEntry to structure ranked information.
        interface RankedEntry {
            //IP address of ranked entry.
            ip: string;
            //Port Number of ranked entry.
            port: number;
            //Severity score of ranked entry.
            severity_score: number;
            //Exploit score of ranked entry.
            exploit_score: number;
            //Number of distinct vulnerabilties for ranked entry.
            distinct_vulnerabilities: number;
            //Combined score for ranked entry. (Severity & Exploitability)
            combined_score: number;
        }
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        //Create Writable Stores for the various Data Types.
        //Store Exploit Data.
        let exploits: Writable<ExploitData[]> = writable([]);
        //Store entryPoint Data.
        let entryPoints: Writable<EntryPoint[]> = writable([]);
        //Store rankedEntry Data.
        let rankedEntries: Writable<RankedEntry[]> = writable([]);
        //Store projectFolder Data.
        let projectFolders: Writable<string[]> = writable([]);
        //Store scopeIP Data.
        let scopeIPs: Writable<string[]> = writable([]);
        //Store availableAnalyses type Data.
        let availableAnalyses: Writable<string[]> = writable([]);
        //Store to track the progress of an operation. 
        let progress: Writable<number> = writable(0);
        //Variable to hold the selected project name.
        let selectedProject: string = '';
        //Variable to hold the selected file type.
        let selectedFileType = '';
        //Variable to hold the selected attack type.
        let selectedAttackType = ''
        //Variable to hold the selected time.
        let selectedTime = '';
        //Variable to hold whether the time is AM/PM.
        let selectedAMPM = '';
        //Variable to hold the time and AM/PM.
        let fullTime = '';
        //Variable to hold the selected attack type.
        let attackType = '';
    
        //Array to hold the 2 file types of the report.
        const fileTypes = ['PDF', 'XML'];
        //Array to hold the types of attacks from the SRS. 
        const attackTypes = ['*All','Unauthenticated Port Bypass', 'Default Credentials', 'Unpatched Software Exploits', 'Missing Encryption Protocols', 'Weak Passwords (Brute Force)']
        //Array to hold the time options for the dropdown menu.
        const timeOptions: string[] = [];
        //Array to hold the AM/PM options for the dropdown menu.
        const ampmOptions: string[] = ['AM', 'PM'];
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        //Functions for code. 
        //Make Dropdown for time.
        //for-loop from 1 to 12 hours, have 00-15-30-45 minutes.
        for (let hour = 1; hour <= 12; hour++) {
            ['00', '15', '30', '45'].forEach((minute) => {
                //Push the formatted time to timeOptions.
                timeOptions.push(`${hour}:${minute}`);
            });
        }
        
        //Function to get CSV for a specific project. (Shows if it is 100% Processed)
        async function fetchCsvData(project: string) {
            //Try to get file based on the name and path.
            try {
                const basePath = `/server/data/${project}`;
                //Set Progress to 10 if project is present but no CSVs present.
                progress.set(10);
                await Promise.all([
                    fetchAndParse<ExploitData>(`${basePath}/data_with_exploits.csv`, exploits),
                    fetchAndParse<EntryPoint>(`${basePath}/entrypoint_most_info.csv`, entryPoints),
                    fetchAndParse<RankedEntry>(`${basePath}/ranked_entry_points.csv`, rankedEntries)
                ]);
                //Set scopIPs based on the entrypoints.
                scopeIPs.set($entryPoints.map((entry) => entry.ip));
                //Set availableAnalyses based on ranked entries by port and score.
                availableAnalyses.set($rankedEntries.map((entry) => `Port ${entry.port} - Score ${entry.combined_score}`));
                //Set to 40 and t0 100 if all files are present.
                progress.set(40);
                progress.set(100);
            //Else it fails, print error while fetching or parsing CSV.
            } catch (error) {
                console.error('Error fetching or parsing CSV:', error);
            }
        }
    
        //Function to fetch and parse file. (use url for file and store here.)
        async function fetchAndParse<T>(url: string, store: Writable<T[]>) {
            //response is based on fetching url.
            const response = await fetch(url);
            //If unable to get url, throw error.
            if (!response.ok) throw new Error(`Failed to fetch ${url}`);
            const text = await response.text();
            //Parse the text line by line, then store the text in store.
            Papa.parse(text, {
                header: true,
                complete: (results) => store.set(results.data as T[])
            });
        }
    
        //Function to fetch project folder.
        async function fetchProjectFolders() {
            //Try to get folders by loading the project link.
            try {
                const folders = await fetchData<string[]>('http://localhost:3000/projects');
                //set project based on the present folders.
                projectFolders.set(folders);
            //Catch error, if cannot get project folder.
            } catch (error) {
                console.error('Error fetching project folders:', error);
            }
        }
    
        //Function to General export data as a PDF or a CSV. 
            //Use this as base for more streamlined exports.
        function exportData() {
            //if no selected file type (CSV or PDF), print error message.
            if (!selectedFileType) {
                console.log('No file type selected');
                //Create log entry if no file type selected for export. 
                createLogEntry({
                    type: 'Warning',
                    message: `No file type selected for export of project: ${selectedProject}`
                });
                //return since no expor.t 
                return;
            }
            //Export the data as a list that has selected Project, exploits, entryPoiints, and rankedEntries.
            console.log(`Exporting as ${selectedFileType}`);
            const data = {
                selectedProject,
                exploits: $exploits,
                entryPoints: $entryPoints,
                rankedEntries: $rankedEntries
            };
    
            //If selectedFileType is pdf, use pdf function.
            if (selectedFileType === 'PDF') {
                exportToPDF(data);
            //If slectedFileType is xml, use xml function.
            } else if (selectedFileType === 'XML') {
                exportToXML(data);
            }
        }
    
        //TO DO. (ADD THIS! UNFINISHED).
        //Once analysis is confimed, we want to make sure that we make a log for it. 
        function confirmAnalysis(){
            fullTime = selectedTime + selectedAMPM;
            console.log('Analysis Appointment Confirmed:', fullTime);
            if (fullTime === '' || selectedProject === '') {
                createLogEntry({
                    type: 'Warning',
                    message: `No project or time was selected when confirming the analysis time`
                });
            } else {
                createLogEntry({
                    type: 'Information',
                    message: `${fullTime} is confirmed as Appointment Time for Project ${selectedProject}`
                });
            }
        }
    
        //Function to export to pdf.
        function exportToPDF(data: any) {
            //Log if exporting project to PDF.
            console.log('Exporting Project Folder to PDF:', selectedProject);
            //If no project selected while export, print warning log.
            if (selectedProject === "") {
                //Give popup alert if no project was selected for exporting.
                alert(`No project was selected for exporting! [(As PDF)]`);
                //Make Failed Project PDF log.
                createLogEntry({
                    type: 'Warning',
                    message: `No project was selected for exporting! [(As PDF)]`
                });
                //Exit since we failed export.
                return;
            //Else print log for successful PDF export.
            } else {
                //Make successful Project PDF log.
                createLogEntry({
                    type: 'Information',
                    message: `Project ${selectedProject} was exported as a PDF!`
                });
            }
    
            //Make a new jsPDF document. (doc).
            const doc = new jsPDF();
            //Add title to top of PDF with name.
            doc.text(`INFILTR8 REPORT`, 10, 10);
            //Get the current date and time for the document title.
            const now = new Date();
            const formattedDateTime = now.toLocaleString();
    
            //Add generated time for title on report.
            doc.text(`GENERATED: ${formattedDateTime}`, 10, 20);
            //Add team number and name for report. 
            doc.text(`Team: TEAM #6 - The Nine Bytes`, 10, 30);
            //if the selectedProject is null (Shouldnt happen but here as error handler).
            if(selectedProject == null){
                doc.text(`Project: null`, 10, 10);
                doc.text(`Exoloits: null`, 10, 10);
                doc.text(`Entry Points: null`, 10, 10);
                doc.text(`Ranked Entries: null`, 10, 10);
                return;
            }
            //Put Project title on document. 
            doc.text(`Project: ${data.selectedProject}`, 10, 40);
            //Set vertical offset for entries.
            let yOffset = 20;
            //Set maxiumum number of entries per page.
            const maxEntriesPerPage = 40;
            //Ensure font size for pdf is small to not cut off anything.
            doc.setFontSize(10);
    
            //Function to add entries to page. (Title, entries)
            const addEntriesToPage = (title: string, entries: string[]) => {
                let pageCount = 1;
                let entryCount = 0;
                //Add a new page.
                doc.addPage();
                yOffset = 20;
                //Add title for the page.
                doc.text(`${title}:`, 10, yOffset);
                yOffset += 10;
                //Loop through the entries and add them to the pdf one by one.
                entries.forEach((entry, index) => {
                    //If the page has max entries:
                    if (index % maxEntriesPerPage === 0 && index !== 0) {
                        //Add another page, then pagecount++.
                        doc.addPage();
                        pageCount++;
                        yOffset = 20;
                        //Then add title (Continued) to the new page.
                        doc.text(`${title} (Continued): Page ${pageCount}`, 10, yOffset);
                        yOffset += 10;
                    }
                    //Now the entry text to the PDF.
                    doc.text(entry, 10, yOffset);
                    yOffset += 10;
                    entryCount++;
                });
            };
    
            //Write exploits to pdf.
            const exploitEntries = data.exploits.map((exploit: ExploitData, index: number) => `${index + 1}. ${exploit.name} - ${exploit.viable_exploit}`);
            addEntriesToPage("Exploits", exploitEntries);
    
            //Write entrypoints to pdf.
            const entryPointEntries = data.entryPoints.map((entry: EntryPoint, index: number) => `${index + 1}. ${entry.ip}:${entry.port} - Vulnerabilities: ${entry.vulnerability_count}`);
            addEntriesToPage("Entry Points", entryPointEntries);
    
            //Write rankedEntries to pdf.
            const rankedEntries = data.rankedEntries.map((entry: RankedEntry, index: number) => `${index + 1}. ${entry.ip}:${entry.port} - Score: ${entry.combined_score}`);
            addEntriesToPage("Ranked Entries", rankedEntries);
    
            //Get the filename based on the selectedProject to add to .pdf
            const fileName = `${data.selectedProject}.pdf`;
            //Save the document with the filename.
            doc.save(fileName);
        }
    
    
        function exportToXML(data: any) {
            //Log if exporting project to XML.
            console.log('Exporting Project Folder to XML:', selectedProject);
            //If no project selected while export, print warning log.
            if (selectedProject === "") {
                //Give popup alert if no project was selected for exporting.
                alert(`No project was selected for exporting! [(As XML)]`);
                //Make Failed Project XML log.
                createLogEntry({
                    type: 'Warning',
                    message: `No project was selected for exporting! [(As XML)]`
                });
                return;
            //Else print log for successful PDF export.
            } else {
                //Make successful Project XML log.
                createLogEntry({
                    type: 'Information',
                    message: `Project ${selectedProject} was exported as a XML!`
                });
            }
    
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
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    </script>
    <!-- Closing the TypeScript portion of the .svelte file. -->
    
    <!-- Page Header for this site. -->
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
                    <select id="attackTypeSelect" class="bg-indigo-500 text-white px-4 py-2 rounded select-dropdown" bind:value={selectedAttackType}> 
                        <option value="" disabled>Select Attack Type</option> 
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
                            <select id="fileTypeSelect" class="select-dropdown" bind:value={selectedFileType}> 
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
    <!-- Closing the TypeScript portion of the .svelte file. -->
    
    <!-- Style Guide Code for Analysis Page. -->
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
    
        .select-dropdown,
        #fileType {
            background-color: #6466f1; 
            transition: background-color 0.3s ease;
            color: white;
            padding: 10px 40px 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
    
        .select-dropdown:hover,
        #fileType:hover {
            background-color: #4a4bc1; /*Slightly darker purple on hover */
        }
    
        .non-dropdown-button {
            padding: 8px 16px; /*padding for non-dropdown buttons */
        }
    
        button:hover {
            background-color: #4a4bc1; /*Slightly darker purple on hover */
        }
    </style>
    <!-- End of Styleguide code. -->
    <!-- END OF ANALYSIS FRONTEND CODE. -->