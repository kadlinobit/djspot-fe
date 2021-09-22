<template>
    <b-navbar type="is-dark">
        <template #brand>
            <b-navbar-item tag="nuxt-link" :to="{ path: '/' }">
                <img
                    src="https://i.pinimg.com/originals/4d/3c/85/4d3c854215785de0346ab378d497c2d9.png"
                    alt="Lightweight UI components for Vue.js based on Bulma"
                />
            </b-navbar-item>
            <b-navbar-item
                v-if="$strapi.user"
                class="is-hidden-desktop"
                @click="() => setIsSidebarOpen(true)"
            >
                <b-icon icon="account" />
            </b-navbar-item>
        </template>

        <!-- MAIN MENU -->
        <template #start>
            <b-navbar-item tag="nuxt-link" :to="{ path: '/djs' }">
                {{ $t('dj.djs') }}
            </b-navbar-item>
            <b-navbar-item tag="nuxt-link" :to="{ path: '/mixes' }">
                {{ $t('mix.mixes') }}
            </b-navbar-item>
        </template>

        <template #end>
            <language-selection />

            <b-navbar-item v-if="!$strapi.user" tag="div">
                <div class="buttons">
                    <nuxt-link class="button is-light" :to="{ path: '/login' }">
                        {{ $t('user.login') }}
                    </nuxt-link>
                </div>
            </b-navbar-item>
            <b-navbar-item v-else class="is-hidden-touch" @click="() => setIsSidebarOpen(true)">
                <b-icon icon="account" />
            </b-navbar-item>
        </template>
    </b-navbar>
</template>

<script>
import { mapActions } from 'vuex'
import LanguageSelection from '~/components/layout/LanguageSelection.vue'

export default {
    components: {
        LanguageSelection
    },
    methods: {
        ...mapActions(['setIsSidebarOpen'])
    }
}
</script>
