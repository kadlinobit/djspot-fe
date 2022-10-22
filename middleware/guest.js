import { useAuth } from '~/composables/directus'
const auth = useAuth()
const router = useRouter()

export default function ({ redirect }) {
    if (auth.loggedIn.value) {
        return router.push('/')
    }
}
