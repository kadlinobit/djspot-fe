<template>
    <div class="dj-control-box level is-mobile">
        <div class="level-left">
            <div class="level-item">
                <dj-follow-button v-model:dj="dj" />
            </div>
        </div>
        <div class="level-right">
            <nuxt-link :to="{ path: `/djs/manage/edit/` }">
                <o-button
                    variant="light"
                    icon-left="pencil"
                    tag="nuxt-link"
                    size="responsive"
                >
                    {{ $i18n.t('form.edit') }}
                </o-button>
            </nuxt-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import DjFollowButton from '@/components/dj/DjFollowButton.vue';
import { type IDjWithSounds } from '~/plugins/directus/collection';
const { $i18n } = useNuxtApp();
const dj = defineModel<IDjWithSounds>('dj');
</script>
