<template>
    <ul v-if="isDjsListEmpty">
        <dj-list-item-skeleton v-for="i in 5" :key="i" />
    </ul>
    <ul v-else class="dj-list">
        <dj-list-item v-for="dj in djs" :key="dj.id" :dj="dj" />
    </ul>
</template>

<script>
import _ from 'lodash'
import DjListItem from '~/components/dj/DjListItem.vue'
import DjListItemSkeleton from '~/components/dj/DjListItemSkeleton.vue'

export default {
    components: {
        DjListItem,
        DjListItemSkeleton
    },
    props: {
        djs: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        isDjsListEmpty() {
            return _.isEmpty(this.djs)
        }
    }
}
</script>
