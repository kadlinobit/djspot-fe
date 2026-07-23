import { readItem } from '@directus/sdk';
import { useUserStore } from '~/stores/user';

export default defineNuxtRouteMiddleware(async function soundOwner(to) {
    const userStore = useUserStore();
    const { $directus } = useNuxtApp();

    const sound = await $directus.request(
        readItem('sound', String(to.params.id), { fields: ['dj'] })
    );

    const djId =
        typeof sound.dj === 'object' && sound.dj !== null
            ? sound.dj.id
            : sound.dj;

    const ownsSound = userStore.user?.djs?.some(
        (dj) => String(dj.id) === String(djId)
    );

    if (!ownsSound) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
    }
});
