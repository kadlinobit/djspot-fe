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
            v-if="auth.user"
            variant="light"
            :fullheight="true"
            :fullwidth="false"
            :overlay="true"
            :right="false"
            :open="mainStore.isSidebarOpen"
            @close="() => (mainStore.isSidebarOpen = false)"
        >
            <SidebarMenu />
        </o-sidebar>
        <Navbar />
        <nuxt style="margin-bottom: 100px" />
        <client-only>
            <BottomBar />
        </client-only>
    </div>
</template>

<script setup lang="ts">
import Navbar from '~/components/layout/Navbar.vue'
import SidebarMenu from '~/components/layout/SidebarMenu.vue'
import BottomBar from '~/components/layout/BottomBar.vue'
import Playlist from '~/components/audio/Playlist.vue'
import LoginModal from '~/components/login/LoginModal.vue'

import { useMainStore } from '~/stores'
import { useAuth } from '~/composables/directus'
const mainStore = useMainStore()
const auth = useAuth()

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
    }
}
</script>

<style lang="scss">
@import '~/assets/scss/_variables';
html {
    background-color: $light;
}
</style>
