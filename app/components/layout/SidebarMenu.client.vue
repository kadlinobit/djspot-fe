<template>
    <div class="p-5">
        <aside class="menu">
            <p class="menu-label">Menu</p>
            <ul class="menu-list">
                <li @click="closeSidebar">
                    <nuxt-link to="/user/account">
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
                <li v-if="!getUser()?.djs" @click="closeSidebar">
                    <nuxt-link to="/djs/manage/new">
                        <o-icon icon="plus" size="small" />
                        <span>{{ $i18n.t('dj.create_profile') }}</span>
                    </nuxt-link>
                </li>
                <li v-else v-for="djProfile in getUser()?.djs">
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
import _ from 'lodash';
import { useOruga } from '@oruga-ui/oruga';
import { useMainStore, useUserStore } from '~/stores';
// import { useAuth } from '~/composables/directus'
const mainStore = useMainStore();
const { getUser } = useUserStore();
// const auth = useAuth()

const { $i18n, $logout } = useNuxtApp();
const $oruga = useOruga();

interface Props {
    open?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    open: false
});

const djProfile = computed(() => {
    // if (!_.isEmpty(authData?.user?.value?.djs)) {
    //     return authData?.user?.value?.djs[0];
    // }
    return null;
});

async function logout() {
    closeSidebar();
    await $logout();
    $oruga.notification.open({
        message: $i18n.t('user.logout_success'),
        variant: 'success'
    });
}

function closeSidebar() {
    mainStore.isSidebarOpen = false;
}
</script>
