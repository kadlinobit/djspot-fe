<template>
    <p v-if="$fetchState.pending">Fetching mountains...</p>
    <p v-else-if="$fetchState.error">{{ $fetchState.error.message }}</p>
    <div v-else>
        <h1>{{ dj.name }}</h1>
    </div>
</template>

<script>
/* eslint-disable */
import { getDjs } from '~/api/graphql/dj'

export default {
    async fetch() {
        try {
            const slug = this.$nuxt.context.params.slug
            const data = await this.$strapi.graphql({
                query: getDjs(),
                variables: {
                    where: {
                        slug
                    }
                }
            })

            if (data.djs && data.djs.length > 0) {
                this.dj = data.djs[0]
            } else {
                throw { statusCode: 404, message: 'DJ not found' }
            }
        } catch (e) {
            this.$fetchState.error = e
            if (e.statusCode && e.statusCode === 404) {
                return this.$nuxt.error({ statusCode: 404, message: e.message })
            }
        }
    },
    data() {
        return {
            dj: null
        }
    }
}
</script>
