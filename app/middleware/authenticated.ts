import { useUserStore } from '~/stores/user';

export default defineNuxtRouteMiddleware(function authenticated(to, from) {
    const userStore = useUserStore();

    if (!userStore.isLoggedIn) {
        return navigateTo('/user/login');
    }
});
