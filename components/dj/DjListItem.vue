<template>
    <div class="dj-list-item card">
        <div class="card-image">
            <cover-image
                :cover-image="props.dj.photo || null"
                quality="thumbnail"
                cover-type="dj"
            />
        </div>
        <div class="card-content">
            <div class="title is-5">
                <nuxt-link :to="`/djs/${props.dj.slug}`">{{
                    props.dj.name
                }}</nuxt-link>
            </div>
            <div class="subtitle is-6">
                {{ props.dj?.city?.name }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import CoverImage from '~/components/media/CoverImage.vue'

interface Props {
    dj: Dj
}

const props = withDefaults(defineProps<Props>(), {
    dj: () => ({})
})
</script>
