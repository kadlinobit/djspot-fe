<template>
    <li class="dj-list-item columns is-vcentered">
        <div class="column is-narrow">
            <cover-image
                :cover-image="dj.photo || null"
                quality="thumbnail"
                cover-type="dj"
                :pixel-size="64"
            />
        </div>
        <div class="column">
            <div class="title is-5">
                <nuxt-link :to="`/djs/${dj.slug}`">{{ dj.name }}</nuxt-link>
            </div>
            <div class="subtitle is-6">
                {{ dj.city }}
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
        dj: {
            type: Object,
            default: null
        }
    }
}
</script>
