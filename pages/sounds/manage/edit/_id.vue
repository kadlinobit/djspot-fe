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
import { getSound } from '~/api/graphql/sound'
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
            const data = await this.$strapi.graphql({
                query: getSound('form'),
                variables: {
                    id
                }
            })

            if (data.sound) {
                this.initialData = { ...data.sound }
            } else {
                this.$fetchState.error = 'Sound not found'
                return this.$nuxt.error({ statusCode: 404, message: 'Sound not found' })
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

                const formData = new FormData()

                if (formDataObj.photo && formDataObj.photo !== 'keep-current') {
                    const { canvas } = formDataObj.photo.croppedImage
                    if (canvas) {
                        const blob = await new Promise((resolve) => canvas.toBlob(resolve))
                        const fileName = `sound_${formDataObj.name}.${blob.type.split('/')[1]}`
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

                const sound = await this.$strapi.update('sounds', formDataObj.id, formData)

                if (sound) {
                    this.$router.push(`/djs/${sound.dj.slug}/sounds/${sound.id}`)

                    this.$oruga.notification.open({
                        message: this.$t(`${formDataObj.type}.edit_success`, [sound.name]),
                        variant: 'success',
                        duration: 7000
                    })
                }
            } catch (e) {
                this.error = parseResponseErrorMessage(e)
            } finally {
                this.isLoading = false
            }
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
                await this.$strapi.delete('sounds', id)

                this.$router.push(`/`)

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
