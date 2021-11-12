<template>
    <section class="section">
        <div class="container is-max-desktop">
            <o-loading
                v-if="$fetchState.pending"
                :full-page="false"
                :active.sync="$fetchState.pending"
                :can-cancel="true"
            ></o-loading>
            <p v-else-if="$fetchState.error">{{ $fetchState.error.message }}</p>
            <div v-else>
                <div class="columns sound-main-info">
                    <div class="column">
                        <div class="columns is-mobile is-vcentered">
                            <div class="column is-narrow">
                                <o-button
                                    v-if="!currentSound || currentSound.id !== sound.id"
                                    :disabled="isPlayerLoading"
                                    variant="text"
                                    size="large"
                                    icon-left="play"
                                    @click.prevent="() => onPlayNewSound(sound)"
                                />
                                <o-button
                                    v-if="currentSound && currentSound.id === sound.id"
                                    :disabled="isPlayerLoading"
                                    variant="text"
                                    size="large"
                                    :icon-left="isPlaying ? 'pause' : 'play'"
                                    @click.prevent="() => setIsPlaying(!isPlaying)"
                                />
                            </div>
                            <div class="column">
                                <h1 class="title is-size-4-mobile is-size-3-desktop">
                                    {{ sound.name }}
                                </h1>
                                <h4 class="subtitle is-6">
                                    <span class="light mr-2">
                                        {{ $t(`${sound.type}.type`) }}
                                    </span>
                                    <span class="icon-text mr-2">
                                        <span class="icon">
                                            <i class="mdi mdi-clock-outline"></i>
                                        </span>
                                        <span>{{ $audio.convertTimeHHMMSS(sound.duration) }}</span>
                                    </span>
                                    <span class="icon-text">
                                        <span class="icon">
                                            <i class="mdi mdi-calendar"></i>
                                        </span>
                                        <span>{{ $time.fromNow(sound.created_at) }}</span>
                                    </span>
                                </h4>
                            </div>
                            <div class="column is-hidden-tablet is-narrow">
                                <cover-image
                                    quality="thumbnail"
                                    cover-type="sound"
                                    :pixel-size="100"
                                    :cover-image="sound.photo || null"
                                />
                            </div>
                        </div>
                        <div v-if="sound.genres" class="tags">
                            <span
                                v-for="genre in sound.genres"
                                :key="`genre-${genre.id}`"
                                class="
                                    tag
                                    is-primary
                                    is-light
                                    is-size-5-desktop
                                    is-size-6-mobile
                                    is-size-6-tablet
                                "
                            >
                                {{ genre.name }}
                            </span>
                        </div>
                        <dj-info-box :dj="sound.dj" />
                    </div>
                    <div class="column is-narrow is-hidden-mobile">
                        <cover-image
                            quality="small"
                            cover-type="sound"
                            :pixel-size="300"
                            :cover-image="sound.photo || null"
                        />
                    </div>
                </div>
                <div class="level is-mobile sound-controls">
                    <div class="level-left">
                        <div class="level-item">
                            <o-responsive-button
                                :variant="sound.isLikedByMe ? 'dark' : 'light'"
                                icon-left="heart"
                                @click="onToggleLike"
                            >
                                {{ sound.likesCount || 'Like' }}
                            </o-responsive-button>
                        </div>
                        <div class="level-item">
                            <o-responsive-button
                                :variant="isSoundInPlaylist(sound) ? 'dark' : 'light'"
                                icon-left="playlist-play"
                                @click="handleAddOrRemovePlaylistSound(sound)"
                            >
                                Playlist
                            </o-responsive-button>
                        </div>
                    </div>
                    <div class="level-right">
                        <div class="level-item">
                            <o-responsive-button
                                variant="dark"
                                tag="nuxt-link"
                                icon-left="pencil"
                                :to="{ path: `/sounds/manage/edit/${sound.id}` }"
                            >
                                {{ $t('form.edit') }}
                            </o-responsive-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { getSounds, toggleSoundLike } from '~/api/graphql/sound'
import DjInfoBox from '~/components/dj/DjInfoBox.vue'
import CoverImage from '~/components/media/CoverImage.vue'
import OResponsiveButton from '~/components/form/OResponsiveButton.vue'

export default {
    name: 'SoundDetailsPage',
    components: {
        DjInfoBox,
        CoverImage,
        OResponsiveButton
    },
    data() {
        return {
            sound: null
        }
    },
    async fetch() {
        try {
            const slug = this.$nuxt.context.params.slug
            const id = this.$nuxt.context.params.id
            const data = await this.$strapi.graphql({
                query: getSounds('detailed'),
                variables: {
                    where: {
                        id,
                        'dj.slug': slug
                    }
                }
            })

            if (data.sounds && data.sounds.length > 0) {
                this.sound = data.sounds[0]
            } else {
                this.$fetchState.error = 'Sound not found'
                return this.$nuxt.error({ statusCode: 404, message: 'Sound not found' })
            }
        } catch (e) {
            this.$fetchState.error = e
            if (e.statusCode && e.statusCode === 404) {
                return this.$nuxt.error({ statusCode: 404, message: e.message })
            }
        }
    },
    computed: {
        ...mapGetters('player', {
            currentSound: 'currentSound',
            isPlaying: 'isPlaying',
            isPlayerLoading: 'isLoading'
        }),
        ...mapGetters('playlist', ['isSoundInPlaylist']),
        likesCount() {
            return this.sound ? this.sound.likes.length : 0
        },
        isLikedByMe() {
            if (this.$strapi.user) {
                return this.sound.likes.some((like) => like.user.id === this.$strapi.user.id)
            }
            return false
        }
    },
    methods: {
        ...mapActions('player', ['loadNewAudio', 'setIsPlaying']),
        ...mapActions('playlist', ['handlePlaySound', 'handleAddOrRemovePlaylistSound']),
        onPlayNewSound(sound) {
            this.handlePlaySound(sound)
            this.loadNewAudio(sound)
        },
        onToggleLike() {
            this.sound.isLikedByMe ? this.sound.likesCount-- : this.sound.likesCount++
            this.sound.isLikedByMe = !this.sound.isLikedByMe
            this.toggleLike()
        },
        async toggleLike() {
            try {
                const data = await this.$strapi.graphql({
                    query: toggleSoundLike('detailed'),
                    variables: {
                        id: this.sound.id
                    }
                })

                if (data.toggleSoundLike) {
                    this.sound = data.toggleSoundLike
                }
            } catch (e) {
                throw new Error(e)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.sound-controls {
    // border: 1px solid #eee;
}
</style>
