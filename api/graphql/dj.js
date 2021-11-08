import gql from 'graphql-tag'

const fragments = {
    default: `
        id
        name
        email
        bio
        slug
        user {
            id
        }
        photo {
            id
            url
            formats
        }
        city
        genres {
            id
            name
        }
        followsCount
        isFollowedByMe
    `,
    withMixes: `
        id
        name
        email
        bio
        slug
        user {
            id
        }
        photo {
            id
            url
            formats
        }
        city
        genres {
            id
            name
        }
        sounds {
            id
            type
            created_at
            updated_at
            name
            description
            url
            dj {
                name
                slug
            }
            genres {
                id
                name
            }
            duration
        }
        followsCount
        isFollowedByMe
    `,
    form: `
        id
        name
        email
        bio
        slug
        photo {
            id
            url
        }
        city
        genres {
            id
            name
        }
    `
}

export const getDjs = function (fragmentName) {
    const query = gql`
        query getDjs($sort: String, $where: JSON, $limit: Int, $start: Int) {
            djs(sort: $sort, where: $where, limit: $limit, start: $start) {
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

export const getDj = function (fragmentName) {
    const query = gql`
        query ($id: ID!) {
            dj(id: $id) {
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

export const createDj = function (fragmentName) {
    const mutation = gql`
        mutation createDj($dj: createDjInput!) {
            createDj(input: $dj) {
                ${
                    fragmentName && fragments[fragmentName]
                        ? fragments[fragmentName]
                        : fragments.default
                }
            }
        }
    `
    return mutation.loc.source.body
}

export const toggleDjFollow = function (fragmentName) {
    const query = gql`
        mutation ($id: ID!) {
            toggleDjFollow(id: $id) {
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

export const getDjsCount = function () {
    const query = gql`
        query ($where: JSON) {
            djsCount(where: $where)
        }
    `
    return query.loc.source.body
}

/* 

    {
    "newDj": {
        "data": {
        "name": "GraphQL DJ",
        "slug":"graphql_dj",
        "city": "Praha"
        }
    }
    }

*/
