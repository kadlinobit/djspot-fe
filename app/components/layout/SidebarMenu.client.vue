<template>
    <USlideover v-model:open="mainStore.isSidebarOpen" side="left">
        <template #header>
            <div class="flex w-full items-center gap-2">
                <SidebarUserBox @close="closeSidebar" />
                <UButton
                    icon="i-lucide-x"
                    color="neutral"
                    variant="ghost"
                    aria-label="Close sidebar"
                    @click="closeSidebar"
                />
            </div>
        </template>

        <template #body>
            <div
                class="flex h-full flex-col gap-6"
                @touchstart.passive="onTouchStart"
                @touchend.passive="onTouchEnd"
            >
                <SidebarDjBox @select="closeSidebar" />

                <SidebarNotificationsBox />
            </div>
        </template>
    </USlideover>
</template>

<script setup lang="ts">
import { useMainStore } from '~/stores';
import SidebarUserBox from './SidebarUserBox.vue';
import SidebarDjBox from './SidebarDjBox.vue';
import SidebarNotificationsBox from './SidebarNotificationsBox.vue';

const mainStore = useMainStore();
const route = useRoute();

function closeSidebar() {
    mainStore.isSidebarOpen = false;
}

watch(() => route.fullPath, closeSidebar);

const touchStartX = ref(0);

function onTouchStart(e: TouchEvent) {
    if (e.touches[0]) touchStartX.value = e.touches[0].clientX;
}

function onTouchEnd(e: TouchEvent) {
    if (!e.changedTouches[0]) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.value;
    if (deltaX < -50) closeSidebar();
}
</script>
