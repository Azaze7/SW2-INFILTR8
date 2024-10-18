import { c as create_ssr_component } from "./ssr.js";
const TestTopRight = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<!DOCTYPE html> <html lang="en" data-svelte-h="svelte-agpof4"><head><meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Responsive TestRightSection</title> <style>@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');
        
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
            line-height: 1.8;
            background: var(--bg);
        }
        
        a {
            text-decoration: none;
            vertical-align: middle;
            color: var(--color-second);
        }
        
        ul {
            list-style: none;
        }
        
        strong {
            font-weight: 600;
        }
        
        .container {
            max-width: 1100px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        .right-nav .right-ul {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .right-nav .right-ul .right-li {
            display: flex;
            align-items: center;
            margin-left: .5rem;
            width: 40px;
            height: 40px;
        }
        
        .right-nav .right-ul .right-li a {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            padding: 10px;
            border-radius: 50%;
            transition: var(--transition);
        }</style></head> <body><div id="page" class="site"><header><div class="container"><nav class="right-nav">  <ul class="right-ul"> <li class="right-li"><a href="#"><ion-icon name="hammer-outline"></ion-icon></a></li>  <li class="right-li"><a href="#"><ion-icon name="hammer-outline"></ion-icon></a></li>  <li class="is-menu"><a href="#"><ion-icon name="chevron-down-outline"></ion-icon></a></li>  <li class="is-menu"><a href="#"><ion-icon name="person-outline"></ion-icon></a></li></ul></nav></div></header></div> <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"><\/script></body></html>`;
});
export {
  TestTopRight as T
};
