<template>
    <li class="sound-list-item columns is-vcentered">
        <div class="column is-narrow">
            <cover-image
                :cover-image="sound.photo || null"
                quality="thumbnail"
                cover-type="sound"
                :pixel-size="64"
            />
        </div>
        <div class="column">
            <div class="title is-5">
                <nuxt-link :to="`/djs/${sound.dj.slug}/sounds/${sound.id}`">{{
                    sound.name
                }}</nuxt-link>
            </div>
            <div class="subtitle is-6">
                {{ sound.type }}
            </div>
        </div>
    </li>
</template>

<script>
import CoverImage from '~/components/media/CoverImage.vue'

export default {
    components: {
        CoverImage
    },
    props: {
        sound: {
            type: Object,
            default: null
        }
    }
}
</script>
