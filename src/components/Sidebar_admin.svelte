<script>
    import { fly } from 'svelte/transition';
    import { buildings } from '../store/data.js'
	import Spinner from './Spinner.svelte';
	import { onDestroy } from 'svelte';

   
	
</script>
    
    <nav class="z-50 fixed bg-gray-100 border-r-2 shadow-lg" transition:fly={{x: 400, opacity: 1}}>

		

		<div class="flex justify-end w-full font-defaultText"> ADMIN </div>
    

	</nav>
    
<style lang="scss">
	nav {
		top: 0;
		right: 0;
		height: 100%;
		padding: 2rem 1rem 0.6rem;
		overflow-y: auto;
		width: 380px;
		display: inline-block;

		@media (max-width: 1600px) {
			width: 350px;
            zoom: 0.8;
	    }
		@media (max-width: 1200px) {
			width: 320px;
            zoom: 0.6;
		}
	}
    
	::-webkit-scrollbar {
      	width: 6px;
      	background-color: #ffffffe7;
    }
    
    ::-webkit-scrollbar-thumb {
      	background-color: #d3d3d3;
		border-radius: 10px;
    }
    
    
    ::-webkit-scrollbar-thumb:hover {
      	background-color: #b8b8b8;
      	width: 15px;
    }
</style>