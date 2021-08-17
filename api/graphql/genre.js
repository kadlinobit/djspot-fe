import gql from 'graphql-tag'

export const getGenreTags = function () {
    const query = gql`
        query getGenreTags {
            genres {
                id
                name
            }
        }
    `
    return query.loc.source.body
}
