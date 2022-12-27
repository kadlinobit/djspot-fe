const collectionsConfig = {
    dj: {
        fieldSets: {
            default: [
                'id',
                'name',
                'email',
                'bio',
                'slug',
                'photo',
                'city.*',
                'follow_count',
                'follows',
                'genres.genre_id.*'
            ],
            withSounds: [
                'id',
                'name',
                'email',
                'bio',
                'slug',
                'photo',
                'city.*',
                'follow_count',
                'follows',
                'genres.genre_id.*',
                'sounds.*',
                'sounds.dj.name',
                'sounds.dj.slug'
            ],
            form: [
                'id',
                'name',
                'email',
                'bio',
                'slug',
                'photo',
                'city.id',
                'genres.genre_id.*'
            ]
        }
    },
    sound: {
        fieldSets: {
            default: [
                'id',
                'date_created',
                'name',
                'description',
                'slug',
                'url',
                'dj.id',
                'dj.name',
                'dj.slug',
                'dj.city',
                'type',
                'duration',
                'photo',
                'genres.genre_id.*',
                'like_count',
                'likes'
            ],
            detailed: [
                'id',
                'date_created',
                'name',
                'description',
                'slug',
                'url',
                'dj.id',
                'dj.name',
                'dj.slug',
                'dj.city',
                'type',
                'duration',
                'photo',
                'genres.genre_id.*',
                'like_count',
                'likes'
            ],
            form: [
                'id',
                'name',
                'description',
                'slug',
                'url',
                'dj',
                'type',
                'duration',
                'photo',
                'genres.genre_id.*',
                'status'
            ]
        }
    },
    user: {
        fieldSets: {
            default: [
                'id',
                'first_name',
                'last_name',
                'email',
                'location',
                'language'
            ],
            form: ['first_name', 'last_name', 'email', 'location', 'language']
        }
    }
}

const collection = () => {
    const getCollectionFields = (collection, fieldSet) => {
        if (!fieldSet) fieldSet = 'default'
        return collectionsConfig[collection].fieldSets[fieldSet]
    }

    const api = {
        getCollectionFields
    }

    return api
}

export default collection
