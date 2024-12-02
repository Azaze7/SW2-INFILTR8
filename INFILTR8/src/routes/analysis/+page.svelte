<!--Analysis Frontend Layout Page Code -- Gilbert Guzman & Christian Garcia -->
<!-- The Analysis Frontend Layout Page provides a user interface for managing and 
 analyzing project data within the application. It displays available project 
 folders, allows users to select and load specific projects, and dynamically 
 updates progress bars and reports as data is processed. This layout includes 
 interactive features such as dropdown menus for scheduling analyses, selecting 
 attack types, and exporting reports in PDF or XML formats. Users can view, 
 filter, and prioritize exploit data, entry points, and ranked vulnerabilities 
 through scrollable lists. It integrates logging for user actions and uses animations,
  custom styles, and responsive design for an enhanced user experience. -->
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
        //Various Stores, Variables, & Arrays we need. 
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
        //Variable to hold the selected time.
        let selectedTime = '';
        //Variable to hold whether the time is AM/PM.
        let selectedAMPM = '';
        //Variable to hold the time and AM/PM.
        let fullTime = '';
        //Variable to hold the selected attack type.
        let attackType = '';

        let startingIP = '';  
        let endingIP = '';  
    
        //Array to hold the 2 file types of the report.
        const fileTypes = ['PDF', 'XML'];
        //Array to hold the types of attacks from the SRS. 
        const attackTypes = ['*All','Unauthenticated Port Bypass', 'Default Credentials', 'Unpatched Software Exploits', 'Missing Encryption Protocols', 'Weak Passwords (Brute Force)']
        //Array to hold the time options for the dropdown menu.
        const timeOptions: string[] = [];
        //Array to hold the AM/PM options for the dropdown menu.
        const ampmOptions: string[] = ['AM', 'PM'];
        //Writable store to hold ExploitData for what has been Analyzed.
        const filteredExploits = writable<ExploitData[]>([]);

        //Have first selectedAttackType set to All to start.
        let selectedAttackType: AttackType = '*All';

        //Have all AttackTypes from the SRS.
        type AttackType =
            | '*All'
            | 'Unauthenticated Port Bypass'
            | 'Default Credentials'
            | 'Unpatched Software Exploits'
            | 'Missing Encryption Protocols'
            | 'Weak Passwords (Brute Force)';

        //Make a map since the AttackType string in the .csvs is not exactly the same.
        const attackTypeMapping: { [key in AttackType]: string } = {
        '*All': '*All',
        'Unauthenticated Port Bypass': 'Unauthenticated port bypass',
        'Default Credentials': 'default credentials',
        'Unpatched Software Exploits': 'unpatched software exploits',
        'Missing Encryption Protocols': 'missing encryption protocols',
        'Weak Passwords (Brute Force)': 'weak passwords (brute force)'
        };
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
        
        //Get CSV for a specific project. (Shows if it is 100% Processed)
        async function fetchCsvData(project: string) {
            //Try to get file based on the name and path.
            try {
                const basePath = `/server/data/${project}`;
                //Set Progress to 10 if project is present but no CSVs are found.
                progress.set(10);

                //File paths for the .csv files.
                const files = [
                    `${basePath}/data_with_exploits.csv`,
                    `${basePath}/entrypoint_most_info.csv`,
                    `${basePath}/ranked_entry_points.csv`
                ];

                //Check to see if all csv files were generated and update progress if they are.
                const progressValues = [40, 70, 100];
                let foundAnyFile = false;

                //For all files. (Check for each one).
                for (let i = 0; i < files.length; i++) {
                    const response = await fetch(files[i]);
                    if (response.ok) {
                        foundAnyFile = true;
                        switch (i) {
                            case 0:
                                await fetchAndParse<ExploitData>(files[i], exploits);
                                break;
                            case 1:
                                await fetchAndParse<EntryPoint>(files[i], entryPoints);
                                break;
                            case 2:
                                await fetchAndParse<RankedEntry>(files[i], rankedEntries);
                                break;
                        }
                        
                        //Short pause while we are updating the progress.
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        progress.set(progressValues[i]);
                    } else {
                        //error since one of the files not found, lets you know via terminal.
                        console.log(`File not found: ${files[i]}`);
                    }
                }

                //If no files were found, keep the progress at 10. (10 since we have the project, but no csv's were made.)
                if (!foundAnyFile) {
                    progress.set(10);
                }

                //Set scopeIPs based on the entryPoints.
                scopeIPs.set($entryPoints.map((entry) => entry.ip));
                //Set availableAnalyses based on ranked entries by port and score.
                availableAnalyses.set($rankedEntries.map((entry) => `Port ${entry.port} - Score ${entry.combined_score}`));
            } catch (error) {
                //Else it fails, print error while fetching or parsing CSV.
                console.error('Error fetching or parsing CSV:', error);
            }
        }

        //Function to fetch and parse file. (use url for file and store here.)
        async function fetchAndParse<T>(url: string, store: Writable<T[]>) {
            //Response is based on fetching url.
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
    
        //Function to export analyzed data as a PDF or a CSV. 
        function exportDataAnalyzed() 
        {
            //if no selected file type (CSV or PDF), print error message.
            if (!selectedFileType) {
                console.log('No file type selected');
                //Create log entry if no file type selected for export. 
                createLogEntry({
                    type: 'Warning',
                    message: `No file type selected for export of project: ${selectedProject}`
                });
                //return since no export.
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
    
            //If selectedFileType is pdf, use analyzed pdf function.
            if (selectedFileType === 'PDF') {
                exportAnalyzedExploitsToPDF();
            //If slectedFileType is xml, use analyzed xml function.
            } else if (selectedFileType === 'XML') {
                exportAnalyzedExploitsToXML();
            }
        }

        //Function to general export data as a PDF or a CSV. 
        //Use this for quick export functionality.
        function exportData() 
        {
            //if no selected file type (CSV or PDF), print error message.
            if (!selectedFileType) {
                console.log('No file type selected');
                //Create log entry if no file type selected for export. 
                createLogEntry({
                    type: 'Warning',
                    message: `No file type selected for export of project: ${selectedProject}`
                });
                //return since no export. 
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

    //Function to run analysis.
    //Use this for logging and to filter which exploit we're analyzing.
    function runAnalysis(attackType: AttackType): string {
        console.log(`Running analysis for: ${attackType}`);
        //Switch for all attackTypes.
        switch (attackType) {
            //Case for all.
            case '*All':
                console.log(`Analyzing (*All) Attacks for Project: ${selectedProject}`);
                createLogEntry({
                    type: 'Information',
                    message: `Analyzing (*All) Attacks for Project: ${selectedProject}`
                });
                filterExploits('*All');
                return 'Executing all attacks!';

            //Case for Unauthenticated Port Bypass.
            case 'Unauthenticated Port Bypass':
                console.log(`Analyzing (Unauthenticated Port Bypass) for Project: ${selectedProject}`);
                createLogEntry({
                    type: 'Information',
                    message: `Analyzing (Unauthenticated Port Bypass) for Project: ${selectedProject}`
                });
                filterExploits('Unauthenticated Port Bypass');
                return 'Executing Unauthenticated Port Bypass attack!';

            //Case for Default Credentials.
            case 'Default Credentials':
                console.log(`Analyzing (Default Credentials) for Project: ${selectedProject}`);
                createLogEntry({
                    type: 'Information',
                    message: `Analyzing (Default Credentials) for Project: ${selectedProject}`
                });
                filterExploits('Default Credentials');
                return 'Executing Default Credentials attack!';

            //Case for Unpatched Software Exploits.
            case 'Unpatched Software Exploits':
                console.log(`Analyzing (Unpatched Software Exploits) for Project: ${selectedProject}`);
                createLogEntry({
                    type: 'Information',
                    message: `Analyzing (Unpatched Software Exploits) for Project: ${selectedProject}`
                });
                filterExploits('Unpatched Software Exploits');
                return 'Executing Unpatched Software Exploits attack!';

            //Case for Missing Encryption Protocols.
            case 'Missing Encryption Protocols':
                console.log(`Analyzing (Missing Encryption Protocols) for Project: ${selectedProject}`);
                createLogEntry({
                    type: 'Information',
                    message: `Analyzing (Missing Encryption Protocols) for Project: ${selectedProject}`
                });
                filterExploits('Missing Encryption Protocols');
                return 'Executing Missing Encryption Protocols attack!';

            //Case for Weak Passwords.
            case 'Weak Passwords (Brute Force)':
                console.log(`Analyzing (Weak Passwords (Brute Force)) for Project: ${selectedProject}`);
                createLogEntry({
                    type: 'Information',
                    message: `Analyzing (Weak Passwords (Brute Force)) for Project: ${selectedProject}`
                });
                filterExploits('Weak Passwords (Brute Force)');
                return 'Executing Weak Passwords (Brute Force) attack!';

            //Default just in case but this shouldnt happen. (*All is default.)
            default:
                return 'Unknown attack type! We have no idea how.';
        }
    }

    //Define a writable store for progressAnalysis bar, set to 0. 
    const progressAnalysis = writable(0);

    //Handles when we click the button to run an Analysis with the selected attack type.
    function handleRunAnalysis() {
        //DONT DELETE THIS LINE NEED IT TO RUN ANALYSIS.
        runAnalysis(selectedAttackType);

        progressAnalysis.set(0); 
        let value = 0; 
        const interval = setInterval(() => { 
            value += 1; 
            if (value <= 100) { 
                progressAnalysis.set(value); 
            } else { 
                clearInterval(interval); 
            } 
        }, 20); // Adjust the speed as necessary
    }
    
    //Function to quick export to pdf.
        //Just gives all the data we have.
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
                message: `Project ${selectedProject} was quick exported as a PDF!`
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
        //Say its a quick export.
        doc.text(`*Quick Export of All Data*`, 10, 50);
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
        const fileName = `${data.selectedProject}_QuickExport.pdf`;
        //Save the document with the filename.
        doc.save(fileName);
    }

    //Function to export analyzed project to pdf.
        //Just gives only the specific data we asked for.
    function exportAnalyzedExploitsToPDF() {
        //Log if exporting filtered exploits to PDF.
        console.log('Analyzed Report PDF being generated for project:', selectedProject);
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
        } else {
            //Make successful Analyzed Project PDF log.
            createLogEntry({
                type: 'Information',
                message: `Analyzed Report for project ${selectedProject} was exported as a PDF!`
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
        //if the selectedProject is null (Shouldn't happen but here as error handler).
        if (selectedProject == null) {
            doc.text(`Project: null`, 10, 40);
            doc.text(`Filtered Exploits: null`, 10, 50);
            return;
        }
        //Put Project title on document.
        doc.text(`Analyzed Project: ${selectedProject}`, 10, 40);
        doc.text(`Selected Analysis: ${selectedAttackType}`, 10, 50);
        //Set vertical offset for entries.
        let yOffset = 50;
        //Set maximum number of entries per page.
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

        //Write our filtered exploits to pdf.
        const filteredExploitEntries = $filteredExploits.map((exploit: ExploitData, index: number) => `${index + 1}. ${exploit.name} - ${exploit.viable_exploit}`);
        addEntriesToPage("Analyzed Exploits", filteredExploitEntries);

        //Get the filename based on the selectedProject and selectedattacktype to add to .pdf. (for naming)
        const fileName = `${selectedProject}_Analyzed_${selectedAttackType}.pdf`;
        //Save the document with the new filename.
        doc.save(fileName);
    }

    //Function to quick export to xml.
        //Just gives all the data we have.
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
        } else {
            //Make successful Project XML log.
            createLogEntry({
                type: 'Information',
                message: `Project ${selectedProject} was quick exported as a XML!`
            });
        }

        //Get current date for timestamp.
        const now = new Date();
        //get current time in correct format.
        const formattedDateTime = now.toLocaleString();
        //Add custom team header information as XML comment at the top.
        let xmlHeader = `<!-- INFILTR8 REPORT
        GENERATED: ${formattedDateTime}
        Team: TEAM #6 - The Nine Bytes
        Project: ${selectedProject}
        *Quick Export of All Data* -->\n\n`;

        //Convert data to XML content
        const xmlContent = jsonToXML(data);

        //Combine header and XML content for the complete set so we can write it all at once.
        const completeXmlContent = `${xmlHeader}${xmlContent}`;

        //Create blob and initiate download of the xml.
        const blob = new Blob([completeXmlContent], { type: 'application/xml' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${data.selectedProject}_QuickExport.xml`;
        link.click();
    }

    //Function to export analyzed project to XML.
        //Just gives only the specific data we asked for.
    function exportAnalyzedExploitsToXML() {
        //Log if exporting project to XML.
        console.log('Exporting filtered exploits to XML:', selectedProject);

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
        } else {
            //Make successful Project XML log.
            createLogEntry({
                type: 'Information',
                message: `Project ${selectedProject} was quick exported as a XML!`
            });
        }

        //Add header information as XML comment at the top of the document.
        //Get current date.
        const now = new Date();
        //Get current date and time in correct format.
        const formattedDateTime = now.toLocaleString();
        //Make header comment.
        let xmlHeader = `<!-- INFILTR8 REPORT
        GENERATED: ${formattedDateTime}
        Team: TEAM #6 - The Nine Bytes
        Analyzed Project: ${selectedProject}
        Selected Analysis: ${selectedAttackType} -->\n\n`;

        //Get filtered exploits from the store
        let filteredExploitsData: ExploitData[] = [];
        filteredExploits.subscribe(data => {
            filteredExploitsData = data;
        })();

        //Only include filtered exploits in the XML content
        const filteredData = {
            selectedProject: selectedProject,
            exploits: filteredExploitsData
        };

        //Convert filtered data to XML content
        const xmlContent = jsonToXML(filteredData);

        //Combine header and XML content into one thing to write at the same time.
        const completeXmlContent = `${xmlHeader}${xmlContent}`;

        //Create blob and initiate download of the xml.
        const blob = new Blob([completeXmlContent], { type: 'application/xml' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${selectedProject}_Analyzed_${selectedAttackType}.xml`;
        link.click();
    }

    //Helper code for both XML file exports.
        //Allows us to convert the data we have to xml.
    function jsonToXML(json: any, root = true) {
        //make xml and keep it empty for now.
        let xml = '';
        //Iterate over each variable in the data.
        for (const key in json) {
            //ensure the key belongs to the object itself.
            if (json.hasOwnProperty(key)) {
                //if so, we keep the value.
                const value = json[key];
                //check that the array is an array
                if (Array.isArray(value)) {
                    //if so, get each value and add each item to the xml.
                    value.forEach((item) => {
                        xml += `<${key}>${jsonToXML(item, false)}</${key}>`;
                    });
                //else if its a non null object and has data, add that to the xml.
                } else if (typeof value === 'object' && value !== null) {
                    xml += `<${key}>${jsonToXML(value, false)}</${key}>`;
                //else, if the value is just a normal value (lol), wrap it in a key so it then can be added to the xml.
                } else {
                    xml += `<${key}>${value}</${key}>`;
                }
            }
        }
        //If its the root, then just put XML in the root.
        return root ? `<root>${xml}</root>` : xml;
    }

    //Once analysis is confimed, we want to make sure that we make a log for it. 
    function confirmAnalysis(){
        //Make full time based on the time itself and whether its in the morning or afternoon.
        fullTime = selectedTime + selectedAMPM;
        //make a log with the analysis appointment time.
        console.log('Analysis Appointment Confirmed:', fullTime);
        //If we messed up while making the appointment, make a log for it.
        if (fullTime === '' || selectedProject === '') {
            createLogEntry({
                type: 'Warning',
                message: `No project or time was selected when confirming the analysis time`
            });
        } else {
            //else successful, make a successful log entry.
            createLogEntry({
                type: 'Information',
                message: `${fullTime} is confirmed as Appointment Time for Project ${selectedProject}`
            });
        }
    }
    
    //Allows us to move an entry up in the list of priority.
    function moveUp<T>(list: Writable<T[]>, index: number) {
        //use update so the list changes.
        list.update(arr => {
            if (index > 0) [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
            //return the updated array.
            return arr;
        });
    }
    
    //Allows us to move an entry down in the list of priority.
    function moveDown<T>(list: Writable<T[]>, index: number) {
        //use update so the list changes.
        list.update(arr => {
            if (index < arr.length - 1) [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
            //return the updated array.
            return arr;
        });
    }
    
    //React when we slect a project, so we can fetch all its csv data to populate the first scrolling list.
    $: if (selectedProject) fetchCsvData(selectedProject);
    //When we first start the analysis portion of the site, fetch all the project folders.
    onMount(fetchProjectFolders);
    //Hide the reports until a button of the file is pushed. (false default)
    let showReport = false;
    
    //Shows the reports if we click a folder that is a project.
    function toggleReport(folder: string) {
        //Set progress to 0 when first opening, then update as load it up.
        if (selectedProject === folder && showReport) {
            showReport = false;
            selectedProject = null as unknown as string;
            progress.set(0);
        //else if showing report but files are mssing, keep it at 10%
        } else {
            selectedProject = folder;
            showReport = true;
            progress.set(10);
        }
    }

    //Filter/Analyze exploits based on attack type 
    function filterExploits(attackType: AttackType) { 
        //Use the mapped attacktype list since the .csv use different strings than the ones that are official in its data.
        const mappedType = attackTypeMapping[attackType];
        //Subscribe to the exploit store so we get the current exploits. (SRS).
        exploits.subscribe(currentExploits => { 
            //Either show all or the current selected mappedType.
            const filtered = currentExploits.filter(exploit => mappedType === '*All' || exploit.archetype === mappedType); 
            //Log that we have filtered exploits for the selected attack type.
            console.log(`Filtered exploits for ${attackType}:`, filtered); 
            //Update the filteredupdatestore since we chose what we wanted.
            filteredExploits.set(filtered); 
        });
    }

    function confirmIPs(){

    }

    //On mount (starting analysis page), fetch the csvs for the selected project. 
    onMount(() => {
        fetchCsvData(selectedProject);
    });

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
                <h2>All Data Report for {selectedProject}</h2> 
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
                <div class="scrollable-column report-section"> 
                    <h2>Filtered Exploit Data for {selectedAttackType}</h2> 
                    <ul> 
                        {#each $filteredExploits as exploit} 
                            <li>{exploit.name} - {exploit.viable_exploit}</li> 
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

                    <div class="IP Range">
                        <span class="text-gray-400">Select Range of IPs:</span> 
                        <select id="startingIP" class="bg-indigo-500 text-white px-4 py-2 rounded select-dropdown ml-2" bind:value={startingIP}>
                            <option value="" disabled>From</option>
                            {#each $scopeIPs as ipOption}
                                <option value={ipOption}>{ipOption}</option>
                            {/each}
                        </select>

                        <select id="endingIP" class="bg-indigo-500 text-white px-4 py-2 rounded select-dropdown" bind:value={endingIP}>
                            <option value="" disabled>To</option>
                            {#each $scopeIPs as ipOption2}
                                <option value={ipOption2}>{ipOption2}</option>
                            {/each}
                        </select>

                        <div class="mt-4 flex items-center gap-4"> 
                            <span class="text-gray-400">Confirm IP Range: </span> 
                        <button class="bg-indigo-500 text-white px-4 py-2 rounded ml-3" on:click={confirmIPs}>Confirm IPs</button> 
                        </div> 

                    </div>

                </div> 
                <div class="mt-4 flex items-center gap-4"> 
                    <span class="text-gray-400">Schedule An Analysis:</span> 
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
                            <select id="fileType" class="select-dropdown text-gray-400" bind:value={selectedFileType}> 
                                <option value="" disabled>Select File Type</option> 
                                {#each fileTypes as fileType} 
                                    <option value={fileType}>{fileType}</option> 
                                {/each} 
                            </select> 
                        </div> 
                        <div class="flex justify-center mt-4 gap-2"> 
                            <button class="bg-indigo-500 text-white px-4 py-2 rounded" on:click={exportData}>Quick Export All Data</button> 
                            <button class="bg-green-500 text-white px-4 py-2 rounded" on:click={handleRunAnalysis}>Run Selected Analysis!</button> 
                            <button class="bg-blue-500 text-white px-4 py-2 rounded" on:click={exportDataAnalyzed}>Export Analyzed Report</button>
                        </div> 
                        <div class="progress-bar-container"> <div class="progress-bar" style="width: {$progressAnalysis}%"> </div>
                    </div> 
                </div>
            </div> 
        </main> 
    </div>
    <!-- Closing the TypeScript portion of the .svelte file. -->
    
    <!-- Style Guide Code for Analysis Page. -->
    <style>
        .report {
            display: flex;
            flex-direction: column;
        }

        .report-section {
            margin-top: 20px;
        }

        .progress-bar-container { 
            width: 100%; 
            background-color: #e0e0e0; 
            border-radius: 5px; 
            overflow: hidden; 
            margin: 20px 0; 
        }
        
        .progress-bar { 
            height: 30px; 
            background-color: #76c7c0; 
            text-align: center; 
            line-height: 30px; 
            color: white; 
            border-radius: 5px; 
        }

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
