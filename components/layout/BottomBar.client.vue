<template>
    <section :class="`bottom-bar ${bottomBarHiddenClass}`">
        <div class="bottom-bar-inner">
            <PlayerGlobal />
            <div
                class="bottom-bar-switch"
                @click="mainStore.toggleIsBottomBarOpen"
            >
                <o-icon
                    :icon="
                        mainStore.isBottomBarOpen
                            ? 'chevron-down'
                            : 'playlist-play'
                    "
                />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import PlayerGlobal from '~/components/audio/PlayerGlobal/PlayerGlobal.client.vue'

import { useMainStore } from '~/stores'
const mainStore = useMainStore()

const bottomBarHiddenClass = computed(() => {
    return mainStore.isBottomBarOpen ? '' : 'hidden'
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/_variables';

.bottom-bar {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: $primary;

    transition: bottom 0.5s;

    &.hidden {
        bottom: -50px;

        .bottom-bar-inner {
            .bottom-bar-switch {
                right: 10px;
            }
        }
    }

    .bottom-bar-inner {
        position: relative;
        .bottom-bar-switch {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 40px;
            width: 40px;
            background-color: $peach;
            right: -40px;
            top: -40px;

            border-top: 1px solid;
            border-left: 1px solid;
            border-right: 1px solid;
            border-color: $grey-lightest;

            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            z-index: -5;

            transition: right 0.5s;
            cursor: pointer;
        }
    }
}
</style>
