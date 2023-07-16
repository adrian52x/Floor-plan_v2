<script>
    import { createEventDispatcher } from 'svelte';
  
    export let activeTab;
    const dispatch = createEventDispatcher();
  
    function handleYes() {
      dispatch('confirm', true);
    }
  
</script>


{#if activeTab == "Rooms"}
    <div>
        <p>Delete this room?</p>
        <p>It will also unassign all instrumuents associated with this room</p>
        <button on:click={handleYes}>Confirm</button>
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
  
  