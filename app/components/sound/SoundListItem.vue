<template>
    <li class="flex items-center gap-4 py-3 border-b border-gray-200 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors px-2 rounded-lg">
        <div class="flex-shrink-0">
            <cover-image
                :name="sound?.name"
                :cover-image="sound?.photo || undefined"
                quality="thumbnail"
                cover-type="sound"
                :pixel-size="48"
                class="rounded-lg shadow-sm"
            />
        </div>
        <div class="flex-shrink-0">
            <button-play-pause :sound="sound" size="medium" />
        </div>
        <div class="flex flex-1 flex-col justify-center overflow-hidden">
            <header>
                <h3 class="truncate text-lg font-medium text-gray-900 dark:text-white">
                    <nuxt-link
                        :to="`/djs/${sound?.dj?.slug}/sounds/${sound.slug}`"
                        class="hover:text-primary-500 transition-colors"
                    >
                        {{ sound.name }}
                    </nuxt-link>
                </h3>
            </header>
            <div class="truncate text-sm text-gray-500 dark:text-gray-400 capitalize">
                {{ sound.type }}
            </div>
        </div>
    </li>
</template>

<script setup lang="ts">
import CoverImage from '~/components/media/CoverImage.vue';
import ButtonPlayPause from '~/components/audio/ButtonPlayPause.client.vue';
import type { ISoundDefault } from '~/plugins/directus/collection';

interface Props {
    sound: ISoundDefault;
}

defineProps<Props>();
</script>
