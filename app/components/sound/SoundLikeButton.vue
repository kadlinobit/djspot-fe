<template>
    <UButton
        icon="i-heroicons-heart"
        :color="likeButtonColor"
        :variant="likeButtonVariant"
        :loading="isToggleLikeLoading"
        size="md"
        @click="onToggleLike"
    >
        {{ likeButtonLabel }}
    </UButton>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useUserStore, useMainStore } from '@/stores';
import type { ISoundDefault } from '~/plugins/directus/collection';
import { createItem, deleteItem } from '@directus/sdk';

const { $i18n, $directus } = useNuxtApp();
const toast = useToast();
const mainStore = useMainStore();
const { getIsLoggedIn } = useUserStore();

const sound = defineModel<ISoundDefault>('sound');
const isToggleLikeLoading = ref(false);

const likeButtonColor = computed(() => {
    if (!getIsLoggedIn()) return 'neutral';
    return sound?.value?.likes?.length ? 'primary' : 'neutral';
});

const likeButtonVariant = computed(() => {
    if (!getIsLoggedIn()) return 'soft';
    return sound?.value?.likes?.length ? 'solid' : 'soft';
});

async function onToggleLike() {
    if (!getIsLoggedIn()) {
        mainStore.setLoginActiveComponent('login');
        mainStore.setIsLoginOpen(true);
        return;
    }
    isToggleLikeLoading.value = true;
    try {
        _.isEmpty(sound?.value?.likes)
            ? await createLike()
            : await deleteLike();
    } catch (e: any) {
        toast.add({
            title: e?.message || String(e),
            color: 'error'
        });
    } finally {
        isToggleLikeLoading.value = false;
    }
}

async function createLike() {
    if (!sound?.value?.id) return;
    try {
        const result = await $directus.request(
            createItem('user_sound_like', { sound: sound.value.id })
        );

        if (result?.id) {
            sound.value = { ...sound.value, likes: [result.id], like_count: (sound.value.like_count || 0) + 1 };
        }
    } catch (e: any) {
        toast.add({
            title: e?.message || String(e),
            color: 'error'
        });
    }
}

async function deleteLike() {
    if (!sound.value?.likes?.length) return;
    try {
        await $directus.request(
            deleteItem('user_sound_like', sound.value.likes[0])
        );
        sound.value = { ...sound.value, likes: [], like_count: (sound.value.like_count || 0) - 1 };
    } catch (e: any) {
        toast.add({
            title: e?.message || String(e),
            color: 'error'
        });
    }
}

const likeButtonLabel = computed(() =>
    sound.value?.like_count ? sound.value.like_count : $i18n.t('sound.like')
);
</script>
