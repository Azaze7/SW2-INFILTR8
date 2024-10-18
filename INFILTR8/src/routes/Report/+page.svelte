<h1 class="flex justify-center">Albert & Luis</h1>

<script>
    let folder = {
        name: "Current Folder",
        items: 63,
        size: "621 MB"
    };

    let ipList = [
        { ip: '192.168.1.1', device: 'Device A', vulnerability: 'CVE-2010-14800 {VPN TRAFFIC HIJACK}', status: 'Exploited' },
        { ip: '192.168.1.5', device: 'Device B', vulnerability: 'CVE-2022-21907 {HTTP PROTOCOL STACK}', status: 'Not Exploited' },
        { ip: '192.168.1.20', device: 'Device C', vulnerability: 'CVE-2024-122 {VPN TRAFFIC HIJACK}', status: 'Exploited' },
        { ip: '192.168.1.25', device: 'Device D', vulnerability: 'CVE-2016-14800 {VPN TRAFFIC HIJACK}', status: 'Not Exploited' },
    ];
    let selectedFileType = ''; 
    const fileTypes = ['PDF', 'XML']; 

    function exportData() {
    // Logic for export
    // To be implemented later
    }
</script>

<div class="grid-container">
    <main class="main-content">
        <!-- Your main content goes here -->
        <!-- svelte-ignore a11y-invalid-attribute -->
        <div class="logo"><a href="#"><span>Lo</span>gs</a></div>
        <p> </p>
        <h1>Reports</h1>
        
        <!-- This section displays the currently selected project. TODO: add functionality to ...
        ...the three dots when selected (Maybe, PENDING CUSTOMER RESPONSE) -->
        <div class="folder-card">
            <div class="folder-icon">
                <img src="https://img.icons8.com/ios-filled/50/000000/folder-invoices.png" alt="Folder Icon" />
            </div>
            <div class="folder-details">
                <h2>{folder.name}</h2>
                <p>{folder.items} items | {folder.size}</p>
            </div>
            <div class="folder-options">
                <span>⋮</span>
            </div>
        </div>

        <h2>IP List</h2>
        <!-- Render the IP list with checkboxes (UI only) -->
        <div class="ip-list-container">
            <!-- Header Row -->
            <div class="ip-header">
                <span class="ip-header-item"></span> <!-- Placeholder for checkbox column -->
                <span class="ip-header-item">IP Address</span>
                <span class="ip-header-item">Device</span>
                <span class="ip-header-item">Vulnerability</span>
                <span class="ip-header-item">Status</span>
            </div>
        
            <!-- List Items -->
            <ul class="ip-list">
                {#each ipList as item}
                    <li class="ip-item">
                        <span>
                            <input type="checkbox">
                        </span>
                        <span class="ip-text">{item.ip}</span>
                        <span class="ip-text">{item.device}</span>
                        <span class="ip-text">{item.vulnerability}</span>
                        <span class="ip-text">{item.status}</span>
                    </li>
                {/each}
            </ul>
        </div>

        <div class="file-type-selection">
            <label for="fileType">Select file type:</label>
            <select id="fileType" class="select-dropdown" bind:value={selectedFileType}>
                <option value="" disabled>Select File Type</option>
                {#each fileTypes as fileType}
                    <option value={fileType}>{fileType}</option> 
                {/each}
            </select>
        </div>
      
        <div class="button-container">
            <button on:click={exportData} class="export-button">Export</button>
        </div>
    </main>
</div>

<style>
    :root {
        --bg: #1d1b28;
        --color-main: #4628e9;
        --color-main-dark: #191528;
        --color-second: #aaa7b9;
        --transition: all .3s ease-out;
    }

    /* Reset some default styles for consistency */
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    /* Grid Container Setup */
    .grid-container {
        display: grid;
        grid-template-areas:
            "sidebar main right";
        grid-template-columns: 250px 1fr 350px; /* Sidebar, main content, right-side width */
        height: 100vh;
        font-family: Arial, sans-serif;
    }

    /* Sidebar Styling */
    .sidebar {
        grid-area: sidebar;
        background-color: #f1f1f1;
        color: white;
        padding: 20px;
        display: flex;
        flex-direction: column;
    }

    /* Main Content Styling */
    .main-content {
        grid-area: main;
        padding: 30px;
        overflow-y: auto;
        background-color: transparent; /* Or you can directly specify the blue color */
    }

    /* Right Side Section Styling */
    .right-side {
        grid-area: right;
        background-color: var(--bg);
        padding: 20px;
        box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
    }

    /* Responsive Adjustments */
    @media (max-width: 1024px) {
        .grid-container {
            grid-template-areas:
                "sidebar main";
            grid-template-columns: 250px 1fr;
        }

        .right-side {
            display: none; /* Hide right side on small screens */
        }
    }

    @media (max-width: 768px) {
        .grid-container {
            grid-template-areas:
                "main";
            grid-template-columns: 1fr;
        }

        .sidebar {
            display: none; /* Hide sidebar on smaller screens */
        }
    }

/* Style for the select dropdown */
.select-dropdown {
    background-color: #1d1b28; /* Same as your main background */
    color: #ffffff; /* White text for contrast */
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #3b3b6d; /* Slightly lighter blue border */
    font-size: 14px;
}

/* Style for the options */
.select-dropdown option {
    background-color: #1d1b28; /* Matching background for options */
    color: #ffffff; /* White text for options */
}

    /* Folder card styling */
.folder-card {
    display: flex;
    align-items: center;
    background-color: #174972;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); /* Subtle shadow */
    padding: 10px 20px;
    width: 320px;
    height: 80px;
    margin: 10px;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* Hover effects */
.folder-card:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Folder icon styling */
.folder-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
}

/* Folder details styling */
.folder-details {
    flex-grow: 1;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.folder-details h2 {
    font-size: 16px;
    margin: 0;
    font-weight: bold;
    color: #000;
}

.folder-details p {
    font-size: 12px;
    margin: 5px 0 0;
    color: #888;
}

/* Options menu;three dots (this is pending customer response)*/
.folder-options {
    display: flex;
    align-items: center;
    font-size: 20px;
    color: #888;
}
    
/* Style the header row */
.ip-header {
    display: grid;
    grid-template-columns: 0.1fr 1fr 1fr 2fr 1fr; /* Add column for the checkbox and so it looks nice*/
    padding: 10px 0;
    font-weight: bold;
    font-size: 16px;
    color: #fff;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    margin-bottom: 10px;
    text-align: left;
    align-items: center;
}

/* Ensure header text doesn't wrap */
.ip-header-item {
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Style each list item */
.ip-item {
    display: grid;
    grid-template-columns: 0.1fr 1fr 1fr 2fr 1fr; /* Match the grid structure with headers */
    align-items: center;
    padding: 10px 0;
    font-size: 16px;
    color: #fff;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.ip-item input[type="checkbox"] {
    margin-right: 7px;
    transform: scale(1.0);
}

.ip-text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

/* Hover effect */
.ip-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgb(222, 222, 222);
}

.button-container {
    display: flex;
    justify-content: flex-end; /* Align the button to the right */
    margin-top: 20px;
}

.export-button {
    background-color: #1d1b28; /* Same background as the rest of the page */
    color: #ffffff; /* White text for contrast */
    padding: 10px 20px;
    border: 1px solid #3b3b6d; /* Slightly lighter blue for the border */
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease, border 0.3s ease;
}

/* Hover effect */
.export-button:hover {
    background-color: #3b3b6d; /* Lighter shade of blue on hover */
    border: 1px solid #5b5b8d; /* Even lighter border on hover */
}

</style>