<template>
    <section class="section">
        <div class="container is-max-desktop">
            <b-loading
                v-if="$fetchState.pending"
                :is-full-page="true"
                :can-cancel="true"
            ></b-loading>
            <p v-else-if="$fetchState.error">{{ $fetchState.error.message }}</p>
            <div v-else>
                <div class="columns">
                    <div class="column">
                        <div class="columns is-mobile is-vcentered">
                            <div class="column is-narrow">
                                <b-button
                                    v-if="!currentSound || currentSound.id !== sound.id"
                                    :disabled="isPlayerLoading"
                                    type="is-primary"
                                    size="is-large"
                                    icon-left="play"
                                    @click.prevent="() => onPlayNewSound(sound)"
                                />
                                <b-button
                                    v-if="currentSound && currentSound.id === sound.id"
                                    :disabled="isPlayerLoading"
                                    type="is-primary"
                                    size="is-large"
                                    :icon-left="isPlaying ? 'pause' : 'play'"
                                    @click.prevent="() => setIsPlaying(!isPlaying)"
                                />
                            </div>
                            <div class="column">
                                <h1 class="title">{{ sound.name }}</h1>
                                <h2 class="subtitle">
                                    <nuxt-link :to="{ path: `/djs/${sound.dj.slug}` }">
                                        {{ sound.dj.name }}
                                    </nuxt-link>
                                </h2>
                            </div>
                            <div class="column is-narrow">
                                <b-button
                                    type="is-text"
                                    icon-right="pencil"
                                    tag="nuxt-link"
                                    :to="{ path: `/sounds/manage/edit/${sound.id}` }"
                                />
                            </div>
                        </div>
                        <b-taglist v-if="sound.genres">
                            <b-tag
                                v-for="genre in sound.genres"
                                :key="`genre-${genre.id}`"
                                type="is-primary is-light"
                                size="is-large"
                            >
                                {{ genre.name }}
                            </b-tag>
                        </b-taglist>
                    </div>
                    <div v-if="sound.photo" class="column is-narrow">
                        <div
                            class="sound-photo"
                            :style="{
                                backgroundImage: `url(http://localhost:1337${sound.photo.url})`
                            }"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { getSounds } from '~/api/graphql/sound'
export default {
    name: 'SoundDetailsPage',
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
        }
    }
}
</script>

<style lang="scss" scoped>
.sound-photo {
    height: 300px;
    width: 300px;
    background-size: cover;
    background-position: center center;
}
</style>
