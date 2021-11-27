import { gql } from 'graphql-tag'

const fragments = {
    default: `
        id
        created_at
        updated_at
        name
        description
        url
        dj {
            id
            name
            slug
            city  
        }
        type
        duration
        photo {
            url
            previewUrl
            formats
        }
        published_at
        genres {
            id,
            name
        }
        likesCount
        isLikedByMe
        `,
    detailed: `
        id
        created_at
        updated_at
        name
        description
        url
        dj {
            id
            name
            slug
            city
            photo {
                url
                previewUrl
                formats
            }
        }
        type
        duration
        photo {
            url
            previewUrl
            formats
        }
        published_at
        genres {
            id,
            name
        }
        likesCount
        isLikedByMe
    `,
    form: `
        id
        name
        description
        url
        dj {
            id
        }
        type
        duration
        genres {
            id
            name
        }
        photo {
            id
            url
        }
    `,
    list: `
        id
        created_at
        updated_at
        name
        description
        url
        dj {
            id
            name
            slug
        }
        type
        duration
        genres {
            id
            name
        }
        photo {
            id
            url
            formats
        }
    `
}

export const getSound = function (fragmentName) {
    const query = gql`
        query ($id: ID!) {
            sound(id: $id) {
                ${
                    fragmentName && fragments[fragmentName]
                        ? fragments[fragmentName]
                        : fragments.default
                }
            }
        }
    `
    return query.loc.source.body
}

export const getSounds = function (fragmentName) {
    const query = gql`
        query ($where: JSON) {
            sounds(where: $where) {
                ${
                    fragmentName && fragments[fragmentName]
                        ? fragments[fragmentName]
                        : fragments.default
                }
            }
        }
    `
    return query.loc.source.body
}

export const toggleSoundLike = function (fragmentName) {
    const query = gql`
        mutation ($id: ID!) {
            toggleSoundLike(id: $id) {
                ${
                    fragmentName && fragments[fragmentName]
                        ? fragments[fragmentName]
                        : fragments.default
                }
            }
        }
    `
    return query.loc.source.body
}

export const getSoundsCount = function () {
    const query = gql`
        query ($where: JSON) {
            soundsCount(where: $where)
        }
    `
    return query.loc.source.body
}
