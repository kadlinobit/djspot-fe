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
    <div v-else-if="sound">
        <div class="bg-gray-900 text-white py-12">
            <UContainer class="max-w-4xl">
                <div class="flex flex-col md:flex-row gap-8 mb-6">
                    <div class="flex-1">
                        <div class="flex items-center gap-6 mb-4">
                            <!-- Play button and Title -->
                            <div class="flex-shrink-0">
                                <button-play-pause
                                    :sound="sound"
                                    size="large"
                                    variant="text"
                                />
                            </div>
                            <div class="flex-1 min-w-0">
                                <h1 class="text-2xl md:text-4xl font-bold mb-2 truncate">
                                    {{ sound.name }}
                                </h1>
                                <div class="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                                    <span class="capitalize font-medium">
                                        {{ $i18n.t(`${sound.type}.type`) }}
                                    </span>
                                    <div class="flex items-center gap-1">
                                        <UIcon name="i-heroicons-clock" class="w-4 h-4" />
                                        <span>{{ $audio.convertTimeHHMMSS(sound.duration) }}</span>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                                        <span>{{ $time.fromNow(sound.created_at) }}</span>
                                    </div>
                                </div>
                            </div>
                            <!-- Mobile Photo -->
                            <div class="md:hidden flex-shrink-0">
                                <cover-image
                                    :name="sound?.name"
                                    quality="thumbnail"
                                    cover-type="sound"
                                    :pixel-size="100"
                                    :cover-image="sound?.photo || undefined"
                                    class="w-[100px] h-[100px] rounded-lg shadow-lg object-cover"
                                />
                            </div>
                        </div>

                        <div v-if="sound?.genres" class="flex flex-wrap gap-2 mb-6">
                            <UBadge
                                v-for="genre in sound.genres"
                                :key="`genre-${genre.genre_id.id}`"
                                color="neutral"
                                variant="soft"
                                class="bg-gray-800 text-gray-200 border border-gray-700"
                            >
                                {{ genre.genre_id.name }}
                            </UBadge>
                        </div>
                        
                        <dj-info-box :dj="sound.dj" />
                    </div>
                    
                    <!-- Desktop Photo -->
                    <div class="hidden md:block flex-shrink-0">
                        <cover-image
                            :name="sound?.name"
                            quality="small"
                            cover-type="sound"
                            :pixel-size="300"
                            :cover-image="sound?.photo || undefined"
                            class="w-[300px] h-[300px] rounded-xl shadow-2xl object-cover"
                        />
                    </div>
                </div>

                <!-- Controls -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 border-t border-gray-800 pt-6">
                    <div class="flex items-center gap-4">
                        <sound-like-button v-model:sound="sound" />
                        <UButton
                            :variant="playlistStore.isSoundInPlaylist(sound) ? 'solid' : 'soft'"
                            color="neutral"
                            icon="i-heroicons-queue-list"
                            size="md"
                            @click="playlistStore.handleAddOrRemovePlaylistSound(sound)"
                        >
                            Playlist
                        </UButton>
                    </div>
                    <div>
                        <UButton
                            :to="`/sounds/manage/edit/${sound.id}`"
                            color="neutral"
                            variant="outline"
                            icon="i-heroicons-pencil-square"
                            size="md"
                            class="w-full sm:w-auto justify-center"
                        >
                            {{ $i18n.t('form.edit') }}
                        </UButton>
                    </div>
                </div>
            </UContainer>
        </div>

        <!-- Description Tab -->
        <div class="py-8">
            <UContainer class="max-w-4xl">
                <UTabs v-if="tabItems.length > 0" :items="tabItems" class="w-full">
                    <template #content="{ item }">
                        <div v-if="item.key === 'description'" class="prose dark:prose-invert max-w-none pt-6" v-html="$marked.markdownToHtml(sound.description)" />
                    </template>
                </UTabs>
            </UContainer>
        </div>
    </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import DjInfoBox from '~/components/dj/DjInfoBox.vue';
import SoundLikeButton from '~/components/sound/SoundLikeButton.vue';
import CoverImage from '~/components/media/CoverImage.vue';
import ButtonPlayPause from '~/components/audio/ButtonPlayPause.client.vue';
import { usePlaylistStore, useUserStore } from '~/stores';
import { readItems } from '@directus/sdk';

const { $i18n, $api, $marked, $time, $audio, $directus } = useNuxtApp();
const playlistStore = usePlaylistStore();
const route = useRoute();
const { getUser } = useUserStore();

const {
    data: sound,
    pending: fetchPending,
    error: fetchError
} = useAsyncData(
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
            throw new Error('Sound not found');
        }
    }
);

const tabItems = computed(() => {
    const items = [];
    if (sound.value?.description) {
        items.push({ key: 'description', label: $i18n.t(`${sound.value.type}.description`) });
    }
    return items;
});
</script>
