<template>
    <section class="section">
        <div class="container">
            <h1 class="title">DJs{{ djs?.meta?.filter_count || 0 }}</h1>
            <o-field>
                <o-input
                    v-model="name"
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
                <o-select v-model="sort" expanded @update:modelValue="onSearch">
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
                        v-model="city"
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
                        v-if="city"
                        v-model="radius"
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
                        v-model="genres"
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
            <div v-else-if="!fetchPending && djs?.meta?.filter_count === 0">
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
                <dj-list :djs="djs?.data" />

                <o-pagination
                    :current="page"
                    :total="djs?.meta?.filter_count"
                    :range-before="1"
                    :range-after="1"
                    order="centered"
                    :per-page="perPage"
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
import _ from 'lodash'
import OValidatedTagInput from '~/components/form/OValidatedTagInput.vue'
import DjList from '~/components/dj/DjList.vue'
import { useFormStore } from '~/stores'
import useDirectus, { useAuth } from '~/composables/directus'

const { $i18n, $api, $geo } = useNuxtApp()
const route = useRoute()
const router = useRouter()
const formStore = useFormStore()
const auth = useAuth()
const directus = useDirectus()

type UrlFilterObj = {
    name?: string
    city?: number
    radius?: number
    genres?: Array<any>
}

const name = ref(route.query.name ? String(route.query.name) : '')
const city = ref(route.query.city ? parseInt(String(route.query.city)) : null)
const radius = ref(
    route.query.radius ? parseInt(String(route.query.radius)) : 0
)
const genres = ref([]) // FILLED IN OnMounted
const sort = ref(route.query.sort ? String(route.query.sort) : 'name')
const perPage = ref(4)
const page = ref(route.query.page ? parseInt(String(route.query.page)) : 1)

const urlFilter = computed(() => {
    const urlFilterObj: UrlFilterObj = {}
    if (name.value) urlFilterObj.name = name.value.toLowerCase()
    if (city.value) urlFilterObj.city = city.value
    if (city.value && radius.value) urlFilterObj.radius = radius.value
    if (!_.isEmpty(genres))
        urlFilterObj.genres = genres.value.map((genre) => genre.id)

    return !_.isEmpty(urlFilterObj) ? urlFilterObj : null
})

const urlQuery = computed(() => {
    return {
        limit: perPage.value,
        page: page.value,
        sort: sort.value,
        ...urlFilter.value
    }
})

const requestQuery = computed(() => {
    let fields = $api.collection.getCollectionFields('dj', 'default')

    if (auth.loggedIn.value) {
        fields = fields.filter((field) => field !== 'follows')
    }
    return {
        meta: '*',
        fields,
        limit: perPage.value,
        page: page.value,
        sort: sort.value,
        filter: requestFilter.value
    }
})

const requestFilter = computed(() => {
    if (!name.value && !city.value && _.isEmpty(genres.value)) return null

    const requestFilterObj = { _and: [] }

    if (name.value) {
        requestFilterObj._and.push({
            name: {
                _contains: String(name.value).toLowerCase().trim()
            }
        })
    }
    if (city.value) {
        let cityFilter
        const cityDirectFilter = {
            city: {
                id: {
                    _eq: city.value
                }
            }
        }

        if (radius.value === 0) {
            cityFilter = cityDirectFilter
        } else {
            cityFilter = {
                _or: [
                    cityDirectFilter,
                    {
                        city: {
                            gps: {
                                _intersects: $geo.getPointRadius(
                                    formStore.getCityCoordinates(city.value),
                                    radius.value
                                )
                            }
                        }
                    }
                ]
            }
        }

        requestFilterObj._and.push(cityFilter)
    }

    if (!_.isEmpty(genres.value)) {
        requestFilterObj._and.push({
            genres: {
                genre_id: {
                    _in: genres.value.map((genre) => genre.id)
                }
            }
        })
    }

    return requestFilterObj
})

const {
    data: djs,
    pending: fetchPending,
    refresh,
    error: fetchError
} = useLazyAsyncData('djsPageQuery', async function () {
    // FETCH WAY
    // TODO -REMOVE
    // const djs = $fetch('http://localhost:8055/items/dj', {
    //     method: 'SEARCH',
    //     body: JSON.stringify({
    //         query: requestQuery.value
    //     }),
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // })
    const djs = await directus.items('dj').readByQuery(requestQuery.value)
    return djs
})

function pushRouterQuery() {
    router.push({
        path: '/djs',
        query: _.isEmpty(urlQuery.value) ? null : urlQuery.value
    })
}

function onSearch() {
    page.value = 1
    pushRouterQuery()
    refresh()
}
function onPageChange(pageNumber) {
    page.value = pageNumber
    pushRouterQuery()
    refresh()
}

function resetSearch() {
    name.value = ''
    city.value = null
    radius.value = 0
    genres.value = []
    sort.value = 'name'

    onSearch()
}

onMounted(() => {
    formStore.fetchCities()
    formStore.fetchGenres()

    // Fill in genres
    if (route.query.genres) {
        const urlGenres = Array.isArray(route.query.genres)
            ? route.query.genres.map((genreId) => parseInt(genreId))
            : [parseInt(route.query.genres)]

        genres.value = formStore.genresOptions.filter((genreOption) =>
            urlGenres.includes(genreOption.id)
        )
    }

    refresh()
})

watch(genres, onSearch)
</script>
