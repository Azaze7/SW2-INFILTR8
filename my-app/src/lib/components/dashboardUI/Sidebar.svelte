<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

<!---<script>
    /**
     * //@type {typeof import("svelte-navigator").Link}
     */
    //let Link;

    // Only import the Link component on the client side
    /*if (typeof window !== "undefined") {
        import("svelte-navigator").then((module) => {
            Link = module.Link;
        });
    }*/
</script>-->

<div class="sidebar">
    <div class="item">
        <span class="title">MAIN</span>
        <a href="/" class="listItem">
            <img src="" alt="Home"> <!--Home Icon-->
            <span class="listItemTitle">Home</span>
        </a>
        <a href="/" class="listItem">
            <img src="" alt="Profile"> <!--Home Icon-->
            <span class="listItemTitle">Profile</span>
        </a>

        <!--Need to get Link from svelteNavigator working
            Rather use this than a href
        
        {#if Linkk}
            <svelte:component this={Link} to="/">
                <img src="" alt="Home"> 
                <span class="listItemTitle">Home</span>
            </svelte:component>
            <svelte:component this={Link} to="/">
                <img src="" alt="Home"> 
                <span class="listItemTitle">Profile</span>
            </svelte:component>
        {/if}-->
    </div>
    <div class="item">
        <span class="title">MAIN</span>
        <a href="/" class="listItem">
            <img src="" alt="Home"> <!--Home Icon-->
            <span class="listItemTitle">Home</span>
        </a>
        <a href="/" class="listItem">
            <img src="" alt="Profile"> <!--Home Icon-->
            <span class="listItemTitle">Profile</span>
        </a>
    </div>
</div>

<style>
   
    .sidebar .item {
        /*background-color: pink;*/
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 20px;
    }

    .title {
        font-size: 12px;
        font-weight: 200;
        color: lightgray
    }

    .listItem{
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        border-radius: 5px;

        &:hover {
            background-color: blanchedalmond;
        }
    }
    
</style>



