<script>
	import '../app.css';
	export let data;
    import { Button } from "$lib/components/ui/button";
</script>

<nav class="flex flex-row w-full items-center gap-4">
	<Button variant="ghost" href="/">
		FlexiFeed
	</Button>

	<Button variant="ghost" href="/protected">
		Protected
	</Button>

	<Button variant="ghost" href="/about">
		About
	</Button>

	{#if data.user}
		<Button variant="ghost" class=" ml-auto" href="/logout">
			Logout
		</Button>
	{:else}
		<Button class=" ml-auto" href="/login/google">
			Sign in
		</Button>
	{/if}
</nav>

{@render children()}
