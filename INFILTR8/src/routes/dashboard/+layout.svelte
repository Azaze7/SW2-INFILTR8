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
    import { ArrowLeft, Bolt, Home, Settings, UserCircle2, Squircle, FlaskConical, FolderRoot, Clipboard, BadgeHelp} from "lucide-svelte";
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



    let username = '';

    // File upload logic
    let files: File[] = [];
    let uploadProgress = writable(0); // Store to track the upload progress percentage

    // Function to handle file uploads
    async function uploadFiles() { 
        if (files.length === 0) {
            console.error("No files selected for upload");
            return;
        }

        const formData = new FormData();
        files.forEach(file => formData.append('files[]', file));

        const xhr = new XMLHttpRequest();
        
        // Set up the progress event listener
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentCompleted = Math.round((event.loaded * 100) / event.total);
                uploadProgress.set(percentCompleted);
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log('Files uploaded successfully');
                uploadProgress.set(100); // Set to 100% on success
            } else {
                console.error('Upload failed');
            }
        };
        xhr.onerror = () => {
            console.error('Error uploading files');
        };
        xhr.open('POST', '/upload', true);
        xhr.send(formData);
    }

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

    // Function to handle project selection
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
        { label: "Settings", href: "/pagesettings", icon: Settings },
        { label: "Support", href: "/Login", icon: BadgeHelp} 
        
    ];
  



</script>





<AppShell>
    <!-- Header -->
<!--
        <svelte:fragment slot="header">
            <AppBar>
                <svelte:fragment slot="lead">
                   
                </svelte:fragment>
                <svelte:fragment slot="trail">
                    <button class="btn btn-sm variant-ghost-surface" use:popup={NotificationPopup}>Notification</button>
                    <div class="card p-4 w-72 shadow-xl" data-popup="NotificationPopup">
                        <div><p>Notification Content</p></div>
                        <div class="arrow bg-surface-100-800-token" />
                    </div>
                    
                    <button class="btn btn-sm variant-ghost-surface" use:popup={AccountPopup}>Account</button>
                    <div class="card p-4 w-72 shadow-xl" data-popup="AccountPopup">
                        <div><p>Account Content</p></div>
                        <div class="arrow bg-surface-100-800-token" />
                    </div>
                        
                    <a class="btn btn-sm variant-ghost-surface" href="/Login" target="_blank" rel="noreferrer">
                        Sign out
                    </a>
                </svelte:fragment>
            </AppBar>
        </svelte:fragment> -->


    <!-- Page Header -->
    <svelte:fragment slot="sidebarRight">
        <h1 class="text-2xl font-bold mb-4">Select Project Folder</h1>
        <div class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto px-4 py-2 rounded-md shadow-sm">
            {#each $projectFolders as folder, index}
                <button 
                    class="snap-start shrink-0 card py-4 px-6 w-40 md:w-60 text-center cursor-pointer hover:bg-primary-100 rounded-md shadow transition duration-300"
                    on:click={() => selectProject(folder)}
                    on:keydown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            selectProject(folder);
                        }
                    }}
                    aria-label={`Select project ${folder}`}
                >
                    {folder}
                </button>
            {/each}
        </div>
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


<style>

</style>