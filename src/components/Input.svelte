<script>
	export let value = '';
	export let placeholder = '';
	export let suggestions = [];

	let showSuggestions = true;

	function handleSuggestionClick(suggestion) {
    	value = suggestion; // Update the search input value
		showSuggestions = false;
		
  	}
</script>

	<input bind:value {placeholder} on:input={() => showSuggestions = true} />


	{#if showSuggestions && suggestions.length > 0}
		<ul class="suggestion-list">
			{#each suggestions as suggestion}
			<li on:click={() => handleSuggestionClick(suggestion)} on:keydown>{suggestion}</li>
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
	max-height: 65px; /* Adjust the height as needed */
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
  }

  .suggestion-list li {
    padding-left: 10px;
	height: 20px;
    cursor: pointer;
  }

  .suggestion-list li:hover {
    background-color: #f5f5f5;
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
