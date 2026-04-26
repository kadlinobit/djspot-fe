<template>
    <UContainer class="py-10">
        <!-- Header -->
        <div class="mb-8 flex items-center justify-between">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ $i18n.t('dj.djs') }}
            </h1>
            <div v-if="getIsLoggedIn()" class="flex items-center gap-3">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ $i18n.t('dj.followed_by_me') }}
                </span>
                <USwitch
                    v-model="search.following"
                    @update:model-value="onSearch"
                />
            </div>
        </div>

        <!-- Search and Filters -->
        <div class="mb-8 space-y-4">
            <!-- Search Bar -->
            <div class="flex gap-2">
                <UInput
                    v-model="search.name"
                    icon="i-heroicons-magnifying-glass"
                    :placeholder="$i18n.t('dj.search_dj')"
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
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <USelectMenu
                    v-model="search.sort"
                    :items="djsPageSortOptionsTranslated"
                    value-key="value"
                    @update:model-value="onSearch"
                />
                
                <div class="flex gap-2">
                    <city-selector
                        v-model="search.city"
                        class="flex-1"
                        @update:model-value="onSearch"
                        @clear="onClearCity"
                    />
                    <city-radius-selector
                        v-if="search.city"
                        v-model="search.radius"
                        class="w-24"
                        @update:model-value="onSearch"
                    />
                </div>

                <div class="lg:col-span-2">
                    <genre-selector
                        v-model="search.genres"
                        @update:model-value="onSearch"
                    />
                </div>
            </div>
        </div>

        <!-- Content -->
        <div v-if="fetchPending" class="space-y-6">
            <UProgress animation="carousel" color="neutral" />
            <dj-list />
        </div>
        
        <div v-else-if="fetchError" class="py-12 text-center">
            <UAlert
                icon="i-heroicons-exclamation-triangle"
                color="error"
                variant="subtle"
                :title="fetchError.message"
            />
        </div>

        <div v-else-if="!fetchPending && djs?.data.length === 0" class="py-20">
            <div class="text-center">
                <UIcon name="i-heroicons-user-group" class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                    {{ $i18n.t('dj.no_djs_found') }}
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                    {{ $i18n.t('form.no_results_help') }}
                </p>
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
            <dj-list v-if="djs?.data" :djs="djs.data" />
            
            <div class="flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-800">
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {{ $i18n.t('dj.total_found', [djs?.meta?.count || 0]) }}
                </span>
                
                <UPagination
                    :page="search.page"
                    :total="Number(djs?.meta?.count)"
                    :items-per-page="search.perPage"
                    @update:page="onPageChange"
                />
            </div>
        </div>
    </UContainer>
</template>

<script setup lang="ts">
import _ from 'lodash';
import DjList from '~/components/dj/DjList.vue';
import CitySelector from '~/components/selectors/city.USelectMenu.vue';
import CityRadiusSelector from '~/components/selectors/cityRadius.USelectMenu.vue';
import GenreSelector from '~/components/selectors/genre.UInputMenu.vue';
import { useFormStore, useUserStore } from '~/stores';
import { readItems, aggregate } from '@directus/sdk';
import type { Genre } from '~/plugins/directus/types';

const { $i18n, $api, $geo, $directus } = useNuxtApp();
const route = useRoute();
const router = useRouter();
const formStore = useFormStore();
const { getIsLoggedIn, getUser } = useUserStore();

const search = reactive({
    name: route.query.name ? String(route.query.name) : '',
    city: route.query.city ? String(route.query.city) : undefined as string | undefined,
    radius: route.query.radius ? parseInt(String(route.query.radius)) : 0,
    genres: [] as string[],
    sort: route.query.sort ? String(route.query.sort) : 'name',
    perPage: 20,
    page: route.query.page ? parseInt(String(route.query.page)) : 1,
    following: route.query.following === 'true' && getIsLoggedIn()
});

const djsPageSortOptionsTranslated = computed(() => {
    return formStore.djsPageSortOptions.map(opt => ({
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
    if (search.name) query.name = search.name.toLowerCase();
    if (search.city) query.city = search.city;
    if (search.city && search.radius) query.radius = search.radius;
    if (!_.isEmpty(search.genres)) query.genres = search.genres;
    if (search.following) query.following = true;

    return query;
});

const requestQuery = computed(() => {
    let fields = $api.collection.getCollectionFields('dj', 'default');
    fields = fields.filter((field: string) => field !== 'follows');

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
            name: { _icontains: search.name.trim() }
        });
    }
    if (search.city) {
        const cityId = search.city;
        const cityDirectFilter = { city: { id: { _eq: cityId } } };

        const coordinates = search.radius > 0
            ? formStore.getCityCoordinates(cityId)
            : null;

        if (!coordinates) {
            filterObj._and.push(cityDirectFilter);
        } else {
            filterObj._and.push({
                _or: [
                    cityDirectFilter,
                    {
                        city: {
                            gps: {
                                _intersects: $geo.getPointRadius(coordinates, search.radius)
                            }
                        }
                    }
                ]
            });
        }
    }

    if (!_.isEmpty(search.genres)) {
        filterObj._and.push({
            genres: {
                genre_id: { _in: search.genres }
            }
        });
    }

    if (search.following && getUser()?.email) {
        filterObj._and.push({
            follows: {
                user_created: { email: { _contains: getUser()?.email } }
            }
        });
    }

    return filterObj._and.length > 0 ? filterObj : {};
});

const {
    data: djs,
    pending: fetchPending,
    refresh,
    error: fetchError
} = useAsyncData('djsPageQuery', async () => {
    const [data, meta] = await Promise.all([
        $directus.request(readItems('dj', requestQuery.value)),
        $directus.request(aggregate('dj', { aggregate: { count: '*' }, query: { filter: requestFilter.value } }))
    ]);
    return { data, meta: meta[0] };
}, {
    watch: [() => search.page, () => search.sort] // Add any other triggers if needed, but we call refresh manually too
});

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

function onClearCity() {
    search.city = undefined;
    search.radius = 0;
    onSearch();
}

function resetSearch() {
    Object.assign(search, {
        name: '',
        city: undefined,
        radius: 0,
        genres: [],
        sort: 'name',
        following: false,
        page: 1
    });
    onSearch();
}

onMounted(() => {
    if (route.query.genres) {
        search.genres = Array.isArray(route.query.genres)
            ? (route.query.genres as string[])
            : [String(route.query.genres)];
    }
});
</script>
