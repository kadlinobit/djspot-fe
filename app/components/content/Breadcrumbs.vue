<template>
    <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
            <li v-for="(item, index) in navPath" :key="index">
                <nuxt-link :to="item.path">{{ item.title }}</nuxt-link>
            </li>
        </ul>
    </nav>
</template>
<script setup lang="ts">
interface Props {
    navPath?: Array<Object>
}

const props = withDefaults(defineProps<Props>(), {
    navPath: () => []
})
</script>
