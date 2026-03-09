<template>
    <div class="app">
        <login-modal />
        <o-modal
            trap-focus
            :destroy-on-hide="false"
            content-class="modal-content"
            aria-role="dialog"
            aria-label="Playlist modal"
            aria-modal
            :active="mainStore.isPlaylistOpen"
            @close="() => (mainStore.isPlaylistOpen = false)"
        >
            <template #default>
                <div class="modal-card" style="width: auto">
                    <header class="modal-card-head">Playlist</header>
                    <section class="modal-card-body">
                        <Playlist />
                    </section>
                    <footer class="modal-card-foot">Footer</footer>
                </div>
            </template>
        </o-modal>

        <o-sidebar
            v-if="getIsLoggedIn()"
            variant="dark"
            :fullheight="true"
            :fullwidth="false"
            :overlay="true"
            :right="false"
            v-model:active="mainStore.isSidebarOpen"
            @close="() => (mainStore.isSidebarOpen = false)"
        >
            <SidebarMenu />
        </o-sidebar>

        <Navbar />
        <slot style="margin-bottom: 100px"></slot>
        <BottomBar />
    </div>
</template>

<script setup lang="ts">
import Navbar from '~~/components/layout/Navbar.client.vue';
import SidebarMenu from '~~/components/layout/SidebarMenu.client.vue';
import BottomBar from '~~/components/layout/BottomBar.client.vue';
import Playlist from '~~/components/audio/Playlist.client.vue';
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
