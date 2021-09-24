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
                    <div v-if="dj.photo" class="column is-narrow">
                        <div
                            class="dj-photo"
                            :style="{
                                backgroundImage: `url(http://localhost:1337${dj.photo.url})`
                            }"
                        ></div>
                    </div>
                    <div class="column">
                        <div class="columns is-gapless is-vcentered">
                            <div class="column">
                                <h1 class="title">{{ dj.name }}</h1>
                                <h2 class="subtitle">{{ dj.city }}</h2>
                            </div>
                            <div class="column is-narrow">
                                <b-button
                                    type="is-text"
                                    icon-right="pencil"
                                    tag="nuxt-link"
                                    :to="{ path: `/djs/manage/edit/` }"
                                />
                            </div>
                        </div>

                        <b-taglist>
                            <b-tag
                                v-for="genre in dj.genres"
                                :key="`genre-${genre.id}`"
                                type="is-primary"
                                size="is-large"
                            >
                                {{ genre.name }}
                            </b-tag>
                        </b-taglist>
                    </div>
                </div>
                <section>
                    <b-tabs
                        v-if="dj.bio || (mixes && mixes.length > 0)"
                        v-model="activeTab"
                        class="block"
                        size="is-medium"
                    >
                        <b-tab-item v-if="dj.bio" label="Bio">
                            {{ dj.bio }}
                        </b-tab-item>
                        <b-tab-item v-if="mixes && mixes.length > 0" label="Sety">
                            <SoundList :sounds="mixes" />
                        </b-tab-item>
                        <b-tab-item v-if="tracks && tracks.length > 0" label="Tracky">
                            <SoundList :sounds="tracks" />
                        </b-tab-item>
                    </b-tabs>
                </section>
            </div>
        </div>
    </section>
</template>

<script>
import { getDjsWithMixes } from '~/api/graphql/dj'
import SoundList from '~/components/audio/SoundList.vue'
export default {
    components: {
        SoundList
    },
    data() {
        return {
            dj: null,
            activeTab: 0
        }
    },
    async fetch() {
        try {
            const slug = this.$nuxt.context.params.slug
            const data = await this.$strapi.graphql({
                query: getDjsWithMixes(),
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
