<template>
    <section class="section">
        <div class="container">
            <h1 class="title">{{ $i18n.t('welcome_message') }}</h1>
            <p v-if="auth.loggedIn.value">{{ remoteUserData }}</p>
            <p v-else>User is not logged in!!!!</p>
        </div>
    </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useDirectus, { useAuth } from '~/composables/directus'
const { $i18n } = useNuxtApp()
const directus = useDirectus()
const auth = useAuth()
const remoteUserData = ref({})

onMounted(() => {
    fetchUserData()
})

watch(
    () => auth.loggedIn.value,
    (loggedIn) => {
        fetchUserData()
    }
)

async function fetchUserData() {
    if (auth.loggedIn.value) {
        remoteUserData.value = await directus.users.me.read()
    }
}
</script>
