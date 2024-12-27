<script>
    import { applyAction, deserialize, enhance } from "$app/forms";
    import { Button } from "$lib/components/ui/button";
    import * as Select from "$lib/components/ui/select/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Switch } from "$lib/components/ui/switch/index.js";
    import { invalidateAll } from "$app/navigation";
    import { Loader } from "lucide-svelte";
    import { toast } from "svelte-sonner";
    // import { Toaster } from "$lib/components/ui/sonner";
    // import { toast } from "svelte-sonner";
    
    let loading = $state(false);
    
    let { data } = $props();
    let selectedCountry = $state(data.country);
    $effect(() => console.log("selectedCountry, data.country", selectedCountry, JSON.stringify(data)));
    let selectedTopicSports = $state(data.topics.includes("sports"));
    let selectedTopicWorld = $state(data.topics.includes("world"));
    let selectedTopicNation = $state(data.topics.includes("nation"));
    let selectedTopicBusiness = $state(data.topics.includes("business"));
    let selectedTopicTechnology = $state(data.topics.includes("technology"));
    let selectedTopicEntertainment = $state(data.topics.includes("entertainment"));
    let selectedTopicScience = $state(data.topics.includes("science"));
    let selectedTopicHealth = $state(data.topics.includes("health"));

    async function handleSubmit(event) {
        loading = true;
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        data.append("country", selectedCountry.value);
        data.append("topics", JSON.stringify({
            sports: selectedTopicSports,
            world: selectedTopicWorld,
            nation: selectedTopicNation,
            business: selectedTopicBusiness,
            technology: selectedTopicTechnology,
            entertainment: selectedTopicEntertainment,
            science: selectedTopicScience,
            health: selectedTopicHealth,
        }));
        console.log(data);
        const res = await fetch(event.currentTarget.action, {
            method: "POST",
            body: data,
        });

        const result = deserialize(await res.text());

        if (res.type === "success") {
            await invalidateAll();
        }

        applyAction(result);
        loading = false;
        toast.success("Settings saved successfully");
        
        // toast({
        //     message: "Settings saved successfully",
        //     type: "success",
        // });
    }

    const countries = [
        { value: "India", label: "🇮🇳 India" },
        { value: "Australia", label: "🇦🇺 Australia" },
        { value: "Botswana", label: "🇧🇼 Botswana" },
        { value: "Canada", label: "🇨🇦 Canada" },
        { value: "Ethiopia", label: "🇪🇹 Ethiopia" },
        { value: "Ghana", label: "🇬🇭 Ghana" },
        { value: "Indonesia", label: "🇮🇩 Indonesia" },
        { value: "Ireland", label: "🇮🇪 Ireland" },
        { value: "Israel", label: "🇮🇱 Israel" },
        { value: "Kenya", label: "🇰🇪 Kenya" },
        { value: "Latvia", label: "🇱🇻 Latvia" },
        { value: "Malaysia", label: "🇲🇾 Malaysia" },
        { value: "Namibia", label: "🇳🇦 Namibia" },
        { value: "New Zealand", label: "🇳🇿 New Zealand" },
        { value: "Nigeria", label: "🇳🇬 Nigeria" },
        { value: "Pakistan", label: "🇵🇰 Pakistan" },
        { value: "Philippines", label: "🇵🇭 Philippines" },
        { value: "Singapore", label: "🇸🇬 Singapore" },
        { value: "South Africa", label: "🇿🇦 South Africa" },
        { value: "Tanzania", label: "🇹🇿 Tanzania" },
        { value: "Uganda", label: "🇺🇬 Uganda" },
        { value: "United Kingdom", label: "🇬🇧 United Kingdom" },
        { value: "United States", label: "🇺🇸 United States" },
        { value: "Zimbabwe", label: "🇿🇼 Zimbabwe" },
        { value: "Czech Republic", label: "🇨🇿 Czech Republic" },
        { value: "Germany", label: "🇩🇪 Germany" },
        { value: "Austria", label: "🇦🇹 Austria" },
        { value: "Switzerland", label: "🇨🇭 Switzerland" },
        { value: "Argentina", label: "🇦🇷 Argentina" },
        { value: "Chile", label: "🇨🇱 Chile" },
        { value: "Colombia", label: "🇨🇴 Colombia" },
        { value: "Cuba", label: "🇨🇺 Cuba" },
        { value: "Mexico", label: "🇲🇽 Mexico" },
        { value: "Peru", label: "🇵🇪 Peru" },
        { value: "Venezuela", label: "🇻🇪 Venezuela" },
        { value: "Belgium", label: "🇧🇪 Belgium" },
        { value: "France", label: "🇫🇷 France" },
        { value: "Morocco", label: "🇲🇦 Morocco" },
        { value: "Senegal", label: "🇸🇳 Senegal" },
        { value: "Italy", label: "🇮🇹 Italy" },
        { value: "Lithuania", label: "🇱🇹 Lithuania" },
        { value: "Hungary", label: "🇭🇺 Hungary" },
        { value: "Netherlands", label: "🇳🇱 Netherlands" },
        { value: "Norway", label: "🇳🇴 Norway" },
        { value: "Poland", label: "🇵🇱 Poland" },
        { value: "Brazil", label: "🇧🇷 Brazil" },
        { value: "Portugal", label: "🇵🇹 Portugal" },
        { value: "Romania", label: "🇷🇴 Romania" },
        { value: "Slovakia", label: "🇸🇰 Slovakia" },
        { value: "Slovenia", label: "🇸🇮 Slovenia" },
        { value: "Sweden", label: "🇸🇪 Sweden" },
        { value: "Vietnam", label: "🇻🇳 Vietnam" },
        { value: "Turkey", label: "🇹🇷 Turkey" },
        { value: "Greece", label: "🇬🇷 Greece" },
        { value: "Bulgaria", label: "🇧🇬 Bulgaria" },
        { value: "Russia", label: "🇷🇺 Russia" },
        { value: "Ukraine", label: "🇺🇦 Ukraine" },
        { value: "Serbia", label: "🇷🇸 Serbia" },
        { value: "United Arab Emirates", label: "🇦🇪 United Arab Emirates" },
        { value: "Saudi Arabia", label: "🇸🇦 Saudi Arabia" },
        { value: "Lebanon", label: "🇱🇧 Lebanon" },
        { value: "Egypt", label: "🇪🇬 Egypt" },
        { value: "Bangladesh", label: "🇧🇩 Bangladesh" },
        { value: "Thailand", label: "🇹🇭 Thailand" },
        { value: "China", label: "🇨🇳 China" },
        { value: "Taiwan", label: "🇹🇼 Taiwan" },
        { value: "Hong Kong", label: "🇭🇰 Hong Kong" },
        { value: "Japan", label: "🇯🇵 Japan" },
        { value: "Republic of Korea", label: "🇰🇷 Republic of Korea" }
    ];

    let triggerContent = $derived(
    countries.find((f) => f.value === selectedCountry)?.label ?? "Choose a country"
    );
</script>

<div class="flex flex-col max-w-[650px] mx-auto my-8 gap-2">
    <!-- <Toaster /> -->
    <h1 class="text-4xl font-semibold pt-16">Settings</h1>
    <Separator class="mb-16 mt-4" />
    <form class="flex flex-col gap-4" method="POST" onsubmit={handleSubmit}>
        <h2 class=" text-base font-semibold py-2">News Country</h2>

        <Select.Root type="single" name="country" bind:value={selectedCountry}>
        <Select.Trigger class="w-[180px]">
            {triggerContent}
        </Select.Trigger>
        <Select.Content>
        {#each countries as country}
            <Select.Item value={country.value} label={country.label}
            >{country.label}</Select.Item
            >
        {/each}
        </Select.Content>
        </Select.Root>

        <h2 class="text-base font-semibold py-2">Feed Topics</h2>
        <div class="flex flex-col gap-4 w-fit ">
            <div class="flex flex-row items-center gap-4">
                <Label for="worldSwitch">World</Label>
                <Switch class="ml-auto" id="worldSwitch" bind:checked={selectedTopicWorld} ></Switch>
            </div>
            <div class="flex flex-row items-center gap-4">
                <Label for="nationSwitch">Nation</Label>
                <Switch class="ml-auto" id="nationSwitch" bind:checked={selectedTopicNation} ></Switch>
            </div>
            <div class="flex flex-row items-center gap-4">
                <Label for="businessSwitch">Business</Label>
                <Switch class="ml-auto" id="businessSwitch" bind:checked={selectedTopicBusiness} ></Switch>
            </div>
            <div class="flex flex-row items-center gap-4">
                <Label for="technologySwitch">Technology</Label>
                <Switch class="ml-auto" id="technologySwitch" bind:checked={selectedTopicTechnology} ></Switch>
            </div>
            <div class="flex flex-row items-center gap-4">
                <Label for="entertainmentSwitch">Entertainment</Label>
                <Switch class="ml-auto" id="entertainmentSwitch" bind:checked={selectedTopicEntertainment} ></Switch>
            </div>
            <div class="flex flex-row items-center gap-4">
                <Label for="sportsSwitch">Sports</Label>
                <Switch class="ml-auto" id="sportsSwitch" bind:checked={selectedTopicSports} ></Switch>
            </div>
            <div class="flex flex-row items-center gap-4">
                <Label for="scienceSwitch">Science</Label>
                <Switch class="ml-auto" id="scienceSwitch" bind:checked={selectedTopicScience} ></Switch>
            </div>
            <div class="flex flex-row items-center gap-4">
                <Label for="healthSwitch">Health</Label>
                <Switch class="ml-auto" id="healthSwitch" bind:checked={selectedTopicHealth} ></Switch>
            </div>
        </div>

        <Button type="submit" disabled={loading} class="mt-8">
            {#if loading}
                <Loader class="w-6 h-6 animate-spin mx-2" />
            {/if}
            Save Changes
        </Button>
    </form>
</div>
