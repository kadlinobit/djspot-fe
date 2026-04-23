<template>
    <nuxt-link v-if="props.to" :to="props.to">
        <UButton size="sm" class="sm:hidden" v-bind="$attrs">
            <slot />
        </UButton>
        <UButton class="hidden sm:inline-flex" v-bind="$attrs">
            <slot />
        </UButton>
    </nuxt-link>
    <div v-else>
        <UButton size="sm" class="sm:hidden" v-bind="$attrs">
            <slot />
        </UButton>
        <UButton class="hidden sm:inline-flex" v-bind="$attrs">
            <slot />
        </UButton>
    </div>
</template>

<script setup lang="ts">
interface Props {
    to?: string | object
}

const props = withDefaults(defineProps<Props>(), {
    to: null
})
</script>
