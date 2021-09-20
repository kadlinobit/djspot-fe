<template>
    <div>
        <MixListItem v-for="mix in mixes" :key="mix.id" :mix="mix" />
    </div>
</template>

<script>
import MixListItem from '~/components/mix/MixListItem.vue'

export default {
    components: {
        MixListItem
    },
    props: {
        mixes: {
            type: Array,
            required: true
        }
    }
}
</script>
