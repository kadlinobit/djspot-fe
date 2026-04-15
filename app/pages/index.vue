<template>
    <section class="section">
        <div class="container">
            <h1 class="title">{{ $i18n.t('welcome_message') }}</h1>
            <p v-if="isLoggedIn">{{ remoteUserData }}</p>
            <p v-else>User is not logged in!!!!</p>
            <!-- <p>Status: {{ loginStatus }}</p>
            <p>data: {{ JSON.stringify(data, null, 2) }}</p>
            <p>lastRefreshedAt: {{ lastRefreshedAt }}</p>
            <h2 class="subtitle">becem nuxt directus</h2>
            <p>{{ useUser() }}</p> -->
        </div>
    </section>
</template>

<script setup lang="ts">
import { useUserStore } from '#imports';
import { readMe } from '@directus/sdk';
// import useDirectus, { useAuth } from '~/composables/directus'
// import useDirectus from '~/composables/directus'
const { $i18n, $directus } = useNuxtApp();
// const directus = useDirectus()
// const auth = useAuth()

const { isLoggedIn } = useUserStore();
// const { useUser } = useDirectusAuth()
// const user = ref(useUser())
const remoteUserData = ref({});

// nuxt-auth
// const {
//     status: loginStatus,
//     data,
//     lastRefreshedAt,
//     getCsrfToken,
//     getProviders,
//     getSession,
//     signIn,
//     signOut
// } = useAuth()

// DIRECTUS WAY
onMounted(() => {
    fetchUserData();
});

// watch(
//     () => auth.loggedIn.value,
//     (loggedIn) => {
//         fetchUserData()
//     }
// )

async function fetchUserData() {
    if (isLoggedIn) {
        remoteUserData.value = await $directus.request(readMe());
    }
}
</script>
