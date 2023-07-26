<script>
    import { baseURL } from "../../store/store";
    export let activeTab;
    export let modalItem;
    export let modalActionSuccess;
    export let currentFloorId;

    let addStatus = {
        messsage: null,
        type: null // success / error
    };

    // Reset the status whenever modalItem changes <=> (opening a different Modal)
   $:{
        if (modalItem) {
            addStatus = {
                messsage: null,
                type: null 
            };
        }
    }
    
    // let modalItem = {
    //     name: 'test',
    //     type: 'test',
    //     position: [{
    //         left: 0,
    //         top: 0,
    //         width: 0,
    //         height: 0,
    //     }]
    // }

    const handleCreateRoom = async () => {
        const newData = {
            name: modalItem.name,
            type: modalItem.type,
            floor_id: currentFloorId,
            position: modalItem.position
        };

        try {
            const response = await fetch(`${baseURL}/api/rooms`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify(newData)
            });

            if (response.status === 400) { // if already exists
                response.json().then(error => {
                    addStatus.messsage = error.error
                    addStatus.type = 'Error'
                }); 
                return;
            }
        
            if (response.ok) {
                modalActionSuccess();
                addStatus.messsage = "Room created successfully";
                addStatus.type = "Success"
            } else {
                //addStatus.messsage = "Failed to add room";
                response.json().then(error => {
                    addStatus.messsage = error.error
                    addStatus.type = 'Error'
                }); 
            }
        } catch (error) {
            console.log(error);
            addStatus.messsage = "Error: Failed to add room";
        }
    }

    const handleCreateDepartment = async () => {
        const newData = {
            name: modalItem.name,
            color: modalItem.color,
            floor_id: currentFloorId,
            position: modalItem.position
        };

        try {
            const response = await fetch(`${baseURL}/api/departments`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify(newData)
            });

            if (response.status === 400) { // if already exists
                response.json().then(error => {
                    addStatus.messsage = error.error
                    addStatus.type = 'Error'
                }); 
                return;
            }
        
            if (response.ok) {
                modalActionSuccess();
                addStatus.messsage = "Department created successfully";
                addStatus.type = "Success"
            } else {
                response.json().then(error => {
                    addStatus.messsage = error.error
                    addStatus.type = 'Error'
                }); 
            }
        } catch (error) {
            console.log(error);
            addStatus.messsage = "Error: Failed to add department";
        }
    }

    const handleCreateInstrument = async () => {
        const newData = {
            name: modalItem.name,
            description: modalItem.description
        };

        try {
            const response = await fetch(`${baseURL}/api/instruments`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify(newData)
            });

            if (response.status === 400) { // if already exists
                response.json().then(error => {
                    addStatus.messsage = error.error
                    addStatus.type = 'Error'
                }); 
                return;
            }
        
            if (response.ok) {
                modalActionSuccess();
                addStatus.messsage = "Instrument created successfully";
                addStatus.type = "Success"
            } else {
                response.json().then(error => {
                    addStatus.messsage = error.error
                    addStatus.type = 'Error'
                }); 
            }
        } catch (error) {
            console.log(error);
            addStatus.messsage = "Error: Failed to add instrument";
        }
    }


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


</script>


{#if activeTab == "Rooms"}
    <div>
        <form on:submit|preventDefault={handleCreateRoom}>
            <div class="flex items-center mb-1">
                <label class="inline mr-2 font-bold" for="name">Name:</label>
                <input class="shadow rounded-xl h-8 w-full" type="text" id="name" name="name" bind:value={modalItem.name} required/>
            </div>
            <div class="flex items-center mb-1">
                <label class="inline mr-2 font-bold" for="type">Type:</label>
                <input class="shadow rounded-xl h-8 w-full" type="text" id="type" name="type" placeholder="(optional)" bind:value={modalItem.type} />
            </div>
          
            {#if modalItem?.position}
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
            
            
            
            <button class="border-4 py-1 px-2 mb-3 rounded-xl font-semibold  hover:border-green-400" type="submit">Add</button>
            
        </form>

        <hr>
        
        

    </div>
{:else if activeTab == "Departments"}
    <div>
        <form on:submit|preventDefault={handleCreateDepartment}>
            <div class="flex items-center mb-1">
                <label class="inline mr-2 font-bold" for="name">Name:</label>
                <input class="shadow rounded-xl h-8 w-full" type="text" id="name" name="name"  bind:value={modalItem.name} required/>
            </div>
            <div class="flex items-center mb-1">
                <label class="inline mr-2 font-bold" for="color">Color:</label>
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
        
            <button class="border-4 py-1 px-2 mb-3 rounded-xl font-semibold  hover:border-green-400">Add</button>
        </form>

       
    </div>

{:else if activeTab == "Instruments"}
    <form on:submit|preventDefault={handleCreateInstrument}>
        <div class="flex items-center mb-1">
            <label class="inline mr-2 font-bold" for="name">Name:</label>
            <input class="shadow rounded-xl h-8 w-full" type="text" id="name" name="name"  bind:value={modalItem.name} required/>
        </div>
        <div class="flex items-center mb-1">
            <label class="inline mr-2 font-bold" for="description">Description:</label>
            <input class="shadow rounded-xl h-8 w-full" type="text" id="description" name="description" placeholder="(optional)"  bind:value={modalItem.description} />
        </div>
        <br><hr><br>

        <button class="border-4 py-1 px-2 mb-3 rounded-xl font-semibold  hover:border-green-400">Add</button>
    </form>

{/if}

{#if addStatus.messsage }
    <div class={`${addStatus.type === 'Success' ? 'bg-green-200' : 'bg-red-200'} rounded-lg font-defaultText px-2 mt-8 py-2 font-semibold `}>{addStatus.messsage}</div>
{/if}