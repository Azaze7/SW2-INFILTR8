<script>
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

<Navbar/>
<div class="main-container">
    <div class="sidebar-container">
        <Sidebar/>
    </div>
    <div class="content">
        <Grids/>

        <!-- Greeting the analyst -->
        <h1>{greeting}</h1>

        <!-- Notifications Section -->
        <section class="notifications">
            <h2>Notifications</h2>
            <ul>
                {#each notifications as notification}
                    <li on:click={() => openNotification(notification)} class:unread={notification.unread}>
                        {notification.text} {notification.unread ? "(Unread)" : ""}
                    </li>
                {/each}
            </ul>
        </section>

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

        <!-- Buttons for creating a project and discarding files -->
        <div class="buttons">
            <button class="create-btn" on:click={openCreateProjectWindow}>Create Project</button>
            <button class="discard-btn" on:click={discardAllFiles}>Discard all</button>
        </div>

        <!-- Modal for Create New Project -->
        {#if showCreateProjectModal}
            <div class="modal">
                <h2>Create New Project</h2>
                <!-- Add Create Project form here -->
                <button on:click={closeCreateProjectWindow}>Close</button>
            </div>
        {/if}
    </div>
</div>

<div class="bottom-container">
    <Footer/>
</div>

<style>
    /* Main container to organize sidebar and content */
    .main-container {
        display: flex;

        min-height: 100vh;

    }

    /* Sidebar-specific styles */
    .sidebar-container {
        width: 150px;
        position: sticky;
        top: 0;
        margin-top: -.5rem;
        height: 100vh;

        overflow-y: auto;
        background-color: #333;
    }

    .content {
        flex-grow: 1;
        padding: 20px;
        background-color: #333;
        color: white;

    }

    .bottom-container {
        bottom: 20px;
    }

    h1 {
        font-size: 36px;
        margin-bottom: 30px;
    }

    /* Notifications */
    .notifications {
        margin-bottom: 40px;
    }

    .notifications h2 {
        font-size: 24px;
        margin-bottom: 10px;
    }

    .notifications ul {
        list-style: none;
        padding: 0;
    }

    .notifications li {
        background-color: #f5f5f5;
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 5px;
        cursor: pointer;
    }

    .notifications li.unread {
        background-color: #ffebee;
        font-weight: bold;
    }

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
