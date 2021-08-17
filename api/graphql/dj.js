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
