<script>
	import Sparkles from '$lib/components/ui/Sparkles/Sparkles.svelte';
</script>

<div class="relative flex items-center justify-center h-screen w-screen overflow-hidden">
	<!-- Sparkles background -->
	<Sparkles 
		minSize={0.8} 
		maxSize={2} 
		particleDensity={200} 
		className="absolute inset-0 z-0" 
		particleColor="blue" 
	/>

	<!-- Main content -->
	<div class="relative z-10 flex flex-col items-center justify-center text-center text-black">
		<h2 class="text-3xl font-bold md:text-7xl lg:text-9xl">
			INFILTR8
		</h2>
		
		<div class="relative mt-8 w-[40rem]">
			<!-- Gradients -->
			<div class="absolute inset-x-20 top-0 h-[2px] w-3/4 bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-sm" />
			<div class="absolute inset-x-20 top-0 h-px w-3/4 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
			<div class="absolute inset-x-60 top-0 h-[5px] w-1/4 bg-gradient-to-r from-transparent via-sky-500 to-transparent blur-sm" />
			<div class="absolute inset-x-60 top-0 h-px w-1/4 bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
		</div>
	</div>

</div>

<style>






</style>
