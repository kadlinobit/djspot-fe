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
                                    <h1 class="title is-size-3-mobile is-size-2-desktop">
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
                                    :key="`genre-${genre.id}`"
                                    class="
                                        tag
                                        is-peach is-size-5-desktop is-size-6-mobile is-size-6-tablet
                                    "
                                >
                                    {{ genre.name }}
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

                    <dj-control-box :dj="dj" :on-toggle-follow="onToggleFollow" />
                </div>
            </div>
        </section>

        <section class="section p-3">
            <div class="container is-max-desktop">
                <o-tabs
                    v-if="dj.bio || (mixes && mixes.length > 0) || (tracks && tracks.length > 0)"
                    v-model="activeTab"
                    :expanded="true"
                    :animated="true"
                >
                    <o-tab-item v-if="!!dj.bio" label="Bio">
                        <div v-dompurify-html="$marked.markdownToHtml(dj.bio)" class="content" />
                    </o-tab-item>

                    <o-tab-item v-if="mixes && mixes.length > 0" label="Sety">
                        <SoundList :sounds="mixes" />
                    </o-tab-item>

                    <o-tab-item v-if="tracks && tracks.length > 0" label="Tracky">
                        <SoundList :sounds="tracks" />
                    </o-tab-item>
                </o-tabs>
            </div>
        </section>
    </div>
</template>

<script>
import { getDjs, toggleDjFollow } from '~/api/graphql/dj'
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
            activeTab: 1
        }
    },
    async fetch() {
        try {
            const slug = this.$nuxt.context.params.slug
            const data = await this.$strapi.graphql({
                query: getDjs('withMixes'),
                variables: {
                    where: {
                        slug
                    }
                }
            })

            if (data.djs && data.djs.length > 0) {
                this.dj = data.djs[0]
            } else {
                this.$fetchState.error = 'DJ not found'
                return this.$nuxt.error({ statusCode: 404, message: 'DJ not found' })
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
            return this.dj.sounds.filter((sound) => sound.type === 'mix') || []
        },
        tracks() {
            return this.dj.sounds.filter((sound) => sound.type === 'track') || []
        }
    },
    methods: {
        onToggleFollow() {
            this.dj.isFollowedByMe ? this.dj.followsCount-- : this.dj.followsCount++
            this.dj.isFollowedByMe = !this.dj.isFollowedByMe
            this.toggleFollow()
        },
        async toggleFollow() {
            try {
                const data = await this.$strapi.graphql({
                    query: toggleDjFollow('withMixes'),
                    variables: {
                        id: this.dj.id
                    }
                })

                if (data.toggleDjFollow) {
                    this.dj = data.toggleDjFollow
                }
            } catch (e) {
                throw new Error(e)
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
