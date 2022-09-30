<template>
    <div v-if="isDjListEmpty">
        <dj-list-item-skeleton v-for="i in 5" :key="i" />
    </div>
    <div v-else class="columns is-mobile is-multiline dj-list">
        <div
            v-for="dj in djs"
            :key="dj.id"
            class="column is-2-widescreen is-3-desktop is-4-tablet is-6-mobile"
        >
            <dj-list-item :dj="dj" />
        </div>
    </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import DjListItem from '~/components/dj/DjListItem.vue'
import DjListItemSkeleton from '~/components/dj/DjListItemSkeleton.vue'

interface Props {
    djs: Array<Object>
}

const props = withDefaults(defineProps<Props>(), {
    djs: () => []
})

const isDjListEmpty = computed(() => {
    return _.isEmpty(props.djs)
})
</script>
