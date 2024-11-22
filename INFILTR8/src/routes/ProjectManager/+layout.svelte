<!-- The Backend Project Manager Page provides a centralized interface for 
 managing project folders. It features a sidebar for navigation between key 
 application sections like Dashboard, Analysis, and Logs. The page dynamically 
 fetches and displays project folders, allowing users to select a project and 
 navigate to its details. A user-specific greeting, based on the time of day, 
 is displayed in the sidebar. The layout uses Skeleton UI's `AppShell` for consistency 
 and includes responsive design elements to enhance user experience. The page 
 integrates navigation and state management for seamless interaction. -->
<script lang="ts">
    //import necessary styles and modules
    import '/src/app.postcss'; //custom postCSS styles
    import { writable } from 'svelte/store'; //writable store for reactive variables
    import { goto } from '$app/navigation'; //navigation helper for routing
    import { user } from "$lib/components/loginUI/userStore"; //user store for user details
    import { projectFolders } from '$lib/stores/projectFoldersStore'; //store for proj folders
    import Sidebar from '$lib/components/AceternityUI/Sidebar/Sidebar.svelte'; //sidebar component
    import SidebarLink from '$lib/components/AceternityUI/Sidebar/SidebarLink.svelte'; //sidebar link component
    import { AppShell } from '@skeletonlabs/skeleton';
    import { ArrowLeft, Home, FolderRoot, FlaskConical, Clipboard, Scroll, Settings, BadgeHelp } from 'lucide-svelte'; //icon imports
    //greeting for time of day
    let greeting = '';
    let currentHour = new Date().getHours();
    let selectedProject = writable('');

    // Determine the greeting
    if (currentHour < 12) {
        greeting = 'Good morning!';
    } else if (currentHour < 18) {
        greeting = 'Good afternoon!';
    } else {
        greeting = 'Good evening!';
    }

    // Handle project selection
    function selectProject(folder: string) {
        selectedProject.set(folder);
        console.log('Selected Project:', folder);
        goto(`/ProjectManager?project=${encodeURIComponent(folder)}`);
    }

    // Reactive value for project folders
    $: folders = $projectFolders;

    const links = [
        { label: 'Dashboard', href: '/dashboard', icon: Home },
        { label: 'Project Manager', href: '/ProjectManager', icon: FolderRoot },
        { label: 'Analysis', href: '/analysis', icon: FlaskConical },
        { label: 'Reports', href: '/Report', icon: Clipboard },
        { label: 'Logs', href: '/Logs', icon: Scroll },
        { label: 'Settings', href: '/pagesettings', icon: Settings },
        { label: 'Support', href: '/support', icon: BadgeHelp }
    ];
</script>

<AppShell>
    <!-- Page Header -->
    <svelte:fragment slot="pageHeader">
        <header class="flex justify-between p-4">
            <h1 class="text-2xl font-bold mb-4">Current Project</h1>
        </header>
    </svelte:fragment>

    <!-- Sidebar -->
    <svelte:fragment slot="sidebarLeft">
        <div class="rounded-md flex flex-col md:flex-row bg-[#111827] w-full flex-1 max-w-7xl mx-auto border border-[#111827] overflow-hidden h-full">
            <Sidebar class="justify-between gap-10">
                <div class="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                    <div class="font-normal flex space-x-2 items-center text-sm text-white py-1">
                        <div class="h-5 w-5 bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm"></div>
                        <span class="font-medium text-white whitespace-pre">
                            <p>{greeting}{" "}{$user?.username}</p>
                        </span>
                    </div>

                    <div class="mt-8 flex flex-col gap-2">
                        {#each links as link}
                            <SidebarLink {link} />
                        {/each}
                    </div>
                </div>

                <SidebarLink link={{ label: 'Sign Out', href: '/Login', icon: ArrowLeft }} />
            </Sidebar>
        </div>
    </svelte:fragment>

 <!-- Main Content Slot -->
 <main class="overflow-x-auto space-y-4 p-4">
    <slot />
</main>

<!-- Footer -->
<!---<footer class="flex justify-between p-4 bg-gray-200">
    <p>&copy; 2024 Your Company</p>
</footer>-->
</AppShell>

<style>
    /* Style adjustments for unified appearance */
    .text-2xl { font-size: 1.5rem; }
    .rounded-md { border-radius: 8px; }
</style>

