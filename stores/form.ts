import { defineStore } from 'pinia'
import _ from 'lodash'
import useDirectus from '~/composables/directus'

export const useFormStore = defineStore('form', () => {
    const directus = useDirectus()

    const cities = ref([])
    const genres = ref([])
    const djsPageSortOptions = ref([
        {
            value: 'name',
            label: 'form.sort.a_z'
        },
        {
            value: '-name',
            label: 'form.sort.z_a'
        },
        {
            value: 'date_created',
            label: 'form.sort.oldest'
        },
        {
            value: '-date_created',
            label: 'form.sort.newest'
        },
        {
            value: '-follow_count',
            label: 'form.sort.most_followed'
        }
    ])
    const soundsPageSortOptions = ref([
        {
            value: 'name',
            label: 'form.sort.a_z'
        },
        {
            value: '-name',
            label: 'form.sort.z_a'
        },
        {
            value: 'date_created',
            label: 'form.sort.oldest'
        },
        {
            value: '-date_created',
            label: 'form.sort.newest'
        },
        {
            value: '-like_count',
            label: 'form.sort.most_liked'
        }
    ])
    const soundTypeOptions = ref([
        {
            value: 'mix',
            label: 'mix.type'
        },
        {
            value: 'track',
            label: 'track.type'
        }
    ])

    const radiusOptions = ref([
        {
            value: 0,
            label: 'form.radius.0'
        },
        {
            value: 25,
            label: 'form.radius.25'
        },
        {
            value: 50,
            label: 'form.radius.50'
        },
        {
            value: 100,
            label: 'form.radius.100'
        }
    ])

    // GETTERS
    const citiesOptions = computed(() => {
        return cities.value.map((city) => {
            return { value: city.id, label: city.name }
        })
    })

    const genresOptions = computed(() => {
        return genres.value
    })

    // ACTIONS
    function setCities(val) {
        cities.value = val
    }
    /**
     * Fetch cities data from the server
     * @param {boolean} forceFetch - if true, fetches data even if the store is not empty
     * @returns
     */
    async function fetchCities(forceFetch: boolean = false) {
        if (!_.isEmpty(cities.value) && !forceFetch) return

        const citiesData = await directus
            .items('city')
            .readByQuery({ limit: -1 })
        setCities(citiesData.data)
    }

    function getCityCoordinates(id: number) {
        const city = _.find(cities.value, (city) => {
            return city.id === id
        })

        return city?.gps?.coordinates || null
    }

    function setGenres(val) {
        genres.value = val
    }
    /**
     * Fetch genres data from the server
     * @param {boolean} forceFetch - if true, fetches data even if the store is not empty
     * @returns
     */
    async function fetchGenres(forceFetch: boolean = false) {
        if (!_.isEmpty(genres.value) && !forceFetch) return

        const genresData = await directus
            .items('genre')
            .readByQuery({ limit: -1 })
        setGenres(genresData.data)
    }

    return {
        cities,
        genres,
        djsPageSortOptions,
        soundsPageSortOptions,
        soundTypeOptions,
        radiusOptions,

        // GETTERS
        citiesOptions,
        genresOptions,

        // ACTIONS
        fetchCities,
        setCities,
        getCityCoordinates,
        fetchGenres,
        setGenres
    }
})
