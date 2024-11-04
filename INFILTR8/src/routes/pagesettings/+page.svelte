<!--Settings Page Code -- Christian Garcia -->
<script lang="ts">
    //Import LightSwitch for toggling light/dark mode themes
    import { LightSwitch } from '@skeletonlabs/skeleton';
    //Import onMount to execute actions when component loads
    import { onMount } from "svelte";
    //Import createLogEntry to log user actions
    import { createLogEntry } from '../../routes/Logs/logservice';
    
    //Initialize greeting and currentHour for sidebar greeting
    let greeting = "";
    let currentHour = new Date().getHours();
    
    //Set default font size and color filter (no filter applied initially)
    let fontSize = 17;
    let filter = 'none';
    
    //Assign greeting based on current time of day
    if (currentHour < 12) {
        greeting = "Good morning!";
    } else if (currentHour < 18) {
        greeting = "Good afternoon!";
    } else {
        greeting = "Good evening!";
    }
    
    //Adjusts font size and logs the action
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
    
    //Applies the selected colorblind filter and logs the change
    function applyFilter(newFilter: string) {
        filter = newFilter;
        document.documentElement.style.filter = filter;
        localStorage.setItem('filter', filter);
        
        let filterMessage;
        switch (filter) {
            case 'none': filterMessage = 'None'; break;
            case 'url(#protanopia)': filterMessage = 'Red'; break;
            case 'url(#deuteranopia)': filterMessage = 'Green'; break;
            case 'url(#tritanopia)': filterMessage = 'Blue'; break;
        }
        
        createLogEntry({
            type: 'Information',
            message: `Filter changed to: ${filterMessage}`
        });
    }

    //Logs when the LightSwitch (light/dark mode) is toggled
    function logLightSwitch() {
        createLogEntry({
            type: 'Information',
            message: 'Lightmode / Darkmode was Switched.' 
        }); 
    }
    
    //Opens GitHub repository link in a new browser tab
    function openGit() {
        window.open('https://github.com/Azaze7/CS4311_INFILTR8_6TheNine-Bytes_Fall2024', '_blank');
    }
    
    //Loads saved settings (font size and color filter) when component loads
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

<!--Main container for the settings layout-->
<div class="container h-full mx-auto flex justify-center items-center">
    <div class="space-y-10 text-center flex flex-col items-center">
        <!--Page title-->
        <h2 class="text-3xl font-bold">Fonts, Accommodations, & More</h2>
        <figure>
            <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
                <!--Breathing animation styling for the tool image-->
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
                      0%, 100% { transform: scale(1); }
                      50% { transform: scale(1.05); }
                    }
                  
                    @keyframes move {
                      0% { top: 8px; right: 8px; }
                      50% { top: 9px; right: 9px; }
                      100% { top: 8px; right: 8px; }
                    }
                </style> 

                <!--Animated tool image-->
                <img src="src/Tools.png" alt="Wireframe Tools" class="w-80 h-80 absolute top-2 right-2 breathing">

                <!--Font size adjustment buttons-->
                <div class="mt-4 flex items-center gap-4">
                    <span class="text-gray-400">Change Font Size:</span>
                    <button class="bg-indigo-500 text-white px-2 py-1 rounded" on:click={() => changeFontSize(false)}>-</button>
                    <span class="text-gray-300">{fontSize}px</span>
                    <button class="bg-indigo-500 text-white px-2 py-1 rounded" on:click={() => changeFontSize(true)}>+</button>
                </div>

                <!--Colorblind filter selection buttons-->
                <div class="mt-4 flex items-center gap-4">
                    <span class="text-gray-400">Colorblind Filters:</span>
                    <button class="bg-indigo-500 text-white px-2 py-1 rounded" on:click={() => applyFilter('none')}>None</button>
                    <button class="bg-indigo-500 text-white px-2 py-1 rounded" on:click={() => applyFilter('url(#protanopia)')}>Red</button>
                    <button class="bg-indigo-500 text-white px-2 py-1 rounded" on:click={() => applyFilter('url(#deuteranopia)')}>Green</button>
                    <button class="bg-indigo-500 text-white px-2 py-1 rounded" on:click={() => applyFilter('url(#tritanopia)')}>Blue</button>
                </div>

                <!--Toggle switch for light/dark mode-->
                <div class="mt-4 flex items-center gap-2 ">
                    <span class="mr-2 text-gray-400">Lightmode / Darkmode:</span>
                    <LightSwitch on:click={logLightSwitch}/>
                </div>
            </div>
        </figure>

        <!--Button to open GitHub repository-->
        <div class="flex items-center gap-4">
            <span class="text-gray-400">See INFILTR8 on:</span>
            <button class="bg-indigo-500 text-white px-4 py-2 rounded" on:click={() => openGit()}>GitHub</button>
        </div>
    </div>
</div>

<!--SVG filters for colorblind settings-->
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
    <filter id="protanopia">
        <feColorMatrix type="matrix" values="0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0"/>
    </filter>
    <filter id="deuteranopia">
        <feColorMatrix type="matrix" values="0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0"/>
    </filter>
    <filter id="tritanopia">
        <feColorMatrix type="matrix" values="0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0 0.475 0.525 0 0 0 0 1 0"/>
    </filter>
</svg>