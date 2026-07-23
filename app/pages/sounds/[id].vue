<template>
    <div v-if="error" class="py-20 text-center">
        <UIcon
            name="i-heroicons-musical-note"
            class="mx-auto h-12 w-12 text-gray-400"
        />
        <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">
            {{ $i18n.t('sound.sound_not_found') }}
        </h3>
        <div class="mt-6">
            <UButton color="neutral" variant="soft" to="/sounds">
                {{ $i18n.t('sound.sounds') }}
            </UButton>
        </div>
    </div>
    <div v-else class="flex justify-center py-12">
        <UProgress animation="carousel" color="neutral" class="w-full max-w-md" />
    </div>
</template>

<script setup lang="ts">
import { readItem } from '@directus/sdk';
import { soundFieldSets } from '~/plugins/directus/collection/sound';

const { $i18n, $directus } = useNuxtApp();
const route = useRoute();

const { data: soundUrl, error } = await useAsyncData(async () => {
    const sound = await $directus.request(
        readItem('sound', route.params.id as string, {
            fields: soundFieldSets.default
        })
    );
    return `/djs/${sound.dj.slug}/sounds/${sound.slug}`;
});

if (!error.value) {
    await navigateTo(soundUrl.value!, { redirectCode: 301, replace: true });
}
</script>
