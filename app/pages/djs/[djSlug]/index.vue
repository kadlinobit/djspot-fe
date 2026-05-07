<template>
    <div v-if="fetchPending" class="py-12 flex justify-center">
        <UProgress animation="carousel" color="neutral" class="max-w-md w-full" />
    </div>
    <div v-else-if="fetchError" class="py-12 text-center">
        <UContainer class="max-w-2xl">
            <UAlert
                icon="i-heroicons-exclamation-triangle"
                color="error"
                variant="subtle"
                :title="fetchError.message || String(fetchError)"
            />
        </UContainer>
    </div>
    <div v-else-if="dj">
        <div class="bg-gray-900 text-white py-12">
            <UContainer class="max-w-4xl">
                <div class="flex flex-col md:flex-row md:items-center gap-8 mb-6">
                    <div class="flex-1">
                        <div class="flex items-center gap-6 mb-4">
                            <div class="flex-1">
                                <h1 class="text-3xl md:text-5xl font-bold mb-2">
                                    {{ dj.name }}
                                </h1>
                                <h2 v-if="dj.city?.name" class="text-xl md:text-2xl text-gray-400">
                                    {{ dj.city.name }}
                                </h2>
                            </div>
                            <!-- Mobile Photo -->
                            <div class="md:hidden flex-shrink-0">
                                <cover-image
                                    :name="dj.name"
                                    quality="small"
                                    cover-type="dj"
                                    :pixel-size="100"
                                    :cover-image="dj.photo || undefined"
                                    class="w-[100px] h-[100px] rounded-lg shadow-lg object-cover"
                                />
                            </div>
                        </div>

                        <div class="flex flex-wrap gap-2">
                            <UBadge
                                v-for="genre in dj.genres"
                                :key="`genre-${genre.genre_id?.id}`"
                                color="neutral"
                                variant="soft"
                                class="text-sm bg-gray-800 text-gray-200 border border-gray-700"
                            >
                                {{ genre.genre_id?.name }}
                            </UBadge>
                        </div>
                    </div>

                    <!-- Desktop Photo -->
                    <div class="hidden md:block flex-shrink-0">
                        <cover-image
                            :name="dj.name"
                            quality="small"
                            cover-type="dj"
                            :pixel-size="300"
                            :cover-image="dj.photo || undefined"
                            class="w-[300px] h-[300px] rounded-xl shadow-2xl object-cover"
                        />
                    </div>
                </div>

                <dj-control-box
                    v-model:dj="dj"
                    :dj="dj"
                    :is-toggle-follow-loading="isToggleFollowLoading"
                />
            </UContainer>
        </div>

        <div class="py-8">
            <UContainer class="max-w-4xl">
                <UTabs v-if="tabItems.length > 0" :items="tabItems" class="w-full">
                    <template #content="{ item }">
                        <div v-if="item.key === 'bio'" class="prose dark:prose-invert max-w-none pt-6" v-html="markdownToHtml(dj.bio)" />
                        <div v-else-if="item.key === 'mixes'" class="pt-6">
                            <SoundList :sounds="mixes" />
                        </div>
                        <div v-else-if="item.key === 'tracks'" class="pt-6">
                            <SoundList :sounds="tracks" />
                        </div>
                    </template>
                </UTabs>
            </UContainer>
        </div>
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
import CoverImage from '~/components/media/CoverImage.vue';
import SoundList from '~/components/audio/SoundList.vue';
import DjControlBox from '~/components/dj/DjControlBox.vue';
import { useUserStore } from '~/stores';
import { readItems } from '@directus/sdk';
import { type IDjWithSounds, djFieldSets } from '~/plugins/directus/collection';

const { $marked, $directus } = useNuxtApp();
const route = useRoute();
const { getUser } = useUserStore();

const isToggleFollowLoading = ref(false);

const {
    data: dj,
    pending: fetchPending,
    error: fetchError
} = useAsyncData<IDjWithSounds>(
    'djProfilePageQuery',
    async function () {
        const slug = route.params.djSlug as string;

        const fields = djFieldSets.withSounds;

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
);

const mixes = computed(() => {
    if (!dj.value?.sounds) return [];
    return dj.value.sounds.filter((sound) => sound.type === 'mix') || [];
});
const tracks = computed(() => {
    if (!dj.value?.sounds) return [];
    return dj.value.sounds.filter((sound) => sound.type === 'track') || [];
});

const tabItems = computed(() => {
    const items = [];
    if (dj.value?.bio) {
        items.push({ key: 'bio', label: 'Bio' });
    }
    if (mixes.value.length > 0) {
        items.push({ key: 'mixes', label: 'Sety' });
    }
    if (tracks.value.length > 0) {
        items.push({ key: 'tracks', label: 'Tracky' });
    }
    return items;
});
</script>
