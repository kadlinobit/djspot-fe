<template>
    <div
        class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
    >
        <div class="flex items-center gap-4">
            <div class="shrink-0">
                <cover-image
                    :name="dj?.name"
                    :cover-image="dj?.photo || undefined"
                    quality="thumbnail"
                    cover-type="dj"
                    :pixel-size="64"
                />
            </div>
            <div class="min-w-0 flex-1">
                <h4 class="truncate text-lg font-bold text-gray-900 dark:text-white">
                    <nuxt-link :to="`/djs/${dj?.slug}`">
                        {{ dj?.name }}
                    </nuxt-link>
                </h4>
                <p v-if="dj?.city?.name" class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <UIcon name="i-heroicons-map-pin" class="h-3.5 w-3.5" />
                    {{ dj.city.name }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import CoverImage from '~/components/media/CoverImage.vue';
import type { IDjDefault } from '~/plugins/directus/collection/dj';

interface Props {
    dj: IDjDefault;
}

const props = defineProps<Props>();
</script>
