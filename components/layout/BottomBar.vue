<template>
    <section class="bottom-bar">
        <GlobalPlayer />
    </section>
</template>

<script>
import GlobalPlayer from '~/components/audio/PlayerGlobal.vue'
export default {
    components: {
        GlobalPlayer
    }
}
</script>

<style lang="scss" scoped>
.bottom-bar {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #fefefe;
}
</style>
