<script lang="ts">
    import '/src/app.postcss';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { get, writable } from 'svelte/store';
    import { user } from "$lib/components/loginUI/userStore";
    import type { PopupSettings, DrawerSettings } from '@skeletonlabs/skeleton';
    import { projectFolders } from '$lib/stores/projectFoldersStore';
    import SvgSpinnersBlocksWave from "$lib/components/icons/SvgSpinnersBlocksWave.svelte"; 
    import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';    
    import { popup, storePopup, LightSwitch, storeHighlightJs, AppRail, AppRailTile, AppRailAnchor, AppShell, AppBar,  } from '@skeletonlabs/skeleton';
    import { initializeStores, Drawer, getDrawerStore, } from '@skeletonlabs/skeleton';
    import { ArrowLeft, Bolt, Home, Settings, UserCircle2, Squircle, FlaskConical, FolderRoot, Clipboard, BadgeHelp, Scroll} from "lucide-svelte";
    import { slide } from "svelte/transition";
    
    import Sidebar from '$lib/components/AceternityUI/Sidebar/Sidebar.svelte';
    import SidebarLink from '$lib/components/AceternityUI/Sidebar/SidebarLink.svelte';
    import { vopen } from '$lib/stores/svelteContent';
 



    // Highlight JS imports
    import 'highlight.js/styles/github-dark.css';
    import hljs from 'highlight.js/lib/core';
    import xml from 'highlight.js/lib/languages/xml'; 
    import css from 'highlight.js/lib/languages/css';
    import javascript from 'highlight.js/lib/languages/javascript';
    import typescript from 'highlight.js/lib/languages/typescript';

    hljs.registerLanguage('xml', xml); // for HTML
    hljs.registerLanguage('css', css);
    hljs.registerLanguage('javascript', javascript);
    hljs.registerLanguage('typescript', typescript);
    storeHighlightJs.set(hljs);
    
    initializeStores();
    const drawerStore = getDrawerStore();

    let greeting = "";
    let currentTile: number = 0;
    let currentHour = new Date().getHours();
    storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
    $: currentPath = $page.url.pathname;

    // Determine the greeting based on the time of day
    if (currentHour < 12) {
        greeting = "Good morning!";
    } else if (currentHour < 18) {
        greeting = "Good afternoon!";
    } else {
        greeting = "Good evening!";
    }

    // Function to navigate to analysis page
    const navigateToAnalysis = () => {
        console.log("Navigating to /analysis");
        goto('/analysis');
    };

    let username = '';

    // File upload logic
    let files: File[] = [];
    let uploadProgress = writable(0); // Store to track the upload progress percentage


    const AccountPopup: PopupSettings = {
        event: 'click',
        target: 'AccountPopup',
        placement: 'bottom',
    };

    const NotificationPopup: PopupSettings = {
        event: 'click',
        target: 'NotificationPopup',
        placement: 'bottom',
    };

function selectProject(folder: string) {
        console.log('Selected Project:', folder);
    }

    // Reactive value for folders
    $: folders = $projectFolders;

    // AceternityUI Sidebar
    interface LinkItem {
        label: string;
        href: string;
        icon: any;
    }

    const links: LinkItem[] = [
        { label: "Dashboard", href: "/dashboard", icon: Home },
        { label: "Project Manager", href: "/ProjectManager", icon: FolderRoot },
        { label: "Analysis", href: "/analysis", icon: FlaskConical },
        { label: "Reports", href: "/Report", icon: Clipboard },
        { label: "Logs", href: "/Logs", icon: Scroll },
        { label: "Settings", href: "/pagesettings", icon: Settings },
        { label: "Support", href: "/support", icon: BadgeHelp} 
        
    ];
  
</script>

<!-- App Shell -->
<AppShell>
 


    <!-- Page Header -->
    <svelte:fragment slot="pageHeader">
        <h1 class="text-2xl font-bold mb-4">Settings</h1>
    </svelte:fragment>

    <!-- Sidebar with Drawer -->
    <svelte:fragment slot="sidebarLeft">
        <div
            class="rounded-md flex flex-col md:flex-row bg-[#111827] w-full flex-1 max-w-7xl mx-auto border border-[#111827] overflow-hidden h-full"
        >
            <Sidebar class="justify-between gap-10">
                <div class="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                    {#if $vopen}
                        <a
                            href="/"
                            class="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20"
                        >
                            <div
                                class="h-5 w-5 bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0"
                            ></div>
                            <span class="font-medium text-white whitespace-pre">
                                <p>{greeting}{" "}{$user?.username}</p>
                            </span>
                        </a>
                    {:else}
                        <a
                            href="/"
                            class="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20"
                        >
                            <div
                                class="h-5 w-5 bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0"
                            ></div>
                        </a>
                    {/if}
                    <div class="mt-8 flex flex-col gap-2">
                        {#each links as link}
                          <SidebarLink {link} />
                        {/each}
                    </div>
                </div>
                <div>
                    
                    <SidebarLink
                        link={{
                          label: "Sign Out",
                          href: "/Login",
                          icon: ArrowLeft,
                        }}
                    />
                </div>    
            </Sidebar>
        </div>
    </svelte:fragment>





    <!-- Page Route Content -->
    <slot />
</AppShell>