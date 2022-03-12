<script lang="ts">
	import Container from "./components/Container.svelte";
	import ServerCollapse from "./components/ServerCollapse.svelte";

	let servers = [{
		name: "1"
	}, {
		name: "2"
	}];
</script>

<Container>
	{#each servers as server}
		<ServerCollapse {server} />
	{/each}
</Container>

<style>
	@import url("https://fonts.googleapis.com/css2?family=Ubuntu+Mono&display=swap");
	/* @import url("https://use.fontawesome.com/releases/v5.15.3/css/all.css"); */

	:global(body) {
		font-family: "Ubuntu Mono", monospace;
		background: #313131;
	}
</style>
