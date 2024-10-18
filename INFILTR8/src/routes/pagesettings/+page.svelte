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
        "INFILTR8 is designed to help Analyst's find and rank any security vulnerabilities found on the PC that it is currently running on.<br><br>This version of the software was created by Team #6 [The Nine Bytes] for the U.S. Army Combat Capabilities Development Command. [DEVCOM]",
        "To get started, navigate to the dashboard.<br><br>Simply hover over the sidebar on the left-side when on the site itself to get there.<br><br>The dashboard displays current information about a project, allows for the creation/deletion of projects, syncing of projects, or the exporting of projects into appropriate file formats.",
        "The sidebar is here to help you navigate the INFILTR8 System.<br><br>The left-side has various helpful links to other areas of the site, such as the Project Manager, Logs, Reports, and Settings page. As previously mentioned, it can also be used to get back to the dashboard.",
        "Messages will show Analysts notifications about the system.<br><br>If a project finishes, or has elements of alarm, you can check them in Messages.",
        "You can check who is currently logged in by hovering over the sidebar. It will show you the time of day, and the name of the account currently logged in.",
        "Logs are created whenever something of substance happens while running INFILTR8. This includes logging in, logging off, processsing a file, creating a project, and more.<br><br>Logs can also be exported by the Analyst, if you'd like to.",
        "Accessability and font settings can be found in the Settings tab.<br><br> They enable you to turn on colorblind settings, or to change the fonts of the entire system.",
        "Additional assistance can be found on Team 6's GitHub Page.<br><br>Simply click the appropriate button when out of the manual."
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
            <h2 class="text-3xl font-bold">Fonts, Accommodations, & More</h2>
            <figure>
                <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div class="mt-4 flex items-center gap-4">
                        <span class="text-gray-400">Change Font Size:</span>
                        <button class="bg-indigo-500 text-white px-2 py-1 rounded" on:click={() => changeFontSize(false)}>-</button>
                        <span class="text-gray-300">{fontSize}px</span>
                        <button class="bg-indigo-500 text-white px-2 py-1 rounded" on:click={() => changeFontSize(true)}>+</button>
                    </div>
    
                    <div class="mt-4 flex items-center gap-4">
                        <span class="text-gray-400">Colorblind Filters:</span>
                        <button class="bg-indigo-500 text-white px-2 py-1 rounded" on:click={() => applyFilter('none')}>None</button>
                        <button class="bg-indigo-500 text-white px-2 py-1 rounded" on:click={() => applyFilter('url(#protanopia)')}>Red</button>
                        <button class="bg-indigo-500 text-white px-2 py-1 rounded" on:click={() => applyFilter('url(#deuteranopia)')}>Green</button>
                        <button class="bg-indigo-500 text-white px-2 py-1 rounded" on:click={() => applyFilter('url(#tritanopia)')}>Blue</button>
                    </div>
    
    
                    <div class="mt-4 flex items-center gap-2 ">
                        <span class="mr-2 text-gray-400">Lightmode / Darkmode:</span>
                        <LightSwitch />
                    </div>
                </div>
    
                {#if $showHelp}
                <div class="fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center p-6 z-50">
                    <button class="absolute top-2 right-2 text-white text-xl" on:click={toggleHelp}>X</button>
                    <div class="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md">
                        <h3 class="text-2xl font-bold text-purple-500">INFI<span class="text-indigo-500">LTR8</span> Manual</h3>
                        <p class="text-gray-300 mt-4">
                            {texts[currentIndexValue]}
                        </p>
                        <div class="flex justify-between mt-4">
                            <button class="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600" on:click={prevText}>←</button>
                            <button class="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600" on:click={nextText}>→</button>
                        </div>
                    </div>
                </div>
                {/if}
            </figure>
    
            <div class="flex items-center gap-4">
                <span class="text-gray-400">See INFILTR8 on:</span>
                <button class="bg-indigo-500 text-white px-4 py-2 rounded" on:click={() => openGit()}>GitHub</button>
            </div>
        </div>
    </div>
    
    <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
        <filter id="protanopia">
            <feColorMatrix type="matrix" values="0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0"/>
        </filter>
        <filter id="deuteranopia">
            <feColorMatrix type="matrix" values="0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0"/>
        </filter>
        <filter id="tritanopia">
            <feColorMatrix type="matrix" values="0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0 0.475 0.525 0 0 0 0 0 1 0"/>
        </filter>
    </svg>
    