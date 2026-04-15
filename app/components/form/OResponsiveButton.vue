<template>
    <nuxt-link v-if="props.to" :to="props.to">
        <o-button size="small is-responsive" v-bind="$attrs">
            <slot />
        </o-button>
        <o-button class="is-hidden-mobile" v-bind="$attrs">
            <slot />
        </o-button>
    </nuxt-link>
    <div v-else>
        <o-button size="small" class="is-hidden-tablet" v-bind="$attrs">
            <slot />
        </o-button>
        <o-button class="is-hidden-mobile" v-bind="$attrs">
            <slot />
        </o-button>
    </div>
</template>

<script setup lang="ts">
//TODO - handle nuxt link better
interface Props {
    to?: string | Object
}

const props = withDefaults(defineProps<Props>(), {
    to: null
})
</script>
