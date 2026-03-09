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
                                class="tag is-dark is-size-5-desktop is-size-6-mobile is-size-6-tablet"
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
                            <sound-like-button v-model:sound="sound" />
                        </div>
                        <div class="level-item">
                            <o-button
                                :variant="
                                    playlistStore.isSoundInPlaylist(sound)
                                        ? 'dark'
                                        : 'light'
                                "
                                icon-left="playlist-play"
                                size="responsive"
                                @click="
                                    playlistStore.handleAddOrRemovePlaylistSound(
                                        sound
                                    )
                                "
                            >
                                Playlist
                            </o-button>
                        </div>
                    </div>
                    <div class="level-right">
                        <div class="level-item">
                            <nuxt-link
                                :to="{
                                    path: `/sounds/manage/edit/${sound.id}`
                                }"
                            >
                                <o-button
                                    variant="dark"
                                    icon-left="pencil"
                                    size="responsive"
                                >
                                    {{ $i18n.t('form.edit') }}
                                </o-button>
                            </nuxt-link>
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
import _ from 'lodash';
import DjInfoBox from '~/components/dj/DjInfoBox.vue';
import SoundLikeButton from '~/components/sound/SoundLikeButton.vue';
import CoverImage from '~/components/media/CoverImage.vue';
import ButtonPlayPause from '~~/components/audio/ButtonPlayPause.client.vue';
import { usePlaylistStore, useUserStore } from '~/stores';
import { readItems } from '@directus/sdk';

const { $i18n, $api, $marked, $time, $audio, $directus } = useNuxtApp();
const playlistStore = usePlaylistStore();
const route = useRoute();
const { getIsLoggedIn, getUser } = useUserStore();

const activeTab = ref(1);

const {
    data: sound,
    pending: fetchPending,
    refresh: fetchRefresh,
    error: fetchError
} = useLazyAsyncData(
    'soundDetailsPageQuery',
    async () => {
        /*
        TODO: 
        - remove follows in case user is not logged in
        */
        const djSlug = route.params.djSlug as string;
        const soundSlug = route.params.soundSlug as string;

        const fields = $api.collection.getCollectionFields('sound', 'detailed');

        const sounds = await $directus.request(
            readItems('sound', {
                filter: {
                    _and: [
                        { slug: { _eq: soundSlug } },
                        { dj: { slug: { _eq: djSlug } } }
                    ]
                },
                fields,
                deep: {
                    likes: {
                        _filter: {
                            user_created: {
                                _eq: getUser()?.id || undefined
                            }
                        }
                    }
                }
            })
        );

        if (sounds?.length) {
            return sounds[0];
        } else {
            throw new Error('DJ not found');
        }
    }
    // There must be no server side data load - otherwise it is not working
    // TODO: Maybe remove when we get to NUXT 3
    // { initialCache: false, watch: auth.loggedIn }
);
</script>

<style lang="scss" scoped>
.sound-controls {
    // border: 1px solid #eee;
}
</style>
