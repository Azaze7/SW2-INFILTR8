<script>
// @ts-nocheck


import { onMount } from 'svelte';   
    
    // @ts-ignore
    import TestNavbar from "$lib/components/dashboardUI/TestNavbar.svelte";
    import TestSidebar from "$lib/components/dashboardUI/TestSidebar.svelte";
    import TestTopRight from "$lib/components/dashboardUI/TestTopRight.svelte";
    
    let greeting = "";
    let currentHour = new Date().getHours();
    
    // Determine the greeting based on the time of day
    if (currentHour < 12) {
        greeting = "Good morning!";
    } else if (currentHour < 18) {
        greeting = "Good afternoon!";
    } else {
        greeting = "Good evening!";
    }

    // File Drop Logic
    /**
     * @type {any[]}
     */
    let files = [];
    let isDragOver = false;

    // Reference to the hidden file input
    /**
     * @type {{ click: () => void; }}
     */
    let fileInput;

    // Handle files added via drop or input
    /**
     * @param {any} selectedFiles
     */
    function handleFiles(selectedFiles) {
        for (let file of selectedFiles) {
            files = [...files, file];
        }
    }

    // Event handlers for drag & drop
    /**
     * @param {{ preventDefault: () => void; }} event
     */
    function handleDragOver(event) {
        event.preventDefault();
        isDragOver = true;
    }

    function handleDragLeave(event) {
        event.preventDefault();
        isDragOver = false;
    }

    function handleDrop(event) {
        event.preventDefault();
        isDragOver = false;
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            handleFiles(event.dataTransfer.files);
            event.dataTransfer.clearData();
        }
    }

    // Handle click on drop area to trigger file input
    function handleDropAreaClick() {
        fileInput.click();
    }

    // Handle file input change
    function handleFileInputChange(event) {
        if (event.target.files && event.target.files.length > 0) {
            handleFiles(event.target.files);
        }
    }

    // Optionally, you can handle file removal
    function removeFile(index) {
        files = files.filter((_, i) => i !== index);
    }





</script>






<div class="grid-container">
    <aside class="sidebar">
        <TestSidebar />
    </aside>
    <main class="main-content">
        <!-- Your main content goes here -->
        <!-- svelte-ignore a11y-invalid-attribute -->
        <div class="logo"><a href="#"><span>Dash</span>board</a></div>
        <p>{greeting}</p>

        <button>Create Project</button>
        <button>Sync Project</button>
        <button>Delete Projects</button>

        <div class="dropdown">
            <button class="dropbtn">Export Project</button>
            <div class="dropdown-content">
                <!-- svelte-ignore a11y-invalid-attribute -->
                <a href="#">Export as PDF</a>
                <!-- svelte-ignore a11y-invalid-attribute -->
                <a href="#">Export as CSV</a>
                <!-- svelte-ignore a11y-invalid-attribute -->
                <a href="#">Export as Excel</a>
            </div>
        </div>
        
        <div class="file-drop-area">
            <span class="file-message">Drag & Drop files here or click to upload</span>
            <input type="file" id="fileInput" multiple>
        </div>

        
        <div id="fileList">
            <h2>Files</h2>
        </div>
        
        

    </main>
    <section class="right-side">
        <!-- Right side content -->
        <!--<h2>Right Sidebar</h2>
        <p>Additional info or widgets can go here.</p>-->
        <!-- svelte-ignore a11y-invalid-attribute -->
        <div class="logo"><a href="#"><span>INFI</span>LTR8</a></div>
        <TestTopRight/>
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
        background-color: f1f1f1;
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
        /*background-color: #f1f1f1;*/
        background-color: var(--bg);
    }

    /* Right Side Section Styling */
    .right-side {
        grid-area: right;
        /*background-color: #f8f9fa;*/
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

    /* Style for all buttons */
button {
    background-color: #4CAF50; /* Green background */
    color: white;
    padding: 10px 20px;
    margin: 10px 5px;
    font-size: 16px;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

/* Hover effect for all buttons */
button:hover {
    background-color: #3e8e41; /* Darker green */
}



    /* Style the dropdown container */
.dropdown {
    position: relative;
    display: inline-block;
}

/* Style the dropdown button */
.dropbtn {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    cursor: pointer;
}

/* Style the dropdown content (hidden by default) */
.dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
    z-index: 1;
}

/* Style the links in the dropdown */
.dropdown-content a {
    color: black;
    padding: 10px 20px;
    text-decoration: none;
    display: block;
}

/* Change color of links on hover */
.dropdown-content a:hover {
    background-color: #f1f1f1;
}

/* Show the dropdown content on hover */
.dropdown:hover .dropdown-content {
    display: block;
}

/* Change the button background color on hover */
.dropdown:hover .dropbtn {
    background-color: #3e8e41;
}


/* Style the file drop area */
.file-drop-area {
    margin-top: 10rem;
    border: 2px dashed #4CAF50;
    padding: 40px;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.3s ease;
    border-radius: 10px;
    color: #333;
}

.file-drop-area:hover {
    background-color: #f9f9f9;
}

.file-message {
    display: block;
    font-size: 16px;
    color: #666;
}

/* Hide the actual file input */
input[type="file"] {
    display: none;
}

#fileList {
    margin-top: 20px;
    font-size: 14px;
}


</style>
