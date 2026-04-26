<template>
    <div class="flex items-center justify-between gap-4">
        <div>
            <dj-follow-button v-model:dj="dj" />
        </div>
        <div>
            <UButton
                to="/djs/manage/edit/"
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
import type { Dj } from '~/plugins/directus/types';

const { $i18n } = useNuxtApp();
const dj = defineModel<Dj>('dj');
</script>
