<script>
    let { data } = $props();
</script>

<h1>Protected Page</h1>

{#if data.user}
    <p>Welcome, {data.user.name}</p>
{:else}
    <p>Not logged in</p>
{/if}