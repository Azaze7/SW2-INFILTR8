<script>
// @ts-nocheck

    import Footer from "$lib/components/dashboardUI/Footer.svelte";
    import Navbar from "$lib/components/dashboardUI/Navbar.svelte";
    import Sidebar from "$lib/components/dashboardUI/Sidebar.svelte";
    import Grids from "$lib/components/dashboardUI/Grids.svelte"

    let showCreateProjectModal = false;
    /**
     * @type {any[]}
     */
    let selectedFiles = [];
    let notifications = [
        { id: 1, text: "New vulnerability detected", unread: true },
        { id: 2, text: "Analysis completed", unread: true },
    ];

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

    function openCreateProjectWindow() {
        showCreateProjectModal = true;
    }

    function closeCreateProjectWindow() {
        showCreateProjectModal = false;
    }

    function openFileExplorer() {
        // @ts-ignore
        document.getElementById('file-input').click();
    }

    function discardAllFiles() {
        selectedFiles = [];
        console.log("All files discarded");
    }

    /**
     * @param {{ id?: number; text: any; unread: any; }} notification
     */
    function openNotification(notification) {
        notification.unread = false;
        alert(notification.text);
    }

    /**
     * @param {{ target: { files: Iterable<any> | ArrayLike<any>; }; }} event
     */
    function handleFileSelection(event) {
        selectedFiles = Array.from(event.target.files);
    }

    /**
     * @param {number} index
     */
    function removeFile(index) {
        selectedFiles.splice(index, 1);
    }

</script>

<!-- Create New Project Section -->
<section class="create-project">
    <h2>Create New Project</h2>
    <div class="file-upload-area">
        <div class="file-upload-box">
            <p>Select a file or drag and drop here</p>
            <input type="file" id="file-input" multiple on:change={handleFileSelection} style="display: none;" />
            <button on:click={openFileExplorer}>Select Files</button>
        </div>
    </div>
</section>

<!-- Selected Files List -->
<section class="file-list">
    <h3>Files</h3>
    {#if selectedFiles.length > 0}
        <ul>
            {#each selectedFiles as file, index}
                <li>
                    <span>{file.name}</span>
                    <button on:click={() => removeFile(index)}>x</button>
                </li>
            {/each}
        </ul>
    {/if}
</section>

<style>
    /* Create Project Section */
    .create-project {
        margin-bottom: 40px;
    }

    .file-upload-area {
        border: 2px dashed #ccc;
        padding: 40px;
        text-align: center;
        border-radius: 10px;
        background-color: #fafafa;
    }

    .file-upload-box p {
        margin-bottom: 20px;
    }

    .file-list {
        margin-bottom: 40px;
    }

    .file-list ul {
        list-style: none;
        padding: 0;
    }

    .file-list li {
        display: flex;
        justify-content: space-between;
        background-color: #e3f2fd;
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 5px;
    }

    .file-list button {
        background: none;
        border: none;
        color: red;
        font-weight: bold;
        cursor: pointer;
    }

    .buttons {
        display: flex;
        gap: 20px;
    }

    .create-btn {
        background-color: #26a69a;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
    }

    .discard-btn {
        background-color: #ef5350;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
    }

    .create-btn:hover, .discard-btn:hover {
        opacity: 0.9;
    }

    .modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        color: black;
        padding: 20px;
        border-radius: 10px;
        z-index: 1000;
    }
</style>