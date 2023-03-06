<script lang="ts">
    import TvBlock from "../blocks/TVBlock.svelte";
    import CommonCollapse from "./CommonCollapse.svelte";
    import API from "../../API";

    const { tvs } = API 
</script>

<CommonCollapse title="TVs">
    {#each $tvs as tvData}
        <TvBlock {tvData} />
    {/each}
</CommonCollapse>
