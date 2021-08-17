import gql from 'graphql-tag'

export const upload = function () {
    const mutation = gql`
        mutation ($file: Upload!) {
            upload(file: $file) {
                id
                created_at
                updated_at
                name
                hash
                mime
                size
                url
                provider
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
