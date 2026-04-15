<template>
    <section class="section">
        <div class="container">
            <div class="columns is-mobile is-vcentered">
                <div class="column">
                    <h1 class="title">
                        {{ $i18n.t('sound.sounds') }}
                    </h1>
                </div>
                <div class="column is-narrow" v-if="getIsLoggedIn()">
                    <o-field>
                        <o-switch
                            position="left"
                            v-model="search.liked"
                            @update:modelValue="onSearch"
                            >{{ $i18n.t('sound.liked_by_me') }}</o-switch
                        >
                    </o-field>
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
                    placeholder="Search in Sound or DJ name"
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
            <o-field class="no-label" horizontal>
                <o-select v-model="search.sort" expanded @input="onSearch">
                    <option
                        v-for="option in formStore.soundsPageSortOptions"
                        :key="option.value"
                        :value="option.value"
                    >
                        {{ $i18n.t(option.label) }}
                    </option>
                </o-select>

                <o-select v-model="search.type" expanded @input="onSearch">
                    <option value="">
                        {{ $i18n.t('sound.all_types') }}
                    </option>
                    <option
                        v-for="option in formStore.soundTypeOptions"
                        :key="option.value"
                        :value="option.value"
                    >
                        {{ $i18n.t(option.label) }}
                    </option>
                </o-select>
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
            <div v-else-if="!fetchPending && Number(sounds?.meta?.count) === 0">
                <section class="hero is-secondary is-medium">
                    <div class="hero-body">
                        <p class="title">
                            {{ $i18n.t('sound.no_sounds_found') }}
                        </p>
                        <p class="subtitle">
                            <a @click="resetSearch">{{
                                $i18n.t('form.reset_search')
                            }}</a>
                        </p>
                    </div>
                </section>
            </div>
            <div v-else-if="!fetchPending && Number(sounds?.meta?.count) > 0">
                <sounds-page-list :sounds="sounds?.data" />
                <div class="block">
                    <div class="tag is-secondary is-medium">
                        {{
                            $i18n.t('sound.total_found', [
                                Number(sounds?.meta?.count) || 0
                            ])
                        }}
                    </div>
                </div>
                <o-pagination
                    :current="search.page"
                    :total="sounds?.meta?.count"
                    :range-before="1"
                    :range-after="1"
                    order="centered"
                    size="small"
                    :per-page="search.perPage"
                    aria-next-label="Next page"
                    aria-previous-label="Previous page"
                    aria-page-label="Page"
                    aria-current-label="Current page"
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
import SoundsPageList from '~/components/sound/SoundsPageList.vue';
import { useFormStore, useUserStore } from '~/stores';
import { readItems, aggregate } from '@directus/sdk';

const { $i18n, $api, $directus } = useNuxtApp();
const route = useRoute();
const router = useRouter();
const formStore = useFormStore();

const { getIsLoggedIn, getUser } = useUserStore();

interface UrlFilterObj {
    name?: string;
    city?: string;
    type?: string;
    genres?: Array<any>;
    liked?: boolean;
    following?: boolean;
}

interface RequestFilterObj {
    _and: Array<Object>;
}

const search = reactive({
    name: route.query.name ? String(route.query.name) : '',
    type: route.query.type ? String(route.query.type) : '',
    genres: [], // FILLED IN OnMounte,
    sort: route.query.sort ? String(route.query.sort) : 'name',
    perPage: 4,
    page: route.query.page ? parseInt(String(route.query.page)) : 1,

    liked: false,
    following: false

    // liked: route.query.liked === 'true' && auth.loggedIn.value ? true : false,
    // following:
    //     route.query.following === 'true' && auth.loggedIn.value ? true : false
});

const urlFilter = computed(() => {
    const urlFilterObj: UrlFilterObj = {};
    if (search.name) urlFilterObj.name = search.name;
    if (search.type) urlFilterObj.type = search.type;
    if (!_.isEmpty(search.genres))
        urlFilterObj.genres = search.genres.map((genre: Genre) => genre.id);
    if (!_.isNil(search.liked)) urlFilterObj.liked = search.liked;
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
    let fields = $api.collection.getCollectionFields('sound', 'default');

    if (getIsLoggedIn()) {
        fields = fields.filter((field: string) => field !== 'likes');
    }

    return {
        meta: '*',
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
        !search.type &&
        _.isEmpty(search.genres) &&
        !search.liked &&
        !search.following
    )
        return {};

    const requestFilterObj: RequestFilterObj = { _and: [] };

    if (search.name) {
        requestFilterObj._and.push({
            _or: [
                {
                    name: {
                        _contains: String(search.name).toLowerCase().trim()
                    }
                },
                {
                    dj: {
                        name: {
                            _contains: String(search.name).toLowerCase().trim()
                        }
                    }
                }
            ]
        });
    }
    if (search.type) {
        requestFilterObj._and.push({
            type: {
                _eq: search.type.toLowerCase().trim()
            }
        });
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

    if (search.liked === true && getUser()?.email) {
        requestFilterObj._and.push({
            likes: {
                user_created: {
                    email: {
                        _contains: getUser()?.email
                    }
                }
            }
        });
    }

    if (search.following === true && getUser()?.email) {
        requestFilterObj._and.push({
            dj: {
                follows: {
                    user_created: {
                        email: {
                            _contains: getUser()?.email
                        }
                    }
                }
            }
        });
    }

    return requestFilterObj;
});

const {
    data: sounds,
    pending: fetchPending,
    refresh,
    error: fetchError
} = useLazyAsyncData('soundsPageQuery', async function () {
    const data = await $directus.request(
        readItems('sound', requestQuery.value)
    );
    const meta = await $directus.request(
        aggregate('sound', {
            aggregate: { count: '*' },
            ...requestQuery.value
        })
    );

    return { data, meta: meta[0] };
});

function pushRouterQuery() {
    router.push({
        path: '/sounds',
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

onMounted(async () => {
    console.log('isLoggedIn', getIsLoggedIn());
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

function resetSearch() {
    search.name = '';
    search.type = '';
    search.genres = [];
    search.sort = 'name';
    search.liked = false;
    search.following = false;

    onSearch();
}
</script>
