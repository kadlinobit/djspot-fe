<template>
    <div class="p-5">
        <UNavigationMenu
            :items="items"
            orientation="vertical"
            class="w-full"
            @select="closeSidebar"
            :ui="{
                root: 'flex flex-col gap-4'
            }"
        />
    </div>
</template>

<script setup lang="ts">
import { useMainStore, useUserStore } from '~/stores';

const mainStore = useMainStore();
const { getUser } = useUserStore();
const { $i18n, $logout } = useNuxtApp();
const toast = useToast();

const items = computed(() => {
    const user = getUser();
    const menuGroups = [];

    // Group 1: General Menu
    menuGroups.push([
        {
            label: 'User',
            icon: 'i-lucide-user',
            to: '/user/account'
        },
        {
            label: 'Logout',
            icon: 'i-lucide-log-out',
            onSelect: logout
        }
    ]);

    // Group 2: Deejay Section
    const deejayGroup = [];
    if (!user?.djs?.length) {
        deejayGroup.push({
            label: $i18n.t('dj.create_profile'),
            icon: 'i-lucide-plus',
            to: '/djs/manage/new'
        });
    } else {
        user.djs.forEach((dj) => {
            deejayGroup.push({
                label: dj.name,
                icon: 'i-lucide-disc',
                children: [
                    {
                        label: $i18n.t('dj.profile'),
                        icon: 'i-lucide-contact',
                        to: `/djs/${dj.slug}`
                    },
                    {
                        label: $i18n.t('sound.add'),
                        icon: 'i-lucide-plus',
                        to: '/sounds/manage/new'
                    }
                ]
            });
        });
    }

    if (deejayGroup.length) {
        menuGroups.push(deejayGroup);
    }

    return menuGroups;
});

async function logout() {
    closeSidebar();
    await $logout();
    toast.add({
        title: $i18n.t('user.logout_success'),
        color: 'success'
    });
}

function closeSidebar() {
    mainStore.isSidebarOpen = false;
}
</script>
