<template>
    <section class="bottom-bar">
        <GlobalPlayer />
    </section>
</template>

<script>
import GlobalPlayer from '~/components/audio/PlayerGlobal/PlayerGlobal.vue'
export default {
    components: {
        GlobalPlayer
    }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/_variables';

.bottom-bar {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: $primary;
}
</style>
