<template>
    <o-notification
        v-if="playerStore.isError"
        variant="danger pt-3 pb-3"
        role="alert"
    >
        {{ $i18n.t('player.error_loading_file') }}
    </o-notification>
    <div v-else class="columns is-vcentered is-mobile is-relative">
        <!--  -->
        <div class="column is-narrow">
            <div class="tag is-secondary">
                {{ $audio.convertTimeHHMMSS(playerStore.currentSeconds) }}
            </div>
        </div>
        <div v-if="playerStore.isLoading" class="column">
            <o-loading
                :full-page="false"
                :active.sync="playerStore.isLoading"
                :overlay="false"
                :can-cancel="false"
                icon-size="small"
            ></o-loading>
        </div>
        <div
            v-else
            class="column has-text-centered has-text-weight-semibold is-text-ellipsis"
        >
            <span v-if="playerStore.currentSound">
                {{
                    `${playerStore.currentSound.dj.name} - ${playerStore.currentSound.name}`
                }}
            </span>
        </div>
        <div class="column is-narrow">
            <div class="tag is-secondary">
                {{ $audio.convertTimeHHMMSS(playerStore.durationSeconds) }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '~/stores'
const playerStore = usePlayerStore()
const { $audio, $i18n } = useNuxtApp()
</script>
