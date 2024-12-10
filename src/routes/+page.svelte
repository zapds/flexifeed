<script>
    import { Button } from "$lib/components/ui/button";
    
    let { data } = $props();

</script>

<h1 class="text-8xl font-bold text-center">FlexiFeed</h1>
{#if data.user}
    <h2 class="text-4xl font-semibold text-center">Welcome, {data.user.name}</h2>
{/if}