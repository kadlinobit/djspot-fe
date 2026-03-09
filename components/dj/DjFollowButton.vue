<template>
    <o-button
        icon-left="eye"
        :variant="followButtonVariant"
        :disabled="isToggleFollowLoading"
        size="responsive"
        @click="onToggleFollow"
    >
        {{ followButtonLabel }}
    </o-button>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useUserStore, useMainStore } from '@/stores';
import { useOruga } from '@oruga-ui/oruga';
import { type IDjWithSounds } from '~/plugins/directus/collection';
import { createItem, deleteItem } from '@directus/sdk';

const { $i18n, $directus } = useNuxtApp();
const $oruga = useOruga();
const mainStore = useMainStore();
const { getIsLoggedIn } = useUserStore();

const dj = defineModel<IDjWithSounds>('dj');
const isToggleFollowLoading = ref(false);

const followButtonVariant = computed(() => {
    if (!getIsLoggedIn()) return 'light';
    return dj?.value?.follows?.length ? 'dark' : 'light';
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
        throw new Error(e?.message || e);
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
        }
    } catch (e) {
        $oruga.notification.open({
            message: e,
            variant: 'danger',
            duration: 7000
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
    } catch (e) {
        $oruga.notification.open({
            message: e,
            variant: 'danger',
            duration: 7000
        });
    }
}

const followButtonLabel = computed(() =>
    dj.value?.follow_count
        ? `${dj.value.follow_count} ${$i18n.t('dj.followers')}`
        : $i18n.t('dj.follow')
);
</script>
