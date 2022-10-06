<template>
    <section class="section">
        <div class="container">
            <h1 class="title">DJs {{ djsData?.meta?.filter_count || 0 }}</h1>
            <o-field>
                <o-input
                    v-model="name"
                    :placeholder="$i18n.t('dj.search_dj')"
                    type="search"
                    expanded
                ></o-input>
                <p class="control">
                    <o-button
                        type="is-primary"
                        label="Search"
                        @click="onSearch"
                    />
                </p>
            </o-field>
            <o-field class="no-label" horizontal>
                <o-select v-model="sort" expanded @input="onSearch">
                    <option
                        v-for="option in formStore.djsPageSortOptions"
                        :key="option.value"
                        :value="option.value"
                    >
                        {{ $i18n.t(option.label) }}
                    </option>
                </o-select>
                <o-select v-model="city" expanded @input="onSearch">
                    <option value="">
                        {{ `Celá ČR` }}
                    </option>
                    <option
                        v-for="option in formStore.citiesOptions"
                        :key="option.value"
                        :value="option.value"
                    >
                        {{ option.label }}
                    </option>
                </o-select>
                <client-only>
                    <o-validated-tag-input
                        v-model="genres"
                        name="genres"
                        :tags="formStore.genresOptions"
                        :is-validation-on="false"
                        field="name"
                        maxtags="3"
                        expanded
                        :placeholder="$i18n.t('dj.select_3_genres')"
                        @input="onSearch"
                    />
                </client-only>
            </o-field>

            <!-- <p v-if="pending">Loading ...</p> -->
            <p v-if="error">{{ error.message }}</p>
            <div v-else-if="!pending && djsData?.meta?.filter_count === 0">
                <section class="hero is-secondary is-medium">
                    <div class="hero-body">
                        <p class="title">{{ $i18n.t('dj.no_djs_found') }}</p>
                        <p class="subtitle">
                            <a @click="resetSearch">{{
                                $i18n.t('dj.reset_search')
                            }}</a>
                        </p>
                    </div>
                </section>
            </div>
            <div v-else>
                <dj-list :djs="djsData?.data" />

                <o-pagination
                    :current="page"
                    :total="djsData?.meta?.filter_count"
                    :range-before="1"
                    :range-after="1"
                    order="centered"
                    size="small"
                    :per-page="perPage"
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
import _ from 'lodash'
import OValidatedTagInput from '~/components/form/OValidatedTagInput.vue'
import DjList from '~/components/dj/DjList.vue'
import { useFormStore } from '~/stores'
import { useAuth } from '~/composables/directus'

const { $i18n, $api } = useNuxtApp()
const auth = useAuth()
const route = useRoute()
const router = useRouter()
const formStore = useFormStore()

const name = ref(route.query.name ? route.query.name : '')
const city = ref(route.query.city ? route.query.city : '')
const genres = ref([]) // FILLED IN OnMounted
const sort = ref(route.query.sort ? route.query.sort : 'name')
const perPage = ref(4)
const page = ref(route.query.page ? parseInt(route.query.page) : 1)

const urlFilter = computed(() => {
    const urlFilterObj = {}
    if (name.value) urlFilterObj.name = name.value.toLowerCase()
    if (city.value) urlFilterObj.city = city.value
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
                _contains: name.value.toLowerCase().trim()
            }
        })
    }
    if (city.value) {
        requestFilterObj._and.push({
            city: {
                _eq: city.value.toLowerCase().trim()
            }
        })
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
    data: djsData,
    pending,
    refresh,
    error
} = useLazyAsyncData('djsPageQuery', () => {
    const djsData = $fetch('http://localhost:8055/items/dj', {
        method: 'SEARCH',
        body: JSON.stringify({
            query: requestQuery.value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    return djsData
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

onMounted(async () => {
    if (_.isEmpty(formStore.genresOptions)) {
        const { data: genresData } = await $fetch(
            'http://localhost:8055/items/genre'
        )
        formStore.setGenres(genresData)
    }

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

function resetSearch() {
    name.value = ''
    city.value = ''
    genres.value = []
    sort.value = 'name'

    onSearch()
}
</script>
