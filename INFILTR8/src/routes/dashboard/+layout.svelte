<script lang="ts">
	import '/src/app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { AppRail, AppRailTile, AppRailAnchor } from '@skeletonlabs/skeleton';
	let currentTile: number = 0;
	// Highlight JS
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
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import SvgSpinnersBlocksWave from '$lib/components/icons/SvgSpinnersBlocksWave.svelte';
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
// Function to handle file uploads using XMLHttpRequest to track progress
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
</script>

<!-- App Shell -->
<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4">
	<!--Header-->
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase"><p>{greeting}</p></strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://discord.gg/EXqV7W8MtY"
					target="_blank"
					rel="noreferrer"
				>
					Discord
				</a>
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://twitter.com/SkeletonUI"
					target="_blank"
					rel="noreferrer"
				>
					Twitter
				</a>
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://github.com/skeletonlabs/skeleton"
					target="_blank"
					rel="noreferrer"
				>
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
                <AppRailAnchor href="/pagesettings" selected={currentPath === '/pagesettings'}>
                    (icon) Settings</AppRailAnchor>
                <!-- Support -->
                <AppRailAnchor href="/" target="_blank" title="Account">(icon)</AppRailAnchor>
            </svelte:fragment>
        </AppRail>
    </svelte:fragment>

    <!-- Page Header -->


    <!-- Page Route Content -->
    <slot />
</AppShell>

