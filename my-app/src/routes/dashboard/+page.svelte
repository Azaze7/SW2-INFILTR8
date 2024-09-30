<script>
    import TestNavbar from "$lib/components/dashboardUI/TestNavbar.svelte";
    import TestSidebar from "$lib/components/dashboardUI/TestSidebar.svelte";
    import TestTopRight from "$lib/components/dashboardUI/TestTopRight.svelte";
</script>


<div class="grid-container">
    <aside class="sidebar">
        <TestSidebar />
    </aside>
    <main class="main-content">
        <!-- Your main content goes here -->
        <h1>Main Content</h1>
        <p>This is the center of the page.</p>
    </main>
    <section class="right-side">
        <!-- Right side content -->
        <!--<h2>Right Sidebar</h2>
        <p>Additional info or widgets can go here.</p>-->
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
        grid-template-columns: 250px 1fr 250px; /* Sidebar, main content, right-side width */
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
        padding: 20px;
        overflow-y: auto;
        background-color: #f1f1f1;
        /*background-color: var(--bg);*/
    }
    .main-content h1{
        margin-left: 1rem;
    }

    /* Right Side Section Styling */
    .right-side {
        grid-area: right;
        background-color: #f8f9fa;
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
</style>
