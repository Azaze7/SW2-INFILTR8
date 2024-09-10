<script>
	import Sparkles from '$lib/components/ui/Sparkles/Sparkles.svelte';
	import { IconSquareRoundedX } from '@tabler/icons-svelte';
	import { EvervaultCard, Icon } from '$lib/components/ui/EvervaultCard';
	import MultiStepLoader from '$lib/components/ui/MultiStepLoader/MultiStepLoader.svelte';
	
	let loading = false;

const loadingStates = [
	{
		text: 'POGGERS'
	},
	{
		text: 'LOADING...'

	},
	{
		text: 'CHECKING...'
	},
	{
        text: 'VALIDATING...'
    },
	{
        text: 'CONNECTING...'
    },
	{
		text: 'Welcome to INFILTR8'
	}
];

</script>

<div class="relative flex items-center justify-center">
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
			<div class="flex h-[60vh] w-full items-center justify-center">
				<!-- Core Loader Modal  -->
				<MultiStepLoader {loadingStates} {loading} duration={2000} />
				<button
					on:click={() => (loading = true)}
					class="mx-auto flex h-10 items-center justify-center rounded-lg bg-[#39C3EF] px-8 text-sm font-medium text-black transition duration-200 hover:bg-[#39C3EF]/90 md:text-base"
					style="box-shadow: 0px -1px 0px 0px #ffffff40 inset, 0px 1px 0px 0px #ffffff40 inset;"
				>
					Login
				</button>
			
				{#if loading}
					<button
						class="fixed right-4 top-4 z-[20] text-black dark:text-white"
						on:click={() => (loading = false)}
					>
						<IconSquareRoundedX class="h-10 w-10" />
					</button>
				{/if}
			</div>
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
