<template>
    <section class="section">
        <div class="container">
            <h1 class="title">{{ $t('dj.create_profile') }}</h1>
            <DjForm
                :on-form-submit="createDj"
                :error-in="error"
                :success-in="success"
                :is-loading-in="isLoading"
                :initial-data="null"
            />
        </div>
    </section>
</template>

<script>
import DjForm from '~/components/form/DjForm.vue'
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
            isLoading: false
        }
    },
    methods: {
        async createDj(formDataObj) {
            try {
                this.isLoading = true
                const formData = new FormData()

                if (formDataObj.photo) {
                    const { canvas } = formDataObj.photo.croppedImage
                    if (canvas) {
                        const blob = await new Promise((resolve) => canvas.toBlob(resolve))
                        const fileName = `dj_${formDataObj.slug}_photo.${blob.type.split('/')[1]}`
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

                const dj = await this.$strapi.create('djs', formData)
                await this.$strapi.fetchUser()

                this.$router.push(`/djs/${dj.slug}`)

                this.$oruga.notification.open({
                    message: this.$t('dj.created_successfully'),
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
