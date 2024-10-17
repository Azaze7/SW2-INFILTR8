<script lang="ts">
    import { LightSwitch } from '@skeletonlabs/skeleton';
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    
    let greeting = "";
    let currentHour = new Date().getHours();
    
    let fontSize = 17;
    let filter = 'none';
    let showHelp = writable(false);
    let helpText = writable("INFILTR8 is designed to help Analyst's find and rank any security vulnerabilities found on the PC that it is currently running on.<br><br>This version of the software was created by Team #6 [The Nine Bytes] for the U.S. Army Combat Capabilities Development Command. [DEVCOM]");
    let currentTextIndex = writable(0);
    
    const texts = [
        "INFILTR8 is designed to help Analyst's find and rank any security vulnerabilities found on the PC that it is currently running on.\nThis version of the software was created by Team #6 [The Nine Bytes] for the U.S. Army Combat Capabilities Development Command. [DEVCOM]",
        "To get started, navigate to the dashboard.You can use the 'Go Back to Dashboard' button here on the Settings page, or use the sidebar on the left-side when on the site itself to get there.The dashboard displays current information about a project, allows for the creation of new projects, syncing of projects, or the exporting of projects into appropriate file formats.",
        "The two sidebars are here to help you.The left-side can be used to navigate around the site, whereas the right-side is used to assist in project creation and modification.",
        "Messages will show Analysts notifications about the system.If a project finishes, or has elements of alarm, you can check them in Messages.",
        "Account will show information about the Analyst currently logged in.This will ensure that the right person is currently using the INFILTR8 Software.",
        "Logs are created whenever something of substance happens while running INFILTR8. This includes logging in, logging off, processsing a file, creating a project, and more.Logs can also be exported by the Analyst, if you'd like to.",
        "Additional assistance can be found on Team 6's GitHub Page."
    ];
    
    let currentIndexValue = 0; // To keep track of the current text index
    
    // Subscribe to currentTextIndex to update currentIndexValue globally
    currentTextIndex.subscribe(value => {
        currentIndexValue = value;
    });
    
    // Determine the greeting based on the time of day
    if (currentHour < 12) {
        greeting = "Good morning!";
    } else if (currentHour < 18) {
        greeting = "Good afternoon!";
    } else {
        greeting = "Good evening!";
    }
    
    
    function changeFontSize(increase: boolean) {
        fontSize += increase ? 1 : -1;
        document.documentElement.style.fontSize = `${fontSize}px`;
        localStorage.setItem('fontSize', fontSize.toString());
    }
    
    
    function applyFilter(newFilter: string) {
        filter = newFilter;
        document.documentElement.style.filter = filter;
        localStorage.setItem('filter', filter);
    }
    
    function openGit() {
        window.open('https://github.com/Azaze7/CS4311_INFILTR8_6TheNine-Bytes_Fall2024', '_blank');
    }
    
    function toggleHelp() {
        showHelp.update(value => !value);
    }
    
    function nextText() {
        currentTextIndex.update(n => (n + 1) % texts.length);
        helpText.set(texts[currentIndexValue]); // Set help text using the updated index
    }
    
    function prevText() {
        currentTextIndex.update(n => (n - 1 + texts.length) % texts.length);
        helpText.set(texts[currentIndexValue]); // Set help text using the updated index
    }
    
    onMount(() => {
        const savedFontSize = localStorage.getItem('fontSize');
        const savedFilter = localStorage.getItem('filter');
    
        if (savedFontSize) {
            fontSize = parseInt(savedFontSize, 10);
            document.documentElement.style.fontSize = `${fontSize}px`;
        }
    
        if (savedFilter) {
            filter = savedFilter;
            document.documentElement.style.filter = filter;
        }
    });
</script>

<div class="container h-full mx-auto flex justify-center items-center">
    <div class="space-y-10 text-center flex flex-col items-center">
        <h2 class="text-3xl font-bold">Source Code & Contact</h2>
        <div class="p-4 bg-gray-800 rounded-lg">
            <div class="flex flex-col space-y-4">
                <div class="flex items-center space-y-2 gap-3">
                    <span class="text-purple-400">Source Code</span>
                    <button class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700" on:click={openGit}>GitHub</button>
                </div>
                <div class="flex items-center space-y-2 gap-3">
                    <span class="text-purple-400">Help/Manual</span>
                    <button class="px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700" on:click={toggleHelp}>Manual</button>
                </div>
            </div>
        </div>

        {#if $showHelp}
            <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
                <div class="bg-gray-800 text-white p-6 rounded-lg space-y-4 relative">
                    <button class="absolute top-2 right-2 text-white text-2xl" on:click={toggleHelp}>X</button>
                    <h3 class="text-2xl font-bold"><span class="text-purple-400">INFI</span>LTR8 Manual</h3>
                    <p class="text-gray-300 mt-4">
                        {texts[currentIndexValue]}
                    </p>
                    <div class="flex justify-between space-x-4">
                        <button class="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600" on:click={prevText}>←</button>
                        <button class="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600" on:click={nextText}>→</button>
                    </div>
                </div>
            </div>
        {/if}

    </div>
</div>

<h1 class="flex justify-center mt-10 text-lg">Hi! You can also message our team via GitHub if you'd like.</h1>
