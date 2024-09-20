<script lang="ts">
	import { onMount } from 'svelte';
    import { writable, type Writable } from 'svelte/store';
    
    const items: Writable<Item[]> = writable([]);
    const unsubscribe = items.subscribe(() => {
        console.log($items.length);
        console.log($items);
    });

    function writeItem(value: string) {
        let item: Item = {
            value: value,
            name: `item${value}`,
        };

        items.update((items) => {
            items.push(item);
            return items;
        })
    }

    let reading = false;
    let value = ""; 

    onMount(() => {
        function keydown(e: KeyboardEvent) {
            if (e.key === "\\" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();

                if (reading) {
                    writeItem(value);
                    value = "";
                }

                reading = !reading;
            }
        }

        function keypress(e: KeyboardEvent) {
            if (reading) {
                value += e.key;
            }
        }

        document.addEventListener("keydown", keydown);
        document.addEventListener("keypress", keypress);
        return () => {
            document.removeEventListener("keydown", keydown);
            document.removeEventListener("keypress", keypress);
        }
    })
</script> 

<h1>Barcode</h1>
    {#if reading}
        <p>
            Reading...
        </p>
    {:else} 
        <p>
            Waiting.
        </p>
    {/if}
<ol>
    {#each $items as item}
        <li>{item.name} - {item.value}</li>
    {/each}    
</ol>