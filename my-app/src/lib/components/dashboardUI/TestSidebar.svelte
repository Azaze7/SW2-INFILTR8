<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Responsive TestSidebar</title>

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');
        
        :root {
            --bg: #1d1b28;
            --color-main: #4628e9;
            --color-main-dark: #191528;
            --color-second: #aaa7b9;
            --transition: all .3s ease-out;
        }
        
        * {
            margin: 0;
            padding: 0;
        }
        
        *, ::before, ::after {
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            font-weight: 400;
            line-height: 1.5;
        }
        
        a {
            text-decoration: none;
            vertical-align: middle;
            color: var(--color-second);
        }
        
        ul {
            list-style: none;
        }
        
        .site {
            display: flex;
            flex-direction: row;
        }
        
        .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            width: 280px;
            background-color: var(--bg);
            display: flex;
            flex-direction: column;
            transition: var(--transition);
            -webkit-transition: var(--transition);
            overflow: hidden;
        }
        
        /* Brand / Logo section */
        .brand {
            height: 80px;
            padding: 25px;
            margin-right: 15px;
            border-bottom: 1px solid;
            border-color: var(--color-main-dark);
            display: flex;
            justify-content: space-between;
        }
        
        .brand :is(div.a) {
            display: flex;
            align-items: center;
        }
        
        .logo a {
            font-weight: 800;
            font-size: 1.5rem;
            color: white;
        }
        
        .logo span {
            color: var(--color-main)
        }
        
        .trigger ion-icon, nav a ion-icon:first-child {
            font-size: 20px;
        }
        
        .trigger [name="menu-outline"], .mininav .trigger [name='chevron-back-outline'] {
            display: none;
        }
        
        .mininav .trigger [name='menu-outline'] {
            display: block;
        }
        
        /* Navigation */
        nav {
            overflow-y: scroll;
            overflow-x: hidden;
            height: 80vh;
        }
        
        nav li a, .sign-out a {
            position: relative;
            padding: 15px 25px;
            display: flex;
            flex: 0 0 100%;
            align-items: center;
            transform: var(--transition);
            -webkit-transform: var(--transition);
        }
        
        nav li :is(a:hover, .active) {
            background-color: var(--color-main-dark);
        }
        
        nav li a > * {
            display: flex;
            align-items: center;
        }
        
        nav a ion-icon {
            flex-shrink: 0;
            transition: var(--transition);
            -webkit-transition: var(--transition);
        }
        
        nav a ion-icon:first-child {
            margin-right: 15px;
            color: #504a6e;
        }
        
        nav li a span {
            display: flex;
            flex-grow: 1;
            transform: var(--transition);
            -webkit-transform: var(--transition);
        }
        
        nav li a:hover, .collapse a span {
            color: white;
        }
        
        nav ul ul li a::before {
            content: '';
            width: 5px;
            height: 5px;
            background-color: var(--color-second);
            border-radius: 50%;
            margin: 0 15px;
        }
        
        nav li a:hover::before {
            background-color: var(--color-main);
        }
        
        nav :is(a:hover, .active) ion-icon:first-child,
        .trigger a:hover ion-icon {
            color: var(--color-main);
        }
        
        nav li.small {
            color: #504a6e;
            text-transform: uppercase;
            font-size: 10px;
            margin: 25px 25px 5px;
            letter-spacing: 2px;
        }
        
        
        /* Hide Submenu */
        nav li.has-child-collapse ul {
            max-height: 0;
            opacity: 0;
            /*visibility: hidden;
            overflow: hidden;*/
            transition: all .2s ease-out;
        }
        
        /* Show Submenu */
        nav li.collapse ul {
            max-height: 100vh;
            opacity: 1;
            visibility: visible;
            overflow: visible;
            transition: all .5s ease-in;
        }
        
        nav li.collapse ion-icon:last-child {
            transform: rotate(-90deg);
            -webkit-transform: rotate(-90deg);
        }
        
        
        /* Sing Out */
        .sign-out {
            display: flex;
            align-items: center;
        }
        
        /* Mini Nav */
        .mininav .sidebar {
            width: 70px;
        }
        
        .mininav :is(.logo, nav ul ul a) {
            display: none;
        }
        
        .mininav nav a *:not(ion-icon:first-child),
        .mininav nav .small {
            opacity: 0;
        }
        
        .mininav .main {
            padding-left: 70px;
        }
        
        /* Scroll Bar */
        nav::-webkit-scrollbar {
            width: 7px;
        }
        
        nav::-webkit-scrollbar-thumb {
            background-color: transparent;
        }
        
        nav:hover::-webkit-scrollbar-thumb {
            background-color: #4c4091;
        }
        
        </style>


</head>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const submenuLinks = document.querySelectorAll('.has-child-collapse > a');

        submenuLinks.forEach((menuLink) => {
            menuLink.addEventListener('click', function(e) {
                e.preventDefault(); // Prevent default anchor behavior
                
                // Get the parent 'li' element
                const parentLi = this.parentNode;

                // Toggle only the clicked submenu
                parentLi.classList.toggle('collapse');
            });
        });

        // Handle active link behavior
        const linkactive = document.querySelectorAll('nav li a'); // Update selector
        function linkbg() {
            // Remove 'active' class from all links
            linkactive.forEach(link => link.classList.remove('active'));

            // Add 'active' class to the clicked link
            this.classList.add('active');
        }

        // Add event listeners to all links
        linkactive.forEach(link => link.addEventListener('click', linkbg));

        const trigger = document.querySelector('.trigger a');
        const classadd = document.querySelector('.site');
        trigger.addEventListener('click', function() {
            classadd.classList.toggle('mininav');
        })
    });

    
</script>


<body>
    <div id="page" class="site">
        <div class="sidebar">
            <div class="brand">
                <div class="logo">
                    <!-- svelte-ignore a11y-invalid-attribute -->
                    <a href="#">
                        <span>INFI</span>LTR8
                    </a>
                </div>
                <div class="trigger">
                    <!-- svelte-ignore a11y-invalid-attribute -->
                    <!-- svelte-ignore a11y-missing-content -->
                    <a href="#">
                        <ion-icon name="menu-outline"></ion-icon>
                        <ion-icon name="chevron-back-outline"></ion-icon>
                    </a>
                </div>
            </div>
            <div class="navbar">
                <nav>
                    <ul>
                        <li>
                            <!-- svelte-ignore a11y-invalid-attribute -->
                            <a href="#">
                                <ion-icon name="grid-outline"></ion-icon>
                                <span>Dashboard</span>
                            </a>
                        </li>
                        <li class="has-child-collapse">
                            <!-- svelte-ignore a11y-invalid-attribute -->
                            <a href="#">
                                <ion-icon name="prism-outline"></ion-icon>
                                <span>Projects</span>
                                <ion-icon name="chevron-forward-outline"></ion-icon>
                            </a>
                            <ul>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#">My Projects</a></li>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#">Goals</a></li>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#">Budgets</a></li>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#">Files</a></li>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#">Settings</a></li>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#">Funds</a></li>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#">Security</a></li>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#">Referals</a></li>
                            </ul>
                        </li>
                        <li>
                            <!-- svelte-ignore a11y-invalid-attribute -->
                            <a href="#">
                                <ion-icon name="albums-outline"></ion-icon>
                                <span>Campaign</span>
                            </a>
                        </li>
                        <li class="small">Performance</li>
                        <li class="has-child-collapse">
                            <!-- svelte-ignore a11y-invalid-attribute -->
                            <a href="#">
                                <ion-icon name="pulse-outline"></ion-icon>
                                <span>Analytics</span>
                                <ion-icon name="chevron-forward-outline"></ion-icon>
                            </a>
                            <ul>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#">My Projects</a></li>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#">Goals</a></li>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#">Budgets</a></li>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#">Files</a></li>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#">Settings</a></li>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#">Funds</a></li>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#">Security</a></li>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#">Referals</a></li>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#">Referals</a></li>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#">Referals</a></li>
                            </ul>
                        </li>
                        <li class="has-child-collapse">
                            <!-- svelte-ignore a11y-invalid-attribute -->
                            <a href="#">
                                <ion-icon name="mail-unread-outline"></ion-icon>
                                <span>Message</span>
                                <ion-icon name="chevron-forward-outline"></ion-icon>
                            </a>
                            <ul>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#">Inobx</a></li>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#">Sent</a></li>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#">Starred</a></li>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#">Budgets</a></li>
                            </ul>
                        </li>
                        <li class="has-child-collapse">
                            <!-- svelte-ignore a11y-invalid-attribute -->
                            <a href="#">
                                <ion-icon name="person-circle-outline"></ion-icon>
                                <span>Account</span>
                                <ion-icon name="chevron-forward-outline"></ion-icon>
                            </a>
                            <ul>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#">Blog</a></li>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#">Settings</a></li>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#">Security</a></li>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#">Referals</a></li>
                            </ul>
                        </li>
                        <li>
                            <!-- svelte-ignore a11y-invalid-attribute -->
                            <a href="#">
                                <ion-icon name="wallet-outline"></ion-icon>
                                <span>Subscriptions</span>
                            </a>
                        </li>
                        <li>
                            <!-- svelte-ignore a11y-invalid-attribute -->
                            <a href="#">
                                <ion-icon name="settings-outline"></ion-icon>
                                <span>Configurations</span>
                            </a>
                        </li>
                        <li>
                            <!-- svelte-ignore a11y-invalid-attribute -->
                            <a href="#">
                                <ion-icon name="information-circle-outline"></ion-icon>
                                <span>Help & Settings</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div class="sign-out">
                <!-- svelte-ignore a11y-invalid-attribute -->
                <a href="#">
                    <span>Sign Out</span>
                </a>
            </div>
        </div>
        <div class="main">
            <h1>Content</h1>
        </div>
    </div>

    <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
</body>


</html>

