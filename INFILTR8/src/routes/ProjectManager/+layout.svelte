<script lang="ts">
    import '/src/app.postcss';
    import { writable } from 'svelte/store';
    import { goto } from '$app/navigation';
    import { projectFolders } from '$lib/stores/projectFoldersStore';
    import Sidebar from '$lib/components/AceternityUI/Sidebar/Sidebar.svelte';
    import SidebarLink from '$lib/components/AceternityUI/Sidebar/SidebarLink.svelte';
    import { AppShell } from '@skeletonlabs/skeleton';
    import { ArrowLeft, Home, FolderRoot, FlaskConical, Clipboard, Scroll, Settings, BadgeHelp } from 'lucide-svelte';

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
    <svelte:fragment slot="pageHeader">
        <h1 class="text-2xl font-bold mb-4">Current Project</h1>
    </svelte:fragment>

    <svelte:fragment slot="sidebarLeft">
        <div class="rounded-md flex flex-col md:flex-row bg-[#111827] w-full flex-1 max-w-7xl mx-auto border border-[#111827] overflow-hidden h-full">
            <Sidebar class="justify-between gap-10">
                <div class="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                    <div class="font-normal flex space-x-2 items-center text-sm text-white py-1">
                        <div class="h-5 w-5 bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm"></div>
                        <span class="font-medium text-white">{greeting}</span>
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

    <slot />
</AppShell>

