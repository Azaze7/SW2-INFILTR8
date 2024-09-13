<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<script>
    import Homepage from "../../../img/home.svg"
    import person from "../../../img/person.svg"

</script>
<div class="sidebar">
    <div class="item">
        <span class="title">MAIN</span>
        <a href="/" class="listItem">
            <img src={Homepage} alt="Home"> <!--Home Icon-->
            <span class="listItemTitle">Home</span>
        </a>
        <a href="/" class="listItem">
            <img src={person} alt="Profile"> <!--Home Icon-->
            <span class="listItemTitle">Profile</span>
        </a>
    </div>
    <div class="item">
        <span class="title">List</span>
        <a href="/" class="listItem">
            <img src={Homepage} alt="Home"> <!--Home Icon-->
            <span class="listItemTitle">Home</span>
        </a>
        <a href="/" class="listItem">
            <img src={Homepage} alt="Profile"> <!--Home Icon-->
            <span class="listItemTitle">Profile</span>
        </a>
        <a href="/" class="listItem">
            <img src={Homepage} alt="Profile"> <!--Home Icon-->
            <span class="listItemTitle">Profile</span>
        </a>
        <a href="/" class="listItem">
            <img src={Homepage} alt="Profile"> <!--Home Icon-->
            <span class="listItemTitle">Profile</span>
        </a>
    </div>
    <div class="item">
        <span class="title">General</span>
        <a href="/" class="listItem">
            <img src={Homepage} alt="Home"> <!--Home Icon-->
            <span class="listItemTitle">Home</span>
        </a>
        <a href="/" class="listItem">
            <img src={Homepage} alt="Profile"> <!--Home Icon-->
            <span class="listItemTitle">Profile</span>
        </a>
        <a href="/" class="listItem">
            <img src={Homepage} alt="Profile"> <!--Home Icon-->
            <span class="listItemTitle">Profile</span>
        </a>
        <a href="/" class="listItem">
            <img src={Homepage} alt="Profile"> <!--Home Icon-->
            <span class="listItemTitle">Profile</span>
        </a>
    </div>
    <div class="item">
        <span class="title">Maintence</span>
        <a href="/" class="listItem">
            <img src={Homepage} alt="Home"> <!--Home Icon-->
            <span class="listItemTitle">Home</span>
        </a>
        <a href="/" class="listItem">
            <img src={person} alt="Profile"> <!--Home Icon-->
            <span class="listItemTitle">Profile</span>
        </a>

        <a href="/" class="listItem">
            <img src={Homepage} alt="Home"> <!--Home Icon-->
            <span class="listItemTitle">Charts</span>
        </a>
        <a href="/" class="listItem">
            <img src={person} alt="Profile"> <!--Home Icon-->
            <span class="listItemTitle">Logs</span>
        </a>
    </div>
    <div class="item">
        <span class="title">Analytics</span>
        <a href="/" class="listItem">
            <img src={Homepage} alt="Home"> <!--Home Icon-->
            <span class="listItemTitle">Charts</span>
        </a>
        <a href="/" class="listItem">
            <img src={person} alt="Profile"> <!--Home Icon-->
            <span class="listItemTitle">Logs</span>
        </a>


        <a href="/" class="listItem">
            <img src={Homepage} alt="Home"> <!--Home Icon-->
            <span class="listItemTitle">Charts</span>
        </a>
        <a href="/" class="listItem">
            <img src={person} alt="Profile"> <!--Home Icon-->
            <span class="listItemTitle">Logs</span>
        </a>

        <a href="/" class="listItem">
            <img src={Homepage} alt="Home"> <!--Home Icon-->
            <span class="listItemTitle">Charts</span>
        </a>
        <a href="/" class="listItem">
            <img src={person} alt="Profile"> <!--Home Icon-->
            <span class="listItemTitle">Logs</span>
        </a>

    </div>
</div>

<style>
    .sidebar {
        padding: 5px;
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



