<script>
    import { enhance } from "$app/forms";
    import { Button } from "$lib/components/ui/button";
    import Check from "lucide-svelte/icons/check";
    import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
    import { tick } from "svelte";
    import * as Command from "$lib/components/ui/command/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import { cn } from "$lib/utils.js";

    const frameworks = [
        { value: "Australia", label: "🇦🇺 Australia" },
        { value: "Botswana", label: "🇧🇼 Botswana" },
        { value: "Canada", label: "🇨🇦 Canada" },
        { value: "Ethiopia", label: "🇪🇹 Ethiopia" },
        { value: "Ghana", label: "🇬🇭 Ghana" },
        { value: "India", label: "🇮🇳 India" },
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
        { value: "Republic of Korea", label: "🇰🇷 Republic of Korea" },
    ];

    let open = false;
    let value = "";
    
    $: selectedValue =
    frameworks.find((f) => f.value.toLowerCase() === value.toLowerCase())?.label ?? "Select a framework...";
    
    // We want to refocus the trigger button when the user selects
    // an item from the list so users can continue navigating the
    // rest of the form with the keyboard.
    function closeAndFocusTrigger(triggerId) {
    open = false;
    tick().then(() => {
    document.getElementById(triggerId)?.focus();
    });
    }
</script>

<div class="flex flex-col max-w-[650px] mx-auto my-8">
    <h1 class="text-4xl font-semibold py-16">Settings</h1>

    <form class="flex flex-col" method="POST" use:enhance>
 
    <Popover.Root bind:open let:ids>
    <Popover.Trigger asChild let:builder>
    <Button
    builders={[builder]}
    variant="outline"
    role="combobox"
    aria-expanded={open}
    class="w-[200px] justify-between"
    >
    {selectedValue}
    <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
    </Popover.Trigger>
    <Popover.Content class="w-[200px] p-0">
    <Command.Root>
    <Command.Input placeholder="Search framework..." />
    <Command.Empty>No framework found.</Command.Empty>
    <Command.Group>
        {#each frameworks as framework}
        <Command.Item
        value={framework.value}
        onSelect={(currentValue) => {
        value = currentValue;
        closeAndFocusTrigger(ids.trigger);
        }}
        >
        <Check
        class={cn(
            "mr-2 h-4 w-4",
            value !== framework.value && "text-transparent"
        )}
        />
        {framework.label}
        </Command.Item>
        {/each}
    </Command.Group>
    </Command.Root>
    </Popover.Content>
    </Popover.Root>
        <!-- <Select.Root>
            <Select.Trigger class="w-[180px]">
                <Select.Value placeholder="Theme" />
            </Select.Trigger>
            <Select.Content>
                <Select.Item value="Australia">🇦🇺 Australia</Select.Item>
                <Select.Item value="Botswana">🇧🇼 Botswana</Select.Item>
                <Select.Item value="Canada">🇨🇦 Canada</Select.Item>
                <Select.Item value="Ethiopia">🇪🇹 Ethiopia</Select.Item>
                <Select.Item value="Ghana">🇬🇭 Ghana</Select.Item>
                <Select.Item value="India">🇮🇳 India</Select.Item>
                <Select.Item value="Indonesia">🇮🇩 Indonesia</Select.Item>
                <Select.Item value="Ireland">🇮🇪 Ireland</Select.Item>
                <Select.Item value="Israel">🇮🇱 Israel</Select.Item>
                <Select.Item value="Kenya">🇰🇪 Kenya</Select.Item>
                <Select.Item value="Latvia">🇱🇻 Latvia</Select.Item>
                <Select.Item value="Malaysia">🇲🇾 Malaysia</Select.Item>
                <Select.Item value="Namibia">🇳🇦 Namibia</Select.Item>
                <Select.Item value="New Zealand">🇳🇿 New Zealand</Select.Item>
                <Select.Item value="Nigeria">🇳🇬 Nigeria</Select.Item>
                <Select.Item value="Pakistan">🇵🇰 Pakistan</Select.Item>
                <Select.Item value="Philippines">🇵🇭 Philippines</Select.Item>
                <Select.Item value="Singapore">🇸🇬 Singapore</Select.Item>
                <Select.Item value="South Africa">🇿🇦 South Africa</Select.Item>
                <Select.Item value="Tanzania">🇹🇿 Tanzania</Select.Item>
                <Select.Item value="Uganda">🇺🇬 Uganda</Select.Item>
                <Select.Item value="United Kingdom">🇬🇧 United Kingdom</Select.Item>
                <Select.Item value="United States">🇺🇸 United States</Select.Item>
                <Select.Item value="Zimbabwe">🇿🇼 Zimbabwe</Select.Item>
                <Select.Item value="Czech Republic">🇨🇿 Czech Republic</Select.Item>
                <Select.Item value="Germany">🇩🇪 Germany</Select.Item>
                <Select.Item value="Austria">🇦🇹 Austria</Select.Item>
                <Select.Item value="Switzerland">🇨🇭 Switzerland</Select.Item>
                <Select.Item value="Argentina">🇦🇷 Argentina</Select.Item>
                <Select.Item value="Chile">🇨🇱 Chile</Select.Item>
                <Select.Item value="Colombia">🇨🇴 Colombia</Select.Item>
                <Select.Item value="Cuba">🇨🇺 Cuba</Select.Item>
                <Select.Item value="Mexico">🇲🇽 Mexico</Select.Item>
                <Select.Item value="Peru">🇵🇪 Peru</Select.Item>
                <Select.Item value="Venezuela">🇻🇪 Venezuela</Select.Item>
                <Select.Item value="Belgium">🇧🇪 Belgium</Select.Item>
                <Select.Item value="France">🇫🇷 France</Select.Item>
                <Select.Item value="Morocco">🇲🇦 Morocco</Select.Item>
                <Select.Item value="Senegal">🇸🇳 Senegal</Select.Item>
                <Select.Item value="Italy">🇮🇹 Italy</Select.Item>
                <Select.Item value="Lithuania">🇱🇹 Lithuania</Select.Item>
                <Select.Item value="Hungary">🇭🇺 Hungary</Select.Item>
                <Select.Item value="Netherlands">🇳🇱 Netherlands</Select.Item>
                <Select.Item value="Norway">🇳🇴 Norway</Select.Item>
                <Select.Item value="Poland">🇵🇱 Poland</Select.Item>
                <Select.Item value="Brazil">🇧🇷 Brazil</Select.Item>
                <Select.Item value="Portugal">🇵🇹 Portugal</Select.Item>
                <Select.Item value="Romania">🇷🇴 Romania</Select.Item>
                <Select.Item value="Slovakia">🇸🇰 Slovakia</Select.Item>
                <Select.Item value="Slovenia">🇸🇮 Slovenia</Select.Item>
                <Select.Item value="Sweden">🇸🇪 Sweden</Select.Item>
                <Select.Item value="Vietnam">🇻🇳 Vietnam</Select.Item>
                <Select.Item value="Turkey">🇹🇷 Turkey</Select.Item>
                <Select.Item value="Greece">🇬🇷 Greece</Select.Item>
                <Select.Item value="Bulgaria">🇧🇬 Bulgaria</Select.Item>
                <Select.Item value="Russia">🇷🇺 Russia</Select.Item>
                <Select.Item value="Ukraine">🇺🇦 Ukraine</Select.Item>
                <Select.Item value="Serbia">🇷🇸 Serbia</Select.Item>
                <Select.Item value="United Arab Emirates">🇦🇪 United Arab Emirates</Select.Item>
                <Select.Item value="Saudi Arabia">🇸🇦 Saudi Arabia</Select.Item>
                <Select.Item value="Lebanon">🇱🇧 Lebanon</Select.Item>
                <Select.Item value="Egypt">🇪🇬 Egypt</Select.Item>
                <Select.Item value="Bangladesh">🇧🇩 Bangladesh</Select.Item>
                <Select.Item value="Thailand">🇹🇭 Thailand</Select.Item>
                <Select.Item value="China">🇨🇳 China</Select.Item>
                <Select.Item value="Taiwan">🇹🇼 Taiwan</Select.Item>
                <Select.Item value="Hong Kong">🇭🇰 Hong Kong</Select.Item>
                <Select.Item value="Japan">🇯🇵 Japan</Select.Item>
                <Select.Item value="Republic of Korea">🇰🇷 Republic of Korea</Select.Item>

            </Select.Content>
        </Select.Root> -->
    </form>
</div>
