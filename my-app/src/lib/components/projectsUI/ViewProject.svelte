<!-- COPY THIS LAYOUT FOR YOUR COMPONENT -->
<!-- WE WILL FIND A BETTER WAY LATER -->

<script lang="ts">
   
    import TestSidebar from "$lib/components/dashboardUI/TestSidebar.svelte"
    import TestTopRight from "$lib/components/dashboardUI/TestTopRight.svelte"

    //just example ips for now
    let ipList: string[] = ['192.168.1.1', '192.168.1.2', '192.168.1.3'];
    let tests: string[] = ['Test 1', 'Test 2', 'Test 3'];

    //function to move item up on list
    //couldn't get the arrows to actually move the ip and tests up and down but will tomorrow
    function moveUp(index: number, listType: 'ip' | 'test'): void {
        if (listType === 'ip') {
            if (index > 0) {
                // Create a copy of the list and move the item
                ipList = [
                    ...ipList.slice(0, index - 1),
                    ipList[index],
                    ipList[index - 1],
                    ...ipList.slice(index + 1),
                ];
            }
        } else if (listType === 'test') {
            if (index > 0) {
                // Create a copy of the list and move the item
                tests = [
                    ...tests.slice(0, index - 1),
                    tests[index],
                    tests[index - 1],
                    ...tests.slice(index + 1),
                ];
            }
        }
    }
    function moveDown(index: number, listType: 'ip' | 'test'): void {
        if (listType === 'ip') {
            if (index < ipList.length - 1) {
                // Create a copy of the list and move the item
                ipList = [
                    ...ipList.slice(0, index),
                    ipList[index + 1],
                    ipList[index],
                    ...ipList.slice(index + 2),
                ];
            }
        } else if (listType === 'test') {
            if (index < tests.length - 1) {
                // Create a copy of the list and move the item
                tests = [
                    ...tests.slice(0, index),
                    tests[index + 1],
                    tests[index],
                    ...tests.slice(index + 2),
                ];
            }
        }
    }
</script>

<div class="grid-container">
    <aside class="sidebar">
        <TestSidebar />
    </aside>
    <main class="main-content">
        <!-- Your main content goes here -->
        <!-- svelte-ignore a11y-invalid-attribute -->
        <div class="logo"><a href="#"><span>My</span>Projects</a></div>
        
        <!--current project folder section-->
        <div class="section">
            <h2>Current project folder</h2>
            <button class="button">Open Project Folder</button>
        </div>

        <!--Ip list with moving up and down functionality-->
        <div class="section">
            <h2>Scope IP List</h2>
            <ul class="list">
                {#each ipList as ip, index}
                    <li>
                        {ip}
                        <button on:click={() => moveUp(index, 'ip')}>↑</button>
                        <button on:click={() => moveDown(index, 'ip')}>↓</button>
                    </li>
                {/each}
            </ul>
        </div>

        <!--Entry points allowed with analysis list and move up&down-->
        <div class="section">
            <h2>Entry Points Allowed</h2>
            <ul class="list">
                {#each tests as test, index}
                    <li>
                        {test}
                        <button on:click={() => moveUp(index,'test')}>↑</button>
                        <button on:click={() => moveDown(index,'test')}>↓</button>
                    </li>
                {/each}
            </ul>
        </div>

        <!-- Button to start analysis-->
         <div class="section">
            <button class="button">Start Analysis</button>
         </div>

        <!-- Load projects list-->
        <div class="section">
            <h2>Load Projects</h2>
            <ul class="list">
                <!--Need to replace with dynamic svelte list handling-->
                <li>Project A</li>
                <li>Project B</li>
            </ul>
        </div>


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
    //styling for myprojects page
    /* Right Side Section Styling */
    .right-side {
        grid-area: right;
        /*background-color: #f8f9fa;*/
        background-color: var(--bg);
        padding: 20px;
        box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
    }

    /*Section and List styling*/
    .section {
        margin-botton: 20px;
    }
    
    .list {
        list-style-type: none; /* removes default list styling */
        padding: 0;
    }

    .list li {
        margin-botton: 10px;
        background-color: #333;
        color: #fff;
        padding: 10px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .list button{
        margin-left: 10px;
        cursor: pointer;
    }

    .button {
        padding: 10px 20px;
        background-color: var(--color-main);
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 10px;
    }

    .button:hover {
        background-color: var(--color-main-dark);
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


