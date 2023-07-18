<script>
    import { createEventDispatcher } from 'svelte';
    import { baseURL } from '../../store/store';
  
    export let activeTab;
    export let modalItem;
    export let modalActionSuccess;

    let deleteStatus = null;

    const dispatch = createEventDispatcher();
    function handleYes() {
      dispatch('confirm', true);
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


  
</script>


{#if activeTab == "Rooms"}
    <div>
        <div class="text-xl font-semibold text-red-600">Delete this room?</div>
        <div class="text-lg font-semibold text-red-400">It will also unassign all instrumuents associated with this room</div>

        <button on:click={deleteRoom} class="border-4 py-1 px-2 my-4 rounded-xl font-semibold  hover:border-red-400">Delete</button>

        {#if deleteStatus == "Success"}
            <div class="font-semibold text-green-600">Room deleted successfully</div>
        {/if}
    </div>


{:else if activeTab == "Departments"}
    <div>
        <p>Delete this department?</p>
        <button on:click={handleYes}>Confirm</button>
    </div>
{:else if activeTab == "Instruments"}
    <div>
        <p>Delete this instrument?</p>
        <button on:click={handleYes}>Confirm</button>
    </div>

{/if}
  



  