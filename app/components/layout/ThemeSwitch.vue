<template>
    <a class="navbar-item is-right" @click="toggleTheme">
        <o-icon :icon="icon || 'white-balance-sunny'" />
    </a>
</template>

<script setup lang="ts">
import { useTheme } from '~/composables/useTheme';
const { theme, toggleTheme } = useTheme();

const icon = computed(() =>
    theme.value === 'dark' ? 'white-balance-sunny' : 'moon-waxing-crescent'
);
</script>
