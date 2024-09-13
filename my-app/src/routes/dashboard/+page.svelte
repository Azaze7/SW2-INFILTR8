<script>
    import Footer from "$lib/components/dashboardUI/Footer.svelte";
    import Navbar from "$lib/components/dashboardUI/Navbar.svelte";
    import Sidebar from "$lib/components/dashboardUI/Sidebar.svelte";
</script>

<Navbar/>

<div class="main-container">
    <div class="sidebar-container">
        <Sidebar/>
    </div>
    <div class="content">
        <p>Home content goes here</p>
    </div>
</div>
<div class="bottom-container">
    <Footer/>
</div>

<style>
    /* Main container to organize sidebar and content */
    .main-container {
        display: flex;
        min-height: 100vh; /* Ensure it stretches to the full viewport height */
    }

    /* Sidebar-specific styles */
    .sidebar-container {
        width: 150px;
        position: sticky;
        top: 0;
        height: 100vh;
        overflow-y: auto; /* Enable scrolling independently */
        background-color: #333; /* Set a background color to avoid transparency */
    }

    .content {
        flex-grow: 1; /* Allow content to take the rest of the space */
        padding: 20px;
        background-color: #f5f5f5;
    }

    .bottom-container {
        bottom: 0;
    }

    /* Footer specific styles */
    /*Footer {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;  Stretches across the page 
        background-color: #333;
        color: white;
        padding: 10px;
        text-align: center;
    }*/

    /* Ensure no content overlaps the footer */
    .content {
        padding-bottom: 70px; /* Extra padding so content doesn't overlap with the footer */
    }
</style>
