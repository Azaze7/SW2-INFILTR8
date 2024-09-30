<!-- settings.svelte site file. Will use imports from other sites to allow it to function correctly. -->
<!-- First script. Stores site imports and function information for when buttons are pushed. -->
<script>

    //Ignore the type errors that occur when we change the size of the elements.
    //@ts-nocheck

    //Import Authenticate.svelte to ensure user login before settings are loaded/allowed to be changed.
    import Authenticate from "../ui/Login/Authenticate.svelte";
    //Import the sidebar and top navbar made by other teammates.
        //Kept to ensure consistency accross the the site.
    import Navbar from "$lib/components/dashboardUI/Navbar.svelte";
    import Sidebar from "$lib/components/dashboardUI/Sidebar.svelte";
    //Import onMount, which allows for functions to be run when the user clicks buttons on the settings menu.
        //This includes enabling darkmode, changing font size, etc.
    import { onMount } from 'svelte';

    //let (default) values. Set font to start at 16 and for the first switch to be false. (We start in dark mode)
        //Can add more switches later for color options.
    let switches = [false];
    let fontSize = 16;

    //First function. Toggle on/off switch for the light mode.
    function toggle(index) 
    {
        switches[index] = !switches[index];
        const isLightMode = !switches[0];
        document.body.classList.toggle('light-mode', isLightMode);                localStorage.setItem('lightMode', isLightMode ? 'enabled' : 'disabled');
    }

    //Second Function. Decrease the font size by 2 per click.
    function decreaseFontSize() 
    {
        fontSize = fontSize - 2;
        //make sure to reflect changes on document.
        document.body.style.fontSize = `${fontSize}px`;
        //save the fontSize to ensure it stays bigger/smaller after leaving settings.
        localStorage.setItem('fontSize', fontSize);
    }

    //Third Function. Increase the font size by 2 per click.
    function increaseFontSize() 
    {
        fontSize = fontSize + 2;
        //make sure to reflect changes on document.
        document.body.style.fontSize = `${fontSize}px`;
        //save the fontSize to ensure it stays bigger/smaller after leaving settings.
        localStorage.setItem('fontSize', fontSize);
    }

    //OnMount to run functions and ensure that switches are labeled right.
    onMount(() => {
        //Pull current lightmode value. (on/off)
        const lightMode = localStorage.getItem('lightMode');
        //if lighmode is on: label is set to enabled (false; due to us starting in darkmode).
        if (lightMode === 'enabled')
        {
            switches[0] = false;
            //Then add the light-mode class, which is what applies all the light-mode coloring.
            document.body.classList.add('light-mode');
        } else {
        //Else lightmode is off, and we remove all the lightmode colorings so its default on darkmode.
        switches[0] = true;
        document.body.classList.remove('light-mode');
        }
        //declare the "storedFontSize" to be whatever the fontSize currently is.
        const storedFontSize = localStorage.getItem('fontSize');
        //Parse the const storedFontSize as an Int so we can add/sub to it.
        fontSize = parseInt(storedFontSize, 10);
        //Set the document style fontSize to the fontSize as an int.
        document.body.style.fontSize = `${fontSize}px`;
    });
</script>
<!-- End of first script -->
    
<!-- Top Navbar import. Placed up here so its on top. -->
<div class="settings-container">
    <Navbar title="Settings Page" />
</div>
    
<!-- "Main Container". Actually just the rectangle below the top navbar. -->
<!-- We import the sidebar here for the left, then will do the actual settings screen. -->
<div class="main-container">
    <div class="sidebar-container">
        <Sidebar/>
    </div>
    
    <!-- Custom Settings Screen UI -->
    <!-- Now we modify the settings-screen class to program our buttons. -->
    <div class="settings-screen">
        <!-- Top Title that says 'INFILTR8 Settings'. -->
        <h1>INFILTR8 Settings</h1>

        <!-- Create off/on switch for the LightMode. -->
        <div class="switch-container">
            <label for="light-mode-toggle">Light Mode</label>
            <button id="light-mode-toggle" class="toggle-btn" on:click={() => toggle(0)}>
                {switches[0] ? "Off" : "On"}
            </button>
        </div>

        <!-- Create fontsize toggle -->
        <div class="switch-container">
            <!-- Label that says Font Size. -->
            <label for="font-size-toggle">Font Size</label>
            <!-- Call font-size decrease if clicked, has a '-' on it. -->
            <button id="font-size-decrease" class="toggle-btn" on:click={decreaseFontSize}>-</button>
            <!-- Print the font size in between the '-' & '+' buttons, needs '&nbsp' for spacing -->
            <span>&nbsp;{fontSize}</span>
            <!-- Call font-size increase if clicked, has a '+' on it. -->
            <button id="font-size-increase" class="toggle-btn" on:click={increaseFontSize}>+</button>
        </div>

        <!-- UNFINISHED. -->
        <!-- Create Accessibility Option toggles -->
        <div class="switch-container">
            <label for="color-blind-toggle">Accessibility Options</label>
            <button id="color-blind-red" class="toggle-btn" on:click={increaseFontSize}>Protanopia - Red</button>
            <button id="color-blind-green" class="toggle-btn" on:click={increaseFontSize}>Deuteranopia - Green</button>
            <button id="color-blind-blue" class="toggle-btn" on:click={increaseFontSize}>Tritanopia - Blue</button>
        </div>

        <!-- UNFINISHED. -->
        <!-- Create help toggle -->
        <div class="switch-container">
            <!-- Label that says Help Manual. -->
            <label for="font-size-toggle">Help/Manual</label>
            <!-- Call the manual if clicked, has a '?' on it. -->
            <button id="load-manual" class="toggle-btn" on:click={increaseFontSize}>?</button>
        </div>

    </div>
    <!-- End of settings-screen. -->
</div>
<!-- End of the site's loaded butons. -->
    
<!-- Styling/Coloring for site elements. -->
<style>
    /*Ensures that site is always loaded to the full window size its opened in.*/ 
    .main-container {
        display: flex;
        min-height: 100vh;
    }
    
    /*Sidebar Styling. (For Default Dark Mode).*/
    .sidebar-container {
        width: 200px;
        position: sticky;
        top: 0;
        height: 100vh;
        background-color: #333;
        overflow-y: auto;
    }
    
    /*Styling for 'INFILTR8 Settings' Top Logo Text.*/
    h1 {
        margin-bottom: 20px;
        color: rgb(184, 47, 47);
    }

    /*Styling for the settings menu itself.*/
    .settings-screen {
        flex-grow: 1;
        padding: 20px;
        font-family: Arial, sans-serif;
        background-color: #333;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
    }
    
    /*Styling for the switches, ensures that they are in the middle and can grow.*/
    .switch-container {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }
    
    /*Styling for the buttons themselves. Have the light green buttons.*/
    .toggle-btn {
        background-color: #1abc9c;
        color: white;
        border: none;
        padding: 10px;
        cursor: pointer;
        margin-left: 10px;
        border-radius: 5px;
        font-size: 16px;
    }
    
    /*Styling for darkening of buttons when hovered over.*/
    .toggle-btn:hover {
        background-color: #16a085;
    }
    
    /*LIGHT MODE EXCLUSIVE STYLING. ONLY ACTIVE WHEN LIGHT-MODE IS ON.*/
    /*Change the site body to white.*/
    :global(body.light-mode) .main-container {
        background-color: white;
        color: black;
    }
    
    /*LIGHT MODE EXCLUSIVE STYLING. ONLY ACTIVE WHEN LIGHT-MODE IS ON.*/
    /*Change the sidebar to gray so its easier to see text in lightmode.*/
    :global(body.light-mode) .sidebar-container {
        background-color: #a9a9a9;
        color: white; /* Ensure sidebar text is light enough to be readable */
    }
    
    /*LIGHT MODE EXCLUSIVE STYLING. ONLY ACTIVE WHEN LIGHT-MODE IS ON.*/
    /*Change the settings body to white.*/
    :global(body.light-mode) .settings-screen {
        background-color: white;
    }
    
    /*LIGHT MODE EXCLUSIVE STYLING. ONLY ACTIVE WHEN LIGHT-MODE IS ON.*/
    /*Ensure the 'INFILTR8 Settings' text stays red in light mode.*/
    :global(body.light-mode) h1 {
        color: rgb(184, 47, 47);
    }
    
    /*LIGHT MODE EXCLUSIVE STYLING. ONLY ACTIVE WHEN LIGHT-MODE IS ON.*/
    /*Ensure that all buttons are blue in light mode.*/
    :global(body.light-mode) .toggle-btn {
        background-color: #3498db;
        color: black;
    }
    
    /*LIGHT MODE EXCLUSIVE STYLING. ONLY ACTIVE WHEN LIGHT-MODE IS ON.*/
    /*Ensure that all buttons are a darker blue when hovered in light mode.*/
    :global(body.light-mode) .toggle-btn:hover {
        background-color: #2980b9;
    }

</style>
<!-- End of style settings. -->