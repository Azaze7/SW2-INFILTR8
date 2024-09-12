<div class="navbar">
    <div class="logo">
        <img src="" alt="INFILTR8"> <!--Insert LOGO HERE-->
        <span>Name1</span>
    </div>
    <div class="icons">
        <img src="" alt="Search" class="icon"> <!--Search Icon-->
        <img src="" alt="App" class="icon"> <!--Another Icon-->
        <img src="" alt="Expand" class="icon"> <!--Another Icon-->
        <div class="notification">
            <img src="" alt="Notification"> <!--Notification Icon-->
            <span>1</span>
        </div>
        <div class="user">
            <img src="" alt="Pic">
            <span>Name1</span>
        </div>
        <img src="" alt="Settings" class="icon"> <!--Settings Icon-->
    </div>
</div>

<style>
    .navbar {
        width: 100%;
        padding: 20px;
        display: flex;
        justify-content: space-between;
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

    .notification {
        position: relative;
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
        background-color: pink;
    }
</style>