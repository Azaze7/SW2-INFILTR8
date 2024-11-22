<!-- The frontend support page serves as the landing page for the INFILTR8 platform, offering an engaging and interactive 
introduction. The page features a dynamic particle background, providing a visually appealing design that captures 
the user's attention. A central highlight is the "INFILTR8" title, styled with a gradient effect, creating a modern 
and immersive experience. Users are prompted with a "Get Started" button, which redirects them to the login page. 
This minimalist and interactive design ensures ease of navigation while maintaining a professional aesthetic for 
new and returning users.-->
<script>
    import { goto } from '$app/navigation';
    import Particles from '$lib/components/MagicUI/Particles/Particles.svelte';
</script>

<section class="landing-page relative h-screen w-screen">
    <!-- Full background with particles -->
    <Particles className="absolute inset-0" refresh={true} />

    
    <div class="relative z-10 flex flex-col items-center justify-center h-full text-center">
        <span
            class="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10"
        >
            INFILTR8
        </span>

        <!-- Button underneath INFILTR8 -->
        <button on:click={() => goto('/Login')} class="btn-primary mt-8">
            Get Started
        </button>
    </div>
</section>

<style>
    .landing-page {
        position: relative;
        overflow: hidden;
    }
    
    .btn-primary {
        padding: 0.75rem 1.5rem;
        background-color: #007bff;
        color: white;
        font-size: 1.25rem;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: background-color 0.3s ease-in-out;
    }

    .btn-primary:hover {
        background-color: #0056b3;
    }
</style>
