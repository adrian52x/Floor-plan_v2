<script>
	import { onMount } from "svelte";
    import { baseURL } from "../../store/store";

    export let activeTab;
    export let modalItem;
    export let modalActionSuccess;
    

    let updateStatus = {
        message: null,
        type: null  // NoChange / Success
    };

   // Reset the status whenever modalItem changes <=> (opening a different Modal)
   $:{
        if (modalItem) {
            updateStatus = {
                message: null,
                type: null
            };
        }
    }


    

    const handleRoomUpdate = async () => {
        const updatedData = {
            name: modalItem.name,
            type: modalItem.type,
            roomNr: modalItem.roomNr,
            position: modalItem.position
        };

        try {
            const token = localStorage.getItem('jwt_auth');
            const response = await fetch(`${baseURL}/api/rooms/${modalItem._id}`, {
                method: "PATCH",
                credentials: 'include',
                headers: {
                "Content-Type": "application/json",
                'Authorization': `${token}`
                },
                body: JSON.stringify(updatedData)
            });

            if (response.status == 409) { // Name in use
				response.json().then(error => {
					updateStatus.message = error.error; 
					updateStatus.type = "NoChange"
				});
			}

            else if (response.status === 204) {
                updateStatus.message = "No changes were made to the room";
                updateStatus.type = "NoChange";
                return;
            }
        
            else if (response.ok) {
                modalActionSuccess();
                updateStatus.message = "Room updated successfully";
                updateStatus.type = "Success";

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
            description: modalItem.description,
            position: modalItem.position
        };

        try {
            const token = localStorage.getItem('jwt_auth');
        const response = await fetch(`${baseURL}/api/departments/${modalItem._id}`, {
            method: "PATCH",
            credentials: 'include',
            headers: {
            "Content-Type": "application/json",
            'Authorization': `${token}`
            },
            body: JSON.stringify(updatedData)
        });

        if (response.status === 204) {
            updateStatus.message = "No changes were made to the department";
            updateStatus.type = "NoChange";
            return;
        }
    
        else if (response.ok) {
            modalActionSuccess();
            updateStatus.message = "Department updated successfully";
            updateStatus.type = "Success";
            
        } else {
            console.error("Failed to update department");
        }
        } catch (error) {
        console.error(error);
        }
    };

    const handleInstrumentUpdate = async () => {
        const updatedData = {
            name: modalItem.name,
            bmram: modalItem.bmram,
            note: modalItem.note,
            actionRequired: modalItem.actionRequired,
            connectedTo: modalItem.connectedTo
        };

        try {
            const token = localStorage.getItem('jwt_auth');
        const response = await fetch(`${baseURL}/api/instruments/${modalItem._id}`, {
            method: "PATCH",
            credentials: 'include',
            headers: {
            "Content-Type": "application/json",
            'Authorization': `${token}`
            },
            body: JSON.stringify(updatedData)
        });

        if (response.status == 409) { // Name in use
			response.json().then(error => {
				updateStatus.message = error.error; 
				updateStatus.type = "NoChange";
			});
		}

        else if (response.status === 204) {
            updateStatus.message = "No changes were made to the instrument";
            updateStatus.type = "NoChange";
            return;
        }
    
        else if (response.ok) {
            modalActionSuccess();
            updateStatus.message = "Instrument updated successfully";
            updateStatus.type = "Success";
            
        } else {
            console.error("Failed to update instrument");
        }
        } catch (error) {
        console.error(error);
        }
    };


    const handlePCUpdate = async () => {
        const updatedData = {
            name: modalItem.name,
            lansweeper: modalItem.lansweeper
        };

        try {
            const token = localStorage.getItem('jwt_auth');
        const response = await fetch(`${baseURL}/api/pcs/${modalItem._id}`, {
            method: "PATCH",
            credentials: 'include',
            headers: {
            "Content-Type": "application/json",
            'Authorization': `${token}`
            },
            body: JSON.stringify(updatedData)
        });

        if (response.status == 409) { // Name in use
			response.json().then(error => {
				updateStatus.message = error.error; 
				updateStatus.type = "NoChange"
			});
		}

        else if (response.status === 204) {
            updateStatus.message = "No changes were made to the PC";
            updateStatus.type = "NoChange";
            return;
        }
    
        else if (response.ok) {
            modalActionSuccess();
            updateStatus.message = "PC updated successfully";
            updateStatus.type = "Success";
            
        } else {
            console.error("Failed to update PC");
        }
        } catch (error) {
        console.error(error);
        }
    };

    const handleNetworkPointUpdate = async () => {
        const updatedData = {
            name: modalItem.name,
            switchPort: modalItem.switchPort
        };

        try {
            const token = localStorage.getItem('jwt_auth');
        const response = await fetch(`${baseURL}/api/netports/${modalItem._id}`, {
            method: "PATCH",
            credentials: 'include',
            headers: {
            "Content-Type": "application/json",
            'Authorization': `${token}`
            },
            body: JSON.stringify(updatedData)
        });

        if (response.status == 409) { // Name in use
			response.json().then(error => {
				updateStatus.message = error.error; 
				updateStatus.type = "NoChange"
			});
		}

        else if (response.status === 204) {
            updateStatus.message = "No changes were made to the Network Point";
            updateStatus.type = "NoChange";
            return;
        }
    
        else if (response.ok) {
            modalActionSuccess();
            updateStatus.message = "Network Point updated successfully";
            updateStatus.type = "Success";
            
        } else {
            console.error("Failed to update Network Point");
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


</script>



{#if activeTab == "Rooms"}
    <div>
        <form on:submit|preventDefault={handleRoomUpdate}>
            <div class="flex items-center mb-1">
                <label class="inline mr-2 font-bold" for="name">Name:</label>
                <input class="shadow rounded-xl h-8 w-full" type="text" id="name" name="name" bind:value={modalItem.name} required
                    pattern="[a-zA-Z0-9\s.\-_]+"
                    title="Room name can only contain alphanumeric characters and spaces."
                />
            </div>
            <div class="flex items-center mb-1">
                <label class="inline mr-2 font-bold" for="type">Type:</label>
                <input class="shadow rounded-xl h-8 w-full" type="text" id="type" name="type" placeholder="(optional)" bind:value={modalItem.type} />
            </div>
            <div class="flex items-center mb-1">
                <label class="inline mr-2 font-bold" for="roomNr">Room NR:</label>
                <input class="shadow rounded-xl h-8 w-full" type="text" id="roomNr" name="roomNr" placeholder="(optional)" bind:value={modalItem.roomNr} />
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
        

    </div>
{:else if activeTab == "Departments"}
    <div>
        <form on:submit|preventDefault={handleDepartmentUpdate}>
            <div class="flex items-center mb-1">
                <label class="inline mr-2 font-bold" for="name">Name:</label>
                <input class="shadow rounded-xl h-8 w-full" type="text" id="name" name="name" bind:value={modalItem.name} required
                    pattern="[a-zA-Z0-9\s.\-_]+"
                    title="Department name can only contain alphanumeric characters and spaces."
                />
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

       
    </div>

{:else if activeTab == "Instruments"}
    <form on:submit|preventDefault={handleInstrumentUpdate}>
        <div class="flex items-center mb-1">
            <label class="inline mr-2 font-bold" for="name">Name:</label>
            <input class="shadow rounded-xl h-8 w-full" type="text" id="name" name="name"  bind:value={modalItem.name} required
                pattern="[a-zA-Z0-9\s.\-_]+"
                title="Instrument name can only contain alphanumeric characters and spaces."
            />
        </div>
        <div class="flex items-center mb-1">
            <label class="inline mr-2 font-bold" for="bmram">Bmram:</label>
            <input class="shadow rounded-xl h-8 w-full" type="text" id="bmram" name="bmram"  bind:value={modalItem.bmram} required/>
        </div>
        <div class="flex items-center mb-1">
            <label class="inline mr-2 font-bold" for="actionRequired">Action Required:</label>
            <select bind:value={modalItem.actionRequired} name="actionRequired" id="actionRequired" class="h-8 focus:outline-none rounded-r-xl w-13  text-xs " > 
                <option value={true}>Yes</option>
                <option value={false}>No</option>
            </select>
        </div>
        <div class="flex items-center mb-1 hidden" >
            <label class="inline mr-2 font-bold" for="connectedTo">Connected to PC:</label>
            <input class="shadow rounded-xl h-8 w-full" type="text" id="connectedTo" name="connectedTo" placeholder="(optional)" bind:value={modalItem.connectedTo} />
        </div>
        <div class="flex items-center mb-1">
            <label class="inline mr-2 font-bold" for="note">Note:</label>
            <input class="shadow rounded-xl h-8 w-full" type="text" id="note" name="note" placeholder="(optional)"  bind:value={modalItem.note} />
        </div>
        <br><hr><br>

        <button class="border-4 py-1 px-2 mb-3 rounded-xl font-semibold  hover:border-blue-400">Update</button>
    </form>


{:else if activeTab == "PCs"}
    <form on:submit|preventDefault={handlePCUpdate}>
        <div class="flex items-center mb-1">
            <label class="inline mr-2 font-bold" for="name">Name:</label>
            <input class="shadow rounded-xl h-8 w-full" type="text" id="name" name="name" bind:value={modalItem.name} required
                pattern="[a-zA-Z0-9\s.\-_]+"
                title="PC name can only contain alphanumeric characters and spaces."
            />
        </div>
        <div class="flex items-center mb-1">
            <label class="inline mr-2 font-bold" for="lansweeper">Lansweeper:</label>
            <input class="shadow rounded-xl h-8 w-full" type="text" id="lansweeper" name="lansweeper"  bind:value={modalItem.lansweeper} required/>
        </div>
        <br><hr><br>

        <button class="border-4 py-1 px-2 mb-3 rounded-xl font-semibold  hover:border-blue-400">Update</button>
    </form>


{:else if activeTab == "Network Points"}
    <form on:submit|preventDefault={handleNetworkPointUpdate}>
        <div class="flex items-center mb-1">
            <label class="inline mr-2 font-bold" for="name">Name:</label>
            <input class="shadow rounded-xl h-8 w-full" type="text" id="name" name="name" bind:value={modalItem.name} required
                pattern="[a-zA-Z0-9\s.\-_]+"
                title="PORT name can only contain alphanumeric characters and spaces."
            />
        </div>
        <div class="flex items-center mb-1">
            <label class="inline mr-2 font-bold" for="switch">Switch Port:</label>
            <input class="shadow rounded-xl h-8 w-full" type="text" id="switch" name="switch"  bind:value={modalItem.switchPort} />
        </div>
        <br><hr><br>

        <button class="border-4 py-1 px-2 mb-3 rounded-xl font-semibold  hover:border-blue-400">Update</button>
    </form>

{/if}




{#if updateStatus.message}
    <div class={`${updateStatus.type === 'Success' ? 'bg-green-200' : 'bg-yellow-200'} rounded-lg font-defaultText px-2 mt-8 py-2 font-semibold`}>{updateStatus.message}</div>
{/if}
<br><br><br>

