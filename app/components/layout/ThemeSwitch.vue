<template>
    <UButton
        :icon="icon"
        variant="ghost"
        color="neutral"
        @click="toggleTheme"
    />
</template>

<script setup lang="ts">
const colorMode = useColorMode();

function toggleTheme() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
}

const icon = computed(() =>
    colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'
);
</script>
