<template>
    <div>
        <section>
            <b-sidebar
                v-if="$strapi.user"
                v-model="sidebarOpen"
                type="is-light"
                :fullheight="true"
                :fullwidth="false"
                :overlay="true"
                :right="false"
            >
                <SidebarMenu />
            </b-sidebar>
        </section>
        <Navbar />
        <nuxt />
    </div>
</template>

<script>
import Navbar from '~/components/Navbar'
import SidebarMenu from '~/components/SidebarMenu'

export default {
    components: {
        Navbar,
        SidebarMenu
    },
    data() {
        return {
            sidebarOpen: false
        }
    },
    created() {
        this.$nuxt.$on('closeSidebar', this.onSidebarClose)
        this.$nuxt.$on('openSidebar', this.onSidebarOpen)
    },
    beforeDestroy() {
        this.$nuxt.$off('closeSidebar')
        this.$nuxt.$off('openSidebar')
    },
    methods: {
        onSidebarOpen() {
            this.sidebarOpen = true
        },
        onSidebarClose() {
            this.sidebarOpen = false
        }
    }
}
</script>
