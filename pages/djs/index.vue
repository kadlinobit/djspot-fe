<template>
    <section class="section">
        <div class="container">
            <h1 class="title">DJs {{ getDjsCount }}</h1>
            <b-field>
                <b-input
                    v-model="searchNameLocal"
                    placeholder="Search in DJ name"
                    type="search"
                    expanded
                ></b-input>
                <p class="control">
                    <b-button type="is-primary" label="Search" @click="onSearch" />
                </p>
            </b-field>
            <b-field grouped>
                <b-field>
                    <b-select v-model="sortLocal" @input="onSearch">
                        <option
                            v-for="option in getDjPageSortOptions"
                            :key="option.value"
                            :value="option.value"
                        >
                            {{ option.label }}
                        </option>
                    </b-select>
                </b-field>
                <b-field>
                    <b-select v-model="searchCityLocal" @input="onSearch">
                        <option value="">
                            {{ `Celá ČR` }}
                        </option>
                        <option
                            v-for="option in getCitiesOptions"
                            :key="option.value"
                            :value="option.value"
                        >
                            {{ option.label }}
                        </option>
                    </b-select>
                </b-field>
                <b-validated-tag-input
                    v-model="searchGenresLocal"
                    name="genres"
                    :tags="getGenresOptions"
                    :is-validation-on="false"
                    field="name"
                    maxtags="3"
                    expanded
                    :placeholder="$t('dj.select_3_genres')"
                />
            </b-field>

            <p v-if="$fetchState.pending">Loading ...</p>
            <p v-else-if="$fetchState.error">{{ $fetchState.error.message }}</p>
            <div v-else>
                <ul>
                    <li v-for="dj in getDjs[currentPage]" :key="dj.id">
                        <nuxt-link :to="`/djs/${dj.slug}`">{{ dj.name }}</nuxt-link>
                    </li>
                </ul>

                <b-pagination
                    v-model="currentPage"
                    :total="getDjsCount"
                    :range-before="1"
                    :range-after="1"
                    order="is-centered"
                    size="is-small"
                    :per-page="perPage"
                    aria-next-label="Next page"
                    aria-previous-label="Previous page"
                    aria-page-label="Page"
                    aria-current-label="Current page"
                    @change="onPageChange"
                >
                </b-pagination>
            </div>
        </div>
    </section>
</template>

<script>
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import { getDjs, getDjsCount } from '~/api/graphql/dj'
import BValidatedTagInput from '~/components/form/BValidatedTagInput.vue'

export default {
    name: 'DjsPage',
    components: {
        BValidatedTagInput
    },
    data() {
        return {
            searchNameLocal: '',
            searchCityLocal: '',
            searchGenresLocal: [],
            sortLocal: ''
        }
    },
    async fetch() {
        this.fetchGenres()
        this.syncLocalSearchValues()

        if (_.isArray(this.getDjs[this.currentPage]) && !_.isEmpty(this.getDjs[this.currentPage]))
            return

        try {
            this.setDjsCount(await this.fetchDjsCount())
            const djs = await this.fetchDjs(0)

            if (Array.isArray(djs)) {
                this.setNewDjs(djs)
            } else {
                this.$fetchState.error = 'DJs not fetched'
                return this.$nuxt.error({ statusCode: 404, message: 'DJs not fetched' })
            }
        } catch (e) {
            this.$fetchState.error = e
            if (e.statusCode && e.statusCode === 404) {
                return this.$nuxt.error({ statusCode: 404, message: e.message })
            }
        }
    },
    computed: {
        ...mapGetters('djsPage', [
            'getCurrentPage',
            'getPerPage',
            'getSort',
            'getDjsCount',
            'getDjs',
            'getWhere',
            'getSearchName',
            'getSearchCity',
            'getSearchGenres'
        ]),
        ...mapGetters('form', ['getDjPageSortOptions', 'getCitiesOptions', 'getGenresOptions']),
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
        ...mapActions('djsPage', [
            'setCurrentPage',
            'setPerPage',
            'setSort',
            'setDjsCount',
            'setNewDjs',
            'setPageDjs',
            'setSearchName',
            'setSearchCity',
            'setSearchGenres',
            'initNewSearch'
        ]),
        ...mapActions('form', ['fetchGenres']),
        async fetchDjsCount() {
            const djsCountData = await this.$strapi.graphql({
                query: getDjsCount(),
                variables: {
                    where: this.getWhere
                }
            })

            return djsCountData.djsCount || 0
        },
        async fetchDjs(start) {
            const djsDataFull = await this.$strapi.graphql({
                query: getDjs(),
                variables: {
                    sort: this.getSort,
                    where: this.getWhere
                }
            })

            console.log('DJS NUMBER', djsDataFull.djs.length)
            const djsData = await this.$strapi.graphql({
                query: getDjs(),
                variables: {
                    sort: this.getSort,
                    where: this.getWhere,
                    limit: this.getPerPage,
                    start
                }
            })

            return djsData.djs
        },
        async onSearch() {
            this.initNewSearch({
                searchName: this.searchNameLocal,
                searchCity: this.searchCityLocal,
                searchGenres: this.searchGenresLocal,
                sort: this.sortLocal
            })
            await this.$fetch()
        },
        async onPageChange(pageNumber) {
            this.syncLocalSearchValues()

            if (!_.isArray(this.getDjs[pageNumber]) || _.isEmpty(this.getDjs[pageNumber])) {
                const djs = await this.fetchDjs(
                    this.currentPage * this.getPerPage - this.getPerPage
                )

                this.setPageDjs({ djs, pageNumber })
            }
        },
        syncLocalSearchValues() {
            this.searchNameLocal = this.getSearchName
            this.searchCityLocal = this.getSearchCity
            this.searchGenresLocal = this.getSearchGenres
            this.sortLocal = this.getSort
        }
    }
}
</script>
