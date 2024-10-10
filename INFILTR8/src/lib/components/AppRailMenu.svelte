<script lang="ts">
    import { page } from '$app/stores';
    import { AppRail, AppRailTile, AppRailAnchor } from '@skeletonlabs/skeleton';
    // Reactive store value
    $: currentPath = $page.url.pathname;
</script>

<!-- AppRail Component -->
<AppRail>
    <svelte:fragment slot="lead">
        <AppRailAnchor href="/" selected={currentPath === '/'}>(icon) Home</AppRailAnchor>
    </svelte:fragment>
    <!--Analysis Page-->
    <AppRailAnchor href="/analysis" selected={currentPath === '/analysis'}>(icon) Analysis</AppRailAnchor>
    <!--Reports Page-->
    <AppRailAnchor href="/Report" selected={currentPath === '/Report'}>(icon) Settings</AppRailAnchor>
    <!--Settings Page-->
    <AppRailAnchor href="/pagesettings" selected={currentPath === '/pagesettings'}>(icon) Settings</AppRailAnchor>
    <svelte:fragment slot="trail">
        <AppRailAnchor href="/" target="_blank" title="Account">(icon)</AppRailAnchor>
    </svelte:fragment>
</AppRail>
