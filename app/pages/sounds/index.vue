<template>
    <UContainer class="py-10">
        <!-- Header -->
        <div class="mb-8 flex items-center justify-between">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ $i18n.t('sound.sounds') }}
            </h1>
            <div v-if="getIsLoggedIn()" class="flex items-center gap-6">
                <div class="flex items-center gap-3">
                    <span
                        class="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        {{ $i18n.t('sound.liked_by_me') }}
                    </span>
                    <USwitch
                        v-model="search.liked"
                        @update:model-value="onSearch"
                    />
                </div>
                <div class="flex items-center gap-3">
                    <span
                        class="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        {{ $i18n.t('dj.followed_by_me') }}
                    </span>
                    <USwitch
                        v-model="search.following"
                        @update:model-value="onSearch"
                    />
                </div>
            </div>
        </div>

        <!-- Search and Filters -->
        <div class="mb-8 space-y-4">
            <!-- Search Bar -->
            <div class="flex gap-2">
                <UInput
                    v-model="search.name"
                    icon="i-heroicons-magnifying-glass"
                    placeholder="Search in Sound or DJ name"
                    class="flex-1"
                    size="lg"
                    @keyup.enter="onSearch"
                />
                <UButton
                    size="lg"
                    color="neutral"
                    variant="solid"
                    @click="onSearch"
                >
                    {{ $i18n.t('form.search') }}
                </UButton>
            </div>

            <!-- Advanced Filters -->
            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                <USelectMenu
                    v-model="search.sort"
                    :items="soundsPageSortOptionsTranslated"
                    value-key="value"
                    @update:model-value="onSearch"
                />

                <sound-type-selector
                    v-model="search.type"
                    @update:model-value="onSearch"
                    @clear="onClearType"
                />

                <UInputMenu
                    v-model="search.genres"
                    :items="formStore.genresOptions"
                    multiple
                    value-key="value"
                    label-key="label"
                    :placeholder="$i18n.t('dj.select_3_genres')"
                    @update:model-value="onSearch"
                />
            </div>
        </div>

        <!-- Content -->
        <div v-if="fetchPending" class="space-y-6">
            <UProgress animation="carousel" color="neutral" />
            <sounds-page-list />
        </div>

        <div v-else-if="fetchError" class="py-12 text-center">
            <UAlert
                icon="i-heroicons-exclamation-triangle"
                color="error"
                variant="subtle"
                :title="fetchError.message"
            />
        </div>

        <div
            v-else-if="!fetchPending && sounds?.data.length === 0"
            class="py-20"
        >
            <div class="text-center">
                <UIcon
                    name="i-heroicons-musical-note"
                    class="mx-auto h-12 w-12 text-gray-400"
                />
                <h3
                    class="mt-2 text-lg font-medium text-gray-900 dark:text-white"
                >
                    {{ $i18n.t('sound.no_sounds_found') }}
                </h3>
                <div class="mt-6">
                    <UButton
                        color="neutral"
                        variant="soft"
                        @click="resetSearch"
                    >
                        {{ $i18n.t('form.reset_search') }}
                    </UButton>
                </div>
            </div>
        </div>

        <div v-else class="space-y-8">
            <sounds-page-list v-if="sounds?.data" :sounds="sounds.data" />

            <div
                class="flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-800"
            >
                <span
                    class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                    {{
                        $i18n.t('sound.total_found', [sounds?.meta?.count || 0])
                    }}
                </span>

                <UPagination
                    :page="search.page"
                    :total="Number(sounds?.meta?.count)"
                    :items-per-page="search.perPage"
                    @update:page="onPageChange"
                />
            </div>
        </div>
    </UContainer>
</template>

<script setup lang="ts">
import _ from 'lodash';
import SoundsPageList from '~/components/sound/SoundsPageList.vue';
import SoundTypeSelector from '~/components/selectors/soundType.USelectMenu.vue';
import { useFormStore, useUserStore } from '~/stores';
import { readItems, aggregate } from '@directus/sdk';

const { $i18n, $api, $directus } = useNuxtApp();
const route = useRoute();
const router = useRouter();
const formStore = useFormStore();

const { getIsLoggedIn, getUser } = useUserStore();

const search = reactive({
    name: route.query.name ? String(route.query.name) : '',
    type: route.query.type
        ? String(route.query.type)
        : (undefined as string | undefined),
    genres: [] as string[],
    sort: route.query.sort ? String(route.query.sort) : 'name',
    perPage: 20,
    page: route.query.page ? parseInt(String(route.query.page)) : 1,
    liked: route.query.liked === 'true' && getIsLoggedIn(),
    following: route.query.following === 'true' && getIsLoggedIn()
});

const soundsPageSortOptionsTranslated = computed(() => {
    return formStore.soundsPageSortOptions.map((opt) => ({
        ...opt,
        label: $i18n.t(opt.label)
    }));
});

const urlQuery = computed(() => {
    const query: any = {
        limit: search.perPage,
        page: search.page,
        sort: search.sort
    };
    if (search.name) query.name = search.name;
    if (search.type) query.type = search.type;
    if (!_.isEmpty(search.genres)) query.genres = search.genres;
    if (search.liked) query.liked = true;
    if (search.following) query.following = true;

    return query;
});

const requestQuery = computed(() => {
    let fields = $api.collection.getCollectionFields('sound', 'default');

    if (getIsLoggedIn()) {
        fields = fields.filter((field: string) => field !== 'likes');
    }

    return {
        fields,
        limit: search.perPage,
        page: search.page,
        sort: search.sort,
        filter: requestFilter.value
    };
});

const requestFilter = computed(() => {
    const filterObj: any = { _and: [] };

    if (search.name) {
        filterObj._and.push({
            _or: [
                { name: { _icontains: search.name.trim() } },
                { dj: { name: { _icontains: search.name.trim() } } }
            ]
        });
    }
    if (search.type) {
        filterObj._and.push({
            type: { _eq: search.type.toLowerCase().trim() }
        });
    }

    if (!_.isEmpty(search.genres)) {
        filterObj._and.push({
            genres: {
                genre_id: { _in: search.genres }
            }
        });
    }

    if (search.liked && getUser()?.email) {
        filterObj._and.push({
            likes: {
                user_created: { email: { _contains: getUser()?.email } }
            }
        });
    }

    if (search.following && getUser()?.email) {
        filterObj._and.push({
            dj: {
                follows: {
                    user_created: { email: { _contains: getUser()?.email } }
                }
            }
        });
    }

    return filterObj._and.length > 0 ? filterObj : {};
});

const {
    data: sounds,
    pending: fetchPending,
    refresh,
    error: fetchError
} = useAsyncData(
    'soundsPageQuery',
    async () => {
        const [data, meta] = await Promise.all([
            $directus.request(readItems('sound', requestQuery.value)),
            $directus.request(
                aggregate('sound', {
                    aggregate: { count: '*' },
                    query: { filter: requestFilter.value }
                })
            )
        ]);
        return { data, meta: meta[0] };
    },
    {
        watch: [() => search.page, () => search.sort]
    }
);

function onClearType() {
    search.type = undefined;
    onSearch();
}

function onSearch() {
    search.page = 1;
    router.push({ query: urlQuery.value });
    refresh();
}

function onPageChange(pageNumber: number) {
    search.page = pageNumber;
    router.push({ query: urlQuery.value });
    refresh();
}

function resetSearch() {
    Object.assign(search, {
        name: '',
        type: undefined,
        genres: [],
        sort: 'name',
        liked: false,
        following: false,
        page: 1
    });
    onSearch();
}

onMounted(() => {
    formStore.fetchCities();
    formStore.fetchGenres();

    if (route.query.genres) {
        search.genres = Array.isArray(route.query.genres)
            ? (route.query.genres as string[])
            : [String(route.query.genres)];
    }
});
</script>
