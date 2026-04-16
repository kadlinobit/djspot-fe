<template>
    <o-button
        icon-left="heart"
        :variant="likeButtonVariant"
        :disabled="isToggleLikeLoading"
        size="responsive"
        @click="onToggleLike"
    >
        {{ likeButtonLabel }}
    </o-button>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useUserStore, useMainStore } from '@/stores';
import { useOruga } from '@oruga-ui/oruga';
import { type ISoundDefault } from '~/plugins/directus/collection';
import { createItem, deleteItem } from '@directus/sdk';

const { $i18n, $directus } = useNuxtApp();
const $oruga = useOruga();
const mainStore = useMainStore();
const { getIsLoggedIn } = useUserStore();

const sound = defineModel<ISoundDefault>('sound');
const isToggleLikeLoading = ref(false);

const likeButtonVariant = computed(() => {
    if (!getIsLoggedIn()) return 'light';
    return sound?.value?.likes?.length ? 'dark' : 'light';
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
        throw new Error(e?.message || e);
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
            sound.value.likes = [result.id];
            sound.value.like_count++;
        }
    } catch (e) {
        $oruga.notification.open({
            message: e,
            variant: 'danger',
            duration: 7000
        });
    }
}
async function deleteLike() {
    if (!sound.value?.likes?.length) return;
    try {
        await $directus.request(
            deleteItem('user_sound_like', sound.value.likes[0])
        );
        sound.value.likes = [];
        sound.value.like_count--;
    } catch (e) {
        $oruga.notification.open({
            message: e,
            variant: 'danger',
            duration: 7000
        });
    }
}

const likeButtonLabel = computed(() =>
    sound.value?.like_count ? sound.value.like_count : $i18n.t('sound.like')
);
</script>
