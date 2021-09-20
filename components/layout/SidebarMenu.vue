<template>
    <div class="p-5">
        <b-menu :activable="false">
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

                <b-menu-item v-if="$strapi.user.dj" icon="album" :active="false" expanded>
                    <template #label="props">
                        {{ $strapi.user.dj.name }}
                        <b-icon
                            class="is-pulled-right"
                            :icon="props.expanded ? 'menu-down' : 'menu-up'"
                        ></b-icon>
                    </template>
                    <b-menu-item
                        icon="account-box"
                        :label="$t('dj.profile')"
                        @click="navigate(`/djs/${$strapi.user.dj.slug}`)"
                    ></b-menu-item>
                    <b-menu-item
                        icon="plus"
                        :label="$t('mix.add_mix')"
                        @click="navigate(`/mixes/manage/new`)"
                    ></b-menu-item>
                </b-menu-item>
            </b-menu-list>
        </b-menu>
    </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    props: {
        open: Boolean
    },
    methods: {
        ...mapActions(['setIsSidebarOpen']),
        async logout() {
            this.setIsSidebarOpen(false)
            await this.$strapi.logout()
            this.$router.push('/')
            this.$buefy.toast.open({
                message: this.$t('user.logout_success'),
                type: 'is-success'
            })
        },
        navigate(url) {
            this.$router.push(url)
            this.setIsSidebarOpen(false)
        }
    }
}
</script>
