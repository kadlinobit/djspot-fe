<template>
    <UDropdownMenu
        :items="userMenuItems"
        :content="{ align: 'center', collisionPadding: 12 }"
        :ui="{
            content: 'w-(--reka-dropdown-menu-trigger-width) min-w-48'
        }"
        class="min-w-0 flex-1"
    >
        <UButton
            icon="i-lucide-user"
            :label="userLabel"
            trailing-icon="i-lucide-chevrons-up-down"
            color="neutral"
            variant="ghost"
            square
            class="data-[state=open]:bg-elevated w-full overflow-hidden"
            :ui="{ trailingIcon: 'text-dimmed ms-auto' }"
        />
    </UDropdownMenu>
</template>

<script setup lang="ts">
const { getUser } = useUserStore();
const { $i18n, $logout } = useNuxtApp();
const toast = useToast();

const emit = defineEmits<{ close: [] }>();

const userLabel = computed(() => {
    const u = getUser();
    if (u?.first_name || u?.last_name)
        return [u.first_name, u.last_name].filter(Boolean).join(' ');
    return u?.email ?? 'User';
});

const userMenuItems = computed(() => [
    [
        {
            label: 'User Profile',
            icon: 'i-lucide-user',
            to: '/user/account/'
        },
        {
            label: 'Logout',
            icon: 'i-lucide-log-out',
            onSelect: logout
        }
    ]
]);

async function logout() {
    emit('close');
    await $logout();
    toast.add({
        title: $i18n.t('user.logout_success'),
        color: 'success'
    });
}
</script>
