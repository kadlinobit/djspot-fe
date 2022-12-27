<template>
    <div class="block">
        <ul v-if="isSoundListEmpty">
            <dj-list-item-skeleton v-for="i in 5" :key="i" />
        </ul>
        <ul v-else class="sound-list">
            <sound-list-item
                v-for="sound in sounds"
                :key="sound.id"
                :sound="sound"
            />
        </ul>
    </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import SoundListItem from '~/components/sound/SoundListItem.vue'
import DjListItemSkeleton from '~/components/dj/DjListItemSkeleton.vue'

interface Props {
    sounds?: Array<Object>
}

const props = withDefaults(defineProps<Props>(), {
    sounds: () => []
})

const isSoundListEmpty = computed(() => {
    return _.isEmpty(props.sounds)
})
</script>
