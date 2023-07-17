<script>

    export let activeTab;
    export let modalItem;

    function handleUpdate() {
     
    }


    // make all values required
  
</script>

<div>
    Update {modalItem.activeTab}
</div> <br>


{#if activeTab == "Rooms"}
    <div>
        <!-- <div class="bg-blue-200" style={`position: absolute; left: ${modalItem.position.left}px; top: ${modalItem.position.top}px; width: ${modalItem.position.width}px; height: ${modalItem.position.height}px;`}>
            <div class="z-10 mb-4 cursor-pointer font-defaultText">{modalItem.name} </div>
        </div> -->
        <form>
            <div class="flex items-center mb-1">
                <label class="inline mr-2 font-bold" for="name">Name:</label>
                <input class="shadow rounded-xl h-8 w-full" type="text" id="name" name="name" value={modalItem.name} />
            </div>
            <div class="flex items-center mb-1">
                <label class="inline mr-2 font-bold" for="type">Type:</label>
                <input class="shadow rounded-xl h-8 w-full" type="text" id="type" name="type" value={modalItem.type} />
            </div>
          
            {#if modalItem.position}
                <div class="font-bold mb-1">Position: ({modalItem.position.length})</div>
                    {#each modalItem.position as position }
                    <div class="ml-10">
                        <div class="flex items-center mb-1">
                            <label class="inline mr-2 font-bold" for="type">left:</label>
                            <input class="shadow rounded-xl h-8 w-full" type="text" id="type" name="type" bind:value={position.left} />
                        </div>                    
                        <div class="flex items-center mb-1">
                            <label class="inline mr-2 font-bold" for="type">top:</label>
                            <input class="shadow rounded-xl h-8 w-full" type="text" id="type" name="type" bind:value={position.top} />
                        </div>                    
                        <div class="flex items-center mb-1">
                            <label class="inline mr-2 font-bold" for="type">width:</label>
                            <input class="shadow rounded-xl h-8 w-full" type="text" id="type" name="type" bind:value={position.width} />
                        </div>                    
                        <div class="flex items-center mb-1">
                            <label class="inline mr-2 font-bold" for="type">height:</label>
                            <input class="shadow rounded-xl h-8 w-full" type="text" id="type" name="type" bind:value={position.height} />
                        </div>                    
                    </div>
                    <hr><br>
                {/each}
                
            {/if}
          
            <button on:click={handleUpdate}>Update</button>
        </form>
    
    </div>
{:else if activeTab == "Departments"}
    <div>
        {modalItem.name}
    </div>
{:else if activeTab == "Instruments"}
    <div>
        {modalItem.name}
    </div>

{/if}