<script>
	import { FileDropzone, LightSwitch } from "@skeletonlabs/skeleton";


</script>


<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center flex flex-col items-center">
		<h2 class="h2">Welcome to INFILTR8.</h2>
		<figure>
			<div class="card">
				<header class="card-header">
					<h1 class="card-title">File Upload</h1>
					<p class="card-subtitle">Drag and drop files here or click to select files.</p>
				</header>
				<section class="p-4">
					<FileDropzone name="files" />
				</section>
				<footer class="card-footer">(footer)</footer>
			</div>
			<div class="card">
				<header class="card-header">
					<h1 class="card-title">File Upload</h1>
					<p class="card-subtitle">DarK Mode</p>
				</header>
				<section class="p-4">
					<LightSwitch />
				</section>
				<footer class="card-footer">(footer)</footer>
			</div>
			<section class="img-bg" />
		</figure>
		<!-- / -->
		<div class="flex justify-center space-x-2">
			<a class="btn variant-filled" href="https://skeleton.dev/" target="_blank" rel="noreferrer">
				Launch Documentation
			</a>
		</div>

	</div>
</div>