<template>
    <div class="space-y-4">
        <ul v-if="isSoundListEmpty" class="flex flex-col gap-2">
            <sound-list-item-skeleton v-for="i in 5" :key="i" />
        </ul>
        <ul v-else class="flex flex-col gap-2">
            <sound-list-item
                v-for="sound in sounds"
                :key="sound.id"
                :sound="sound"
            />
        </ul>
    </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import SoundListItem from '~/components/sound/SoundListItem.vue';
import SoundListItemSkeleton from '~/components/sound/SoundListItemSkeleton.vue';
import type { ISoundDefault } from '~/plugins/directus/collection';

interface Props {
    sounds?: Array<ISoundDefault>;
}

const props = withDefaults(defineProps<Props>(), {
    sounds: () => []
});

const isSoundListEmpty = computed(() => {
    return _.isEmpty(props.sounds);
});
</script>
