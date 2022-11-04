<template>
    <section class="section">
        <div class="container">
            <h1 class="title">Sounds {{ sounds?.meta?.filter_count || 0 }}</h1>
            <o-field>
                <o-input
                    v-model="name"
                    placeholder="Search in Sound or DJ name"
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
                        v-for="option in formStore.soundsPageSortOptions"
                        :key="option.value"
                        :value="option.value"
                    >
                        {{ $i18n.t(option.label) }}
                    </option>
                </o-select>

                <o-select v-model="type" expanded @input="onSearch">
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
            <div v-else-if="!fetchPending && sounds?.meta?.filter_count === 0">
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
            <div v-else-if="!fetchPending && sounds?.meta?.filter_count > 0">
                <sounds-page-list :sounds="sounds.data" />

                <o-pagination
                    :current="page"
                    :total="sounds?.meta?.filter_count"
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
import SoundsPageList from '~/components/sound/SoundsPageList.vue'
import { useFormStore } from '~/stores'
import useDirectus, { useAuth } from '~/composables/directus'

const { $i18n, $api } = useNuxtApp()
const route = useRoute()
const router = useRouter()
const formStore = useFormStore()
const directus = useDirectus()
const auth = useAuth()

type UrlFilterObj = {
    name?: string
    city?: string
    type?: string
    genres?: Array<any>
}

const name = ref(route.query.name ? String(route.query.name) : '')
const type = ref(route.query.type ? String(route.query.type) : '')
const genres = ref([]) // FILLED IN OnMounted
const sort = ref(route.query.sort ? String(route.query.sort) : 'name')
const perPage = ref(4)
const page = ref(route.query.page ? parseInt(String(route.query.page)) : 1)

const urlFilter = computed(() => {
    const urlFilterObj: UrlFilterObj = {}
    if (name.value) urlFilterObj.name = name.value
    if (type.value) urlFilterObj.type = type.value
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
    let fields = $api.collection.getCollectionFields('sound', 'default')

    if (auth.loggedIn.value) {
        fields = fields.filter((field) => field !== 'likes')
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
    if (!name.value && !type.value && _.isEmpty(genres.value)) return null

    const requestFilterObj = { _and: [] }

    if (name.value) {
        requestFilterObj._and.push({
            name: {
                _contains: name.value.toLowerCase().trim()
            }
        })
    }
    if (type.value) {
        requestFilterObj._and.push({
            type: {
                _eq: type.value.toLowerCase().trim()
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
    data: sounds,
    pending: fetchPending,
    refresh,
    error: fetchError
} = useLazyAsyncData('soundsPageQuery   ', async function () {
    const sounds = await directus
        .items('sound')
        .readByQuery({ ...requestQuery.value })

    return sounds
})

function pushRouterQuery() {
    router.push({
        path: '/sounds',
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

function resetSearch() {
    name.value = ''
    type.value = ''
    genres.value = []
    sort.value = 'name'

    onSearch()
}
</script>
