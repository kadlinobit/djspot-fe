<template>
    <nav
        class="navbar is-primary"
        role="navigation"
        aria-label="main navigation"
    >
        <div class="navbar-brand">
            <nuxt-link class="navbar-item" to="/">
                <img
                    src="https://bulma.io/images/bulma-logo.png"
                    width="112"
                    height="28"
                />
            </nuxt-link>
            <a
                v-if="auth.loggedIn.value"
                class="navbar-item"
                @click="() => (mainStore.isSidebarOpen = true)"
            >
                <o-icon icon="account" />
            </a>
            <a
                role="button"
                class="navbar-burger"
                :class="{ 'is-active': isMenuExpanded }"
                aria-label="menu"
                aria-expanded="false"
                data-target="navbar-main-menu"
                @click.stop="toggleIsMenuExpanded"
            >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div
            id="navbar-main-menu"
            class="navbar-menu"
            :class="{ 'is-active': isMenuExpanded }"
        >
            <div class="navbar-start">
                <nuxt-link class="navbar-item" to="/djs">{{
                    $i18n.t('dj.djs')
                }}</nuxt-link>
                <nuxt-link class="navbar-item" to="/sounds">{{
                    $i18n.t('sound.sounds')
                }}</nuxt-link>
            </div>
            <div class="navbar-end">
                <language-selection />
                <div v-if="!auth.loggedIn.value" class="navbar-item">
                    <div class="buttons">
                        <a class="button is-light" @click="openLoginModal">
                            {{ $i18n.t('user.login') }}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import LanguageSelection from '~~/components/layout/LanguageSelection.client.vue'
import { useMainStore } from '~/stores'
import { useAuth } from '~/composables/directus'

const { $i18n } = useNuxtApp()
const auth = useAuth()

const mainStore = useMainStore()
const isMenuExpanded = ref(false)

function openLoginModal() {
    mainStore.setIsLoginOpen(true)
    mainStore.setLoginActiveComponent('login')
}

function toggleIsMenuExpanded() {
    isMenuExpanded.value = !isMenuExpanded.value
}
</script>
