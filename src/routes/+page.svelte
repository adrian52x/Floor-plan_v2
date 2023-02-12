<script>
    import { onDestroy } from "svelte";
    import {  fade } from 'svelte/transition';
    import AgcLogo from "../components/AGC-logo.svelte";

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

        <div class="home-text" style="margin-left: 20%;" transition:fade={{ duration: 800 }}> 
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

        <div class="home-text" style="margin-right: 35%;" transition:fade={{ duration: 2000 }}> 
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
    }

    .desk-text {
        display: flex;
        justify-content: center;
        font-family:Georgia, 'Times New Roman', Times, serif;
        font-size: 28px;
        margin-right: 40%;
    }


  
</style>