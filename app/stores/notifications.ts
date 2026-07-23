import type { DirectusNotification } from '@directus/sdk';
import { readNotifications, updateNotification } from '@directus/sdk';

const NOTIFICATION_FIELDS = [
    'id',
    'subject',
    'message',
    'timestamp',
    'status',
    'sender',
    'collection',
    'item'
] as const;

type NotificationParams = Record<string, string | number>;

type TranslatableNotification = {
    subject?: string | null;
    message?: string | Record<string, unknown> | null;
};

function parseMessageParams(message: TranslatableNotification['message']): NotificationParams {
    if (message == null || message === '') return {};
    if (typeof message === 'object' && !Array.isArray(message)) {
        return message as NotificationParams;
    }
    if (typeof message === 'string') {
        try {
            const parsed = JSON.parse(message);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                return parsed as NotificationParams;
            }
        } catch {
            // Plain-text legacy message — no params
        }
    }
    return {};
}

export function translateNotification(n: TranslatableNotification) {
    const { $i18n } = useNuxtApp();
    const key = n.subject ?? '';
    const params = parseMessageParams(n.message);
    const subjectKey = `${key}.subject`;
    const messageKey = `${key}.message`;

    return {
        subject: $i18n.te(subjectKey) ? $i18n.t(subjectKey, params) : (n.subject ?? ''),
        message: $i18n.te(messageKey)
            ? $i18n.t(messageKey, params)
            : typeof n.message === 'string'
              ? n.message
              : ''
    };
}

export const useNotificationsStore = defineStore('notifications', () => {
    const notifications = ref<DirectusNotification[]>([]);
    const unreadCount = computed(() => notifications.value.length);

    let activeUnsubscribe: (() => void) | null = null;
    let activeAbort: AbortController | null = null;

    async function markAsRead(id: string) {
        const { $directus } = useNuxtApp();
        await $directus.request(updateNotification(id, { status: 'archived' }));
        notifications.value = notifications.value.filter((n) => String(n.id) !== String(id));
    }

    async function connect(directus: ReturnType<typeof useNuxtApp>['$directus']) {
        if (activeUnsubscribe) return;

        try {
            const existing = await directus.request(
                readNotifications({
                    fields: NOTIFICATION_FIELDS,
                    filter: { status: { _eq: 'inbox' } },
                    sort: ['-timestamp'],
                    limit: 50
                })
            );
            notifications.value = existing as unknown as DirectusNotification[];

            await directus.connect();

            const { subscription, unsubscribe } = await directus.subscribe(
                'directus_notifications' as never,
                {
                    event: 'create',
                    query: {
                        filter: { recipient: { _eq: '$CURRENT_USER' } },
                        fields: NOTIFICATION_FIELDS
                    }
                }
            );

            activeUnsubscribe = unsubscribe;
            activeAbort = new AbortController();
            const { signal } = activeAbort;

            (async () => {
                try {
                    for await (const message of subscription) {
                        if (signal.aborted) break;
                        if (message.event === 'create') {
                            notifications.value.unshift(
                                ...(message.data as unknown as DirectusNotification[])
                            );
                        }
                    }
                } catch {
                    activeUnsubscribe = null;
                }
            })();
        } catch (error) {
            console.error('[Notifications] WebSocket connection failed:', error);
        }
    }

    function disconnect(directus: ReturnType<typeof useNuxtApp>['$directus']) {
        activeAbort?.abort();
        activeAbort = null;
        activeUnsubscribe?.();
        activeUnsubscribe = null;
        notifications.value = [];
        directus.disconnect();
    }

    if (import.meta.client) {
        const { $directus } = useNuxtApp();
        const userStore = useUserStore();

        watch(
            () => userStore.isLoggedIn,
            async (loggedIn) => {
                if (loggedIn) {
                    await connect($directus);
                } else {
                    disconnect($directus);
                }
            },
            { immediate: true }
        );
    }

    return {
        notifications: readonly(notifications),
        unreadCount,
        markAsRead
    };
});
