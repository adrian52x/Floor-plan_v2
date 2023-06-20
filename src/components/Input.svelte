<script>
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
				value = selectedSuggestion;
				showSuggestions = false;
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
    	value = suggestion; // Update the search input value
		showSuggestions = false;
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
		<ul class="z-20 suggestion-list font-digits" bind:this={suggestionListContainer}>
			{#each suggestions as suggestion}
				<li on:click={() => handleSuggestionClick(suggestion)} on:keydown>
					<div class={`suggestion-list-item ${suggestion === selectedSuggestion ? 'bg-gray-100' : ''}`}>{suggestion}</div>
				</li> 
			{/each}
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
		width: 480px;
		border-radius: 5px;

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
