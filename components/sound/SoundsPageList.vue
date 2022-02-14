<template>
    <ul v-if="isSoundListEmpty">
        <dj-list-item-skeleton v-for="i in 5" :key="i" />
    </ul>
    <ul v-else class="sound-list">
        <sound-list-item v-for="sound in sounds" :key="sound.id" :sound="sound" />
    </ul>
</template>

<script>
import _ from 'lodash'
import SoundListItem from '~/components/sound/SoundListItem.vue'
import DjListItemSkeleton from '~/components/dj/DjListItemSkeleton.vue'

export default {
    components: {
        SoundListItem,
        DjListItemSkeleton
    },
    props: {
        sounds: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        isSoundListEmpty() {
            return _.isEmpty(this.sounds)
        }
    }
}
</script>
