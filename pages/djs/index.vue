<template>
    <section class="section">
        <div class="container">
            <div class="columns is-mobile is-vcentered">
                <div class="column">
                    <h1 class="title">
                        {{ $i18n.t('dj.djs') }}
                    </h1>
                </div>
                <div class="column is-narrow" v-if="getIsLoggedIn()">
                    <o-field>
                        <o-switch
                            position="left"
                            v-model="search.following"
                            @update:modelValue="onSearch"
                            >{{ $i18n.t('dj.followed_by_me') }}</o-switch
                        >
                    </o-field>
                </div>
            </div>

            <o-field>
                <o-input
                    v-model="search.name"
                    :placeholder="$i18n.t('dj.search_dj')"
                    type="search"
                    expanded
                ></o-input>
                <p class="control">
                    <o-button
                        variant="primary"
                        :label="$i18n.t('form.search')"
                        @click="onSearch"
                    />
                </p>
            </o-field>
            <o-field horizontal grouped class="no-label">
                <o-select
                    v-model="search.sort"
                    expanded
                    @update:modelValue="onSearch"
                >
                    <option
                        v-for="option in formStore.djsPageSortOptions"
                        :key="option.value"
                        :value="option.value"
                    >
                        {{ $i18n.t(option.label) }}
                    </option>
                </o-select>
                <o-field>
                    <o-select
                        v-model="search.city"
                        expanded
                        @update:modelValue="onSearch"
                    >
                        <option :value="null">
                            {{ $i18n.t('dj.whole_czechia') }}
                        </option>
                        <option
                            v-for="option in formStore.citiesOptions"
                            :key="option.value"
                            :value="option.value"
                        >
                            {{ option.label }}
                        </option>
                    </o-select>
                    <o-select
                        v-if="search.city"
                        v-model="search.radius"
                        @update:modelValue="onSearch"
                    >
                        <option
                            v-for="option in formStore.radiusOptions"
                            :key="option.value"
                            :value="option.value"
                        >
                            {{ $i18n.t(option.label) }}
                        </option>
                    </o-select>
                </o-field>

                <client-only>
                    <o-validated-tag-input
                        v-model="search.genres"
                        name="genres"
                        :tags="formStore.genresOptions"
                        :is-validation-on="false"
                        field="name"
                        :max-tags="3"
                        expanded
                        :placeholder="$i18n.t('dj.select_3_genres')"
                        @update:modelValue="onSearch"
                    />
                </client-only>
            </o-field>

            <o-loading
                v-if="fetchPending"
                :full-page="false"
                :active="fetchPending"
                :can-cancel="true"
            />
            <div v-else-if="fetchError">
                {{ fetchError }}
            </div>
            <div v-else-if="!fetchPending && djs?.data.length === 0">
                <section class="hero is-secondary is-medium">
                    <div class="hero-body">
                        <p class="title">{{ $i18n.t('dj.no_djs_found') }}</p>
                        <p class="subtitle">
                            <a @click="resetSearch">{{
                                $i18n.t('form.reset_search')
                            }}</a>
                        </p>
                    </div>
                </section>
            </div>
            <div v-else>
                <dj-list v-if="djs?.data" :djs="djs.data" />
                <div class="block">
                    <div class="tag is-secondary is-medium">
                        {{ $i18n.t('dj.total_found', [djs?.data.length || 0]) }}
                    </div>
                </div>
                <o-pagination
                    :current="search.page"
                    :total="djs?.meta?.count"
                    :range-before="1"
                    :range-after="1"
                    order="centered"
                    :per-page="search.perPage"
                    :aria-next-label="$i18n.t('form.pagination.next_page')"
                    :aria-previous-label="
                        $i18n.t('form.pagination.previous_page')
                    "
                    :aria-page-label="$i18n.t('form.pagination.page')"
                    :aria-current-label="
                        $i18n.t('form.pagination.current_page')
                    "
                    @change="onPageChange"
                >
                </o-pagination>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import _ from 'lodash';
import OValidatedTagInput from '~/components/form/OValidatedTagInput.vue';
import DjList from '~/components/dj/DjList.vue';
import { useFormStore, useUserStore } from '~/stores';

const { $i18n, $api, $geo, $directus } = useNuxtApp();
import { readItems, aggregate } from '@directus/sdk';
const route = useRoute();
const router = useRouter();
const formStore = useFormStore();
const { getIsLoggedIn, getUser } = useUserStore();

const runtimeConfig = useRuntimeConfig();

interface UrlFilterObj {
    name?: string;
    city?: number;
    radius?: number;
    genres?: Array<any>;
    following?: boolean;
}

interface RequestFilterObj {
    _and: Array<Object>;
}

interface ISearch {
    name: string;
    city: string | null;
    radius: number;
    genres: Genre[];
}

const search = reactive({
    name: route.query.name ? String(route.query.name) : '',
    city: route.query.city ? parseInt(String(route.query.city)) : null,
    radius: route.query.radius ? parseInt(String(route.query.radius)) : 0,
    genres: [], // FILLED IN OnMounted,
    sort: route.query.sort ? String(route.query.sort) : 'name',
    perPage: 4,
    page: route.query.page ? parseInt(String(route.query.page)) : 1,
    following:
        route.query.following === 'true' && getIsLoggedIn() ? true : false
});

const urlFilter = computed(() => {
    const urlFilterObj: UrlFilterObj = {};
    if (search.name) urlFilterObj.name = search.name.toLowerCase();
    if (search.city) urlFilterObj.city = search.city;
    if (search.city && search.radius) urlFilterObj.radius = search.radius;
    if (!_.isEmpty(search.genres))
        urlFilterObj.genres = search.genres.map((genre: Genre) => genre.id);
    if (!_.isNil(search.following)) urlFilterObj.following = search.following;

    return !_.isEmpty(urlFilterObj) ? urlFilterObj : null;
});

const urlQuery = computed(() => {
    return {
        limit: search.perPage,
        page: search.page,
        sort: search.sort,
        ...urlFilter.value
    };
});

const requestQuery = computed(() => {
    let fields = $api.collection.getCollectionFields('dj', 'default');

    if (true) {
        // if (authStatus.value === 'authenticated') {
        fields = fields.filter((field: string) => field !== 'follows');
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
    if (
        !search.name &&
        !search.city &&
        _.isEmpty(search.genres) &&
        !search.following
    )
        return {};

    const requestFilterObj: RequestFilterObj = { _and: [] };

    if (search.name) {
        requestFilterObj._and.push({
            name: {
                _contains: String(search.name).toLowerCase().trim()
            }
        });
    }
    if (search.city) {
        let cityFilter;
        const cityDirectFilter = {
            city: {
                id: {
                    _eq: search.city
                }
            }
        };

        if (search.radius === 0) {
            cityFilter = cityDirectFilter;
        } else {
            cityFilter = {
                _or: [
                    cityDirectFilter,
                    {
                        city: {
                            gps: {
                                _intersects: $geo.getPointRadius(
                                    formStore.getCityCoordinates(search.city),
                                    search.radius
                                )
                            }
                        }
                    }
                ]
            };
        }

        requestFilterObj._and.push(cityFilter);
    }

    if (!_.isEmpty(search.genres)) {
        requestFilterObj._and.push({
            genres: {
                genre_id: {
                    _in: search.genres.map((genre: Genre) => genre.id)
                }
            }
        });
    }

    if (search.following === true && getUser()?.email) {
        requestFilterObj._and.push({
            follows: {
                user_created: {
                    email: {
                        _contains: getUser()?.email
                    }
                }
            }
        });
    }

    return requestFilterObj;
});

const {
    data: djs,
    pending: fetchPending,
    refresh,
    error: fetchError
} = useAsyncData('djsPageQuery', async function () {
    const data = await $directus.request(readItems('dj', requestQuery.value));
    const meta = await $directus.request(
        aggregate('dj', { aggregate: { count: '*' }, ...requestQuery.value })
    );

    return { data, meta: meta[0] };
});

function pushRouterQuery() {
    router.push({
        path: '/djs',
        query: _.isEmpty(urlQuery.value) ? null : urlQuery.value
    });
}

function onSearch() {
    search.page = 1;
    pushRouterQuery();
    refresh();
}
function onPageChange(pageNumber: number) {
    search.page = pageNumber;
    pushRouterQuery();
    refresh();
}

function resetSearch() {
    search.name = '';
    search.city = null;
    search.radius = 0;
    search.genres = [];
    search.sort = 'name';
    search.following = false;

    onSearch();
}

onMounted(() => {
    formStore.fetchCities();
    formStore.fetchGenres();

    // Fill in genres
    if (route.query.genres) {
        const urlGenres = Array.isArray(route.query.genres)
            ? route.query.genres.map((genreId) => parseInt(String(genreId)))
            : [parseInt(route.query.genres)];

        search.genres = formStore.genresOptions.filter((genreOption: Genre) =>
            urlGenres.includes(genreOption.id)
        );
    }
});
</script>
