<template>
    <UApp>
        <login-modal />
        <UModal v-model:open="mainStore.isPlaylistOpen" title="Playlist">
            <template #content>
                <div class="modal-card" style="width: auto">
                    <header class="modal-card-head">Playlist</header>
                    <section class="modal-card-body">
                        <Playlist />
                    </section>
                    <footer class="modal-card-foot">Footer</footer>
                </div>
            </template>
        </UModal>

        <USlideover
            v-if="getIsLoggedIn()"
            v-model:open="mainStore.isSidebarOpen"
            side="left"
        >
            <template #content>
                <SidebarMenu />
            </template>
        </USlideover>

        <Navbar />
        <slot style="margin-bottom: 100px" />
        <BottomBar />
    </UApp>
</template>

<script setup lang="ts">
import Navbar from '~/components/layout/Navbar.vue';
import SidebarMenu from '~/components/layout/SidebarMenu.client.vue';
import BottomBar from '~/components/layout/BottomBar.client.vue';
import Playlist from '~/components/audio/Playlist.client.vue';
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
