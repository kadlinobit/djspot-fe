<template>
    <div v-if="notifications.length" class="flex flex-col gap-1">
        <p class="text-dimmed px-2 text-xs font-semibold uppercase tracking-wider">
            {{ $i18n.t('notifications.title') }}
        </p>
        <div
            v-for="n in notifications"
            :key="n.id"
            class="hover:bg-elevated flex cursor-pointer flex-col gap-0.5 rounded-md px-2 py-2"
            @click="onNotificationClick(n)"
        >
            <div class="flex items-center gap-2">
                <span
                    v-if="n.status === 'inbox'"
                    class="bg-success h-1.5 w-1.5 shrink-0 rounded-full"
                />
                <span class="truncate text-sm font-medium">{{ n.subject }}</span>
            </div>
            <p v-if="n.message" class="text-dimmed line-clamp-2 pl-3.5 text-xs">
                {{ n.message }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
const { $i18n } = useNuxtApp();
const notificationsStore = useNotificationsStore();
const { notifications } = storeToRefs(notificationsStore);
const { markAsRead } = notificationsStore;

async function onNotificationClick(n: (typeof notifications.value)[number]) {
    if (n.status === 'inbox') await markAsRead(String(n.id));
    if (n.collection === 'sound' && n.item) navigateTo(`/sounds/${n.item}`);
}
</script>
