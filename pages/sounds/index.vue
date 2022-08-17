<template>
    <section class="section">
        <div class="container">
            <h1 class="title">
                Sounds {{ soundsData?.meta?.filter_count || 0 }}
            </h1>
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
                        maxtags="3"
                        expanded
                        :placeholder="$i18n.t('dj.select_3_genres')"
                        @input="onSearch"
                    />
                </client-only>
            </o-field>

            <p v-if="pending">Loading ...</p>
            <p v-else-if="error">{{ error.message }}</p>
            <div v-else-if="!pending && soundsData?.meta?.filter_count > 0">
                <sounds-page-list :sounds="soundsData.data" />

                <o-pagination
                    :current="page"
                    :total="soundsData?.meta?.filter_count"
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

const { $i18n, $api, $auth } = useNuxtApp()
const route = useRoute()
const router = useRouter()
const formStore = useFormStore()

const name = ref(route.query.name ? route.query.name : '')
const type = ref(route.query.type ? route.query.type : '')
const genres = ref([]) // FILLED IN OnMounted
const sort = ref(route.query.sort ? route.query.sort : 'name')
const perPage = ref(4)
const page = ref(route.query.page ? parseInt(route.query.page) : 1)

const urlFilter = computed(() => {
    const urlFilterObj = {}
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

    if ($auth.loggedIn) {
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
    data: soundsData,
    pending,
    refresh,
    error
} = useLazyAsyncData('soundsPageQuery   ', () => {
    const soundsData = $fetch('http://localhost:8055/items/sound', {
        method: 'SEARCH',
        body: JSON.stringify({
            query: requestQuery.value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    return soundsData
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
    type.value = ''
    genres.value = []
    sort.value = 'name'

    onSearch()
}
</script>
