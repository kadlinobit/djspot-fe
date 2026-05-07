<template>
    <UAlert
        v-if="playerStore.isError"
        color="error"
        variant="subtle"
        :title="$i18n.t('player.error_loading_file')"
    />
    <div v-else class="flex items-center gap-4 relative">
        <div class="flex-shrink-0">
            <UBadge color="neutral" variant="soft">
                {{ convertTimeHHMMSS(playerStore.currentSeconds) }}
            </UBadge>
        </div>
        <div v-if="playerStore.isLoading" class="flex-1 flex justify-center">
            <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin text-gray-500" />
        </div>
        <div
            v-else
            class="flex-1 text-center font-semibold truncate"
        >
            <span v-if="playerStore.currentSound">
                {{
                    `${playerStore.currentSound.dj.name} - ${playerStore.currentSound.name}`
                }}
            </span>
        </div>
        <div class="flex-shrink-0">
            <UBadge color="neutral" variant="soft">
                {{ convertTimeHHMMSS(playerStore.durationSeconds) }}
            </UBadge>
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '~/stores'
const playerStore = usePlayerStore()
const { $i18n } = useNuxtApp()
</script>
