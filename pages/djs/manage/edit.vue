<template>
    <section class="section">
        <div class="container">
            <b-loading
                v-if="$fetchState.pending"
                :is-full-page="true"
                :can-cancel="true"
            ></b-loading>
            <p v-else-if="$fetchState.error">{{ $fetchState.error.message }}</p>
            <div v-else class="container">
                <div class="columns is-gapless is-vcentered">
                    <div class="column">
                        <h1 class="title">
                            {{ `${initialData.name} - ${$t('dj.edit_profile')}` }}
                        </h1>
                    </div>
                    <div class="column is-narrow">
                        <b-button class="is-danger" @click.prevent="onDeleteDj">
                            {{ $t('dj.delete_profile') }}
                        </b-button>
                    </div>
                </div>
                <client-only>
                    <DjForm
                        :initial-data="initialData"
                        :on-form-submit="editDj"
                        :error-in="error"
                        :success-in="success"
                        :is-loading-in="isLoading"
                    />
                </client-only>
            </div>
        </div>
    </section>
</template>

<script>
import DjForm from '~/components/form/DjForm.vue'
import { getDjFormData } from '~/api/graphql/dj'
export default {
    components: {
        DjForm
    },
    data() {
        return {
            error: null,
            success: null,
            isLoading: false,
            initialData: null
        }
    },
    async fetch() {
        try {
            const data = await this.$strapi.graphql({
                query: getDjFormData(),
                variables: {
                    id: this.$strapi.user.dj.id
                }
            })
            if (data.dj) {
                this.initialData = { ...data.dj }
            } else {
                throw new Error('DJ not found')
            }
        } catch (e) {
            this.$fetchState.error = e
            if (e.statusCode && e.statusCode === 404) {
                return this.$nuxt.error({ statusCode: 404, message: e.message })
            }
        }
    },
    methods: {
        async editDj(formDataJSON) {
            try {
                this.isLoading = true
                const formData = new FormData()

                // if (formDataJSON.photo && formDataJSON.photo !== 'keep-current') {
                //     formData.append('files.photo', formDataJSON.photo, formDataJSON.photo.name)
                // }

                if (formDataJSON.photo && formDataJSON.photo !== 'keep-current') {
                    const { canvas } = formDataJSON.photo
                    if (canvas) {
                        const avatarBlob = await new Promise((resolve) => canvas.toBlob(resolve))
                        const fileName = `dj_${formDataJSON.slug}_photo.${
                            avatarBlob.type.split('/')[1]
                        }`
                        formData.append('files.photo', avatarBlob, fileName)
                    }
                }

                if (formDataJSON.photo === 'keep-current') {
                    delete formDataJSON.photo
                }

                formData.append(
                    'data',
                    JSON.stringify({
                        ...formDataJSON,
                        genres: formDataJSON.genres
                            ? formDataJSON.genres.map((genre) => parseInt(genre.id))
                            : null
                    })
                )

                const dj = await this.$strapi.update('djs', this.$strapi.user.dj.id, formData)
                await this.$strapi.fetchUser()

                this.$router.push(`/djs/${dj.slug}`)

                this.$buefy.toast.open({
                    message: this.$t('dj.updated_successfully'),
                    type: 'is-success',
                    duration: 7000
                })
            } catch (e) {
                if (e.response && e.response.data) {
                    this.error = e.response.data.message[0].messages[0].message
                } else {
                    this.error = e
                }
            } finally {
                this.isLoading = false
            }
        },
        onDeleteDj() {
            this.$buefy.dialog.confirm({
                title: this.$t('dj.delete_profile'),
                message: this.$t('dj.delete_profile_confirm_message'),
                confirmText: this.$t('dj.delete_profile'),
                cancelText: this.$t('form.cancel'),
                type: 'is-danger',
                hasIcon: true,
                onConfirm: () => this.deleteDj()
            })
        },
        async deleteDj() {
            try {
                this.isLoading = true
                await this.$strapi.delete('djs', this.$strapi.user.dj.id)
                await this.$strapi.fetchUser()

                this.$router.push(`/`)

                this.$buefy.toast.open({
                    message: this.$t('dj.deleted_successfully'),
                    type: 'is-success',
                    duration: 7000
                })
            } catch (e) {
                if (e.response && e.response.data) {
                    this.error = e.response.data.message[0].messages[0].message
                } else {
                    this.error = e
                }
            } finally {
                this.isLoading = false
            }
        }
    }
}
</script>
