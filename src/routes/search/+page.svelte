<script>
    import { page } from "$app/stores";
    import { fly } from 'svelte/transition';
    console.log($page.params);
</script>

<div class="z-10 fixed bg-gray-100 border-r-2 shadow-lg" transition:fly={{x: -400, opacity: 1}}> 

    <p>Text</p>

</div>