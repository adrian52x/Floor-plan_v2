<script>
    import { fly } from 'svelte/transition';
    import Input from '../../components/Input.svelte';


    let search = '';
</script>


<div class="fixed bg-gray-100 border-r-2 shadow-lg w-full h-full" transition:fly={{x: -1000, opacity: 1}}>
    <main>

        <div class="tabs">
            <button class="tab font-digits hover:underline">Search instruments </button>
        </div>    



        <div class="card">
        

            <div class="projects">
                <div class="projects-search">
                    <Input bind:value={search} placeholder="Enter keywords..." />
                </div>
               
               
                
            </div>
            
        </div>
    </main>

</div>

<style lang="scss">

.projects {
		display: flex;
		flex-direction: column;


		&-search {
			display: flex;
			justify-content: stretch;
			padding: 0px 10px;
		}
}

main {
    margin-top: 20px;    
    display: flex;
    flex-direction: column;
    align-items: center;
}

.card {
  box-shadow: 0px 4px 8px rgba(129, 128, 128, 0.2);
  margin-left: -100px;
  border-radius: 8px;
  width: 50%;
  margin-bottom: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.tabs {
    margin-left: -100px;
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 1rem;
}

.tab {
    background-color: transparent;
    border: none;
    color: #333;
    cursor: pointer;
    font-size: 1.25rem;
    padding: 0.5rem 1rem;
    text-align: center;
    text-transform: uppercase;
}



</style>