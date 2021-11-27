<template>
    <section class="section">
        <div class="container">
            <h1 class="title">Sounds {{ getSoundsCount }}</h1>
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
            <o-field grouped>
                <o-field>
                    <o-select v-model="sortLocal" @input="onSearch">
                        <option
                            v-for="option in getSoundsPageSortOptions"
                            :key="option.value"
                            :value="option.value"
                        >
                            {{ option.label }}
                        </option>
                    </o-select>
                </o-field>
                <o-field>
                    <o-select v-model="searchTypeLocal" @input="onSearch">
                        <option value="">
                            {{ `Celá ČR` }}
                        </option>
                        <option
                            v-for="option in getSoundTypeOptions"
                            :key="option.value"
                            :value="option.value"
                        >
                            {{ option.label }}
                        </option>
                    </o-select>
                </o-field>
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
            </o-field>

            <p v-if="$fetchState.pending">Loading ...</p>
            <p v-else-if="$fetchState.error">{{ $fetchState.error.message }}</p>
            <div v-else>
                <sounds-page-list :sounds="getSounds[currentPage]" />

                <o-pagination
                    :current="currentPage"
                    :total="getSoundsCount"
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
import { getSounds, getSoundsCount } from '~/api/graphql/sound'
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

        if (
            _.isArray(this.getSounds[this.currentPage]) &&
            !_.isEmpty(this.getSounds[this.currentPage])
        )
            return

        try {
            this.setSoundsCount(await this.fetchSoundsCount())
            const sounds = await this.fetchSounds(0)

            if (Array.isArray(sounds)) {
                this.setNewSounds(sounds)
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
            'getCurrentPage',
            'getPerPage',
            'getSort',
            'getSoundsCount',
            'getSounds',
            'getWhere',
            'getSearchName',
            'getSearchType',
            'getSearchGenres'
        ]),
        ...mapGetters('form', [
            'getSoundsPageSortOptions',
            'getSoundTypeOptions',
            'getGenresOptions'
        ]),
        currentPage: {
            get() {
                return this.getCurrentPage
            },
            set(value) {
                this.setCurrentPage(value)
            }
        },
        perPage: {
            get() {
                return this.getPerPage
            },
            set(value) {
                this.setPerPage(value)
            }
        },
        sort: {
            get() {
                return this.getSort
            },
            set(value) {
                this.setSort(value)
            }
        }
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
        async fetchSoundsCount() {
            const soundsCountData = await this.$strapi.graphql({
                query: getSoundsCount(),
                variables: {
                    where: this.getWhere
                }
            })

            return soundsCountData.soundsCount || 0
        },
        async fetchSounds(start) {
            const soundsData = await this.$strapi.graphql({
                query: getSounds(),
                variables: {
                    sort: this.getSort,
                    where: this.getWhere,
                    limit: this.getPerPage,
                    start
                }
            })

            return soundsData.sounds
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
            this.currentPage = pageNumber

            if (!_.isArray(this.getSounds[pageNumber]) || _.isEmpty(this.getSounds[pageNumber])) {
                const sounds = await this.fetchSounds(
                    this.currentPage * this.getPerPage - this.getPerPage
                )
                this.setPageSounds({ sounds, pageNumber })
            }
        },
        syncLocalSearchValues() {
            this.searchNameLocal = this.getSearchName
            this.searchTypeLocal = this.getSearchType
            this.searchGenresLocal = this.getSearchGenres
            this.sortLocal = this.getSort
        }
    }
}
</script>
