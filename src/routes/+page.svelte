<script>
    import { Button } from "$lib/components/ui/button";
    import { Newspaper } from "lucide-svelte";
    
    
    let { data } = $props();

</script>

<div class="flex flex-col items-center h-screen">

    <h1 class="text-8xl font-bold text-center mt-48 mb-2">FlexiFeed</h1>
    <h2 class="text-3xl font-semibold text-center">Personalized news,<br><span class="text-transparent bg-gradient-to-r from-[#007cf0] to-[#00dfd8] bg-clip-text">crafted just for You.</span></h2>
    {#if data.user}
        <Button class="my-4 inline-flex gap-2" href="/genfeed">
            <Newspaper />
            <span class="font-semibold">Get your feed</span>
        </Button>
    {/if}
</div>