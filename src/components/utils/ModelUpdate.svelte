<script>
    import { baseURL } from "../../store/store";

    export let activeTab;
    export let modalItem;

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
    
        if (response.ok) {
            console.log("Room updated successfully");
        } else {
            console.error("Failed to update room");
        }
        } catch (error) {
        console.error(error);
        }
    };

    // function handleUpdateTest(){
    //     const updatedData = {
    //         name: modalItem.name,
    //         type: modalItem.type,
    //         position: modalItem.position
    //     };
    //     console.log(updatedData);
    // }


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
                            <input class="shadow rounded-xl h-8 w-full" type="number" id="left" name="left" bind:value={position.left} required />
                        </div>                    
                        <div class="flex items-center mb-1">
                            <label class="inline mr-2 font-bold" for="type">top:</label>
                            <input class="shadow rounded-xl h-8 w-full" type="number" id="top" name="top" bind:value={position.top} required />
                        </div>                    
                        <div class="flex items-center mb-1">
                            <label class="inline mr-2 font-bold" for="type">width:</label>
                            <input class="shadow rounded-xl h-8 w-full" type="number" id="width" name="width" bind:value={position.width} required/>
                        </div>                    
                        <div class="flex items-center mb-1">
                            <label class="inline mr-2 font-bold" for="type">height:</label>
                            <input class="shadow rounded-xl h-8 w-full" type="number" id="height" name="height" bind:value={position.height} required/>
                        </div>                    
                    </div>
                    <hr><br>
                {/each}
                
            {/if}
          
            <button on:click={handleRoomUpdate}>Update</button>
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