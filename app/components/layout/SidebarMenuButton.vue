<template>
    <UChip
        :show="unreadCount > 0"
        color="success"
        size="sm"
        inset
    >
        <UButton
            icon="i-lucide-user"
            variant="ghost"
            color="neutral"
            @click="mainStore.isSidebarOpen = !mainStore.isSidebarOpen"
        />
    </UChip>
</template>

<script setup lang="ts">
import { useMainStore, useNotificationsStore } from '~/stores';

const mainStore = useMainStore();
const { unreadCount } = storeToRefs(useNotificationsStore());
</script>
