<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Responsive TestSidebar</title>
</head>

<body>
    <div id="page" class="site">
        <div class="sidebar">
            <div class="brand">
                <div class="logo">
                    <!-- svelte-ignore a11y-invalid-attribute -->
                    <a href="#">
                        <span>.web</span>design
                    </a>
                </div>
                <div class="trigger">
                    <!-- svelte-ignore a11y-invalid-attribute -->
                    <!-- svelte-ignore a11y-missing-content -->
                    <a href="#">
                        <ion-icon name="menu-outline"></ion-icon>
                        <ion-icon name="chevron-forward-outline"></ion-icon>
                    </a>
                </div>
            </div>
            <div class="brand">
                <nav>
                    <ul>
                        <li>
                            <!-- svelte-ignore a11y-invalid-attribute -->
                            <a href="#">
                                <ion-icon name="grid-outline"></ion-icon>
                                <span>Dashboard</span>
                            </a>
                        </li>
                        <li class="has-child">
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
                        <li class="has-child">
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
                        <li class="has-child">
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
                        <li class="has-child">
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