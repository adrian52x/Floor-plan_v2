<script>
    import { onDestroy, onMount } from "svelte";
    import AgcLogo from "../components/AGC-logo.svelte";
    import { baseURL, allObjects, allDesks, allMeetings, allPrinters } from "../store/store";

    //NEW
    import { buildings } from "../store/data";
    import BuildingCard from "../components/BuildingCard.svelte";

    

 

    // async function fetchData() {

    //     try {
    //         const response = await fetch(`${baseURL}/api/objects`);
    //         const data = await response.json();

    //         console.log(data.Objects);

    //         // Filter by objectType
    //         const filteredDesks = data.Objects.filter(objects => objects.objectType === "desk")
    //         const filteredMeetings = data.Objects.filter(objects => objects.objectType === "meetingRoom")
    //         const filteredPrinters = data.Objects.filter(objects => objects.objectType === "printerRoom")

    //         allObjects.set(data.Objects)
    //         allDesks.set(filteredDesks);
    //         allMeetings.set(filteredMeetings);
    //         allPrinters.set(filteredPrinters)

    //     } catch (error) {
    //         console.error(error);
    //     } 
    // }



    onMount(() => {
        //fetchData();
    });

    let show = false;

    const interval = setInterval(() => {
        show = true
    }, 300);

    onDestroy(() => {
        clearInterval(interval);
    });
</script>



    {#if show}
        <div class="home-head-contents">  
             
            <div class="home-logo">  
                <AgcLogo/> 
            </div> 
            
            <div class="home-text font-newText">  
                Floor plans
            </div> 
        
        
        </div>        
    {/if}


    <div class="card-container">
        {#each buildings as building }
                <BuildingCard  building = {building} />
        {/each}
    </div>






<style>

.home-head-contents {
    display: flex;
    flex-direction: row;
        
        
}

.home-logo {
    position: absolute;
    top: -20px;
    right: 50px;
    padding-top: 10px;
}

.home-text {
    position: absolute;
    top: -5px;
    right: 300px;
    padding-top: 10px;
}

.card-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    max-width: 850px; /* adjust the maximum width to your liking */
    margin: 0 auto;
}


  
  



  
</style>