<template>
    <div class="flex items-center justify-between gap-4">
        <div>
            <dj-follow-button v-model:dj="dj" />
        </div>
        <div v-if="isOwnDj">
            <UButton
                :to="`/djs/manage/edit/${dj?.id}`"
                color="neutral"
                variant="outline"
                icon="i-heroicons-pencil-square"
            >
                {{ $i18n.t('form.edit') }}
            </UButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import DjFollowButton from '@/components/dj/DjFollowButton.vue';
import type { IDjDefault } from '~/plugins/directus/collection/dj';
import { useUserStore } from '@/stores';

const { $i18n } = useNuxtApp();
const { getUser } = useUserStore();

const dj = defineModel<IDjDefault>('dj');

const isOwnDj = computed(() =>
    getUser()?.djs?.some((userDj) => String(userDj.id) === String(dj.value?.id))
);
</script>
