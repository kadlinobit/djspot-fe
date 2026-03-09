import { defineStore } from 'pinia';
import { readItems } from '@directus/sdk';
import _ from 'lodash';
import type { City, Genre } from '~/plugins/directus/types';

export const useFormStore = defineStore('form', () => {
    const { $directus } = useNuxtApp();
    const cities = ref<City[]>([]);
    const genres = ref<Genre[]>([]);
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
    ]);
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
    ]);
    const soundTypeOptions = ref([
        {
            value: 'mix',
            label: 'mix.type'
        },
        {
            value: 'track',
            label: 'track.type'
        }
    ]);

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
    ]);

    // GETTERS
    const citiesOptions = computed(() => {
        return cities.value.map((city) => {
            return { value: city.id, label: city.name };
        });
    });

    const genresOptions = computed(() => {
        return genres.value.map((genre) => {
            return { value: genre.id, label: genre.name };
        });
    });

    // ACTIONS
    function setCities(val: City[]) {
        cities.value = val;
    }
    /**
     * Fetch cities data from the server
     * @param {boolean} forceFetch - if true, fetches data even if the store is not empty
     * @returns
     */
    async function fetchCities(forceFetch: boolean = false) {
        if (!_.isEmpty(cities?.value) && !forceFetch) return;
        const citiesData = await $directus.request(
            readItems('city', { limit: -1, sort: 'name' })
        );
        setCities(citiesData);
    }

    function getCityCoordinates(id: number) {
        const city = _.find(cities.value, (city) => {
            return city.id === id;
        });

        return city?.gps || null;
    }

    function setGenres(val: Genre[]) {
        genres.value = val;
    }
    /**
     * Fetch genres data from the server
     * @param {boolean} forceFetch - if true, fetches data even if the store is not empty
     * @returns
     */
    async function fetchGenres(forceFetch: boolean = false) {
        if (!_.isEmpty(genres?.value) && !forceFetch) return;

        const genresData = await $directus.request(
            readItems('genre', { limit: -1 })
        );
        setGenres(genresData);
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
    };
});
