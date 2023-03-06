<script lang="ts">
	import Container from "./components/Container.svelte";
	import API from "./API";
	import LoginModal from "./components/modals/LoginModal.svelte";
	import Spinner from "./components/Spinner.svelte";
	import Topbar from "./components/Topbar.svelte";
	import TVCollapse from "./components/collapses/TVCollapse.svelte";
	const { loading } = API;

	function handleLogin() {
		API.loggedIn = API.loggedIn;
	}
</script>

{#if API.loggedIn}
	<Topbar />
{/if}
<Container>
	{#if $loading}
		<Spinner />
	{:else if !API.loggedIn}
		<LoginModal on:login={handleLogin} />
	{:else}
		<div class="gap" />
		<TVCollapse />
	{/if}
</Container>

<style>
	@import url("https://fonts.googleapis.com/css2?family=Ubuntu+Mono&display=swap");

	:root {
		--background-color: #161616;
		--block-color: #1d1d1d;
		--block-highlight-color: #2d2d2d;
		--danger-color: #f8535a;
		--main-color: #0568fa;
		--font-color: #ededed;
	}

	:global(body) {
		font-family: "Ubuntu Mono", monospace;
		background: var(--background-color);
		padding: 0;
	}
	.gap {
		margin-top: 1rem;
	}
</style>
