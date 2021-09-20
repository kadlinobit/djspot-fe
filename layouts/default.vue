<template>
    <div class="app">
        <b-modal
            trap-focus
            :destroy-on-hide="false"
            aria-role="dialog"
            aria-label="Example Modal"
            aria-modal
            :active="isPlaylistOpen"
            @close="() => setIsPlaylistOpen(false)"
        >
            <!--<template #default="props">
                <modal-form v-bind="formProps" @close="props.close"></modal-form>

            </template>-->
            <template #default>
                <div class="modal-card" style="width: auto">
                    <header class="modal-card-head">Playlist</header>
                    <section class="modal-card-body">
                        <Playlist />
                    </section>
                    <footer class="modal-card-foot">Footer</footer>
                </div>
            </template>
        </b-modal>
        <b-sidebar
            v-if="$strapi.user"
            type="is-light"
            :fullheight="true"
            :fullwidth="false"
            :overlay="true"
            :right="false"
            :open="isSidebarOpen"
            @close="() => setIsSidebarOpen(false)"
        >
            <SidebarMenu />
        </b-sidebar>
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
export default {
    components: {
        Navbar,
        SidebarMenu,
        BottomBar,
        Playlist
    },
    computed: {
        ...mapGetters(['isSidebarOpen', 'isPlaylistOpen'])
    },
    methods: {
        ...mapActions(['setIsSidebarOpen', 'setIsPlaylistOpen'])
    }
}
</script>
