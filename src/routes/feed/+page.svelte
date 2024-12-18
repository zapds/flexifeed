<script>
    import { Button } from "$lib/components/ui/button";
    
    let { data } = $props();

</script>

<h1 class="text-8xl font-bold text-center mt-48 mb-2">FlexiFeed</h1>
<p class="text-center text-lg">{JSON.stringify(data)}</p>