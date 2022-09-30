<template>
    <o-loading
        v-if="$fetchState.pending"
        :full-page="false"
        :active.sync="$fetchState.pending"
        :can-cancel="true"
    />
    <p v-else-if="$fetchState.error">{{ $fetchState.error.message }}</p>
    <div v-else>
        <section class="hero is-secondary">
            <div class="hero-body">
                <div class="container is-max-desktop">
                    <div class="columns is-mobile">
                        <div class="column">
                            <div class="columns is-mobile is-vcentered">
                                <div class="column">
                                    <h1
                                        class="title is-size-3-mobile is-size-2-desktop"
                                    >
                                        {{ dj.name }}
                                    </h1>
                                    <h2 class="subtitle">{{ dj.city }}</h2>
                                </div>
                                <div class="column is-hidden-tablet is-narrow">
                                    <cover-image
                                        quality="small"
                                        cover-type="dj"
                                        :pixel-size="100"
                                        :cover-image="dj.photo || null"
                                    />
                                </div>
                            </div>
                            <div class="tags">
                                <span
                                    v-for="genre in dj.genres"
                                    :key="`genre-${genre.genre_id.id}`"
                                    class="tag is-peach is-size-5-desktop is-size-6-mobile is-size-6-tablet"
                                >
                                    {{ genre.genre_id.name }}
                                </span>
                            </div>
                        </div>
                        <div class="column is-hidden-mobile is-narrow">
                            <cover-image
                                quality="small"
                                cover-type="dj"
                                :pixel-size="300"
                                :cover-image="dj.photo || null"
                            />
                        </div>
                    </div>

                    <dj-control-box
                        :dj="dj"
                        :is-toggle-follow-loading="isToggleFollowLoading"
                        @toggleFollow="() => onToggleFollow()"
                    />
                </div>
            </div>
        </section>

        <section class="section p-3">
            <div class="container is-max-desktop">
                <o-tabs
                    v-if="
                        dj.bio ||
                        (mixes && mixes.length > 0) ||
                        (tracks && tracks.length > 0)
                    "
                    v-model="activeTab"
                    :expanded="true"
                    :animated="true"
                >
                    <o-tab-item v-if="!!dj.bio" label="Bio">
                        <div
                            class="content"
                            v-html="$marked.markdownToHtml(dj.bio)"
                        />
                    </o-tab-item>

                    <o-tab-item v-if="mixes && mixes.length > 0" label="Sety">
                        <SoundList :sounds="mixes" />
                    </o-tab-item>

                    <o-tab-item
                        v-if="tracks && tracks.length > 0"
                        label="Tracky"
                    >
                        <SoundList :sounds="tracks" />
                    </o-tab-item>
                </o-tabs>
            </div>
        </section>
    </div>
</template>

<script>
/**
 * TBD
 * - error handling
 * - better handling of toggleFollow ? (fetch DJ again after toggle?)
 */

import _ from 'lodash'
import CoverImage from '~/components/media/CoverImage.vue'
import SoundList from '~/components/audio/SoundList.vue'
import DjControlBox from '~/components/dj/DjControlBox.vue'

export default {
    name: 'DjProfilePage',
    components: {
        SoundList,
        CoverImage,
        DjControlBox
    },
    data() {
        return {
            dj: null,
            activeTab: 1,
            isToggleFollowLoading: false
        }
    },
    async fetch() {
        try {
            const slug = this.$nuxt.context.params.slug
            let fields = this.$api.collection.getCollectionFields(
                'dj',
                'withSounds'
            )

            if (!this.$auth.loggedIn) {
                fields = fields.filter((field) => field !== 'follows')
            }

            const { data } = await this.$axios.$request('items/dj', {
                method: 'search',
                data: {
                    query: {
                        filter: { slug: { _eq: slug } },
                        fields,
                        deep: this.$auth.user
                            ? {
                                  follows: {
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
                this.dj = data[0]
            } else {
                this.$fetchState.error = 'DJ not found'
                return this.$nuxt.error({
                    statusCode: 404,
                    message: 'DJ not found'
                })
            }
        } catch (e) {
            this.$fetchState.error = e
            if (e.statusCode && e.statusCode === 404) {
                return this.$nuxt.error({ statusCode: 404, message: e.message })
            }
        }
    },
    computed: {
        mixes() {
            if (!this.dj.sounds) return []
            return this.dj.sounds.filter((sound) => sound.type === 'mix') || []
        },
        tracks() {
            if (!this.dj.sounds) return []
            return (
                this.dj.sounds.filter((sound) => sound.type === 'track') || []
            )
        }
    },
    methods: {
        async onToggleFollow() {
            this.isToggleFollowLoading = true
            try {
                _.isEmpty(this.dj.follows)
                    ? await this.createFollow()
                    : await this.deleteFollow()
            } catch (e) {
                throw new Error(e)
            } finally {
                this.isToggleFollowLoading = false
            }
        },
        async createFollow() {
            const result = await this.$axios.post('items/user_dj_follow', {
                dj: this.dj.id
            })

            if (result.status === 200) {
                this.dj.follows = [result.data.data.id]
                this.dj.follow_count++
            } else {
                throw new Error('Could not toggle follow')
            }
        },
        async deleteFollow() {
            const result = await this.$axios.delete(
                `items/user_dj_follow/${this.dj.follows[0]}`
            )

            if (result.status === 204) {
                this.dj.follows = []
                this.dj.follow_count--
            } else {
                throw new Error('Could not toggle follow')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.dj-photo {
    height: 300px;
    width: 300px;
    background-size: cover;
    background-position: center center;
}
</style>
