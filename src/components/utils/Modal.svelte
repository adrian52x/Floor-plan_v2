<script>
	import CloseButtonX from "./closeButtonX.svelte";
	export let showModal; // boolean

	let dialog; // HTMLDialogElement

	$: if (dialog && showModal) dialog.showModal();


	// from dialog line 17 - on:click|self={() => dialog.close()}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
>
	<div on:click|stopPropagation class="h-full">
		<div class="flex justify-between">
			<slot name="header" />
			<button on:click={() => dialog.close()}> <CloseButtonX width={35} height={35}/> </button>
		</div>
		<hr/> <br> 
		<slot />
		
	</div>
</dialog>

<style lang="scss">
	dialog {
		background-color: ghostwhite;
		width: 380px;
		height: 75%;
		margin-bottom: 100px;
		margin-right: 0;
		border-radius: 0.5em;
		border: none;
		//padding: 0;
		padding: 0rem 0.5rem;

		@media (max-width: 1600px) {
			width: 350px;
            zoom: 0.8;
	    }
		@media (max-width: 1200px) {
			width: 320px;
            zoom: 0.6;
		}
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
		display: block;
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
