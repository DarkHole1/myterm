<script lang="ts">
    import TvBlock from "../blocks/TVBlock.svelte";
    import CommonCollapse from "./CommonCollapse.svelte";

    let data = [{ name: "Foo" }, { name: "Bar" }];
</script>

<CommonCollapse title="TVs">
    {#each data as tvData}
        <TvBlock {tvData} />
    {/each}
</CommonCollapse>
