<template>
    <section class="section">
        <div class="container is-max-desktop">
            <o-loading
                v-if="pending"
                :full-page="false"
                :active.sync="pending"
                :can-cancel="true"
            ></o-loading>
            <p v-else-if="error">{{ error.message }}</p>
            <div v-else-if="!_.isNil(sound.data)">
                <div class="columns sound-main-info">
                    <div class="column">
                        <div class="columns is-mobile is-vcentered">
                            <div class="column is-narrow">
                                <button-play-pause
                                    :sound="sound.data"
                                    size="large"
                                    variant="text"
                                />
                            </div>
                            <div class="column">
                                <h1
                                    class="title is-size-4-mobile is-size-3-desktop"
                                >
                                    {{ sound.data.name }}
                                </h1>
                                <h4 class="subtitle is-6">
                                    <span class="light mr-2">
                                        {{ $i18n.t(`${sound.data.type}.type`) }}
                                    </span>
                                    <span class="icon-text mr-2">
                                        <span class="icon">
                                            <i
                                                class="mdi mdi-clock-outline"
                                            ></i>
                                        </span>
                                        <span>{{
                                            $audio.convertTimeHHMMSS(
                                                sound.data.duration
                                            )
                                        }}</span>
                                    </span>
                                    <span class="icon-text">
                                        <span class="icon">
                                            <i class="mdi mdi-calendar"></i>
                                        </span>
                                        <span>{{
                                            $time.fromNow(sound.data.created_at)
                                        }}</span>
                                    </span>
                                </h4>
                            </div>
                            <div class="column is-hidden-tablet is-narrow">
                                <cover-image
                                    quality="thumbnail"
                                    cover-type="sound"
                                    :pixel-size="100"
                                    :cover-image="sound.data.photo || null"
                                />
                            </div>
                        </div>
                        <div v-if="sound?.genres" class="tags">
                            <span
                                v-for="genre in sound.data.genres"
                                :key="`genre-${genre.genre_id.id}`"
                                class="tag is-peach is-size-5-desktop is-size-6-mobile is-size-6-tablet"
                            >
                                {{ genre.genre_id.name }}
                            </span>
                        </div>
                        <dj-info-box :dj="sound.data.dj" />
                    </div>
                    <div class="column is-narrow is-hidden-mobile">
                        <cover-image
                            quality="small"
                            cover-type="sound"
                            :pixel-size="300"
                            :cover-image="sound.data.photo || null"
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
                                {{ sound.data.like_count || 'Like' }}
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
                                    path: `/sounds/manage/edit/${sound.data.id}`
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

const { $auth, $i18n, $api, $marked, $time, $axios } = useNuxtApp()
const mainStore = useMainStore()
const playlistStore = usePlaylistStore()
const route = useRoute()
const activeTab = ref(1)
const isToggleLikeLoading = ref(false)

const {
    data: sound,
    pending,
    refresh,
    error
} = useLazyAsyncData('soundDetailsPageQuery', async () => {
    const slug = route.params.slug
    const id = route.params.id

    let fields = $api.collection.getCollectionFields('sound', 'detailed')

    if (!$auth.loggedIn) {
        fields = fields.filter((field) => field !== 'likes')
    }

    const response = await $fetch('http://localhost:8055/items/sound', {
        method: 'SEARCH',
        body: JSON.stringify({
            query: {
                filter: {
                    _and: [{ id: { _eq: id } }, { dj: { slug: { _eq: slug } } }]
                },
                fields,
                deep: $auth.user
                    ? {
                          likes: {
                              _filter: {
                                  user_created: {
                                      _eq: $auth?.user?.id || null
                                  }
                              }
                          }
                      }
                    : null
            }
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    return {
        data: response.data[0]
    }
})

onMounted(() => {
    refresh()
})

// Refresh data on login / logout
watch(
    () => $auth.loggedIn,
    () => refresh()
)

const likeButtonVariant = computed(() => {
    if (!$auth.loggedIn) return 'light'
    return sound.value.data.likes.length > 0 ? 'dark' : 'light'
})

async function onToggleLike() {
    if (!$auth.loggedIn) {
        mainStore.setLoginActiveComponent('login')
        mainStore.setIsLoginOpen(true)
        return
    }
    isToggleLikeLoading.value = true
    try {
        _.isEmpty(sound.value.data.likes)
            ? await createLike()
            : await deleteLike()
    } catch (e) {
        throw new Error(e)
    } finally {
        isToggleLikeLoading.value = false
    }
}
async function createLike() {
    const result = await $axios.post('items/user_sound_like', {
        sound: sound.value.data.id
    })

    if (result.status === 200) {
        sound.value.data.likes = [result.data.data.id]
        sound.value.data.like_count++
    } else {
        throw new Error('Could not toggle like')
    }
}
async function deleteLike() {
    const result = await $axios.delete(
        `items/user_sound_like/${sound.value.data.likes[0]}`
    )

    if (result.status === 204) {
        sound.value.data.likes = []
        sound.value.data.like_count--
    } else {
        throw new Error('Could not toggle like')
    }
}
</script>

<style lang="scss" scoped>
.sound-controls {
    // border: 1px solid #eee;
}
</style>
