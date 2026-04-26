<template>
    <UApp>
        <login-modal />
        <SidebarMenu v-if="getIsLoggedIn()" />
        <PlaylistSlideover />
        <Navbar />
        <div class="pb-24">
            <slot />
        </div>
        <BottomBar />
    </UApp>
</template>

<script setup lang="ts">
import Navbar from '~/components/layout/Navbar.vue';
import SidebarMenu from '~/components/layout/SidebarMenu.client.vue';
import PlaylistSlideover from '~/components/layout/PlaylistSlideover.client.vue';
import BottomBar from '~/components/layout/BottomBar.client.vue';
import LoginModal from '~/components/login/LoginModal.vue';

import { useMainStore, useUserStore } from '~/stores';
const mainStore = useMainStore();
const { getIsLoggedIn } = useUserStore();

// TODO - Rewrite to new useHead composable (but there is a problem with @vueuse/head)
function head() {
    return {
        htmlAttrs: {
            class:
                mainStore.isPlaylistOpen ||
                mainStore.isLoginOpen ||
                mainStore.isSidebarOpen
                    ? 'is-clipped'
                    : ''
        }
    };
}
</script>

<style lang="scss">
// @import '~/assets/scss/_variables';
// html {
//     background-color: $dark;
// }
</style>
