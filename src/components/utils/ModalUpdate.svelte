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


    const handleDepartmentUpdate = async () => {
        const updatedData = {
            name: modalItem.name,
            color: modalItem.color,
            position: modalItem.position
        };

        try {
        const response = await fetch(`${baseURL}/api/departments/${modalItem._id}`, {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedData)
        });

        if (response.status === 204) {
            updateStatus = "NoChange";
            console.log('No changes were made to the department');
            return;
        }
    
        if (response.ok) {
            modalActionSuccess();
            updateStatus = "Success";

            console.log("Department updated successfully");
        } else {
            console.error("Failed to update department");
        }
        } catch (error) {
        console.error(error);
        }
    };

    const addPosition = () => {
        if (modalItem.position.length < 5){
            modalItem.position = [
                ...modalItem.position,
                { left: 0, top: 0, width: 0, height: 0 } // Replace with your desired initial values
            ];
        }
        
    }

    const removePosition = (index) => {
        modalItem.position = modalItem.position.filter((_, i) => i !== index);
    }


    // make all values required
</script>



{#if activeTab == "Rooms"}
    <div>
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
                <div class="flex pt-2">
                    <div class="font-bold pt-1 mr-2">Position: ({modalItem.position.length})</div>
                    <div class="mr-2 border-4 rounded-xl font-semibold hover:border-green-300 w-9 h-9" on:keyup on:click={() => addPosition()}><iconify-icon class=" text-xl px-1 pt-1" icon="mdi:add" ></iconify-icon></div>    
                </div>    
                {#each modalItem.position as position, index }
                    <div class="ml-10">
                        <div class="flex justify-end">
                            <div class="cursor-pointer rounded-xl font-semibold hover:bg-red-300 w-5 h-5" on:keyup on:click={() => removePosition(index)}><iconify-icon class="text-xl " icon="mdi:close" ></iconify-icon></div>
                        </div>
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
            
            
            
            <button class="border-4 py-1 px-2 mb-3 rounded-xl font-semibold  hover:border-blue-400" type="submit">Update</button>
            
        </form>

        <hr>
        
        {#if updateStatus == "Success"}
            <div class="font-semibold text-green-600">Room updated successfully</div>
        {/if}
        {#if updateStatus == "NoChange"}
            <div class="font-semibold text-yellow-600">No changes made to the data</div>
        {/if}

    </div>
{:else if activeTab == "Departments"}
    <div>
        <form on:submit|preventDefault={handleDepartmentUpdate}>
            <div class="flex items-center mb-1">
                <label class="inline mr-2 font-bold" for="name">Name:</label>
                <input class="shadow rounded-xl h-8 w-full" type="text" id="name" name="name" bind:value={modalItem.name} required/>
            </div>
            <div class="flex items-center mb-1">
                <label class="inline mr-2 font-bold" for="type">Color:</label>
                <input class="h-8 w-50" type="color" id="color" name="color"  bind:value={modalItem.color} required/>
            </div>
        
            {#if modalItem.position}
                    <div class="flex pt-2">
                        <div class="font-bold pt-1 mr-2">Position: ({modalItem.position.length})</div>
                        <div class="mr-2 border-4 rounded-xl font-semibold hover:border-green-300 w-9 h-9" on:keyup on:click={() => addPosition()}><iconify-icon class=" text-xl px-1 pt-1" icon="mdi:add" ></iconify-icon></div>    
                    </div> 
                {#each modalItem.position as position, index }
                    <div class="ml-10">
                        <div class="flex justify-end">
                            <div class="cursor-pointer rounded-xl font-semibold hover:bg-red-300 w-5 h-5" on:keyup on:click={() => removePosition(index)}><iconify-icon class="text-xl " icon="mdi:close" ></iconify-icon></div>
                        </div>
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
            <div class="font-semibold text-green-600">Department updated successfully</div>
        {/if}
        {#if updateStatus == "NoChange"}
            <div class="font-semibold text-yellow-600">No changes made to the data</div>
        {/if}
    </div>

{:else if activeTab == "Instruments"}
    <div>
        {modalItem.name}
    </div>

{/if}
