<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<script>

	import Settings from "../../../img/settings.svg";
    import Homepage from "../../../img/home.svg";
    import person from "../../../img/person.svg";
</script>

<div class="sidebar">
    <div class="item">
        <span class="title">List</span>
        <a href="/dashboard/" class="listItem">
            <img src={Homepage} alt="Home"> <!--Home Icon-->
            <span class="listItemTitle">Dashboard</span>
        </a>
        <a href="/dashboard/project" class="listItem">
            <img src={Homepage} alt="Project Manager">
            <span class="listItemTitle">Project Manager</span>
        </a>
        
        <a href="/" class="listItem">
            <img src={Homepage} alt="Profile"> <!--Home Icon-->
            <span class="listItemTitle">Analysis</span>
        </a>
        <a href="/dashboard/reports" class="listItem">
            <img src={Homepage} alt="Profile"> <!--Home Icon-->
            <span class="listItemTitle">Reports</span>
        </a>

        <a href="/" class="listItem">
            <img src={Homepage} alt="Home"> <!--Home Icon-->
            <span class="listItemTitle">Charts</span>
        </a>
        <a href="/dashboard/logs" class="listItem">
            <img src={Homepage} alt="Profile"> <!--Home Icon-->
            <span class="listItemTitle">Logs</span>
        </a>

        <div class="item">
            <span class="title">MAIN</span>
            <a href="/settings" class="listItem">
                <img src={Settings} alt="settings"> <!--Home Icon-->
                <span class="listItemTitle">Settings</span>
            </a>
            <a href="/" class="listItem">
                <img src={person} alt="Profile"> <!--Home Icon-->
                <span class="listItemTitle">Support</span>
            </a>
        </div>

    </div>
</div>

<style>
    .sidebar {
        padding: 5px;
        height: 100vh;
    }

    .sidebar .item {
        display: flex;
        flex-direction: column;
        gap: 1px;
        margin-bottom: 20px;
    }

    .title {
        font-size: 12px;
        font-weight: 200;
        color: lightgray;
  
    }

    .listItem {

        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        border-radius: 5px;

    }

    .listItem:hover {
        background-color: blanchedalmond;

    }

    .item a span {
        font-weight: bold;
        font-size: small;
        color: white;
    }

    a {
        text-decoration: none;
    }

    a:hover {
        text-decoration: none; /* Ensure it doesn't appear on hover */
    }

</style>

