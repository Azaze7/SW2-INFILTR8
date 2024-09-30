<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Responsive TestRightSection</title>

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

        .right {
            margin-top: .5rem;
        }

        .right .top {
            display: flex;
            justify-content: end;
            gap: 1rem;
        }
        
        .right .top button a {
            display: none;
        }

        .right .theme-toggler {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 1.4rem;
            width: 4rem;
            cursor: pointer;
        }

        .right .top .profile {
            display: flex;
            gap: 2rem;
            text-align: right;
        }

        .right .top. .profile .profile-photo {
            color: red;
        }
        
        
        
        
        
    </style>

</head>

<body>

    <div id="page" class="site">
        <header>
            <div class="container">
                <nav>
                    <!-- svelte-ignore a11y-invalid-attribute -->
                    <div class="logo"><a href="#"><span>INFI</span>LTR8</a></div>
                </nav>
            </div>
        </header>
    </div>
    
    <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
</body>


</html>

