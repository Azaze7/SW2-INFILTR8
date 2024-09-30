<script>
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
        //document.getElementById('file-input').click();
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



<div class="topBox">
    <!-- Notifications Section -->
    <section class="notifications">
        <h2>Notifications</h2>
        <ul>
            {#each notifications as notification}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                <li on:click={() => openNotification(notification)} class:unread={notification.unread}>
                    {notification.text} {notification.unread ? "(Unread)" : ""}
                </li>
            {/each}
        </ul>
    </section>
    <h4>view all</h4>
</div>

<style>
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
        /*background-color: #f5f5f5;*/
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 5px;
        cursor: pointer;
    }

    .notifications li.unread {
        /*background-color: #ffebee;*/
        font-weight: bold;
    }
</style>