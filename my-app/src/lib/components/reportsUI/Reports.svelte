<!-- COPY THIS LAYOUT FOR YOUR COMPONENT -->
<!-- WE WILL FIND A BETTER WAY LATER -->

<script>
    let folder = {
    name: "Example",
    items: 63,
    size: "621 MB"
    };
   
    import TestSidebar from "$lib/components/dashboardUI/TestSidebar.svelte"
    import TestTopRight from "$lib/components/dashboardUI/TestTopRight.svelte"
</script>

<div class="grid-container">
    <aside class="sidebar">
        <TestSidebar />
    </aside>
        
    <main class="main-content">
        <!-- Your main content goes here -->
        <!-- svelte-ignore a11y-invalid-attribute -->
        <div class="logo"><a href="#"><span>Lo</span>gs</a></div>
        <h1>Reports</h1>
        
        <!-- This section displays the currently selected progect. TODO: add functionality to
         the three dots when selected (Maybe, pending customer response )-->
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

        <h1>Welcome to the Reports Page, Luis D. Sanchez and Albert Villegas</h1> 
        <p>This is a simple example to see if I was able to figure this out lol.</p>
    </main>

    <section class="right-side">
        <!-- Right side content -->
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
</style>


