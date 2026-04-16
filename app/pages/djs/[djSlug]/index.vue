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
        <section class="hero is-dark">
            <div class="hero-body">
                <div class="container is-max-desktop">
                    <div class="columns is-mobile">
                        <div class="column">
                            <div class="columns is-mobile is-vcentered">
                                <div class="column">
                                    <h1
                                        class="title is-size-3-mobile is-size-2-desktop"
                                    >
                                        {{ dj?.name }}
                                    </h1>
                                    <h2 class="subtitle">
                                        {{ dj?.city?.name }}
                                    </h2>
                                </div>
                                <div class="column is-hidden-tablet is-narrow">
                                    <cover-image
                                        quality="small"
                                        cover-type="dj"
                                        :pixel-size="100"
                                        :cover-image="dj?.photo || null"
                                    />
                                </div>
                            </div>
                            <div class="tags">
                                <span
                                    v-for="genre in dj?.genres"
                                    :key="`genre-${genre.genre_id?.id}`"
                                    class="tag is-dark is-size-5-desktop is-size-6-mobile is-size-6-tablet"
                                >
                                    {{ genre.genre_id?.name }}
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
                        v-model:dj="dj"
                    />
                </div>
            </div>
        </section>

        <section class="section p-3">
            <div class="container is-max-desktop">
                <o-tabs
                    v-if="
                        dj.bio ||
                        (mixes && mixes?.length > 0) ||
                        (tracks && tracks?.length > 0)
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

                    <o-tab-item v-if="mixes && mixes?.length > 0" label="Sety">
                        <SoundList :sounds="mixes" />
                    </o-tab-item>

                    <o-tab-item
                        v-if="tracks && tracks?.length > 0"
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
 * - BIO nebo SETY se nenačtou při SSR - proč???
 * - error handling
 * - better handling of toggleFollow ? (fetch DJ again after toggle?)
 * - handle refresh on login - when logged out, refresh does not happen (and directus throws an error on manual refresh)
 */

import _ from 'lodash';
import { useOruga } from '@oruga-ui/oruga';
import CoverImage from '~/components/media/CoverImage.vue';
import SoundList from '~/components/audio/SoundList.vue';
import DjControlBox from '~/components/dj/DjControlBox.vue';
import { useMainStore, useUserStore } from '~/stores';
import { readItems } from '@directus/sdk';
import { type IDjWithSounds, djFieldSets } from '~/plugins/directus/collection';

const { $marked, $directus } = useNuxtApp();
const $oruga = useOruga();
const mainStore = useMainStore();
const route = useRoute();
const { getIsLoggedIn, getUser } = useUserStore();

const activeTab = ref(1);
const isToggleFollowLoading = ref(false);

const {
    data: dj,
    pending: fetchPending,
    refresh: fetchRefresh,
    error: fetchError
} = useAsyncData<IDjWithSounds>(
    'djProfilePageQuery',
    async function () {
        // // PROMISE TO SET TIMEOUT FOR TESTING (TODO - REMOVE)
        // await new Promise((resolve) => setTimeout(resolve, 2000))

        const slug = route.params.djSlug as string;

        let fields = djFieldSets.withSounds;

        const djs = await $directus.request(
            readItems('dj', {
                filter: { slug: { _eq: slug } },
                fields,
                deep: {
                    follows: {
                        _filter: {
                            user_created: {
                                _eq: getUser()?.id || undefined
                            }
                        }
                    }
                }
            })
        );

        if (!djs?.length) throw new Error('DJ not found');
        return djs[0];
    }
    // { initialCache: false, watch: () => getIsLoggedIn() }
);

const mixes = computed(() => {
    if (!dj.value?.sounds) return [];
    return dj.value.sounds.filter((sound) => sound.type === 'mix') || [];
});
const tracks = computed(() => {
    if (!dj.value?.sounds) return [];
    return dj.value.sounds.filter((sound) => sound.type === 'track') || [];
});
</script>

<style lang="scss" scoped>
.dj-photo {
    height: 300px;
    width: 300px;
    background-size: cover;
    background-position: center center;
}
</style>
