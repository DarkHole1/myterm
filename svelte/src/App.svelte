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
	const { servers } = API;
</script>

<Container>
	{#if !API.loggedIn}
		<LoginModal />
	{:else}
		{#if API.isAdmin}
			<UsersCollapse />
		{/if}
		{#each $servers as server}
			<ServerCollapse {server} />
		{/each}
		<UserModal />
		<RestartModal />
		<EditModal />
		<PermissionsModal />
	{/if}
</Container>

<style>
	@import url("https://fonts.googleapis.com/css2?family=Ubuntu+Mono&display=swap");
	/* @import url("https://use.fontawesome.com/releases/v5.15.3/css/all.css"); */

	:global(body) {
		font-family: "Ubuntu Mono", monospace;
		background: #313131;
	}
</style>
