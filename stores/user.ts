import type { IUserWithDjs } from '~/plugins/directus/collection';

export const useUserStore = defineStore(
    'user',
    () => {
        const isLoggedIn = ref<boolean>(false);
        const user = ref<IUserWithDjs | undefined>(undefined);

        // ACTIONS
        function setUser(userData: IUserWithDjs | undefined) {
            user.value = userData;
        }

        function setLoggedIn(val: boolean) {
            isLoggedIn.value = val;
        }

        function logout() {
            setLoggedIn(false);
            setUser(undefined);
        }

        //GETTERS
        const getIsLoggedIn = () => isLoggedIn.value;

        const getUser = () => user.value;

        return {
            user,
            isLoggedIn,

            // GETTERS
            getIsLoggedIn,
            getUser,

            // ACTIONS
            logout,
            setUser,
            setLoggedIn
        };
    },
    { persist: true }
);
