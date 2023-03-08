<script>
    import { onDestroy, onMount } from "svelte";
    import { fade } from 'svelte/transition';
    import AgcLogo from "../components/AGC-logo.svelte";
    import { baseURL, allObjects, allDesks, allMeetings, allPrinters, isLoading } from "../store/store";

    

 

    async function fetchData() {
        isLoading.set(true);

        try {
            const response = await fetch(`${baseURL}/api/objects`);
            const data = await response.json();

            console.log(data.Objects);

            // Filter by objectType
            const filteredDesks = data.Objects.filter(objects => objects.objectType === "desk")
            const filteredMeetings = data.Objects.filter(objects => objects.objectType === "meetingRoom")
            const filteredPrinters = data.Objects.filter(objects => objects.objectType === "printerRoom")

            allObjects.set(data.Objects)
            allDesks.set(filteredDesks);
            allMeetings.set(filteredMeetings);
            allPrinters.set(filteredPrinters)

        } catch (error) {
            console.error(error);
        } finally {
            isLoading.set(false); // use later
        }
    }



    onMount(() => {
        fetchData();
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
        <div class="home-logo"> <AgcLogo/> </div>

        <div class="home-text" style="margin-left: 10%;" transition:fade={{ duration: 800 }}> 
            Digital floor plan 
            <img src="/icon_plan_logo.jpg" style="border-radius: 50%;" alt=""> 
        </div>
        
        <div class="home-text" style="margin-right: 50%;" transition:fade={{ duration: 1200 }}> 
            Desks 
            <img src="/icon_desks_logo.jpg" style="border-radius: 50%;" alt=""> 
        </div> 
        
        <div class="home-text" style="margin-left: 25%;" transition:fade={{ duration: 1600 }}> 
            Buildings and Floors 
            <img src="/icon_building_logo.jpg" style="border-radius: 50%;" alt=""> 
        </div>

        <div class="home-text" style="margin-right: 25%;" transition:fade={{ duration: 2000 }}> 
            Rooms 
            <img src="/icon_rooms_logo.jpg" style="border-radius: 50%;" alt=""> 
        </div> 
    {/if}






<style>
    .home-logo {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    .home-text {
        display: flex;
        justify-content: center;
        font-family:Georgia, 'Times New Roman', Times, serif;
        font-size: 30px;
        margin-bottom: -20px;
        text-decoration: underline;
    }




  
</style>