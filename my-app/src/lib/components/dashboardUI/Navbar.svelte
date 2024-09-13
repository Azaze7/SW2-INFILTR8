<head>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
</head>
<script>
    import notification from "../../../img/notifications.svg"
    import search from "../../../img/search.svg"
    import settings from "../../../img/settings.svg"
    import inbox from "../../../img/inbox.svg"
    import addFile from "../../../img/fileAdd.svg"
    import robot from "../../../img/robot.svg"

    // Reactive variable for the greeting
    /**
     * @type {string}
     */
    let greeting;

    // Function to determine the time of day
    function updateGreeting() {
        const hours = new Date().getHours();
        if (hours < 12) {
            greeting = 'Good Morning';
        } else if (hours < 18) {
            greeting = 'Good Afternoon';
        } else {
            greeting = 'Good Evening';
        }
    }

    // Call the function once when the component loads
    updateGreeting();


</script>
<div class="navbar">
    <div class="logo">
        <img src="" alt="INFILTR8"> <!--Insert LOGO HERE-->
        <span>{greeting}</span>
    </div>
    <div class="icons">
        <img src={search} alt="Search" class="icon"> <!--Search Icon-->
        <img src={inbox} alt="Inbox" class="icon"> <!--Another Icon-->
        <img src={addFile} alt="Expand" class="icon"> <!--Another Icon-->
        <div class="notification">
            <span class="material-symbols-outlined">
                notifications
                </span>
            <img src={notification} alt="Notification"> <!--Notification Icon-->
            <span>1</span>
        </div>
        <div class="user">
            <img src={robot} alt="Pic">
            <span>Name</span>
        </div>
        <img src={settings} alt="Settings" class="icon"> <!--Settings Icon-->
    </div>
</div>

<style>
    .navbar {
        width: 100%;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        background-color: #333;
    }

    .logo {
        display: flex;
        align-items: center;
        font-weight: bold;
        gap: 10px;
    }

    .icons {
        display: flex;
        align-items: center;
        gap: 20px;
    }

    

    .icons img{
        &:hover {
            cursor: pointer;
            background-color: lightcyan;
        }
    }

    .notification {
        position: relative;
    }

    .notification img {
        &:hover {
            cursor: pointer;
            background-color: lightcyan;
        }
    }

    .notification span {
        background-color: red;
        color: white;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        position: absolute;
        top: -10px;
        right: -10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
    }

    .user {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .user img {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        object-fit: cover;
        /*background-color: pink;*/
    }

</style>
