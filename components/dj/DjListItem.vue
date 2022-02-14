<template>
    <div class="dj-list-item card">
        <div class="card-image">
            <cover-image :cover-image="dj.photo || null" quality="thumbnail" cover-type="dj" />
        </div>
        <div class="card-content">
            <div class="title is-5">
                <nuxt-link :to="`/djs/${dj.slug}`">{{ dj.name }}</nuxt-link>
            </div>
            <div class="subtitle is-6">
                {{ dj.city }}
            </div>
        </div>
    </div>
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
