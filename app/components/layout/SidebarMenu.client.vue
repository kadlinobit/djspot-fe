<template>
    <USlideover v-model:open="mainStore.isSidebarOpen" side="left">
        <template #header>
            <UDropdownMenu
                :items="userMenuItems"
                :content="{ align: 'center', collisionPadding: 12 }"
                :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width) min-w-48' }"
            >
                <UButton
                    icon="i-lucide-user"
                    :label="userLabel"
                    trailing-icon="i-lucide-chevrons-up-down"
                    color="neutral"
                    variant="ghost"
                    square
                    class="w-full data-[state=open]:bg-elevated overflow-hidden"
                    :ui="{ trailingIcon: 'text-dimmed ms-auto' }"
                />
            </UDropdownMenu>
        </template>

        <template #body>
            <UNavigationMenu
                :items="items"
                :ui="{ root: 'flex flex-col gap-4' }"
                orientation="vertical"
                class="w-full"
                @select="closeSidebar"
            />
        </template>
    </USlideover>
</template>

<script setup lang="ts">
import { useMainStore, useUserStore } from '~/stores';

const mainStore = useMainStore();
const { getUser } = useUserStore();
const { $i18n, $logout } = useNuxtApp();
const toast = useToast();

const userLabel = computed(() => {
    const u = getUser();
    if (u?.first_name || u?.last_name) return [u.first_name, u.last_name].filter(Boolean).join(' ');
    return u?.email ?? 'User';
});

const userMenuItems = computed(() => [
    [
        {
            label: 'User Profile',
            icon: 'i-lucide-user',
            to: '/user/profile/'
        },
        {
            label: 'Logout',
            icon: 'i-lucide-log-out',
            onSelect: logout
        }
    ]
]);

const items = computed(() => {
    const user = getUser();
    const menuGroups = [];

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
