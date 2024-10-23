<!--Support Page Code -- Gilbert Guzman -->
<script lang="ts">
    //Import the ability to use code when we click buttons and to write the text into the manual.
    import { onMount } from "svelte";
    import { writable } from "svelte/store";

    //Set greeting empty and time for the current time for the sidebar.
    let greeting = "";
    let currentHour = new Date().getHours();

    //Set inital font size and filter to none until someone changes it. 
    let fontSize = 17;
    let filter = 'none';

    //Activates the help menu with the initial message before its replaced.
    let showHelp = writable(false);
    let helpText = writable("Welcome to INFILTR8! This system will help find and rank security vulnerabilities found on a computer to help expedidite the reconnaissance section of penetration testing software. This version of the software was created by Team #6 [The Nine Bytes] for the U.S. Army Combat Capabilities Development Command. [DEVCOM]");
    let currentTextIndex = writable(0);

    //Texts for the Manual, Each line is a page of the manual.
    const texts = [
        "Welcome to INFILTR8! This system will help find and rank security vulnerabilities found on a computer to help expedidite the reconnaissance section of penetration testing software. This version of the software was created by Team #6 [The Nine Bytes] for the U.S. Army Combat Capabilities Development Command. [DEVCOM]",
        "When using INFILTR8, the injestion of files is your friend! By Injesting a reconnaissance file, INFILTR8 will help analyst's generate a prioritized list of entry points.",
        "To get started, simply navigate to the dashboard. To do so, simply hover over the sidebar on the left-side when on the site itself, then click 'Dashboard' to get there. The Dashboard displays current information about a project, allows for the creation/deletion of projects, syncing of projects, or the exporting of projects into appropriate file formats.",
        "The sidebar is here to help you navigate the INFILTR8 System. The left-side has various helpful links to other areas of the site, such as the Project Manager, Logs, Reports, and Settings page. As previously mentioned, it can also be used to get back to the dashboard.",
        "Messages will show the Analyst various notifications about the system. If a project finishes, or has elements of alarm, you can check them in Messages.",
        "You can check who is currently logged in by hovering over the sidebar. It will show you the time of day, and the name of the account that is currently logged in.",
        "Logs are created whenever something of substance happens while running INFILTR8. This includes logging in, logging off, processsing a file, creating a project, and more. Logs can also be exported by the Analyst, if they'd like to.",
        "Accessibility and font settings can be found in the Settings tab. They enable you to turn on colorblind settings, or to change the font size of the entire system.",
        "Additional assistance can be found on Team 6's GitHub Page. Simply click the appropriate button when out of the manual. :)"
    ];

    //Keeps track of the currenttextindex for the manual so we know which one were on.
    let currentIndexValue = 0;

    //Subscribes currentTextIndex so we can update currentIndexValue globally for all pages.
    currentTextIndex.subscribe(value => {
        currentIndexValue = value;
    });

    //Determines the greeting based on the time of day. (Universal code for the rest of pages)
    if (currentHour < 12) {
        greeting = "Good morning!";
    } else if (currentHour < 18) {
        greeting = "Good afternoon!";
    } else {
        greeting = "Good evening!";
    }

    //Function so when we click button we open the github.
    function openGit() {
        window.open('https://github.com/Azaze7/CS4311_INFILTR8_6TheNine-Bytes_Fall2024', '_blank');
    }

    //Function so when we click the help button it opens the manual.
    function toggleHelp() {
        showHelp.update(value => !value);
    }

    //Function so we can go to the next page of manual.
    function nextText() {
        currentTextIndex.update(n => (n + 1) % texts.length);
        helpText.set(texts[currentIndexValue]); // Set help text using the updated index
    }

    //Function so we can go to the previous page of manual.
    function prevText() {
        currentTextIndex.update(n => (n - 1 + texts.length) % texts.length);
        helpText.set(texts[currentIndexValue]); // Set help text using the updated index
    }

    //On mount, get previously set filter and font size if previously changed.
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

<!--Box setup for buttons. -->
<div class="container h-full mx-auto flex justify-center items-center">
    <div class="space-y-10 text-center flex flex-col items-center">
        <!--Title for box. -->
        <h2 class="text-3xl font-bold">Source Code, Contact, & Manual</h2>
        <figure>
            <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
                <!--Load Breathing animations for the Butterfly image. -->
                <style>
                    .breathing {
                      width: 450px;
                      height: 450px;
                      position: absolute;
                      top: 8px;
                      right: 8px;
                      animation: breathe 5s ease-in-out infinite, move 10s linear infinite;
                    }
                  
                    @keyframes breathe {
                      0%, 100% {
                        transform: scale(1);
                      }
                      50% {
                        transform: scale(1.05);
                      }
                    }
                    
                    @keyframes move {
                      0% {
                        top: 8px;
                        right: 8px;
                      }
                      50% {
                        top: 10px;
                        right: 10px;
                      }
                      100% {
                        top: 8px;
                        right: 8px;
                      }
                    }
                </style>

                <!--Load Butterfly image. -->
                <!-- Link to photo: https://www.freepik.com/free-vector/butterfly-technology-vector-digital-transformation-blue-graphic_18236534.htm#fromView=search&page=1&position=21&uuid=1571800d-858e-48b7-a6fc-5070848c3276">Image by rawpixel.com on Freepik. -->
                <img src="src/Butterfly.png" alt="Wireframe Butterfly" class="w-80 h-80 absolute top-2 right-2 breathing">

                <div class="flex items-center gap-4">
                    <!--Title for github button. -->
                    <span class="text-gray-400">Source Code / Contact:</span>
                    <button class="bg-indigo-500 text-white px-4 py-2 rounded" on:click={() => openGit()}>GitHub</button>
                </div>
                <div class="mt-4 flex items-center gap-4">
                    <!--Title for manual button. -->
                    <span class="text-gray-400">Help / Manual:</span>
                    <button class="bg-indigo-500 text-white px-2 py-1 rounded" on:click={toggleHelp}>?</button>
                </div>
            </div>
        </figure>
        {#if $showHelp}
        <div class="fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center p-6 z-50">
            <div class="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md">
                <!--Title for INFILTR8 manual. -->
                <h3 class="text-2xl font-bold text-purple-500">INFI<span class="text-indigo-500">LTR8</span> Manual</h3>
                <p class="text-gray-300 mt-4">
                    {texts[currentIndexValue]}
                </p>
                <div class="flex justify-between mt-4">
                    <!--Previous, next, and exit button for manual.-->
                    <button class="text-white text-2xl" on:click={prevText}>←</button>
                    <button class="text-white text-2xl" on:click={toggleHelp}>X</button>
                    <button class="text-white text-2xl" on:click={nextText}>→</button>
                </div>
            </div>
        </div>
        {/if}
    </div>
</div>

<!--Color filters for when we click. (Red, Green, and Blue Colorblindness) -->
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