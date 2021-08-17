<template>
    <div class="p-5">
        <b-menu>
            <b-menu-list label="Menu">
                <b-menu-item icon="account" label="User" @click="navigate('/user')"></b-menu-item>
                <b-menu-item icon="logout" label="Logout" @click="logout"></b-menu-item>
            </b-menu-list>
            <b-menu-list label="Deejay">
                <b-menu-item
                    v-if="!$strapi.user.dj"
                    icon="plus"
                    :label="$t('dj.create_profile')"
                    @click="navigate('/djs/manage/new')"
                />
            </b-menu-list>
        </b-menu>
    </div>
</template>

<script>
export default {
    props: {
        open: Boolean
    },
    methods: {
        async logout() {
            this.onCloseSidebar()
            await this.$strapi.logout()
            this.$router.push('/')
            this.$buefy.toast.open({
                message: this.$t('user.logout_success'),
                type: 'is-success'
            })
        },
        onCloseSidebar() {
            this.$nuxt.$emit('closeSidebar')
        },
        navigate(url) {
            this.$router.push(url)
            this.onCloseSidebar()
        }
    }
}
</script>
