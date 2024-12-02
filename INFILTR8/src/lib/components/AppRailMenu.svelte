<!-- The AppRailMenu Component serves as the primary navigation bar for the INFILTR8 application, 
   providing users with quick access to key sections such as Home, Analysis, Reports, and 
   Settings. It leverages the `AppRail` and related components from the Skeleton framework 
   to create an intuitive and visually appealing menu. The `currentPath` reactive store 
   dynamically highlights the active page based on the user's navigation, ensuring a seamless 
   user experience. The component also includes a customizable "trail" section for additional 
   options like account management links. -->
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
