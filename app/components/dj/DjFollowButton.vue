<template>
    <UButton
        icon="i-heroicons-eye"
        :color="followButtonColor"
        :variant="followButtonVariant"
        :loading="isToggleFollowLoading"
        @click.stop="onToggleFollow"
    >
        {{ followButtonLabel }}
    </UButton>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useUserStore, useMainStore } from '@/stores';
import type { Dj } from '~/plugins/directus/types';
import { createItem, deleteItem } from '@directus/sdk';

const { $i18n, $directus } = useNuxtApp();
const toast = useToast();
const mainStore = useMainStore();
const { getIsLoggedIn } = useUserStore();

const dj = defineModel<Dj>('dj');
const isToggleFollowLoading = ref(false);

const followButtonVariant = computed(() => {
    if (!getIsLoggedIn()) return 'outline';
    return dj?.value?.follows?.length ? 'solid' : 'outline';
});

const followButtonColor = computed(() => {
    return 'neutral';
});

async function onToggleFollow() {
    if (!getIsLoggedIn()) {
        mainStore.setLoginActiveComponent('login');
        mainStore.setIsLoginOpen(true);
        return;
    }
    isToggleFollowLoading.value = true;
    try {
        _.isEmpty(dj?.value?.follows)
            ? await createFollow()
            : await deleteFollow();
    } catch (e: any) {
        toast.add({
            title: $i18n.t('error.title'),
            description: e?.message || e,
            color: 'error'
        });
    } finally {
        isToggleFollowLoading.value = false;
    }
}

async function createFollow() {
    if (!dj?.value?.id) return;
    try {
        const result = await $directus.request(
            createItem('user_dj_follow', { dj: dj.value.id })
        );

        if (result?.id) {
            dj.value.follows = [result.id];
            dj.value.follow_count++;
            toast.add({
                title: $i18n.t('dj.follow_success'),
                color: 'success'
            });
        }
    } catch (e: any) {
        toast.add({
            title: $i18n.t('error.title'),
            description: e?.message || e,
            color: 'error'
        });
    }
}

async function deleteFollow() {
    if (!dj.value?.follows.length) return;
    try {
        await $directus.request(
            deleteItem('user_dj_follow', dj.value.follows[0])
        );
        dj.value.follows = [];
        dj.value.follow_count--;
        toast.add({
            title: $i18n.t('dj.unfollow_success'),
            color: 'success'
        });
    } catch (e: any) {
        toast.add({
            title: $i18n.t('error.title'),
            description: e?.message || e,
            color: 'error'
        });
    }
}

const followButtonLabel = computed(() =>
    dj.value?.follow_count
        ? `${dj.value.follow_count} ${$i18n.t('dj.followers')}`
        : $i18n.t('dj.follow')
);
</script>
