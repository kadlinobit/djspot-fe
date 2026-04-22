<template>
    <UButton
        icon="i-lucide-languages"
        variant="ghost"
        color="neutral"
        @click="toggleLocale"
    >
        {{ $i18n.locale.value }}
    </UButton>
</template>

<script setup lang="ts">
const { $i18n } = useNuxtApp()

function toggleLocale() {
    if ($i18n.locale.value === 'cs') $i18n.setLocale('en')
    else $i18n.setLocale('cs')
}
</script>
