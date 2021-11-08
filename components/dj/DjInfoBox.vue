<template>
    <div class="box">
        <div class="media">
            <figure class="media-left">
                <cover-image
                    :cover-image="dj.photo || null"
                    quality="thumbnail"
                    cover-type="dj"
                    :pixel-size="64"
                />
            </figure>
            <div class="media-right">
                <p class="title is-4">
                    <nuxt-link :to="{ path: `/djs/${dj.slug}` }">
                        {{ dj.name }}
                    </nuxt-link>
                </p>
                <p class="subtitle is-6">
                    {{ dj.city }}
                </p>
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
            required: true
        }
    }
}
</script>
