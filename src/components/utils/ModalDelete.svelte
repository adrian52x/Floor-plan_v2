<script>
    import { createEventDispatcher, onDestroy, onMount, afterUpdate } from 'svelte';
    import { baseURL } from '../../store/store';
  
    export let activeTab;
    export let modalItem;
    export let modalActionSuccess;

    let deleteStatus = null;

    let roomInstruments = [];


    $: {
        if (modalItem && modalItem.activeTab === "Rooms") {
            showRoomInstruments();
        }
    }


   


    const deleteRoom = async ()  => {
        try {
            const response = await fetch(`${baseURL}/api/rooms/${modalItem._id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete room');
        }

            modalActionSuccess();
            deleteStatus = "Success";
            console.log('Room deleted successfully');
        } catch (error) {
            console.error(error);
        }
    }

    const deleteDepartment = async ()  => {
        try {
            const response = await fetch(`${baseURL}/api/departments/${modalItem._id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete department');
        }

            modalActionSuccess();
            deleteStatus = "Success";
            console.log('Department deleted successfully');
        } catch (error) {
            console.error(error);
        }
    }

    const showRoomInstruments = async () => {
        fetch(`${baseURL}/api/1room-instruments?roomName=${modalItem.name}`)
        .then(response => response.json())
        .then(data => {
            roomInstruments = data;
            console.log(roomInstruments);
        })
        .catch(error => {
            console.log(error.message);
        });
    }




const dispatch = createEventDispatcher();
    function handleYes() {
      dispatch('confirm', true);
    }
  
</script>


{#if activeTab == "Rooms"}
    <div>
        <div class="text-xl font-semibold text-red-600">Delete this room?</div>
        <div class="text-lg font-semibold text-red-400">It will also unassign all instrumuents associated with this room</div>
        
        {#if roomInstruments?.instruments?.length > 0}
				{#each roomInstruments?.instruments as instrument}
					<div class="font-defaultText px-2 py-4 text-m text-left">{instrument.name}</div>
				{/each}
			
			{:else}
				<div class="font-defaultText px-2 py-4 text-sm text-left">No Instruments</div>
		{/if}
        

        <button on:click={deleteRoom} class="border-4 py-1 px-2 my-4 rounded-xl font-semibold  hover:border-red-400">Delete</button>

        {#if deleteStatus == "Success"}
            <div class="font-semibold text-green-600">Room deleted successfully</div>
        {/if}
    </div>


{:else if activeTab == "Departments"}
    <div>
        <div class="text-xl font-semibold text-red-600">Delete this department?</div>
        
        <button on:click={deleteDepartment} class="border-4 py-1 px-2 my-4 rounded-xl font-semibold  hover:border-red-400">Delete</button>

        {#if deleteStatus == "Success"}
            <div class="font-semibold text-green-600">Department deleted successfully</div>
        {/if}
    </div>
{:else if activeTab == "Instruments"}
    <div>
        <p>Delete this instrument?</p>
        <button on:click={handleYes}>Confirm</button>
    </div>

{/if}
  



  