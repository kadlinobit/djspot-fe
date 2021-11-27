<template>
    <nav class="navbar is-primary" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <nuxt-link class="navbar-item" to="/">
                <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28" />
            </nuxt-link>
            <a v-if="$strapi.user" class="navbar-item" @click="() => setIsSidebarOpen(true)">
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

        <div id="navbar-main-menu" class="navbar-menu" :class="{ 'is-active': isMenuExpanded }">
            <div class="navbar-start">
                <nuxt-link class="navbar-item" to="/djs">{{ $t('dj.djs') }}</nuxt-link>
                <nuxt-link class="navbar-item" to="/sounds">{{ $t('sound.sounds') }}</nuxt-link>
            </div>
            <div class="navbar-end">
                <language-selection />
                <div v-if="!$strapi.user" class="navbar-item">
                    <div class="buttons">
                        <a class="button is-light" @click="() => setIsLoginOpen(true)">
                            {{ $t('user.login') }}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
import { mapActions } from 'vuex'
import LanguageSelection from '~/components/layout/LanguageSelection.vue'

export default {
    components: {
        LanguageSelection
    },
    data() {
        return {
            isMenuExpanded: false
        }
    },
    methods: {
        ...mapActions(['setIsSidebarOpen', 'setIsLoginOpen']),
        toggleIsMenuExpanded() {
            this.isMenuExpanded = !this.isMenuExpanded
        }
    }
}
</script>
