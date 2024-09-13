<script>
    import Footer from "$lib/components/dashboardUI/Footer.svelte";
    import Grids from "$lib/components/dashboardUI/Grids.svelte";
    import Navbar from "$lib/components/dashboardUI/Navbar.svelte";
    import Sidebar from "$lib/components/dashboardUI/Sidebar.svelte";
</script>

<Navbar/>
<div class="main-container">
    <div class="sidebar-container">
        <Sidebar/>
    </div>
    <div class="content">
        <Grids/>
        <!--<p>Home content goes here</p>-->
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
        margin-top: -.5rem;
        height: 100vh;
        overflow-y: auto; /* Enable scrolling independently */
        background-color: #333; /* Set a background color to avoid transparency */
    }

    .content {
        flex-grow: 1; /* Allow content to take the rest of the space */
        padding: 20px;
        background-color: #333;
    }

    .bottom-container {
        bottom: 20px;
    }

</style>
