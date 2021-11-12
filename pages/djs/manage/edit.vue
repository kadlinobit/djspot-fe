<template>
    <section class="section">
        <o-loading
            v-if="$fetchState.pending"
            :full-page="false"
            :active.sync="$fetchState.pending"
            :can-cancel="true"
        />
        <p v-else-if="$fetchState.error">{{ $fetchState.error.message }}</p>
        <div v-else class="container">
            <div class="columns is-gapless is-vcentered">
                <div class="column">
                    <h1 class="title">
                        {{ `${initialData.name} - ${$t('dj.edit_profile')}` }}
                    </h1>
                </div>
                <div class="column is-narrow">
                    <o-button variant="danger" @click="onDeleteDj()">
                        {{ $t('dj.delete_profile') }}
                    </o-button>
                </div>
            </div>
            <client-only>
                <dj-form
                    :initial-data="initialData"
                    :on-form-submit="editDj"
                    :error-in="error"
                    :success-in="success"
                    :is-loading-in="isLoading"
                />
            </client-only>
        </div>
    </section>
</template>

<script>
import DjForm from '~/components/form/DjForm.vue'
import ConfirmModal from '~/components/form/ConfirmModal.vue'
import { getDj } from '~/api/graphql/dj'
import { parseResponseErrorMessage } from '~/api/tools'

export default {
    components: {
        DjForm
    },
    middleware: 'authenticated',
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
                query: getDj('form'),
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
        async editDj(formDataObj) {
            try {
                this.isLoading = true
                const formData = new FormData()

                if (formDataObj.photo && formDataObj.photo !== 'keep-current') {
                    const { canvas } = formDataObj.photo.croppedImage
                    if (canvas) {
                        const blob = await new Promise((resolve) => canvas.toBlob(resolve))
                        const fileName = `dj_${formDataObj.slug}_photo.${blob.type.split('/')[1]}`
                        formData.append('files.photo', blob, fileName)
                    }
                }

                if (formDataObj.photo === 'keep-current') {
                    delete formDataObj.photo
                }

                formData.append(
                    'data',
                    JSON.stringify({
                        ...formDataObj,
                        genres: formDataObj.genres
                            ? formDataObj.genres.map((genre) => parseInt(genre.id))
                            : null
                    })
                )

                const dj = await this.$strapi.update('djs', this.$strapi.user.dj.id, formData)
                await this.$strapi.fetchUser()

                this.$router.push(`/djs/${dj.slug}`)

                this.$oruga.notification.open({
                    message: this.$t('dj.updated_successfully'),
                    variant: 'success',
                    duration: 7000
                })
            } catch (e) {
                this.error = parseResponseErrorMessage(e)
            } finally {
                this.isLoading = false
            }
        },
        onDeleteDj() {
            this.$oruga.modal.open({
                active: true,
                component: ConfirmModal,
                props: {
                    title: this.$t('dj.delete_profile'),
                    message: this.$t('dj.delete_profile_confirm_message'),
                    confirmText: this.$t('dj.delete_profile'),
                    cancelText: this.$t('form.cancel'),
                    onConfirm: () => this.deleteDj()
                }
            })
        },
        async deleteDj() {
            try {
                this.isLoading = true
                await this.$strapi.delete('djs', this.$strapi.user.dj.id)
                await this.$strapi.fetchUser()

                this.$router.push(`/`)

                this.$oruga.notification.open({
                    message: this.$t('dj.deleted_successfully'),
                    variant: 'success',
                    duration: 7000
                })
            } catch (e) {
                this.error = parseResponseErrorMessage(e)
            } finally {
                this.isLoading = false
            }
        }
    }
}
</script>
