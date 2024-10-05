<!-- COPY THIS LAYOUT FOR YOUR COMPONENT -->
<!-- WE WILL FIND A BETTER WAY LATER -->

<script>
    let folder = {
        name: "Example",
        items: 63,
        size: "621 MB"
    };

    let ipList = [
        { ip: '192.168.1.1', device: 'Device A', vulnerability: 'CVE-2010-14800 {VPN TRAFFIC HIJACK}', status: 'Exploited' },
        { ip: '192.168.1.5', device: 'Device B', vulnerability: 'CVE-2022-21907 {HTTP PROTOCOL STACK}', status: 'Not Exploited' },
        { ip: '192.168.1.20', device: 'Device C', vulnerability: 'CVE-2024-122 {VPN TRAFFIC HIJACK}', status: 'Exploited' },
        { ip: '192.168.1.25', device: 'Device D', vulnerability: 'CVE-2016-14800 {VPN TRAFFIC HIJACK}', status: 'Not Exploited' },
    ];
   
    import TestSidebar from "$lib/components/dashboardUI/TestSidebar.svelte";
    import TestTopRight from "$lib/components/dashboardUI/TestTopRight.svelte";
</script>

<div class="grid-container">
    <aside class="sidebar">
        <TestSidebar />
    </aside>
        
    <main class="main-content">
        <!-- Your main content goes here -->
        <!-- svelte-ignore a11y-invalid-attribute -->
        <div class="logo"><a href="#"><span>Lo</span>gs</a></div>
        <h1>Welcome to the Reports Page, Luis D. Sanchez and Albert Villegas</h1> 
        <p>This is a simple example to see if I was able to figure this out lol.</p>
        <h1>Reports</h1>
        
        <!-- This section displays the currently selected project. TODO: add functionality to
        the three dots when selected (Maybe, pending customer response) -->
        <div class="folder-icon">
            <!-- Luis and Albert change this image. -->
            <img src="https://img.icons8.com/ios-filled/50/000000/folder-invoices.png" alt="Folder Icon" />
        </div>
        <div class="folder-details">
            <h2>{folder.name}</h2>
            <p>{folder.items} items | {folder.size}</p>
        </div>
        <div class="folder-options">
            <span>⋮</span>
        </div>

        <h2>IP List</h2>
        <!-- Render the IP list with checkboxes (UI only) -->
         <ul class="ip-list">
            {#each ipList as ip}
                <li class="ip-item">
                    <input type="checkbox" disabled /> <!-- Disabled to remove functionality -->
                    <span class="ip-text">{ip.ip} - {ip.device} - {ip.vulnerability} - {ip.status}</span>
                </li>
            {/each}
        </ul>
    </main>

    <section class="right-side">
        <!-- Right side content -->
        <!-- svelte-ignore a11y-invalid-attribute -->
        <div class="logo"><a href="#"><span>INFI</span>LTR8</a></div>
        <TestTopRight />
    </section>
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
        background-color: var(--bg);
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

    .folder-card {
        display: flex;
        align-items: center;
        background-color: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        padding: 10px;
        width: 250px;
        height: 80px;
        margin: 10px;
        cursor: pointer; /* Make it look clickable */
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    /* Add button hover effects */
    .folder-card:hover {
        transform: scale(1.02);
        box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
    }

    /* Folder icon styling */
    .folder-icon img {
        width: 40px;
        height: 40px;
    }

    /* Folder details styling */
    .folder-details {
        flex-grow: 1;
        margin-left: 10px;
    }

    .folder-details h2 {
        font-size: 16px;
        margin: 0;
        font-weight: bold;
    }

    .folder-details p {
        font-size: 12px;
        margin: 5px 0 0;
        color: #666;
    }

    /* Options menu (three dots) */
    .folder-options {
        cursor: pointer;
        font-size: 20px;
    }
    .ip-list {
    list-style: none; /* Remove default bullet points */
    padding: 0; /* Remove default padding */
    margin: 0; /* Remove default margin */
    background-color: #191528; /* Example background color */
    border-radius: 10px; /* Optional: rounding the corners of the list */
    }

    /* Style each list item */
    .ip-item {
        display: flex; /* Align checkbox and text in one line */
        align-items: center; /* Vertically center the content */
        padding: 10px 0; /* Add vertical space between items */
        font-size: 16px; /* Adjust font size */
        color: #fff; /* Make text white */
    }

    /* Style the checkbox */
    .ip-item input[type="checkbox"] {
        margin-right: 7px; /* Add space between checkbox and text */
        transform: scale(1.0); /* Enlarge the checkbox */
    }

    /* Style the text next to the checkbox */
    .ip-text {
        display: inline-block;
    
    }

    /* Optional: Customize hover or active states */
    .ip-item:hover {
        background-color: rgba(255, 255, 255, 0.1); /* Add a hover effect */
        border: 1px solid rgb(222, 222, 222);
    }
</style>