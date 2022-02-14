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
                    <a>
                        <span>Logout</span>
                    </a>
                </li>
            </ul>
            <p class="menu-label">Deejay</p>
            <ul class="menu-list">
                <li v-if="!djProfile" @click="closeSidebar">
                    <nuxt-link to="/djs/manage/new">
                        <o-icon icon="plus" size="small" />
                        <span>{{ $t('dj.create_profile') }}</span>
                    </nuxt-link>
                </li>
                <li v-else>
                    <o-icon icon="album" size="small" />
                    <span>{{ djProfile.name }}</span>
                    <ul>
                        <li @click="closeSidebar">
                            <nuxt-link :to="`/djs/${djProfile.slug}`">
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
                </li>
            </ul>
        </aside>
    </div>
</template>

<script>
import _ from 'lodash'
import { mapActions } from 'vuex'

export default {
    props: {
        open: Boolean
    },
    computed: {
        djProfile() {
            if (!_.isEmpty(this.$auth.user.djs)) {
                return this.$auth.user.djs[0]
            }
            return null
        }
    },
    methods: {
        ...mapActions(['setIsSidebarOpen']),
        async logout() {
            this.closeSidebar()
            await this.$auth.logout({
                data: {
                    refresh_token: this.$auth.strategy.refreshToken.get()
                }
            })
            this.$oruga.notification.open({
                message: this.$t('user.logout_success'),
                variant: 'success'
            })
        },
        // TBD - probably remove
        // navigate(url) {
        //     this.$router.push(url)
        //     this.setIsSidebarOpen(false)
        // },
        closeSidebar() {
            this.setIsSidebarOpen(false)
        }
    }
}
</script>
