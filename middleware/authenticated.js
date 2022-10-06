import { useAuth } from '~/composables/directus'
const auth = useAuth()

export default function ({ redirect }) {
    if (!auth.loggedIn.value) {
        return redirect('/login')
    }
}
