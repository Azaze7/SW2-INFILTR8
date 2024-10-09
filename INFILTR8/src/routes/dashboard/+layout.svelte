<script lang="ts">
    import '/src/app.postcss';
    import { goto } from '$app/navigation'; // Import goto for programmatic navigation
    import { AppShell, AppBar } from '@skeletonlabs/skeleton';
    import { AppRail, AppRailTile, AppRailAnchor } from '@skeletonlabs/skeleton';
    import { page } from '$app/stores';
    import { user } from "$lib/components/loginUI/userStore"; // Correctly import the user store from the separate store file  
    import { writable } from 'svelte/store'; // Import writable store for upload progress
    import SvgSpinnersBlocksWave from "$lib/components/icons/SvgSpinnersBlocksWave.svelte"; 

    let currentTile: number = 0;

    // Reactive store value
    $: currentPath = $page.url.pathname;

    // Highlight JS imports
    import hljs from 'highlight.js/lib/core';
    import 'highlight.js/styles/github-dark.css';
    import { storeHighlightJs } from '@skeletonlabs/skeleton';
    import xml from 'highlight.js/lib/languages/xml'; // for HTML
    import css from 'highlight.js/lib/languages/css';
    import javascript from 'highlight.js/lib/languages/javascript';
    import typescript from 'highlight.js/lib/languages/typescript';

    hljs.registerLanguage('xml', xml); // for HTML
    hljs.registerLanguage('css', css);
    hljs.registerLanguage('javascript', javascript);
    hljs.registerLanguage('typescript', typescript);
    storeHighlightJs.set(hljs);

    // Floating UI for Popups
    import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
    import { storePopup } from '@skeletonlabs/skeleton';
    storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

    let greeting = "";
    let currentHour = new Date().getHours();

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

    // Function to handle file uploads
    async function uploadFiles() {
        if (files.length === 0) {
            console.error("No files selected for upload");
            return;
        }

        const formData = new FormData();
        files.forEach(file => formData.append('files[]', file));

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
                onUploadProgress: (event) => {
                    const percentCompleted = Math.round((event.loaded * 100) / event.total);
                    uploadProgress.set(percentCompleted);
                }
            });

            if (response.ok) {
                console.log('Files uploaded successfully');
                uploadProgress.set(100); 
            } else {
                console.error('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    }
</script>

<!-- App Shell -->
<AppShell slotSidebarLeft="bg-surface-500/5 w-60 p-4">
    <!-- Header -->
    <svelte:fragment slot="header">
        <AppBar>
            <svelte:fragment slot="lead">
                <strong class="text-xl uppercase">
                    <p>{greeting}{" "}{$user?.username}</p>
                </strong>
            </svelte:fragment>
            <svelte:fragment slot="trail">
                <a class="btn btn-sm variant-ghost-surface" href="https://discord.gg/EXqV7W8MtY" target="_blank" rel="noreferrer">
                    Discord
                </a>
                <a class="btn btn-sm variant-ghost-surface" href="https://twitter.com/SkeletonUI" target="_blank" rel="noreferrer">
                    Twitter
                </a>
                <a class="btn btn-sm variant-ghost-surface" href="https://github.com/skeletonlabs/skeleton" target="_blank" rel="noreferrer">
                    GitHub
                </a>
            </svelte:fragment>
        </AppBar>
    </svelte:fragment>

    <!-- Sidebar Left -->
    <svelte:fragment slot="sidebarLeft">
        <AppRail>
            <svelte:fragment slot="lead">
                <AppRailAnchor href="/" selected={currentPath === '/'}>
                    <div class="icon-container">
                        <SvgSpinnersBlocksWave/>
                    </div>
                    Dashboard
                </AppRailAnchor>
            </svelte:fragment>
            <!-- Analysis -->
            <AppRailAnchor href="/analysis" selected={currentPath === '/analysis'}>
                (icon)
                Analysis
            </AppRailAnchor>
            <!-- Project Manager -->
            <AppRailAnchor href="/ProjectManager" selected={currentPath === '/ProjectManager'}>
                (icon)
                ProjectManager
            </AppRailAnchor>
            <!-- Testing -->
            <AppRailAnchor href="/Testing" selected={currentPath === '/Testing'}>
                (icon)
                Testing
            </AppRailAnchor>
            <svelte:fragment slot="trail">
                <!-- Page Settings -->
                <AppRailAnchor href="/pagesettings" selected={currentPath === '/pagesettings'}>(icon) Settings</AppRailAnchor>
                <!-- Support -->
                <AppRailAnchor href="/" target="_blank" title="Account">(icon)</AppRailAnchor>
            </svelte:fragment>
        </AppRail>
    </svelte:fragment>

    <!-- Page Header -->
    <svelte:fragment slot="pageHeader">
        <!-- Display upload progress in the header -->
        <div class="flex items-center space-x-4">
            <p>Uploading Files: </p>
            <progress max="100" value={$uploadProgress}></progress>
            <p>{$uploadProgress}%</p>
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
        height: 100px;
        width: 100px;
        margin: 0 auto;
    }
</style>
