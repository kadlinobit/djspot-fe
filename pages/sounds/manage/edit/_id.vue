<!-- 
TODO:
- check if sound belongs to a user, if not, do not allow to see the form
-->
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
                        {{ `${initialData.name} - ${$t(`${initialData.type}.edit`)}` }}
                    </h1>
                </div>
                <div class="column is-narrow">
                    <o-button variant="danger" @click.stop="onDeleteSound">
                        {{ $t(`${initialData.type}.delete`) }}
                    </o-button>
                </div>
            </div>
            <sound-form
                :on-form-submit="editSound"
                :error-in="error"
                :success-in="success"
                :is-loading-in="isLoading"
                :initial-data="initialData"
            />
        </div>
    </section>
</template>

<script>
import SoundForm from '~/components/form/SoundForm.vue'
import ConfirmModal from '~/components/form/ConfirmModal.vue'
import { parseResponseErrorMessage } from '~/api/tools'

export default {
    name: 'EditSoundPage',
    components: {
        SoundForm
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
            const id = this.$nuxt.context.params.id
            const data = await this.$axios.$get(`items/sound/${id}`, {
                params: {
                    fields: this.$api.collection.getCollectionFields('sound', 'form').join(',')
                }
            })

            if (data.data) {
                this.initialData = {
                    ...data.data,
                    genres: data.data.genres.map((genre) => genre.genre_id)
                }
            } else {
                throw new Error('Sound not found')
            }
        } catch (e) {
            this.$fetchState.error = e
            if (e.statusCode && e.statusCode === 404) {
                return this.$nuxt.error({ statusCode: 404, message: e.message })
            }
        }
    },
    methods: {
        async editSound(formDataObj) {
            try {
                this.isLoading = true

                const id = formDataObj.id

                // #1 Handle photo update || delete
                const photo = await this.editPhoto(formDataObj, this.initialData.photo)
                delete formDataObj.photo
                delete formDataObj.id

                const soundData = {
                    ...formDataObj,
                    genres: formDataObj.genres
                        ? formDataObj.genres.map((genre) => ({ genre_id: parseInt(genre.id) }))
                        : null
                }

                if (photo !== 'keep-current') {
                    soundData.photo = photo
                }

                const updatedSound = await this.$axios.patch(`items/sound/${id}`, soundData)

                this.$router.push(
                    `/djs/${this.$auth.user.djs[0].slug}/sounds/${updatedSound.data.data.id}`
                )

                this.$oruga.notification.open({
                    message: this.$t(`${formDataObj.type}.updated_successfully`),
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
                title: `sound_${formDataObj.name}`,
                filename_download: `sound_${formDataObj.name}`
                // folder: 'TBD - ADD FOLDER LATER'
            }
            const photoResult = await this.$api.file.handleCoverPhotoUpdate(
                newPhoto,
                prevPhoto,
                newPhotoMeta
            )
            return photoResult
        },
        onDeleteSound() {
            const { type, name } = this.initialData

            this.$oruga.modal.open({
                active: true,
                component: ConfirmModal,
                props: {
                    title: this.$t(`${type}.delete`),
                    message: this.$t(`${type}.delete_confirm_message`, [name]),
                    confirmText: this.$t(`${type}.delete`),
                    cancelText: this.$t('form.cancel'),
                    onConfirm: () => this.deleteSound()
                }
            })
        },
        async deleteSound() {
            try {
                this.isLoading = true
                const { id, type, name } = this.initialData
                await this.$axios.delete(`items/sound/${id}`)

                this.$router.push(`/djs/${this.$auth.user.djs[0].slug}`)

                this.$oruga.notification.open({
                    message: this.$t(`${type}.delete_success`, [name]),
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
