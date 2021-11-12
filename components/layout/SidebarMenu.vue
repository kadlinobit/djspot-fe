<template>
    <div class="p-5">
        <aside class="menu">
            <p class="menu-label">Menu</p>
            <ul class="menu-list">
                <li @click="closeSidebar">
                    <nuxt-link to="/user">
                        <o-icon icon="account" size="small" />
                        <span>User</span>
                    </nuxt-link>
                </li>
                <li @click="logout">
                    <nuxt-link to="/">
                        <span>Logout</span>
                    </nuxt-link>
                </li>
            </ul>
            <p class="menu-label">Deejay</p>
            <ul class="menu-list">
                <li v-if="!$strapi.user.dj" @click="closeSidebar">
                    <nuxt-link to="/djs/manage/new">
                        <o-icon icon="plus" size="small" />
                        <span>{{ $t('dj.create_profile') }}</span>
                    </nuxt-link>
                </li>
                <li v-else>
                    <span>
                        <o-icon icon="album" size="small" />
                        <span>{{ $strapi.user.dj.name }}</span>
                        <ul>
                            <li @click="closeSidebar">
                                <nuxt-link :to="`/djs/${$strapi.user.dj.slug}`">
                                    <o-icon icon="account-box" size="small" />
                                    <span>{{ $t('dj.profile') }}</span>
                                </nuxt-link>
                            </li>
                            <li @click="closeSidebar">
                                <nuxt-link to="/sounds/manage/new">
                                    <o-icon icon="plus" size="small" />
                                    <span>{{ $t('sound.add') }}</span>
                                </nuxt-link>
                            </li>
                        </ul>
                    </span>
                </li>
            </ul>
        </aside>
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
            this.closeSidebar()
            await this.$strapi.logout()
            this.$router.push('/')
            this.$oruga.notification.open({
                message: this.$t('user.logout_success'),
                variant: 'success'
            })
        },
        navigate(url) {
            this.$router.push(url)
            this.setIsSidebarOpen(false)
        },
        closeSidebar() {
            this.setIsSidebarOpen(false)
        }
    }
}
</script>
