<script>
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Skeleton } from "$lib/components/ui/skeleton/index.js";
	import { toast } from "svelte-sonner";
	import { CheckCircle } from "lucide-svelte";

	let { data } = $props();

	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';


	let items = writable([]);

	let error = $state(false);
	let message = $state("unknown error");


	let itemsPromise = new Promise((resolve, reject) => {
		const unsubscribe = items.subscribe((value) => {
		if (value.length > 0) {
			resolve();
			unsubscribe();
		}
		});
		setTimeout(() => {
			if (error) {
				reject();
			}
		}, 500);
	});

	onMount(async () => {
		try {
			toast.promise(itemsPromise, {
				loading: 'Loading feed...',
				success: 'Feed is ready!'
			});

			const response = await fetch(`http://localhost:3001/genfeed?user_id=${data.user_id}&session_id=${data.session_id}`);

			if (!response.ok) {
				error = true;
				message = "Server down";
				return;
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder('utf-8');
			let accumulatedData = '';


			while (true) {
				const { done, value } = await reader.read();
				if (done) break;


				accumulatedData += decoder.decode(value, { stream: true });
				console.log(accumulatedData);

				let boundaryIndex;
				while ((boundaryIndex = accumulatedData.indexOf('\n')) >= 0) {
					const jsonString = accumulatedData.slice(0, boundaryIndex).trim();
					accumulatedData = accumulatedData.slice(boundaryIndex + 1);

					if (jsonString) {
						try {
							const jsonObject = JSON.parse(jsonString);
							items.update((current) => [...current, jsonObject]);
						} catch (err) {
							error = true;
							message = "Invalid JSON received";
						}
					}
			}
		}
		} catch (err) {
		error = true;
		message = err.message;
		}
	});

	let feedUrls = [];
	let addedindices = $state([]);

	function addToFeed(url, i) {
		return function() {
			if (addedindices.includes(i)) {
				feedUrls = feedUrls.filter((item) => item !== url);
				addedindices = addedindices.filter((item) => item !== i);
				return;
			}
			feedUrls.push(url);
			addedindices.push(i);
		};
	}




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
	<div class="w-full grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 auto-cols-fr auto-rows-fr items-stretch px-2">
	{#each $items as news, i}
		<Card.Root class="min-w-full overflow-hidden rounded-lg flex flex-col hover:border-white transition-colors duration-300" onclick={addToFeed(news.url, i)}>
			<Card.Header class="px-0 pt-0 relative w-full h-48 overflow-hidden">
				<div class="w-full h-full relative">
					<img src={news.image} alt={news.title} class="w-full h-full object-cover" />
					<div class="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background"></div>
				</div>
			</Card.Header>
			<Card.Content class="flex-grow">
				<Card.Title class="text-xl">{news.title}</Card.Title>
				<Card.Description>{news.website}</Card.Description>
			</Card.Content>
			<Card.Footer>
				{#if addedindices.includes(i)}
					<Button id="btn-{i}" variant="outline"  class="w-full">
						<CheckCircle class="mr-2 h-4 w-4" />
						Added to feed
					</Button>
				{:else}
					<Button id="btn-{i}" class="w-full">Add to feed</Button>
				{/if}
			</Card.Footer>
		</Card.Root>
	{/each}
	{#each Array(10 - $items.length).fill() as _, i}
		<Card.Root class="min-w-full overflow-hidden rounded-lg flex flex-col">
			<Card.Header class="px-0 pt-0 relative w-full h-48 overflow-hidden">
				<div class="w-full h-full relative">
				<Skeleton class="w-full h-full" />
				<div class="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background"></div>
				</div>
			</Card.Header>
			<Card.Content class="flex-grow">
				<Card.Title>
					<Skeleton class="w-[90%] h-6 rounded-md" />
					<!-- <Skeleton class="w-[80%] h-6 rounded-md my-2" /> -->
					<Skeleton class="w-[70%] h-6 rounded-md my-2" />
				</Card.Title>
				<Card.Description>
					<Skeleton class="w-[40%] h-2 rounded-md mt-2" />
				</Card.Description>
			</Card.Content>
			<Card.Footer>
				<Skeleton class="w-full h-10 rounded-md mx-auto" />
			</Card.Footer>
		</Card.Root>
	{/each}
</div>


{/if}
