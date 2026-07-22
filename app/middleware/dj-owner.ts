import { useUserStore } from '~/stores/user';

export default defineNuxtRouteMiddleware(function djOwner(to) {
    const userStore = useUserStore();
    const djId = String(to.params.id);
    const ownsDj = userStore.user?.djs?.some((dj) => String(dj.id) === djId);

    if (!ownsDj) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
    }
});
