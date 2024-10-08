<script lang="ts">
	import '../../app.postcss';
	import { AppShell, AppBar, LightSwitch } from '@skeletonlabs/skeleton';
	import { AppRail, AppRailTile, AppRailAnchor } from '@skeletonlabs/skeleton';
	let currentTile: number = 0;
	import { page } from '$app/stores';
	import { FileDropzone } from '@skeletonlabs/skeleton';
	// Highlight JS
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import xml from 'highlight.js/lib/languages/xml'; // for HTML
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';

	// Christian R Imports
	import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';

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




	const AccountPopUp: PopupSettings = {
		// Represents the type of event that opens/closed the popup
		event: 'click',
		// Matches the data-popup value on your popup element
		target: 'AccountPopUp',
		// Defines which side of your trigger the popup will appear
		placement: 'bottom',
	};

	const NotificationPopUp: PopupSettings = {
		// Represents the type of event that opens/closed the popup
		event: 'click',
		// Matches the data-popup value on your popup element
		target: 'NotificationPopUp',
		// Defines which side of your trigger the popup will appear
		placement: 'bottom',
	};
					

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
				<section class="p-4">
					<LightSwitch />
				</section>
				<button class="btn btn-sm variant-ghost-surface" use:popup={NotificationPopUp}>Notifications</button>
				<div class="card p-4 w-72 shadow-xl" data-popup="NotificationPopUp">
					<div><p>Notification Details Here</p></div>
					<div class="arrow bg-surface-100-800-token" />
				</div>

				<button class="btn btn-sm variant-ghost-surface" use:popup={AccountPopUp}>Account</button>
				<div class="card p-4 w-72 shadow-xl" data-popup="AccountPopUp">
					<div><p>Account Details Here</p></div>
					<div class="arrow bg-surface-100-800-token" />
				</div>
					
		
				<a
					class="btn btn-sm variant-ghost-surface"
					href="/"
					target="_blank"
					rel="noreferrer"
				>
					Sign Out
				</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

		<!-- Sidebar Left -->
			<svelte:fragment slot="sidebarLeft">
				<AppRail>
					<svelte:fragment slot="lead">
						<AppRailAnchor href="../analysis" >(icon)</AppRailAnchor>
						<span>Analyze</span>
					</svelte:fragment>
					<!-- --- -->
					<AppRailTile bind:group={currentTile} name="tile-1" value={0} title="tile-1">
						<svelte:fragment slot="lead">(icon)</svelte:fragment>
						<AppRailAnchor href="/dashboard" ></AppRailAnchor>
						<span>Dashboard</span>
					</AppRailTile>
					<AppRailTile bind:group={currentTile} name="tile-2" value={1} title="tile-2">
						<svelte:fragment slot="lead">(icon)</svelte:fragment>
						<AppRailAnchor href="../projects" ></AppRailAnchor>
						<span>Projects</span>
					</AppRailTile>
					<AppRailTile bind:group={currentTile} name="tile-3" value={2} title="tile-3">
						<svelte:fragment slot="lead">(icon)
							<AppRailAnchor href="/" ></AppRailAnchor>
						</svelte:fragment>
						<span>Settings</span>
					</AppRailTile>
					<!-- --- -->
					<svelte:fragment slot="trail">
						<AppRailAnchor href="/" target="_blank" title="Account">(icon)</AppRailAnchor>
					</svelte:fragment>
				</AppRail>
			</svelte:fragment>

	
	<!-- Page Route Content -->
	<slot />
</AppShell>