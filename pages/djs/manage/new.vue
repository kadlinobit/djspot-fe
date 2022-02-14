<template>
    <section class="section">
        <div class="container">
            <h1 class="title">{{ $t('dj.create_profile') }}</h1>
            <dj-form
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
import _ from 'lodash'
import DjForm from '~/components/form/DjForm.vue'

export default {
    name: 'DjNewPage',
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
                const photo = await this.createPhoto(formDataObj)

                const djData = {
                    ...formDataObj,
                    genres: formDataObj.genres
                        ? formDataObj.genres.map((genre) => ({ genre_id: parseInt(genre.id) }))
                        : null,
                    photo: photo?.data?.data?.id ? photo.data.data.id : null,
                    status: 'published'
                }

                const newDj = await this.$axios.post('items/dj', djData)
                await this.$auth.fetchUser()

                this.$router.push(`/djs/${newDj.data.data.slug}`)

                this.$oruga.notification.open({
                    message: this.$t('dj.created_successfully'),
                    variant: 'success',
                    duration: 7000
                })
            } catch (e) {
                this.error = e
            } finally {
                this.isLoading = false
            }
        },
        async createPhoto(formDataObj) {
            let newPhoto = null

            if (!_.isEmpty(formDataObj.photo)) {
                const photoBlob = await this.$media.getCroppedImageBlob(formDataObj.photo)

                if (photoBlob) {
                    const photoMeta = {
                        title: `dj_${formDataObj.slug}`,
                        filename_download: `dj_${formDataObj.slug}`
                        // folder: 'TBD - ADD FOLDER LATER'
                    }

                    newPhoto = await this.$api.file.uploadFile(photoBlob, photoMeta)
                }

                return newPhoto
            }
        }
    }
}
</script>
