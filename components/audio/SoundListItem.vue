<template>
    <li class="columns is-mobile is-vcentered is-gapless is-mobile">
        <div class="column is-narrow mr-1">
            <button-play-pause :sound="sound" variant="text" />
        </div>
        <div class="column is-text-ellipsis mr-1">
            <nuxt-link
                :to="{ path: `/djs/${sound?.dj?.slug}/sounds/${sound.id}` }"
            >
                {{ `${sound.dj.name} – ${sound.name}` }}
            </nuxt-link>
        </div>

        <div v-if="sound.duration" class="column is-narrow mr-1">
            <span class="tag">
                {{ $audio.convertTimeHHMMSS(sound.duration) }}
            </span>
        </div>
        <div class="column is-narrow mr-1">
            <button-playlist-add-remove :sound="sound" />
        </div>
    </li>
</template>

<script setup lang="ts">
import ButtonPlayPause from '~/components/audio/ButtonPlayPause.vue'
import ButtonPlaylistAddRemove from '~/components/audio/ButtonPlaylistAddRemove.vue'

const props = defineProps({
    sound: {
        type: Object,
        required: true
    }
})
</script>
