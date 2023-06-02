<script>
    import { fly } from 'svelte/transition';
    import { onMount, afterUpdate, onDestroy } from 'svelte';
    import { writable } from 'svelte/store';

    import Vat83B_2 from '../../components/Floors/VAT83B_2.svelte';
    import Vat83A_4 from '../../components/Floors/VAT83A_4.svelte';


    //let count = 0;
    let count = writable(0);

    let subscribtion = count.subscribe(value => {
        console.log('Count updated:', value);
    });




    // Equivalent to useEffect with an empty dependency array (runs only once)
    onMount(() => {
        console.log('Component mounted');
        return () => {
        console.log('Component unmounted');
        };
    });

    // Equivalent to useEffect with a dependency array
    afterUpdate(() => {
        //console.log('Count updated:', count);
        // You can also use count.subscribe here
        count.update(value => value);
    });

    // Function to increment count
    function increment() {
        count.update(n => n + 1);
    }
    // function increment() {
    //    count++;
    // }

    onDestroy(() => {
        console.log("onDestroy called");
        subscribtion();
    });


    let selectedFloor = '';




</script>





<div class="fixed bg-gray-100 border-r-2 shadow-lg w-full h-full" transition:fly={{x: -1000, opacity: 1}}>
    <main>

        <div class="tabs">
            <button class="tab font-digits hover:underline">Admin Panel</button>
        </div>    


        <!-- svelte-ignore a11y-label-has-associated-control -->
        <div class="card">
       

            
            <div class="field font-digits my-4 ml-4">


                <button on:click={increment}>Increment</button>
                <p>Count: {$count}</p>   


                <input type="radio" id="floor1" bind:group={selectedFloor} value="1">
                <label for="floor1">Floor 1</label><br>

                <input type="radio" id="floor2" bind:group={selectedFloor} value="2">
                <label for="floor2">Floor 2</label><br>

                <input type="radio" id="floor3" bind:group={selectedFloor} value="3">
                <label for="floor3">Floor 3</label><br>


                    {#if selectedFloor === '1'}
                        <Vat83B_2/>
                    {:else if selectedFloor === '2'}
                        <Vat83A_4/>
                    {:else}
                        <div>Nothing here</div>
                    {/if}
            </div>
                
            
           

            
            
        </div>
    </main>

</div>




<style>
  

main {
    margin-top: 20px;    
    display: flex;
    flex-direction: column;
    align-items: center;
}

.card {
    box-shadow: 0px 4px 8px rgba(129, 128, 128, 0.2);
    margin-left: -100px;
    border-radius: 8px;
    width: 50%;
    margin-bottom: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.tabs {
    margin-left: -100px;
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 1rem;
}

.tab {
    background-color: transparent;
    border: none;
    color: #333;
    cursor: pointer;
    font-size: 1.25rem;
    padding: 0.5rem 1rem;
    text-align: center;
    text-transform: uppercase;
}

</style>




