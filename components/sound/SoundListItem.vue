<template>
    <li class="sound-list-item columns is-gapless is-mobile is-vcentered">
        <div class="column is-narrow mr-1">
            <cover-image
                :cover-image="sound.photo || null"
                quality="thumbnail"
                cover-type="sound"
                :pixel-size="48"
            />
        </div>
        <div class="column mr-1 is-narrow">
            <button-play-pause :sound="sound" size="medium" />
        </div>
        <div class="column is-text-ellipsis">
            <header>
                <h3 class="is-text-ellipsis">
                    <nuxt-link
                        class="is-size-5-desktop is-size-6-tablet has-text-weight-medium"
                        :to="`/djs/${sound?.dj?.slug}/sounds/${sound.id}`"
                        >{{ sound.name }}</nuxt-link
                    >
                </h3>
            </header>
            <div>
                {{ sound.type }}
            </div>
        </div>
    </li>
</template>

<script setup lang="ts">
import CoverImage from '~/components/media/CoverImage.vue'
import ButtonPlayPause from '~~/components/audio/ButtonPlayPause.client.vue'
import { object } from 'yup'

interface Props {
    sound: object | null
}

const props = withDefaults(defineProps<Props>(), {
    sound: null
})
</script>
