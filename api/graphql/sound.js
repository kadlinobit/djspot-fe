import { gql } from 'graphql-tag'

export const getSounds = function () {
    const query = gql`
        query ($where: JSON) {
            sounds(where: $where) {
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
            }
        }
    `
    return query.loc.source.body
}
