<script>

    export let activeTab;
    export let modalItem;

    function handleUpdate() {
     
    }
  
</script>

<div>
    Update
</div>


{#if activeTab == "Rooms"}
    <div>
        <!-- <div class="bg-blue-200" style={`position: absolute; left: ${modalItem.position.left}px; top: ${modalItem.position.top}px; width: ${modalItem.position.width}px; height: ${modalItem.position.height}px;`}>
            <div class="z-10 mb-4 cursor-pointer font-defaultText">{modalItem.name} </div>
        </div> -->
        <form>
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" value={modalItem.name} />
          
            <label for="type">Type:</label>
            <input type="text" id="type" name="type" value={modalItem.type} />
          
            {#if modalItem.position}
                <div>Position</div>
                {#each modalItem.position as position }
                    <label for="type">left:</label>
                    <input type="text" id="type" name="type" value={position.left} />

                    <label for="type">top:</label>
                    <input type="text" id="type" name="type" value={position.top} />

                    <label for="type">width:</label>
                    <input type="text" id="type" name="type" value={position.width} />

                    <label for="type">height:</label>
                    <input type="text" id="type" name="type" value={position.height} />
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