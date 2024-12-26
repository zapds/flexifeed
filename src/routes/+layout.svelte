<script>
	import '../app.css';
	let { children, data } = $props();
    import { Button } from "$lib/components/ui/button";
	import * as Avatar from "$lib/components/ui/avatar";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import LogOut from "lucide-svelte/icons/log-out";
    import { Settings } from 'lucide-svelte';
	import { Toaster } from "$lib/components/ui/sonner/index.js";
</script> 

<nav class="container h-14 flex flex-row max-w-screen-2xl items-center gap-4">
	<Button variant="ghost" href="/">
		<span class="font-bold">FlexiFeed</span>
	</Button>

	<Button variant="ghost" href="/about">
		About
	</Button>
	{#if data.user}
	<div class="ml-auto">
		<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			<Avatar.Root class="ml-auto">
			<Avatar.Image src={data.user.picture} alt="@shadcn" />
			<Avatar.Fallback>U</Avatar.Fallback>
			</Avatar.Root>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
			<DropdownMenu.Label>My Account<br>{data.user.name}</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>
				<a class="inline-flex items-center gap-2" href="/settings">
					<Settings class="mr-2 h-4 w-4" />
					Settings
					
				</a>
			</DropdownMenu.Item>
			</DropdownMenu.Group>
			<DropdownMenu.Group>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>
				<a class="inline-flex items-center gap-2" href="/logout">
					<LogOut class="mr-2 h-4 w-4" />
					Log out
					
				</a>
			</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
		</DropdownMenu.Root>

	</div>
	{:else}
		<Button class=" ml-auto" href="/login/google">
			Sign in
		</Button>
	{/if}
</nav>

<Toaster />

{@render children()}
