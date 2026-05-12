<template>
    <UContainer class="py-10">
        <h1 class="title">{{ $i18n.t('welcome_message') }}</h1>
        <!-- <p v-if="isLoggedIn">{{ remoteUserData }}</p>
        <p v-else>User is not logged in!!!!</p> -->

        <div class="mt-10">
            <GenresCloud />
        </div>
    </UContainer>
</template>

<script setup lang="ts">
import { useUserStore } from '#imports';
import { readMe } from '@directus/sdk';
import GenresCloud from '~/components/genre/GenresCloud.vue';
const { $i18n, $directus } = useNuxtApp();

const { isLoggedIn } = useUserStore();
const remoteUserData = ref({});

onMounted(() => {
    fetchUserData();
});

async function fetchUserData() {
    if (isLoggedIn) {
        remoteUserData.value = await $directus.request(readMe());
    }
}
</script>
