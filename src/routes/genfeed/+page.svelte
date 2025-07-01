<script>
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Skeleton } from "$lib/components/ui/skeleton/index.js";
	import { toast } from "svelte-sonner";
	import { CheckCircle, Loader } from "lucide-svelte";

	let { data } = $props();

	import { onMount, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
    import { fly } from "svelte/transition";
    import { goto } from "$app/navigation";


	let items = writable([]);

	let error = $state(false);
	let message = $state("unknown error");
    let loading = $state(false);


	let socket;


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

	function connectWebSocket() {
		const runningLocal = true;
		const domain = runningLocal ? "ws://localhost:3000" : "wss://api.flexifeed.zapdos.me";
		socket = new WebSocket(`${domain}/ws-genfeed?user_id=${data.user_id}&session_id=${data.session_id}` );

		socket.onopen = () => {
			console.log("WebSocket connection established");
		};

		socket.onmessage = (event) => {
			try {
				const jsonObject = JSON.parse(event.data);
				items.update((current) => [...current, jsonObject]);
			} catch (err) {
				error = true;
				message = "Invalid JSON received";
			}
		};

		socket.onclose = (event) => {
			if (event.wasClean) {
				console.log(`WebSocket connection closed cleanly, code=${event.code}, reason=${event.reason}`);
			} else {
				console.error("WebSocket connection died");
				error = true;
				message = "Connection closed unexpectedly";
			}
		};

		socket.onerror = (err) => {
			console.error("WebSocket error:", err);
			error = true;
			message = "WebSocket error occurred";
		};
	}

	function disconnectWebSocket() {
		if (socket && socket.readyState === WebSocket.OPEN) {
			socket.send("close");
			socket.close();
		}
	}

	function requestArticles(topic) {
		if (socket && socket.readyState === WebSocket.OPEN) {
			socket.send(topic);
		} else {
			error = true;
			message = "WebSocket not connected";
		}
	}

	function handleSummarize(event) {
		loading = true;
		// redirect to feed page
		goto(`/feed?urls=${encodeURIComponent(feedUrls.join(','))}`);
	} 


	onDestroy(() => {
		disconnectWebSocket();
	});

	let topics = data.topics || ["world", "nation", "technology", "sports", "science"];
	onMount(async () => {
		try {
			const toast1 = toast.promise(itemsPromise, {
				loading: 'Connecting to server...',
				success: 'Feed is ready!'
			});

			connectWebSocket();
			// wait for the connection to be established
			toast.dismiss(toast1);

			toast.promise(itemsPromise, {
				loading: 'Connected to websocket! Requesting articles...',
				success: 'Feed is ready!'
			});
			for (let topic of topics) {
				await new Promise((resolve) => setTimeout(resolve, 1000));
				requestArticles(topic);
			}



		// 	const response = await fetch(`http://localhost:3001/genfeed?user_id=${data.user_id}&session_id=${data.session_id}`);

		// 	if (!response.ok) {
		// 		error = true;
		// 		message = "Server down";
		// 		return;
		// 	}

		// 	const reader = response.body.getReader();
		// 	const decoder = new TextDecoder('utf-8');
		// 	let accumulatedData = '';


		// 	while (true) {
		// 		const { done, value } = await reader.read();
		// 		if (done) break;


		// 		accumulatedData += decoder.decode(value, { stream: true });
		// 		console.log(accumulatedData);

		// 		let boundaryIndex;
		// 		while ((boundaryIndex = accumulatedData.indexOf('\n')) >= 0) {
		// 			const jsonString = accumulatedData.slice(0, boundaryIndex).trim();
		// 			accumulatedData = accumulatedData.slice(boundaryIndex + 1);

		// 			if (jsonString) {
		// 				try {
		// 					const jsonObject = JSON.parse(jsonString);
		// 					items.update((current) => [...current, jsonObject]);
		// 				} catch (err) {
		// 					error = true;
		// 					message = "Invalid JSON received";
		// 				}
		// 			}
		// 	}
		// }
		} catch (err) {
		error = true;
		message = err.message;
		}
	});

	let feedUrls = $state([]);
	let addedindices = $state([]);

	function addToFeed(url, i) {
		return function() {
			if (addedindices.includes(i)) {
				feedUrls = feedUrls.filter((item) => item !== url);
				addedindices = addedindices.filter((item) => item !== i);
				return;
			}
			if (addedindices.length == 5) {
				toast.error("A maximum of 5 articles can be added to the feed");
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
				<Card.Description>{news.topic} • {news.website}</Card.Description>
			</Card.Content>
			<Card.Footer>
				<Button id="btn-{i}" variant={addedindices.includes(i) ? 'outline' : undefined} class="w-full transition-colors duration-300">
					{#if addedindices.includes(i)}
						<CheckCircle class="mr-2 h-4 w-4" />
					{/if}
					Add{addedindices.includes(i) ? 'ed' : ''} to feed
				</Button>
			</Card.Footer>
		</Card.Root>
	{/each}
	{#each Array(topics.length * 5 - $items.length).fill() as _, i}
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
{#if addedindices.length > 0}
	<div transition:fly class="mx-auto sticky backdrop-blur-xl border border-border bottom-2 h-16 flex flex-row items-center max-w-screen-xl z-50 rounded-md justify-between px-2 md:px-16">
	<div class="absolute inset-0 bg-background/20 z-0"></div>
	<h3 class="font-bold relative z-10">
		Done Selecting? Summarize {addedindices.length} article{addedindices.length > 1 ? 's' : ''}
	</h3>
	<Button data-sveltekit-preload-data="tap" onclick={handleSummarize} disabled={addedindices.length == 0 || loading === true} class="relative z-10">
		{#if loading}
			<Loader class="w-6 h-6 animate-spin mx-2" />
			Summarizing...
		{:else}
		Summarize
		{/if}
	</Button>
	</div>
{/if}

