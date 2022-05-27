<script lang="ts">
	import Container from "./components/Container.svelte";
	import ServerCollapse from "./components/ServerCollapse.svelte";
	import API from "./API";
	import UsersCollapse from "./components/UsersCollapse.svelte";
	import UserModal from "./components/UserModal.svelte";
	import RestartModal from "./components/RestartModal.svelte";
	import EditModal from "./components/EditModal.svelte";
	import PermissionsModal from "./components/PermissionsModal.svelte";
	import LoginModal from "./components/LoginModal.svelte";
	import Button from "./components/Button.svelte";
	import Spinner from "./components/Spinner.svelte";
	import Topbar from "./components/Topbar.svelte";
import RolesCollapse from "./components/RolesCollapse.svelte";
import RenameModal from "./components/RenameModal .svelte";
	const { servers, loading } = API;

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
		<div class="gap"></div>
		{#if API.isAdmin}
			<RolesCollapse />
			<UsersCollapse />
		{/if}
		{#each $servers as server}
			<ServerCollapse {server} />
		{/each}
		<RenameModal />
		<UserModal />
		<RestartModal />
		<EditModal />
		<PermissionsModal />
	{/if}
</Container>

<style>
	@import url("https://fonts.googleapis.com/css2?family=Ubuntu+Mono&display=swap");
	/* @import url("https://use.fontawesome.com/releases/v5.15.3/css/all.css"); */

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
