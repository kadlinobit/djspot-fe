<template>
    <b-navbar type="is-dark" spaced>
        <template #brand>
            <b-navbar-item tag="nuxt-link" :to="{ path: '/' }">
                <img
                    src="https://i.pinimg.com/originals/4d/3c/85/4d3c854215785de0346ab378d497c2d9.png"
                    alt="Lightweight UI components for Vue.js based on Bulma"
                />
            </b-navbar-item>
        </template>

        <template #start> </template>

        <template #end>
            <language-selection />

            <b-navbar-item v-if="!isAuthenticated" tag="div">
                <div class="buttons">
                    <nuxt-link
                        class="button is-primary"
                        :to="{ path: '/register' }"
                    >
                        Register
                    </nuxt-link>
                    <nuxt-link class="button is-light" :to="{ path: '/login' }">
                        Log in
                    </nuxt-link>
                </div>
            </b-navbar-item>
            <b-navbar-dropdown v-else :label="loggedInUser.username">
                <b-navbar-item href="/user">User profile</b-navbar-item>
                <b-navbar-item @click="logout">Logout</b-navbar-item>
            </b-navbar-dropdown>
        </template>
    </b-navbar>
</template>

<script>
import { mapGetters } from 'vuex'
import LanguageSelection from './LanguageSelection.vue'

export default {
    components: {
        LanguageSelection
    },
    computed: {
        ...mapGetters(['isAuthenticated', 'loggedInUser'])
    },
    methods: {
        async logout() {
            await this.$auth.logout()
        }
    }
}
</script>
