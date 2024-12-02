<!-- The frontend report page provides users with a dynamic and interactive interface to view, manage, and export project reports. 
It allows users to select specific projects, fetch data from the backend, and display ranked entries and exploit data in a tabular format. 
The page supports exporting reports in multiple formats, including PDF, while dynamically adjusting based on the selected project. 
Leveraging tools like PapaParse for CSV parsing and jsPDF for PDF generation, it ensures seamless data handling and 
customized report generation. Additionally, the integration of user logs tracks export actions and enhances accountability 
through real-time notifications. This streamlined interface supports intuitive navigation and robust data visualization. -->

<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
    import { onMount } from 'svelte';
    // Use papaparse for writing the pdf file
    import Papa from 'papaparse';
    // Datatable will be used to display the contents of the report before the export
    import Datatable from '$lib/components/datatable/Datatable.svelte';
    //Import a fetch data function from $lib/api library.
    import { fetchData } from '$lib/api';
    //Import createLogEntry from logservice function from our custom log service. 
    import { createLogEntry } from '../../routes/Logs/logservice';
    //Import jsPDF so we can make pdf of the report.
    import jsPDF from 'jspdf';

    //Interface for the ExploitData as obtained from our CSV files.
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
    //Interface for the RankedEntry to structure ranked information based off of the CSV file.
    interface RankedEntry {
        ip: string;
        port: number;
        severity_score: number;
        exploit_score: number;
        distinct_vulnerabilities: number;
        combined_score: number;
    }

    //Various datatypes we will need to store exploit and project information. 
    //Create Writable Stores for the various Data Types.
    let exploits: Writable<ExploitData[]> = writable([]);
    let projectFolders: Writable<string[]> = writable([]);
    let selectedProject: Writable<string> = writable('');
    let rankedEntries: Writable<RankedEntry[]> = writable([]);
    let entriesForReport: Writable<RankedEntry[]> = writable([]);
    let loading = writable(false);
    let error = writable<string | null>(null);

    // Make sure we are mounting all of the available project folders
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

    const rankedEntryColumns = [
        { key: 'ip', label: 'IP Address' },
        { key: 'port', label: 'Port' },
        { key: 'combined_score', label: 'Combined Score' }
    ];

    const rankedEntryForReport = [
        { key: 'ip', label: 'IP Address' },
        { key: 'port', label: 'Port' },
        { key: 'severity_score', label: 'Severity Score' },
        { key: 'exploit_score', label: 'Exploit Score' },
        { key: 'distinct_vulnerabilities', label: 'Distinct Vulnerabilities' },
        { key: 'combined_score', label: 'Combined Score' }
    ]

    //Fetches and parses various CSV files related to a specific project
    async function fetchProjectData(project: string) {
        loading.set(true);
        error.set(null);
        const basePath = `/server/data/${project}`;

        try {
            await Promise.all([
                fetchAndParse<ExploitData>(`${basePath}/data_with_exploits.csv`, exploits),
                fetchAndParse<RankedEntry>(`${basePath}/ranked_entry_points.csv`, rankedEntries),
                fetchAndParse<RankedEntry>(`${basePath}/ranked_entry_points.csv`, entriesForReport)
            ]);
        } catch (err) {
            error.set(`Failed to load data for project: ${project}`);
            console.error(err);
        } finally {
            loading.set(false);
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
                skipEmptyLines: true, //ignores empty rows
                complete: (results) => store.set(results.data as T[])
            });
        } catch (err) {
            console.error(`Error fetching or parsing ${url}:`, err);
        }
    }
    // Whatever project is selected from the options, will be the
    // one for which data is returned from
    $: {
      if ($selectedProject) {
          fetchProjectData($selectedProject);
      }
    }

    // Initialized the user selected values
    let selectedFileType = ''; 
    let selectedProjectName = '';

    // Begins the exporting process, prepares the data needed and logs
    function exportData() {
            selectedFileType = 'pdf'
            //Export the data as a list that has selected Project, exploits, entryPoiints, and rankedEntries.
            console.log(`Exporting as ${selectedFileType}`);
            const data = {
                selectedProject,
                rankedEntries: $rankedEntries,
                entriesForReport: $entriesForReport
            };
    
            exportToPDF(data);
    }

    //Function to export to pdf.
    function exportToPDF(data: any) {
            //Log if exporting project to PDF.
            console.log('Exporting Project Folder to PDF:', selectedProject);
            selectedProjectName = $selectedProject
            //If no project selected while export, print warning log.
            if (selectedProjectName === "") {
                //Give popup alert if no project was selected for exporting.
                alert(`No project was selected for exporting!`);
                //Make Failed Project PDF log.
                createLogEntry({
                    type: 'Warning',
                    message: `No project was selected for exporting!`
                });
                //Exit since we failed export.
                return;
            //Else print log for successful PDF export.
            } else {
                //Make successful Project PDF log.
                createLogEntry({
                    type: 'Information',
                    message: `Project ${selectedProjectName} was exported as a PDF!`
                });
            }
    
            //Make a new jsPDF document. (doc).
            const doc = new jsPDF();
            //Add title to top of PDF with name.
            doc.text(`INFILTR8 REPORT`, 10, 10);
            //Get the current date and time for the document title.
            const now = new Date();
            const month = now.getMonth();
            const date = now.getDate();
            const year = now.getFullYear();
            const formattedDateTime = now.toLocaleString();
    
            //Add generated time for title on report.
            doc.text(`GENERATED: ${formattedDateTime}`, 10, 20);
            //Add team number and name for report. 
            doc.text(`Team: TEAM #6 - The Nine Bytes`, 10, 30);
            //if the selectedProject is null (Shouldnt happen but here as error handler).
            if(selectedProject == null){
                doc.text(`Project: null`, 10, 10);
                doc.text(`Entry Points: null`, 10, 10);
                return;
            }
            //Put Project title on document. 
            doc.text(`Project: ${selectedProjectName}`, 10, 40);
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
                    const lines = entry.split('\n'); // Split to account for the new description of score calculation
                    lines.forEach(line => {
                    if (yOffset > 280) { 
                        doc.addPage();
                        pageCount++;
                        yOffset = 20;
                        doc.text(`${title} (Continued): Page ${pageCount}`, 10, yOffset);
                        yOffset += 10;
                    }
                
                    // Add the line to the PDF
                    doc.text(line, 10, yOffset);
                    yOffset += 10; // Move the Y offset down for the next line
                    entryCount++;
                    });
                });
            };
    
            //Write rankedEntries to pdf.
            //Report entries are based off research from the python model developed by DEVCOM
            //Informs the analyst of how the score is broken down
            const rankedEntries = data.entriesForReport.map((entry: RankedEntry, index: number) => `${index + 1}. ${entry.ip}:${entry.port} - Score: ${entry.combined_score}\n` +
            `Breakdown of Combined Score:\n` +
            `50% from Severity Score of ${entry.severity_score}\n` +
            `30% from Exploit Score of ${entry.exploit_score}\n` +
            `20% from Distinct Vulnerabilities count of ${entry.distinct_vulnerabilities}\n\n`);
            addEntriesToPage("Ranked Entries", rankedEntries);
            const fileName = `${selectedProjectName} (${month}-${date}-${year}).pdf`;
            doc.save(fileName);
        }

</script>

<main class="p-8 overflow-y-auto">
    <h1 class="text-center text-3xl font-semibold mb-4">Reports</h1>
  
    <section>
        <h3>Projects</h3>
        <div class="flex gap-4 overflow-x-auto px-4 py-2">
            <select id="project" class="bg-gray-700 text-white border border-gray-600 p-2 rounded focus:ring-2 focus:ring-gray-500 ml-[-14px]" bind:value={$selectedProject}>
                <option value="" disabled>Select Project</option>
                {#each $projectFolders as folder}
                  <option value={folder}>{folder}</option>
                {/each}
              </select>
        </div>
    </section>
  
    <h2 class="text-xl font-semibold mb-4 text-blue-800">Report</h2>

    <section>
        <Datatable data={$rankedEntries} columns={rankedEntryColumns} />
    </section>

    <div class="flex items-center justify-between mt-6">
        <button on:click="{exportData}" class="bg-gray-900 text-white px-6 py-2 rounded-md border border-gray-600 hover:bg-gray-700">
            Export
        </button>
    </div>

  </main>