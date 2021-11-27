import _ from 'lodash'
import { getGenreTags } from '~/api/graphql/genre'

export const state = () => ({
    cities: [
        'Aš',
        'Benešov',
        'Beroun',
        'Blansko',
        'Blatná',
        'Blovice',
        'Bohumín',
        'Boskovice',
        'Brandýs nad Labem-Stará Boleslav',
        'Brno',
        'Broumov',
        'Bruntál',
        'Bučovice',
        'Bystřice nad Pernštejnem',
        'Bystřice pod Hostýnem',
        'Bílina',
        'Bílovec',
        'Břeclav',
        'Cheb',
        'Chomutov',
        'Chotěboř',
        'Chrudim',
        'Dačice',
        'Dobruška',
        'Dobříš',
        'Domažlice',
        'Dvůr Králové nad Labem',
        'Děčín',
        'Frenštát pod Radhoštěm',
        'Frýdek-Místek',
        'Frýdlant',
        'Frýdlant nad Ostravicí',
        'Havlíčkův Brod',
        'Havířov',
        'Hlinsko',
        'Hlučín',
        'Hodonín',
        'Holešov',
        'Holice',
        'Horažďovice',
        'Horšovský Týn',
        'Hořice',
        'Hořovice',
        'Hradec Králové',
        'Hranice',
        'Humpolec',
        'Hustopeče',
        'Ivančice',
        'Jablonec nad Nisou',
        'Jablunkov',
        'Jaroměř',
        'Jeseník',
        'Jihlava',
        'Jilemnice',
        'Jindřichův Hradec',
        'Jičín',
        'Kadaň',
        'Kaplice',
        'Karlovy Vary',
        'Karviná',
        'Kladno',
        'Klatovy',
        'Kolín',
        'Konice',
        'Kopřivnice',
        'Kostelec nad Orlicí',
        'Kralovice',
        'Kralupy nad Vltavou',
        'Kraslice',
        'Kravaře',
        'Krnov',
        'Kroměříž',
        'Králíky',
        'Kutná Hora',
        'Kuřim',
        'Kyjov',
        'Lanškroun',
        'Liberec',
        'Lipník nad Bečvou',
        'Litomyšl',
        'Litoměřice',
        'Litovel',
        'Litvínov',
        'Louny',
        'Lovosice',
        'Luhačovice',
        'Lysá nad Labem',
        'Mariánské Lázně',
        'Mikulov',
        'Milevsko',
        'Mladá Boleslav',
        'Mnichovo Hradiště',
        'Mohelnice',
        'Moravská Třebová',
        'Moravské Budějovice',
        'Moravský Krumlov',
        'Most',
        'Mělník',
        'Nepomuk',
        'Neratovice',
        'Nová Paka',
        'Nové Město na Moravě',
        'Nové Město nad Metují',
        'Nový Bor',
        'Nový Bydžov',
        'Nový Jičín',
        'Nymburk',
        'Náchod',
        'Náměšť nad Oslavou',
        'Nýřany',
        'Odry',
        'Olomouc',
        'Opava',
        'Orlová',
        'Ostrava',
        'Ostrov',
        'Otrokovice',
        'Pacov',
        'Pardubice',
        'Pelhřimov',
        'Plzeň',
        'Podbořany',
        'Poděbrady',
        'Pohořelice',
        'Polička',
        'Prachatice',
        'Praha',
        'Prostějov',
        'Písek',
        'Přelouč',
        'Přerov',
        'Přeštice',
        'Příbram',
        'Rakovník',
        'Rokycany',
        'Rosice',
        'Roudnice nad Labem',
        'Rožnov pod Radhoštěm',
        'Rumburk',
        'Rychnov nad Kněžnou',
        'Rýmařov',
        'Sedlčany',
        'Semily',
        'Slaný',
        'Slavkov u Brna',
        'Soběslav',
        'Sokolov',
        'Stod',
        'Strakonice',
        'Stříbro',
        'Sušice',
        'Svitavy',
        'Světlá nad Sázavou',
        'Tachov',
        'Tanvald',
        'Telč',
        'Teplice',
        'Tišnov',
        'Trhové Sviny',
        'Trutnov',
        'Turnov',
        'Tábor',
        'Týn nad Vltavou',
        'Třeboň',
        'Třebíč',
        'Třinec',
        'Uherské Hradiště',
        'Uherský Brod',
        'Uničov',
        'Valašské Klobouky',
        'Valašské Meziříčí',
        'Varnsdorf',
        'Velké Meziříčí',
        'Veselí nad Moravou',
        'Vimperk',
        'Vizovice',
        'Vlašim',
        'Vodňany',
        'Votice',
        'Vrchlabí',
        'Vsetín',
        'Vysoké Mýto',
        'Vyškov',
        'Vítkov',
        'Zlín',
        'Znojmo',
        'Zábřeh',
        'Ústí nad Labem',
        'Ústí nad Orlicí',
        'Černošice',
        'Česká Lípa',
        'Česká Třebová',
        'České Budějovice',
        'Český Brod',
        'Český Krumlov',
        'Český Těšín',
        'Čáslav',
        'Říčany',
        'Šlapanice',
        'Šternberk',
        'Šumperk',
        'Žamberk',
        'Žatec',
        'Železný Brod',
        'Židlochovice',
        'Žďár nad Sázavou'
    ],
    genres: [],
    djsPageSortOptions: [
        {
            value: 'name:asc',
            label: 'name:asc'
        },
        {
            value: 'name:desc',
            label: 'name:desc'
        },
        {
            value: 'created_at:asc',
            label: 'created_at:asc'
        },
        {
            value: 'created_at:desc',
            label: 'created_at:desc'
        }
    ],
    soundsPageSortOptions: [
        {
            value: 'name:asc',
            label: 'name:asc'
        },
        {
            value: 'name:desc',
            label: 'name:desc'
        },
        {
            value: 'created_at:asc',
            label: 'created_at:asc'
        },
        {
            value: 'created_at:desc',
            label: 'created_at:desc'
        }
    ],
    soundTypeOptions: ['mix', 'track']
})
export const mutations = {
    mutateSetGenres(state, genres) {
        state.genres = genres
    }
}

export const actions = {
    async fetchGenres({ commit, state }) {
        if (_.isEmpty(state.genres)) {
            const genresData = await this.$strapi.graphql({
                query: getGenreTags()
            })

            commit('mutateSetGenres', genresData.genres)
        }
    }
}

export const getters = {
    getCitiesOptions(state) {
        return state.cities.map((city) => {
            return { value: city, label: city }
        })
    },
    getDjsPageSortOptions(state) {
        return state.djsPageSortOptions
    },
    getGenresOptions(state) {
        return state.genres
    },
    getSoundTypeOptions(state) {
        return state.soundTypeOptions
    },
    getSoundsPageSortOptions(state) {
        return state.soundsPageSortOptions
    }
}
