<template>
    <section class="section">
        <div class="container">
            <h1 class="title">Sounds {{ soundsCount }}</h1>
            <o-field>
                <o-input
                    v-model="searchNameLocal"
                    placeholder="Search in DJ name"
                    type="search"
                    expanded
                ></o-input>
                <p class="control">
                    <o-button type="is-primary" label="Search" @click="onSearch" />
                </p>
            </o-field>
            <o-field class="no-label" horizontal>
                <o-select v-model="sortLocal" expanded @input="onSearch">
                    <option
                        v-for="option in soundsPageSortOptions"
                        :key="option.value"
                        :value="option.value"
                    >
                        {{ $t(option.label) }}
                    </option>
                </o-select>

                <o-select v-model="searchTypeLocal" expanded @input="onSearch">
                    <option value="">
                        {{ $t('sound.all_types') }}
                    </option>
                    <option
                        v-for="option in soundTypeOptions"
                        :key="option.value"
                        :value="option.value"
                    >
                        {{ $t(option.label) }}
                    </option>
                </o-select>
                <client-only>
                    <o-validated-tag-input
                        v-model="searchGenresLocal"
                        name="genres"
                        :tags="getGenresOptions"
                        :is-validation-on="false"
                        field="name"
                        maxtags="3"
                        expanded
                        :placeholder="$t('dj.select_3_genres')"
                    />
                </client-only>
            </o-field>

            <p v-if="$fetchState.pending">Loading ...</p>
            <p v-else-if="$fetchState.error">{{ $fetchState.error.message }}</p>
            <div v-else-if="!$fetchState.pending && soundsCount > 0">
                <sounds-page-list :sounds="sounds[currentPage]" />

                <o-pagination
                    :current="currentPage"
                    :total="soundsCount"
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

<script>
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import OValidatedTagInput from '~/components/form/OValidatedTagInput.vue'
import SoundsPageList from '~/components/sound/SoundsPageList.vue'

export default {
    name: 'SoundsPage',
    components: {
        OValidatedTagInput,
        SoundsPageList
    },
    data() {
        return {
            searchNameLocal: '',
            searchTypeLocal: '',
            searchGenresLocal: [],
            sortLocal: ''
        }
    },
    async fetch() {
        this.fetchGenres()
        this.syncLocalSearchValues()

        if (_.isArray(this.sounds[this.currentPage]) && !_.isEmpty(this.sounds[this.currentPage]))
            return

        try {
            const sounds = await this.fetchSounds(1)
            this.setSoundsCount(sounds.meta.filter_count)

            if (Array.isArray(sounds.data)) {
                this.setNewSounds(sounds.data)
            } else {
                this.$fetchState.error = 'Sounds not fetched'
                return this.$nuxt.error({ statusCode: 404, message: 'Sounds not fetched' })
            }
        } catch (e) {
            this.$fetchState.error = e
            if (e.statusCode && e.statusCode === 404) {
                return this.$nuxt.error({ statusCode: 404, message: e.message })
            }
        }
    },
    computed: {
        ...mapGetters('soundsPage', [
            'currentPage',
            'perPage',
            'sort',
            'soundsCount',
            'sounds',
            'filter',
            'searchName',
            'searchType',
            'searchGenres'
        ]),
        ...mapGetters('form', ['soundsPageSortOptions', 'soundTypeOptions', 'fenresOptions'])
    },
    methods: {
        ...mapActions('soundsPage', [
            'setCurrentPage',
            'setPerPage',
            'setSort',
            'setSoundsCount',
            'setNewSounds',
            'setPageSounds',
            'setSearchName',
            'setSearchType',
            'setSearchGenres',
            'initNewSearch'
        ]),
        ...mapActions('form', ['fetchGenres']),
        async fetchSounds(page) {
            let fields = this.$api.collection.getCollectionFields('sound', 'default')

            if (!this.$auth.loggedIn) {
                fields = fields.filter((field) => field !== 'follows')
            }

            const sounds = await this.$axios.$request('items/sound', {
                method: 'search',
                data: {
                    query: {
                        fields,
                        filter: this.filter,
                        meta: '*',
                        limit: this.perPage,
                        page
                        // sort: this.sort
                    }
                }
            })

            return sounds
        },
        async onSearch() {
            this.initNewSearch({
                searchName: this.searchNameLocal,
                searchType: this.searchTypeLocal,
                searchGenres: this.searchGenresLocal,
                sort: this.sortLocal
            })
            await this.$fetch()
        },
        async onPageChange(pageNumber) {
            this.syncLocalSearchValues()
            this.setCurrentPage(pageNumber)

            if (!_.isArray(this.sounds[pageNumber]) || _.isEmpty(this.sounds[pageNumber])) {
                const sounds = await this.fetchSounds(pageNumber)
                this.setPageSounds({ sounds, pageNumber })
            }
        },
        syncLocalSearchValues() {
            this.searchNameLocal = this.searchName
            this.searchTypeLocal = this.searchType
            this.searchGenresLocal = this.searchGenres
            this.sortLocal = this.sort
        }
    }
}
</script>
