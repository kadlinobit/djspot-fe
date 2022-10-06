<template>
    <section class="section">
        <div class="container is-max-desktop">
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
                <div class="columns sound-main-info">
                    <div class="column">
                        <div class="columns is-mobile is-vcentered">
                            <div class="column is-narrow">
                                <button-play-pause
                                    :sound="sound"
                                    size="large"
                                    variant="text"
                                />
                            </div>
                            <div class="column">
                                <h1
                                    class="title is-size-4-mobile is-size-3-desktop"
                                >
                                    {{ sound.name }}
                                </h1>
                                <h4 class="subtitle is-6">
                                    <span class="light mr-2">
                                        {{ $i18n.t(`${sound.type}.type`) }}
                                    </span>
                                    <span class="icon-text mr-2">
                                        <span class="icon">
                                            <i
                                                class="mdi mdi-clock-outline"
                                            ></i>
                                        </span>
                                        <span>{{
                                            $audio.convertTimeHHMMSS(
                                                sound.duration
                                            )
                                        }}</span>
                                    </span>
                                    <span class="icon-text">
                                        <span class="icon">
                                            <i class="mdi mdi-calendar"></i>
                                        </span>
                                        <span>{{
                                            $time.fromNow(sound.created_at)
                                        }}</span>
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
                        <div v-if="sound?.genres" class="tags">
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
                                :variant="
                                    playlistStore.isSoundInPlaylist(sound)
                                        ? 'dark'
                                        : 'light'
                                "
                                icon-left="playlist-play"
                                @click="
                                    playlistStore.handleAddOrRemovePlaylistSound(
                                        sound
                                    )
                                "
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
                                :to="{
                                    path: `/sounds/manage/edit/${sound.id}`
                                }"
                            >
                                {{ $i18n.t('form.edit') }}
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
                    <o-tab-item
                        v-if="!!sound.description"
                        :label="$i18n.t(`${sound.type}.description`)"
                    >
                        <div
                            class="content"
                            v-html="$marked.markdownToHtml(sound.description)"
                        />
                    </o-tab-item>
                </o-tabs>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import _ from 'lodash'
import DjInfoBox from '~/components/dj/DjInfoBox.vue'
import CoverImage from '~/components/media/CoverImage.vue'
import OResponsiveButton from '~/components/form/OResponsiveButton.vue'
import ButtonPlayPause from '~/components/audio/ButtonPlayPause.vue'
import { useMainStore, usePlaylistStore } from '~/stores'
import useDirectus, { useAuth } from '~/composables/directus'

const { $i18n, $api, $marked, $time, $oruga, $audio } = useNuxtApp()
const mainStore = useMainStore()
const playlistStore = usePlaylistStore()
const route = useRoute()
const directus = useDirectus()
const auth = useAuth()

const activeTab = ref(1)
const isToggleLikeLoading = ref(false)

const {
    data: sound,
    pending: fetchPending,
    refresh: fetchRefresh,
    error: fetchError
} = useLazyAsyncData(
    'soundDetailsPageQuery',
    async () => {
        const slug = route.params.slug
        const id = route.params.id

        let fields = $api.collection.getCollectionFields('sound', 'detailed')

        if (!auth.loggedIn) {
            fields = fields.filter((field) => field !== 'likes')
        }

        const sounds = await directus.items('sound').readByQuery({
            filter: {
                _and: [{ id: { _eq: id } }, { dj: { slug: { _eq: slug } } }]
            },
            fields,
            deep: auth.loggedIn
                ? {
                      likes: {
                          _filter: {
                              user_created: {
                                  _eq: auth?.user?.value?.id || null
                              }
                          }
                      }
                  }
                : null
        })

        if (sounds.data && sounds.data.length > 0) {
            return sounds.data[0]
        } else {
            throw new Error('Sound not found')
        }
    },
    // There must be no server side data load - otherwise it is not working
    // TODO: Maybe remove when we get to NUXT 3
    { server: false, initialCache: false, watch: auth.loggedIn.value }
)

const likeButtonVariant = computed(() => {
    if (!auth.loggedIn.value) return 'light'
    return sound.value.likes.length > 0 ? 'dark' : 'light'
})

async function onToggleLike() {
    if (!auth.loggedIn.value) {
        mainStore.setLoginActiveComponent('login')
        mainStore.setIsLoginOpen(true)
        return
    }
    isToggleLikeLoading.value = true
    try {
        _.isEmpty(sound.value.likes) ? await createLike() : await deleteLike()
    } catch (e) {
        throw new Error(e)
    } finally {
        isToggleLikeLoading.value = false
    }
}
async function createLike() {
    try {
        const result = await directus.items('user_sound_like').createOne({
            sound: sound.value.id
        })
        if (result?.id) {
            sound.value.likes = [result.id]
            sound.value.like_count++
        }
    } catch (e) {
        $oruga.notification.open({
            message: e,
            variant: 'danger',
            duration: 7000
        })
    }
}
async function deleteLike() {
    try {
        await directus.items('user_sound_like').deleteOne(sound.value.likes[0])
        sound.value.likes = []
        sound.value.like_count--
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
.sound-controls {
    // border: 1px solid #eee;
}
</style>
