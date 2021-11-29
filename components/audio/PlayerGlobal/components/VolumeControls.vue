<template>
    <div v-if="showCancelLoadingButton" class="has-text-centered">
        <o-button variant="danger" @click.stop="resetAudio">
            {{ $t('player.cancel_loading') }}
        </o-button>
    </div>
    <div v-else class="columns is-vcentered is-mobile is-gapless">
        <div class="column is-narrow mr-3">
            <o-button
                :disabled="!isLoaded || isError"
                variant="primary"
                size="size-6"
                :icon-left="volumeIcon"
                @click.stop="() => onMute()"
            />
        </div>
        <div class="column mr-4">
            <o-slider
                :value="volume"
                :tooltip="false"
                :max="100"
                :disabled="!isLoaded || isError"
                variant="secondary"
                @input="(newVolume) => setVolume(newVolume)"
            />
        </div>
        <div class="column is-narrow">
            <o-button
                variant="primary"
                size="size-6"
                icon-left="playlist-music"
                @click.stop="() => setIsPlaylistOpen(true)"
            />
        </div>
        <div class="column is-narrow mr-2">
            <o-button
                variant="primary"
                size="size-6"
                icon-left="chevron-down"
                @click.stop="() => setIsBottomBarOpen(false)"
            />
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    computed: {
        ...mapGetters('player', [
            'isLoaded',
            'previousVolume',
            'volume',
            'isLoading',
            'isError',
            'isMuted',
            'showCancelLoadingButton'
        ]),
        volumeIcon() {
            let volumeIcon = 'volume-off'
            if (this.volume > 0 && this.volume <= 30) {
                volumeIcon = 'volume-low'
            }
            if (this.volume > 30 && this.volume <= 60) {
                volumeIcon = 'volume-medium'
            }
            if (this.volume > 60) {
                volumeIcon = 'volume-high'
            }
            return volumeIcon
        }
    },
    methods: {
        ...mapActions(['setIsPlaylistOpen', 'setIsBottomBarOpen']),
        ...mapActions('player', ['setPreviousVolume', 'setVolume', 'setIsMuted']),
        onMute() {
            if (this.isMuted) {
                return this.setVolume(this.previousVolume)
            }

            this.setPreviousVolume(this.volume)
            this.setVolume(0)
        }
    }
}
</script>
