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
            :active="isPlaylistOpen"
            @close="() => setIsPlaylistOpen(false)"
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
            v-if="$strapi.user"
            variant="light"
            :fullheight="true"
            :fullwidth="false"
            :overlay="true"
            :right="false"
            :open="isSidebarOpen"
            @close="() => setIsSidebarOpen(false)"
        >
            <SidebarMenu />
        </o-sidebar>
        <Navbar />
        <nuxt style="margin-bottom: 100px" />
        <BottomBar />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Navbar from '~/components/layout/Navbar.vue'
import SidebarMenu from '~/components/layout/SidebarMenu.vue'
import BottomBar from '~/components/layout/BottomBar.vue'
import Playlist from '~/components/audio/Playlist.vue'
import LoginModal from '~/components/login/LoginModal.vue'

export default {
    components: {
        Navbar,
        SidebarMenu,
        BottomBar,
        Playlist,
        LoginModal
    },
    computed: {
        ...mapGetters(['isSidebarOpen', 'isPlaylistOpen'])
    },
    methods: {
        ...mapActions(['setIsSidebarOpen', 'setIsPlaylistOpen'])
    }
}
</script>

<style lang="scss">
@import '~/assets/scss/_variables';
html {
    background-color: $light;
}
</style>
