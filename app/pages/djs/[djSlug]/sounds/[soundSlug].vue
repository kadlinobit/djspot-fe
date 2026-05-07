<template>
    <div v-if="fetchPending" class="flex justify-center py-12">
        <UProgress
            animation="carousel"
            color="neutral"
            class="w-full max-w-md"
        />
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
        <div class="bg-gray-900 py-12 text-white">
            <UContainer class="max-w-4xl">
                <div class="mb-6 flex flex-col gap-8 md:flex-row">
                    <div class="flex-1">
                        <div class="mb-4 flex items-center gap-6">
                            <!-- Play button and Title -->
                            <div class="flex-shrink-0">
                                <button-play-pause
                                    :sound="sound"
                                    :ui="{
                                        base: 'p-4',
                                        leadingIcon: 'size-14',
                                        trailingIcon: 'size-14'
                                    }"
                                />
                            </div>
                            <div class="min-w-0 flex-1">
                                <h1 class="mb-2 text-2xl font-bold md:text-4xl">
                                    {{ sound.name }}
                                </h1>
                                <div
                                    class="flex flex-wrap items-center gap-4 text-sm text-gray-400"
                                >
                                    <span class="font-medium capitalize">
                                        {{ $i18n.t(`${sound.type}.type`) }}
                                    </span>
                                    <div class="flex items-center gap-1">
                                        <UIcon
                                            name="i-heroicons-clock"
                                            class="h-4 w-4"
                                        />
                                        <span>{{
                                            convertTimeHHMMSS(
                                                sound.duration
                                            )
                                        }}</span>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <UIcon
                                            name="i-heroicons-calendar"
                                            class="h-4 w-4"
                                        />
                                        <span>{{
                                            fromNow(sound.created_at)
                                        }}</span>
                                    </div>
                                </div>
                            </div>
                            <!-- Mobile Photo -->
                            <div class="flex-shrink-0 md:hidden">
                                <cover-image
                                    :name="sound?.name"
                                    quality="thumbnail"
                                    cover-type="sound"
                                    :pixel-size="100"
                                    :cover-image="sound?.photo || undefined"
                                    class="h-[100px] w-[100px] rounded-lg object-cover shadow-lg"
                                />
                            </div>
                        </div>

                        <div
                            v-if="sound?.genres"
                            class="mb-6 flex flex-wrap gap-2"
                        >
                            <UBadge
                                v-for="genre in sound.genres"
                                :key="`genre-${genre.genre_id.id}`"
                                color="neutral"
                                variant="soft"
                                class="border border-gray-700 bg-gray-800 text-gray-200"
                            >
                                {{ genre.genre_id.name }}
                            </UBadge>
                        </div>

                        <dj-info-box :dj="sound.dj" />
                    </div>

                    <!-- Desktop Photo -->
                    <div class="hidden flex-shrink-0 md:block">
                        <cover-image
                            :name="sound?.name"
                            quality="small"
                            cover-type="sound"
                            :pixel-size="300"
                            :cover-image="sound?.photo || undefined"
                            class="h-[300px] w-[300px] rounded-xl object-cover shadow-2xl"
                        />
                    </div>
                </div>

                <!-- Controls -->
                <div
                    class="mt-8 flex flex-col justify-between gap-4 border-t border-gray-800 pt-6 sm:flex-row sm:items-center"
                >
                    <div class="flex items-center gap-4">
                        <sound-like-button v-model:sound="sound" />
                        <sound-playlist-button :sound="sound" />
                    </div>
                    <div>
                        <UButton
                            :to="`/sounds/manage/edit/${sound.id}`"
                            color="neutral"
                            variant="outline"
                            icon="i-heroicons-pencil-square"
                            size="md"
                            class="w-full justify-center sm:w-auto"
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
                <UTabs
                    v-if="tabItems.length > 0"
                    :items="tabItems"
                    class="w-full"
                >
                    <template #content="{ item }">
                        <div
                            v-if="item.key === 'description'"
                            class="prose dark:prose-invert max-w-none pt-6"
                            v-html="markdownToHtml(sound.description)"
                        />
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
import SoundPlaylistButton from '~/components/sound/SoundPlaylistButton.vue';
import CoverImage from '~/components/media/CoverImage.vue';
import ButtonPlayPause from '~/components/audio/ButtonPlayPause.client.vue';
import { useUserStore } from '~/stores';
import { readItems } from '@directus/sdk';

const { $i18n, $api, $marked, $time, $audio, $directus } = useNuxtApp();
const route = useRoute();
const { getUser } = useUserStore();

const {
    data: sound,
    pending: fetchPending,
    error: fetchError
} = useAsyncData('soundDetailsPageQuery', async () => {
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
});

const tabItems = computed(() => {
    const items = [];
    if (sound.value?.description) {
        items.push({
            key: 'description',
            label: $i18n.t(`${sound.value.type}.description`)
        });
    }
    return items;
});
</script>
