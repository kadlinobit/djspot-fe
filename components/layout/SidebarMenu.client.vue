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
                        <span>{{ $i18n.t('dj.create_profile') }}</span>
                    </nuxt-link>
                </li>
                <li v-else>
                    <o-icon icon="album" size="small" />
                    <span>{{ djProfile.name }}</span>
                    <ul>
                        <li @click="closeSidebar">
                            <nuxt-link :to="`/djs/${djProfile.slug}`">
                                <o-icon icon="account-box" size="small" />
                                <span>{{ $i18n.t('dj.profile') }}</span>
                            </nuxt-link>
                        </li>
                        <li @click="closeSidebar">
                            <nuxt-link to="/sounds/manage/new">
                                <o-icon icon="plus" size="small" />
                                <span>{{ $i18n.t('sound.add') }}</span>
                            </nuxt-link>
                        </li>
                    </ul>
                </li>
            </ul>
        </aside>
    </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { useMainStore } from '~/stores'
import { useAuth } from '~/composables/directus'
const mainStore = useMainStore()
const auth = useAuth()

const { $oruga, $i18n } = useNuxtApp()

interface Props {
    open?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    open: false
})

const djProfile = computed(() => {
    if (!_.isEmpty(auth.user.value.djs)) {
        return auth.user.value.djs[0]
    }
    return null
})

async function logout() {
    closeSidebar()
    await auth.logout()
    $oruga.notification.open({
        message: $i18n.t('user.logout_success'),
        variant: 'success'
    })
}

function closeSidebar() {
    mainStore.isSidebarOpen = false
}
</script>
