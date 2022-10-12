<template>
    <a class="navbar-item is-right" @click="toggleLocale">
        <o-icon icon="earth" />
        <span class="ml-1">{{ $i18n.locale }}</span>
    </a>
</template>

<script setup lang="ts">
const { $i18n } = useNuxtApp()

function toggleLocale() {
    if ($i18n.locale === 'cs') $i18n.setLocale('en')
    else $i18n.setLocale('cs')
}
</script>
