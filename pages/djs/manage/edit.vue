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
            <dj-form
                :initial-data="initialData"
                :on-form-submit="editDj"
                :error-in="error"
                :success-in="success"
                :is-loading-in="isLoading"
            />
        </div>
    </section>
</template>

<script>
/**
 * TBD
 * - try to handle genres so there is no new dj_genre creation for each DJ update
 */
// import _ from 'lodash'
import DjForm from '~/components/form/DjForm.vue'
import ConfirmModal from '~/components/form/ConfirmModal.vue'

export default {
    name: 'DjEditPage',
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
            const data = await this.$axios.$get(`items/dj/${this.$auth.user.djs[0].id}`, {
                params: {
                    fields: this.$api.collection.getCollectionFields('dj', 'form').join(',')
                }
            })

            if (data.data) {
                this.initialData = {
                    ...data.data,
                    genres: data.data.genres.map((genre) => genre.genre_id)
                }
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

                // #1 Handle photo update || delete
                const photo = await this.editPhoto(formDataObj, this.initialData.photo)
                delete formDataObj.photo
                delete formDataObj.id

                const djData = {
                    ...formDataObj,
                    genres: formDataObj.genres
                        ? formDataObj.genres.map((genre) => ({ genre_id: parseInt(genre.id) }))
                        : null
                }

                if (photo !== 'keep-current') {
                    djData.photo = photo
                }

                const updatedDj = await this.$axios.patch(
                    `items/dj/${this.$auth.user.djs[0].id}`,
                    djData
                )
                await this.$auth.fetchUser()

                this.$router.push(`/djs/${updatedDj.data.data.slug}`)

                this.$oruga.notification.open({
                    message: this.$t('dj.updated_successfully'),
                    variant: 'success',
                    duration: 7000
                })
            } catch (e) {
                this.error = e
            } finally {
                this.isLoading = false
            }
        },
        async editPhoto(formDataObj, prevPhoto) {
            const newPhoto = formDataObj.photo
            const newPhotoMeta = {
                title: `dj_${formDataObj.slug}_photo`,
                filename_download: `dj_${formDataObj.slug}_photo`
                // folder: 'TBD - ADD FOLDER LATER'
            }
            const photoResult = await this.$api.file.handleCoverPhotoUpdate(
                newPhoto,
                prevPhoto,
                newPhotoMeta
            )
            return photoResult
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
                await this.$axios.delete(`items/dj/${this.$auth.user.djs[0].id}`)
                await this.$auth.fetchUser()

                this.$router.push(`/`)

                this.$oruga.notification.open({
                    message: this.$t('dj.deleted_successfully'),
                    variant: 'success',
                    duration: 7000
                })
            } catch (e) {
                this.error = e
            } finally {
                this.isLoading = false
            }
        }
    }
}
</script>
