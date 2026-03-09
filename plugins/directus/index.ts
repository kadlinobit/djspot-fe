import {
    createDirectus,
    rest,
    authentication,
    readMe,
    type AuthenticationStorage,
    type DirectusUser
} from '@directus/sdk';

import { useUserStore } from '#imports';
import { type ApiCollections } from './types.js';
import { userFieldSets } from './collection';

export default defineNuxtPlugin(() => {
    const { setUser, setLoggedIn } = useUserStore();

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

    const directus = createDirectus<ApiCollections>(
        'http://localhost:3000/directus'
    )
        .with(authentication('cookie', { credentials: 'include', storage }))
        .with(rest({ credentials: 'include' }));

    directus.request = new Proxy(directus.request, {
        apply: async (target, thisArg, args) => {
            try {
                return await Reflect.apply(target, thisArg, args);
            } catch (error: any) {
                if (
                    error?.errors?.[0]?.extensions?.code ===
                    'INVALID_CREDENTIALS'
                ) {
                    try {
                        await directus.refresh();
                        return await Reflect.apply(target, thisArg, args);
                    } catch (e) {
                        await logout();
                        throw e;
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
        await directus.logout();
        setLoggedIn(false);
        setUser(undefined);
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
