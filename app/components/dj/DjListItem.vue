<template>
    <div class="dj-list-item card">
        <div class="card-image">
            <cover-image
                :name="dj?.name"
                :cover-image="dj?.photo || undefined"
                quality="thumbnail"
                cover-type="dj"
            />
        </div>
        <div class="card-content">
            <div class="title is-5">
                <nuxt-link :to="`/djs/${dj.slug}`">{{
                    dj.name
                }}</nuxt-link>
            </div>
            <div class="subtitle is-6">
                {{ props.dj?.city?.name }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import CoverImage from '~/components/media/CoverImage.vue';
import { type IDjDefault } from '~/plugins/directus/collection';

interface Props {
    dj: IDjDefault;
}

const props = defineProps<Props>()
</script>
