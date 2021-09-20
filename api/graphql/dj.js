import gql from 'graphql-tag'

export const getDjs = function () {
    const query = gql`
        query getDjs($where: JSON) {
            djs(where: $where) {
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
            }
        }
    `
    return query.loc.source.body
}

export const getDjsWithMixes = function () {
    const query = gql`
        query getDjs($where: JSON) {
            djs(where: $where) {
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
                mixes {
                    id
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
                }
            }
        }
    `
    return query.loc.source.body
}

export const getDjFormData = function () {
    const query = gql`
        query ($id: ID!) {
            dj(id: $id) {
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
            }
        }
    `
    return query.loc.source.body
}

export const createDj = function () {
    const mutation = gql`
        mutation createDj($dj: createDjInput!) {
            createDj(input: $dj) {
                dj {
                    id
                    name
                }
            }
        }
    `
    return mutation.loc.source.body
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
