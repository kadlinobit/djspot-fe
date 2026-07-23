<template>
    <div v-if="translatedNotifications.length" class="flex flex-col gap-1">
        <p class="text-dimmed px-2 text-xs font-semibold uppercase tracking-wider">
            {{ $i18n.t('notifications.title') }}
        </p>
        <div
            v-for="n in translatedNotifications"
            :key="n.id"
            class="hover:bg-elevated flex cursor-pointer flex-col gap-0.5 rounded-md px-2 py-2"
            @click="onNotificationClick(n)"
        >
            <div class="flex items-center gap-2">
                <span class="bg-success h-1.5 w-1.5 shrink-0 rounded-full" />
                <span class="truncate text-sm font-medium">{{ n.subject }}</span>
            </div>
            <p v-if="n.message" class="text-dimmed line-clamp-2 pl-3.5 text-xs">
                {{ n.message }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { translateNotification } from '~/stores/notifications';

const { $i18n } = useNuxtApp();
const notificationsStore = useNotificationsStore();
const { notifications } = storeToRefs(notificationsStore);
const { markAsRead } = notificationsStore;

const translatedNotifications = computed(() =>
    notifications.value.map((n) => {
        const text = translateNotification({
            subject: n.subject,
            message: n.message
        });
        return {
            ...n,
            subject: text.subject,
            message: text.message
        };
    })
);

async function onNotificationClick(n: (typeof translatedNotifications.value)[number]) {
    await markAsRead(String(n.id));
    if (n.collection === 'sound' && n.item) navigateTo(`/sounds/${n.item}`);
}
</script>
