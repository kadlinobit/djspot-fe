import { Directus } from '@directus/sdk'
import _ from 'lodash'

const apiBaseURL = 'http://localhost:8055'

const directus = new Directus('http://localhost:8055')

const user = ref(JSON.parse(directus.storage.get('directus-user')) || {})
const loggedIn = ref(!_.isNil(directus.storage.get('directus-user')))

export default function () {
    return directus
}

export const useAuth = () => {
    async function login(credentials) {
        try {
            await directus.auth.login(credentials)
            await fetchUser()
            loggedIn.value = true
        } catch (e) {
            loggedIn.value = false
            removeUser()
            throw new Error(e)
        }
    }

    async function logout() {
        try {
            await directus.auth.logout()
            removeUser()
            loggedIn.value = false
        } catch (e) {
            throw new Error(e)
        }
    }

    async function fetchUser() {
        const userData = await directus.users.me.read({
            fields: [
                'id',
                'email',
                'first_name',
                'last_name',
                'language',
                'djs.id',
                'djs.name',
                'djs.slug'
            ]
        })
        user.value = userData
        directus.storage.set('directus-user', JSON.stringify(userData))
    }

    function removeUser() {
        user.value = {}
        directus.storage.delete('directus-user')
    }

    return {
        login,
        logout,
        user,
        loggedIn,
        fetchUser,
        removeUser
    }
}
