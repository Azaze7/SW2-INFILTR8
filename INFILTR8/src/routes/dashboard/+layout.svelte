<script lang="ts">
    import '/src/app.postcss';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { get, writable } from 'svelte/store';
    import { user } from "$lib/components/loginUI/userStore";
    import type { PopupSettings } from '@skeletonlabs/skeleton';
    import { projectFolders } from '$lib/stores/projectFoldersStore';
    import SvgSpinnersBlocksWave from "$lib/components/icons/SvgSpinnersBlocksWave.svelte"; 
    import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';    
    import { popup, storePopup, LightSwitch, storeHighlightJs, AppRail, AppRailTile, AppRailAnchor, AppShell, AppBar } from '@skeletonlabs/skeleton';
    import { initializeStores, Drawer, getDrawerStore } from '@skeletonlabs/skeleton';

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

    // Drawer open function
    function drawerOpen(): void {
        drawerStore.open({});
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
</script>

<Drawer>
    <div slot="default" class="p-4 w-64 h-full bg-surface-500">
        <AppRail>
            <svelte:fragment slot="lead">
                <AppRailAnchor href="/dashboard" selected={currentPath === '/dashboard'}>
                    <div class="icon-container"><SvgSpinnersBlocksWave/></div>Dashboard
                </AppRailAnchor>
            </svelte:fragment>
            <!-- Project Manager -->
            <AppRailAnchor href="/ProjectManager" selected={currentPath === '/ProjectManager'}>ProjectManager</AppRailAnchor>
            <!-- Analysis -->
            <AppRailAnchor href="/analysis" selected={currentPath === '/analysis'}>Analysis</AppRailAnchor>
            <!-- Reports -->
            <AppRailAnchor href="/Testing" selected={currentPath === '/Report'}>Reports</AppRailAnchor>
            <svelte:fragment slot="trail">
                <!-- Page Settings -->
                <AppRailAnchor href="/pagesettings" selected={currentPath === '/pagesettings'}>Settings</AppRailAnchor>
                <!-- Support -->
                <AppRailAnchor href="/" target="_blank" title="Account">(icon)</AppRailAnchor>
            </svelte:fragment>
        </AppRail>
    </div>
</Drawer>

<AppShell>
    <!-- Header -->
    <svelte:fragment slot="header">
        <AppBar>
            <svelte:fragment slot="lead">
                <!-- Hamburger Button to Open Drawer -->
                <button class="btn btn-sm variant-ghost-surface" on:click={drawerOpen}>☰</button>
                <strong class="text-xl uppercase">
                    <p>{greeting} {$user?.username}</p>
                </strong>
            </svelte:fragment>
            <svelte:fragment slot="trail">
                <LightSwitch/>
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
                    
                <a class="btn btn-sm variant-ghost-surface" href="/" target="_blank" rel="noreferrer">
                    Sign out
                </a>
            </svelte:fragment>
        </AppBar>
    </svelte:fragment>

    <!-- Page Header -->
    <svelte:fragment slot="pageHeader">
        <h1 class="text-2xl font-bold mb-4">Select Project Folder</h1>
        <div class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto px-4 py-2 bg-surface-200 rounded-md shadow-sm">
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

    <!-- Page Route Content -->
    <slot />
</AppShell>

<style>
    .icon-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px; 
        width: 50px;
        margin: 0 auto;
    }
</style>