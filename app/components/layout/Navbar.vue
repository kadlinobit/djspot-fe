<template>
    <UHeader title="djspot-fe">
        <template #title>
            <NuxtImg
                :src="
                    colorMode.value === 'dark'
                        ? '/images/djspot-logo-dark.png'
                        : '/images/djspot-logo-light.png'
                "
                height="28"
                alt="djspot logo"
            />
        </template>

        <UNavigationMenu :items="items" />

        <template #right>
            <UButton
                v-if="getIsLoggedIn()"
                icon="i-lucide-user"
                variant="ghost"
                color="neutral"
                @click="mainStore.isSidebarOpen = !mainStore.isSidebarOpen"
            />

            <ThemeSwitch />
            <LanguageSelection />

            <div v-if="!getIsLoggedIn()">
                <UButton
                    variant="ghost"
                    color="neutral"
                    @click="openLoginModal"
                >
                    {{ $i18n.t('user.login') }}
                </UButton>
            </div>
        </template>

        <template #body>
            <UNavigationMenu
                :items="items"
                orientation="vertical"
                class="-mx-2.5"
            />
        </template>
    </UHeader>
</template>

<script setup lang="ts">
import LanguageSelection from '~/components/layout/LanguageSelection.client.vue';
import ThemeSwitch from '~/components/layout/ThemeSwitch.vue';
import { useMainStore, useUserStore } from '~/stores';

const { getIsLoggedIn } = useUserStore();
const colorMode = useColorMode();
const { $i18n } = useNuxtApp();
const mainStore = useMainStore();

const items = computed(() => [
    {
        label: $i18n.t('dj.djs'),
        to: '/djs'
    },
    {
        label: $i18n.t('sound.sounds'),
        to: '/sounds'
    }
]);

function openLoginModal() {
    mainStore.setIsLoginOpen(true);
    mainStore.setLoginActiveComponent('login');
}
</script>
