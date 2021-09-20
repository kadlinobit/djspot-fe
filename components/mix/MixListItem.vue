<template>
    <div class="level">
        <div class="level-left">
            <div v-if="!currentMix || currentMix.id !== mix.id" class="level-item">
                <b-button
                    type="is-text"
                    size="is-medium"
                    icon-left="play"
                    @click.prevent="() => onPlayNewMix(mix)"
                />
            </div>
            <div v-if="currentMix && currentMix.id === mix.id" class="level-item">
                <b-button
                    type="is-text"
                    size="is-medium"
                    :icon-left="isPlaying ? 'pause' : 'play'"
                    @click.prevent="() => setIsPlaying(!isPlaying)"
                />
            </div>
            <div class="level-item">
                <nuxt-link :to="{ path: `/djs/${mix.dj.slug}/mixes/${mix.id}` }">
                    {{ `${mix.dj.name} – ${mix.name}` }}
                </nuxt-link>
            </div>
        </div>
        <div class="level-right"></div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    props: {
        mix: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters('player', ['currentMix', 'isPlaying'])
    },
    methods: {
        ...mapActions('player', ['loadNewAudio', 'setIsPlaying']),
        ...mapActions('playlist', ['handlePlayMix']),
        onPlayNewMix(mix) {
            this.handlePlayMix(mix)
            this.loadNewAudio(mix)
        }
    }
}
</script>
