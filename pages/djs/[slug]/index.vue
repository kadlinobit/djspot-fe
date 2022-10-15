<template>
    <o-loading
        v-if="fetchPending"
        :full-page="false"
        :active="fetchPending"
        :can-cancel="true"
    />
    <div v-else-if="fetchError">
        {{ fetchError }}
    </div>
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

<script setup lang="ts">
/**
 * TODO
 * - error handling
 * - better handling of toggleFollow ? (fetch DJ again after toggle?)
 * - handle refresh on login - when logged out, refresh does not happen (and directus throws an error on manual refresh)
 */

import _ from 'lodash'
import CoverImage from '~/components/media/CoverImage.vue'
import SoundList from '~/components/audio/SoundList.vue'
import DjControlBox from '~/components/dj/DjControlBox.vue'
import { useMainStore } from '~/stores'
import useDirectus, { useAuth } from '~/composables/directus'

const { $marked, $api, $oruga } = useNuxtApp()
const mainStore = useMainStore()
const directus = useDirectus()
const auth = useAuth()
const route = useRoute()

const activeTab = ref(1)
const isToggleFollowLoading = ref(false)

const {
    data: dj,
    pending: fetchPending,
    refresh: fetchRefresh,
    error: fetchError
} = useLazyAsyncData(
    'djProfilePageQuery',
    async function () {
        // // PROMISE TO SET TIMEOUT FOR TESTING (TODO - REMOVE)
        // await new Promise((resolve) => setTimeout(resolve, 2000))

        const slug = route.params.slug

        let fields = $api.collection.getCollectionFields('dj', 'withSounds')
        if (!auth.loggedIn) {
            fields = fields.filter((field) => field !== 'follows')
        }
        const djs = await directus.items('dj').readByQuery({
            filter: { slug: { _eq: slug } },
            fields,
            deep: auth.loggedIn.value
                ? {
                      follows: {
                          _filter: {
                              user_created: {
                                  _eq: auth?.user?.value?.id || null
                              }
                          }
                      }
                  }
                : null
        })
        if (djs.data && djs.data.length > 0) {
            return djs.data[0]
        } else {
            throw new Error('DJ not found')
        }
    },
    // There must be no server side data load - otherwise it is not working
    // TODO: Maybe remove when we get to NUXT 3
    { server: false, initialCache: false, watch: auth.loggedIn }
)

const mixes = computed(() => {
    if (!dj.value.sounds) return []
    return dj.value.sounds.filter((sound) => sound.type === 'mix') || []
})
const tracks = computed(() => {
    if (!dj.value.sounds) return []
    return dj.value.sounds.filter((sound) => sound.type === 'track') || []
})
async function onToggleFollow() {
    if (!auth.loggedIn.value) {
        mainStore.setLoginActiveComponent('login')
        mainStore.setIsLoginOpen(true)
        return
    }
    isToggleFollowLoading.value = true
    try {
        _.isEmpty(dj.value.follows)
            ? await createFollow()
            : await deleteFollow()
    } catch (e) {
        throw new Error(e)
    } finally {
        isToggleFollowLoading.value = false
    }
}
async function createFollow() {
    // AXIOS WAX
    // const result = await this.$axios.post('items/user_dj_follow', {
    //     dj: this.dj.id
    // })
    try {
        const result = await directus.items('user_dj_follow').createOne({
            dj: dj.value.id
        })

        if (result?.id) {
            dj.value.follows = [result.id]
            dj.value.follow_count++
        }
    } catch (e) {
        $oruga.notification.open({
            message: e,
            variant: 'danger',
            duration: 7000
        })
    }
}
async function deleteFollow() {
    // // AXIOS WAY
    // const result = await this.$axios.delete(
    //     `items/user_dj_follow/${this.dj.follows[0]}`
    // )
    try {
        await directus.items('user_dj_follow').deleteOne(dj.value.follows[0])
        dj.value.follows = []
        dj.value.follow_count--
    } catch (e) {
        $oruga.notification.open({
            message: e,
            variant: 'danger',
            duration: 7000
        })
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
