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
import _ from 'lodash'
import SoundForm from '~/components/form/SoundForm.vue'

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

                const photo = await this.createPhoto(formDataObj)

                const soundData = {
                    ...formDataObj,
                    dj: this.$auth.user.djs[0].id,
                    genres: formDataObj.genres
                        ? formDataObj.genres.map((genre) => ({ genre_id: parseInt(genre.id) }))
                        : null,
                    photo: photo?.data?.data?.id ? photo.data.data.id : null,
                    status: 'published'
                }

                const newSound = await this.$axios.post('items/sound', soundData)

                if (newSound) {
                    this.$router.push(
                        `/djs/${this.$auth.user.djs[0].slug}/sounds/${newSound.data.data.id}`
                    )

                    this.$oruga.notification.open({
                        message: this.$t(`${formDataObj.type}.add_success`, [formDataObj.name]),
                        variant: 'success',
                        duration: 7000
                    })
                }
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
                        title: `sound_${formDataObj.name}`,
                        filename_download: `sound_${formDataObj.name}`
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
