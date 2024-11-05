<!--Analysis Backend Layout Page Code -- Gilbert Guzman & Christian Garcia -->
<script lang="ts">
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        //Imports List. 
        //[Order is Global-Site-Style, lucide-Svelte Icons, $lib Components, @floatingUI, & @skeletonlabs.]
        //Import Site wide global styling.
        import '/src/app.postcss';
        //Import various icons from lucide so we can use them on the sidebar for this portion of the site. 
        import { ArrowLeft, Home, Settings, FlaskConical, FolderRoot, Clipboard, BadgeHelp, Scroll} from "lucide-svelte";
    
        //Import user from our loginUI so we know if they are authorized to be here.
        import { user } from "$lib/components/loginUI/userStore";
        //Import Sidebar we made as a team so it shows up on the side.
        import Sidebar from '$lib/components/AceternityUI/Sidebar/Sidebar.svelte';
        //Import SidebarLink so the sidelinks on the sidebar navigate through the project pages we made.
        import SidebarLink from '$lib/components/AceternityUI/Sidebar/SidebarLink.svelte';
        //Import vopen from $lib/stores so we can use the vopen store we made.
        import { vopen } from '$lib/stores/svelteContent';
    
        //Import computePosition, autoUpdate, flip, shift, offset, and arrow from floating-ui/dom so we can position animated elements on the page.
        import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom'; 
    
        //Import storePopup, storeHighlightJs, and Appshell from skeletonlabs so we can use their components for loading darkmode as well as using AppShell on this page. 
            //Others are for formatting.
        import { storePopup, storeHighlightJs, AppShell } from '@skeletonlabs/skeleton';
        //Import additonal Store information like initializeStores from skeletonlabs so we can initialize and manage stores made by skeleton.
        import { initializeStores } from '@skeletonlabs/skeleton';
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        //Highlight JS Imports. (Universal Error Checker).
            //These allow us to use highlight.js stying for our code.
        //Import the core of highlight.js so it works on this portion of the site.
        import hljs from 'highlight.js/lib/core';
        //Language support imports.
        //Import xml so it can find errors in our xml.
        import xml from 'highlight.js/lib/languages/xml'; 
        //Import css so it can find errors in our css.
        import css from 'highlight.js/lib/languages/css';
        //Import javascript so it can find errors in our javascript.
        import javascript from 'highlight.js/lib/languages/javascript';
        //Import typescript so it can find errors in our typescript.
        import typescript from 'highlight.js/lib/languages/typescript';
        //Import the darkmode version of highlight.js. (When the error occurs its in darkmode).
        import 'highlight.js/styles/github-dark.css';
    
        //Language Registers for highlight.js.
            //Basically ensure that xml, css, javascript, and typescript are available for it to use.
        hljs.registerLanguage('xml', xml);
        hljs.registerLanguage('css', css);
        hljs.registerLanguage('javascript', javascript);
        hljs.registerLanguage('typescript', typescript);
        //Stores the current highlight.js in the store we have for it. 
        storeHighlightJs.set(hljs);
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        //Actual Layout Code. 
        //Initalize the stores we pulled from @skeletonlabs library.
        initializeStores();
    
        //Get greeting which is empty (for now) since based on time.
        let greeting = "";
        //Set the Popup settings we got from @skeletonLabs.
        storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
        //Get currentHour by making a date() Element and calling getHours().
        let currentHour = new Date().getHours();
    
        //Determine the string fo greeting based on the currentHour. (Time of Day).
        //If it is before noon, say 'Good morning!'
        //elif it is Noon to 6PM, say 'Good afternoon!'
        //else if it is 7PM-Midnight, say 'Good evening!'
        if (currentHour < 12) {
            greeting = "Good morning!";
        } else if (currentHour < 18) {
            greeting = "Good afternoon!";
        } else {
            greeting = "Good evening!";
        }
    
        //Interface for the AceternityUI Sidebar 'LinkItem.' (Our Sidebar)
        interface LinkItem {
            //Is the Label of the link on the sidebar.
            label: string;
            //Is the reference to the URL it navigates to when clicked.
            href: string;
            //Is the icon we have assigned to the link on the sidebar.
            icon: any;
        }
    
        //The array of the LinkItem sidebar we are calling above as an interface.
            //Here we are assigning the labels, reference to URL, and the icon for the sidebar.
        const links: LinkItem[] = [
            { label: "Dashboard", href: "/dashboard", icon: Home },
            { label: "Project Manager", href: "/ProjectManager", icon: FolderRoot },
            { label: "Analysis", href: "/analysis", icon: FlaskConical },
            { label: "Reports", href: "/Report", icon: Clipboard },
            { label: "Logs", href: "/Logs", icon: Scroll },
            { label: "Settings", href: "/pagesettings", icon: Settings },
            { label: "Support", href: "/support", icon: BadgeHelp} 
        ];
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    </script>
    <!-- Closing the TypeScript portion of the .svelte file. -->
    
    <!-- App Shell Portion for when site is opened. -->
    <AppShell>
        <!-- Page Header for this page in the top left next to sidebar. "Analysis" -->
        <svelte:fragment slot="pageHeader">
            <h1 class="text-2xl font-bold mb-4">Analysis</h1>
        </svelte:fragment>
    
        <!-- Sidebar with Drawer. (The left sidebar we use for the links to the rest of the site) -->
        <svelte:fragment slot="sidebarLeft">
            <div class="rounded-md flex flex-col md:flex-row bg-[#111827] w-full flex-1 max-w-7xl mx-auto border border-[#111827] overflow-hidden h-full">
                <!-- Make it so sidebar can grow. -->
                <Sidebar class="justify-between gap-10">
                    <div class="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        <!-- If sidebar is hovered over (open), we show the elements and give the greeting. -->
                        {#if $vopen}
                            <a
                                href="/"
                                class="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20"
                            >
                                <div
                                    class="h-5 w-5 bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0"
                                ></div>
                                <span class="font-medium text-white whitespace-pre">
                                    <p>{greeting}{" "}{$user?.username}</p>
                                </span>
                            </a>
                        <!-- Else we hide the elements and no greeting. -->
                        {:else}
                            <a
                                href="/"
                                class="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20"
                            >
                                <div
                                    class="h-5 w-5 bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0"
                                ></div>
                            </a>
                        {/if}
                        <!-- Load each of the links on the sidebar with a small gap between them for formatting. -->
                        <div class="mt-8 flex flex-col gap-2">
                            {#each links as link}
                              <SidebarLink {link} />
                            {/each}
                        </div>
                    </div>
    
                    <!-- At bottom of Sidebar have the logout button. -->
                    <div>
                        <SidebarLink
                            link={{
                              label: "Sign Out",
                              href: "/Login",
                              icon: ArrowLeft,
                            }}
                        />
                    </div>    
                </Sidebar>
                <!-- End of Sidebar defintion. -->
            </div>
            <!-- End of Sidebar class. -->
        </svelte:fragment>
        <!-- Total end of Sidebar component. -->
        <slot/>
        <!-- End of Analysis Page Content. -->
    </AppShell>
    <!-- Total end of App Shell Portion of code. -->
    <!-- END OF ANALYSIS BACKEND CODE. -->