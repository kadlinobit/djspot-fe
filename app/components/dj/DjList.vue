<template>
    <div class="dj-list">
        <!-- Loading State Skeletons -->
        <UPageGrid
            v-if="isDjListEmpty"
            class="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        >
            <dj-list-item-skeleton v-for="i in 12" :key="i" />
        </UPageGrid>

        <!-- Result Grid -->
        <UPageGrid
            v-else
            class="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        >
            <dj-list-item
                v-for="dj in djs"
                :key="dj.id"
                :dj="dj"
            />
        </UPageGrid>
    </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import DjListItem from '~/components/dj/DjListItem.vue';
import DjListItemSkeleton from '~/components/dj/DjListItemSkeleton.vue';
import type { IDjDefault } from '~/plugins/directus/collection/dj';

interface Props {
    djs: IDjDefault[];
}

const props = withDefaults(defineProps<Props>(), {
    djs: () => []
});

const isDjListEmpty = computed(() => {
    return _.isEmpty(props.djs);
});
</script>
