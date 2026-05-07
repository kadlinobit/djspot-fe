<template>
    <div
        class="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-primary-500 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
    >
        <div class="aspect-square w-full overflow-hidden">
            <cover-image
                :name="dj?.name"
                :cover-image="dj?.photo || undefined"
                quality="thumbnail"
                cover-type="dj"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
        </div>
        <div class="flex flex-1 flex-col p-4">
            <h3
                class="line-clamp-1 text-base font-bold text-gray-900 dark:text-white"
            >
                <nuxt-link
                    :to="`/djs/${dj.slug}`"
                    class="after:absolute after:inset-0"
                >
                    {{ dj.name }}
                </nuxt-link>
            </h3>
            <p
                v-if="dj?.city?.name"
                class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400"
            >
                <UIcon name="i-heroicons-map-pin" class="h-3.5 w-3.5" />
                {{ dj.city.name }}
            </p>
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
