<script>
	export let value = '';
	export let placeholder = '';
</script>

<input bind:value {placeholder} />

<style lang="scss">
	input {
		color: inherit;
		background-color: transparent;
		border: 1px solid rgb(214, 206, 206);
		padding: 10px 20px;
		border-radius: 15px;
		flex: 1;
		font-size: 1.15em;
        margin-bottom: 25px;

		&:focus {
			outline: 1px solid rgb(168, 211, 162);
		}
	}
</style>
