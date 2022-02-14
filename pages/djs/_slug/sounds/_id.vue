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
                                <client-only>
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
                                </client-only>
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
                                :key="`genre-${genre.genre_id.id}`"
                                class="tag is-peach is-size-5-desktop is-size-6-mobile is-size-6-tablet"
                            >
                                {{ genre.genre_id.name }}
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
                                :variant="likeButtonVariant"
                                icon-left="heart"
                                :disabled="isToggleLikeLoading"
                                @click="onToggleLike"
                            >
                                {{ sound.like_count || 'Like' }}
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
                <o-tabs
                    v-if="!!sound.description"
                    v-model="activeTab"
                    :expanded="true"
                    :animated="true"
                >
                    <o-tab-item v-if="!!sound.description" :label="$t(`${sound.type}.description`)">
                        <div class="content" v-html="$marked.markdownToHtml(sound.description)" />
                    </o-tab-item>
                </o-tabs>
            </div>
        </div>
    </section>
</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
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
            sound: null,
            activeTab: 1,
            isToggleLikeLoading: false
        }
    },
    async fetch() {
        try {
            const slug = this.$nuxt.context.params.slug
            const id = this.$nuxt.context.params.id
            let fields = this.$api.collection.getCollectionFields('sound', 'detailed')

            if (!this.$auth.loggedIn) {
                fields = fields.filter((field) => field !== 'likes')
            }

            const { data } = await this.$axios.$request('items/sound', {
                method: 'search',
                data: {
                    query: {
                        filter: {
                            _and: [{ id: { _eq: id } }, { dj: { slug: { _eq: slug } } }]
                        },
                        fields,
                        deep: this.$auth.user
                            ? {
                                  likes: {
                                      _filter: {
                                          user_created: {
                                              _eq: this.$auth?.user?.id || null
                                          }
                                      }
                                  }
                              }
                            : null
                    }
                }
            })

            if (data && data.length > 0) {
                this.sound = data[0]
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
        likeButtonVariant() {
            if (!this.$auth.loggedIn) return 'light'
            return this.sound.likes.length > 0 ? 'dark' : 'light'
        }
    },
    methods: {
        ...mapActions(['setIsLoginOpen', 'setLoginActiveComponent']),
        ...mapActions('player', ['loadNewAudio', 'setIsPlaying']),
        ...mapActions('playlist', ['handlePlaySound', 'handleAddOrRemovePlaylistSound']),
        onPlayNewSound(sound) {
            this.handlePlaySound(sound)
            this.loadNewAudio(sound)
        },
        async onToggleLike() {
            if (!this.$auth.loggedIn) {
                this.setLoginActiveComponent('login')
                this.setIsLoginOpen(true)
                return
            }
            this.isToggleLikeLoading = true
            try {
                _.isEmpty(this.sound.likes) ? await this.createLike() : await this.deleteLike()
            } catch (e) {
                throw new Error(e)
            } finally {
                this.isToggleLikeLoading = false
            }
        },
        async createLike() {
            const result = await this.$axios.post('items/user_sound_like', {
                sound: this.sound.id
            })

            if (result.status === 200) {
                this.sound.likes = [result.data.data.id]
                this.sound.like_count++
            } else {
                throw new Error('Could not toggle like')
            }
        },
        async deleteLike() {
            const result = await this.$axios.delete(`items/user_sound_like/${this.sound.likes[0]}`)

            if (result.status === 204) {
                this.sound.likes = []
                this.sound.like_count--
            } else {
                throw new Error('Could not toggle like')
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
