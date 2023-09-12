<script>
	import { page } from "$app/stores";
	import { goto } from '$app/navigation';

	export let value = '';
	export let placeholder = '';
	export let suggestions = [];

	let showSuggestions = true;
	let selectedSuggestion = null;

	let suggestionListContainer; // Reference to the suggestion list container

	// function handleKeyDown(event) {
	// 	if (event.key === 'Enter') {
	// 		// Handle the Enter key press
	// 		if(suggestions.length > 0){
	// 			value = suggestions[0];
	// 			showSuggestions = false;
	// 		} 
	// 	} else if (event.key === 'ArrowDown') {
	// 		value = suggestions[length]
	// 	} else if (event.key === 'ArrowUp'){
	// 		value = suggestions[length]
	// 	}
  	// }

	function handleKeyDown(event) {
		if (event.key === 'Enter') {
			// Handle the Enter key press
			if (suggestions.length > 0) {
				value = selectedSuggestion.name;
				showSuggestions = false;
				// Redirect to floor where the instrument is located if not found where it was searched
				if(!($page.params.building === selectedSuggestion.buildingName && +$page.params.floor === selectedSuggestion.floorLevel)){
					const newURL = `/${selectedSuggestion.buildingName}/${selectedSuggestion.floorLevel}`;
					window.location.href = newURL;	
				}
			}
		} else if (event.key === 'ArrowDown') {
			// Handle the Arrow Down key press
			if (suggestions.length > 0) {
				console.log(selectedSuggestion, suggestions);
				const currentIndex = suggestions.indexOf(selectedSuggestion); 
				const nextIndex = currentIndex === suggestions.length - 1 ? 0 : currentIndex + 1; 
				selectedSuggestion = suggestions[nextIndex];
				scrollActiveItemIntoView();
			
			}
		} else if (event.key === 'ArrowUp') {
			// Handle the Arrow Up key press
			if (suggestions.length > 0) {
				const currentIndex = suggestions.indexOf(selectedSuggestion);
				const previousIndex = currentIndex === 0 ? suggestions.length - 1 : currentIndex - 1;
				selectedSuggestion = suggestions[previousIndex];
				scrollActiveItemIntoView();
			}
		}
	}

	function scrollActiveItemIntoView() {
		if (suggestionListContainer && suggestionListContainer.children.length > 0) {
			const activeItem = suggestionListContainer.querySelector('.bg-gray-100');
				activeItem?.scrollIntoView({
					block: 'center',
					behavior: 'smooth',
				});
		}
  	}

	function handleSuggestionClick(suggestion) {
    	value = suggestion.name; // Update the search input value
		showSuggestions = false;

		
		// Redirect to floor where the instrument is located if not found where it was searched
		if(!($page.params.building === suggestion.buildingName && +$page.params.floor === suggestion.floorLevel)){
			const newURL = `/${suggestion.buildingName}/${suggestion.floorLevel}`;
			window.location.href = newURL;	
		}

  	}


	$: {
		if(value.length > 0){
			selectedSuggestion = suggestions[0];
		}
	}
</script>

	<input class="font-digits" bind:value {placeholder} on:input={() => showSuggestions = true} on:keydown={handleKeyDown}/>


	<!-- {#if showSuggestions && suggestions.length > 0}
		<ul class="suggestion-list font-digits">
			{#each suggestions as suggestion}
				<li class="flex justify-between" on:click={() => handleSuggestionClick(suggestion)} on:keydown>
					{suggestion}
					<span class="text-right">room</span>
				</li> 
			{/each}
		</ul>
	{/if} -->

	{#if showSuggestions && suggestions.length > 0}
		<ul class="z-20 suggestion-list font-defaultText" bind:this={suggestionListContainer}>
			<table class="suggestion-list-table w-full">
			{#each suggestions as suggestion}
				<li on:click={() => handleSuggestionClick(suggestion)} on:keydown>
					<div class={`suggestion-list-item ${suggestion === selectedSuggestion ? 'bg-gray-100' : ''}`}>
						
						
						<tr>

							<td class="w-2/5">
								{suggestion.name} 
							</td>

							<td class="w-35">
								<span class="pl-4 text-xs italic">- {suggestion.type.slice(0,5)}.</span>
								{#if suggestion.type === 'Instrument'}
									<iconify-icon class="h-3" icon="pajamas:api" ></iconify-icon>
								{:else if suggestion.type === 'PC'}	
									<iconify-icon class="h-3" icon="icon-park-twotone:new-computer" ></iconify-icon>
								{:else if suggestion.type === 'Network point'}		
									<iconify-icon class="h-3" icon="icon-park-twotone:network-tree" ></iconify-icon>
								{/if}
							</td>
						
						
							
								<td class={`w-1/4  ${($page.params.building === suggestion.buildingName && +$page.params.floor === suggestion.floorLevel) ? 'bg-green-200' : ' ' } `}>
									<span class="px-2 text-xs italic"> {suggestion.buildingName} / {suggestion.floorLevel} </span>
								</td>
							
						
					</tr>
				
					</div>
				</li> 
			{/each}
		</table>
		</ul>
	{/if}


<style lang="scss">

	input {
		color: inherit;
		background-color: transparent;
		border: 1px solid rgb(214, 206, 206);
		padding: 10px 20px;
		border-radius: 5px;
		flex: 1;
		font-size: 1.15em;
        margin-bottom: 25px;
		max-width: 500px;

		&:focus {
			outline: 1px solid rgb(0, 0, 0);
		}
	}

	.suggestion-list {
		max-height: 100px; /* Adjust the height as needed */
		overflow-y: auto;
		position: absolute;
		background-color: #fff;
		border: 1px solid #ccc;
		border-top: none;
		list-style-type: none;
		padding: 0;
		margin-top: 40px;
		//width: fit-content;
		width: 500px;
		border-radius: 5px;

		 @media (max-width: 1800px) {
				width: 450px;
	        }
            @media (max-width: 1200px) {
				width: 450px;
				
	        }
            @media (max-width: 1080px) {
				width: 400px;
				//margin-left: -50px;
	        }

		&-item {
            padding-left: 15px;
			cursor: pointer;
        }
		&-item:hover {
            background-color: #f5f5f5;
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
