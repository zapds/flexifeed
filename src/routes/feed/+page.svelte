<script>
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Skeleton } from "$lib/components/ui/skeleton/index.js";
	import { toast } from "svelte-sonner";
	import { CheckCircle } from "lucide-svelte";
	import Markdown from 'svelte-exmarkdown';

	let { data } = $props();

	import { onMount } from 'svelte';

	let error = $state(false);
	let message = $state("unknown error");

</script>


{#if error}
<div class="flex flex-col items-center mt-48 gap-3">
	<h2 class="text-4xl font-semibold text-center">
		Something went wrong :&#40;
	</h2>
	<p class="text-3xl text-center">
		{message}
	</p>
	<Button href="/">Return home</Button>
</div>
{:else}
<div class="flex flex-col max-w-[650px] mx-auto my-8 gap-4">
    <h1 class="text-4xl font-semibold pt-16">Your Feed</h1>
	<span class="text-lg">
		<Markdown md={data.message} />
	</span>
</div>
{/if}
