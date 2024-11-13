<script lang="ts">
    import '/src/app.postcss';
    import { page } from '$app/stores';
    import { writable } from 'svelte/store';
    import { user } from "$lib/components/loginUI/userStore";
    import type { PopupSettings } from '@skeletonlabs/skeleton';
    import { projectFolders } from '$lib/stores/projectFoldersStore';
    import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';    
    import { storePopup, storeHighlightJs, AppShell } from '@skeletonlabs/skeleton';
    import { initializeStores, getDrawerStore } from '@skeletonlabs/skeleton';
    import { ArrowLeft, Home, Settings, FlaskConical, FolderRoot, Clipboard, BadgeHelp, Scroll } from "lucide-svelte";
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
        { label: "Logs", href: "/Logs", icon: Scroll },
        { label: "Settings", href: "/pagesettings", icon: Settings },
        { label: "Support", href: "/support", icon: BadgeHelp } 
    ];

    // State for the notification dropdown
    let showNotifications = false;

    // Sample notifications (you can customize or fetch these from a store)
    const notifications = [
        { id: 1, message: "Notification error: Target IP '10.0.0.2' not found.", time: "4.6.2019 | 13:44" },
        { id: 2, message: "File updated: cyber..Dependencies.pcap", time: "4.6.2019 | 13:44" },
        { id: 3, message: "Error message: Target files are missing!", time: "4.6.2019 | 13:44" },
    ];
</script>

<style>
    .bell-icon {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 24px;
        height: 24px;
        cursor: pointer;
        fill: #ffffff;
    }
    .notification-dropdown {
        position: absolute;
        top: 50px;
        right: 20px;
        background-color: #1f2937;
        color: #ffffff;
        border: 1px solid #374151;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        width: 300px;
        max-height: 400px;
        overflow-y: auto;
        z-index: 1000;
    }
    .notification-item {
        padding: 10px 15px;
        border-bottom: 1px solid #374151;
        cursor: pointer;
    }
    .notification-item:last-child {
        border-bottom: none;
    }
    .notification-item:hover {
        background-color: #374151;
    }
</style>

<AppShell>
    <!-- Bell Icon (SVG) as a Button -->
    <button class="bell-icon" on:click={() => (showNotifications = !showNotifications)}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            aria-label="Notifications"
        >
            <path d="M12 2C10.34 2 9 3.34 9 5v2.07C6.72 7.57 5 9.64 5 12v5l-1 1v1h16v-1l-1-1v-5c0-2.36-1.72-4.43-4-4.93V5c0-1.66-1.34-3-3-3zM12 23c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z" />
        </svg>
    </button>

    <!-- Notification Dropdown -->
    {#if showNotifications}
        <div class="notification-dropdown">
            {#each notifications as notification}
                <div class="notification-item" on:click={() => console.log(`Notification ${notification.id} clicked`)}>
                    <p>{notification.message}</p>
                    <small>{notification.time}</small>
                </div>
            {/each}
        </div>
    {/if}

    <!-- Sidebar and Project Folder Section -->
    <svelte:fragment slot="sidebarRight">
        <h1 class="text-2xl font-bold mb-4">Current Project Folder</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4 py-2 rounded-md shadow-sm">
            {#each $projectFolders as folder, index}
                <button 
                    class="card py-4 px-6 w-full text-center cursor-pointer hover:bg-primary-100 rounded-md shadow transition duration-300"
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
        <div class="rounded-md flex flex-col md:flex-row bg-[#111827] w-full flex-1 max-w-7xl mx-auto border border-[#111827] overflow-hidden h-full">
            <Sidebar class="justify-between gap-10">
                <div class="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                    {#if $vopen}
                        <a href="/" class="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20">
                            <div class="h-5 w-5 bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0"></div>
                            <span class="font-medium text-white whitespace-pre">
                                <p>{greeting}{" "}{$user?.username}</p>
                            </span>
                        </a>
                    {:else}
                        <a href="/" class="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20">
                            <div class="h-5 w-5 bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0"></div>
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