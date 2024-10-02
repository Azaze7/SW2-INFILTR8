<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Responsive TestNavbar</title>

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
            font-weight: 14px;
            font-weight: 400;
            line-height: 1.8;
            color: #252525;
            background-color: #ffffff;
        }

        a {
            text-decoration: none;
            color: #252525;
            -webkit-tap-highlight-color: transparent;
        }
        ul {list-style: none;}
        h1,h2,h3,h4 {font-weight: 600; line-height: normal;}
        h1 {font-size: 2.5rem;}
        h2 {font-size: 2rem;}
        h3 {font-size: 1.5rem;}
        h4 {font-size: 1rem;}

        .container {
            max-width: 1200px;
            padding: 0 15px;
            margin: 0 auto;
        }

        header {
            height: 80px;
            box-shadow: -2px 2px 45px -20px rgb(0 0 0 / 30%);
        }

        header .content {
            display: flex;
            justify-content: space-between;
            line-height: 80px;
        }

        header .content :where(.left, ul) {
            display: flex;
            gap: 24px;
        }

        header .logo a {
            font-size: 24px;
            text-transform: uppercase;
            font-weight: 600;
        }

        header .content ion-icon {
            font-size: 25px;
            margin-top: 1.7rem;
        }

        header .right ul li a {
            
            position: relative;
            display: flex;
        }

        header .right .num {
            position: absolute;
            left: -10px;
            top: 20px;
            width: 15px;
            height: 15px;
            background-color: pink;
            font-size: 10px;
            line-height: 14px;
            text-align: center;
            color: #ffffff;
            border-radius: 50%;
        }

        header ul li a {
            transition: color .3s;
        }

        header ul li a:hover {
            color: aqua;
        }
    </style>

</head>
<body>
    <div class="page">
        <div class="site">
            <header>
                <div class="container">
                    <div class="content">
                        <div class="left">
                            <!-- svelte-ignore a11y-invalid-attribute -->
                            <a href="#" class="trigger"><ion-icon name="menu-outline"></ion-icon></a>
                            <!-- svelte-ignore a11y-invalid-attribute -->
                            <div class="logo"><a href="#">.shopper</a></div>
                        </div>
                        <div class="middle">
                            <nav>
                                <ul>
                                    <!-- svelte-ignore a11y-invalid-attribute -->
                                    <li><a href="#">Products</a></li>
                                    <!-- svelte-ignore a11y-invalid-attribute -->
                                    <li><a href="#">Lookbook</a></li>
                                    <!-- svelte-ignore a11y-invalid-attribute -->
                                    <li><a href="#">Blog</a></li>
                                    <!-- svelte-ignore a11y-invalid-attribute -->
                                    <li><a href="#">Contact</a></li>
                                    <!-- svelte-ignore a11y-invalid-attribute -->
                                    <li><a href="#">Careers</a></li>
                                </ul>
                            </nav>
                        </div>
                        <div class="right">
                            <ul>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#"><ion-icon name="search-outline"></ion-icon></a></li>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#"><span class="num"></span><ion-icon name="mail-outline"></ion-icon></a></li>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#"><span class="num"></span><ion-icon name="heart-outline"></ion-icon></a></li>
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <li><a href="#"><ion-icon name="person-outline"></ion-icon></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>
            <main></main>
        </div>
    </div>


    <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
</body>
</html>