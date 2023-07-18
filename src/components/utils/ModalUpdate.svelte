<script>
	import { onMount } from "svelte";
    import { baseURL } from "../../store/store";

    export let activeTab;
    export let modalItem;
    export let modalActionSuccess;
    

    let updateStatus = null;

   // Reset the status whenever modalItem changes <=> (opening a different Modal)
   $:{
        if (modalItem) {
            updateStatus = null;
        }
    }
    


    const handleRoomUpdate = async () => {
        const updatedData = {
            name: modalItem.name,
            type: modalItem.type,
            position: modalItem.position
        };

        try {
        const response = await fetch(`${baseURL}/api/rooms/${modalItem._id}`, {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedData)
        });

        if (response.status === 204) {
            updateStatus = "NoChange";
            console.log('No changes were made to the room');
            return;
        }
    
        if (response.ok) {
            modalActionSuccess();
            updateStatus = "Success";

            console.log("Room updated successfully");
        } else {
            console.error("Failed to update room");
        }
        } catch (error) {
        console.error(error);
        }
    };


    // make all values required
  
</script>



{#if activeTab == "Rooms"}
    <div>
        <!-- <div class="bg-blue-200" style={`position: absolute; left: ${modalItem.position.left}px; top: ${modalItem.position.top}px; width: ${modalItem.position.width}px; height: ${modalItem.position.height}px;`}>
            <div class="z-10 mb-4 cursor-pointer font-defaultText">{modalItem.name} </div>
        </div> -->
        <form on:submit|preventDefault={handleRoomUpdate}>
            <div class="flex items-center mb-1">
                <label class="inline mr-2 font-bold" for="name">Name:</label>
                <input class="shadow rounded-xl h-8 w-full" type="text" id="name" name="name" bind:value={modalItem.name} required/>
            </div>
            <div class="flex items-center mb-1">
                <label class="inline mr-2 font-bold" for="type">Type:</label>
                <input class="shadow rounded-xl h-8 w-full" type="text" id="type" name="type" bind:value={modalItem.type} required/>
            </div>
          
            {#if modalItem.position}
                <div class="font-bold mb-1">Position: ({modalItem.position.length})</div>
                    {#each modalItem.position as position }
                    <div class="ml-10">
                        <div class="flex items-center mb-1">
                            <label class="inline mr-2 font-bold" for="type">left:</label>
                            <input class="shadow rounded-xl h-8 w-full" type="number" step="any" min="0" id="left" name="left" bind:value={position.left} required />
                        </div>                    
                        <div class="flex items-center mb-1">
                            <label class="inline mr-2 font-bold" for="type">top:</label>
                            <input class="shadow rounded-xl h-8 w-full" type="number" step="any" min="0" id="top" name="top" bind:value={position.top} required />
                        </div>                    
                        <div class="flex items-center mb-1">
                            <label class="inline mr-2 font-bold" for="type">width:</label>
                            <input class="shadow rounded-xl h-8 w-full" type="number" step="any" id="width" name="width" bind:value={position.width} required/>
                        </div>                    
                        <div class="flex items-center mb-1">
                            <label class="inline mr-2 font-bold" for="type">height:</label>
                            <input class="shadow rounded-xl h-8 w-full" type="number" step="any" id="height" name="height" bind:value={position.height} required/>
                        </div>                    
                    </div>
                    <hr><br>
                {/each}
                
            {/if}
          
            <button class="border-4 py-1 px-2 mb-3 rounded-xl font-semibold  hover:border-blue-400">Update</button>
        </form>

        {#if updateStatus == "Success"}
            <div class="font-semibold text-green-600">Room updated successfully</div>
        {/if}
        {#if updateStatus == "NoChange"}
            <div class="font-semibold text-yellow-600">No changes made to the data</div>
        {/if}

        
        
    
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