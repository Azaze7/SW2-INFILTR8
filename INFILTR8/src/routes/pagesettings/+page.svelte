<!--Settings Page Code -- Gilbert Guzman -->
<script lang="ts">
    //Import Lightswitch library so we can turn lightmode/darkmode on.
    import { LightSwitch } from '@skeletonlabs/skeleton';
    //Import the ability to use code when we click buttons on the settings page.
    import { onMount } from "svelte";
    //Import the ability to create logs
    import { createLogEntry } from '../../routes/Logs/logservice';
    
    //Set greeting empty and time for the current time for the sidebar.
    let greeting = "";
    let currentHour = new Date().getHours();
    
    //Set inital font size and filter to none until someone changes it.
    let fontSize = 17;
    let filter = 'none';
    
    //Determines the greeting based on the time of day. (Universal code for the rest of pages)
    if (currentHour < 12) {
        greeting = "Good morning!";
    } else if (currentHour < 18) {
        greeting = "Good afternoon!";
    } else {
        greeting = "Good evening!";
    }
    
    //Function to increase or decrease font size.
    function changeFontSize(increase: boolean) {
        fontSize += increase ? 1 : -1;
        document.documentElement.style.fontSize = `${fontSize}px`;
        localStorage.setItem('fontSize', fontSize.toString());
        const action = increase ? 'increased' : 'decreased';
        createLogEntry({
            type: 'Information',
            message: `Font size ${action} to: ${fontSize}`
        });
    }
    
    //Functon to apply the colorblind filters. 
    function applyFilter(newFilter: string) {
        filter = newFilter;
        document.documentElement.style.filter = filter;
        localStorage.setItem('filter', filter);
        let filterMessage;
        switch (filter) {
            case 'none':
                filterMessage = 'None';
                break;
            case 'url(#protanopia)':
                filterMessage = 'Red';
                break;
            case 'url(#deuteranopia)':
                filterMessage = 'Green';
                break;
            case 'url(#tritanopia)':
                filterMessage = 'Blue';
                break;
        }
        createLogEntry({
            type: 'Information',
            message: `Filter changed to: ${filterMessage}`
        });
    }
    
    //Function so when we click button we open the github.
    function openGit() {
        window.open('https://github.com/Azaze7/CS4311_INFILTR8_6TheNine-Bytes_Fall2024', '_blank');
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
            <h2 class="text-3xl font-bold">Fonts, Accommodations, & More</h2>
            <figure>
                <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <!--Load Breathing animations for the Tool image. -->
                    <style>
                        .breathing {
                          width: 320px;
                          height: 320px;
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
                            top: 9px;
                            right: 9px;
                          }
                          100% {
                            top: 8px;
                            right: 8px;
                          }
                        }
                    </style> 

                    <!--Load Tool image. -->
                    <!--Link to photo: <a href="https://www.freepik.com/free-vector/tuning-tools-configuration-symbols-abstract-low-poly-wireframe-mesh-design-dot-line-connection-vector-illustration-background_24058218.htm#fromView=search&page=1&position=1&uuid=f02376cd-78c4-4ade-8e5a-02fe1c33cb0d">Image by WangXiNa on Freepik. -->
                    <img src="src/Tools.png" alt="Wireframe Tools" class="w-80 h-80 absolute top-2 right-2 breathing">

                    <div class="mt-4 flex items-center gap-4">
                        <!--Title for Font Size buttons. -->
                        <span class="text-gray-400">Change Font Size:</span>
                        <!--Decrease Size Text Button. -->
                        <button class="bg-indigo-500 text-white px-2 py-1 rounded" on:click={() => changeFontSize(false)}>-</button>
                        <!--Print Current Text Size in between buttons. -->
                        <span class="text-gray-300">{fontSize}px</span>
                        <!--Increase Size Text Button. -->
                        <button class="bg-indigo-500 text-white px-2 py-1 rounded" on:click={() => changeFontSize(true)}>+</button>
                    </div>
    
                    <div class="mt-4 flex items-center gap-4">
                        <!--Title for Colorblind Filter Buttons. -->
                        <span class="text-gray-400">Colorblind Filters:</span>
                        <!--All 4 buttons for colorblind. (None, Red, Blue, Green). -->
                        <button class="bg-indigo-500 text-white px-2 py-1 rounded" on:click={() => applyFilter('none')}>None</button>
                        <button class="bg-indigo-500 text-white px-2 py-1 rounded" on:click={() => applyFilter('url(#protanopia)')}>Red</button>
                        <button class="bg-indigo-500 text-white px-2 py-1 rounded" on:click={() => applyFilter('url(#deuteranopia)')}>Green</button>
                        <button class="bg-indigo-500 text-white px-2 py-1 rounded" on:click={() => applyFilter('url(#tritanopia)')}>Blue</button>
                    </div>
    
    
                    <div class="mt-4 flex items-center gap-2 ">
                        <!--Title for Lightmode/Darkmode button. -->
                        <span class="mr-2 text-gray-400">Lightmode / Darkmode:</span>
                        <!--Use Library Switch for Lightmode/Darkmode. -->
                        <LightSwitch />
                    </div>
                </div>
            </figure>
    
            <div class="flex items-center gap-4">
                <!--Title for github button. (Outside Box) -->
                <span class="text-gray-400">See INFILTR8 on:</span>
                <button class="bg-indigo-500 text-white px-4 py-2 rounded" on:click={() => openGit()}>GitHub</button>
            </div>
        </div>
    </div>
    
    <!--Code for Color filters for when we click. (Red, Green, and Blue Colorblindness). -->
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
    