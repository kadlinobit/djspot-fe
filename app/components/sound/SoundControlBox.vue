<template>
    <div
        class="mt-8 flex flex-col justify-between gap-4 border-t border-gray-800 pt-6 sm:flex-row sm:items-center"
    >
        <div class="flex items-center gap-4">
            <sound-like-button v-model:sound="sound" />
            <sound-playlist-button :sound="sound" />
        </div>
        <div v-if="isOwnSound">
            <UButton
                :to="`/sounds/manage/edit/${sound?.id}`"
                color="neutral"
                variant="outline"
                icon="i-heroicons-pencil-square"
                size="md"
                class="w-full justify-center sm:w-auto"
            >
                {{ $i18n.t('form.edit') }}
            </UButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import SoundLikeButton from '~/components/sound/SoundLikeButton.vue';
import SoundPlaylistButton from '~/components/sound/SoundPlaylistButton.vue';
import type { ISoundDefault } from '~/plugins/directus/collection';
import { useUserStore } from '@/stores';

const { $i18n } = useNuxtApp();
const { getUser } = useUserStore();

const sound = defineModel<ISoundDefault>('sound');

const isOwnSound = computed(() => {
    const djId =
        typeof sound.value?.dj === 'object' && sound.value.dj !== null
            ? sound.value.dj.id
            : sound.value?.dj;

    return getUser()?.djs?.some(
        (userDj) => String(userDj.id) === String(djId)
    );
});
</script>
