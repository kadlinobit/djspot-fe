<template>
    <section class="section">
        <div class="container">
            <h1 class="title">
                {{ $t('sound.add') }}
            </h1>
            <sound-form
                :on-form-submit="createSound"
                :error-in="error"
                :success-in="success"
                :is-loading-in="isLoading"
                :initial-data="null"
            />
        </div>
    </section>
</template>

<script>
import SoundForm from '~/components/form/SoundForm.vue'
import { parseResponseErrorMessage } from '~/api/tools'

export default {
    components: {
        SoundForm
    },
    middleware: 'authenticated',
    data() {
        return {
            error: null,
            success: null,
            isLoading: false
        }
    },
    methods: {
        async createSound(formDataObj) {
            try {
                this.isLoading = true

                const formData = new FormData()

                if (formDataObj.photo) {
                    const { canvas } = formDataObj.photo.croppedImage
                    if (canvas) {
                        const blob = await new Promise((resolve) => canvas.toBlob(resolve))
                        const fileName = `sound_${formDataObj.name}.${blob.type.split('/')[1]}`
                        formData.append('files.photo', blob, fileName)
                    }
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

                const sound = await this.$strapi.create('sounds', formData)

                if (sound) {
                    this.$router.push(`/djs/${sound.dj.slug}/sounds/${sound.id}`)

                    this.$oruga.notification.open({
                        message: this.$t(`${formDataObj.type}.add_success`, [formDataObj.name]),
                        variant: 'success',
                        duration: 7000
                    })
                }
            } catch (e) {
                this.error = parseResponseErrorMessage(e)
            } finally {
                this.isLoading = false
            }
        }
    }
}
</script>
