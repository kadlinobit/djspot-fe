import {
    createDirectus,
    rest,
    authentication,
    readMe,
    type AuthenticationStorage,
    type DirectusUser,
    realtime
} from '@directus/sdk';

import { useUserStore } from '#imports';
import type { ApiCollections } from './types.js';
import { userFieldSets } from './collection/index.js';

export default defineNuxtPlugin(() => {
    const { setUser, setLoggedIn } = useUserStore();
    const toast = useToast();

    class NuxtCookieStorage {
        cookie = useCookie('directus-data');
        get() {
            return this.cookie.value;
        }
        set(data: any) {
            this.cookie.value = data;
        }
    }

    const storage = new NuxtCookieStorage() as AuthenticationStorage;

    const url = import.meta.client
        ? window.location.origin
        : useRequestURL().origin;

    // /websocket is handled by server/routes/websocket.ts which proxies to Directus.
    const wsUrl = import.meta.client
        ? `${url.replace(/^http/, 'ws')}/websocket`
        : undefined;

    const directus = createDirectus<ApiCollections>(`${url}/directus`)
        .with(authentication('cookie', { credentials: 'include', storage }))
        .with(rest({ credentials: 'include' }))
        .with(realtime(wsUrl ? { url: wsUrl, authMode: 'strict' } : {}));

    let isRefreshing = false;

    directus.request = new Proxy(directus.request, {
        apply: async (target, thisArg, args) => {
            try {
                return await Reflect.apply(target, thisArg, args);
            } catch (error: any) {
                const code = error?.errors?.[0]?.extensions?.code;
                const status = error?.response?.status;
                console.warn('[directus proxy] request failed', {
                    code,
                    status,
                    isRefreshing
                });

                if (
                    !isRefreshing &&
                    (code === 'INVALID_CREDENTIALS' ||
                        code === 'TOKEN_EXPIRED' ||
                        status === 401)
                ) {
                    isRefreshing = true;
                    try {
                        await directus.refresh();
                        return await Reflect.apply(target, thisArg, args);
                    } catch (e) {
                        if (import.meta.client) {
                            await logout();
                            const { $i18n } = useNuxtApp();
                            toast.add({
                                title: $i18n.t('user.session_expired'),
                                color: 'warning'
                            });
                            navigateTo('/');
                        }
                        throw e;
                    } finally {
                        isRefreshing = false;
                    }
                }
                throw error;
            }
        }
    });

    const isAuthenticated = async () => {
        try {
            const me = await directus.request(readMe());
            return me;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    async function login(email: string, password: string) {
        await directus.login({ email, password });

        setLoggedIn(true);
        await updateUser();
    }

    async function updateUser() {
        const userData = await directus.request(
            readMe({
                fields: userFieldSets.withDjs
            })
        );
        setUser(userData);
    }

    async function logout() {
        setLoggedIn(false);
        setUser(undefined);
        // Clear the SDK's token storage immediately so getToken() stops returning the invalid token and breaks the retry cycle.
        storage.set(null);
        directus.stopRefreshing?.();
        try {
            await directus.logout();
        } catch {
            // Server-side session invalidation is best-effort;
            // local state is already cleared above.
        }
    }

    return {
        provide: {
            directus,
            isAuthenticated,
            login,
            logout,
            updateUser
        }
    };
});
