<template>
    <div class="container">
        <slot />
    </div>
</template>

<style>
    .container {
        padding-right: 15px;
        padding-left: 15px;
        margin-right: auto;
        margin-left: auto;

        display: flex;
        flex-wrap: wrap;
        /* justify-content: space-around; */
        flex-direction: column;
    }
    @media (min-width: 768px) {
        .container {
            width: 750px;
        }
    }
    @media (min-width: 992px) {
        .container {
            width: 970px;
        }
    }
    @media (min-width: 1200px) {
        .container {
            width: 1170px;
        }
    }
</style>
