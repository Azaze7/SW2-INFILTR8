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
        "To get started, navigate to the dashboard.<br><br>You can use the 'Go Back to Dashboard' button here on the Settings page, or use the sidebar on the left-side when on the site itself to get there.<br><br>The dashboard displays current information about a project, allows for the creation of new projects, syncing of projects, or the exporting of projects into appropriate file formats.",
        "The two sidebars are here to help you.<br><br>The left-side can be used to navigate around the site, whereas the right-side is used to assist in project creation and modification.",
        "Messages will show Analysts notifications about the system.<br><br>If a project finishes, or has elements of alarm, you can check them in Messages.",
        "Account will show information about the Analyst currently logged in.<br><br>This will ensure that the right person is currently using the INFILTR8 Software.",
        "Logs are created whenever something of substance happens while running INFILTR8. This includes logging in, logging off, processsing a file, creating a project, and more.<br><br>Logs can also be exported by the Analyst, if you'd like to.",
        "Additional assistance can be found on Team 6's GitHub Page.<br><br>https://github.com/Azaze7/CS4311_INFILTR8_6TheNine-Bytes_Fall2024"
    ];

    // Determine the greeting based on the time of day
    if (currentHour < 12) {
        greeting = "Good morning!";
    } else if (currentHour < 18) {
        greeting = "Good afternoon!";
    } else {
        greeting = "Good evening!";
    }

    //@ts-ignore
    function changeFontSize(increase) {
        fontSize += increase ? 1 : -1;
        document.documentElement.style.fontSize = `${fontSize}px`;
        //@ts-ignore
        localStorage.setItem('fontSize', fontSize);
    }

    //@ts-ignore
    function applyFilter(newFilter) {
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
        helpText.set(texts[$currentTextIndex]);
    }

    function prevText() {
        currentTextIndex.update(n => (n - 1 + texts.length) % texts.length);
        helpText.set(texts[$currentTextIndex]);
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
		<h2 class="h2">Fonts, Accommodations, & More</h2>
		<figure>
			<div class="card">
				
            	<div class="font-size-controls">
                    <label class="gray-text">Change Font Size:</label>                
                	<button on:click={() => changeFontSize(false)}>-</button>
                	<span>{fontSize}px</span>
                	<button on:click={() => changeFontSize(true)}>+</button>
				</div>
            	<div class="colorblind-filters">
                <label>Colorblind Filters:</label>
                	<button on:click={() => applyFilter('none')}>None</button>
                	<button on:click={() => applyFilter('url(#protanopia)')}>Red</button>
                	<button on:click={() => applyFilter('url(#deuteranopia)')}>Green</button>
                	<button on:click={() => applyFilter('url(#tritanopia)')}>Blue</button>
            	</div>
				<div class="help-manual">
					<label>Help/Manual:</label>
					<button class="help-button" on:click={toggleHelp}>?</button>
				</div>
                <div class="lightmode-control flex items-center">
                    <label class="mr-2">Lightmode / Darkmode:  </label>
                    <LightSwitch />
                </div>
                                    
			</div>
			{#if $showHelp}
        	<div class="help-box">
            <button class="close-button" on:click={toggleHelp}>X</button>
            <div class="help-content">
                <h3><span class="purple-text">INFI</span>LTR8 Manual</h3>
                <p>{@html $helpText}</p>
                <div class="navigation-arrows">
                    <button class="arrow-button" on:click={prevText}>←</button>
                    <button class="arrow-button" on:click={nextText}>→</button>
                </div>
            </div>
        	</div>
       		{/if}
			<section class="img-bg" />
		</figure>
		<!-- / -->
		
            <div class="colorblind-filters">
                <label>See INFILTR8 on: </label>
                <button on:click={() => openGit()}>GitHub</button>
		</div>
		<div class="space-y-2">
	
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

<style lang="postcss">
	@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

    :root {
        --bg: #1d1b28;
        --color-main: #4628e9;
        --color-main-dark: #191528;
        --color-second: #aaa7b9;
        --transition: all .3s ease-out;
        --button-purple: #6a0dad;
        --purple: #6a0dad;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Poppins', sans-serif; /* Apply the Poppins font */
    }

    .grid-container {
        display: grid;
        grid-template-areas:
            "sidebar main";
        grid-template-columns: 250px 1fr;
        height: 100vh;
        font-family: 'Poppins', sans-serif;
    }

    .gray-text {
    color: gray; /* Gray color */
    }

    .hamburger-icon img {
        width: 20px;  /* Reduced size */
        height: 20px; /* Reduced size */
    }

    .sidebar {
        grid-area: sidebar;
        background-color: var(--bg);
        color: white;
        padding: 20px;
        display: flex;
        flex-direction: column;
    }

    .main-content {
        grid-area: main;
        padding: 30px;
        overflow-y: auto;
        background-color: var(--bg);
    }

    .controls {
        padding: 20px;
        background-color: var(--bg);
        color: rgb(151, 137, 219);
    }

    .purple-text {
        color: var(--purple);
    }

    .font-size-controls, .colorblind-filters, .help-manual {
        margin-top: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .dashboard-button {
        background-color: var(--button-purple);
        color: rgb(227, 8, 8);
        border: none;
        padding: 10px 20px;
        cursor: pointer;
        font-size: 18px;
        margin-bottom: 20px;
    }

    .dashboard-button:hover {
        background-color: var(--color-main-dark);
    }

    .font-size-controls label, .colorblind-filters label, .help-manual label {
        color: rgb(198, 40, 40);
    }

    .font-size-controls button, .colorblind-filters button, .help-button {
        background-color: var(--color-main);
        color: white;
        border: none;
        padding: 5px 10px;
        cursor: pointer;
    }

    .font-size-controls button:hover, .colorblind-filters button:hover, .help-button:hover {
        background-color: var(--color-main-dark);
    }

    .font-size-controls span {
        color: rgb(106, 94, 215);
    }

    .help-box {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: var(--bg);
        color: #ffffff;
        padding: 20px;
        border: 1px solid var(--color-main)
    }
.help-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.help-content {
    margin-top: 10px;
    text-align: center;
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
}

.navigation-arrows {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.arrow-button {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    margin-left: 10px;
}

.arrow-button:hover {
    color: var(--color-main);
}

@media (max-width: 1024px) {
    .grid-container {
        grid-template-areas:
            "sidebar main";
        grid-template-columns: 250px 1fr;
    }
}

	.img-bg {
		@apply absolute z-[-1] rounded-full blur-[50px] transition-all;
		animation:
			pulse 5s cubic-bezier(0, 0, 0, 0.5) infinite,
			glow 5s linear infinite;
	}
	@keyframes glow {
		0% {
			@apply bg-primary-400/50;
		}
		33% {
			@apply bg-secondary-400/50;
		}
		66% {
			@apply bg-tertiary-400/50;
		}
		100% {
			@apply bg-primary-400/50;
		}
	}
	@keyframes pulse {
		50% {
			transform: scale(1.5);
		}
	}
</style>