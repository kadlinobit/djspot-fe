<template>
    <li class="flex items-center gap-3 py-3 border-b border-gray-200 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors px-2 rounded-lg">
        <div class="flex-shrink-0">
            <button-play-pause :sound="sound" variant="text" />
        </div>
        <div class="flex flex-1 flex-col justify-center overflow-hidden">
            <h3 class="truncate text-base font-medium text-gray-900 dark:text-white">
                <nuxt-link
                    :to="{ path: `/djs/${sound?.dj?.slug}/sounds/${sound.slug}` }"
                    class="hover:text-primary-500 transition-colors"
                >
                    {{ `${sound.dj.name} – ${sound.name}` }}
                </nuxt-link>
            </h3>
        </div>

        <div v-if="sound.duration" class="flex-shrink-0">
            <UBadge color="neutral" variant="soft" class="text-xs">
                {{ $audio.convertTimeHHMMSS(sound.duration) }}
            </UBadge>
        </div>
        <div class="flex-shrink-0">
            <button-playlist-add-remove :sound="sound" />
        </div>
    </li>
</template>

<script setup lang="ts">
import ButtonPlayPause from '~/components/audio/ButtonPlayPause.client.vue'
import ButtonPlaylistAddRemove from '~/components/audio/ButtonPlaylistAddRemove.client.vue'

const props = defineProps({
    sound: {
        type: Object,
        required: true
    }
})
</script>
